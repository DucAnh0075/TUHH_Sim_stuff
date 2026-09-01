import type { GraphExam } from '../../types'
import { grades } from './common'

/**
 * GTOP Sommersemester 2023, Slot 2 (English), Auswertungsbericht fuer Matrikelnummer
 * 21968148 (erstellt am 27.9.2023), Prof. Dr. Anusch Taraz.
 *
 * The report is in English, so the prompts below are the printed English wording -
 * `language: 'en'`; only the app chrome around them stays German.
 *
 * The printed Notenschluessel is exactly the standard 95..50 % scheme on 100 points, so
 * `grades(100)` reproduces it row for row. The report also lists a Bonus block, but every
 * bonus row is 0.0.
 *
 * Answer keys:
 *  - Ford-Fulkerson (residual network + val(f)), Floyd-Warshall, TSP-Backtrack, Kruskal
 *    and Linear Programming (optimal vertex) print every numeric key directly as a
 *    "Loesung: ..." line - transcribed verbatim.
 *  - Ford-Fulkerson's min-cut subtask prints no key, only the awarded points per vertex
 *    (all +0.5) and the marked answers; S = { s, 1, 2, 3, 4, 5 } is read off those marks
 *    (6 and t were marked "not in cut" and scored, so the other six were marked "in cut"
 *    and scored). Flagged `derived: true`.
 *  - The Statements / DFS true-false blocks print a green/red mark plus the points per
 *    statement, so the key follows once the marked answer is known. Where the candidate
 *    skipped a statement ("?", 0.00 P) the key was re-derived mathematically and is
 *    flagged `derived: true`.
 *  - Landau Notation is an ordering with the report's own "Ihre Antwort / Loesung" columns.
 *  - Proof Puzzle: the report's two-column table gives the full block order and the unused
 *    ("Nicht genutzt") blocks - transcribed directly.
 *  - "Proof (on paper)" and "Reduction (on paper)" (10 P each) print only
 *    "Punktzahl +0.0/10.0" and "There are no comments to your answer" - no solution at
 *    all. They are `open` parts with a `derived` proof sketch for the self-check.
 *
 * Figures are cut from pdfs/gt-ss2023.pdf (git-ignored). Their `rect`s in
 * figures.manifest.json are estimated from the report's page images and should be
 * re-measured with `npm run figures -- --inspect` once the PDF is in place.
 */
export const GT_SS2023: GraphExam = {
  id: 'gt-ss2023',
  title: 'GTOP Sommersemester 2023',
  order: 4,
  language: 'en',
  totalPoints: 100,
  grades: grades(100),
  note:
    'Der Bericht weist zusaetzlich einen Bonus-Block aus (Abgaben, ILIAS), dessen Zeilen '
    + 'aber alle 0.0 sind. Bonuspunkte zaehlen ohnehin nur, wenn ohne sie mindestens eine '
    + '4.0 erreicht wurde. Ergebnis im Bericht: 58.1 Punkte, Note 3.7.',
  tasks: [
    {
      id: 'ford-fulkerson',
      title: 'Ford-Fulkerson',
      points: 12,
      prompt:
        'Consider the following directed graph $N = (V, A, s, t, c)$ with capacity '
        + '$c : A \\to \\mathbb{R}_{\\geq 0}$ and flow $f$ in $N$. The entry for each edge $e \\in A$ '
        + 'is given by $(f(e)/c(e))$.',
      figure: 'gt-ss2023/ff-network',
      parts: [
        {
          kind: 'fields',
          id: 'ff-residual',
          label: 'Residual network',
          intro:
            'Provide the residual network of $N$ in the following graph. Edges that are not present in '
            + 'the residual network should have an entry of 0.',
          pointsPerField: 0.5,
          layout: 'inline',
          fields: [
            { id: 'sa', label: '$(s,a) =$', expected: '4' },
            { id: 'as', label: '$(a,s) =$', expected: '5' },
            { id: 'sb', label: '$(s,b) =$', expected: '0' },
            { id: 'bs', label: '$(b,s) =$', expected: '1' },
            { id: 'at', label: '$(a,t) =$', expected: '0' },
            { id: 'ta', label: '$(t,a) =$', expected: '6' },
            { id: 'tb', label: '$(t,b) =$', expected: '0' },
            { id: 'bt', label: '$(b,t) =$', expected: '7' },
            { id: 'ab', label: '$(a,b) =$', expected: '3' },
            { id: 'ba', label: '$(b,a) =$', expected: '3' },
          ],
        },
        {
          kind: 'fields',
          id: 'ff-value',
          label: 'Provide the flow value of an optimal flow $f$.',
          pointsPerField: 3,
          fields: [{ id: 'val-f', label: '$\\mathrm{val}(f) =$', expected: '9' }],
        },
        {
          kind: 'multi',
          id: 'ff-min-cut',
          label: 'Minimum cut',
          intro:
            'Now, for a new network, the residual network of a maximum flow is given. Determine the '
            + 'minimum cut by selecting the vertices that are included in the minimum cut.',
          note:
            '(Correct answer: 0.5 points, wrong answer: -0.5 points, skipped (?): 0 points. This subtask '
            + 'cannot score less than 0 points.)',
          figure: 'gt-ss2023/ff-min-cut',
          derived: true,
          pointsPerStatement: 0.5,
          // No key is printed; each vertex scored +0.5, and 6 / t were marked "not in cut",
          // so S = the other six vertices: { s, 1, 2, 3, 4, 5 }.
          statements: [
            { text: '$s$', answer: true },
            { text: '$1$', answer: true },
            { text: '$2$', answer: true },
            { text: '$3$', answer: true },
            { text: '$4$', answer: true },
            { text: '$5$', answer: true },
            { text: '$6$', answer: false },
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
        'Given is a simple directed graph $G_1 = (V_1, E_1, \\ell_1)$, with $\\ell_1 : E_1 \\to \\mathbb{R}$. '
        + 'Furthermore, let $d^k_{i,j}$ be defined as in the Floyd-Warshall algorithm.',
      figure: 'gt-ss2023/floyd-warshall',
      parts: [
        {
          kind: 'fields',
          id: 'fw-values',
          label: 'Now, determine the values of the following $d^k_{i,j}$:',
          pointsPerField: 2,
          fields: [
            { id: 'd246', label: '$d^2_{4,6} =$', expected: 'inf' },
            { id: 'd462', label: '$d^4_{6,2} =$', expected: '4' },
            { id: 'd728', label: '$d^7_{2,8} =$', expected: '8' },
          ],
        },
        {
          kind: 'fields',
          id: 'fw-matrix',
          label: 'Determine the following values of the matrix $D^4$:',
          intro:
            'Now we consider a new graph $G_2 = (V_2, E_2, \\ell_2)$ with $\\ell_2 : E_2 \\to \\mathbb{R}$ '
            + 'and $|V_2| = 5$. In general, the matrix $D^k = (d^k_{i,j})_{1 \\leq i,j \\leq n} \\in '
            + '\\mathbb{Z}^{n \\times n}$ has the usual form. Now, let us consider the matrix '
            + '$D^3 \\in \\mathbb{Z}^{5 \\times 5}$ with $D^3 = (d^3_{i,j})_{1 \\leq i,j \\leq 5}$:',
          display: [
            'D^3 = \\begin{pmatrix} 0 & 3 & 8 & 1 & 6 \\\\ 5 & 0 & 5 & 6 & 3 \\\\ '
            + '4 & -1 & 0 & 5 & -2 \\\\ \\infty & \\infty & \\infty & 0 & 3 \\\\ 8 & 3 & 4 & 9 & 0 '
            + '\\end{pmatrix}',
          ],
          pointsPerField: 2,
          fields: [
            { id: 'd442', label: '$d^4_{4,2} =$', expected: 'inf' },
            { id: 'd415', label: '$d^4_{1,5} =$', expected: '4' },
            { id: 'd423', label: '$d^4_{2,3} =$', expected: '5' },
          ],
        },
      ],
    },

    {
      id: 'tsp-backtrack',
      title: 'TSP-Backtrack',
      points: 8,
      prompt:
        'Consider the following graph. You are now supposed to apply the '
        + '$\\text{TSP-Backtrack}_{MST}$ algorithm. For this, the following partial tours are given: '
        + '$P_1 : (4, 3, 5)$, $P_2 : (1, 2, 3)$, $P_3 : (3, 4, 2)$, $P_4 : (3, 2, 4)$.',
      promptExtra: ['Furthermore, the currently shortest found tour has the value $\\text{opt } f = 18$.'],
      note:
        'Determine the cost $B(P_i)$ for the given partial tours $i \\in [4]$ and indicate whether the '
        + '$\\text{TSP-Backtrack}_{MST}$ algorithm would continue investigating this partial tour.',
      figure: 'gt-ss2023/tsp-backtrack',
      parts: [
        {
          kind: 'fields',
          id: 'tsp-b1',
          group: 'i)  $P_1 : (4, 3, 5)$',
          label: '$B(P_1) =$',
          pointsPerField: 1,
          fields: [{ id: 'b1', expected: '17' }],
        },
        {
          kind: 'single',
          id: 'tsp-c1',
          group: 'i)  $P_1 : (4, 3, 5)$',
          points: 1,
          variant: 'inline',
          options: [{ text: 'No, it does not continue.' }, { text: 'Yes, it continues.' }],
          correct: 1,
        },
        {
          kind: 'fields',
          id: 'tsp-b2',
          group: 'ii)  $P_2 : (1, 2, 3)$',
          label: '$B(P_2) =$',
          pointsPerField: 1,
          fields: [{ id: 'b2', expected: '17' }],
        },
        {
          kind: 'single',
          id: 'tsp-c2',
          group: 'ii)  $P_2 : (1, 2, 3)$',
          points: 1,
          variant: 'inline',
          options: [{ text: 'No, it does not continue.' }, { text: 'Yes, it continues.' }],
          correct: 1,
        },
        {
          kind: 'fields',
          id: 'tsp-b3',
          group: 'iii)  $P_3 : (3, 4, 2)$',
          label: '$B(P_3) =$',
          pointsPerField: 1,
          fields: [{ id: 'b3', expected: '20' }],
        },
        {
          kind: 'single',
          id: 'tsp-c3',
          group: 'iii)  $P_3 : (3, 4, 2)$',
          points: 1,
          variant: 'inline',
          options: [{ text: 'No, it does not continue.' }, { text: 'Yes, it continues.' }],
          correct: 0,
        },
        {
          kind: 'fields',
          id: 'tsp-b4',
          group: 'iv)  $P_4 : (3, 2, 4)$',
          label: '$B(P_4) =$',
          pointsPerField: 1,
          fields: [{ id: 'b4', expected: '21' }],
        },
        {
          kind: 'single',
          id: 'tsp-c4',
          group: 'iv)  $P_4 : (3, 2, 4)$',
          points: 1,
          variant: 'inline',
          options: [{ text: 'No, it does not continue.' }, { text: 'Yes, it continues.' }],
          correct: 0,
        },
      ],
    },

    {
      id: 'kruskal',
      title: 'Kruskal',
      points: 6,
      prompt:
        'Consider the following graph, where the edges are drawn that have edge weights $< \\infty$.',
      promptExtra: [
        'Now, you are supposed to apply the Kruskal algorithm. Note that some subtasks inquire about '
        + 'the state of the algorithm before it is completely executed.',
      ],
      figure: 'gt-ss2023/kruskal',
      parts: [
        {
          kind: 'fields',
          id: 'kruskal-after-6',
          label:
            'After 6 computation steps (i.e., after the 6th edge is added), what is the sum of the edge '
            + 'weights of the edges that have been added so far?',
          pointsPerField: 1,
          fields: [{ id: 'sum6', expected: '34' }],
        },
        {
          kind: 'fields',
          id: 'kruskal-r-vertices',
          label: 'R-vertices and component sizes',
          intro:
            'Determine the representative vertices (R-vertices) after 6 computation steps (i.e., after '
            + 'the 6th edge is added) and indicate the size of the associated components. Note: If two '
            + 'components of equal size get connected, the vertex with the smaller number becomes the '
            + 'representative vertex.',
          pointsPerField: 1,
          fields: [
            { id: 'r4', label: 'R-vertex of vertex 4:', expected: '1' },
            { id: 'size4', label: 'Size of the component belonging to vertex 4:', expected: '4' },
            { id: 'r5', label: 'R-vertex of vertex 5:', expected: '5' },
            { id: 'size5', label: 'Size of the component belonging to vertex 5:', expected: '1' },
          ],
        },
        {
          kind: 'fields',
          id: 'kruskal-mst',
          label:
            "Now, carry out Kruskal's algorithm until the end and provide the sum of the edges of the "
            + 'minimum spanning tree.',
          pointsPerField: 1,
          fields: [{ id: 'mst', expected: '73' }],
        },
      ],
    },

    {
      id: 'depth-first-search',
      title: 'Depth-First Search',
      points: 6,
      prompt: 'We start a depth-first search in the following graph:',
      promptExtra: [
        'Select below whether the depth-first search could mark the vertices as visited in the '
        + 'following sequences of vertices or not. The first vertex in the sequence of vertices '
        + 'represents the starting vertex, which is given to the algorithm as input.',
      ],
      note: '(Correct answer: 1 point, wrong answer: -1 point, skipped (?): 0 points.)',
      figure: 'gt-ss2023/dfs',
      parts: [
        {
          kind: 'multi',
          id: 'dfs-sequences',
          pointsPerStatement: 1,
          statements: [
            { text: '10, 8, 6, 2, 3, 1, 9, 5, 7, 4', answer: true },
            { text: '7, 5, 8, 10, 3, 2, 6, 9, 1, 4', answer: true },
            { text: '4, 8, 3, 1, 10, 2, 9, 6, 5, 7', answer: false },
            { text: '4, 8, 3, 9, 2, 6, 5, 7, 10, 1', answer: false },
            { text: '10, 8, 7, 4, 6, 3, 9, 1, 2, 5', answer: false },
            { text: '8, 4, 10, 3, 1, 9, 2, 6, 5, 7', answer: true },
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
        '\\min_{x \\in \\mathbb{R}^2} \\; -3x_1 - x_2 \\quad \\text{subject to} \\\\[4pt] '
        + '-6x_1 + 7x_2 \\leq 1 \\\\ 4x_1 - 3x_2 \\leq 1 \\\\ -x_1 + 2x_2 \\leq 6 \\\\ x_1, x_2 \\geq 0',
      ],
      promptExtra: ['Here is a corresponding plot for your assistance:'],
      figure: 'gt-ss2023/lp-plot',
      parts: [
        {
          kind: 'fields',
          id: 'lp-vertex',
          label: 'Provide the optimal vertex:',
          pointsPerField: 1,
          layout: 'inline',
          fields: [
            { id: 'x1', label: '$x_1 =$', expected: '1' },
            { id: 'x2', label: '$x_2 =$', expected: '1' },
          ],
        },
        {
          kind: 'single',
          id: 'lp-dual-objective',
          label: 'Select the correct objective function of the dual program.',
          points: 1,
          options: [
            { text: '$\\max_{y \\in \\mathbb{R}^3} -y_1 - y_2 - 6y_3$' },
            { text: '$\\max_{y \\in \\mathbb{R}^3} y_1 + y_2 + 6y_3$' },
            { text: '$\\max_{y \\in \\mathbb{R}^2} 3y_1 + y_2$' },
            { text: '$\\max_{y \\in \\mathbb{R}^2} -3y_1 - y_2$' },
          ],
          correct: 0,
        },
        {
          kind: 'multi',
          id: 'lp-dual-constraints',
          label: 'Check the constraints that are included in the dual program.',
          note:
            '(Correct answer: 0.5 points, wrong answer: -0.5 points, skipped (?): 0 points. This subtask '
            + 'cannot score less than 0 points.)',
          pointsPerStatement: 0.5,
          // Primal (min c^T x, Ax <= b, x >= 0) with A = [[-6,7],[4,-3],[-1,2]], b = (1,1,6),
          // c = (-3,-1). Dual: max -b^T y, -A^T y <= c, y >= 0 -> rows B, C, D.
          statements: [
            { text: '$y_1, y_2, y_3 \\geq 1$', answer: false },
            { text: '$6y_1 - 4y_2 + y_3 \\leq -3$', answer: true },
            { text: '$-7y_1 + 3y_2 - 2y_3 \\leq -1$', answer: true },
            { text: '$y_1, y_2, y_3 \\geq 0$', answer: true },
            { text: '$7y_1 - 3y_2 + 2y_3 \\leq -1$', answer: false },
            { text: '$-6y_1 + 4y_2 - y_3 \\leq -3$', answer: false },
          ],
        },
      ],
    },

    {
      id: 'statements',
      title: 'Statements',
      points: 15,
      prompt: 'Answer the following questions. There can be multiple correct answers.',
      note:
        '(Correct answer: 1 point, wrong answer: -1 point, skipped (?): 0 points. The subtask cannot '
        + 'score less than 0 points.) Der Bericht druckt keinen Loesungsschluessel ab - die Antworten '
        + 'unten folgen aus der markierten Antwort und den vergebenen Punkten je Aussage; die '
        + 'uebersprungenen Aussagen ("?", 0.00 P) wurden mathematisch nachgerechnet und sind '
        + '`derived`.',
      parts: [
        {
          kind: 'multi',
          id: 'statements-planar',
          label: 'Planar, connected graph',
          intro:
            'Let $G = (V, E, R)$ be a planar, connected graph with at least 4 vertices. Which of the '
            + 'following statements are always true?',
          pointsPerStatement: 1,
          statements: [
            { text: '$G$ has at least $|V| - 1$ edges.', answer: true },
            { text: '$G$ has at least one vertex with fewer than 6 neighbors.', answer: true },
            { text: '$G$ has at most $3|V| - 7$ edges.', answer: false },
            { text: '$G$ is 5-colorable.', answer: true },
            {
              text: '$G$ has at least one vertex $x$, such that $G - x$ is still connected.',
              answer: true,
              derived: true,
            },
          ],
        },
        {
          kind: 'multi',
          id: 'statements-matching',
          label: 'Matching and vertex cover',
          intro: 'Let $G$ be a graph. Which of the following statements are always true?',
          pointsPerStatement: 1,
          statements: [
            { text: '$G$ has a perfect matching.', answer: false },
            {
              text:
                'If $M$ is a matching in $G$ and $S$ is a vertex cover in $G$, then $|M| \\leq |S|$.',
              answer: true,
              derived: true,
            },
            { text: '$G$ has a minimum cardinality vertex cover.', answer: true, derived: true },
            {
              text:
                'If $M$ is a matching in $G$ and $S$ is a vertex cover in $G$ and $|M| = |S|$, then '
                + '$M$ must be perfect.',
              answer: false,
              derived: true,
            },
            {
              text:
                'If $M$ is a perfect matching in $G$ and $S$ is a vertex cover in $G$, then '
                + '$|M| = |S|$.',
              answer: false,
              derived: true,
            },
          ],
        },
        {
          kind: 'multi',
          id: 'statements-reduction',
          label: 'Reduction $A \\leq_p B$',
          intro:
            'Assuming the reduction $A \\leq_p B$ is shown using a transformation $f$. Which of the '
            + 'following statements are always true?',
          pointsPerStatement: 1,
          statements: [
            {
              text:
                'The transformation $f$ must convert every yes-instance of $A$ into a yes-instance '
                + 'of $B$.',
              answer: true,
            },
            { text: 'The transformation $f$ must be injective.', answer: false, derived: true },
            {
              text:
                'The transformation $f$ must convert every no-instance of $A$ into a no-instance '
                + 'of $B$.',
              answer: true,
              derived: true,
            },
            {
              text: 'The transformation $f$ must be computable in polynomial time.',
              answer: true,
            },
            { text: 'The transformation $f$ must be surjective.', answer: false, derived: true },
          ],
        },
      ],
    },

    {
      id: 'landau-notation',
      title: 'Landau Notation',
      points: 5,
      prompt:
        'Sort the functions in such a way that $f(n)$ appears above $g(n)$ exactly when '
        + '$f(n) = \\mathcal{O}(g(n))$.',
      promptExtra: ['All logarithms are to the base $e = 2.71828\\ldots$'],
      parts: [
        {
          kind: 'order',
          id: 'landau-order',
          points: 5,
          penalty: 0.5,
          items: [
            { id: 'f1', text: '$100^{100}$' },
            { id: 'f2', text: '$\\log(100 n^{100})$' },
            { id: 'f3', text: '$n^{0.01}$' },
            { id: 'f4', text: '$n^{100} - n^{99}$' },
            { id: 'f5', text: '$1.01^{0.01n}$' },
            { id: 'f6', text: '$\\sum_{k=0}^{99} \\frac{n^k}{k!}$' },
          ],
          // Slowest first (f above g iff f = O(g)):
          //   const < log n < n^{0.01} < Theta(n^{99}) < Theta(n^{100}) < 1.01^{0.01n}.
          solution: ['f1', 'f2', 'f3', 'f6', 'f4', 'f5'],
        },
      ],
    },

    {
      id: 'proof',
      title: 'Proof (schriftlich)',
      points: 10,
      prompt:
        'Let $G = (V, E)$ be a connected graph with $|E| \\leq 4|V| - 12$. Show that $G$ contains at '
        + 'least 4 vertices with a degree of at most 7.',
      promptExtra: ['Please solve this assignment in written form on paper.'],
      parts: [
        {
          kind: 'open',
          id: 'proof-low-degree',
          points: 10,
          derived: true,
          solution:
            'Der Bericht druckt keine Musterloesung ab (nur "Punktzahl +0.0/10.0"). Beweisskizze '
            + '(Widerspruch):\n'
            + 'Aus $|E| \\leq 4|V| - 12$ folgt $4|V| - 12 \\geq 0$, also $|V| \\geq 3$; da $G$ '
            + 'zusammenhaengend ist, hat kein Knoten Grad 0.\n'
            + 'Sei $L = \\{ v \\in V : \\deg(v) \\leq 7 \\}$ und angenommen $|L| \\leq 3$. Dann haben '
            + 'mindestens $|V| - 3$ Knoten Grad $\\geq 8$, also\n'
            + '$\\sum_{v \\in V} \\deg(v) \\geq 8(|V| - 3) = 8|V| - 24$.\n'
            + 'Andererseits liefert das Handschlaglemma '
            + '$\\sum_{v \\in V} \\deg(v) = 2|E| \\leq 2(4|V| - 12) = 8|V| - 24$.\n'
            + 'Also gilt ueberall Gleichheit: jeder Knoten ausserhalb $L$ hat Grad genau 8 und '
            + 'jeder Knoten in $L$ hat Grad genau 0. Ein Knoten mit Grad 0 widerspricht aber dem '
            + 'Zusammenhang ($|V| \\geq 3$). Widerspruch, also $|L| \\geq 4$.',
        },
      ],
    },

    {
      id: 'reduction',
      title: 'Reduction (schriftlich)',
      points: 10,
      prompt:
        'The decision problem $\\mathrm{CLIQUE}$ is: Given a graph $G$ and a number $k \\in \\mathbb{N}$ '
        + 'with $k \\geq 3$, does $G$ contain a clique of size $k$? The decision problem '
        + '$\\mathrm{CLIQUE}^*$ is: Given a graph $G$ that contains a perfect matching, and a number '
        + '$k \\in \\mathbb{N}$ with $k \\geq 3$, does $G$ contain a clique of size $k$?',
      promptExtra: [
        'Show $\\mathrm{CLIQUE} \\leq_p \\mathrm{CLIQUE}^*$. Hint: One possible transformation doubles '
        + 'the number of vertices in $G$.',
        'Please solve this assignment in written form on paper.',
      ],
      parts: [
        {
          kind: 'open',
          id: 'reduction-clique',
          points: 10,
          derived: true,
          solution:
            'Der Bericht druckt keine Musterloesung ab (nur "Punktzahl +0.0/10.0"). Skizze:\n'
            + 'Transformation: Aus der Eingabe $(G, k)$ mit $G = (V, E)$ bilde $(G\', k)$, wobei $G\'$ '
            + 'aus $G$ entsteht, indem fuer jeden Knoten $v \\in V$ ein neuer Knoten $v\'$ hinzugefuegt '
            + 'und ausschliesslich mit $v$ verbunden wird (also ein perfektes Matching '
            + '$\\{\\{v, v\'\\} : v \\in V\\}$ auf $V \\cup V\'$). Dann ist $|V(G\')| = 2|V|$ und $G\'$ hat '
            + 'ein perfektes Matching - $(G\', k)$ ist also eine zulaessige $\\mathrm{CLIQUE}^*$-Eingabe.\n'
            + 'Korrektheit: Jeder neue Knoten $v\'$ hat in $G\'$ Grad 1, kann also in keiner Clique der '
            + 'Groesse $\\geq 3$ liegen (dort braucht jeder Knoten $\\geq 2$ Nachbarn innerhalb der '
            + 'Clique). Jede Clique der Groesse $k \\geq 3$ in $G\'$ liegt daher vollstaendig in $V$ '
            + 'und ist eine Clique in $G$; umgekehrt ist jede $k$-Clique von $G$ auch eine in $G\'$. '
            + 'Also hat $G\'$ genau dann eine $k$-Clique, wenn $G$ eine hat.\n'
            + 'Die Konstruktion fuegt $|V|$ Knoten und $|V|$ Kanten hinzu, laeuft also in '
            + 'polynomieller Zeit. Damit gilt $\\mathrm{CLIQUE} \\leq_p \\mathrm{CLIQUE}^*$.',
        },
      ],
    },

    {
      id: 'proof-puzzle',
      title: 'Proof Puzzle (only 6 LP)',
      points: 10,
      prompt: 'Let $T = (V, E)$ be a tree. Show that $T$ contains at most one perfect matching.',
      promptExtra: [
        'You can drag some of the text snippets from the right side to the left side and arrange them. '
        + 'Not all text snippets need to be used. Use only the necessary snippets.',
      ],
      parts: [
        {
          kind: 'order',
          id: 'proof-puzzle-proof',
          intro: 'Sortieren Sie die passenden Textbausteine zu einem vollstaendigen Beweis.',
          points: 10,
          penalty: 1,
          items: [
            { id: 'c1', text: 'Let $M_1$ and $M_2$ be two perfect matchings of $T$.' },
            {
              id: 'c2',
              text:
                'Let $\\tilde M := M_1 \\triangle M_2$ be the set of edges that are contained in '
                + 'exactly one of the matchings.',
            },
            { id: 'c3', text: 'Furthermore, let $\\tilde T = (V, \\tilde M)$.' },
            { id: 'c4', text: 'Since $M_1$ and $M_2$ are perfect matchings,' },
            {
              id: 'c5',
              text:
                'for each vertex $v \\in V$, we can find an edge $e_1 \\in M_1$ with $v \\in e_1$ and '
                + 'an edge $e_2 \\in M_2$ with $v \\in e_2$ and',
            },
            { id: 'c6', text: 'thus, every vertex in $\\tilde T$ has a degree of 0 or 2.' },
            { id: 'c7', text: 'Therefore, $\\tilde T$ consists of cycles and isolated vertices.' },
            { id: 'c8', text: 'However, since $\\tilde T \\subseteq T$ and $T$ is a tree,' },
            { id: 'c9', text: '$\\tilde T$ cannot contain cycles.' },
            {
              id: 'c10',
              text: 'Consequently, we have $\\tilde M = \\emptyset$ and therefore $M_1 = M_2$.',
            },
            { id: 'd1', text: 'thus, every vertex in $\\tilde T$ has at least a degree of 1.' },
            {
              id: 'd2',
              text:
                'Hence, we find a matching $M\'$ with $|M\'| > |M_1|$ or $|M\'| > |M_2|$ and thus one '
                + 'of $M_1$ and $M_2$ cannot be perfect.',
            },
            {
              id: 'd3',
              text:
                'Let $\\tilde M := M_1 \\cap M_2$ be the set of edges that are contained in both '
                + 'matchings.',
            },
            { id: 'd4', text: 'Therefore, $\\tilde T$ consists of augmenting paths.' },
          ],
          solution: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10'],
        },
      ],
    },
  ],
}
