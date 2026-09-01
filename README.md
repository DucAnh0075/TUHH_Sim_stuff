# ES Exam Trainer

Kompletter Durchlauf der Embedded-Systems-Klausuren von Prof. Dr. Heiko Falk, im Layout der
Auswertungsberichte. Vor dem Start wählt man die Klausur — nach Semestern sortiert — oder den
gemischten Modus.

| Klausur | Aufgaben | Punkte |
| --- | --- | --- |
| ES Winter Term 2022 | 14 | 85 |
| ES Summer Term 2022 | 14 | 90 |
| ES Summer Term 2023 | 14 | 90 |
| ES Summer Term 2024 | 14 | 88 |
| ES Winter Term 2024/2025 | 14 | 90 |
| **Mixed Exam** | 14 | wechselnd |

**Mixed Exam** zieht jeden der 14 Aufgabenslots (Multiple Choice / Cloze, StateCharts, C/E Net,
Petrinets, VHDL, A/D 1+2, Scheduling ×3, Pareto, Real-Time Calculus, Caches 1+2) aus einem zufälligen
Semester und rechnet Gesamtpunkte und Notentabelle passend aus.

Links liegt die vertikale Taskbar: alle Aufgaben mit Nummer und Punkten, verschachtelt die Teilaufgaben
(Pareto, A/D Converter 2). Grau = unangetastet, blau = angefangen, **grün = erledigt**. Oben stehen
Fortschrittsbalken und aktueller Punktestand, unten führt „Ergebnis anzeigen" zur Nachbildung von
Seite 1 des Berichts (Overview, Conversion Table, berechnete Note).

Der Fortschritt jeder Klausur wird im `localStorage` gespeichert und beim nächsten Start angeboten;
das Mixed Exam wird bewusst nicht gespeichert.

## Run

```bash
npm install
npm run dev
```

## Abbildungen aus den PDFs

Die Diagramme (StateCharts-Modelle, C/E-Netze, VHDL-Schaltbilder, A/D-Plots, Pareto-Diagramme,
Arrival Curves und die Gantt-Lösungen) werden aus den Original-PDFs geschnitten. Die fünf Berichte
liegen dafür unter diesen Namen in [`pdfs/`](pdfs/) — sie sind persönliche Auswertungsberichte und
bleiben per `.gitignore` außerhalb von Git:

```
pdfs/ws2122.pdf   pdfs/ss2022.pdf   pdfs/ss2023.pdf   pdfs/ss2024.pdf   pdfs/ws2425.pdf
```

```bash
npm run figures                # baut public/figures/ (74 Abbildungen, braucht poppler-utils)
npm run figures -- --inspect   # legt alle Seiten + eingebettete Bilder unter public/figures/_inspect ab
```

Ohne die PDFs läuft alles ganz normal, an der Stelle der Abbildung steht dann ein Platzhalter.

[`figures.manifest.json`](figures.manifest.json) enthält für jede Abbildung die Seite und den
Ausschnitt. Die Ausschnitte sind **nicht von Hand gemessen**, sondern von
[`scripts/calibrate-figures.py`](scripts/calibrate-figures.py) bestimmt: das Skript rendert jede
Seite, findet die zusammenhängenden Inhaltsblöcke und wählt daraus den richtigen aus (Regeln in
`PLAN`, z. B. „StateCharts-Modell = alles außer dem letzten Block, Lösungstabelle = letzter Block").
Nach einem PDF-Wechsel einmal

```bash
.venv/bin/python3 scripts/calibrate-figures.py   # braucht Pillow + numpy
npm run figures
```

Die Arrival Curves sind echte eingebettete Bilder und werden direkt entnommen (`"image": n` im
Manifest) statt aus der Seite geschnitten.

Der Bericht **Sommer 2024** besteht aus reinen Seitenbildern. Dort sind die C/E-Optionen und die
Real-Time-Calculus-Kurven nicht einzeln herauslösbar; diese beiden Aufgaben zeigen deshalb den
gedruckten Optionsblock als eine Abbildung mit A–F-Knöpfen darunter (`optionsFigure`). Die
Petrinetz-Flussrelation ist dort ebenfalls ein Ausschnitt statt abgetippter Text.

## Bewertung

Automatisch bewertet wird alles, wozu der Bericht einen Schlüssel abdruckt: Multiple Choice und Cloze,
C/E Net und Real-Time Calculus (alles oder nichts), Petrinets, VHDL, beide A/D Converter, Pareto und
beide Cache-Joins. Textfelder werden normalisiert verglichen; Kommalisten gelten als Menge
(`A0,A1,A3` == `a1,a3,a0`), Binärausgaben numerisch (`01` == `1`).

**StateCharts und die drei Scheduling-Aufgaben** haben im Bericht nur eine abgebildete Lösung. Dort
füllt man das Raster aus, `Confirm` blendet die offizielle Lösung als Bild ein, und man trägt seine
Punktzahl selbst ein — sie zählt ganz normal ins Gesamtergebnis.

## Aufgabe ergänzen

Die Klausuren liegen je in einer Datei unter [`src/data/`](src/data/); wiederkehrende Formulierungen
stehen in [`src/data/common.ts`](src/data/common.ts). Nur **echte** Klausuraufgaben eintragen. Es gibt
fünf Aufgabentypen (`kind`):

- `multi` — Aussagen A–J mit `?`/`✓`/`✗`, `answer: true` heißt „die Aussage stimmt"
- `cloze` — Sätze mit `{}` als Lücke, gemeinsamer Wortpool aus `answer`s + `distractors`
- `choice` — Single Choice, Optionen als `text` oder `figure`, `correct` ist der Index
- `fields` — Eingabefelder; `layout` steuert die Darstellung (`vhdl`, `adc`, `pareto`, `cache`, `single`),
  `compare` die Bewertung (`exact`, `set`, `number`)
- `grid` — Raster; `variant: 'gantt'` für die Scheduling-Charts, `'statechart'` für die Zustandstabelle

Mathematik zwischen `$...$` wird mit KaTeX gesetzt; in normalen Strings müssen Backslashes verdoppelt
werden (`'$WCET_{EST} \\geq WCET$'`).

## Bekannter Widerspruch in den Klausuren

Die Multiple-Choice-Aufgabe von **Winter 2022** wertet „A tight WCET estimate means
$WCET_{EST} \geq WCET$" als **falsch**, während der Cloze der Klausur **Winter 2024/25** genau
`WCET_EST >= WCET` als **richtige** Lösung verlangt. Beides steht so in den jeweiligen Berichten und
bleibt deshalb unverändert — siehe die Kommentare in `src/data/ws2122.ts` und `src/data/ws2425.ts`.

## Zweites Modul: Graphentheorie

Neben dem Embedded-Modul enthält die App unter `src/modules/graph/` ein zweites, komplett getrenntes
Modul für die Graphentheorie-und-Optimierung-Klausuren (Prof. Taraz). Es hat zwei Teile:

- **Multiple Choice** — ein flacher Fragenpool (`src/modules/graph/data/questions.ts`), gemischt
  abgefragt, eine Frage pro Bildschirm.
- **Klausuren** — GTOP-Altklausuren als Trainer, eine Aufgabe pro Bildschirm, mit Sidebar,
  gespeichertem Fortschritt und Notenschlüssel wie im Embedded-Modul.

Eine Klausuraufgabe (`ExamTask` in `src/modules/graph/types.ts`) ist zusammengesetzt aus mehreren
`Part`s, weil ein GTOP-Aufgabenblock im Bericht selten nur einen Antworttyp hat:

- `fields` — Zahlen-/Textfelder (Restnetzwerk-Kanten, `d^k_{i,j}`, Kruskal-Werte, …)
- `single` — genau eine richtige Option
- `multi` — Aussagen A–J mit `?`/`✓`/`✗`, negative Bewertung, pro Aufgabenteil auf 0 gedeckelt
- `order` — Bausteine in die richtige Reihenfolge bringen (Landau-Notation, Beweispuzzle, Reduktion,
  Pseudocode), mit Distraktoren und Strafpunkten pro falscher Position
- `open` — selbstbewerteter offener Teil (gezeichnete Lösungen, schriftliche Beweise); `noKey: true`
  markiert einen Teil, zu dem der Bericht gar keine Lösung abdruckt
- `info` — Zwischentext/Formel/Abbildung ohne eigene Punkte

Fehlt ein Antwortschlüssel im Bericht, aber ist er aus Abbildung/Aufgabe eindeutig berechenbar, wird
er berechnet und mit `derived: true` markiert (kleines Badge) — nie einfach weggelassen, weil das die
Aufgabensumme und damit den Notenschlüssel verschieben würde.

Die Klausur-PDFs liegen unter `pdfs/gt-*.pdf` (siehe `figures.manifest.json`) und laufen über
dasselbe `npm run figures` wie die Embedded-Abbildungen, nur mit `gt-`-Präfix im Figure-Namespace.
