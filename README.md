# ES/GT Exam Trainer

Klausur-Trainer für zwei TUHH-Module — **Embedded Systems** (Prof. Falk) und **Graphentheorie und Optimierung** (Prof. Taraz) — im Layout der offiziellen Auswertungsberichte.

## Tech Stack

| | |
|---|---|
| Framework | React 19 + TypeScript 6 |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`, kein Config-File) |
| Math | KaTeX |
| Figures | poppler-utils + Node.js (`scripts/extract-figures.mjs`) |
| Persistenz | `localStorage` — kein Backend, kein Router |

## Architecture

```
src/
├── App.tsx                  # Modul-Switch: ModuleSelect → embedded | graph
├── components/              # Global: ModuleSelect, ThemeToggle
├── lib/                     # Global: theme.ts, storage.ts
└── modules/
    ├── embedded/            # ES-Klausur-Trainer
    │   ├── types.ts         # Datenmodell + Scoring-Logik (Spine)
    │   ├── components/      # ExamApp (State Machine), TaskView, 5 Task-Renderer
    │   └── data/            # Eine TS-Datei pro Klausur + common.ts
    └── graph/               # GT-Trainer
        ├── types.ts         # Pool-Task-Union + GraphExam-Hierarchie (2 disjunkte Hälften)
        ├── components/      # QuizApp (MC-Pool), GraphExamApp (Klausur)
        └── data/            # questions.ts + exams/gt-*.ts
```

Beide Module sind vollständig isoliert — getrennte Typen, Komponenten, `localStorage`-Schlüssel (`es-exam-trainer:*` / `gt-exam-trainer:*`). Gemeinsam sind nur `Tex` und `PromptBox` (Kopien, kein Import).

## Embedded Systems Klausuren

| Klausur | Aufgaben | Punkte |
|---|---|---|
| ES Winter Term 2022 | 14 | 85 |
| ES Summer Term 2022 | 14 | 90 |
| ES Summer Term 2023 | 14 | 90 |
| ES Summer Term 2024 | 14 | 88 |
| ES Winter Term 2024/25 | 14 | 90 |
| **Mixed Exam** | 14 | wechselnd |

**Mixed Exam** zieht jeden der 14 Aufgabenslots aus einem zufälligen Semester und berechnet Gesamtpunkte und Notentabelle passend aus.

**Aufgabentypen:** `multi` (A–J Aussagen) · `cloze` (Lückentext) · `choice` (Single Choice) · `fields` (Textfelder; Layouts: `vhdl`/`adc`/`pareto`/`cache`) · `grid` (Gantt/StateChart, selbstbewertet)

## Graph Theory Klausuren

| Klausur | Punkte |
|---|---|
| GTOP WS 20/21 | 100 |
| GTOP SS 2021 | 100 |
| GTOP WS 22/23 | 100 |
| GTOP SS 2023 | 100 |
| GTOP WS 23/24 | 100 |
| GTOP SS 2024 | 100 |
| GTOP SS 2024 (Slot B) | 100 |
| GTOP WS 24/25 | 100 |
| GTOP SS 2025 | 100 |
| GTOP Mock Exam SoSe 2025 | 100 |

Zusätzlich ein flacher **Multiple-Choice-Pool** aus allen Semestern (eine Frage pro Bildschirm).

**Aufgabentypen:** `fields` · `single` · `multi` · `order` (Reihenfolge-Puzzle) · `open` (selbstbewertet, z. B. Beweise) · `info` (Zwischentext ohne Punkte)

## Bewertung

**Automatisch:** Multiple Choice, Cloze, C/E Net, RTC, Petrinets, VHDL, A/D Converter, Pareto, Caches, GT `fields`/`single`/`order`. Textfelder normalisiert verglichen; Kommalisten als Mengen (`A0,A1` == `a1,a0`), Binärausgaben numerisch (`01` == `1`).

**Selbstbewertet:** StateCharts, Scheduling-Gantt, GT `open`-Parts (gezeichnete Lösungen, Beweise). `Confirm` blendet die offizielle Lösung ein, Punkte werden manuell eingetragen.

## Run

```bash
npm install
npm run dev
```

## Figures

Diagramme werden aus den Original-PDFs geschnitten (per `.gitignore` lokal):

```
# Embedded Systems
pdfs/ws2122.pdf   pdfs/ss2022.pdf   pdfs/ss2023.pdf   pdfs/ss2024.pdf   pdfs/ws2425.pdf

# Graph Theory
pdfs/gt-ws2021.pdf   pdfs/gt-ss2021.pdf   pdfs/gt-ws2223.pdf   pdfs/gt-ss2023.pdf
pdfs/gt-ws2324.pdf   pdfs/gt-ss2024.pdf   pdfs/gt-ss2024b.pdf
pdfs/gt-ws2425.pdf   pdfs/gt-ss2025.pdf   pdfs/gt-mock2025.pdf
```

```bash
npm run figures                # baut public/figures/ (braucht poppler-utils)
npm run figures -- --inspect   # legt alle Seiten unter public/figures/_inspect ab
```

`figures.manifest.json` enthält für jede Abbildung Seite + Ausschnitt. ES-Ausschnitte werden per `scripts/calibrate-figures.py` (Pillow + numpy) automatisch berechnet; GT-Ausschnitte werden manuell per `--inspect` gemessen. Ohne PDFs läuft die App normal — an Stelle der Abbildung erscheint ein Platzhalter.

## Bekannter Widerspruch in den Berichten

WS 2022 MC: „$WCET_{EST} \geq WCET$" → **falsch** · WS 2024/25 Cloze: `WCET_EST >= WCET` → **richtig**. Beide Berichte drucken es so — bleibt unverändert (siehe Kommentare in `ws2122.ts` / `ws2425.ts`).
