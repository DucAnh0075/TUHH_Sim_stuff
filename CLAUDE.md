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

`src/App.tsx` is a module switch: it shows `ModuleSelect` and then mounts one of two
self-contained modules under `src/modules/`. **Each module has its own `types.ts`,
components and data — the two type systems are intentionally separate and share nothing but
tiny presentational copies (`Tex`, `PromptBox`).** Truly global pieces stay at the top:
`components/{ModuleSelect,ThemeToggle}.tsx` and `lib/theme.ts`.

- `src/modules/embedded/` — the Embedded Systems exam trainer (below).
- `src/modules/graph/` — Graph Theory: a flat Multiple Choice pool (`QuizApp`, tasks
  `'multi'`/`'single'`/`'open'`, pool in `data/questions.ts`) **and** a GTOP exam trainer
  (`GraphExamApp`, one screen per exercise, `data/exams/`) — see below.

Paths below are relative to `src/modules/embedded/`.

The embedded app is a state machine held entirely in `components/ExamApp.tsx` — there is no
router, no global store, no backend. A `Session` object holds the chosen `Exam`, the current
task index, and parallel arrays `answers` / `confirmed` / `done`. The whole session is
persisted to `localStorage` on every change (except the Mixed Exam, which is never saved).
Selecting an exam offers to resume stored progress.

Data flow: `data/*.ts` (one file per exam + `common.ts` for shared phrasings) →
`EXAMS` array in `data/index.ts` → `ExamApp` → `TaskView` dispatches on `task.kind` to
one of five renderers in `components/tasks/`.

### The type system is the spine — read `modules/embedded/types.ts` first

`types.ts` defines the data model **and** all scoring/grading logic in one file. Every
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

### Conventions when editing exam data (`modules/embedded/data/`)

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

### Graph Theory exam trainer (`src/modules/graph/`)

`types.ts` has two disjoint halves (see the file's header comment): the Multiple Choice
pool (`Task` = `'multi'` | `'single'` | `'open'`, run by `QuizApp`) and the exam trainer
(`GraphExam` > `ExamTask` > `Part`, run by `GraphExamApp`). They share nothing — a pool
`Task` is always one question; an `ExamTask` is composite, one exam exercise made of
several heterogeneous `Part`s (`fields`/`single`/`multi`/`order`/`open`/`info`), one
screen per exercise, mirroring the printed Auswertungsbericht.

- `emptyExamAnswer`, `isExamComplete`, `isExamSelfGraded`, `scoreExamTask`,
  `validateExam` live in `types.ts` next to the pool's equivalents. `GRADE_STEPS`/
  `conversionTable`/`gradeFor` are **copied**, not imported, from the Embedded module.
- `GraphExamApp` mirrors `embedded/components/ExamApp.tsx` (sidebar, localStorage
  persistence, result view with a Notenschlüssel) but persists under the
  `gt-exam-trainer:*` key prefix (`lib/storage.ts`), never `es-exam-trainer:*`.
- Answer-key policy for a Klausur subtask: printed key → use it; no key printed but
  computable → `derived: true`; no key at all (e.g. the Mock Exam) → an `open` part with
  `noKey: true` and the printed points, never simply omitted (that would shift the
  exercise's total and the grade table).
- Exam figures share `public/figures/` with the Embedded module's, namespaced with a
  `gt-` exam prefix (`gt-ss2023/ff-network`) so the two never collide — see below.
- There is no test runner; `validateExam(exam)` is the safety net for transcription
  errors (point sums, duplicate ids, dangling `order` solution ids) and is printed with
  `console.warn` from `ExamSelect` under `import.meta.env.DEV`.

## Notes

- `attic/` is excluded from lint and build; treat it as dead/reference code.
- Styling is Tailwind v4 via `@tailwindcss/vite` (no config file); colors like `#b6d957`
  are chosen to match the report layout.
- Graph exam PDFs go in `pdfs/` with the `gt-*` names from `figures.manifest.json`
  (`gt-ws2021.pdf`, `gt-ss2021.pdf`, `gt-ss2023.pdf`, `gt-ws2324.pdf`,
  `gt-mock2025.pdf`), same as the Embedded PDFs — one `npm run figures` command builds
  both. `scripts/calibrate-figures.py` only touches the Embedded (non-`gt-`) entries and
  preserves the Graph ones; Graph rects are hand-measured via
  `npm run figures -- --inspect`.
