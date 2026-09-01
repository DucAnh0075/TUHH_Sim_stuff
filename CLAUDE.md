# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`es-exam-trainer` — a React + TypeScript + Vite single-page app that replays five past
Embedded-Systems exams by Prof. Heiko Falk (TUHH), styled to look like the official
"Auswertungsbericht" PDFs. Each exam is 14 exercises; there is also a **Mixed Exam** that
draws one exercise per slot from a random semester. UI text is in German.

## Commands

```bash
npm run dev       # Vite dev server
npm run build     # tsc -b (typecheck, project refs) then vite build
npm run lint      # eslint . (ignores dist/ and attic/)
npm run figures   # rebuild public/figures/ from PDFs in pdfs/ (needs poppler-utils)
```

There is no test runner. Correctness of exam content is verified by eye against the PDFs;
`npm run build` (which runs `tsc -b`) is the main safety net — the tsconfig turns on
`noUnusedLocals`/`noUnusedParameters`/`noFallthroughCasesInSwitch`, so a clean build is
meaningful. Run `npm run lint` before finishing changes.

## Architecture

The app is a state machine held entirely in `ExamApp.tsx` (`src/components/ExamApp.tsx`) —
there is no router, no global store, no backend. A `Session` object holds the chosen `Exam`,
the current task index, and parallel arrays `answers` / `confirmed` / `done`. The whole
session is persisted to `localStorage` on every change (except the Mixed Exam, which is
never saved). Selecting an exam offers to resume stored progress.

Data flow: `src/data/*.ts` (one file per exam + `common.ts` for shared phrasings) →
`EXAMS` array in `src/data/index.ts` → `ExamApp` → `TaskView` dispatches on `task.kind` to
one of five renderers in `src/components/tasks/`.

### The type system is the spine — read `src/types.ts` first

`src/types.ts` defines the data model **and** all scoring/grading logic in one file. Every
exercise is a discriminated union `Task` on `kind`, paired with an `Answer` union on the
same tag:

- `multi` — statements A–J, each true/false/skip (`MultiTask` ↔ `ClozeTask` scoring per item)
- `cloze` — fill-the-gap with a shared word pool (`answer`s + `distractors`)
- `choice` — single choice; options are text or figures; all-or-nothing scoring
- `fields` — free-text inputs; `layout` (`vhdl`/`adc`/`pareto`/`cache`/`single`) controls
  rendering only, `compare` (`exact`/`set`/`number`) controls scoring
- `grid` — Gantt or StateChart raster; **self-graded**: the user reveals the solution image
  and enters their own points (`isSelfGraded`, `selfPoints`)

Key functions all live in `types.ts`: `emptyAnswer`, `isComplete`, `isStarted`,
`scoreTask`, `fieldCorrect`, `gradeFor`, `conversionTable`. When adding a task kind or
changing scoring, this is the file to edit — the renderers and `ExamApp` follow from it.

### Conventions when editing exam data (`src/data/`)

- Enter **only real exam content** from the reports. The README documents the data schema
  in detail; `common.ts` holds recurring phrasings.
- Math between `$...$` is rendered with KaTeX. In TS string literals, backslashes must be
  doubled: `'$WCET_{EST} \\geq WCET$'`.
- Two exams (`ws2122.ts`, `ws2425.ts`) contain a deliberate contradiction in the answer
  keys that mirrors the printed reports — see the comments there; do not "fix" it.
- A `fields` task's total is capped at `task.points` (`Math.min` in `scoreTask`), because
  some reports print more sub-questions than the overview table awards.

### Figures pipeline

Diagrams are cut from the original report PDFs, which are personal and **git-ignored**
(`pdfs/ws2122.pdf` … `pdfs/ws2425.pdf`). Without them the app still runs and `Figure.tsx`
shows a placeholder (it falls back on image `onError`). `figures.manifest.json` maps each
figure id (e.g. `ss2023/statechart`) to a page + `rect` (page fractions) or embedded
`image` index; `scripts/extract-figures.mjs` (`npm run figures`) renders them to
`public/figures/`. Rects are computed, not hand-measured, by
`scripts/calibrate-figures.py` (Python, needs Pillow + numpy) after a PDF changes.

## Notes

- `attic/` is excluded from lint and build; treat it as dead/reference code.
- Styling is Tailwind v4 via `@tailwindcss/vite` (no config file); colors like `#b6d957`
  are chosen to match the report layout.
