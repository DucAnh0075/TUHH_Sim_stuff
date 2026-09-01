import type { GraphExam } from '../../types'
import { grades, UNRELIABLE_EXTRACTION_NOTE } from './common'

/**
 * GTOP Sommersemester 2021 ("GTOP_Exam_2021_SS.pdf"), Auswertungsbericht vom 16.9.2021.
 * German report - `language: 'de'`; the prompts below are the printed German wording.
 *
 * No Notenschluessel page is printed in this report, so `grades(86)` supplies the
 * standard 95..50 % scheme. The printed exercise points sum to 86 (12 + 10 + 12 + 10 +
 * 5 + 6 + 4 + 6 + 10 + 11).
 *
 * Answer keys:
 *  - Floyd-Warshall, Backtracking, Kruskal and Lineare Programmierung print every numeric
 *    key directly as a "Loesung: ..." line - transcribed verbatim.
 *  - Floyd-Warshall's two red boxes print only "Kantengewicht von Kante (x,y) richtig"
 *    with no value; like the WS20/21 equivalent they stay an `open`/`noKey` part.
 *  - Max-Flow-Min-Cut asks for a drawn flow + a marked minimal cut; the report shows an
 *    optimal flow/cut figure but no text-form key, so it is an `open` part with the
 *    report's solution figure and the printed `val(f) = 18 = cap(S)`.
 *  - Lineare Programmierung's dual objective + dual constraints print a green/red mark per
 *    option, so the key follows from the mark; each was additionally re-derived by weak
 *    duality (primal in <= form: A = [[3,-1],[-2,-1],[-1,-3]], b = (4,-11,-8),
 *    c = (-3,-2); dual min b^T y, A^T y >= c, y >= 0).
 *  - SAT is two single-choice subtasks whose correct option is highlighted green in the
 *    report (D and D) - transcribed.
 *  - Landau is an ordering with the report's own "Ihre Antwort / Loesung" columns; note
 *    that here alpha(C_n) is the independence number (= floor(n/2) = Theta(n)), not the
 *    inverse Ackermann function - that is what makes the printed order consistent.
 *  - Beweispuzzle and Reduktion: the report's two-column table gives the full block order
 *    and the unused ("Nicht genutzt") blocks - transcribed directly.
 *  - Pseudocode (nur 6 LP): likewise transcribed from the two-column table. The report's
 *    Loesung column lists `d(v,0) := 1` *after* `for i = 1,...,k do`; that unusual order
 *    is kept verbatim (policy: read off the report, do not "fix" it). The three plain
 *    "end for" blocks are disambiguated with a parenthetical loop name, as in the WS20/21
 *    pseudocode puzzle, so the ordering stays solvable.
 *
 * Figures are cut from pdfs/gt-ss2021.pdf (git-ignored, likely not present - the app then
 * shows a placeholder). Their `rect`s in figures.manifest.json are estimated from the
 * report's page images and should be re-measured with `npm run figures -- --inspect`
 * once the PDF is in place.
 */
export const GT_SS2021: GraphExam = {
  id: 'gt-ss2021',
  title: 'GTOP Sommersemester 2021',
  order: 2,
  language: 'de',
  totalPoints: 86,
  grades: grades(86),
  note: 'Kein Notenschlüssel im Original-Bericht abgedruckt - Standardschema (50 % bis 95 %) verwendet.',
  tasks: [
    {
      id: 'max-flow-min-cut',
      title: 'Max-Flow-Min-Cut',
      points: 12,
      prompt:
        'Betrachten Sie folgendes Netzwerk $N = (V, A, s, t, c)$, in dem die Kapazitäten der Kanten in den roten Kästen angegeben sind.',
      promptExtra: [
        'Geben Sie einen Fluss maximalen Wertes an, indem Sie die blauen Felder ausfüllen. Geben Sie außerdem einen minimalen Schnitt an, indem Sie alle Knoten, die im Schnitt enthalten sind, rot markieren. Geben Sie auch den Wert Ihres Flusses an.',
      ],
      figure: 'gt-ss2021/max-flow-min-cut',
      parts: [
        {
          kind: 'open',
          id: 'mfmc-flow',
          label: 'Fluss und minimaler Schnitt',
          intro:
            'Zeichnen Sie einen Fluss maximalen Wertes ein und markieren Sie eine Knotenmenge $S$, die einen minimalen Schnitt bildet ($s \\in S$, $t \\notin S$).',
          points: 11,
          solutionFigure: 'gt-ss2021/max-flow-min-cut-solution',
        },
        {
          kind: 'fields',
          id: 'mfmc-value',
          label: '$val(f) =$',
          intro: 'Ein optimaler Fluss/Schnitt erfüllt $val(f) = 18 = cap(S)$.',
          pointsPerField: 1,
          fields: [{ id: 'val-f', expected: '18' }],
        },
      ],
    },

    {
      id: 'floyd-warshall',
      title: 'Floyd Warshall',
      points: 10,
      prompt:
        'In dieser Aufgabe sei $d^k_{i,j}$ so definiert, wie im Floyd-Warshall Algorithmus. Betrachten Sie den folgenden Graphen.',
      figure: 'gt-ss2021/floyd-warshall',
      parts: [
        {
          kind: 'open',
          id: 'floyd-warshall-boxes',
          label: 'Rote Boxen: Kantengewichte (2,8) und (5,2)',
          intro:
            'Tragen Sie in die zwei roten Boxen Kantengewichte so ein, dass $d^6_{3,8} = 12$ und $d^8_{1,6} = 15$ gilt.',
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
            { id: 'd743', label: '$d^7_{4,3} =$', expected: '6' },
            { id: 'd427', label: '$d^4_{2,7} =$', expected: 'inf' },
            { id: 'd814', label: '$d^8_{1,4} =$', expected: '10' },
          ],
        },
      ],
    },

    {
      id: 'tsp-backtrack',
      title: 'Backtracking',
      points: 12,
      prompt:
        'Betrachten Sie den folgenden Graphen, bei dem die Kanten eingezeichnet sind, die ein Kantengewicht $< \\infty$ haben. Sie sollen nun den $\\text{TSP-Backtrack}_{MST}$ Algorithmus anwenden. Seien dazu die folgenden partiellen Touren gegeben:',
      display: ['P_1 : (10, 3, 6, 8, 7, 1, 4) \\\\ P_2 : (7, 4, 1, 3, 10, 2, 5) \\\\ P_3 : (8, 9, 2, 10, 4, 1, 7)'],
      promptExtra: ['Weiter sei $\\text{opt} f = 40$ aktuell.'],
      figure: 'gt-ss2021/tsp-backtrack',
      parts: [
        {
          kind: 'fields',
          id: 'tsp-b-p1',
          group: '$P_1 : (10, 3, 6, 8, 7, 1, 4)$',
          label: '$B(P_1) =$',
          pointsPerField: 1,
          fields: [{ id: 'b1', expected: '34' }],
        },
        {
          kind: 'single',
          id: 'tsp-continue-p1',
          group: '$P_1 : (10, 3, 6, 8, 7, 1, 4)$',
          points: 1,
          variant: 'inline',
          options: [{ text: 'Nein, bricht ab.' }, { text: 'Ja, bricht nicht ab.' }],
          correct: 1,
        },
        {
          kind: 'fields',
          id: 'tsp-b-p2',
          group: '$P_2 : (7, 4, 1, 3, 10, 2, 5)$',
          label: '$B(P_2) =$',
          pointsPerField: 1,
          fields: [{ id: 'b2', expected: '48' }],
        },
        {
          kind: 'single',
          id: 'tsp-continue-p2',
          group: '$P_2 : (7, 4, 1, 3, 10, 2, 5)$',
          points: 1,
          variant: 'inline',
          options: [{ text: 'Nein, bricht ab.' }, { text: 'Ja, bricht nicht ab.' }],
          correct: 0,
        },
        {
          kind: 'fields',
          id: 'tsp-b-p3',
          group: '$P_3 : (8, 9, 2, 10, 4, 1, 7)$',
          label: '$B(P_3) =$',
          pointsPerField: 1,
          fields: [{ id: 'b3', expected: '42' }],
        },
        {
          kind: 'single',
          id: 'tsp-continue-p3',
          group: '$P_3 : (8, 9, 2, 10, 4, 1, 7)$',
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
            'Geben Sie von allen oben genannten partiellen Touren, die der Algorithmus weiter untersuchen würde, die bestmögliche vollständige Tour an. Reihenfolge der Knoten, beginnend im selben Knoten wie die weitergeführte partielle Tour.',
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
          solution: ['v10', 'v3', 'v6', 'v8', 'v7', 'v1', 'v4', 'v2', 'v9', 'v5'],
        },
        {
          kind: 'fields',
          id: 'tsp-tour-value',
          label: 'Wert dieser Tour',
          pointsPerField: 1,
          fields: [{ id: 'tour-value', expected: '34' }],
        },
      ],
    },

    {
      id: 'beweispuzzle',
      title: 'Beweispuzzle',
      points: 10,
      prompt:
        'Sei $G = (V, E)$ ein zusammenhängender Graph, sodass jeder Knoten einen geraden Grad besitzt. Zeigen Sie: $G$ besitzt eine Eulertour.',
      promptExtra: [
        'Sie können dafür einige der Textbausteine von der rechten Seite auf die linke Seite ziehen und sortieren. Nicht alle Textbausteine müssen benutzt werden. Nutzen Sie nur notwendige Bausteine.',
      ],
      parts: [
        {
          kind: 'order',
          id: 'beweispuzzle-proof',
          intro: 'Sortieren Sie die passenden Textbausteine zu einem vollständigen Beweis (Induktion über die Kantenzahl).',
          points: 10,
          penalty: 1,
          items: [
            {
              id: 'c1',
              text: 'Wir beweisen die Aussage durch Induktion über die Anzahl der Kanten, wobei der Induktionsanfang mit 2 Kanten trivial ist.',
            },
            {
              id: 'c2',
              text: 'Sei $G$ nun mit beliebig vielen Kanten. Da jeder Knoten einen geraden Grad hat und $G$ zusammenhängend ist, existiert ein Kreis $C$ in $G$.',
            },
            {
              id: 'c3',
              text: 'Wenn $C$ jede Kante durchläuft, sind wir fertig. Also nehmen wir an, dass dies nicht der Fall ist.',
            },
            {
              id: 'c4',
              text: 'Durch Entfernen aller Kanten von $C$ aus $G$ zerfällt dieser in Zusammenhangskomponenten $X_1, \\ldots, X_k$, mit $k \\geq 1$, wobei jeder Knoten weiterhin einen geraden Grad besitzt.',
            },
            {
              id: 'c5',
              text: 'Auf jede dieser Komponenten wenden wir die Induktionshypothese an und erhalten für alle $X_i$ eine Eulertour.',
            },
            {
              id: 'c6',
              text: 'Da jede Komponente mindestens einen Knoten mit $C$ teilt, können wir eine Eulertour für $G$ wie folgt konstruieren:',
            },
            {
              id: 'c7',
              text: 'Starte mit einem beliebigen Knoten $v_0$ von $C$. Falls $v_0 \\in X_i$ für ein $i \\in [k]$, durchlaufe diese Komponente in ihrer Eulertour und ende wieder bei $v_0$.',
            },
            {
              id: 'c8',
              text: 'Jetzt gehe die Kanten von $C$ weiter, bis wir zum nächsten Knoten, $v_1$, kommen, der in einer Komponente $X_j$, $j \\neq i$, liegt. Durchlaufe wie zuvor diese Komponente und ende in $v_1$.',
            },
            { id: 'c9', text: 'Diesen Prozess führen wir weiter bis wir zurückkehren zum Knoten $v_0$.' },
            { id: 'c10', text: 'So haben wir die erforderliche Eulertour konstruiert.' },
            {
              id: 'd1',
              text: 'Sei $G$ nun mit beliebig vielen Kanten. Da jeder Knoten einen geraden Grad hat und $G$ zusammenhängend ist, existiert ein Hamiltonkreis $C$ in $G$.',
            },
            {
              id: 'd2',
              text: 'Durch Entfernen aller Kanten von $C$ aus $G$ zerfällt dieser in Zusammenhangskomponenten $X_1, \\ldots, X_k$, mit $k \\geq 2$, wobei jeder Knoten nun einen ungeraden Grad besitzt.',
            },
            { id: 'd3', text: 'Jetzt wähle $v_1 \\in C$ beliebig, sodass $v_1 \\cap X_1 \\neq \\emptyset$.' },
            { id: 'd4', text: 'Diesen Prozess führen wir weiter bis wir enden in Knoten $v_{|C|}$.' },
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
            { id: 'inv-n', text: '$\\frac{1}{n}$' },
            { id: 'alpha', text: '$\\alpha(C_n)$' },
            { id: 'poly', text: '$\\frac{1}{e}\\, n^{0.01}$' },
            { id: 'log', text: '$100^{100} \\log n$' },
            { id: 'inv-sqrt', text: '$\\frac{1}{\\sqrt{n}}$' },
            { id: 'sqrt-pow', text: '$\\sqrt{n}^{\\,n}$' },
          ],
          // Ascending growth. alpha(C_n) is the independence number of a cycle, floor(n/2) = Theta(n):
          //   1/n -> 0 (fastest) < 1/sqrt(n) -> 0 < 100^100 log n = Theta(log n)
          //   < (1/e) n^0.01 = Theta(n^0.01) < alpha(C_n) = Theta(n) < sqrt(n)^n = n^(n/2).
          solution: ['inv-n', 'inv-sqrt', 'log', 'poly', 'alpha', 'sqrt-pow'],
        },
      ],
    },

    {
      id: 'lineare-programmierung',
      title: 'Lineare Programmierung',
      points: 6,
      prompt: 'Betrachten Sie das folgende Lineare Programm:',
      display: [
        '\\max_{x \\in \\mathbb{R}^2} -3x_1 - 2x_2 \\quad \\text{u.d.N.} \\\\ -3x_1 + x_2 \\geq -4 \\\\ 2x_1 + x_2 \\geq 11 \\\\ x_1 + 3x_2 \\geq 8 \\\\ x \\geq 0',
      ],
      promptExtra: ['Hier sehen Sie als Hilfestellung eine entsprechende Zeichnung:'],
      figure: 'gt-ss2021/lp-plot',
      parts: [
        {
          kind: 'fields',
          id: 'lp-vertex',
          label: 'Geben Sie die optimale Ecke an:',
          pointsPerField: 1,
          layout: 'inline',
          fields: [
            { id: 'x1', label: '$x_1 =$', expected: '3' },
            { id: 'x2', label: '$x_2 =$', expected: '5' },
          ],
        },
        {
          kind: 'single',
          id: 'lp-dual-objective',
          label: 'Kreuzen Sie die korrekte Zielfunktion des dualen Programms an.',
          points: 1,
          options: [
            { text: '$\\min_{y \\in \\mathbb{R}^3} -4y_1 + 11y_2 + 8y_3$' },
            { text: '$\\min_{y \\in \\mathbb{R}^2} -3y_1 - 2y_2$' },
            { text: '$\\min_{y \\in \\mathbb{R}^2} 3y_1 + 2y_2$' },
            { text: '$\\min_{y \\in \\mathbb{R}^3} 4y_1 - 11y_2 - 8y_3$' },
          ],
          correct: 3,
        },
        {
          kind: 'multi',
          id: 'lp-dual-constraints',
          label: 'Kreuzen Sie die Nebenbedingungen an, die im dualen Programm enthalten sind.',
          note: '(Richtige Antwort: 1 Punkt, falsche Antwort: -1 Punkt, Übersprungen (?): 0 Punkte. Im Bericht sind pro Aussage 0,5 Punkte ausgewiesen.)',
          pointsPerStatement: 0.5,
          // Dual constraints A^T y >= c with A = [[3,-1],[-2,-1],[-1,-3]], c = (-3,-2), y >= 0:
          //   3y1 - 2y2 - y3 >= -3   and   -y1 - y2 - 3y3 >= -2.
          statements: [
            { text: '$y \\leq 0$', answer: false },
            { text: '$y_1 + y_2 + y_3 \\geq -2$', answer: false },
            { text: '$y \\geq 0$', answer: true },
            { text: '$-y_1 - 2y_2 - 3y_3 \\geq -2$', answer: false },
            { text: '$-3y_1 + 2y_2 + y_3 \\geq -3$', answer: false },
            { text: '$3y_1 - 2y_2 - y_3 \\geq -3$', answer: true },
          ],
        },
      ],
    },

    {
      id: 'sat',
      title: 'SAT',
      points: 4,
      prompt:
        'Seien $n, k \\in \\mathbb{N}$ beliebig und $G = (V, E)$ ein Graph auf der Knotenmenge $V = \\{v_1, \\ldots, v_n\\}$. Es kann eine SAT-Formel angegeben werden, die genau dann erfüllbar ist, wenn $G$ eine Knotenüberdeckung der Größe $k$ hat.',
      promptExtra: [
        'Dazu seien $e_{i,j}$ mit $i \\neq j \\in [n]$ jeweils $\\{0,1\\}$-Variablen, die genau dann $1$ sind, wenn $\\{v_i, v_j\\} \\in E$. Des Weiteren seien $x_{i,j}$ mit $i \\in [n]$ und $j \\in [k]$ ebenfalls $\\{0,1\\}$-Variablen, die angeben, dass der Knoten $v_i$ der $j$-te Knoten der Knotenüberdeckung sein soll. Die SAT-Formel soll gewährleisten, dass jede erfüllende Belegung tatsächlich eine Knotenüberdeckung der Größe $k$ repräsentiert. Im Folgenden sollen zwei Teile einer solchen SAT-Formel bestimmt werden.',
      ],
      parts: [
        {
          kind: 'single',
          id: 'sat-at-most-one',
          label:
            'Welche Formel sorgt dafür, dass für die $k$ Knoten der Knotenüberdeckung jeweils höchstens ein Knoten aus $V$ zugeordnet sein kann?',
          points: 2,
          options: [
            {
              text: '$\\bigwedge_{1 \\leq j \\leq k} \\bigvee_{1 \\leq i_1 \\leq n} \\bigvee_{\\substack{1 \\leq i_2 \\leq n \\\\ i_1 \\neq i_2}} \\left( \\overline{x_{i_1,j}} \\vee \\overline{x_{i_2,j}} \\right)$',
            },
            {
              text: '$\\bigwedge_{1 \\leq j \\leq k} \\bigwedge_{1 \\leq i_1 \\leq n} \\bigwedge_{\\substack{1 \\leq i_2 \\leq n \\\\ i_1 \\neq i_2}} \\left( \\overline{x_{i_1,j}} \\wedge \\overline{x_{i_2,j}} \\right)$',
            },
            {
              text: '$\\bigwedge_{1 \\leq j \\leq k} \\bigvee_{1 \\leq i_1 \\leq n} \\bigvee_{\\substack{1 \\leq i_2 \\leq n \\\\ i_1 \\neq i_2}} \\left( \\overline{x_{i_1,j}} \\wedge \\overline{x_{i_2,j}} \\right)$',
            },
            {
              text: '$\\bigwedge_{1 \\leq j \\leq k} \\bigwedge_{1 \\leq i_1 \\leq n} \\bigwedge_{\\substack{1 \\leq i_2 \\leq n \\\\ i_1 \\neq i_2}} \\left( \\overline{x_{i_1,j}} \\vee \\overline{x_{i_2,j}} \\right)$',
            },
          ],
          correct: 3,
        },
        {
          kind: 'single',
          id: 'sat-edge-covered',
          label: 'Welche Formel sorgt dafür, dass jede Kante einen Endpunkt in der Knotenüberdeckung haben muss?',
          points: 2,
          options: [
            {
              text: '$\\bigwedge_{1 \\leq i_1 \\leq n} \\bigwedge_{\\substack{1 \\leq i_2 \\leq n \\\\ i_1 \\neq i_2}} e_{i_1,i_2} \\vee \\left( \\left( \\bigvee_{1 \\leq j \\leq k} x_{i_1,j} \\right) \\vee \\left( \\bigvee_{1 \\leq j \\leq k} x_{i_2,j} \\right) \\right)$',
            },
            {
              text: '$\\bigwedge_{1 \\leq i_1 \\leq n} \\bigwedge_{\\substack{1 \\leq i_2 \\leq n \\\\ i_1 \\neq i_2}} \\overline{e_{i_1,i_2}} \\vee \\left( \\left( \\bigwedge_{1 \\leq j \\leq k} x_{i_1,j} \\right) \\vee \\left( \\bigwedge_{1 \\leq j \\leq k} x_{i_2,j} \\right) \\right)$',
            },
            {
              text: '$\\bigwedge_{1 \\leq i_1 \\leq n} \\bigwedge_{\\substack{1 \\leq i_2 \\leq n \\\\ i_1 \\neq i_2}} e_{i_1,i_2} \\vee \\left( \\left( \\bigwedge_{1 \\leq j \\leq k} x_{i_1,j} \\right) \\vee \\left( \\bigwedge_{1 \\leq j \\leq k} x_{i_2,j} \\right) \\right)$',
            },
            {
              text: '$\\bigwedge_{1 \\leq i_1 \\leq n} \\bigwedge_{\\substack{1 \\leq i_2 \\leq n \\\\ i_1 \\neq i_2}} \\overline{e_{i_1,i_2}} \\vee \\left( \\left( \\bigvee_{1 \\leq j \\leq k} x_{i_1,j} \\right) \\vee \\left( \\bigvee_{1 \\leq j \\leq k} x_{i_2,j} \\right) \\right)$',
            },
          ],
          correct: 3,
        },
      ],
    },

    {
      id: 'kruskal',
      title: 'Kruskal',
      points: 6,
      prompt:
        'Betrachten Sie den folgenden Graphen, bei dem die Kanten eingezeichnet sind, die ein Kantengewicht $< \\infty$ haben. Sie sollen nun den Kruskal Algorithmus anwenden. Beachten Sie, dass einige Teilaufgaben den Zustand des Algorithmus abfragen, bevor dieser vollständig durchlaufen ist.',
      figure: 'gt-ss2021/kruskal',
      parts: [
        {
          kind: 'fields',
          id: 'kruskal-after-6',
          label:
            'Was ist nach 6 Berechnungsschritten (d.h. nachdem die 6. Kante hinzugefügt wurde) die Summe der Kantengewichte der Kanten, die bislang hinzugefügt wurden?',
          pointsPerField: 1,
          fields: [{ id: 'sum6', expected: '17' }],
        },
        {
          kind: 'fields',
          id: 'kruskal-r-knoten',
          label: 'R-Knoten und Komponentengrößen',
          intro:
            'Bestimmen Sie die repräsentativen Knoten (R-Knoten) nach 8 Berechnungsschritten (d.h. nachdem die 8. Kante hinzugefügt wurde) und geben Sie die Größe der zugehörigen Komponente an. Falls bei der Vereinigung zweier gleich großer Komponenten, wird der Knoten mit der kleineren Nummer repräsentativer Knoten.',
          pointsPerField: 1,
          fields: [
            { id: 'r10', label: 'R-Knoten von Knoten 10:', expected: '3' },
            { id: 'size10', label: 'Größe der zu Knoten 10 gehörenden Komponente:', expected: '2' },
            { id: 'r4', label: 'R-Knoten von Knoten 4:', expected: '6' },
            { id: 'size4', label: 'Größe der zu Knoten 4 gehörenden Komponente:', expected: '8' },
          ],
        },
        {
          kind: 'fields',
          id: 'kruskal-mst',
          label:
            'Führen Sie nun den Algorithmus von Kruskal bis zum Schluss aus und geben Sie die Summe der Kanten des Spannbaums an.',
          pointsPerField: 1,
          fields: [{ id: 'mst', label: 'Summe der Kantengewichte $=$', expected: '40' }],
        },
      ],
    },

    {
      id: 'reduktion',
      title: 'Reduktion',
      points: 10,
      prompt:
        'Das Entscheidungsproblem $3-\\text{COL}$ lautet: Gegeben ein Graph $G$, ist $G$ 3-färbbar? Das Entscheidungsproblem $3-\\text{COL}^*$ lautet: Gegeben ein Graph $G$, bei dem jeder Knoten in einem Dreieck enthalten sein muss, ist $G$ 3-färbbar?',
      promptExtra: ['Zeigen Sie $3-\\text{COL} \\leq_p 3-\\text{COL}^*$.'],
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
              text: "Wir transformieren die Eingabe $G = (V, E)$ von $3-\\mathrm{COL}$ wie folgt in eine Eingabe $G' = (V', E')$ von $3-\\mathrm{COL}^*$:",
            },
            {
              id: 'c2',
              text: "Wir konstruieren $G'$, indem wir für jeden Knoten $v \\in V$ zwei Knoten $v'$ und $v''$ zu $G$ hinzufügen.",
            },
            {
              id: 'c3',
              text: "Anschließend fügen wir die Kanten $\\{v, v'\\}$, $\\{v', v''\\}$ und $\\{v'', v\\}$ zu $G'$ hinzu.",
            },
            {
              id: 'c4',
              text: "Nach Konstruktion ist jeder Knoten von $G'$ in einem Dreieck und somit ist $G'$ eine zulässige Eingabe für $3-\\mathrm{COL}^*$.",
            },
            {
              id: 'c5',
              text: 'Für die erste zu beweisende Implikation nehmen wir an, dass $G$ eine zulässige Färbung $f$ mit den Farben $0$, $1$ und $2$ besitzt.',
            },
            {
              id: 'c6',
              text: "Wir konstruieren eine zulässige Färbung $f'$ von $G'$, für die $f'(v) = f(v)$ für alle $v \\in V$ gilt. Wir müssen also nur noch für jedes $v \\in V$ eine Farbe für $v'$ und $v''$ wählen.",
            },
            {
              id: 'c7',
              text: "Für diese wählen wir $f'(v') := (f(v) + 1) \\bmod 3$ und $f'(v'') := (f(v) + 2) \\bmod 3$. Damit ist $f'$ eine zulässige Färbung von $G'$.",
            },
            {
              id: 'c8',
              text: "Für die zweite zu beweisende Implikation nehmen wir an, dass $G'$ eine zulässige Färbung mit den Farben $0$, $1$ und $2$ besitzt.",
            },
            {
              id: 'c9',
              text: "Da $G$ ein Subgraph von $G'$ ist, hat damit auch $G$ eine zulässige Färbung mit diesen Farben.",
            },
            {
              id: 'c10',
              text: "Da sich die Transformation $G \\mapsto G'$ in polynomialer Laufzeit berechnen lässt, gilt $3-\\mathrm{COL} \\leq_p 3-\\mathrm{COL}^*$.",
            },
            {
              id: 'd1',
              text: "Wir transformieren die Eingabe $G = (V, E)$ von $3-\\mathrm{COL}^*$ wie folgt in eine Eingabe $G' = (V', E')$ von $3-\\mathrm{COL}$:",
            },
            {
              id: 'd2',
              text: "Da die Nachbarn eines Knotens stets unterschiedliche Farben haben, ist die Färbung $f$ auch eine zulässige Färbung für $G'$.",
            },
            { id: 'd3', text: "Für diese wählen wir $f'(v') = f(v)$ und $f'(v'') = f(v)$." },
            { id: 'd4', text: "Da $G'$ ein Subgraph von $G$ ist, besitzt somit auch $G'$ eine 3-Färbung." },
            {
              id: 'd5',
              text: 'Wenn das der Fall ist, fahren wir mit der Transformation fort; andernfalls brechen wir sie ab.',
            },
            {
              id: 'd6',
              text: 'Für jeden Knoten $v \\in V$, der nicht in einem Dreieck ist, wählen wir zwei beliebige Nachbarn von $v$ und verbinden diese.',
            },
          ],
          solution: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10'],
        },
      ],
    },

    {
      id: 'pseudocode',
      title: 'Pseudocode (nur 6 LP)',
      points: 11,
      prompt:
        'Sei $G = (V, A)$ ein gerichteter Graph. Weiterhin seien $k \\in \\mathbb{N}$ und $u \\in V$. In dieser Aufgabe gilt es herauszufinden, wie viele gerichtete Kantenzüge der Länge $k$ in $u$ enden.',
      promptExtra: ['Schreiben Sie einen Pseudocode, der diese Anzahl berechnet und zurückgibt.'],
      parts: [
        {
          kind: 'order',
          id: 'pseudocode-blocks',
          intro:
            'Sortieren Sie die passenden Textbausteine zu einem vollständigen Pseudocode. Die Reihenfolge ist genau die des Berichts wiedergegeben.',
          points: 11,
          penalty: 1,
          items: [
            { id: 'c1', text: 'for $i = 1, \\ldots, k$ do' },
            { id: 'c2', text: '$d(v, 0) := 1 \\;\\; \\forall v \\in V$' },
            { id: 'c3', text: 'for $v \\in V$ do' },
            { id: 'c4', text: '$d(v, i) := 0$' },
            { id: 'c5', text: 'for $w \\in V$ mit $(w, v) \\in A$ do' },
            { id: 'c6', text: '$d(v, i) := d(v, i) + d(w, i - 1)$' },
            { id: 'c7', text: 'end for   (w-Schleife)' },
            { id: 'c8', text: 'end for   (v-Schleife)' },
            { id: 'c9', text: 'end for   (i-Schleife)' },
            { id: 'c10', text: 'return $d(u, k)$' },
            { id: 'd1', text: '$d(v, 0) := 0 \\;\\; \\forall v \\in V$' },
            { id: 'd2', text: 'for $w \\in V$ mit $(v, w) \\in A$ do' },
            { id: 'd3', text: '$d(v, i) := d(v, i - 1) + d(w, i)$' },
            { id: 'd4', text: 'return $\\max\\{d(v, k) \\mid v \\in V\\}$' },
          ],
          solution: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10'],
        },
      ],
    },
  ],
}
