import type { GraphExam } from '../../types'
import { grades } from './common'

/**
 * GTOP Mock Exam Sommersemester 2025 - "Mock Exam Graph Theory and Optimization SoSe2025"
 * by Anusch Taraz, Alexander Allin, Fabian Hamann (the YAPS practice exam, available
 * 15.-17.8.2025).
 *
 * This is a *practice* sheet, not an Auswertungsbericht: there is NO printed solution key
 * anywhere. Every answer below is computed (from the printed text or from the exam's own
 * figures) and marked `derived: true` - the "official key" flag stays off, like the MC
 * pool's `source: 'vips'`.
 *
 *  - Floyd-Warshall D^3 matrix, Linear Programming, Statements, Proof Puzzle order: solved
 *    from the printed text alone.
 *  - Ford-Fulkerson residual + val(f), Floyd-Warshall graph G_1, TSP-Backtrack bounds,
 *    Kruskal, DFS: solved by reading the embedded figure images (page N, image 0 in
 *    figures.manifest.json). A couple of edge directions are genuinely ambiguous on the
 *    raster and are flagged in the part `note` (d^6_{6,3} accepts 4 or 5).
 *  - Written Proof / Reduction: `open` part with a `derived` solution sketch.
 *  - ONLY the Ford-Fulkerson min-cut on the page-2 residual network stays `open` /
 *    `noKey`: the arrowheads on that figure cannot be read with confidence, so no key is
 *    asserted - the figure renders, work it by hand.
 *
 * Ford-Fulkerson: the given flow is s->a 2/2, s->b 3/7, a->b 2/9, b->a 0/1, a->t 0/9,
 * b->t 5/5; val(optimal flow) = 8 via the cut ({s,b},{a,t}) = 2+1+5.
 *
 * Notenschluessel: the sheet prints none - `grades(100)` gives the standard 95..50 %.
 *
 * Figures come from pdfs/gt-mock2025.pdf (git-ignored); each exercise diagram is an
 * embedded image, exported with `"page": N, "image": 0` (no rect needed).
 */
export const GT_MOCK2025: GraphExam = {
  id: 'gt-mock2025',
  title: 'GTOP Mock Exam SoSe 2025',
  order: 9,
  language: 'en',
  totalPoints: 100,
  grades: grades(100),
  note:
    'Mock Exam (YAPS-Probeklausur): Das Aufgabenblatt druckt keinerlei Loesungen ab - alle '
    + 'Loesungen unten sind selbst hergeleitet (`derived`) und gegen das PDF zu pruefen. '
    + 'Einzig der Minimalschnitt (Ford-Fulkerson, Seite 2) bleibt ohne Schluessel, weil die '
    + 'Pfeilrichtungen im Restnetzwerk nicht sicher lesbar sind.',
  tasks: [
    {
      id: 'ford-fulkerson',
      title: 'Ford-Fulkerson',
      points: 12,
      prompt:
        'Consider the following directed graph $N = (V, A, s, t, c)$ with capacity '
        + '$c : A \\to \\mathbb{R}_{\\geq 0}$ and flow $f$ in $N$. The entry for each edge $e \\in A$ '
        + 'is given by $(f(e)/c(e))$.',
      figure: 'gt-mock2025/ff-network',
      parts: [
        {
          kind: 'fields',
          id: 'ff-residual',
          label: 'Residual network',
          intro:
            'Determine the residual network of $N$. Give the residual capacity of every directed '
            + 'pair between $s, a, b, t$; a pair that is not an edge of the residual network has '
            + 'capacity 0.',
          note:
            'Computed from the given flow ($s\\to a$ 2/2, $s\\to b$ 3/7, $a\\to b$ 2/9, $b\\to a$ 0/1, '
            + '$a\\to t$ 0/9, $b\\to t$ 5/5).',
          derived: true,
          pointsPerField: 0.5,
          layout: 'inline',
          fields: [
            { id: 'sa', label: '$(s,a) =$', expected: '0' },
            { id: 'as', label: '$(a,s) =$', expected: '2' },
            { id: 'sb', label: '$(s,b) =$', expected: '4' },
            { id: 'bs', label: '$(b,s) =$', expected: '3' },
            { id: 'at', label: '$(a,t) =$', expected: '9' },
            { id: 'ta', label: '$(t,a) =$', expected: '0' },
            { id: 'tb', label: '$(t,b) =$', expected: '5' },
            { id: 'bt', label: '$(b,t) =$', expected: '0' },
            { id: 'ab', label: '$(a,b) =$', expected: '7' },
            { id: 'ba', label: '$(b,a) =$', expected: '3' },
          ],
        },
        {
          kind: 'fields',
          id: 'ff-value',
          label: 'State the flow value of an optimal flow.',
          note:
            'Max flow = min cut. The cut $(\\{s,b\\}, \\{a,t\\})$ has capacity '
            + '$c(s,a) + c(b,a) + c(b,t) = 2 + 1 + 5 = 8$, and a flow of value 8 is attainable '
            + '($s\\to a\\to t$: 2, $s\\to b\\to t$: 5, $s\\to b\\to a\\to t$: 1).',
          derived: true,
          pointsPerField: 2,
          fields: [{ id: 'val-f', label: '$\\mathrm{val}(f) =$', expected: '8' }],
        },
        {
          kind: 'open',
          id: 'ff-min-cut',
          label: 'Minimum cut',
          intro:
            'Now consider the residual network of a maximum flow for a new network (page 2 of the '
            + 'sheet). Determine a minimum cut.',
          figure: 'gt-mock2025/ff-mincut-residual',
          points: 5,
          noKey: true,
          solution:
            'Kein Loesungsschluessel im Aufgabenblatt. Vorgehen: In einem Restnetzwerk zu einem '
            + 'Maximalfluss ist $S$ die Menge der von $s$ aus (auf Kanten mit Restkapazitaet $> 0$) '
            + 'erreichbaren Knoten, $T = V \\setminus S$. Der zugehoerige minimale Schnitt besteht '
            + 'aus allen ORIGINAL-Kanten von $S$ nach $T$; seine Kapazitaet gleicht dem Flusswert. '
            + 'Bitte an der Abbildung auf Seite 2 des PDF durchfuehren.',
        },
      ],
    },

    {
      id: 'floyd-warshall',
      title: 'Floyd-Warshall',
      points: 12,
      prompt:
        'You are given a simple directed graph $G_1 = (V_1, E_1, \\ell_1)$ with '
        + '$\\ell_1 : E_1 \\to \\mathbb{R}$. Furthermore, let $d^k_{i,j}$ be defined as in the '
        + 'Floyd-Warshall algorithm.',
      figure: 'gt-mock2025/floyd-warshall',
      parts: [
        {
          kind: 'fields',
          id: 'fw-graph',
          label: 'Now, determine the values of the following $d^k_{i,j}$:',
          note:
            '$d^k_{i,j}$ ist die Laenge eines kuerzesten $i$-$j$-Weges, der nur Zwischenknoten aus '
            + '$\\{1, \\dots, k\\}$ benutzt. Aus dem Graphen der Abbildung: '
            + '$d^1_{7,8} = \\infty$ (kein Bogen $7\\to 8$, kein Bogen $7\\to 1$). '
            + '$d^6_{7,1}$: Knoten 1 ist mit Zwischenknoten $\\leq 6$ nur ueber $6\\to 1\\,(5)$ '
            + 'erreichbar, kuerzester Weg $7\\to 6\\,(3)\\to 1$, also $8$. '
            + '$d^6_{6,3}$: $6\\to 1\\,(5)\\to 4\\,(0)\\to 2\\,(-3)\\to 3\\,(2) = 4$ - haengt von der '
            + 'Richtung des Bogens $1$-$4$ ab ($5$, falls $\\ell(1,4) = 1$).',
          derived: true,
          pointsPerField: 2,
          fields: [
            { id: 'd671', label: '$d^6_{7,1} =$', expected: '8' },
            { id: 'd663', label: '$d^6_{6,3} =$', expected: '4', alternatives: ['5'] },
            { id: 'd178', label: '$d^1_{7,8} =$', expected: 'inf' },
          ],
        },
        {
          kind: 'fields',
          id: 'fw-matrix',
          label: 'Determine $d^4_{3,1}$, $d^4_{5,3}$ and $d^4_{5,2}$.',
          intro:
            'We now consider a new graph $G_2 = (V_2, E_2, \\ell_2)$ with '
            + '$\\ell_2 : E_2 \\to \\mathbb{R}$ and $|V_2| = 5$. The matrix '
            + '$D^k = (d^k_{i,j})_{1 \\leq i,j \\leq n} \\in \\mathbb{Z}^{n \\times n}$ has the usual '
            + 'form. You are given the matrix $D^3 \\in \\mathbb{Z}^{5 \\times 5}$ with '
            + '$D^3 = (d^3_{i,j})_{1 \\leq i,j \\leq 5}$:',
          display: [
            'D^3 = \\begin{pmatrix} 0 & -1 & \\infty & -4 & \\infty \\\\ '
            + '1 & 0 & \\infty & -3 & \\infty \\\\ '
            + '\\infty & \\infty & 0 & \\infty & 5 \\\\ '
            + '5 & 4 & -2 & 0 & 3 \\\\ '
            + '2 & 1 & 5 & -2 & 0 \\end{pmatrix}',
          ],
          note:
            '$d^4_{i,j} = \\min(d^3_{i,j},\\; d^3_{i,4} + d^3_{4,j})$. '
            + '$d^4_{3,1} = \\min(\\infty,\\; \\infty + 5) = \\infty$; '
            + '$d^4_{5,3} = \\min(5,\\; -2 + (-2)) = -4$; '
            + '$d^4_{5,2} = \\min(1,\\; -2 + 4) = 1$.',
          derived: true,
          pointsPerField: 2,
          fields: [
            { id: 'd431', label: '$d^4_{3,1} =$', expected: 'inf' },
            { id: 'd453', label: '$d^4_{5,3} =$', expected: '-4' },
            { id: 'd452', label: '$d^4_{5,2} =$', expected: '1' },
          ],
        },
      ],
    },

    {
      id: 'tsp-backtrack',
      title: 'TSP-Backtrack',
      points: 8,
      prompt: 'Consider the following graph.',
      figure: 'gt-mock2025/tsp-backtrack',
      parts: [
        {
          kind: 'open',
          id: 'tsp-bounds',
          label: 'Determine $B(P_i)$ and whether the algorithm keeps exploring',
          intro:
            'You are to apply the $\\mathrm{TSP\\text{-}Backtrack}_{\\mathrm{MST}}$ algorithm. The '
            + 'following partial tours are given: $P_1 : (5, 1, 4)$, $P_2 : (5, 2, 1)$, '
            + '$P_3 : (2, 3, 4)$, $P_4 : (5, 4, 2)$. The currently shortest found tour has value '
            + '$\\mathrm{opt}_f = 20$. Determine $B(P_i)$ for the given partial tours and state '
            + 'whether the algorithm would continue exploring this partial tour.',
          points: 8,
          derived: true,
          solution:
            'Kein Loesungsschluessel im Aufgabenblatt - hier mit der Konvention '
            + '$B(P) = w(P) + \\mathrm{MST}(\\,\\text{unbesuchte Knoten} \\cup \\{\\text{Start}, '
            + '\\text{aktueller Endknoten}\\})$; weiter verfolgen gdw. $B(P_i) < \\mathrm{opt}_f = 20$.\n'
            + 'Kantengewichte (aus der Abbildung): $w_{12}=5,\\, w_{13}=4,\\, w_{14}=3,\\, w_{15}=2,\\, '
            + 'w_{23}=4,\\, w_{24}=5,\\, w_{25}=4,\\, w_{34}=1,\\, w_{35}=4,\\, w_{45}=8$.\n'
            + '$P_1 = (5,1,4)$: $w(P) = 2 + 3 = 5$; MST auf $\\{2,3,4,5\\}$ '
            + '($w_{34}+w_{23}+w_{35} = 1+4+4$) $= 9$; $B(P_1) = 14 < 20$ - weiter.\n'
            + '$P_2 = (5,2,1)$: $w(P) = 4 + 5 = 9$; MST auf $\\{1,3,4,5\\}$ '
            + '($w_{34}+w_{15}+w_{14} = 1+2+3$) $= 6$; $B(P_2) = 15 < 20$ - weiter.\n'
            + '$P_3 = (2,3,4)$: $w(P) = 4 + 1 = 5$; MST auf $\\{1,2,4,5\\}$ '
            + '($w_{15}+w_{14}+w_{25} = 2+3+4$) $= 9$; $B(P_3) = 14 < 20$ - weiter.\n'
            + '$P_4 = (5,4,2)$: $w(P) = 8 + 5 = 13$; MST auf $\\{1,2,3,5\\}$ '
            + '($w_{15}+w_{13}+w_{23} = 2+4+4$) $= 10$; $B(P_4) = 23 \\geq 20$ - abschneiden.',
        },
      ],
    },

    {
      id: 'kruskal',
      title: 'Kruskal',
      points: 6,
      prompt: 'Consider the following graph where edges with weight $< \\infty$ are drawn.',
      figure: 'gt-mock2025/kruskal',
      parts: [
        {
          kind: 'fields',
          id: 'kruskal-all',
          label: 'Kruskal: sum after 6 edges, R-vertices, MST weight',
          intro:
            'What is the sum of edge weights of the edges added so far after 6 computation steps '
            + '(i.e. after the 6th edge is added)? Determine the representative vertices (R-vertices) '
            + 'of vertex 2 and vertex 10 after 6 computation steps and state the size of the '
            + 'respective components. To make the solution unique: if the two components being merged '
            + 'are of the same size, the vertex with the smaller number becomes the representative '
            + 'vertex. Finally, state the sum of the edge weights of a minimum spanning tree.',
          note:
            'Erste 6 aufgenommene Kanten (Gewichte): $\\{6,8\\}\\,1$, $\\{7,10\\}\\,2$, $\\{5,8\\}\\,3$, '
            + '$\\{1,10\\}\\,5$, $\\{4,7\\}\\,6$, $\\{4,8\\}\\,8$; Summe $= 25$. Knoten 2 ist danach '
            + 'noch isoliert (R-Knoten 2, Groesse 1); Knoten 10 liegt in '
            + '$\\{1,4,5,6,7,8,10\\}$ mit R-Knoten 7 (Union-by-Size, Tie-Break) und Groesse 7. '
            + 'MST $= 25 + \\{2,9\\}\\,10 + \\{3,9\\}\\,11 + \\{2,6\\}\\,12 = 58$.',
          derived: true,
          pointsPerField: 1,
          fields: [
            { id: 'sum6', label: 'Sum of weights after the 6th added edge:', expected: '25' },
            { id: 'r2', label: 'R-vertex of vertex 2:', expected: '2' },
            { id: 'size2', label: 'Size of vertex 2’s component:', expected: '1' },
            { id: 'r10', label: 'R-vertex of vertex 10:', expected: '7' },
            { id: 'size10', label: 'Size of vertex 10’s component:', expected: '7' },
            { id: 'mst', label: 'Weight of a minimum spanning tree:', expected: '58' },
          ],
        },
      ],
    },

    {
      id: 'dfs',
      title: 'Depth-First Search',
      points: 6,
      prompt: 'We start a depth-first search on the following graph.',
      figure: 'gt-mock2025/dfs',
      parts: [
        {
          kind: 'multi',
          id: 'dfs-sequences',
          label: 'Which vertex sequences are possible as an "explored" order?',
          intro:
            'Decide for each of the following vertex sequences whether the depth-first search could '
            + 'mark the vertices as "explored" in the given order (true = possible).',
          note:
            'Adjazenz (aus der Abbildung): '
            + '$1$:$\\{3,8,9\\}$, $2$:$\\{3,6,9\\}$, $3$:$\\{1,2,6,9\\}$, $4$:$\\{7,8,9,10\\}$, '
            + '$5$:$\\{6,9,10\\}$, $6$:$\\{2,3,5\\}$, $7$:$\\{4,8,10\\}$, $8$:$\\{1,4,7\\}$, '
            + '$9$:$\\{1,2,3,4,5\\}$, $10$:$\\{4,5,7\\}$. '
            + '(a) nach $\\dots,5,6$ muss von $5$ aus Knoten $10$ besucht werden, nicht $4$. '
            + '(b) nach $\\dots,5,10$ muss von $5$ aus $6$ besucht werden, nicht $2$. '
            + '(d) nach $10,4,8,7$ muss von $8$ aus $1$ besucht werden, nicht $9$. '
            + '(e) nach $6,2,9,1,3$ muss von $1$ aus $8$ besucht werden, nicht $4$.',
          derived: true,
          pointsPerStatement: 1,
          statements: [
            { text: '(a) $7, 8, 1, 3, 2, 9, 5, 6, 4, 10$', answer: false },
            { text: '(b) $3, 1, 8, 7, 4, 9, 5, 10, 2, 6$', answer: false },
            { text: '(c) $5, 10, 7, 8, 4, 9, 1, 3, 6, 2$', answer: true },
            { text: '(d) $10, 4, 8, 7, 9, 3, 6, 5, 1, 2$', answer: false },
            { text: '(e) $6, 2, 9, 1, 3, 4, 7, 8, 10, 5$', answer: false },
            { text: '(f) $4, 8, 1, 3, 2, 6, 5, 10, 7, 9$', answer: true },
          ],
        },
      ],
    },

    {
      id: 'linear-programming',
      title: 'Linear Programming',
      points: 6,
      prompt: 'Consider the following linear program:',
      display: [
        '\\min_{x \\in \\mathbb{R}^2} \\; -2x_1 - x_2 \\quad \\text{subject to} \\\\[4pt] '
        + '-x_1 + x_2 \\leq 1 \\\\ 3x_1 - 2x_2 \\leq 5 \\\\ x_1 + x_2 \\leq 5 \\\\ x_1, x_2 \\geq 0',
      ],
      promptExtra: ['Here is a corresponding sketch for guidance:'],
      figure: 'gt-mock2025/lp-plot',
      parts: [
        {
          kind: 'fields',
          id: 'lp-optimum',
          label: 'State the optimal solution.',
          note:
            'Maximising $2x_1 + x_2$ over the feasible polygon, the optimum is the vertex '
            + '$(3, 2) = \\{3x_1 - 2x_2 = 5\\} \\cap \\{x_1 + x_2 = 5\\}$, giving objective '
            + '$-2(3) - 2 = -8$.',
          derived: true,
          pointsPerField: 1,
          layout: 'inline',
          fields: [
            { id: 'x1', label: '$x_1 =$', expected: '3' },
            { id: 'x2', label: '$x_2 =$', expected: '2' },
            { id: 'obj', label: 'optimal value $=$', expected: '-8' },
          ],
        },
        {
          kind: 'open',
          id: 'lp-dual',
          label: 'Determine the dual program.',
          points: 3,
          derived: true,
          solution:
            'Primal: $\\min\\, c^T x$ mit $Ax \\leq b$, $x \\geq 0$, wobei $c = (-2, -1)^T$, '
            + '$b = (1, 5, 5)^T$ und $A = \\begin{pmatrix} -1 & 1 \\\\ 3 & -2 \\\\ 1 & 1 \\end{pmatrix}$.\n'
            + 'Dual (fuer ein Minimierungs-Primal mit $\\leq$-Restriktionen und $x \\geq 0$): '
            + '$\\max\\, b^T y$ mit $A^T y \\leq c$, $y \\leq 0$, also\n'
            + '$\\max\\, y_1 + 5y_2 + 5y_3$ unter\n'
            + '$-y_1 + 3y_2 + y_3 \\leq -2$,\n'
            + '$\\;\\;y_1 - 2y_2 + y_3 \\leq -1$,\n'
            + '$y_1, y_2, y_3 \\leq 0$.\n'
            + 'Optimale Dualloesung $y = (0, -\\tfrac{1}{5}, -\\tfrac{7}{5})$ mit Wert '
            + '$-1 - 7 = -8$ (starke Dualitaet).\n'
            + '(Aequivalent, mit $y_i \\geq 0$ geschrieben: '
            + '$\\min\\, y_1 + 5y_2 + 5y_3$ unter $-y_1 + 3y_2 + y_3 \\geq 2$, '
            + '$y_1 - 2y_2 + y_3 \\geq 1$, $y \\geq 0$ - das ist das Dual des '
            + 'aequivalenten $\\max 2x_1 + x_2$.)',
        },
      ],
    },

    {
      id: 'statements',
      title: 'Statements',
      points: 20,
      prompt: 'Which of the following statements are always true?',
      note:
        '(Correct answer: 1 point, wrong answer: -1 point, skipped (?): 0 points. Each subtask '
        + 'cannot score less than 0 points.) Das Aufgabenblatt druckt keinen Loesungsschluessel ab '
        + '- die Antworten unten sind mathematisch hergeleitet (`derived`).',
      parts: [
        {
          kind: 'multi',
          id: 'st-greedy-colouring',
          label: 'Greedy colouring',
          intro:
            'Let $G$ be a connected graph. Which of the following statements are always true?',
          derived: true,
          pointsPerStatement: 1,
          statements: [
            {
              text:
                'If $G$ is 3-colourable, then the greedy colouring algorithm colours $G$ with at '
                + 'most 3 colours.',
              answer: false,
            },
            {
              text:
                'If $G$ is 2-colourable, then the greedy colouring algorithm colours $G$ with at '
                + 'most 2 colours.',
              answer: false,
            },
            { text: 'The greedy colouring algorithm produces a valid colouring of $G$.', answer: true },
            {
              text: 'The greedy colouring algorithm computes a colouring of $G$ in polynomial time.',
              answer: true,
            },
            {
              text:
                'If $G$ contains no odd-length cycles, then the greedy colouring algorithm colours '
                + '$G$ with at most 2 colours.',
              answer: false,
            },
          ],
        },
        {
          kind: 'multi',
          id: 'st-tsp-knapsack',
          label: 'TSP / knapsack',
          intro: 'Which of the following statements are always true?',
          derived: true,
          pointsPerStatement: 1,
          statements: [
            {
              text: 'The TSP-Backtrack algorithm finds an optimal solution to the TSP problem.',
              answer: true,
            },
            {
              text:
                'The nearest-neighbour algorithm finds a feasible solution to the TSP problem in '
                + 'polynomial time.',
              answer: true,
            },
            {
              text: 'The fractional knapsack problem can be solved in polynomial time.',
              answer: true,
            },
            {
              text:
                'Every feasible solution to the fractional knapsack problem is also a feasible '
                + 'solution to the integer knapsack problem.',
              answer: false,
            },
            {
              text:
                'The nearest-neighbour algorithm finds an optimal solution to the TSP problem in '
                + 'polynomial time.',
              answer: false,
            },
          ],
        },
        {
          kind: 'multi',
          id: 'st-lp-duality',
          label: 'LP: $\\max c^T x$ s.t. $Ax \\geq 0$, $x \\geq 0$',
          intro:
            'Consider an LP of the form $\\max\\, c^T x$ subject to $Ax \\geq 0$ and $x \\geq 0$. '
            + 'Which of the following statements are always true?',
          derived: true,
          pointsPerStatement: 1,
          statements: [
            {
              text:
                'If the above LP has an optimal solution and the corresponding dual LP also has an '
                + 'optimal solution, then their objective function values are equal.',
              answer: true,
            },
            {
              text:
                'If the above LP has a feasible solution, then the corresponding dual LP also has a '
                + 'feasible solution.',
              answer: false,
            },
            { text: 'The above LP has a feasible solution.', answer: true },
            {
              text: 'If the above LP has a feasible solution, then it also has an optimal solution.',
              answer: false,
            },
            {
              text:
                'If the above LP has a feasible solution and the corresponding dual LP also has a '
                + 'feasible solution, then their objective function values are equal.',
              answer: false,
            },
          ],
        },
        {
          kind: 'multi',
          id: 'st-plane-graph',
          label: 'Plane connected graph',
          intro:
            'Let $G = (V, E, R)$ be a plane, connected graph with at least 4 vertices. Which of the '
            + 'following statements are always true?',
          derived: true,
          pointsPerStatement: 1,
          statements: [
            { text: '$G$ has at least $|V| - 1$ edges.', answer: true },
            { text: '$G$ has at most $3|V| - 7$ edges.', answer: false },
            { text: '$G$ has at least one vertex with fewer than 6 neighbours.', answer: true },
            {
              text: '$G$ has at least one vertex $x$, such that $G - x$ is still connected.',
              answer: true,
            },
            { text: '$G$ is 5-colourable.', answer: true },
          ],
        },
      ],
    },

    {
      id: 'proof',
      title: 'Proof (schriftlich)',
      points: 10,
      prompt:
        'Let $T = (V, E)$ be a tree on $n$ vertices. Show that there exists a mapping '
        + '$f : V \\to [n]$ such that for any two distinct edges '
        + '$\\{v_1, w_1\\} \\neq \\{v_2, w_2\\} \\in E$ it holds that '
        + '$f(v_1) + f(w_1) \\neq f(v_2) + f(w_2)$.',
      promptExtra: ['Please solve this assignment in written form on paper.'],
      parts: [
        {
          kind: 'open',
          id: 'proof-tree-sums',
          points: 10,
          derived: true,
          solution:
            'Kein Loesungsschluessel im Aufgabenblatt. Beweisskizze (BFS-Nummerierung):\n'
            + 'Fuehre von einem beliebigen Wurzelknoten eine Breitensuche (BFS) durch und '
            + 'nummeriere die Knoten $v_1, v_2, \\dots, v_n$ in der Reihenfolge, in der sie entdeckt '
            + 'werden; setze $f(v_k) = k$. Fuer $n = 1$ gibt es keine Kante, nichts zu zeigen.\n'
            + 'Jede Kante von $T$ ist eine Baumkante der BFS, verbindet also genau ein $v_k$ '
            + '($k \\geq 2$) mit seinem Vorgaenger $v_{p(k)}$, $p(k) < k$. Zentrale Eigenschaft der '
            + 'BFS: Die Vorgaenger werden in nichtfallender Reihenfolge vergeben, d.h. aus '
            + '$k < \\ell$ folgt $p(k) \\leq p(\\ell)$ (erst werden alle Kinder von $v_1$ '
            + 'eingereiht, dann alle Kinder von $v_2$ usw.).\n'
            + 'Die Kantensumme von $v_k$ ist $s(k) = k + p(k)$. Fuer $k < \\ell$ gilt '
            + '$k < \\ell$ und $p(k) \\leq p(\\ell)$, also $s(k) = k + p(k) < \\ell + p(\\ell) = '
            + 's(\\ell)$. Die Folge $s(2), s(3), \\dots, s(n)$ ist somit streng monoton wachsend, '
            + 'insbesondere sind alle Kantensummen paarweise verschieden. $\\square$',
        },
      ],
    },

    {
      id: 'reduction',
      title: 'Reduction (schriftlich)',
      points: 10,
      prompt:
        'The decision problem INDEPENDENT SET is: given a graph $G$ and an integer $k \\geq 2$, '
        + 'is it true that $\\alpha(G) \\geq k$? The decision problem INDEPENDENT SET$^*$ is: given '
        + 'a graph $G$ with $\\omega(G) \\geq \\frac{|V(G)|}{2}$ and an integer $k \\geq 2$, is it '
        + 'true that $\\alpha(G) \\geq k$?',
      promptExtra: [
        'Show that $\\text{INDEPENDENT SET} \\leq_p \\text{INDEPENDENT SET}^*$.',
        'Please solve this assignment in written form on paper.',
      ],
      parts: [
        {
          kind: 'open',
          id: 'reduction-is',
          points: 10,
          derived: true,
          solution:
            'Kein Loesungsschluessel im Aufgabenblatt. Beweisskizze:\n'
            + 'Transformation: Sei $(G, k)$ eine Instanz von INDEPENDENT SET mit $|V(G)| = n$. '
            + 'Bilde $G\'$ als disjunkte Vereinigung von $G$ mit einer Clique $K_n$ auf $n$ frischen '
            + 'Knoten (keine Kanten zwischen den beiden Teilen). Setze $k\' = k + 1$. Die Ausgabe '
            + 'ist $(G\', k\')$.\n'
            + 'Zulaessigkeit: $|V(G\')| = 2n$ und $\\omega(G\') = \\max(\\omega(G), n) = n = '
            + '\\frac{|V(G\')|}{2}$, also ist $(G\', k\')$ eine gueltige INDEPENDENT SET$^*$-Instanz; '
            + 'zudem $k\' = k + 1 \\geq 3 \\geq 2$. Die Konstruktion fuegt $n$ Knoten und '
            + '$\\binom{n}{2}$ Kanten hinzu und laeuft in polynomieller Zeit.\n'
            + 'Korrektheit: Eine unabhaengige Menge in $G\'$ besteht aus einer unabhaengigen Menge '
            + 'in $G$ plus hoechstens einem Knoten der Clique, also $\\alpha(G\') = \\alpha(G) + 1$. '
            + 'Damit gilt $\\alpha(G\') \\geq k\' \\iff \\alpha(G) + 1 \\geq k + 1 \\iff '
            + '\\alpha(G) \\geq k$. Also ist $(G, k)$ eine Ja-Instanz von INDEPENDENT SET genau '
            + 'dann, wenn $(G\', k\')$ eine Ja-Instanz von INDEPENDENT SET$^*$ ist. $\\square$',
        },
      ],
    },

    {
      id: 'proof-puzzle',
      title: 'Proof Puzzle',
      points: 10,
      prompt:
        'Let $k \\in \\mathbb{N}$. Let $G = (V, E)$ be a bipartite graph with colour classes '
        + '$V = A \\cup B$ and $|A| = |B|$, such that for every vertex $v \\in V$ it holds that '
        + '$\\deg(v) = k$. Show that $G$ contains a perfect matching.',
      promptExtra: [
        'Sort the following text blocks to construct a correct proof. Not all blocks are required.',
      ],
      parts: [
        {
          kind: 'order',
          id: 'proof-puzzle-order',
          label: 'Order the blocks',
          note: 'There can be multiple correct solutions. Deduction: 1 point per wrong slot.',
          derived: true,
          points: 10,
          penalty: 1,
          items: [
            { id: 'b1', text: 'Since for every vertex $x \\in X$ we have $\\deg(x) = k$,' },
            { id: 'b2', text: 'Moreover, since for every vertex $y \\in N(x)$ we have $\\deg(y) = k$,' },
            { id: 'b3', text: "By Hall's marriage theorem" },
            { id: 'b4', text: 'it holds that $\\sum_{y \\in N(X)} \\deg(y) = k \\cdot |X|$.' },
            { id: 'b5', text: 'it follows that $G$ has a perfect matching.' },
            {
              id: 'b6',
              text: 'there are $k \\cdot |X|$ edges between $X$ and $N(X)$ and therefore',
            },
            { id: 'b7', text: 'thus $|N(X)| \\geq |X|$.' },
            { id: 'b8', text: 'thus $|X| \\geq |N(X)|$.' },
            { id: 'b9', text: 'it holds that $\\sum_{y \\in X} \\deg(y) \\geq k \\cdot |N(X)|$.' },
            { id: 'b10', text: 'Therefore, we have $k \\cdot |N(X)| \\geq k \\cdot |X|$ and' },
            { id: 'b11', text: 'it holds that $\\sum_{y \\in N(X)} \\deg(y) = k \\cdot |N(X)|$.' },
            { id: 'b12', text: 'Let $X \\subseteq A$.' },
            { id: 'b13', text: 'it holds that $\\sum_{y \\in N(X)} \\deg(y) \\geq k \\cdot |X|$.' },
            { id: 'b14', text: 'By the handshake lemma' },
          ],
          solution: ['b12', 'b1', 'b6', 'b13', 'b2', 'b11', 'b10', 'b7', 'b3', 'b5'],
        },
      ],
    },
  ],
}
