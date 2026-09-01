import type { GradeRow, GraphExam } from '../../types'

/**
 * GTOP Wintersemester 22/23 ("GTOP_EXAM_22-23_WS.pdf"), Auswertungsbericht vom 30.3.2023
 * (Prof. Dr. Anusch Taraz). German report, so the prompts below are the printed German
 * wording - `language: 'de'`.
 *
 * The report prints its OWN Notenschluessel (86 % -> 1.0 in four-point steps down to
 * 49.001 % -> 4.0), not the standard 95..50 % scheme, so it is spelled out in
 * `WS2223_GRADES` rather than taken from `grades()`.
 *
 * Answer keys:
 *  - Floyd-Warshall, Backtracking, Kruskal and Linear Programming print every numeric key
 *    directly as a "Loesung: ..." line - transcribed verbatim.
 *  - Floyd-Warshall's two red boxes print only "Kantengewicht von Kante (x,y) richtig";
 *    the values 2 and -2 are read off the filled boxes in the report's figure and are
 *    flagged `derived: true`.
 *  - Max-Flow-Min-Cut's residual network prints per-edge "richtig" ticks but no values -
 *    it is an `open` part with the report's solution figure and self-assigned points, like
 *    the WS20/21 exam's equivalent. `val(f') = 14` and the minimal-cut vertex selection
 *    (S-side { s, 1, 2, 5, 6 }) are both from the report (the cut is also the residual
 *    reachability set).
 *  - Tiefensuche and the first Aussagen block print a green/red mark per statement, so the
 *    key follows from the mark once the chosen answer is known - all transcribed, none
 *    derived. In the second and third Aussagen block the candidate skipped every
 *    statement but one ("?", 0.00 P); those keys are re-derived and flagged `derived`.
 *  - Landau is an ordering with the report's own "Ihre Antwort / Loesung" columns.
 *  - Beweispuzzle: the report's two-column table gives the full block order and the
 *    unused ("Nicht genutzt") blocks - transcribed directly.
 *
 * "Beweis (schriftlich)" and "Reduktion (schriftlich)" (10 P each) have NO detail page in
 * this report - they were solved on paper and scored 0.0/10.0. They are kept as `open`
 * parts without a key so the exercise total and the grade table stay correct.
 *
 * Figures are cut from pdfs/gt-ws2223.pdf (git-ignored, not yet present). Their `rect`s in
 * figures.manifest.json are estimated from the report's page images and should be
 * re-measured with `npm run figures -- --inspect` once the PDF is in place.
 */

const WS2223_GRADES: GradeRow[] = [
  { grade: '1.0', percent: 86, points: 86 },
  { grade: '1.3', percent: 82, points: 82 },
  { grade: '1.7', percent: 78, points: 78 },
  { grade: '2.0', percent: 74, points: 74 },
  { grade: '2.3', percent: 70, points: 70 },
  { grade: '2.7', percent: 66, points: 66 },
  { grade: '3.0', percent: 62, points: 62 },
  { grade: '3.3', percent: 58, points: 58 },
  { grade: '3.7', percent: 54, points: 54 },
  // The report prints "49.001 %" / "49.0"; on 100 points the threshold is 49.001.
  { grade: '4.0', percent: 49.001, points: 49.001 },
]

export const GT_WS2223: GraphExam = {
  id: 'gt-ws2223',
  title: 'GTOP Wintersemester 22/23',
  order: 3,
  language: 'de',
  totalPoints: 100,
  grades: WS2223_GRADES,
  note:
    'Eigener Notenschluessel aus dem Bericht (86 % -> 1.0 in Vierer-Schritten bis '
    + '49.001 % -> 4.0), nicht das Standardschema. Der Bericht weist zusaetzlich 5.0 '
    + 'Bonuspunkte (Nachklausur WiSe 22_23) aus; Bonuspunkte zaehlen nur, wenn ohne sie '
    + 'mindestens eine 4.0 erreicht wurde - hier nicht eingerechnet. Fuer "Beweis '
    + '(schriftlich)" und "Reduktion (schriftlich)" enthaelt der Bericht keine Detailseite '
    + '(handschriftlich, je 0.0/10.0) - sie stehen unten als offene Aufgaben ohne '
    + 'Musterloesung.',
  tasks: [
    {
      id: 'max-flow-min-cut',
      title: 'Max-Flow-Min-Cut',
      points: 12,
      prompt:
        'Betrachten Sie den folgenden gerichteten Graphen $N = (V, A, s, t, c)$ mit Kapazitaet '
        + '$c : A \\to \\mathbb{R}_{\\geq 0}$ und Fluss $f$ in $N$. Der Eintrag fuer jede Kante '
        + '$e \\in A$ ist gegeben durch $(f(e)/c(e))$.',
      figure: 'gt-ws2223/mfmc-network',
      parts: [
        {
          kind: 'open',
          id: 'mfmc-residual',
          label: 'Restnetzwerk',
          intro:
            'Bestimmen Sie im folgenden Graphen das Restnetzwerk von $N$. Kanten, welche im '
            + 'Restnetzwerk nicht enthalten sind, sollen dabei den Eintrag 0 erhalten.',
          points: 6.5,
          solutionFigure: 'gt-ws2223/mfmc-residual-solution',
        },
        {
          kind: 'fields',
          id: 'mfmc-value',
          label: '$val(f\') =$',
          intro:
            'Fuehren Sie nun einen Schritt des Ford-Fulkerson Algorithmus durch, um einen neuen '
            + 'Fluss $f\'$ zu erhalten. Bei mehreren Moeglichkeiten waehlen Sie diejenige, welche '
            + 'den Flusswert am meisten erhoeht. Geben Sie den Flusswert von $f\'$ an.',
          pointsPerField: 1.5,
          fields: [{ id: 'val-fp', expected: '14' }],
        },
        {
          kind: 'multi',
          id: 'mfmc-mincut',
          label: 'Minimaler Schnitt: Knotenauswahl',
          intro:
            'Sei nun fuer ein neues Netzwerk das Restnetzwerk eines maximalen Flusses gegeben. '
            + 'Bestimmen Sie den minimalen Schnitt, indem Sie die Knoten auswaehlen, welche im '
            + 'minimalen Schnitt enthalten sind.',
          note: 'Richtige Antwort: 0.5 Punkte, falsche Antwort: -0.5 Punkte, Uebersprungen (?): 0 Punkte.',
          figure: 'gt-ws2223/mfmc-mincut-network',
          pointsPerStatement: 0.5,
          statements: [
            { text: '$s$', answer: true },
            { text: '$1$', answer: true },
            { text: '$2$', answer: true },
            { text: '$3$', answer: false },
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
        'Gegeben sei ein einfacher gerichteter Graph $G_1 = (V_1, E_1, \\ell_1)$ mit '
        + '$\\ell_1 : E_1 \\to \\mathbb{R}$. Weiter sei $d^k_{i,j}$ so wie im Floyd-Warshall '
        + 'Algorithmus definiert.',
      figure: 'gt-ws2223/floyd-warshall',
      parts: [
        {
          kind: 'fields',
          id: 'fw-boxes',
          label: 'Rote Boxen: Kantengewichte (8,3) und (2,7)',
          intro: 'Tragen Sie in die zwei roten Boxen Kantengewichte so ein, dass $d^4_{8,7} = 6$ und $d^7_{1,5} = 7$.',
          note:
            'Im Bericht ist nur "Kantengewicht von Kante (8,3) richtig" bzw. "(2,7) richtig" '
            + 'vermerkt; die Werte 2 bzw. -2 sind aus den ausgefuellten roten Boxen der Abbildung abgelesen.',
          derived: true,
          pointsPerField: 2,
          fields: [
            { id: 'l83', label: '$\\ell_1(8,3) =$', expected: '2' },
            { id: 'l27', label: '$\\ell_1(2,7) =$', expected: '-2' },
          ],
        },
        {
          kind: 'fields',
          id: 'fw-values',
          label: 'Werte $d^k_{i,j}$',
          intro: 'Bestimmen Sie nun die Werte der untenstehenden $d^k_{i,j}$.',
          pointsPerField: 2,
          fields: [
            { id: 'd823', label: '$d^8_{2,3} =$', expected: '4' },
            { id: 'd753', label: '$d^7_{5,3} =$', expected: 'inf' },
          ],
        },
        {
          kind: 'fields',
          id: 'fw-d4',
          label: 'Matrix $D^4$',
          intro:
            'Wir betrachten jetzt einen neuen Graphen $G_2 = (V_2, E_2, \\ell_2)$ mit '
            + '$\\ell_2 : E_2 \\to \\mathbb{R}$ und $|V_2| = 5$. Gegeben sei die Matrix '
            + '$D^3 \\in \\mathbb{Z}^{5 \\times 5}$ mit $D^3 = (d^3_{i,j})_{1 \\leq i,j \\leq 5}$. '
            + 'Bestimmen Sie die folgenden Werte der Matrix $D^4$:',
          display: [
            'D^3 = \\begin{pmatrix}'
            + ' 0 & \\infty & 4 & 10 & 7 \\\\'
            + ' 3 & 0 & 4 & 2 & 10 \\\\'
            + ' \\infty & \\infty & 0 & 6 & \\infty \\\\'
            + ' 2 & \\infty & 6 & 0 & 2 \\\\'
            + ' 2 & -1 & 6 & 1 & 0'
            + ' \\end{pmatrix}',
          ],
          pointsPerField: 2,
          fields: [
            { id: 'd423', label: '$d^4_{2,3} =$', expected: '4' },
            { id: 'd431', label: '$d^4_{3,1} =$', expected: '8' },
          ],
        },
      ],
    },

    {
      id: 'backtracking',
      title: 'Backtracking',
      points: 8,
      prompt:
        'Betrachten Sie den folgenden Graphen. Sie sollen nun den $\\text{TSP-Backtrack}_{MST}$ '
        + 'Algorithmus anwenden. Seien dazu die folgenden partiellen Touren gegeben: '
        + '$P_1 : (5, 4, 2)$, $P_2 : (1, 2, 3)$, $P_3 : (2, 3, 1)$, $P_4 : (2, 1, 5)$.',
      promptExtra: ['Weiterhin habe die bisher kuerzeste gefundene Tour den Wert $\\text{opt } f = 23$.'],
      note:
        'Bestimmen Sie fuer die gegebenen partiellen Touren $B(P_i)$ fuer $i \\in [4]$ und geben Sie '
        + 'an, ob der $\\text{TSP-Backtrack}_{MST}$ Algorithmus die Untersuchung dieser partiellen '
        + 'Tour weiterfuehren wuerde.',
      figure: 'gt-ws2223/backtracking',
      parts: [
        {
          kind: 'fields',
          id: 'bt-p1',
          group: '$P_1 : (5, 4, 2)$',
          label: '$B(P_1) =$',
          pointsPerField: 1,
          fields: [{ id: 'b1', expected: '16' }],
        },
        {
          kind: 'single',
          id: 'bt-continue-p1',
          group: '$P_1 : (5, 4, 2)$',
          points: 1,
          variant: 'inline',
          options: [{ text: 'Nein, bricht ab.' }, { text: 'Ja, bricht nicht ab.' }],
          correct: 1,
        },
        {
          kind: 'fields',
          id: 'bt-p2',
          group: '$P_2 : (1, 2, 3)$',
          label: '$B(P_2) =$',
          pointsPerField: 1,
          fields: [{ id: 'b2', expected: '22' }],
        },
        {
          kind: 'single',
          id: 'bt-continue-p2',
          group: '$P_2 : (1, 2, 3)$',
          points: 1,
          variant: 'inline',
          options: [{ text: 'Nein, bricht ab.' }, { text: 'Ja, bricht nicht ab.' }],
          correct: 1,
        },
        {
          kind: 'fields',
          id: 'bt-p3',
          group: '$P_3 : (2, 3, 1)$',
          label: '$B(P_3) =$',
          pointsPerField: 1,
          fields: [{ id: 'b3', expected: '19' }],
        },
        {
          kind: 'single',
          id: 'bt-continue-p3',
          group: '$P_3 : (2, 3, 1)$',
          points: 1,
          variant: 'inline',
          options: [{ text: 'Nein, bricht ab.' }, { text: 'Ja, bricht nicht ab.' }],
          correct: 1,
        },
        {
          kind: 'fields',
          id: 'bt-p4',
          group: '$P_4 : (2, 1, 5)$',
          label: '$B(P_4) =$',
          pointsPerField: 1,
          fields: [{ id: 'b4', expected: '20' }],
        },
        {
          kind: 'single',
          id: 'bt-continue-p4',
          group: '$P_4 : (2, 1, 5)$',
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
        + 'Kantengewicht $< \\infty$ haben. Sie sollen nun den Kruskal Algorithmus anwenden. '
        + 'Beachten Sie, dass einige Teilaufgaben den Zustand des Algorithmus abfragen, bevor '
        + 'dieser vollstaendig durchlaufen ist.',
      figure: 'gt-ws2223/kruskal',
      parts: [
        {
          kind: 'fields',
          id: 'kruskal-sum6',
          label: 'Summe nach 6 Berechnungsschritten',
          intro:
            'Was ist nach 6 Berechnungsschritten (d.h. nachdem die 6. Kante hinzugefuegt wurde) '
            + 'die Summe der Kantengewichte der Kanten, die bislang hinzugefuegt wurden?',
          pointsPerField: 1,
          fields: [{ id: 'sum6', expected: '24' }],
        },
        {
          kind: 'fields',
          id: 'kruskal-rknoten',
          label: 'R-Knoten nach 7 Berechnungsschritten',
          intro:
            'Bestimmen Sie nachfolgend die repraesentativen Knoten (R-Knoten) nach 7 '
            + 'Berechnungsschritten (d.h. nachdem die 7. Kante hinzugefuegt wurde) und geben Sie die '
            + 'Groesse der zugehoerigen Komponente an. Beachten Sie: Falls bei der Vereinigung '
            + 'zweier Komponenten diese gleich gross sind, wird der Knoten mit der kleineren Nummer '
            + 'repraesentativer Knoten.',
          pointsPerField: 1,
          fields: [
            { id: 'r8', label: 'R-Knoten von Knoten 8:', expected: '5' },
            { id: 'size8', label: 'Groesse der zu Knoten 8 gehoerenden Komponente:', expected: '7' },
            { id: 'r7', label: 'R-Knoten von Knoten 7:', expected: '1' },
            { id: 'size7', label: 'Groesse der zu Knoten 7 gehoerenden Komponente:', expected: '2' },
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
          fields: [{ id: 'total', label: 'Summe der Kantengewichte $=$', expected: '44' }],
        },
      ],
    },

    {
      id: 'tiefensuche',
      title: 'Tiefensuche',
      points: 6,
      prompt: 'Wir starten eine Tiefensuche im folgenden Graphen.',
      figure: 'gt-ws2223/dfs',
      parts: [
        {
          kind: 'multi',
          id: 'dfs-sequences',
          intro:
            'Waehlen Sie nachfolgend aus, ob die Tiefensuche die Knoten in den untenstehenden '
            + 'Knotenfolgen betrachten koennte oder nicht. Der erste Knoten in der Knotenfolge '
            + 'repraesentiert den Startknoten, welcher dem Algorithmus als Input gegeben wird.',
          note: 'Richtige Antwort: 1 Punkt, falsche Antwort: -1 Punkt, Uebersprungen (?): 0 Punkte.',
          pointsPerStatement: 1,
          statements: [
            { text: '$1, 7, 6, 8, 10, 9, 2, 3, 4, 5$', answer: false },
            { text: '$9, 8, 10, 1, 6, 7, 3, 5, 4, 2$', answer: true },
            { text: '$10, 8, 1, 6, 7, 9, 3, 2, 5, 4$', answer: false },
            { text: '$4, 2, 1, 8, 9, 10, 6, 7, 3, 5$', answer: false },
            { text: '$4, 2, 1, 6, 8, 9, 7, 10, 3, 5$', answer: true },
            { text: '$5, 6, 1, 2, 3, 10, 8, 9, 7, 4$', answer: true },
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
        '\\min_{x \\in \\mathbb{R}^2} 9x_1 + 6x_2 \\quad \\text{u.d.N.} \\\\'
        + ' -2x_1 + 3x_2 \\geq 2 \\\\'
        + ' -x_1 + 2x_2 \\geq 2 \\\\'
        + ' x_1 - x_2 \\geq 2 \\\\'
        + ' x \\geq 0',
      ],
      figure: 'gt-ws2223/lp-plot',
      parts: [
        {
          kind: 'fields',
          id: 'lp-vertex',
          label: 'Optimale Ecke',
          intro: 'Geben Sie die optimale Ecke an:',
          pointsPerField: 1,
          layout: 'inline',
          fields: [
            { id: 'x1', label: '$x_1 =$', expected: '8' },
            { id: 'x2', label: '$x_2 =$', expected: '6' },
          ],
        },
        {
          kind: 'single',
          id: 'lp-dual-objective',
          label: 'Kreuzen Sie die korrekte Zielfunktion des dualen Programms an.',
          points: 1,
          options: [
            { text: '$\\max_{y \\in \\mathbb{R}^2} 9y_1 + 6y_2$' },
            { text: '$\\max_{y \\in \\mathbb{R}^3} 2y_1 + 2y_2 + 2y_3$' },
            { text: '$\\min_{y \\in \\mathbb{R}^2} 9y_1 + 6y_2$' },
            { text: '$\\min_{y \\in \\mathbb{R}^3} 2y_1 + 2y_2 + 2y_3$' },
          ],
          correct: 1,
        },
        {
          kind: 'multi',
          id: 'lp-dual-constraints',
          label: 'Kreuzen Sie die Nebenbedingungen an, die im dualen Programm enthalten sind.',
          note:
            'Richtige Antwort: 0.5 Punkte, falsche Antwort: -0.5 Punkte, Uebersprungen (?): 0 Punkte.',
          pointsPerStatement: 0.5,
          statements: [
            { text: '$-2y_1 - y_2 + y_3 \\geq 9$', answer: false },
            { text: '$-2y_1 - y_2 + y_3 \\leq 9$', answer: true },
            { text: '$y \\geq 1$', answer: false },
            { text: '$3y_1 + 2y_2 - y_3 \\geq 6$', answer: false },
            { text: '$3y_1 + 2y_2 - y_3 \\leq 6$', answer: true },
            { text: '$y \\geq 0$', answer: true },
          ],
        },
      ],
    },

    {
      id: 'aussagen',
      title: 'Aussagen',
      points: 15,
      prompt: 'Beantworten Sie die folgenden Fragen. Es koennen mehrere Antwortmoeglichkeiten richtig sein.',
      note: 'Je Aussage: Richtige Antwort 1 Punkt, falsche Antwort -1 Punkt, Uebersprungen (?): 0 Punkte.',
      parts: [
        {
          kind: 'multi',
          id: 'aussagen-matching',
          group: 'Aussagen',
          label: 'Matchings $M$ und $M\'$ in $G$',
          intro: 'Wenn $M$ und $M\'$ zwei Matchings in $G$ sind, dann gilt immer:',
          pointsPerStatement: 1,
          statements: [
            { text: 'Jeder Weg in der symmetrischen Differenz von $M$ und $M\'$ ist ein $M\'$-augmentierender Weg.', answer: false },
            { text: 'Jeder Weg in der symmetrischen Differenz von $M$ und $M\'$ ist ein $M$-augmentierender Weg.', answer: false },
            { text: 'Es existiert immer ein $M$-augmentierender Weg.', answer: false },
            { text: 'Es existiert immer ein $M\'$-augmentierender Weg.', answer: false },
            { text: 'Die symmetrische Differenz von $M$ und $M\'$ besteht aus Kreisen und Wegen.', answer: true },
          ],
        },
        {
          kind: 'multi',
          id: 'aussagen-bfs',
          group: 'Aussagen',
          label: 'Breitensuche im Knoten $v$',
          intro: 'Wir starten im Graphen $G = (V, E)$ eine Breitensuche im Knoten $v \\in V$. Dann gilt immer:',
          note: 'Bis auf Aussage C hat der Kandidat alle Aussagen uebersprungen (0.00 P) - die uebrigen Schluessel sind rekonstruiert.',
          pointsPerStatement: 1,
          statements: [
            {
              text: 'Wenn $x$ und $y$ zwei beliebige benachbarte Knoten sind, dann folgt, dass $\\text{abst}(x) \\geq \\text{abst}(y) + 1$.',
              answer: false,
              derived: true,
            },
            {
              text: 'Sei $z \\neq v$ ein beliebiger Knoten in $G$ und $x$ der von der Breitensuche berechnete Vorgaenger von $z$. Dann gilt: $\\text{abst}(x) = \\text{abst}(z) - 1$.',
              answer: true,
              derived: true,
            },
            { text: 'Alle Knoten in $G$ werden besucht.', answer: false },
            {
              text: 'Alle Knoten in der Zusammenhangskomponente von $v$ werden genau einmal in die Queue aufgenommen.',
              answer: true,
              derived: true,
            },
            {
              text: 'Wenn $z \\in V$ ein beliebiger Knoten ist und $x, y \\in V$ zwei beliebige Nachbarn von $z$ sind mit $x \\neq y$, dann gibt es immer einen Zeitpunkt, bei dem $x$ und $y$ gleichzeitig in der Queue sind.',
              answer: false,
              derived: true,
            },
          ],
        },
        {
          kind: 'multi',
          id: 'aussagen-cutvertex',
          group: 'Aussagen',
          label: 'Schnittknoten $v$',
          intro:
            'Es sei $G = (V, E)$ ein zusammenhaengender Graph mit mindestens drei Knoten und '
            + '$v \\in V$ ein Knoten mit der Eigenschaft, dass $G - v$ nicht zusammenhaengend ist. '
            + 'Dann gilt immer:',
          note: 'Bis auf Aussage E hat der Kandidat alle Aussagen uebersprungen (0.00 P) - die uebrigen Schluessel sind rekonstruiert.',
          pointsPerStatement: 1,
          statements: [
            {
              text: 'Wenn $G$ einen aufspannenden Baum $T$ als Subgraphen hat, dann kann $v$ in $T$ kein Blatt sein.',
              answer: true,
              derived: true,
            },
            {
              text: 'Wenn $G$ einen aufspannenden Baum $T$ als Subgraphen hat, dann muss $v$ in $T$ ein Blatt sein.',
              answer: false,
              derived: true,
            },
            { text: 'Fuer jedes Paar von Knoten $x, y \\in V$ gibt es in $G$ einen $x, y$-Weg.', answer: true, derived: true },
            {
              text: 'Fuer jedes Paar von Knoten $x, y \\in V$ muss jeder $x, y$-Weg in $G$ den Knoten $v$ enthalten.',
              answer: false,
              derived: true,
            },
            { text: '$G$ hat einen aufspannenden Baum $T$ als Subgraphen.', answer: true },
          ],
        },
      ],
    },

    {
      id: 'landau',
      title: 'Landau',
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
            { id: 'a', text: '$\\frac{1}{n^2}$' },
            { id: 'b', text: '$\\frac{1}{n}$' },
            { id: 'c', text: '$\\omega(P_n)$' },
            { id: 'd', text: '$e^{\\frac{\\log(n)}{2}}$' },
            { id: 'e', text: '$|E(C_n)|$' },
            { id: 'f', text: '$2^{\\frac{\\sqrt{n}}{2}}$' },
          ],
          // Smallest first (f above g iff f = O(g)):
          //   1/n^2 < 1/n < omega(P_n)=2 (const) < e^{log(n)/2}=sqrt(n) < |E(C_n)|=n < 2^{sqrt(n)/2}.
          solution: ['a', 'b', 'c', 'd', 'e', 'f'],
        },
      ],
    },

    {
      id: 'beweis',
      title: 'Beweis (schriftlich)',
      points: 10,
      prompt:
        'Schriftlich geloeste Aufgabe. Der Auswertungsbericht enthaelt fuer diese Aufgabe keine '
        + 'Detailseite - nur die erreichte Punktzahl (0.0/10.0).',
      parts: [
        {
          kind: 'open',
          id: 'beweis-open',
          intro: 'Kein Aufgabentext und keine Musterloesung im Bericht abgedruckt.',
          points: 10,
          noKey: true,
        },
      ],
    },

    {
      id: 'reduktion',
      title: 'Reduktion (schriftlich)',
      points: 10,
      prompt:
        'Schriftlich geloeste Aufgabe. Der Auswertungsbericht enthaelt fuer diese Aufgabe keine '
        + 'Detailseite - nur die erreichte Punktzahl (0.0/10.0).',
      parts: [
        {
          kind: 'open',
          id: 'reduktion-open',
          intro: 'Kein Aufgabentext und keine Musterloesung im Bericht abgedruckt.',
          points: 10,
          noKey: true,
        },
      ],
    },

    {
      id: 'beweispuzzle',
      title: 'Beweispuzzle (nur 6 LP)',
      points: 10,
      prompt:
        'Beweisen Sie, dass es in jedem Graphen $G = (V, E)$ zwei Knotenmengen $U, W \\subset V$ '
        + 'mit $V = U \\cup W$ und $U \\cap W = \\emptyset$ gibt, sodass mindestens die Haelfte der '
        + 'Kanten von $G$ zwischen $U$ und $W$ liegen.',
      parts: [
        {
          kind: 'order',
          id: 'beweispuzzle-proof',
          intro:
            'Sortieren Sie die passenden Textbausteine zu einem vollstaendigen Beweis (ein '
            + 'Extremal-Argument ueber einen Schnitt mit maximaler Kantenzahl). Nicht alle '
            + 'Bausteine muessen benutzt werden.',
          points: 10,
          penalty: 1,
          items: [
            { id: 'c1', text: 'Wir waehlen zwei Mengen $U, W \\subset V$ mit $V = U \\cup W$ und $U \\cap W = \\emptyset$ so,' },
            { id: 'c2', text: 'dass die Anzahl der Kanten zwischen $U$ und $W$ maximiert ist.' },
            { id: 'c3', text: 'Dann gilt fuer jeden Knoten $v \\in U$,' },
            { id: 'c4', text: 'dass mindestens die Haelfte seiner Nachbarn in $W$ liegt.' },
            {
              id: 'c5',
              text: 'Andernfalls wuerden zwischen den Mengen $U \\setminus \\{v\\}$ und $W \\cup \\{v\\}$ mehr Kanten als zwischen $U$ und $W$ liegen.',
            },
            { id: 'c6', text: 'Aus dem gleichen Grund gilt fuer jeden Knoten $v \\in W$,' },
            { id: 'c7', text: 'dass mindestens die Haelfte seiner Nachbarn in $U$ liegt.' },
            { id: 'c8', text: 'Damit ist die Anzahl der Kanten zwischen $U$ und $W$ mindestens' },
            { id: 'c9', text: '$\\frac{1}{2} \\sum_{v \\in V} \\frac{\\deg(v)}{2}$.' },
            { id: 'c10', text: 'Nach dem Handshake-Lemma liegen also mindestens $\\frac{|E|}{2}$ Kanten zwischen $U$ und $W$.' },
            { id: 'd1', text: 'Dann bilden $U$ und $W$ jeweils stabile Mengen.' },
            { id: 'd2', text: '$\\sum_{v \\in V} \\frac{\\deg(v)}{2}$.' },
            { id: 'd3', text: 'Nach dem Handshake-Lemma liegen also mindestens $\\frac{|E|}{4}$ Kanten zwischen $U$ und $W$.' },
            {
              id: 'd4',
              text: 'Andernfalls wuerde zwischen den Mengen $U \\cup N(v)$ und $W \\setminus N(v)$ mehr Kanten als zwischen $U$ und $W$ liegen.',
            },
            { id: 'd5', text: 'dass die Anzahl der Kanten zwischen $U$ und $W$ minimiert ist.' },
          ],
          solution: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10'],
        },
      ],
    },
  ],
}
