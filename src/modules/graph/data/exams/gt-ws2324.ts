import type { GraphExam } from '../../types'
import { grades } from './common'

/**
 * GTOP Wintersemester 2023/2024 ("GTOP_WiSe23-24.pdf"), Auswertungsbericht fuer
 * Matrikelnummer 521699 (erstellt am 21.3.2024), Prof. Dr. Anusch Taraz.
 *
 * German report, so the prompts below are the printed German wording - `language: 'de'`.
 *
 * The printed Notenschluessel is exactly the standard 95..50 % scheme on 100 points, so
 * `grades(100)` reproduces it row for row. Ergebnis im Bericht: 57.0 Punkte, Note 3.7.
 *
 * Answer keys:
 *  - Ford-Fulkerson (residual network + val(f)), Floyd-Warshall, TSP-Backtrack and Kruskal
 *    print every numeric key directly as a "Loesung: ..." line - transcribed verbatim. The
 *    ten residual-network edge values print only per-edge "richtig" ticks; they are read
 *    off the report's solution figure and re-derived from the printed flow.
 *  - Ford-Fulkerson's min-cut subtask prints no key, only +0.5 per vertex and the marked
 *    answers; vertices 4 and t were marked "not in cut" and scored, so the S-side is
 *    { s, 1, 2, 3, 5, 6 }. Flagged `derived: true`.
 *  - Tiefensuche: all six sequences scored the full 1.00 P, but the flattened report text
 *    does not preserve which of "koennte / koennte nicht" was ticked per row. The truth
 *    values below were recomputed on the search graph reconstructed from the page-8 figure
 *    and are flagged `derived: true` - re-check against the PDF.
 *  - Lineare Programmierung: the optimal vertex prints "Loesung: 2." / "Loesung: 3."; the
 *    dual objective prints its green mark (option C). The dual-constraint block prints only
 *    +0.5 per row (all correct) - the true/false pattern below is the standard LP-duality
 *    derivation (see the comment on that part) and matches "all rows correct".
 *  - Aussagen: each block prints a green/red mark plus the points per statement. Where the
 *    candidate skipped a statement ("?", 0.00 P) the key was re-derived mathematically and
 *    is flagged `derived: true`; the block totals (3 + 1 + 0 = 4.0) match the report.
 *  - Landau Notation is an ordering with the report's own "Ihre Antwort / Loesung" columns.
 *  - Beweispuzzle: the report's two-column table gives the full block order and the unused
 *    ("Nicht genutzt") blocks - transcribed directly.
 *
 * "Beweis (schriftlich)" and "Reduktion (schriftlich)" (10 P each) print only
 * "Punktzahl +0.0/10.0" and "Es gibt keine Anmerkungen zu ihrer Antwort" - no official
 * solution. They are kept as `open` parts with a `derived` proof sketch for the self-check
 * so the exercise total and the grade table stay correct.
 *
 * Figures are cut from pdfs/gt-ws2324.pdf (git-ignored, not yet present). Their `rect`s in
 * figures.manifest.json are copied from the analogous gt-ss2023 entries (same exam layout,
 * same examiner) and should be re-measured with `npm run figures -- --inspect` once the
 * PDF is in place.
 */
export const GT_WS2324: GraphExam = {
  id: 'gt-ws2324',
  title: 'GTOP Wintersemester 23/24',
  order: 5,
  language: 'de',
  totalPoints: 100,
  grades: grades(100),
  note:
    'Standard-Notenschluessel (95 % -> 1.0 bis 50 % -> 4.0) wie im Bericht abgedruckt. '
    + 'Ergebnis im Bericht: 57.0 Punkte, Note 3.7. Fuer "Beweis (schriftlich)" und '
    + '"Reduktion (schriftlich)" enthaelt der Bericht keine Musterloesung (handschriftlich, '
    + 'je 0.0/10.0) - sie stehen unten als offene Aufgaben mit rekonstruierter Beweisskizze.',
  tasks: [
    {
      id: 'ford-fulkerson',
      title: 'Ford-Fulkerson',
      points: 12,
      prompt:
        'Betrachten Sie den folgenden gerichteten Graphen $N = (V, A, s, t, c)$ mit Kapazitaet '
        + '$c : A \\to \\mathbb{R}_{\\geq 0}$ und Fluss $f$ in $N$. Der Eintrag fuer jede Kante '
        + '$e \\in A$ ist gegeben durch $(f(e)/c(e))$.',
      figure: 'gt-ws2324/ff-network',
      parts: [
        {
          kind: 'fields',
          id: 'ff-residual',
          label: 'Restnetzwerk',
          intro:
            'Bestimmen Sie im folgenden Graphen das Restnetzwerk von $N$. Kanten, welche im '
            + 'Restnetzwerk nicht enthalten sind, sollen dabei den Eintrag 0 erhalten.',
          note:
            'Im Bericht ist je Kante nur "Kantengewicht von Kante (x,y) richtig" vermerkt; die '
            + 'Werte sind aus der Loesungsabbildung abgelesen bzw. aus dem Fluss nachgerechnet.',
          pointsPerField: 0.5,
          layout: 'inline',
          fields: [
            { id: 'sa', label: '$(s,a) =$', expected: '0' },
            { id: 'as', label: '$(a,s) =$', expected: '4' },
            { id: 'sb', label: '$(s,b) =$', expected: '5' },
            { id: 'bs', label: '$(b,s) =$', expected: '2' },
            { id: 'at', label: '$(a,t) =$', expected: '3' },
            { id: 'ta', label: '$(t,a) =$', expected: '3' },
            { id: 'tb', label: '$(t,b) =$', expected: '3' },
            { id: 'bt', label: '$(b,t) =$', expected: '0' },
            { id: 'ab', label: '$(a,b) =$', expected: '1' },
            { id: 'ba', label: '$(b,a) =$', expected: '3' },
          ],
        },
        {
          kind: 'fields',
          id: 'ff-value',
          label: 'Geben Sie den Flusswert eines optimalen Flusses $f$ an.',
          pointsPerField: 3,
          fields: [{ id: 'val-f', label: '$\\mathrm{val}(f) =$', expected: '9' }],
        },
        {
          kind: 'multi',
          id: 'ff-min-cut',
          label: 'Minimaler Schnitt: Knotenauswahl',
          intro:
            'Sei nun fuer ein neues Netzwerk das Restnetzwerk eines maximalen Flusses gegeben. '
            + 'Bestimmen Sie den minimalen Schnitt, indem Sie die Knoten auswaehlen, welche im '
            + 'minimalen Schnitt enthalten sind.',
          note:
            'Richtige Antwort: 0.5 Punkte, falsche Antwort: -0.5 Punkte, Uebersprungen (?): 0 Punkte. '
            + 'Die Teilaufgabe kann nicht weniger als 0 Punkte bringen.',
          figure: 'gt-ws2324/ff-min-cut',
          derived: true,
          pointsPerStatement: 0.5,
          // No key is printed; each vertex scored +0.5, and 4 / t were marked "nicht im
          // Schnitt", so the S-side is the other six vertices: { s, 1, 2, 3, 5, 6 }.
          statements: [
            { text: '$s$', answer: true },
            { text: '$1$', answer: true },
            { text: '$2$', answer: true },
            { text: '$3$', answer: true },
            { text: '$4$', answer: false },
            { text: '$5$', answer: true },
            { text: '$6$', answer: true },
            { text: '$t$', answer: false },
          ],
        },
      ],
    },

    {
      id: 'floyd-warshall',
      title: 'Floyd-Warshall',
      points: 12,
      prompt:
        'Gegeben sei ein einfacher gerichteter Graph $G_1 = (V_1, E_1, \\ell_1)$, mit '
        + '$\\ell_1 : E_1 \\to \\mathbb{R}$. Weiter sei $d^k_{i,j}$ so wie im Floyd-Warshall '
        + 'Algorithmus definiert.',
      figure: 'gt-ws2324/floyd-warshall',
      parts: [
        {
          kind: 'fields',
          id: 'fw-values',
          label: 'Bestimmen sie nun die Werte der untenstehenden $d^k_{i,j}$.',
          pointsPerField: 2,
          fields: [
            { id: 'd252', label: '$d^2_{5,2} =$', expected: '8' },
            { id: 'd581', label: '$d^5_{8,1} =$', expected: '15' },
            { id: 'd226', label: '$d^2_{2,6} =$', expected: 'inf' },
          ],
        },
        {
          kind: 'fields',
          id: 'fw-d4',
          label: 'Bestimmen Sie die folgenden Werte der Matrix $D^4$:',
          intro:
            'Wir betrachten jetzt einen neuen Graphen $G_2 = (V_2, E_2, \\ell_2)$ mit '
            + '$\\ell_2 : E_2 \\to \\mathbb{R}$ und $|V_2| = 5$. Die Matrix '
            + '$D^k = (d^k_{i,j})_{1 \\leq i,j \\leq n} \\in \\mathbb{Z}^{n \\times n}$ hat allgemein '
            + 'die uebliche Form. Gegeben sei nun die Matrix $D^3 \\in \\mathbb{Z}^{5 \\times 5}$ mit '
            + '$D^3 = (d^3_{i,j})_{1 \\leq i,j \\leq 5}$:',
          display: [
            'D^3 = \\begin{pmatrix}'
            + ' 0 & 5 & \\infty & \\infty & 3 \\\\'
            + ' 4 & 0 & \\infty & \\infty & 7 \\\\'
            + ' \\infty & \\infty & 0 & 4 & \\infty \\\\'
            + ' 8 & 4 & 0 & 0 & 11 \\\\'
            + ' -1 & 4 & 4 & 2 & 0'
            + ' \\end{pmatrix}',
          ],
          pointsPerField: 2,
          fields: [
            { id: 'd421', label: '$d^4_{2,1} =$', expected: '4' },
            { id: 'd453', label: '$d^4_{5,3} =$', expected: '2' },
            { id: 'd413', label: '$d^4_{1,3} =$', expected: 'inf' },
          ],
        },
      ],
    },

    {
      id: 'tsp-backtrack',
      title: 'TSP-Backtrack',
      points: 8,
      prompt:
        'Betrachten Sie den folgenden Graphen. Sie sollen nun den $\\text{TSP-Backtrack}_{MST}$ '
        + 'Algorithmus anwenden. Seien dazu die folgenden partiellen Touren gegeben: '
        + '$P_1 : (5, 2, 3)$, $P_2 : (3, 1, 5)$, $P_3 : (5, 3, 4)$, $P_4 : (2, 4, 3)$.',
      promptExtra: ['Weiterhin habe die bisher kuerzeste gefundene Tour den Wert $\\text{opt } f = 20$.'],
      note:
        'Bestimmen Sie fuer die gegebenen partiellen Touren $B(P_i)$ fuer $i \\in [4]$ und geben Sie '
        + 'an, ob der $\\text{TSP-Backtrack}_{MST}$ Algorithmus die Untersuchung dieser partiellen '
        + 'Tour weiterfuehren wuerde.',
      figure: 'gt-ws2324/tsp-backtrack',
      parts: [
        {
          kind: 'fields',
          id: 'tsp-b1',
          group: 'i)  $P_1 : (5, 2, 3)$',
          label: '$B(P_1) =$',
          pointsPerField: 1,
          fields: [{ id: 'b1', expected: '12' }],
        },
        {
          kind: 'single',
          id: 'tsp-c1',
          group: 'i)  $P_1 : (5, 2, 3)$',
          points: 1,
          variant: 'inline',
          options: [{ text: 'Nein, bricht ab.' }, { text: 'Ja, bricht nicht ab.' }],
          correct: 1,
        },
        {
          kind: 'fields',
          id: 'tsp-b2',
          group: 'ii)  $P_2 : (3, 1, 5)$',
          label: '$B(P_2) =$',
          pointsPerField: 1,
          fields: [{ id: 'b2', expected: '11' }],
        },
        {
          kind: 'single',
          id: 'tsp-c2',
          group: 'ii)  $P_2 : (3, 1, 5)$',
          points: 1,
          variant: 'inline',
          options: [{ text: 'Nein, bricht ab.' }, { text: 'Ja, bricht nicht ab.' }],
          correct: 1,
        },
        {
          kind: 'fields',
          id: 'tsp-b3',
          group: 'iii)  $P_3 : (5, 3, 4)$',
          label: '$B(P_3) =$',
          pointsPerField: 1,
          fields: [{ id: 'b3', expected: '21' }],
        },
        {
          kind: 'single',
          id: 'tsp-c3',
          group: 'iii)  $P_3 : (5, 3, 4)$',
          points: 1,
          variant: 'inline',
          options: [{ text: 'Nein, bricht ab.' }, { text: 'Ja, bricht nicht ab.' }],
          correct: 0,
        },
        {
          kind: 'fields',
          id: 'tsp-b4',
          group: 'iv)  $P_4 : (2, 4, 3)$',
          label: '$B(P_4) =$',
          pointsPerField: 1,
          fields: [{ id: 'b4', expected: '11' }],
        },
        {
          kind: 'single',
          id: 'tsp-c4',
          group: 'iv)  $P_4 : (2, 4, 3)$',
          points: 1,
          variant: 'inline',
          options: [{ text: 'Nein, bricht ab.' }, { text: 'Ja, bricht nicht ab.' }],
          correct: 1,
        },
      ],
    },

    {
      id: 'kruskal',
      title: 'Kruskal',
      points: 6,
      prompt:
        'Betrachten Sie den folgenden Graphen, bei dem die Kanten eingezeichnet sind, die ein '
        + 'Kantengewicht $< \\infty$ haben.',
      promptExtra: [
        'Sie sollen nun den Kruskal Algorithmus anwenden. Beachten Sie, dass einige Teilaufgaben '
        + 'den Zustand des Algorithmus abfragen, bevor dieser vollstaendig durchlaufen ist.',
      ],
      figure: 'gt-ws2324/kruskal',
      parts: [
        {
          kind: 'fields',
          id: 'kruskal-sum6',
          label: 'Summe nach 6 Berechnungsschritten',
          intro:
            'Was ist nach 6 Berechnungsschritten (d.h. nachdem die 6. Kante hinzugefuegt wurde) '
            + 'die Summe der Kantengewichte der Kanten, die bislang hinzugefuegt wurden?',
          pointsPerField: 1,
          fields: [{ id: 'sum6', expected: '30' }],
        },
        {
          kind: 'fields',
          id: 'kruskal-rknoten',
          label: 'R-Knoten nach 6 Berechnungsschritten',
          intro:
            'Bestimmen Sie nachfolgend die repraesentativen Knoten (R-Knoten) nach 6 '
            + 'Berechnungsschritten (d.h. nachdem die 6. Kante hinzugefuegt wurde) und geben Sie die '
            + 'Groesse der zugehoerigen Komponente an. Beachten Sie: Falls bei der Vereinigung '
            + 'zweier Komponenten diese gleich gross sind, wird der Knoten mit der kleineren Nummer '
            + 'repraesentativer Knoten.',
          pointsPerField: 1,
          fields: [
            { id: 'r7', label: 'R-Knoten von Knoten 7:', expected: '7' },
            { id: 'size7', label: 'Groesse der zu Knoten 7 gehoerenden Komponente:', expected: '1' },
            { id: 'r3', label: 'R-Knoten von Knoten 3:', expected: '2' },
            { id: 'size3', label: 'Groesse der zu Knoten 3 gehoerenden Komponente:', expected: '4' },
          ],
        },
        {
          kind: 'fields',
          id: 'kruskal-total',
          label: 'Summe der Kanten des Spannbaums',
          intro:
            'Fuehren Sie nun den Algorithmus von Kruskal bis zum Schluss aus und geben Sie die '
            + 'Summe der Kanten des Spannbaums an.',
          pointsPerField: 1,
          fields: [{ id: 'total', label: 'Summe der Kantengewichte $=$', expected: '63' }],
        },
      ],
    },

    {
      id: 'tiefensuche',
      title: 'Tiefensuche',
      points: 6,
      prompt: 'Wir starten eine Tiefensuche im folgenden Graphen:',
      promptExtra: [
        'Waehlen Sie nachfolgend aus, ob die Tiefensuche die Knoten in den untenstehenden '
        + 'Knotenfolgen als bekannt markieren koennte oder nicht. Der erste Knoten in der '
        + 'Knotenfolge repraesentiert den Startknoten, welcher dem Algorithmus als Input gegeben wird.',
      ],
      note: 'Richtige Antwort: 1 Punkt, falsche Antwort: -1 Punkt, Uebersprungen (?): 0 Punkte.',
      figure: 'gt-ws2324/dfs',
      parts: [
        {
          kind: 'multi',
          id: 'dfs-sequences',
          note:
            'Alle sechs Zeilen erhielten im Bericht die vollen 1.00 P; welche Antwort '
            + '("koennte / koennte nicht") angekreuzt war, geht aus dem Text-Auszug nicht hervor. '
            + 'Die Wahrheitswerte unten sind auf dem aus der Abbildung rekonstruierten Suchgraphen '
            + 'nachgerechnet - bitte gegen das Original-PDF pruefen.',
          derived: true,
          pointsPerStatement: 1,
          statements: [
            { text: '$9, 6, 10, 5, 8, 7, 3, 2, 4, 1$', answer: false, derived: true },
            { text: '$5, 7, 8, 10, 6, 4, 2, 1, 3, 9$', answer: true, derived: true },
            { text: '$10, 8, 5, 7, 9, 3, 2, 1, 4, 6$', answer: true, derived: true },
            { text: '$5, 10, 8, 7, 9, 6, 4, 2, 3, 1$', answer: false, derived: true },
            { text: '$4, 6, 10, 5, 8, 7, 9, 3, 2, 1$', answer: true, derived: true },
            { text: '$4, 1, 3, 2, 9, 6, 10, 8, 7, 5$', answer: false, derived: true },
          ],
        },
      ],
    },

    {
      id: 'lineare-programmierung',
      title: 'Lineare Programmierung',
      points: 6,
      prompt: 'Betrachten Sie das folgende Lineare Programm:',
      display: [
        '\\min_{x \\in \\mathbb{R}^2} \\; -3x_1 - x_2 \\quad \\text{u.d.N.} \\\\[4pt]'
        + ' -6x_1 + 7x_2 \\geq 1 \\\\'
        + ' 2x_1 - x_2 \\leq 1 \\\\'
        + ' -2x_1 + 3x_2 \\leq 5 \\\\'
        + ' x_1, x_2 \\geq 0',
      ],
      promptExtra: ['Hier sehen Sie als Hilfestellung eine entsprechende Zeichnung:'],
      figure: 'gt-ws2324/lp-plot',
      parts: [
        {
          kind: 'fields',
          id: 'lp-vertex',
          label: 'Geben Sie die optimale Ecke an:',
          pointsPerField: 1,
          layout: 'inline',
          fields: [
            { id: 'x1', label: '$x_1 =$', expected: '2' },
            { id: 'x2', label: '$x_2 =$', expected: '3' },
          ],
        },
        {
          kind: 'single',
          id: 'lp-dual-objective',
          label: 'Kreuzen Sie die korrekte Zielfunktion des dualen Programms an.',
          points: 1,
          options: [
            { text: '$\\max_{y \\in \\mathbb{R}^3} y_1 + y_2 + 5y_3$' },
            { text: '$\\max_{y \\in \\mathbb{R}^2} -3y_1 - y_2$' },
            { text: '$\\max_{y \\in \\mathbb{R}^3} y_1 - y_2 - 5y_3$' },
            { text: '$\\max_{y \\in \\mathbb{R}^2} 3y_1 + y_2$' },
          ],
          correct: 2,
        },
        {
          kind: 'multi',
          id: 'lp-dual-constraints',
          label: 'Kreuzen Sie die Nebenbedingungen an, die im dualen Programm enthalten sind.',
          note:
            'Richtige Antwort: 0.5 Punkte, falsche Antwort: -0.5 Punkte, Uebersprungen (?): 0 Punkte. '
            + 'Die Teilaufgabe kann nicht weniger als 0 Punkte bringen.',
          pointsPerStatement: 0.5,
          // Primal in ">= form": min c^T x, A'x >= b', x >= 0 with
          //   A' = [[-6,7],[-2,1],[2,-3]], b' = (1,-1,-5), c = (-3,-1).
          // Dual: max b'^T y = y1 - y2 - 5y3, A'^T y <= c, y >= 0:
          //   row x1: -6y1 - 2y2 + 2y3 <= -3   (option D)
          //   row x2:  7y1 +  y2 - 3y3 <= -1   (option E)
          //   plus y >= 0                       (option B)
          statements: [
            { text: '$-6y_1 + 2y_2 - 2y_3 \\leq -3$', answer: false },
            { text: '$y_1, y_2, y_3 \\geq 0$', answer: true },
            { text: '$y_1, y_2, y_3 \\geq 1$', answer: false },
            { text: '$-6y_1 - 2y_2 + 2y_3 \\leq -3$', answer: true },
            { text: '$7y_1 + y_2 - 3y_3 \\leq -1$', answer: true },
            { text: '$7y_1 - y_2 + 3y_3 \\leq -1$', answer: false },
          ],
        },
      ],
    },

    {
      id: 'aussagen',
      title: 'Aussagen',
      points: 15,
      prompt: 'Beantworten Sie die folgenden Fragen. Es koennen mehrere Antwortmoeglichkeiten richtig sein.',
      note:
        'Je Aussage: Richtige Antwort 1 Punkt, falsche Antwort -1 Punkt, Uebersprungen (?): 0 Punkte. '
        + 'Ein Block kann nicht weniger als 0 Punkte bringen. Uebersprungene Aussagen ("?", 0.00 P) '
        + 'wurden mathematisch nachgerechnet und sind `derived`.',
      parts: [
        {
          kind: 'multi',
          id: 'aussagen-hamilton',
          group: 'Aussagen',
          label: 'Kreis durch alle Knoten',
          intro: 'Sei $G$ ein Graph mit einem Kreis, der jeden Knoten von $G$ enthaelt. Dann muss gelten:',
          pointsPerStatement: 1,
          statements: [
            {
              text: 'Wenn $G$ bipartit ist, dann muss $G$ eine gerade Anzahl von Knoten haben.',
              answer: true,
              derived: true,
            },
            { text: '$G$ muss eine gerade Anzahl von Knoten haben.', answer: false },
            { text: 'Alle Knoten von $G$ haben einen geraden Grad.', answer: false, derived: true },
            { text: 'Alle Knoten von $G$ haben mindestens Grad 2.', answer: true },
            { text: '$G$ ist bipartit.', answer: false },
          ],
        },
        {
          kind: 'multi',
          id: 'aussagen-chi3',
          group: 'Aussagen',
          label: 'Graph mit $\\chi(G) = 3$',
          intro: 'Sei $G = (V, E)$ ein Graph mit $\\chi(G) = 3$. Dann muss gelten:',
          pointsPerStatement: 1,
          statements: [
            { text: '$G$ muss einen Kreis ungerader Laenge enthalten.', answer: true },
            { text: '$\\omega(G) < 3$.', answer: false },
            { text: '$|V| \\leq 3$.', answer: false },
            { text: '$|V| \\geq 3$.', answer: true },
            { text: '$\\omega(G) \\geq 3$.', answer: false },
          ],
        },
        {
          kind: 'multi',
          id: 'aussagen-baum',
          group: 'Aussagen',
          label: 'Baum mit Maximalgrad $t \\geq 3$',
          intro:
            'Sei $G = (V, E)$ ein Baum auf $n \\geq 5$ Knoten mit Maximalgrad $t \\geq 3$. '
            + 'Dann muss gelten:',
          pointsPerStatement: 1,
          statements: [
            {
              text:
                'Fuer alle $x, y \\in V$ mit $x \\neq y$ und $\\{x, y\\} \\notin E$ gilt: '
                + '$G\' := (V, E \\cup \\{\\{x, y\\}\\})$ hat einen Kreis.',
              answer: true,
            },
            { text: '$G$ hat mindestens $t$ Blaetter.', answer: true },
            { text: 'Jeder induzierte Subgraph von $G$ ist kreisfrei.', answer: true },
            { text: 'Jeder induzierte Subgraph von $G$ ist zusammenhaengend.', answer: false },
            { text: 'Das groesste Matching von $G$ ueberdeckt mindestens $n - t$ Knoten.', answer: false },
          ],
        },
      ],
    },

    {
      id: 'landau',
      title: 'Landau Notation',
      points: 5,
      prompt:
        'Sortieren Sie die Funktionen so, dass $f(n)$ genau dann oberhalb von $g(n)$ steht, wenn '
        + '$f(n) = \\mathcal{O}(g(n))$ ist.',
      promptExtra: ['Alle Logarithmen sind zur Basis $e = 2.71828\\ldots$'],
      parts: [
        {
          kind: 'order',
          id: 'landau-order',
          points: 5,
          penalty: 0.5,
          items: [
            { id: 'a', text: '$\\left(\\tfrac{1}{2}\\right)^n$' },
            { id: 'b', text: '$\\chi(K_{n,n})$' },
            { id: 'c', text: '$\\dfrac{n^{2.1}}{\\log(n)^{100}}$' },
            { id: 'd', text: '$\\dfrac{20^{24}}{n^{0.2}} \\cdot n^{2.1}$' },
            { id: 'e', text: '$|E(K_{n,n})|$' },
            { id: 'f', text: '$2^n$' },
          ],
          // Slowest first (f above g iff f = O(g)):
          //   (1/2)^n -> 0  <  chi(K_{n,n}) = 2 (const)  <  20^24 * n^1.9  <  |E(K_{n,n})| = n^2
          //   <  n^2.1 / (ln n)^100  <  2^n.
          solution: ['a', 'b', 'd', 'e', 'c', 'f'],
        },
      ],
    },

    {
      id: 'beweis',
      title: 'Beweis (schriftlich)',
      points: 10,
      prompt:
        'Sei $T = (V, E)$ ein Baum mit $|V| \\geq 3$, in dem jeder Knoten Grad 1 oder Grad 3 hat. '
        + 'Zeigen Sie, dass ein Knoten existiert, der adjazent zu mindestens zwei Blaettern ist.',
      promptExtra: ['Loesen Sie diese Aufgabe bitte auf dem Papier.'],
      parts: [
        {
          kind: 'open',
          id: 'beweis-two-leaves',
          points: 10,
          derived: true,
          solution:
            'Der Bericht druckt keine Musterloesung ab (nur "Punktzahl +0.0/10.0"). Beweisskizze:\n'
            + 'Da $|V| \\geq 3$ und $T$ ein Baum ist, besitzt $T$ mindestens einen inneren Knoten; '
            + 'jeder innere Knoten hat nach Voraussetzung Grad 3.\n'
            + 'Sei $P = (v_0, v_1, \\ldots, v_k)$ ein laengster Weg in $T$. Dann sind $v_0$ und $v_k$ '
            + 'Blaetter: haette $v_0$ einen Nachbarn ausserhalb von $P$, liesse sich $P$ verlaengern; '
            + 'ein Nachbar auf $P$ erzeugte einen Kreis.\n'
            + 'Wegen $|V| \\geq 3$ ist $k \\geq 2$, also ist $v_1$ ein innerer Knoten mit Grad 3. '
            + 'Seine drei Nachbarn sind $v_0$, $v_2$ und ein weiterer Knoten $w$.\n'
            + 'Waere $w$ auf $P$, entstuende ein Kreis; also $w \\notin P$. Haette $w$ noch einen von '
            + '$v_1$ verschiedenen Nachbarn $u$, so waere $(v_k, \\ldots, v_1, w, u)$ ein Weg der '
            + 'Laenge $k + 1 > k$ - Widerspruch zur Maximalitaet von $P$. Also ist $w$ ein Blatt.\n'
            + 'Damit ist $v_1$ adjazent zu den zwei Blaettern $v_0$ und $w$.',
        },
      ],
    },

    {
      id: 'reduktion',
      title: 'Reduktion (schriftlich)',
      points: 10,
      prompt:
        'Das Entscheidungsproblem $3\\text{-COL}$ lautet: Gegeben ein Graph $G$, ist $G$ '
        + '$3$-faerbbar? Das Entscheidungsproblem $3\\text{-COL}^*$ lautet: Gegeben ein Graph $G$ '
        + 'mit Minimalgrad 7, ist $G$ $3$-faerbbar? Zeigen Sie '
        + '$3\\text{-COL} \\leq_p 3\\text{-COL}^*$.',
      promptExtra: ['Loesen Sie diese Aufgabe bitte schriftlich auf dem Papier.'],
      parts: [
        {
          kind: 'open',
          id: 'reduktion-mindegree',
          points: 10,
          derived: true,
          solution:
            'Der Bericht druckt keine Musterloesung ab (nur "Punktzahl +0.0/10.0"). Skizze:\n'
            + 'Zu einer $3\\text{-COL}$-Instanz $G = (V, E)$ konstruiere in Polynomialzeit einen '
            + 'Graphen $G^*$ mit Minimalgrad $\\geq 7$, der genau dann $3$-faerbbar ist, wenn $G$ es ist.\n'
            + 'Konstruktion: uebernimm $G$. Fuege fuer jeden Knoten $v \\in V$ sieben neue Knoten '
            + '$s^1_v, \\ldots, s^7_v$ hinzu und verbinde jeden mit $v$ (das hebt $\\deg(v)$ auf '
            + '$\\geq 7$). Fuege ausserdem pro $v$ eine Kopie $B_v$ des vollstaendig bipartiten '
            + 'Graphen $K_{7,7}$ hinzu und verbinde jeden $s^i_v$ mit allen 14 Knoten von $B_v$.\n'
            + 'Grade: jeder $s^i_v$ hat Grad $1 + 14 = 15$; jeder Knoten von $B_v$ hat Grad '
            + '$7 + 7 = 14$; jeder $v \\in V$ hat Grad $\\geq 7$. Also $\\delta(G^*) \\geq 7$, und '
            + '$|V(G^*)|$ sowie $|E(G^*)|$ sind linear in $|V| + |E|$.\n'
            + 'Korrektheit: ist $G^*$ $3$-faerbbar, so ist die Einschraenkung auf $V$ eine '
            + '$3$-Faerbung von $G$. Ist umgekehrt $c : V \\to \\{1, 2, 3\\}$ eine $3$-Faerbung von '
            + '$G$, so faerbe fuer jedes $v$ alle $s^i_v$ mit einer festen Farbe $\\neq c(v)$; dann '
            + 'meidet $B_v$ nur diese eine Farbe und laesst sich als $K_{7,7}$ (bipartit) mit den '
            + 'uebrigen zwei Farben korrekt faerben. Also ist $G^*$ $3$-faerbbar.\n'
            + 'Damit gilt $3\\text{-COL} \\leq_p 3\\text{-COL}^*$.',
        },
      ],
    },

    {
      id: 'beweispuzzle',
      title: 'Beweispuzzle',
      points: 10,
      prompt:
        'Sei $G = (V, E)$ ein Graph mit $|V| = n$ und $|E| = m$ und $\\deg(x)$ beschreibe den Grad '
        + 'von $x$ in $G$. Zeigen Sie: Wenn $G$ keinen $C_3$ als Subgraphen enthaelt, gilt '
        + 'folgendes: $m \\leq \\frac{n^2}{4}$.',
      promptExtra: [
        'Sie koennen dafuer einige der Textbausteine von der rechten Seite auf die linke Seite '
        + 'ziehen und sortieren. Nicht alle Textbausteine muessen benutzt werden. Nutzen Sie nur '
        + 'notwendige Bausteine.',
      ],
      parts: [
        {
          kind: 'order',
          id: 'beweispuzzle-mantel',
          intro:
            'Sortieren Sie die passenden Textbausteine zu einem vollstaendigen Beweis (Induktion '
            + 'ueber $n$, in der zwei adjazente Knoten $x, y$ entfernt werden).',
          points: 10,
          penalty: 1,
          items: [
            { id: 's1', text: 'Wir beweisen die Aussage per Induktion ueber $n$.' },
            { id: 's2', text: 'Fuer $n = 1$ und $n = 2$ ist die Aussage trivial.' },
            {
              id: 's3',
              text:
                'Nehme an, die Aussage gelte fuer alle Graphen $G\' = (V\', E\')$ mit '
                + '$|V\'| \\leq n - 1$ und sei $G = (V, E)$ ein Graph mit $n$ Knoten ohne $C_3$ als '
                + 'Subgraph.',
            },
            { id: 's4', text: 'Seien $x$ und $y$ adjazente Knoten in $G$.' },
            {
              id: 's5',
              text:
                'Sei $H = G[W] = (W, E_H)$ der von $W = V \\setminus \\{x, y\\}$ induzierte Graph '
                + 'mit $n - 2$ Knoten.',
            },
            {
              id: 's6',
              text:
                'Da nach Annahme jeder Knoten in $G$ hoechstens zu einem der beiden Knoten $x$ und '
                + '$y$ adjazent ist,',
            },
            { id: 's7', text: 'gilt $\\deg(x) + \\deg(y) \\leq n$,' },
            { id: 's8', text: 'wodurch $|E \\setminus E_H| \\leq n - 1$ folgt.' },
            {
              id: 's9',
              text:
                'Da $H$ nach Annahme keinen $C_3$ enthaelt, enthaelt $H$ nach der '
                + 'Induktionshypothese hoechstens $\\frac{(n-2)^2}{4}$ Kanten.',
            },
            {
              id: 's10',
              text:
                'Die Anzahl der Kanten in $G$ laesst sich also abschaetzen durch '
                + '$|E| \\leq \\frac{(n-2)^2}{4} + n - 1 = \\frac{n^2}{4}$.',
            },
            {
              id: 'd1',
              text:
                'Da $H$ nach Annahme keinen $C_3$ enthaelt, enthaelt $H$ nach der '
                + 'Induktionshypothese hoechstens $\\frac{(n-1)^2}{4}$ Kanten.',
            },
            {
              id: 'd2',
              text:
                'Die Anzahl der Kanten in $G$ laesst sich also abschaetzen durch '
                + '$|E| \\leq \\frac{(n-2)^2}{4} + \\frac{n}{2} \\leq \\frac{n^2}{4}$.',
            },
            { id: 'd3', text: 'wodurch $|E \\setminus E_H| \\leq \\frac{n}{2}$ folgt.' },
            { id: 'd4', text: 'gilt $\\deg(x) + \\deg(y) \\leq n - 2$,' },
            {
              id: 'd5',
              text:
                'Da nach Annahme kein $C_3$ in $G$ als Subgraph existiert, kann $x$ zu hoechstens '
                + '$\\frac{n}{2}$ Knoten adjazent sein,',
            },
            { id: 'd6', text: 'Fuer $n = 1$ ist die Aussage trivial.' },
            {
              id: 'd7',
              text:
                'Sei $H = G[W] = (W, E_H)$ der von $W = V \\setminus \\{x\\}$ induzierte Graph mit '
                + '$n - 1$ Knoten.',
            },
          ],
          solution: ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10'],
        },
      ],
    },
  ],
}
