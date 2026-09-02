import type { GraphExam } from '../../types'
import { grades } from './common'

/**
 * GTOP Sommersemester 2025, Auswertungsbericht fuer Matrikelnummer 529017 (erstellt am
 * 20.8.2025), Prof. Dr. Anusch Taraz.
 *
 * The report is in English, so the prompts below are the printed English wording -
 * `language: 'en'`; only the app chrome around them stays German.
 *
 * The printed Notenschluessel is exactly the standard 95..50 % scheme on 100 points, so
 * `grades(100)` reproduces it row for row. The report also lists a Bonus block, but every
 * bonus row is 0.0, so there is nothing to note.
 *
 * Answer keys:
 *  - Graph Parameter, Kruskal (R-vertices), Dijkstra, Linear Programming and Floyd-Warshall
 *    print every key directly as a "Loesung: ..." line - transcribed verbatim.
 *  - Ford-Fulkerson's residual network prints only "richtig" per edge, not the values; the
 *    ten residual weights below are computed from the fully-specified flow figure
 *    (s->a 1/6, s->b 1/1, a->b 0/7, b->a 1/3, a->t 2/2, b->t 0/1) and match the report's
 *    pink boxes (1,5 / 0,1 / 0,2 / 0,1 / 8,2). `val(f) = 3` is printed.
 *  - Ford-Fulkerson's min-cut subtask prints no key either; the S-side { s, b } is read off
 *    the residual-network figure (only s->b leaves s, and b is a dead end) and matches the
 *    awarded per-vertex points (s,a,b,c,d each +0.5, t skipped).
 *  - Statements (VIP): the report prints no key, only the marked answer (green/red) and the
 *    awarded points per statement. Each key was re-derived mathematically and cross-checked
 *    against those marks; the five statements the candidate skipped ("?", 0.00) are
 *    `derived: true`.
 *  - Proof and Reduction are solved on paper; the report prints only "Punktzahl +x/10.0".
 *    They are `open` parts with a `derived` solution sketch for the self-check.
 *
 * Figures are cut from pdfs/gt-ss2025.pdf (git-ignored, not yet present). Their `rect`s in
 * figures.manifest.json are estimated from the report's page images and should be
 * re-measured with `npm run figures -- --inspect` once the PDF is in place.
 */
export const GT_SS2025: GraphExam = {
  id: 'gt-ss2025',
  title: 'GTOP Sommersemester 2025',
  order: 8,
  language: 'en',
  totalPoints: 100,
  grades: grades(100),
  tasks: [
    {
      id: 'graph-parameter',
      title: 'Graph Parameter',
      points: 10,
      prompt: 'Consider the following graph $G$:',
      figure: 'gt-ss2025/graph-parameter',
      parts: [
        {
          kind: 'fields',
          id: 'gp-values',
          label: 'Determine the following graph parameters:',
          note:
            'Hint: $\\omega(G)$ is the clique number of $G$, $\\chi(G)$ is the chromatic number of $G$, '
            + '$\\alpha(G)$ is the independence number of $G$, $\\tau(G)$ is the size of a smallest vertex '
            + 'cover of $G$, and $\\nu(G)$ is the size of a largest matching in $G$.',
          pointsPerField: 2,
          fields: [
            { id: 'omega', label: '$\\omega(G) =$', expected: '4' },
            { id: 'chi', label: '$\\chi(G) =$', expected: '4' },
            { id: 'alpha', label: '$\\alpha(G) =$', expected: '4' },
            { id: 'tau', label: '$\\tau(G) =$', expected: '4' },
            { id: 'nu', label: '$\\nu(G) =$', expected: '3' },
          ],
        },
      ],
    },

    {
      id: 'kruskal',
      title: 'Kruskal',
      points: 8,
      prompt: 'Consider the following graph with weighted edges:',
      figure: 'gt-ss2025/kruskal',
      parts: [
        {
          kind: 'order',
          id: 'kruskal-edge-order',
          label: 'Edge order',
          intro:
            "Apply Kruskal's algorithm and sort the edges in the order in which they are added to the "
            + 'MST. Note that not all edges will be included in the MST (the four remaining edges are '
            + 'the distractors).',
          note: 'There can be multiple correct solutions.',
          points: 4,
          penalty: 0.5,
          items: [
            { id: 'e15', text: '$\\{1, 5\\}$' },
            { id: 'e56', text: '$\\{5, 6\\}$' },
            { id: 'e24', text: '$\\{2, 4\\}$' },
            { id: 'e28', text: '$\\{2, 8\\}$' },
            { id: 'e34', text: '$\\{3, 4\\}$' },
            { id: 'e59', text: '$\\{5, 9\\}$' },
            { id: 'e79', text: '$\\{7, 9\\}$' },
            { id: 'e89', text: '$\\{8, 9\\}$' },
            { id: 'e16', text: '$\\{1, 6\\}$' },
            { id: 'e23', text: '$\\{2, 3\\}$' },
            { id: 'e36', text: '$\\{3, 6\\}$' },
            { id: 'e67', text: '$\\{6, 7\\}$' },
          ],
          solution: ['e15', 'e56', 'e24', 'e28', 'e34', 'e59', 'e79', 'e89'],
        },
        {
          kind: 'fields',
          id: 'kruskal-r-vertices',
          label: 'R-vertices',
          intro:
            'Now you are supposed to determine the R-vertex of different vertices after a certain number '
            + 'of edges are added to the MST. To make the solution unique, apply the following rule: If '
            + 'the two components being merged are of the same size, the vertex with the smaller number '
            + 'becomes the representative vertex.',
          pointsPerField: 2,
          fields: [
            { id: 'r4', label: 'R-vertex of vertex 4 after 6 edges are added:', expected: '2' },
            { id: 'r7', label: 'R-vertex of vertex 7 after 7 edges are added:', expected: '1' },
          ],
        },
      ],
    },

    {
      id: 'dijkstra',
      title: 'Dijkstra',
      points: 8,
      prompt: 'Consider the following graph with weighted edges:',
      figure: 'gt-ss2025/dijkstra',
      parts: [
        {
          kind: 'fields',
          id: 'dijkstra-dist',
          label:
            "Apply Dijkstra's algorithm with starting vertex 1, and determine the dist-value of the "
            + 'following vertices after a specified amount of vertices have left the vertex set $M$.',
          pointsPerField: 2,
          fields: [
            { id: 'd2', label: 'dist-value of vertex 2 when the 5th vertex just left $M$:', expected: '11' },
            { id: 'd3', label: 'dist-value of vertex 3 when the 5th vertex just left $M$:', expected: 'inf' },
            { id: 'd6', label: 'dist-value of vertex 6 when the 4th vertex just left $M$:', expected: '3' },
            { id: 'd7', label: 'dist-value of vertex 7 when the 6th vertex just left $M$:', expected: '14' },
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
        '\\min_{x \\in \\mathbb{R}^2} \\; 3x_1 - x_2 \\quad \\text{subject to} \\\\[4pt] '
        + '5x_1 - 2x_2 \\geq 3 \\\\ 6x_1 - x_2 \\geq 5 \\\\ x_1 + x_2 \\geq 9 \\\\ x_1, x_2 \\geq 0',
      ],
      promptExtra: ['Here is a corresponding plot for your assistance:'],
      figure: 'gt-ss2025/lp-plot',
      parts: [
        {
          kind: 'fields',
          id: 'lp-vertex',
          label: 'Provide the optimal vertex:',
          pointsPerField: 1,
          layout: 'inline',
          fields: [
            { id: 'x1', label: '$x_1 =$', expected: '3' },
            { id: 'x2', label: '$x_2 =$', expected: '6' },
          ],
        },
        {
          kind: 'fields',
          id: 'lp-dual',
          label: 'Dual problem',
          intro:
            'Fill in the missing values to create the correct dual problem. If you want to write '
            + '$-y_i$, please fill in -1 in the respective field.',
          display: [
            '\\max_{y \\in \\mathbb{R}^3} \\; \\square\\, y_1 + \\square\\, y_2 + \\square\\, y_3 '
            + '\\quad \\text{subject to} \\\\[4pt] '
            + '5y_1 + 6y_2 + \\square\\, y_3 \\leq \\square \\\\ '
            + '-2y_1 + \\square\\, y_2 + \\square\\, y_3 \\leq \\square \\\\ y_1, y_2, y_3 \\geq 0',
          ],
          pointsPerField: 0.5,
          fields: [
            { id: 'obj-y1', label: 'Objective, coefficient of $y_1$:', expected: '3' },
            { id: 'obj-y2', label: 'Objective, coefficient of $y_2$:', expected: '5' },
            { id: 'obj-y3', label: 'Objective, coefficient of $y_3$:', expected: '9' },
            { id: 'c1-y3', label: '1st constraint, coefficient of $y_3$:', expected: '1' },
            { id: 'c1-rhs', label: '1st constraint, right-hand side:', expected: '3' },
            { id: 'c2-y2', label: '2nd constraint, coefficient of $y_2$:', expected: '-1' },
            { id: 'c2-y3', label: '2nd constraint, coefficient of $y_3$:', expected: '1' },
            { id: 'c2-rhs', label: '2nd constraint, right-hand side:', expected: '-1' },
          ],
        },
      ],
    },

    {
      id: 'floyd-warshall',
      title: 'Floyd Warshall',
      points: 8,
      prompt:
        'Given is a simple directed graph $G_1 = (V_1, E_1, \\ell_1)$, with $\\ell_1 : E_1 \\to \\mathbb{R}$. '
        + 'Furthermore, let $d^k_{i,j}$ be defined as in the Floyd-Warshall algorithm.',
      figure: 'gt-ss2025/floyd-warshall',
      parts: [
        {
          kind: 'fields',
          id: 'fw-values',
          label: 'Now, determine the values of the following $d^k_{i,j}$:',
          pointsPerField: 2,
          fields: [
            { id: 'd613', label: '$d^6_{1,3} =$', expected: '8' },
            { id: 'd418', label: '$d^4_{1,8} =$', expected: '7' },
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
            'D^3 = \\begin{pmatrix} 0 & 6 & 3 & 0 & 7 \\\\ \\infty & 0 & \\infty & 4 & \\infty \\\\ '
            + '0 & 3 & 0 & -3 & 4 \\\\ \\infty & \\infty & \\infty & 0 & 3 \\\\ 4 & 7 & 4 & -2 & 0 \\end{pmatrix}',
          ],
          pointsPerField: 2,
          fields: [
            { id: 'd442', label: '$d^4_{4,2} =$', expected: 'inf' },
            { id: 'd413', label: '$d^4_{1,3} =$', expected: '3' },
          ],
        },
      ],
    },

    {
      id: 'ford-fulkerson',
      title: 'Ford-Fulkerson',
      points: 10,
      prompt:
        'Consider the following directed graph $N = (V, A, s, t, c)$ with capacity '
        + '$c : A \\to \\mathbb{R}_{\\geq 0}$ and flow $f$ in $N$. The entry for each edge $e \\in A$ '
        + 'is given by $(f(e)/c(e))$.',
      figure: 'gt-ss2025/ff-network',
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
            { id: 'sa', label: '$(s,a) =$', expected: '5' },
            { id: 'as', label: '$(a,s) =$', expected: '1' },
            { id: 'sb', label: '$(s,b) =$', expected: '0' },
            { id: 'bs', label: '$(b,s) =$', expected: '1' },
            { id: 'at', label: '$(a,t) =$', expected: '0' },
            { id: 'ta', label: '$(t,a) =$', expected: '2' },
            { id: 'tb', label: '$(t,b) =$', expected: '0' },
            { id: 'bt', label: '$(b,t) =$', expected: '1' },
            { id: 'ab', label: '$(a,b) =$', expected: '8' },
            { id: 'ba', label: '$(b,a) =$', expected: '2' },
          ],
        },
        {
          kind: 'fields',
          id: 'ff-value',
          label: 'Provide the flow value of an optimal flow $f$.',
          pointsPerField: 2,
          fields: [{ id: 'val-f', label: '$\\mathrm{val}(f) =$', expected: '3' }],
        },
        {
          kind: 'multi',
          id: 'ff-min-cut',
          label: 'Minimum cut',
          intro:
            'Now, for a new network, the residual network of a maximum flow is given. Determine the '
            + 'minimum cut by selecting the vertices that are included in the minimum cut.',
          figure: 'gt-ss2025/ff-min-cut',
          note:
            '(Correct answer: 0.5 points, wrong answer: -0.5 points, skipped (?): 0 points. This subtask '
            + 'cannot score less than 0 points.)',
          derived: true,
          pointsPerStatement: 0.5,
          statements: [
            { text: '$s$', answer: true },
            { text: '$a$', answer: false },
            { text: '$b$', answer: true },
            { text: '$c$', answer: false },
            { text: '$d$', answer: false },
            { text: '$t$', answer: false },
          ],
        },
      ],
    },

    {
      id: 'statements-vip',
      title: 'Statements (VIP)',
      points: 30,
      prompt: 'Answer the following questions. Several answers may be correct.',
      note:
        '(Correct answer: 1 point, wrong answer: -1 point, skipped (?): 0 points. Each subtask cannot '
        + 'score less than 0 points.) Der Bericht druckt keinen Loesungsschluessel ab - die Antworten '
        + 'unten wurden aus der markierten Antwort und den vergebenen Punkten je Aussage rekonstruiert '
        + 'und mathematisch nachgerechnet; die uebersprungenen Aussagen sind `derived`.',
      parts: [
        {
          kind: 'multi',
          id: 'vip-block1',
          label: 'Zwei Dreiecke',
          intro:
            'Let $G = (V, E)$ be a graph with $V = \\{a, b, c, d, e, f\\}$ and '
            + '$E = \\{\\{a,b\\}, \\{b,c\\}, \\{a,c\\}, \\{c,d\\}, \\{d,e\\}, \\{e,f\\}, \\{d,f\\}\\}$. '
            + 'Which of the following statements hold?',
          pointsPerStatement: 1,
          statements: [
            {
              text:
                'There is an ordering of the vertices with which the Greedy-Colouring-Algorithm will '
                + 'need more than 3 colours for $G$.',
              answer: true,
              derived: true,
            },
            {
              text: 'For every $e \\in E$ the graph $G - e$ has an induced subgraph that is isomorphic to $K_3$.',
              answer: true,
            },
            { text: '$\\mathrm{dist}_G(a, e) = 5$.', answer: false },
            { text: 'There is a $b,f$-walk of length 5 in $G$.', answer: true },
            { text: '$\\alpha(G) + \\omega(G) = 6$.', answer: false },
          ],
        },
        {
          kind: 'multi',
          id: 'vip-block2',
          label: '10 Knoten, 5 Kanten',
          intro:
            'Let $G = (V, E)$ be a graph with $|V| = 10$ and $|E| = 5$. Which of the following '
            + 'statements must always hold?',
          pointsPerStatement: 1,
          statements: [
            {
              text: 'If $G$ has no isolated vertices, then $G$ has a vertex $v \\in V$ with $\\deg(v) = 1$.',
              answer: true,
            },
            { text: '$G$ does not contain a tree on more than 5 vertices as a subgraph.', answer: false },
            { text: '$G$ is not connected.', answer: true },
            { text: '$G$ does not have more than 5 different connected components.', answer: false },
            { text: '$G$ has a matching with 5 edges.', answer: false },
          ],
        },
        {
          kind: 'multi',
          id: 'vip-block3',
          label: 'Kruskal / R-Knoten',
          intro:
            'Let $T_i$ be the graph containing exactly $i$ edges that is constructed while using the '
            + 'algorithm of Kruskal on a weighted, connected graph $G$ with $n$ vertices and $m$ edges. '
            + 'Which of the following statements are always true?',
          pointsPerStatement: 1,
          statements: [
            {
              text:
                "If you run Kruskal's algorithm with an arbitrary ordering of the edges, then it will "
                + 'still produce a spanning tree of $G$ and it will have a runtime of $O(m \\log(n))$.',
              answer: true,
            },
            {
              text:
                'If vertices $x$ and $y$ of $G$ have the same R-vertex, then they are in the same '
                + 'connected component of $T_i$.',
              answer: true,
            },
            {
              text:
                'For every R-vertex $v$, the set of vertices for which it is the R-vertex changes in at '
                + 'most $O(\\log n)$ rounds.',
              answer: false,
              derived: true,
            },
            {
              text: 'For every vertex $v$, its R-vertex changes in at most $O(\\log n)$ rounds.',
              answer: true,
              derived: true,
            },
            {
              text:
                'If vertices $x$ and $y$ of $G$ are in the same connected component of $T_i$, then they '
                + 'have the same R-vertex.',
              answer: true,
            },
          ],
        },
        {
          kind: 'multi',
          id: 'vip-block4',
          label: 'Matching / Vertex Cover',
          intro:
            'Let $G = (V, E)$ be a graph with a matching $M \\subseteq E$ and a vertex cover '
            + '$S \\subseteq V$. Which of the following statements are always true?',
          pointsPerStatement: 1,
          statements: [
            { text: 'If $2|M| = |V|$, then $G$ is bipartite.', answer: false },
            {
              text:
                'If there is no larger matching than $M$ and no smaller vertex cover than $S$, then '
                + '$|M| = |S|$.',
              answer: false,
            },
            { text: '$|M| \\leq |S|$.', answer: true },
            { text: 'If $|S| = |M|$, then there cannot be a matching $M^*$ with $|M^*| > |M|$.', answer: true },
            {
              text:
                'If $G$ is bipartite and $|M| < |V|/4$, there must be a matching $M^*$ in $G$ such that '
                + '$|M^*| > |M|$.',
              answer: false,
              derived: true,
            },
          ],
        },
        {
          kind: 'multi',
          id: 'vip-block5',
          label: 'Planarer Graph',
          intro:
            'Let $G = (V, E, R)$ be a plane graph and let $x, y, z \\in V$ such that '
            + '$e = \\{x, y\\} \\in E$ and $f = \\{y, z\\} \\notin E$. Which of the following statements '
            + 'are always true?',
          pointsPerStatement: 1,
          statements: [
            {
              text: 'If $G - e$ has exactly two connected components, we have $|V| - |E| + |R| = 3$.',
              answer: false,
            },
            { text: '$G - e$ is planar.', answer: true },
            {
              text:
                'If $G$ is connected and $G + f$ is plane, then $G + f$ has one more region than $G$.',
              answer: true,
            },
            { text: '$G$ has at least one vertex $v$ with $\\deg(v) \\leq 7$.', answer: true, derived: true },
            { text: 'We have $|V| - |E| + |R| = 2$.', answer: false },
          ],
        },
        {
          kind: 'multi',
          id: 'vip-block6',
          label: 'P und NP',
          intro:
            'Suppose that $A$ and $B$ are decision problems such that $A \\in \\mathrm{P}$ and '
            + '$B \\in \\mathrm{NP}$. Which of the following statements are always true?',
          pointsPerStatement: 1,
          statements: [
            {
              text:
                'If $C \\leq_p B$ for all decision problems $C \\in \\mathrm{NP}$, then $B$ is '
                + '$\\mathrm{NP}$-complete.',
              answer: true,
            },
            { text: 'If $B \\leq_p A$, then $\\mathrm{P} = \\mathrm{NP}$.', answer: false },
            { text: 'If $A \\leq_p B$, then $B$ is $\\mathrm{NP}$-complete.', answer: false },
            {
              text:
                'If $C \\leq_p B$ for all decision problems $C \\in \\mathrm{NP}$, then '
                + '$\\mathrm{P} = \\mathrm{NP}$.',
              answer: false,
            },
            { text: '$A \\notin \\mathrm{NP}$.', answer: false },
          ],
        },
      ],
    },

    {
      id: 'proof',
      title: 'Proof (schriftlich)',
      points: 10,
      prompt:
        'A 2-tree $T = (V, E)$ is a graph that fulfills one of the following two properties: '
        + '(1) $T$ is isomorphic to $K_3$. (2) There is a vertex $v \\in V$ with $\\deg(v) = 2$, '
        + '$N(v) \\in E$ (i.e. the two neighbours of $v$ are connected by an edge), and $T - v$ is a 2-tree.',
      promptExtra: [
        '(a) Draw a 2-tree on 6 vertices.',
        '(b) Show: If $T$ is a 2-tree, then $T$ does not contain a subdivision of $K_4$. (Hint: Induction.)',
        'Please solve this assignment in written form on paper.',
      ],
      parts: [
        {
          kind: 'open',
          id: 'proof-2tree',
          points: 10,
          derived: true,
          solution:
            'Der Bericht druckt keine Musterloesung ab (nur "Punktzahl +0.0/10.0"). Skizze:\n'
            + '(a) Starte mit dem Dreieck $\\{1,2,3\\}$. Fuege 4 mit Nachbarn $\\{1,2\\}$ hinzu, dann 5 '
            + 'mit Nachbarn $\\{2,3\\}$, dann 6 mit Nachbarn $\\{3,4\\}$. Jeder neue Knoten hat Grad 2 und '
            + 'seine beiden Nachbarn sind benachbart - also ein 2-Baum auf 6 Knoten.\n'
            + '(b) Induktion ueber $|V|$. Basis: $T = K_3$ hat nur 3 Knoten und kann keine Unterteilung '
            + 'von $K_4$ enthalten (die 4 Verzweigungsknoten mit Grad 3 braucht). Schritt: Sei $T$ ein '
            + '2-Baum mit $|V| > 3$, also gibt es $v$ mit $\\deg(v) = 2$, dessen Nachbarn $a, b$ benachbart '
            + 'sind, und $T - v$ ist ein 2-Baum. Nach IV enthaelt $T - v$ keine $K_4$-Unterteilung. '
            + 'Angenommen $T$ enthaelt eine $K_4$-Unterteilung $H$. Da $\\deg_T(v) = 2$, ist $v$ kein '
            + 'Verzweigungsknoten von $H$ (die haben Grad 3), sondern hoechstens innerer Knoten eines '
            + 'unterteilten Pfades. Entfernt man $v$ und nutzt die bereits vorhandene Kante $\\{a,b\\}$ als '
            + 'Abkuerzung, erhaelt man eine $K_4$-Unterteilung in $T - v$ - Widerspruch. Also enthaelt $T$ '
            + 'keine Unterteilung von $K_4$.',
        },
      ],
    },

    {
      id: 'reduction',
      title: 'Reduction (schriftlich)',
      points: 10,
      prompt:
        'The decision problem $3-\\mathrm{COL}$ is: Given a graph $G = (V, E)$, does $G$ have chromatic '
        + 'number at most 3? The decision problem $3-\\mathrm{COL}^*$ is: Given a graph $G = (V, E)$ with '
        + '$\\tau(G) \\geq \\frac{|V|}{2}$ where $\\tau(G)$ is the size of a smallest vertex cover of $G$, '
        + 'does $G$ have chromatic number at most 3?',
      promptExtra: [
        'Show $3-\\mathrm{COL} \\leq_p 3-\\mathrm{COL}^*$.',
        'Please solve this assignment in written form on paper.',
      ],
      parts: [
        {
          kind: 'open',
          id: 'reduction-3col',
          points: 10,
          derived: true,
          solution:
            'Der Bericht druckt keine Musterloesung ab (nur "Punktzahl +3.0/10.0"). Skizze:\n'
            + 'Transformation: Bilde aus der Eingabe $G = (V, E)$ von $3-\\mathrm{COL}$ die Eingabe $G\'$ von '
            + '$3-\\mathrm{COL}^*$, indem $|V|$ paarweise disjunkte Dreiecke (je $K_3$ auf frischen Knoten) '
            + 'disjunkt zu $G$ hinzugefuegt werden. Dann ist $|V(G\')| = |V| + 3|V| = 4|V|$.\n'
            + 'Zulaessigkeit: Ein Dreieck braucht Knotenueberdeckung 2, also $\\tau(G\') = \\tau(G) + 2|V| '
            + '\\geq 2|V| = \\frac{|V(G\')|}{2}$. Die $\\tau(G\') \\geq |V(G\')|/2$-Bedingung ist erfuellt.\n'
            + 'Korrektheit: Die Zusammenhangskomponenten von $G\'$ sind $G$ und die Dreiecke; also '
            + '$\\chi(G\') = \\max(\\chi(G), 3)$. Damit gilt $\\chi(G\') \\leq 3 \\iff \\chi(G) \\leq 3$.\n'
            + 'Die Konstruktion fuegt $3|V|$ Knoten und $3|V|$ Kanten hinzu, laeuft also in polynomieller '
            + 'Zeit. Damit gilt $3-\\mathrm{COL} \\leq_p 3-\\mathrm{COL}^*$.',
        },
      ],
    },
  ],
}
