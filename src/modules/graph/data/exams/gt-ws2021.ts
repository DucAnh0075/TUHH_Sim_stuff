import type { GraphExam } from '../../types'
import { grades, UNRELIABLE_EXTRACTION_NOTE } from './common'

/**
 * GTOP Wintersemester 2020/21 ("GTOP-Exam-WS20_21.pdf"), Auswertungsbericht vom 31.3.2021.
 * No Notenschlüssel page is printed in this report - `grades()` uses the standard scheme.
 *
 * Transcribed and cross-checked against pdfs/gt-ws2021.pdf (page-by-page `pdftotext
 * -layout` extraction, since the whole-document dump interleaves the report's two-column
 * "Ihre Antwort / Lösung" tables in a way that reads correctly page-by-page but not
 * concatenated). Every `order` part's `solution` and every `fields`/`single`/`multi`
 * answer below is read directly off the report, not guessed.
 *
 * The one remaining exception is the SAT exercise: the formula's negation-bar placement
 * (how many "¯" strokes each printed line carries, and over which sub-expression) doesn't
 * survive text extraction unambiguously even page-by-page, so it stays an `open`/`noKey`
 * part with the best-effort formula transcription shown and a note saying so - see
 * UNRELIABLE_EXTRACTION_NOTE. Two further `open` parts (Floyd-Warshall's two "red box"
 * edge weights, Max-Flow-Min-Cut's drawn flow/cut) are open because the report genuinely
 * prints no text-form key for them, only a diagram - `noKey` for the red boxes,
 * `solutionFigure: 'gt-ws2021/max-flow-min-cut-solution'` for the flow/cut (both figures
 * extracted from pdfs/gt-ws2021.pdf, rects measured by hand via `npm run figures --
 * --inspect`).
 */
export const GT_WS2021: GraphExam = {
  id: 'gt-ws2021',
  title: 'GTOP Wintersemester 2020/21',
  order: 1,
  language: 'de',
  totalPoints: 86,
  grades: grades(86),
  note: 'Kein Notenschlüssel im Original-Bericht abgedruckt - Standardschema (50 % bis 95 %) verwendet.',
  tasks: [
    {
      id: 'floyd-warshall',
      title: 'Floyd Warshall',
      points: 10,
      prompt:
        'In dieser Aufgabe sei $d^k_{i,j}$ so definiert, wie im Floyd-Warshall Algorithmus. Betrachten Sie den folgenden Graphen.',
      figure: 'gt-ws2021/floyd-warshall',
      parts: [
        {
          kind: 'open',
          id: 'floyd-warshall-boxes',
          label: 'Rote Boxen: Kantengewichte (1,4) und (3,1)',
          intro:
            'Tragen Sie in die zwei roten Boxen Kantengewichte so ein, dass $d^6_{8,2} = 10$ und $d^5_{1,3} = 10$ gilt.',
          points: 4,
          noKey: true,
          note: UNRELIABLE_EXTRACTION_NOTE,
        },
        {
          kind: 'fields',
          id: 'floyd-warshall-values',
          label: 'Werte',
          pointsPerField: 2,
          fields: [
            { id: 'd813', label: '$d^8_{1,3} =$', expected: '5' },
            { id: 'd752', label: '$d^7_{5,2} =$', expected: '15' },
            { id: 'd512', label: '$d^5_{1,2} =$', expected: 'inf' },
          ],
        },
      ],
    },

    {
      id: 'max-flow-min-cut',
      title: 'Max-Flow-Min-Cut',
      points: 12,
      prompt:
        'Betrachten Sie folgendes Netzwerk $N = (V, A, s, t, c)$, in dem die Kapazitäten der Kanten in den roten Kästen angegeben sind.',
      promptExtra: [
        'Geben Sie einen Fluss maximalen Wertes an, indem Sie die blauen Felder ausfüllen. Geben Sie außerdem einen minimalen Schnitt an, indem Sie alle Knoten, die im Schnitt enthalten sind, rot markieren. Geben Sie auch den Wert Ihres Flusses an.',
      ],
      figure: 'gt-ws2021/max-flow-min-cut',
      parts: [
        {
          kind: 'open',
          id: 'mfmc-flow',
          label: 'Fluss und minimaler Schnitt',
          intro: 'Zeichnen Sie einen Fluss maximalen Wertes sowie einen minimalen Schnitt ein.',
          points: 11,
          solutionFigure: 'gt-ws2021/max-flow-min-cut-solution',
        },
        {
          kind: 'fields',
          id: 'mfmc-value',
          label: '$val(f) =$',
          pointsPerField: 1,
          fields: [{ id: 'val-f', expected: '17' }],
        },
      ],
    },

    {
      id: 'simplex',
      title: 'Simplex',
      points: 10,
      prompt: 'Betrachten Sie das folgende Lineare Programm:',
      display: [
        '\\max_{x \\in \\mathbb{R}^2} -x_1 + 3x_2 \\quad \\text{u.d.N.} \\\\ -x_1 + 2x_2 \\leq 2 \\\\ 2x_1 - x_2 \\geq 2 \\\\ x_2 \\leq 4 \\\\ x \\geq 0',
      ],
      figure: 'gt-ws2021/simplex-sketch',
      parts: [
        {
          kind: 'fields',
          id: 'simplex-vertex',
          label: 'Optimale Ecke',
          pointsPerField: 1,
          layout: 'inline',
          fields: [
            { id: 'x1', label: '$x_1 =$', expected: '6' },
            { id: 'x2', label: '$x_2 =$', expected: '4' },
          ],
        },
        {
          kind: 'single',
          id: 'simplex-dual-objective',
          label: 'Kreuzen Sie die korrekte Zielfunktion des dualen Programms an.',
          points: 1,
          options: [
            { text: '$\\min_{y \\in \\mathbb{R}^3} 2y_1 - 2y_2 + 4y_3$' },
            { text: '$\\max_{y \\in \\mathbb{R}^3} -y_1 + 3y_2$' },
            { text: '$\\min_{y \\in \\mathbb{R}^2} -y_1 + 3y_2$' },
            { text: '$\\max_{y \\in \\mathbb{R}^3} -2y_1 + 2y_2 - 4y_3$' },
          ],
          correct: 0,
        },
        {
          kind: 'multi',
          id: 'simplex-dual-constraints',
          label: 'Kreuzen Sie die Nebenbedingungen an, die im dualen Programm enthalten sind.',
          pointsPerStatement: 0.5,
          statements: [
            { text: '$2y_1 - y_2 - y_3 \\geq 3$', answer: false },
            { text: '$y \\leq 0$', answer: false },
            { text: '$-y_1 - 2y_2 \\geq -1$', answer: true },
            { text: '$y \\geq 0$', answer: true },
            { text: '$-y_1 - 2y_2 \\leq -1$', answer: false },
            { text: '$-2y_1 - y_2 - y_3 \\leq -3$', answer: true },
          ],
        },
        {
          kind: 'single',
          id: 'simplex-tableau',
          label: 'Was wäre der nächste Schritt des Simplex-Algorithmus?',
          intro: 'Nun betrachten wir für ein neues LP folgendes Simplex-Tableau.',
          display: [
            '\\begin{array}{cc|cccccc} & & x_1 & x_2 & x_3 & x_4 & x_5 & x_6 \\\\ \\hline x_2 & 4 & -2 & 1 & 0 & -1 & 0 & -2 \\\\ x_5 & 5 & 2 & 0 & 0 & 7 & 1 & -1 \\\\ x_3 & 2 & 1 & 0 & 1 & 2 & 0 & -3 \\\\ \\hline f & -3 & -3 & 0 & 0 & -1 & 0 & -2 \\end{array}',
          ],
          points: 4,
          options: [
            { text: 'Er bricht ab, denn die optimale Lösung wurde gefunden.' },
            { text: 'Er bricht ab, denn es gibt keine optimale Lösung.' },
            { text: 'Er führt einen Pivot-Schritt durch.' },
          ],
          correct: 1,
        },
      ],
    },

    {
      id: 'tsp-backtrack',
      title: 'Backtracking',
      points: 12,
      prompt:
        'Betrachten Sie den folgenden Graphen, bei dem die Kanten eingezeichnet sind, die ein Kantengewicht $< \\infty$ haben. Sie sollen nun den $\\text{TSP-Backtrack}_{MST}$ Algorithmus anwenden.',
      promptExtra: ['Weiter sei $\\text{opt} f = 49$ aktuell.'],
      figure: 'gt-ws2021/tsp-backtrack',
      parts: [
        {
          kind: 'fields',
          id: 'tsp-b-p1',
          group: '$P_1 : (5, 10, 6, 7, 2)$',
          label: '$B(P_1) =$',
          pointsPerField: 1,
          fields: [{ id: 'b1', expected: '57' }],
        },
        {
          kind: 'single',
          id: 'tsp-continue-p1',
          group: '$P_1 : (5, 10, 6, 7, 2)$',
          points: 1,
          variant: 'inline',
          options: [{ text: 'Nein, bricht ab.' }, { text: 'Ja, bricht nicht ab.' }],
          correct: 0,
        },
        {
          kind: 'fields',
          id: 'tsp-b-p2',
          group: '$P_2 : (8, 9, 4, 1)$',
          label: '$B(P_2) =$',
          pointsPerField: 1,
          fields: [{ id: 'b2', expected: '43' }],
        },
        {
          kind: 'single',
          id: 'tsp-continue-p2',
          group: '$P_2 : (8, 9, 4, 1)$',
          points: 1,
          variant: 'inline',
          options: [{ text: 'Nein, bricht ab.' }, { text: 'Ja, bricht nicht ab.' }],
          correct: 1,
        },
        {
          kind: 'fields',
          id: 'tsp-b-p3',
          group: '$P_3 : (10, 8, 9, 6, 7)$',
          label: '$B(P_3) =$',
          pointsPerField: 1,
          fields: [{ id: 'b3', expected: '49' }],
        },
        {
          kind: 'single',
          id: 'tsp-continue-p3',
          group: '$P_3 : (10, 8, 9, 6, 7)$',
          points: 1,
          variant: 'inline',
          options: [{ text: 'Nein, bricht ab.' }, { text: 'Ja, bricht nicht ab.' }],
          correct: 0,
        },
        {
          kind: 'order',
          id: 'tsp-best-tour',
          label: 'Bestmögliche vollständige Tour',
          intro:
            'Geben Sie von allen partiellen Touren, die der Algorithmus weiter untersuchen würde, die bestmögliche vollständige Tour an (Reihenfolge der Knoten, beginnend im selben Knoten wie die weitergeführte partielle Tour).',
          points: 5,
          penalty: 1,
          items: [
            { id: 'v1', text: '1' },
            { id: 'v2', text: '2' },
            { id: 'v3', text: '3' },
            { id: 'v4', text: '4' },
            { id: 'v5', text: '5' },
            { id: 'v6', text: '6' },
            { id: 'v7', text: '7' },
            { id: 'v8', text: '8' },
            { id: 'v9', text: '9' },
            { id: 'v10', text: '10' },
          ],
          solution: ['v8', 'v9', 'v4', 'v1', 'v3', 'v6', 'v5', 'v2', 'v7', 'v10'],
        },
        {
          kind: 'fields',
          id: 'tsp-tour-value',
          label: 'Wert dieser Tour',
          pointsPerField: 1,
          fields: [{ id: 'tour-value', expected: '48' }],
        },
      ],
    },

    {
      id: 'beweispuzzle',
      title: 'Beweispuzzle',
      points: 10,
      prompt:
        'Sei $G = (V, E)$ ein Graph mit $|V| = n \\geq 4$ und $|E| = 2n - 2$. Zeigen Sie: $G$ enthält zwei Kreise derselben Länge.',
      parts: [
        {
          kind: 'order',
          id: 'beweispuzzle-proof',
          intro:
            'Sortieren Sie die passenden Textbausteine zu einem vollständigen Beweis (ein Spannbaum-Argument über einen langen Kreis $C_j$ mit vielen fehlenden Sehnen).',
          points: 10,
          penalty: 1,
          items: [
            { id: 'c1', text: 'Seien o.B.d.A. $C_i, i = 1, \\ldots, k$, die Zusammenhangskomponenten von $G$.' },
            { id: 'c2', text: 'Wähle $C_j$ so, dass $|V(C_j)| \\geq 4$ und $|E(C_j)| \\geq 2V(C_j) - 2$.' },
            {
              id: 'c3',
              text: 'Ein solches $C_j$ muss existieren, da $\\sum_{i \\in [k]} |V(C_i)| = n$ und $\\sum_{i \\in [k]} |E(C_i)| = 2n - 2$ gelten muss.',
            },
            { id: 'c4', text: 'Sei $T$ ein Spannbaum von $C_j$.' },
            {
              id: 'c5',
              text:
                'Beschreibe mit $D = \\{d \\in \\mathbb{N} : \\exists u, v \\in V(T) : \\mathrm{dist}_T(u,v) = d \\wedge (u,v) \\notin E(T)\\}$ die Menge der unterschiedlichen Entfernungen zweier Knoten in $T$, die mit einer Kante verbunden werden können.',
            },
            { id: 'c6', text: 'Dann gilt $D \\subseteq \\{2, \\ldots, V(C_j) - 1\\}$ und damit $|D| \\leq V(C_j) - 2$.' },
            { id: 'c7', text: '$T$ besteht aus $V(C_j) - 1$ Kanten, daher sind mindestens $V(C_j) - 1$ Kanten von $C_j$ übrig.' },
            { id: 'c8', text: 'Jede dieser übrigen $V(C_j) - 1$ Kanten erzeugt beim Hinzufügen zu $T$ einen Kreis.' },
            {
              id: 'c9',
              text:
                'Da wir mindestens $V(C_j) - 1$ Kanten zu $T$ hinzufügen müssen, um $C_j$ zu erhalten, folgt, dass ein $d \\in D$ und zwei Knotenpaare existieren, die dieselbe Entfernung $d$ haben und durch eine Kante verbunden werden.',
            },
            { id: 'c10', text: 'Demnach müssen zwei Kreise derselben Länge $d + 1$ in $C_j$ existieren und damit auch in $G$.' },
            { id: 'd1', text: 'Sei $T$ ein Spannbaum von $G$.' },
            {
              id: 'd2',
              text:
                'Beschreibe mit $D = \\{d \\in \\mathbb{N} : \\exists u, v \\in V(G) : \\mathrm{dist}_G(u,v) > d \\wedge (u,v) \\notin E(G)\\}$ die Menge der unterschiedlichen Kreislängen in $G$.',
            },
            { id: 'd3', text: 'Seien o.B.d.A. $C_i, i = 1, \\ldots, k$, die Kreise in $G$.' },
            {
              id: 'd4',
              text: 'Demnach müssen zwei Kreise $C_i, C_j, i, j \\in [k]$, derselben Länge $d$ existieren mit $C_i \\neq C_j$.',
            },
          ],
          solution: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10'],
        },
      ],
    },

    {
      id: 'landau',
      title: 'Landau',
      points: 5,
      prompt:
        'Sortieren Sie die Funktionen so, dass $f(n)$ genau dann oberhalb von $g(n)$ steht, wenn $f(n) = O(g(n))$ ist.',
      promptExtra: ['Alle Logarithmen sind zur Basis $e = 2.71828\\ldots$'],
      parts: [
        {
          kind: 'order',
          id: 'landau-order',
          points: 5,
          penalty: 0.5,
          items: [
            { id: 'a', text: '$n^{2.01} - 100^{100} n^2$' },
            { id: 'b', text: '$2^{\\log(\\log(n))}$' },
            { id: 'c', text: '$\\log(n!)$' },
            { id: 'd', text: '$\\log(n)^n$' },
            { id: 'e', text: '$\\sqrt{n}^n$' },
            { id: 'f', text: '$|E(K_n)|$' },
          ],
          // Smallest first: 2^loglog n (poly-log-log) < log(n!) = Θ(n log n) < |E(Kn)| = Θ(n²)
          // < n^2.01 (higher polynomial exponent wins) < (log n)^n < sqrt(n)^n = n^(n/2).
          solution: ['b', 'c', 'f', 'a', 'd', 'e'],
        },
      ],
    },

    {
      id: 'sat',
      title: 'SAT',
      points: 6,
      prompt:
        'Seien $m, n \\in \\mathbb{N}$ beliebig und $x_{i,j}$ für $i \\in [n], j \\in [m]$ sowie $y_{k,l}$ für $k \\neq l \\in [n]$ jeweils $\\{0,1\\}$-Variablen. Außerdem sei $F$ folgende SAT-Formel. Welche Aussagen stimmen?',
      promptExtra: ['(Richtige Antwort: 1 Punkt, falsche Antwort: -1 Punkt, Übersprungen (?): 0 Punkte.)'],
      display: [
        'F = \\bigwedge_{1 \\le i \\le n} \\bigvee_{1 \\le j \\le m} x_{i,j} \\\\[4pt] {}\\wedge \\bigwedge_{1 \\le i \\le n} \\bigwedge_{1 \\le j \\le m} \\bigwedge_{j < k \\le m} \\left(\\overline{x_{i,j}} \\vee \\overline{x_{i,k}}\\right) \\\\[4pt] {}\\wedge \\bigwedge_{1 \\le i \\le n} \\bigwedge_{\\substack{1 \\le j \\le n \\\\ i \\ne j}} \\overline{\\left(y_{i,j} \\vee y_{j,i}\\right)} \\\\[4pt] {}\\wedge \\bigwedge_{1 \\le i \\le n} \\bigwedge_{i < j \\le n} \\overline{\\left(y_{i,j} \\vee \\bigwedge_{1 \\le k \\le m} \\overline{\\left(x_{i,k} \\vee x_{j,k}\\right)}\\right)}.',
      ],
      note:
        'Die Position der Überstriche (Negationsbalken) im Original war im Text-Extrakt nicht in jedem Fall eindeutig einer Teilformel zuzuordnen - die Darstellung oben ist die plausibelste Lesart, aber ohne Gewähr.',
      parts: [
        {
          kind: 'open',
          id: 'sat-statements',
          intro:
            'Beurteilen Sie die sechs Aussagen: (A) Es gibt eine erfüllende Belegung von $F$ mit $x_{i,1} = 1$ für alle $i \\in [n]$. (B) Für $m < 3$ gibt es keine erfüllende Belegung von $F$ mit $y_{1,2} = 1, y_{2,3} = 1, y_{3,1} = 1$. (C) In jeder erfüllenden Belegung von $F$ gilt: $x_{i,j} = x_{j,i}$ für alle $i \\in [n], j \\in [m]$. (D) Es gibt $m^n$ erfüllende Belegungen von $F$, für die gilt: $y_{i,j} = 0$ für alle $i \\neq j \\in [n]$. (E) Es gibt $n^m$ erfüllende Belegungen von $F$, für die gilt: $y_{i,j} = 1$ für alle $i \\neq j \\in [n]$. (F) In jeder erfüllenden Belegung von $F$ gilt: $y_{i,j} = y_{j,i}$ für alle $i \\neq j \\in [n]$.',
          points: 6,
          noKey: true,
          note: UNRELIABLE_EXTRACTION_NOTE,
        },
      ],
    },

    {
      id: 'reduktion',
      title: 'Reduktion',
      points: 10,
      prompt:
        'Das Entscheidungsproblem $3-\\text{COL}$ lautet: Gegeben ein Graph $G$, ist $G$ 3-färbbar? Das Entscheidungsproblem $3-\\text{COL}_{conn}$ lautet: Gegeben ein zusammenhängender Graph $G$, ist $G$ 3-färbbar?',
      promptExtra: ['Zeigen Sie $3-\\text{COL} \\leq_p 3-\\text{COL}_{conn}$.'],
      parts: [
        {
          kind: 'order',
          id: 'reduktion-proof',
          intro: 'Sortieren Sie die passenden Textbausteine zu einem vollständigen Beweis.',
          points: 10,
          penalty: 1,
          items: [
            {
              id: 'c1',
              text: "Wir transformieren die Eingabe $G$ von $3-\\mathrm{COL}$ wie folgt in eine Eingabe $G'$ von $3-\\mathrm{COL}_{conn}$.",
            },
            {
              id: 'c2',
              text:
                'Zunächst berechnen wir alle Zusammenhangskomponenten $H_1, \\ldots, H_k$ von $G$ und wählen in jeder Komponente einen beliebigen Knoten $v_i \\in V(H_i)$ für alle $i \\in [k]$.',
            },
            {
              id: 'c3',
              text: "Anschließend konstruieren wir $G'$, indem wir die Kanten $\\{v_i, v_{i+1}\\}$ für alle $i \\in [k-1]$ zu $G$ hinzufügen.",
            },
            {
              id: 'c4',
              text: "Nach Konstruktion ist $G'$ zusammenhängend und somit zulässig als Eingabe für $3-\\mathrm{COL}_{conn}$.",
            },
            {
              id: 'c5',
              text: 'Für die erste zu beweisende Implikation nehmen wir an, dass $G$ eine Färbung $f$ mit den Farben $0, 1$, und $2$ besitzt.',
            },
            {
              id: 'c6',
              text:
                "Durch einen eventuellen Farbtausch innerhalb der Zusammenhangskomponenten von $G$ können wir daraus die Existenz einer 3-Färbung $f'$ von $G$ ableiten, bei der $f'(v_i) = i \\bmod 3$ gilt.",
            },
            {
              id: 'c7',
              text: "Da $f'(v_i) \\neq f'(v_{i+1})$ für alle $i \\in [k-1]$ gilt, ist $f'$ damit auch eine 3-Färbung von $G'$.",
            },
            {
              id: 'c8',
              text: "Für die zweite zu beweisende Implikation nehmen wir an, dass $G'$ eine 3-Färbung $f'$ besitzt.",
            },
            {
              id: 'c9',
              text: "Da $G$ ein Subgraph von $G'$ ist, ist $f'$ somit auch eine 3-Färbung von $G$.",
            },
            {
              id: 'c10',
              text:
                "Da sich die Transformation $G \\mapsto G'$ in polynomialer Laufzeit berechnen lässt, gilt $3-\\mathrm{COL} \\leq_p 3-\\mathrm{COL}_{conn}$.",
            },
            { id: 'd1', text: 'Anschließend überprüfen wir, ob die einzelnen $H_i$ tatsächlich 3-färbbar sind.' },
            {
              id: 'd2',
              text: 'Schließlich ergibt sich $G^\\star$, indem wir die Kanten $\\{v_i, v_j\\}$ für alle $i \\neq j \\in [k]$ zu $G$ hinzufügen.',
            },
            {
              id: 'd3',
              text: 'Wenn das der Fall ist, fahren wir mit der Transformation fort; andernfalls brechen wir sie ab.',
            },
            {
              id: 'd4',
              text:
                "Durch einen eventuellen Farbtausch innerhalb der Zusammenhangskomponenten von $G$ können wir daraus die Existenz einer 3-Färbung $f'$ von $G$ ableiten, bei der $f'(v_i) = i$ gilt.",
            },
            {
              id: 'd5',
              text: "Wir transformieren die Eingabe $G$ von $3-\\mathrm{COL}_{conn}$ wie folgt in eine Eingabe $G'$ von $3-\\mathrm{COL}$.",
            },
            {
              id: 'd6',
              text: "Da $G'$ ein Subgraph von $G$ ist, besitzt somit auch $G'$ eine 3-Färbung.",
            },
            {
              id: 'd7',
              text: "$G'$ wird definiert als die größte Zusammenhangskomponente von $G$.",
            },
          ],
          solution: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10'],
        },
      ],
    },

    {
      id: 'pseudocode',
      title: 'Pseudocode (nur für 6LP)',
      points: 11,
      prompt:
        'Gegeben sei eine Liste von Objekten $\\{1, 2, \\ldots, n\\}$. Weiter seien $f, g : \\{1, 2, \\ldots, n\\} \\to \\mathbb{N}$ und $b \\in \\mathbb{N}$.',
      promptExtra: [
        'Schreiben Sie einen Pseudocode, der mittels dynamischer Programmierung den Wert $k$ bestimmt, der folgendes erfüllt: $k$ ist der maximale Wert, sodass eine Teilmenge $I \\subseteq \\{1, 2, \\ldots, n\\}$ existiert, so dass $\\sum_{i \\in I} g_i \\leq b$ und $\\sum_{i \\in I} f_i = k$ ist.',
      ],
      parts: [
        {
          kind: 'order',
          id: 'pseudocode-blocks',
          intro: 'Sortieren Sie die passenden Textbausteine zu einem vollständigen Pseudocode.',
          points: 11,
          penalty: 1,
          items: [
            { id: 'c1', text: 'W[i,j] = 0 $\\; \\forall i \\in [n+1], \\forall j \\in \\{0, \\ldots, b\\}$' },
            { id: 'c2', text: 'for i = n, …, 1' },
            { id: 'c3', text: 'for j = 1, …, b' },
            { id: 'c4', text: 'if g(i) ≤ j' },
            { id: 'c5', text: 'W[i,j] := max(f(i) + W[i+1, j − g(i)], W[i+1, j])' },
            { id: 'c6', text: 'else' },
            { id: 'c7', text: 'W[i,j] := W[i+1, j]' },
            { id: 'c8', text: 'end if' },
            { id: 'c9', text: 'end for   (innere j-Schleife)' },
            { id: 'c10', text: 'end for   (äußere i-Schleife)' },
            { id: 'c11', text: 'return W[1, b]' },
            { id: 'd1', text: 'W[i,j] := min(f(i) − W[i+1, j − g(i)], W[i+1, j])' },
            { id: 'd2', text: 'return W[n, b]' },
            { id: 'd3', text: 'W[i,j] := W[i−1, j]' },
            { id: 'd4', text: 'if g(i) ≥ j' },
          ],
          solution: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10', 'c11'],
        },
      ],
    },
  ],
}
