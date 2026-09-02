import type { GraphExam } from '../../types'
import { grades } from './common'

/**
 * GTOP Sommersemester 2024, Auswertungsbericht vom 16.9.2024 (Prof. Dr. Anusch Taraz).
 * The report is in English, so the prompts below are the printed English wording -
 * `language: 'en'`; only the app chrome around them stays German.
 *
 * The printed Notenschluessel is exactly the standard 95..50 % scheme on 100 points, so
 * `grades(100)` reproduces it row for row.
 *
 * Answer keys: every `fields`/`single` key below is the report's own "Loesung: ..." line.
 * The true/false blocks print no key directly - they print the awarded points per
 * statement, from which the key follows once the marked answer is known; each of those
 * was additionally re-derived mathematically (residual reachability for the min cut,
 * weak duality for the LP dual, the handshake/critical-subgraph arguments for the
 * Aussagen). The one statement where the printed marks and the maths do not pin the key
 * down on their own is marked `derived: true` - see the comment there.
 *
 * The two written exercises (Beweis / Reduktion) print no solution at all in the report,
 * only "Punktzahl +0.0/10.0"; they are `open` parts with a `derived` solution sketch so
 * the self-check has something to compare against.
 *
 * Figures are cut from pdfs/gt-ss2024.pdf (git-ignored). Their `rect`s in
 * figures.manifest.json were estimated from the report's page images and should be
 * re-measured with `npm run figures -- --inspect` once the PDF is in place.
 */
export const GT_SS2024: GraphExam = {
  id: 'gt-ss2024',
  title: 'GTOP Sommersemester 2024',
  order: 6,
  language: 'en',
  totalPoints: 100,
  grades: grades(100),
  note:
    'Der Bericht weist zusaetzlich 7 Bonuspunkte aus (Hausaufgaben, ILIAS, VIP). Bonuspunkte zaehlen nur, '
    + 'wenn ohne sie mindestens eine 4.0 erreicht wurde - hier sind sie deshalb nicht eingerechnet.',
  tasks: [
    {
      id: 'ford-fulkerson',
      title: 'Ford-Fulkerson',
      points: 12,
      prompt:
        'Consider the following directed graph $N = (V, A, s, t, c)$ with capacity $c : A \\to \\mathbb{R}_{\\geq 0}$ and flow $f$ in $N$. The entry for each edge $e \\in A$ is given by $(f(e)/c(e))$.',
      figure: 'gt-ss2024/ff-network',
      parts: [
        {
          kind: 'fields',
          id: 'ff-residual',
          label: 'Residualnetzwerk',
          intro:
            'Provide the residual network of $N$ in the following graph. Edges that are not present in the residual network should have an entry of 0.',
          pointsPerField: 0.5,
          layout: 'inline',
          fields: [
            { id: 'sa', label: '$(s,a) =$', expected: '0' },
            { id: 'as', label: '$(a,s) =$', expected: '1' },
            { id: 'sb', label: '$(s,b) =$', expected: '5' },
            { id: 'bs', label: '$(b,s) =$', expected: '2' },
            { id: 'at', label: '$(a,t) =$', expected: '8' },
            { id: 'ta', label: '$(t,a) =$', expected: '0' },
            { id: 'tb', label: '$(t,b) =$', expected: '3' },
            { id: 'bt', label: '$(b,t) =$', expected: '0' },
            { id: 'ab', label: '$(a,b) =$', expected: '4' },
            { id: 'ba', label: '$(b,a) =$', expected: '4' },
          ],
        },
        {
          kind: 'fields',
          id: 'ff-value',
          label: 'Provide the flow value of an optimal flow $f$.',
          pointsPerField: 3,
          fields: [{ id: 'val-f', label: '$\\mathrm{val}(f) =$', expected: '7' }],
        },
        {
          kind: 'multi',
          id: 'ff-min-cut',
          label: 'Minimaler Schnitt',
          intro:
            'Now, for a new network, the residual network of a maximum flow is given. Determine the minimum cut by selecting the vertices that are included in the minimum cut.',
          note:
            '(Correct answer: 0.5 points, wrong answer: -0.5 points, skipped (?): 0 points. This subtask cannot score less than 0 points.)',
          figure: 'gt-ss2024/ff-min-cut',
          pointsPerStatement: 0.5,
          // S = the vertices reachable from s in the given residual network: {s, 1, 3, 4, 6}.
          statements: [
            { text: '$s$', answer: true },
            { text: '$1$', answer: true },
            { text: '$2$', answer: false },
            { text: '$3$', answer: true },
            { text: '$4$', answer: true },
            { text: '$5$', answer: false },
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
        'Given is a simple directed graph $G_1 = (V_1, E_1, \\ell_1)$, with $\\ell_1 : E_1 \\to \\mathbb{R}$. Furthermore, let $d^k_{i,j}$ be defined as in the Floyd-Warshall algorithm.',
      figure: 'gt-ss2024/floyd-warshall',
      parts: [
        {
          kind: 'fields',
          id: 'fw-values',
          label: 'Now, determine the values of the following $d^k_{i,j}$:',
          pointsPerField: 2,
          fields: [
            { id: 'd587', label: '$d^5_{8,7} =$', expected: '12' },
            { id: 'd136', label: '$d^1_{3,6} =$', expected: 'inf' },
            { id: 'd413', label: '$d^4_{1,3} =$', expected: '2' },
          ],
        },
        {
          kind: 'fields',
          id: 'fw-matrix',
          label: 'Determine the following values of the matrix $D^4$:',
          intro:
            'Now we consider a new graph $G_2 = (V_2, E_2, \\ell_2)$ with $\\ell_2 : E_2 \\to \\mathbb{R}$ and $|V_2| = 5$. In general, the matrix $D^k = (d^k_{i,j})_{1 \\leq i,j \\leq n} \\in \\mathbb{Z}^{n \\times n}$ has the usual form. Now, let us consider the matrix $D^3 \\in \\mathbb{Z}^{5 \\times 5}$ with $D^3 = (d^3_{i,j})_{1 \\leq i,j \\leq 5}$:',
          display: [
            'D^3 = \\begin{pmatrix} 0 & \\infty & \\infty & -1 & \\infty \\\\ \\infty & 0 & 2 & -3 & 3 \\\\ \\infty & \\infty & 0 & -5 & \\infty \\\\ \\infty & \\infty & \\infty & 0 & 4 \\\\ -3 & 3 & 5 & -4 & 0 \\end{pmatrix}',
          ],
          pointsPerField: 2,
          fields: [
            { id: 'd441', label: '$d^4_{4,1} =$', expected: 'inf' },
            { id: 'd423', label: '$d^4_{2,3} =$', expected: '2' },
            { id: 'd425', label: '$d^4_{2,5} =$', expected: '1' },
          ],
        },
      ],
    },

    {
      id: 'knapsack-backtrack',
      title: 'Knapsack-Backtrack',
      points: 8,
      prompt: 'Let a knapsack problem with $b = 17$ and the following 7 objects be given:',
      display: [
        '(f_1, f_2, f_3, f_4, f_5, f_6, f_7) = (3, 5, 2, 8, 4, 3, 1) \\\\[4pt] (g_1, g_2, g_3, g_4, g_5, g_6, g_7) = (4, 3, 1, 6, 5, 2, 1)',
      ],
      promptExtra: [
        'and $x_1, \\ldots, x_7 \\in \\{0,1\\}$. The best solution found so far has a value of $\\mathrm{opt} f = 22$.',
        'You are now supposed to execute the $\\mathrm{Backtracking3}$ algorithm for the knapsack problem. For this, let the following four partial solutions be given, each with 3 elements $x_i$, which have not yet been considered by the algorithm, as well as the value $f$ and the weight $g$ of the current filling:',
        '(i) $x_2, x_4, x_6$, $f = 10$, $g = 11$ — (ii) $x_1, x_2, x_7$, $f = 17$, $g = 14$ — (iii) $x_1, x_3, x_6$, $f = 18$, $g = 15$ — (iv) $x_1, x_5, x_6$, $f = 16$, $g = 11$.',
        'Determine $B(x)$ for each of the given partial solutions and state whether the $\\mathrm{Backtracking3}$ algorithm would continue the exploration of this partial solution. Reminder: The $\\mathrm{Backtracking3}$ algorithm uses the fractional knapsack problem to calculate $B(x)$.',
      ],
      note:
        'If the calculated value is fractional, enter the value rounded to two decimal places and use a comma as the decimal point. Example: For B = 10 + 2/3 enter 10,67.',
      parts: [
        {
          kind: 'fields',
          id: 'ks-b1',
          group: 'i)  x2, x4, x6,  f = 10, g = 11',
          pointsPerField: 1,
          fields: [{ id: 'b1', label: '$B(x) =$', expected: '19.33', alternatives: ['19,33'] }],
        },
        {
          kind: 'single',
          id: 'ks-c1',
          group: 'i)  x2, x4, x6,  f = 10, g = 11',
          points: 1,
          variant: 'inline',
          options: [{ text: 'No, stops.' }, { text: 'Yes, does not stop.' }],
          correct: 0,
        },
        {
          kind: 'fields',
          id: 'ks-b2',
          group: 'ii)  x1, x2, x7,  f = 17, g = 14',
          pointsPerField: 1,
          fields: [{ id: 'b2', label: '$B(x) =$', expected: '22' }],
        },
        {
          kind: 'single',
          id: 'ks-c2',
          group: 'ii)  x1, x2, x7,  f = 17, g = 14',
          points: 1,
          variant: 'inline',
          options: [{ text: 'No, stops.' }, { text: 'Yes, does not stop.' }],
          correct: 0,
        },
        {
          kind: 'fields',
          id: 'ks-b3',
          group: 'iii)  x1, x3, x6,  f = 18, g = 15',
          pointsPerField: 1,
          fields: [{ id: 'b3', label: '$B(x) =$', expected: '21.5', alternatives: ['21,5'] }],
        },
        {
          kind: 'single',
          id: 'ks-c3',
          group: 'iii)  x1, x3, x6,  f = 18, g = 15',
          points: 1,
          variant: 'inline',
          options: [{ text: 'No, stops.' }, { text: 'Yes, does not stop.' }],
          correct: 0,
        },
        {
          kind: 'fields',
          id: 'ks-b4',
          group: 'iv)  x1, x5, x6,  f = 16, g = 11',
          pointsPerField: 1,
          fields: [{ id: 'b4', label: '$B(x) =$', expected: '22.2', alternatives: ['22,2'] }],
        },
        {
          kind: 'single',
          id: 'ks-c4',
          group: 'iv)  x1, x5, x6,  f = 16, g = 11',
          points: 1,
          variant: 'inline',
          options: [{ text: 'No, stops.' }, { text: 'Yes, does not stop.' }],
          correct: 1,
        },
      ],
    },

    {
      id: 'kruskal',
      title: 'Kruskal',
      points: 6,
      prompt: 'Consider the following graph, where the edges are drawn that have edge weights $< \\infty$.',
      promptExtra: [
        'Now, you are supposed to apply the Kruskal algorithm. Note that some subtasks inquire about the state of the algorithm before it is completely executed.',
      ],
      figure: 'gt-ss2024/kruskal',
      parts: [
        {
          kind: 'fields',
          id: 'kruskal-after-6',
          label:
            'After 6 computation steps (i.e., after the 6th edge is added), what is the sum of the edge weights of the edges that have been added so far?',
          pointsPerField: 1,
          fields: [{ id: 'sum6', expected: '30' }],
        },
        {
          kind: 'fields',
          id: 'kruskal-r-vertices',
          label: 'R-Knoten und Komponentengroessen',
          intro:
            'Determine the representative vertices (R-vertices) after 6 computation steps (i.e., after the 6th edge is added) and indicate the size of the associated components. Note: If two components of equal size get connected, the vertex with the smaller number becomes the representative vertex.',
          pointsPerField: 1,
          fields: [
            { id: 'r3', label: 'R-vertex of vertex 3:', expected: '3' },
            { id: 'size3', label: 'Size of the component belonging to vertex 3:', expected: '1' },
            { id: 'r7', label: 'R-vertex of vertex 7:', expected: '4' },
            { id: 'size7', label: 'Size of the component belonging to vertex 7:', expected: '6' },
          ],
        },
        {
          kind: 'fields',
          id: 'kruskal-mst',
          label:
            "Now, carry out Kruskal's algorithm until the end and provide the sum of the edges of the minimum spanning tree.",
          pointsPerField: 1,
          fields: [{ id: 'mst', label: 'Sum of edge weights $=$', expected: '66' }],
        },
      ],
    },

    {
      id: 'tiefensuche',
      title: 'Tiefensuche',
      points: 6,
      prompt: 'We start a depth-first search in the following graph:',
      promptExtra: [
        'Select below whether the depth-first search could mark the vertices as visited in the following sequences of vertices or not. The first vertex in the sequence of vertices represents the starting vertex, which is given to the algorithm as input.',
      ],
      note: '(Correct answer: 1 point, wrong answer: -1 point, skipped (?): 0 points.)',
      figure: 'gt-ss2024/dfs',
      parts: [
        {
          kind: 'multi',
          id: 'dfs-sequences',
          pointsPerStatement: 1,
          statements: [
            { text: '7, 10, 5, 2, 9, 4, 8, 6, 3, 1', answer: true },
            { text: '1, 6, 8, 3, 4, 9, 2, 5, 7, 10', answer: true },
            { text: '7, 1, 6, 3, 4, 9, 2, 10, 5, 8', answer: true },
            { text: '5, 7, 10, 2, 9, 4, 8, 6, 3, 1', answer: true },
            { text: '9, 1, 6, 3, 8, 4, 2, 10, 5, 7', answer: false },
            { text: '10, 7, 1, 9, 2, 5, 6, 3, 4, 8', answer: false },
          ],
        },
      ],
    },

    {
      id: 'lineare-programmierung',
      title: 'Lineare Programmierung',
      points: 6,
      prompt: 'Consider the following linear program:',
      display: [
        '\\max_{x \\in \\mathbb{R}^2} \\; -2x_1 - x_2 \\quad \\text{subject to} \\\\[4pt] 3x_1 + x_2 \\geq 9 \\\\ 5x_1 - x_2 \\leq 7 \\\\ -x_1 + x_2 \\geq 5 \\\\ x_1, x_2 \\geq 0',
      ],
      promptExtra: ['Here is a corresponding plot for your assistance:'],
      figure: 'gt-ss2024/lp-plot',
      parts: [
        {
          kind: 'fields',
          id: 'lp-vertex',
          label: 'Provide the optimal vertex:',
          pointsPerField: 1,
          layout: 'inline',
          fields: [
            { id: 'x1', label: '$x_1 =$', expected: '1' },
            { id: 'x2', label: '$x_2 =$', expected: '6' },
          ],
        },
        {
          kind: 'single',
          id: 'lp-dual-objective',
          label: 'Select the correct objective function of the dual program.',
          points: 1,
          options: [
            { text: '$\\min_{y \\in \\mathbb{R}^3} 9y_1 + 7y_2 + 5y_3$' },
            { text: '$\\min_{y \\in \\mathbb{R}^2} -2y_1 - y_2$' },
            { text: '$\\min_{y \\in \\mathbb{R}^2} 2y_1 + y_2$' },
            { text: '$\\min_{y \\in \\mathbb{R}^3} -9y_1 + 7y_2 - 5y_3$' },
          ],
          correct: 3,
        },
        {
          kind: 'multi',
          id: 'lp-dual-constraints',
          label: 'Check the constraints that are included in the dual program.',
          note:
            '(Correct answer: 0.5 points, wrong answer: -0.5 points, skipped (?): 0 points. This subtask cannot score less than 0 points.)',
          pointsPerStatement: 0.5,
          // In <= form the primal is A = [[-3,-1],[5,-1],[1,-1]], b = (-9,7,-5), c = (-2,-1);
          // the dual min b^T y, A^T y >= c, y >= 0 gives exactly A, E and F.
          statements: [
            { text: '$y_1, y_2, y_3 \\geq 0$', answer: true },
            { text: '$3y_1 + 5y_2 - y_3 \\geq -2$', answer: false },
            { text: '$y_1, y_2, y_3 \\geq 1$', answer: false },
            { text: '$y_1 - y_2 + y_3 \\geq -1$', answer: false },
            { text: '$-3y_1 + 5y_2 + y_3 \\geq -2$', answer: true },
            { text: '$-y_1 - y_2 - y_3 \\geq -1$', answer: true },
          ],
        },
      ],
    },

    {
      id: 'aussagen',
      title: 'Aussagen',
      points: 20,
      prompt: 'Answer the following questions. Several answers may be correct.',
      note: '(Correct answer: 1 point, wrong answer: -1 point, skipped (?): 0 points. Each subtask cannot score less than 0 points.)',
      parts: [
        {
          kind: 'multi',
          id: 'aussagen-tree',
          label: 'Baum',
          intro:
            'Let $T = (V, E)$ be a tree with $|V| \\geq 3$ and $x \\in V$ any vertex. Which of the following statements is always true?',
          pointsPerStatement: 1,
          statements: [
            { text: 'If $x$ is no leaf, then $T - x$ contains no cycle.', answer: true },
            { text: 'If $x$ is a leaf, then $T - x$ is connected.', answer: true },
            { text: 'If $x$ is no leaf, then $T - x$ is connected.', answer: false },
            { text: 'If $x$ is a leaf and $y$ is a neighbour of $x$, then $y$ is a leaf in $T - x$.', answer: false },
            { text: 'If $x$ is a leaf, then $T - x$ contains no cycle.', answer: true },
          ],
        },
        {
          kind: 'multi',
          id: 'aussagen-coloring',
          label: 'Faerbung',
          intro:
            'Let $G = (V, E)$ be a graph and $\\chi(G) = 7$. Which of the following statements is always true?',
          pointsPerStatement: 1,
          statements: [
            {
              text: 'There is a vertex sequence in which the greedy coloring algorithm requires at most 7 colors.',
              answer: true,
            },
            { text: '$G$ must contain at least two cycles of odd length.', answer: true },
            {
              text: 'There is a vertex sequence in which the greedy coloring algorithm requires more than 7 colors.',
              answer: false,
            },
            { text: 'There must be a vertex in $G$ that has at least 6 neighbors.', answer: true },
            { text: 'If $|V| = 7$, then $G$ must be isomorphic to $K_7$.', answer: true },
          ],
        },
        {
          kind: 'multi',
          id: 'aussagen-flow',
          label: 'Netzwerk',
          intro:
            'Let $N = (V, A, s, t, c)$ be a network, $S \\subset V$ a cut and $f : A \\to \\mathbb{R}$ a flow. Which of the following statements is always true?',
          pointsPerStatement: 1,
          statements: [
            { text: '$\\mathrm{cap}(S) = \\sum_{x \\in S, y \\in V \\setminus S} c(x,y)$', answer: true },
            { text: '$\\mathrm{val}(f) = \\sum_{x \\in S, y \\in V \\setminus S} f(x,y)$', answer: false },
            {
              text:
                'If there is an $s,t$-path in the residual network $N_f$ and an edge on this path has residual capacity $\\epsilon > 0$, then there is a flow $f\'$ in $N$ with $\\mathrm{val}(f\') \\geq \\mathrm{val}(f) + \\epsilon$.',
              answer: false,
            },
            {
              text:
                'If $\\mathrm{val}(f) \\geq \\mathrm{cap}(S)$, then there exists no $s,t$-path in the residual network $N_f$.',
              answer: true,
            },
            // The report's per-statement points fix the other four but leave this one open
            // (the marked answer and the key are consistent either way). Read as false for
            // the same reason as B: the sums ignore the flow back into s and out of t.
            { text: '$\\sum_{y \\in V} f(s,y) = \\sum_{x \\in V} f(x,t)$', answer: false, derived: true },
          ],
        },
        {
          kind: 'multi',
          id: 'aussagen-clique',
          label: 'Clique-Reduktion',
          intro:
            'Consider the problems: Clique — Input: graph $G = (V,E)$, natural number $k \\geq 4$; Question: Has $G$ a clique of size $k$? and Clique* — Input: graph $G = (V,E)$, where every two vertices have a common neighbor, natural number $k \\geq 4$; Question: Has $G$ a clique of size $k$? To prove that Clique $\\leq_p$ Clique* holds, the following transformation is proposed, which converts an input $(G,k)$ for the problem Clique into an input $(G\',k\')$ for the problem Clique* as follows: $G\'$ is formed from $G$ by first taking all vertices and edges from $G$ and then adding an additional vertex $v_{x,y}$ for each pair of vertices $x, y$ from $V$, which is connected to $x$ and to $y$. Which of the following statements are true for all graphs $G$ and every natural number $k \\geq 4$?',
          pointsPerStatement: 1,
          statements: [
            { text: 'If $G\'$ has a clique of size $k$, then $G$ has a clique of size $k$.', answer: true },
            { text: 'If $G$ has a clique of size $k$, then $G\'$ has a clique of size $k$.', answer: true },
            { text: 'In $G\'$, every two vertices always have at least one common neighbour.', answer: false },
            { text: '$G\'$ has exactly $|V| + \\binom{|V|}{2}$ vertices.', answer: true },
            { text: 'The transformation can be performed in polynomial time.', answer: true },
          ],
        },
      ],
    },

    {
      id: 'beweis',
      title: 'Beweis (schriftlich)',
      points: 10,
      prompt:
        'Let $T = (V, E)$ be a tree with $n$ vertices, where each vertex has either degree 1 or 5. Let $L$ be the number of vertices with degree 1 and $C$ be the number of vertices with degree 5. Show: $L = 3C + 2$.',
      promptExtra: ['Please solve this assignment in written form on paper.'],
      parts: [
        {
          kind: 'open',
          id: 'beweis-tree-degrees',
          points: 10,
          derived: true,
          solution:
            'Der Bericht druckt keine Musterloesung ab (nur "Punktzahl +0.0/10.0"). Beweisskizze:\n'
            + '$T$ ist ein Baum mit $n = L + C$ Knoten, hat also genau $|E| = n - 1$ Kanten.\n'
            + 'Handschlaglemma: $\\sum_{v \\in V} \\deg(v) = 2|E|$, und wegen $\\deg(v) \\in \\{1,5\\}$ ist die linke Seite $1 \\cdot L + 5 \\cdot C$.\n'
            + 'Also $L + 5C = 2(n - 1) = 2(L + C - 1) = 2L + 2C - 2$.\n'
            + 'Umstellen: $5C - 2C + 2 = 2L - L$, d.h. $L = 3C + 2$.',
        },
      ],
    },

    {
      id: 'reduktion',
      title: 'Reduktion (schriftlich)',
      points: 10,
      prompt:
        'The decision problem $\\mathrm{k-STABLE}$ is: Given a graph $G = (V,E)$ and a natural number $k \\geq 3$, has $G$ a stable set of size $k$? The decision problem $\\mathrm{k-STABLE}^*$ is: Given a connected graph $G = (V,E)$ and a natural number $k \\geq 3$, has $G$ a stable set of size $k$?',
      promptExtra: [
        'Show $\\mathrm{k-STABLE} \\leq_p \\mathrm{k-STABLE}^*$.',
        'Please solve this assignment in written form on paper.',
      ],
      parts: [
        {
          kind: 'open',
          id: 'reduktion-stable',
          points: 10,
          derived: true,
          solution:
            'Der Bericht druckt keine Musterloesung ab (nur "Punktzahl +0.0/10.0"). Beweisskizze:\n'
            + 'Transformation: Bilde aus der Eingabe $(G,k)$ von $\\mathrm{k-STABLE}$ die Eingabe $(G\',k)$ von $\\mathrm{k-STABLE}^*$, wobei $G\'$ aus $G$ entsteht, indem ein neuer Knoten $u \\notin V$ hinzugefuegt und mit jedem Knoten aus $V$ verbunden wird.\n'
            + '$G\'$ ist zusammenhaengend (jeder Knoten ist ueber $u$ erreichbar), also eine zulaessige Eingabe fuer $\\mathrm{k-STABLE}^*$.\n'
            + '"$\\Rightarrow$": Eine stabile Menge $S \\subseteq V$ von $G$ mit $|S| = k$ ist auch in $G\'$ stabil, denn $G$ ist induzierter Teilgraph von $G\'$ und $u \\notin S$.\n'
            + '"$\\Leftarrow$": Sei $S\'$ stabil in $G\'$ mit $|S\'| = k \\geq 3$. Da $u$ zu allen anderen Knoten benachbart ist, waere $S\' = \\{u\\}$, falls $u \\in S\'$ - Widerspruch zu $k \\geq 3$. Also $u \\notin S\'$, d.h. $S\' \\subseteq V$ ist stabil in $G$.\n'
            + 'Die Transformation fuegt einen Knoten und $|V|$ Kanten hinzu, laeuft also in polynomieller Zeit. Damit gilt $\\mathrm{k-STABLE} \\leq_p \\mathrm{k-STABLE}^*$.',
        },
      ],
    },

    {
      id: 'beweispuzzle',
      title: 'Beweispuzzle',
      points: 10,
      prompt:
        'Let $G = (V, E)$ be a bipartite graph with $2k$ vertices. Show that $G$ has a perfect matching if and only if $\\alpha(G) = k$.',
      promptExtra: [
        'You can drag some of the text snippets from the right side to the left side and arrange them. Not all text snippets need to be used. Use only the necessary snippets.',
      ],
      parts: [
        {
          kind: 'order',
          id: 'beweispuzzle-proof',
          intro: 'Sortieren Sie die passenden Textbausteine zu einem vollstaendigen Beweis.',
          points: 10,
          penalty: 1,
          items: [
            { id: 'c1', text: 'For the forward direction, let $M$ be a perfect matching.' },
            { id: 'c2', text: 'Each edge in $M$ has exactly one vertex from each color class.' },
            {
              id: 'c3',
              text: 'Let $S = \\emptyset$. For each edge $e \\in M$, add the vertex $v \\in e$ that lies in color class 1 to $S$.',
            },
            { id: 'c4', text: 'Since $|V| = 2k$, we have $|M| = k$.' },
            { id: 'c5', text: 'Thus, $|S| = k$, and $S$ forms an independent set.' },
            {
              id: 'c6',
              text: 'Moreover, $S$ is a maximal independent set because for each edge in $M$, at most one vertex can be used for an independent set. Therefore, $\\alpha(G) = k$.',
            },
            { id: 'c7', text: 'For the reverse direction, let $A \\cup B = V$ be the two color classes of $G$.' },
            { id: 'c8', text: 'Assume there exists a subset $U \\subseteq A$ with $|N(U)| < |U|$.' },
            { id: 'c9', text: 'Since $\\alpha(G) = k$, we have $|A| = |B| = k$.' },
            { id: 'c10', text: 'Then $B\' = (B \\setminus N(U)) \\cup U$ is an independent set' },
            { id: 'c11', text: 'and $|B\'| > |B| = k$, a contradiction.' },
            { id: 'd1', text: 'Assume there exists a subset $U \\subseteq A$ with $|N(U)| \\geq |U|$.' },
            { id: 'd2', text: 'Since $\\alpha(G) = k$, we have $|A| = |B| = \\frac{k}{2}$.' },
            { id: 'd3', text: 'Since $|V| = 2k$, we have $|M| = 2k$.' },
            {
              id: 'd4',
              text: 'Moreover, $S$ is a maximal independent set because for each edge in $M$, at most one vertex can be used for a clique. Therefore, $\\alpha(G) = k$.',
            },
            { id: 'd5', text: 'Each edge in $M$ belongs to exactly one color class.' },
            { id: 'd6', text: 'Then $B\' = (B \\setminus U) \\cup N(U)$ is an independent set.' },
            { id: 'd7', text: 'Then $B\' = (B \\setminus U) \\cup N(U)$ is a clique.' },
          ],
          solution: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10', 'c11'],
        },
      ],
    },
  ],
}
