import type { Task } from '../types'

/**
 * All tasks are taken verbatim from the exam screenshots (German ones translated) or
 * from the VIPS practice quizzes. Only add REAL questions here - never invented ones.
 *
 * `source: 'vips'` marks the VIPS tasks. They come without an official answer key, so
 * every answer there was derived by an AI - the UI warns about that. Where the two VIPS
 * variants of a question offered different options, the statements are merged into one
 * task.
 *
 * Markup in `prompt`, `promptExtra`, `text`:
 *   $...$  -> KaTeX, e.g. '$\\chi(G) = 7$'
 *
 * Careful: in normal strings backslashes must be doubled ('\\sum').
 *
 * `answer: true` means the statement is TRUE ("✓"), `false` means FALSE ("✗").
 * Where a statement was skipped ("?", 0.00 points) in the screenshot, the exam gives
 * no key - those answers are derived mathematically and marked with a comment.
 */
export const TASKS: Task[] = [
  {
    kind: 'multi',
    id: 'tree-remove-vertex',
    title: 'Trees',
    prompt:
      'Let $T = (V, E)$ be a tree with $|V| \\geq 3$ and $x \\in V$ any vertex. Which of the following statements is always true?',
    pointsPerStatement: 1,
    statements: [
      { text: 'If $x$ is no leaf, then $T - x$ contains no cycle.', answer: true },
      { text: 'If $x$ is a leaf, then $T - x$ is connected.', answer: true },
      { text: 'If $x$ is no leaf, then $T - x$ is connected.', answer: false },
      {
        text: 'If $x$ is a leaf and $y$ is a neighbour of $x$, then $y$ is a leaf in $T - x$.',
        answer: false,
      },
      { text: 'If $x$ is a leaf, then $T - x$ contains no cycle.', answer: true },
    ],
  },
  {
    kind: 'multi',
    id: 'chromatic-number-7',
    title: 'Chromatic number',
    prompt:
      'Let $G = (V, E)$ be a graph and $\\chi(G) = 7$. Which of the following statements is always true?',
    pointsPerStatement: 1,
    statements: [
      {
        text: 'There is a vertex sequence in which the greedy coloring algorithm requires at most 7 colors.',
        answer: true,
      },
      { text: '$G$ must contain at least two cycles of odd length.', answer: true },
      {
        // Depending on the ordering greedy may use up to $\Delta + 1$ colors, hence more than $\chi(G)$.
        text: 'There is a vertex sequence in which the greedy coloring algorithm requires more than 7 colors.',
        answer: true,
      },
      { text: 'There must be a vertex in $G$ that has at least 6 neighbors.', answer: true },
      { text: 'If $|V| = 7$, then $G$ must be isomorphic to $K_7$.', answer: true },
    ],
  },
  {
    kind: 'multi',
    id: 'network-flow-cut',
    title: 'Networks and flows',
    prompt:
      'Let $N = (V, A, s, t, c)$ be a network, $S \\subset V$ a cut and $f : A \\to \\mathbb{R}$ a flow. Which of the following statements is always true?',
    pointsPerStatement: 1,
    statements: [
      {
        text: '$\\operatorname{cap}(S) = \\sum_{x \\in S,\\, y \\in V \\setminus S} c(x, y)$',
        answer: true,
      },
      {
        text: '$\\operatorname{val}(f) = \\sum_{x \\in S,\\, y \\in V \\setminus S} f(x, y)$',
        answer: false,
      },
      {
        text: 'If there is an $s,t-$path in the residual network $N_f$ and an edge on this path has residual capacity $\\epsilon > 0$, then there is a flow $f\'$ in $N$ with $\\operatorname{val}(f\') \\geq \\operatorname{val}(f) + \\epsilon$.',
        answer: false,
      },
      {
        text: 'If $\\operatorname{val}(f) \\geq \\operatorname{cap}(S)$, then there exists no $s,t-$path in the residual network $N_f$.',
        answer: true,
      },
      { text: '$\\sum_{y \\in V} f(s, y) = \\sum_{x \\in V} f(x, t)$', answer: false },
    ],
  },
  {
    kind: 'multi',
    id: 'clique-reduction',
    title: 'Clique $\\leq_p$ Clique*',
    prompt: 'Consider the problems:',
    promptExtra: [
      'Clique:\nInput: graph $G = (V, E)$, natural number $k \\geq 4$.\nQuestion: Has $G$ a clique of size $k$?',
      'and',
      'Clique*:\nInput: graph $G = (V, E)$, where every two vertices have a common neighbor, natural number $k \\geq 4$.\nQuestion: Has $G$ a clique of size $k$?',
      'To prove that Clique $\\leq_p$ Clique* holds, the following transformation is proposed, which converts an input $(G, k)$ for the problem Clique into an input $(G\', k\')$ for the problem Clique* as follows:\n$G\'$ is formed from $G$ by first taking all vertices and edges from $G$ and then adding an additional vertex $v_{x,y}$ for each pair of vertices $x, y$ from $V$, which is connected to $x$ and to $y$.',
      'Which of the following statements are true for all graphs $G$ and every natural number $k \\geq 4$?',
    ],
    pointsPerStatement: 1,
    statements: [
      {
        text: 'If $G\'$ has a clique of size $k$, then $G$ has a clique of size $k$.',
        answer: true,
      },
      {
        // $G$ is a subgraph of $G'$, so the clique survives.
        text: 'If $G$ has a clique of size $k$, then $G\'$ has a clique of size $k$.',
        answer: true,
      },
      {
        // $v_{x,y}$ and $v_{a,b}$ with disjoint pairs have no common neighbour.
        text: 'In $G\'$, every two vertices always have at least one common neighbour.',
        answer: false,
      },
      { text: '$G\'$ has exactly $|V| + \\binom{|V|}{2}$ vertices.', answer: true },
      { text: 'The transformation can be performed in polynomial time.', answer: true },
    ],
  },
  {
    kind: 'multi',
    id: 'concrete-graph-abcdef',
    title: 'Concrete graph on 6 vertices',
    prompt:
      'Let $G = (V, E)$ be a graph with $V = \\{a, b, c, d, e, f\\}$ and $E = \\{\\{a,b\\}, \\{b,c\\}, \\{a,c\\}, \\{c,d\\}, \\{d,e\\}, \\{e,f\\}, \\{d,f\\}\\}$. Which of the following statements hold?',
    pointsPerStatement: 1,
    statements: [
      {
        // Skipped in the exam. Order $a, b, e, f, d, c$ forces greedy to use 4 colours.
        text: 'There is an ordering of the vertices with which the Greedy-Colouring-Algorithm will need more than 3 colours for $G$.',
        answer: true,
      },
      {
        text: 'For every $e \\in E$ the graph $G - e$ has an induced subgraph that is isomorphic to $K_3$.',
        answer: true,
      },
      { text: '$\\operatorname{dist}_G(a, e) = 5$.', answer: false },
      { text: 'There is an $b, f$-walk of length 5 in $G$.', answer: true },
      { text: '$\\alpha(G) + \\omega(G) = 6$.', answer: false },
    ],
  },
  {
    kind: 'multi',
    id: 'ten-vertices-five-edges',
    title: '10 vertices, 5 edges',
    prompt:
      'Let $G = (V, E)$ be a graph with $|V| = 10$ and $|E| = 5$. Which of the following statements must always hold?',
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
    id: 'kruskal',
    title: "Kruskal's algorithm",
    prompt:
      'Let $T_i$ be the graph containing exactly $i$ edges that is constructed while using the algorithm of Kruskal on a weighted, connected graph $G$ with $n$ vertices and $m$ edges. Which of the following statements are always true?',
    pointsPerStatement: 1,
    statements: [
      {
        text: "If you run Kruskal's algorithm with an arbitrary ordering of the edges, then it will still produce a spanning tree of $G$ and it will have a runtime of $O(m\\log(n))$.",
        answer: true,
      },
      {
        text: 'If vertices $x$ and $y$ of $G$ have the same R-vertex, then they are in the same connected component of $T_i$.',
        answer: true,
      },
      {
        // Skipped in the exam. Union by size: while $v$ stays the R-vertex its set at least doubles.
        text: 'For every R-vertex $v$, the set of vertices for which it is the R-vertex changes in at most $O(\\log n)$ rounds.',
        answer: true,
      },
      {
        // Skipped in the exam. Each change of a vertex's R-vertex at least doubles its component.
        text: 'For every vertex $v$, its R-vertex changes in at most $O(\\log n)$ rounds.',
        answer: true,
      },
      {
        text: 'If vertices $x$ and $y$ of $G$ are in the same connected component of $T_i$, then they have the same R-vertex.',
        answer: true,
      },
    ],
  },
  {
    kind: 'multi',
    id: 'matching-vertex-cover',
    title: 'Matching and vertex cover',
    prompt:
      'Let $G = (V, E)$ be a graph with a matching $M \\subseteq E$ and a vertex cover $S \\subseteq V$. Which of the following statements are always true?',
    pointsPerStatement: 1,
    statements: [
      { text: 'If $2|M| = |V|$, then $G$ is bipartite.', answer: false },
      {
        text: 'If there is no larger matching than $M$ and no smaller vertex cover than $S$, then $|M| = |S|$.',
        answer: false,
      },
      { text: '$|M| \\leq |S|$.', answer: true },
      {
        text: 'If $|S| = |M|$, then there cannot be a matching $M^*$ with $|M^*| > |M|$.',
        answer: true,
      },
      {
        // Skipped in the exam. Counterexample: a star $K_{1,n}$ with $n > 3$ and $|M| = 1$.
        text: 'If $G$ is bipartite and $|M| < |V|/4$, there must be a matching $M^*$ in $G$ such that $|M^*| > |M|$.',
        answer: false,
      },
    ],
  },
  {
    kind: 'multi',
    id: 'plane-graph-edges',
    title: 'Plane graphs',
    prompt:
      'Let $G = (V, E, R)$ be a plane graph and let $x, y, z \\in V$ such that $e = \\{x, y\\} \\in E$ and $f = \\{y, z\\} \\notin E$. Which of the following statements are always true?',
    pointsPerStatement: 1,
    statements: [
      {
        text: 'If $G$ has exactly two connected components, we have $|V| - |E| + |R| = 3$.',
        answer: true,
      },
      { text: '$G - e$ is planar.', answer: true },
      {
        text: 'If $G$ is connected and $G + f$ is plane, then $G + f$ has one more region than $G$.',
        answer: true,
      },
      {
        // Skipped in the exam. Every planar graph has a vertex of degree at most 5.
        text: '$G$ has at least one vertex $v$ with $\\deg(v) \\leq 7$.',
        answer: true,
      },
      { text: 'We have $|V| - |E| + |R| = 2$.', answer: false },
    ],
  },
  {
    kind: 'multi',
    id: 'p-vs-np',
    title: 'P and NP',
    prompt:
      'Suppose that $A$ and $B$ are decision problems such that $A \\in \\mathrm{P}$ and $B \\in \\mathrm{NP}$. Which of the following statements are always true?',
    pointsPerStatement: 1,
    statements: [
      {
        text: 'If $C \\leq_p B$ for all decision problems $C \\in \\mathrm{NP}$, then $B$ is NP-complete.',
        answer: true,
      },
      { text: 'If $B \\leq_p A$, then $\\mathrm{P} = \\mathrm{NP}$.', answer: false },
      { text: 'If $A \\leq_p B$, then $B$ is NP-complete.', answer: false },
      {
        text: 'If $C \\leq_p B$ for all decision problems $C \\in \\mathrm{NP}$, then $\\mathrm{P} = \\mathrm{NP}$.',
        answer: false,
      },
      { text: '$A \\notin \\mathrm{NP}$.', answer: false },
    ],
  },
  {
    kind: 'multi',
    id: 'plane-connected-regions',
    title: 'Plane connected graphs',
    prompt:
      'Let $G = (V, E, R)$ be a plane, connected graph with $|V| \\geq 3$ and $x \\in V$ any vertex. Which of the following statements always hold?',
    pointsPerStatement: 1,
    statements: [
      { text: 'If $|R| = 1$, then $G$ must be a tree.', answer: true },
      {
        // Skipped in the exam. A cycle with a pendant vertex is no tree but has a leaf.
        text: 'If $G$ is not a tree, then $x$ cannot be a leaf either.',
        answer: false,
      },
      { text: 'If $G$ is a tree, then $|R| = 1$ must hold.', answer: true },
      { text: 'If $|R| = 2$, then $G$ has exactly one cycle.', answer: true },
      {
        // Skipped in the exam. A theta graph has 3 regions but three cycles.
        text: 'If $|R| = 3$, then $G$ has exactly two cycles.',
        answer: false,
      },
    ],
  },
  {
    kind: 'multi',
    id: 'walks-paths-components',
    title: 'Walks, paths and components',
    prompt:
      'Let $G = (V, E)$ be a graph and $x, y, z \\in V$ three arbitrary, pairwise distinct vertices. Which of the following statements always hold?',
    pointsPerStatement: 1,
    statements: [
      {
        // Skipped in the exam. Walks may repeat edges, so there are infinitely many of them.
        text: 'If $x$ and $y$ lie in the same connected component of $G$, then there are more $x,y-$walks than $x,y-$paths in $G$.',
        answer: true,
      },
      { text: 'There are at most $\\frac{|V|}{2}$ connected components in $G$.', answer: false },
      {
        text: 'If there is an $x,y-$path in $G$ and a $y,z-$path in $G$, then there is also an $x,z-$path in $G$.',
        answer: true,
      },
      {
        text: 'If $x$, $y$ and $z$ lie in the same connected component and this connected component contains a $3-$clique, then there exists an $x,y-$path that does not contain $z$.',
        answer: false,
      },
      {
        // Skipped in the exam. On a shortest $x,y-$path of length 4 the vertices $v_0, v_2, v_4$ are independent.
        text: 'If $\\operatorname{dist}_G(x, y) = 4$ holds, then $\\alpha(G) \\geq 3$ follows.',
        answer: true,
      },
    ],
  },
  {
    kind: 'multi',
    id: 'floyd-warshall',
    title: 'Floyd-Warshall',
    prompt:
      'Let $G$ be a weighted, directed graph on $n \\geq 7$ vertices without negative cycles and let $\\mathcal{P}^k_{i,j}$ and $d^k_{i,j}$ be defined as in the algorithm of Floyd-Warshall. Which of the following statements always hold?',
    pointsPerStatement: 1,
    statements: [
      {
        text: '$d^5_{1,2}$ is computed only once $d^4_{i,j}$ has been computed for all $i, j \\in [n]$.',
        answer: true,
      },
      { text: '$d^3_{i,i} = 0$ for all $i \\in [n]$.', answer: true },
      { text: '$d^4_{i,j} \\geq 0$ for all $i, j \\in [n]$.', answer: false },
      {
        // Skipped in the exam. $d^k_{i,j}$ is the minimum over $\mathcal{P}^k_{i,j}$, not the length of every path.
        text: 'The length of every path in $\\mathcal{P}^k_{i,j}$ equals $d^k_{i,j}$.',
        answer: false,
      },
      {
        text: '$d^k_{a,c} \\leq d^k_{a,b} + d^k_{b,c}$ for all $a, b, c, k \\in [n]$.',
        answer: false,
      },
    ],
  },
  {
    kind: 'multi',
    id: 'hamiltonian-cycle-reduction',
    title: 'Hamiltonian cycle $\\leq_p$ Hamiltonian cycle*',
    prompt: 'Consider the problems:',
    promptExtra: [
      'Hamiltonian cycle:\nInput: graph $G = (V, E)$.\nQuestion: Has $G$ a Hamiltonian cycle?',
      'and',
      'Hamiltonian cycle*:\nInput: bipartite graph $G = (V, E)$.\nQuestion: Has $G$ a Hamiltonian cycle?',
      'To prove that Hamiltonian cycle $\\leq_p$ Hamiltonian cycle* holds, the following transformation is proposed, which converts an input $G$ for the problem Hamiltonian cycle into an input $G\'$ for the problem Hamiltonian cycle* as follows:\n$G\'$ is formed from $G$ by first taking all vertices and edges from $G$ and then subdividing every edge $\\{x, y\\}$ from $E$ by an additional vertex $w_{x,y}$.',
      'Which of the following statements are true for all graphs $G$?',
    ],
    pointsPerStatement: 1,
    statements: [
      {
        text: 'If $G\'$ has a Hamiltonian cycle, then $G$ has a Hamiltonian cycle.',
        answer: true,
      },
      { text: 'The transformation can be performed in polynomial time.', answer: true },
      {
        // A Hamiltonian cycle in $G'$ would have to use every subdivision vertex, i.e. every edge of $G$.
        text: 'If $G$ has a Hamiltonian cycle, then $G\'$ has a Hamiltonian cycle.',
        answer: false,
      },
      {
        // Skipped in the exam. Every edge of $G'$ joins an original vertex to a subdivision vertex.
        text: '$G\'$ is bipartite.',
        answer: true,
      },
      { text: '$G\'$ has exactly $|V| + |E|$ vertices.', answer: true },
    ],
  },
  {
    kind: 'multi',
    id: 'planar-connected-4',
    title: 'Planar connected graphs',
    prompt:
      'Let $G = (V, E, R)$ be a planar, connected graph with at least 4 vertices. Which of the following statements are always true?',
    pointsPerStatement: 1,
    statements: [
      { text: '$G$ has at least $|V| - 1$ edges.', answer: true },
      { text: '$G$ has at least one vertex with fewer than 6 neighbors.', answer: true },
      { text: '$G$ has at most $3|V| - 7$ edges.', answer: false },
      { text: '$G$ is 5-colorable.', answer: true },
      {
        // Confirmed by the German exam screenshot. Every connected graph has at least two
        // non-cut vertices (e.g. two leaves of a spanning tree).
        text: '$G$ has at least one vertex $x$, such that $G - x$ is still connected.',
        answer: true,
      },
    ],
  },
  {
    kind: 'multi',
    id: 'matching-vertex-cover-basics',
    title: 'Matchings and vertex covers',
    prompt: 'Let $G$ be a graph. Which of the following statements are always true?',
    pointsPerStatement: 1,
    statements: [
      { text: '$G$ has a perfect matching.', answer: false },
      {
        // Confirmed by the German exam screenshot. Every edge of $M$ needs its own vertex in $S$.
        text: 'If $M$ is a matching in $G$ and $S$ is a vertex cover in $G$, then $|M| \\leq |S|$.',
        answer: true,
      },
      {
        // Confirmed by the German exam screenshot. $V$ is a vertex cover and finite, so a smallest one exists.
        text: '$G$ has a minimum cardinality vertex cover.',
        answer: true,
      },
      {
        // Confirmed by the German exam screenshot. Counterexample: the path $a, b, c$ with $M = \{\{a,b\}\}$, $S = \{b\}$.
        text: 'If $M$ is a matching in $G$ and $S$ is a vertex cover in $G$ and $|M| = |S|$, then $M$ must be perfect.',
        answer: false,
      },
      {
        // Confirmed by the German exam screenshot. $S$ need not be minimum, e.g. $S = V$.
        text: 'If $M$ is a perfect matching in $G$ and $S$ is a vertex cover in $G$, then $|M| = |S|$.',
        answer: false,
      },
    ],
  },
  {
    kind: 'multi',
    id: 'reduction-transformation',
    title: 'Polynomial time reduction',
    prompt:
      'Assuming the reduction $A \\leq_p B$ is shown using a transformation $f$. Which of the following statements are always true?',
    pointsPerStatement: 1,
    statements: [
      {
        text: 'The transformation $f$ must convert every yes-instance of $A$ into a yes-instance of $B$.',
        answer: true,
      },
      { text: 'The transformation $f$ must be injective.', answer: false },
      {
        text: 'The transformation $f$ must convert every no-instance of $A$ into a no-instance of $B$.',
        answer: true,
      },
      { text: 'The transformation $f$ must be computable in polynomial time.', answer: true },
      { text: 'The transformation $f$ must be surjective.', answer: false },
    ],
  },
  {
    kind: 'single',
    id: 'sat-vertex-cover-at-most-one',
    title: 'SAT: at most one vertex per position',
    prompt:
      'Which formula ensures that for each of the $k$ vertices of the vertex cover at most one vertex from $V$ can be assigned?',
    promptExtra: [
      'Let $n, k \\in \\mathbb{N}$ be arbitrary and let $G = (V, E)$ be a graph on the vertex set $V = \\{v_1, \\ldots, v_n\\}$. A SAT formula can be given that is satisfiable exactly if $G$ has a vertex cover of size $k$.',
      'For this let $e_{i,j}$ with $i \\neq j \\in [n]$ each be $\\{0, 1\\}$-variables that are 1 exactly if $\\{v_i, v_j\\} \\in E$. Furthermore let $x_{i,j}$ with $i \\in [n]$ and $j \\in [k]$ also be $\\{0, 1\\}$-variables stating that vertex $v_i$ shall be the $j$-th vertex of the vertex cover. The SAT formula shall guarantee that every satisfying assignment actually represents a vertex cover of size $k$. In the following, two parts of such a SAT formula are to be determined.',
    ],
    points: 2,
    options: [
      {
        text: '$\\bigwedge_{1 \\leq j \\leq k} \\bigvee_{1 \\leq i_1 \\leq n} \\bigvee_{\\substack{1 \\leq i_2 \\leq n \\\\ i_1 \\neq i_2}} (\\overline{x_{i_1,j}} \\vee \\overline{x_{i_2,j}})$',
        correct: false,
      },
      {
        text: '$\\bigwedge_{1 \\leq j \\leq k} \\bigwedge_{1 \\leq i_1 \\leq n} \\bigwedge_{\\substack{1 \\leq i_2 \\leq n \\\\ i_1 \\neq i_2}} (\\overline{x_{i_1,j}} \\wedge \\overline{x_{i_2,j}})$',
        correct: false,
      },
      {
        text: '$\\bigwedge_{1 \\leq j \\leq k} \\bigvee_{1 \\leq i_1 \\leq n} \\bigvee_{\\substack{1 \\leq i_2 \\leq n \\\\ i_1 \\neq i_2}} (\\overline{x_{i_1,j}} \\wedge \\overline{x_{i_2,j}})$',
        correct: false,
      },
      {
        text: '$\\bigwedge_{1 \\leq j \\leq k} \\bigwedge_{1 \\leq i_1 \\leq n} \\bigwedge_{\\substack{1 \\leq i_2 \\leq n \\\\ i_1 \\neq i_2}} (\\overline{x_{i_1,j}} \\vee \\overline{x_{i_2,j}})$',
        correct: true,
      },
    ],
  },
  {
    kind: 'single',
    id: 'sat-vertex-cover-edge-covered',
    title: 'SAT: every edge is covered',
    prompt: 'Which formula ensures that every edge must have an endpoint in the vertex cover?',
    promptExtra: [
      'Let $n, k \\in \\mathbb{N}$ be arbitrary and let $G = (V, E)$ be a graph on the vertex set $V = \\{v_1, \\ldots, v_n\\}$. A SAT formula can be given that is satisfiable exactly if $G$ has a vertex cover of size $k$.',
      'For this let $e_{i,j}$ with $i \\neq j \\in [n]$ each be $\\{0, 1\\}$-variables that are 1 exactly if $\\{v_i, v_j\\} \\in E$. Furthermore let $x_{i,j}$ with $i \\in [n]$ and $j \\in [k]$ also be $\\{0, 1\\}$-variables stating that vertex $v_i$ shall be the $j$-th vertex of the vertex cover. The SAT formula shall guarantee that every satisfying assignment actually represents a vertex cover of size $k$. In the following, two parts of such a SAT formula are to be determined.',
    ],
    points: 2,
    options: [
      {
        text: '$\\bigwedge_{1 \\leq i_1 \\leq n} \\bigwedge_{\\substack{1 \\leq i_2 \\leq n \\\\ i_1 \\neq i_2}} e_{i_1,i_2} \\vee ((\\bigvee_{1 \\leq j \\leq k} x_{i_1,j}) \\vee ((\\bigvee_{1 \\leq j \\leq k} x_{i_2,j})))$',
        correct: false,
      },
      {
        text: '$\\bigwedge_{1 \\leq i_1 \\leq n} \\bigwedge_{\\substack{1 \\leq i_2 \\leq n \\\\ i_1 \\neq i_2}} \\overline{e_{i_1,i_2}} \\vee ((\\bigwedge_{1 \\leq j \\leq k} x_{i_1,j}) \\vee ((\\bigwedge_{1 \\leq j \\leq k} x_{i_2,j})))$',
        correct: false,
      },
      {
        text: '$\\bigwedge_{1 \\leq i_1 \\leq n} \\bigwedge_{\\substack{1 \\leq i_2 \\leq n \\\\ i_1 \\neq i_2}} e_{i_1,i_2} \\vee ((\\bigwedge_{1 \\leq j \\leq k} x_{i_1,j}) \\vee ((\\bigwedge_{1 \\leq j \\leq k} x_{i_2,j})))$',
        correct: false,
      },
      {
        text: '$\\bigwedge_{1 \\leq i_1 \\leq n} \\bigwedge_{\\substack{1 \\leq i_2 \\leq n \\\\ i_1 \\neq i_2}} \\overline{e_{i_1,i_2}} \\vee ((\\bigvee_{1 \\leq j \\leq k} x_{i_1,j}) \\vee ((\\bigvee_{1 \\leq j \\leq k} x_{i_2,j})))$',
        correct: true,
      },
    ],
  },
  {
    kind: 'multi',
    id: 'subgraph-spanning-tree',
    title: 'Subgraphs and spanning trees',
    prompt:
      'Let $G = (V, E)$ be a connected graph with $|V| \\geq 5$, let $H$ be a connected subgraph of $G$ and let $T$ be a spanning tree of $G$. Which of the following statements always hold?',
    pointsPerStatement: 1,
    statements: [
      { text: '$H$ has at least as many edges as $T$.', answer: false },
      { text: 'Every induced subgraph of $G$ is acyclic.', answer: false },
      { text: 'There is at least one edge of $G$ that is contained in $H$ and in $T$.', answer: false },
      { text: 'Every induced subgraph of $T$ is connected.', answer: false },
      { text: '$T$ has at least as many edges as $H$.', answer: false },
    ],
  },
  {
    kind: 'multi',
    id: 'diameter',
    title: 'Diameter',
    prompt:
      'The diameter of a graph $G = (V, E)$ with $|V| \\geq 4$ is defined as $\\operatorname{diam}(G) := \\max\\{\\operatorname{dist}_G(x, y) : x, y \\in V\\}$. Which of the following statements always hold?',
    pointsPerStatement: 1,
    statements: [
      {
        text: 'The inequality $\\operatorname{diam}(G) \\leq |V|$ holds if and only if $G$ is connected.',
        answer: true,
      },
      {
        text: 'If $H$ is an induced subgraph of $G$, then $\\operatorname{diam}(H) \\leq \\operatorname{diam}(G)$.',
        answer: false,
      },
      {
        text: 'If $G$ is connected and $T$ is a spanning tree of $G$, then $\\operatorname{diam}(G) \\leq \\operatorname{diam}(T)$.',
        answer: true,
      },
      {
        text: 'If $H$ is an induced subgraph of $G$, then $\\operatorname{diam}(G) \\leq \\operatorname{diam}(H)$.',
        answer: false,
      },
      { text: '$\\operatorname{diam}(C_n) = \\lfloor \\frac{n}{2} \\rfloor$.', answer: true },
    ],
  },
  {
    kind: 'multi',
    id: 'matching-basics',
    title: 'Matchings',
    prompt:
      'Let $G = (V, E)$ be a graph with $|V| \\geq 3$ and let $M$ be a matching in $G$. Which of the following statements always hold?',
    pointsPerStatement: 1,
    statements: [
      { text: '$|M| \\leq \\frac{|V|}{2}$.', answer: true },
      {
        text: 'If $P$ is an $M$-augmenting path, then $M$ must contain an odd number of edges.',
        answer: false,
      },
      { text: 'If $2|M| = |V|$, then $M$ is a maximum matching.', answer: true },
      {
        text: 'If there is no $M$-augmenting path in $G$, then $M$ is a maximum matching.',
        answer: true,
      },
      { text: 'If $G$ is connected, then $|M| \\geq \\frac{|E|}{2}$ follows.', answer: false },
    ],
  },
  {
    kind: 'multi',
    id: '3sat-complementary-clauses',
    title: '3-SAT with two complementary clauses',
    prompt:
      'Let $F$ be a 3-SAT formula in conjunctive normal form with $n \\geq 4$ variables $x_1, \\ldots, x_n$. $F$ contains the clauses $C_1 := (x_1 \\vee x_2 \\vee x_3)$ and $C_2 := (\\bar{x}_1 \\vee \\bar{x}_2 \\vee \\bar{x}_3)$ and $m \\geq 5$ further clauses. Which of the following statements always hold?',
    pointsPerStatement: 1,
    statements: [
      { text: '$F$ is satisfiable.', answer: false },
      {
        text: 'There is no satisfying assignment in which $x_1 = x_2 = x_3$ holds.',
        answer: true,
      },
      { text: 'If an assignment satisfies $C_1$, then it does not satisfy $C_2$.', answer: false },
      {
        text: 'If $x_1 = 1$ in a satisfying assignment, then $x_2 = 0$ must hold in this assignment.',
        answer: false,
      },
      { text: '$F$ is not satisfiable.', answer: false },
    ],
  },
  {
    kind: 'multi',
    id: 'cycle-through-all-vertices',
    title: 'Cycle through all vertices',
    prompt: 'Let $G$ be a graph with a cycle that contains every vertex of $G$. Then it must hold:',
    pointsPerStatement: 1,
    statements: [
      {
        // Skipped in the exam. A cycle in a bipartite graph has even length, and it uses every vertex.
        text: 'If $G$ is bipartite, then $G$ must have an even number of vertices.',
        answer: true,
      },
      { text: '$G$ must have an even number of vertices.', answer: false },
      {
        // Skipped in the exam. Counterexample: $K_4$ has a Hamiltonian cycle and only odd degrees.
        text: 'All vertices of $G$ have even degree.',
        answer: false,
      },
      { text: 'All vertices of $G$ have degree at least 2.', answer: true },
      { text: '$G$ is bipartite.', answer: false },
    ],
  },
  {
    kind: 'multi',
    id: 'chromatic-number-3',
    title: 'Chromatic number 3',
    prompt: 'Let $G = (V, E)$ be a graph with $\\chi(G) = 3$. Then it must hold:',
    pointsPerStatement: 1,
    statements: [
      { text: '$G$ must contain a cycle of odd length.', answer: true },
      { text: '$\\omega(G) < 3$.', answer: false },
      { text: '$|V| \\leq 3$.', answer: false },
      { text: '$|V| \\geq 3$.', answer: true },
      { text: '$\\omega(G) \\geq 3$.', answer: false },
    ],
  },
  {
    kind: 'multi',
    id: 'tree-max-degree',
    title: 'Trees with maximum degree $t$',
    prompt:
      'Let $G = (V, E)$ be a tree on $n \\geq 5$ vertices with maximum degree $t \\geq 3$. Then it must hold:',
    pointsPerStatement: 1,
    statements: [
      {
        text: 'For all $x, y \\in V$ with $x \\neq y$ and $\\{x, y\\} \\notin E$ it holds: $G\' := (V, E \\cup \\{\\{x, y\\}\\})$ has a cycle.',
        answer: true,
      },
      { text: '$G$ has at least $t$ leaves.', answer: true },
      { text: 'Every induced subgraph of $G$ is acyclic.', answer: true },
      { text: 'Every induced subgraph of $G$ is connected.', answer: false },
      { text: 'The largest matching of $G$ covers at least $n - t$ vertices.', answer: false },
    ],
  },
  {
    kind: 'multi',
    id: 'two-matchings-symmetric-difference',
    title: 'Symmetric difference of two matchings',
    prompt: 'If $M$ and $M\'$ are two matchings in $G$, then it always holds:',
    pointsPerStatement: 1,
    statements: [
      {
        text: 'Every path in the symmetric difference of $M$ and $M\'$ is an $M\'$-augmenting path.',
        answer: false,
      },
      {
        text: 'Every path in the symmetric difference of $M$ and $M\'$ is an $M$-augmenting path.',
        answer: false,
      },
      { text: 'There always exists an $M$-augmenting path.', answer: false },
      { text: 'There always exists an $M\'$-augmenting path.', answer: false },
      {
        text: 'The symmetric difference of $M$ and $M\'$ consists of cycles and paths.',
        answer: true,
      },
    ],
  },
  {
    kind: 'multi',
    id: 'breadth-first-search',
    title: 'Breadth-first search',
    prompt:
      'We start a breadth-first search in the graph $G = (V, E)$ at the vertex $v \\in V$. Then it always holds:',
    pointsPerStatement: 1,
    statements: [
      {
        // Skipped in the exam. Adjacent vertices differ in their BFS distance by at most 1,
        // and the difference may also be 0 or $-1$.
        text: 'If $x$ and $y$ are two arbitrary adjacent vertices, then $\\operatorname{abst}(x) \\geq \\operatorname{abst}(y) + 1$ follows.',
        answer: false,
      },
      {
        // Skipped in the exam. BFS invariant: $z$ is discovered from $x$, so
        // $\mathrm{abst}(z) = \mathrm{abst}(x) + 1$. (Vacuous if $z$ is never reached.)
        text: 'Let $z \\neq v$ be an arbitrary vertex in $G$ and $x$ the predecessor of $z$ computed by the breadth-first search. Then: $\\operatorname{abst}(x) = \\operatorname{abst}(z) - 1$.',
        answer: true,
      },
      { text: 'All vertices in $G$ are visited.', answer: false },
      {
        // Skipped in the exam. Every vertex of the component is enqueued when it is first
        // discovered and marked, so never a second time.
        text: 'All vertices in the connected component of $v$ are put into the queue exactly once.',
        answer: true,
      },
      {
        // Skipped in the exam. Counterexample: the path $x, z, y$ started at $x$ - the queue
        // holds $x$, then $z$, then $y$, so $x$ and $y$ are never in it at the same time.
        text: 'If $z \\in V$ is an arbitrary vertex and $x, y \\in V$ are two arbitrary neighbours of $z$ with $x \\neq y$, then there is always a point in time at which $x$ and $y$ are in the queue simultaneously.',
        answer: false,
      },
    ],
  },
  {
    kind: 'multi',
    id: 'cut-vertex',
    title: 'Cut vertices',
    prompt:
      'Let $G = (V, E)$ be a connected graph with at least three vertices and $v \\in V$ a vertex with the property that $G - v$ is not connected. Then it always holds:',
    pointsPerStatement: 1,
    statements: [
      {
        // Skipped in the exam. If $v$ were a leaf of $T$, then $T - v$ would be a connected
        // spanning subgraph of $G - v$.
        text: 'If $G$ has a spanning tree $T$ as a subgraph, then $v$ cannot be a leaf in $T$.',
        answer: true,
      },
      {
        // Skipped in the exam. See A - the opposite is the case.
        text: 'If $G$ has a spanning tree $T$ as a subgraph, then $v$ must be a leaf in $T$.',
        answer: false,
      },
      {
        // Skipped in the exam. $G$ itself is connected.
        text: 'For every pair of vertices $x, y \\in V$ there is an $x,y-$path in $G$.',
        answer: true,
      },
      {
        // Skipped in the exam. Only pairs separated by $v$ need it, e.g. $x, y$ in the same
        // component of $G - v$ have a path avoiding $v$.
        text: 'For every pair of vertices $x, y \\in V$ every $x,y-$path in $G$ must contain the vertex $v$.',
        answer: false,
      },
      { text: '$G$ has a spanning tree $T$ as a subgraph.', answer: true },
    ],
  },
  {
    kind: 'multi',
    id: 'sat-colouring-formula',
    title: 'SAT formula for colourings',
    prompt:
      'Let $m, n \\in \\mathbb{N}$ be arbitrary and let $x_{i,j}$ for $i \\in [n], j \\in [m]$ and $y_{k,l}$ for $k \\neq l \\in [n]$ be $\\{0,1\\}$-variables. Furthermore let $F$ be the following SAT formula. Which statements are correct?',
    promptExtra: [
      '$F = \\bigwedge_{1 \\leq i \\leq n} \\bigvee_{1 \\leq j \\leq m} x_{i,j}$',
      '$\\wedge\\ \\bigwedge_{1 \\leq i \\leq n} \\bigwedge_{1 \\leq j \\leq m} \\bigwedge_{j < k \\leq m} (\\overline{x_{i,j}} \\vee \\overline{x_{i,k}})$',
      '$\\wedge\\ \\bigwedge_{1 \\leq i \\leq n} \\bigwedge_{\\substack{1 \\leq j \\leq n \\\\ i \\neq j}} (\\overline{y_{i,j}} \\vee y_{j,i})$',
      '$\\wedge\\ \\bigwedge_{1 \\leq i \\leq n} \\bigwedge_{i < j \\leq n} (\\overline{y_{i,j}} \\vee \\bigwedge_{1 \\leq k \\leq m} (\\overline{x_{i,k}} \\vee \\overline{x_{j,k}})).$',
    ],
    pointsPerStatement: 1,
    statements: [
      {
        // Skipped in the exam. Colour everything with colour 1 and set every $y_{i,j} = 0$.
        text: 'There is a satisfying assignment of $F$ with $x_{i,1} = 1$ for all $i \\in [n]$.',
        answer: true,
      },
      {
        // Skipped in the exam. Those three variables force a triangle, which needs 3 colours.
        text: 'For $m < 3$ there is no satisfying assignment of $F$ with $y_{1,2} = 1$, $y_{2,3} = 1$, $y_{3,1} = 1$.',
        answer: true,
      },
      {
        // Skipped in the exam. Counterexample: both vertices get colour 1 and there is no edge,
        // then $x_{1,2} = 0 \neq 1 = x_{2,1}$.
        text: 'In every satisfying assignment of $F$ it holds: $x_{i,j} = x_{j,i}$ for all $i \\in [n], j \\in [m]$.',
        answer: false,
      },
      {
        // Skipped in the exam. With all $y_{i,j} = 0$ the last two blocks are satisfied and each
        // of the $n$ vertices picks exactly one of the $m$ colours.
        text: 'There are $m^n$ satisfying assignments of $F$ for which it holds: $y_{i,j} = 0$ for all $i \\neq j \\in [n]$.',
        answer: true,
      },
      {
        // Skipped in the exam. All $y_{i,j} = 1$ is the complete graph, so the number of
        // assignments is $m(m-1)\cdots(m-n+1)$, which is 0 for $m < n$.
        text: 'There are $n^m$ satisfying assignments of $F$ for which it holds: $y_{i,j} = 1$ for all $i \\neq j \\in [n]$.',
        answer: false,
      },
      {
        // Skipped in the exam. The third block contains both $y_{i,j} \to y_{j,i}$ and
        // $y_{j,i} \to y_{i,j}$.
        text: 'In every satisfying assignment of $F$ it holds: $y_{i,j} = y_{j,i}$ for all $i \\neq j \\in [n]$.',
        answer: true,
      },
    ],
  },
  {
    kind: 'multi',
    id: 'greedy-colouring-connected',
    title: 'Greedy colouring',
    prompt: 'Let $G$ be a connected graph. Which of the following statements are always true?',
    pointsPerStatement: 1,
    statements: [
      {
        // Confirmed by the German exam screenshot. Greedy depends on the vertex ordering and may need up to
        // $\Delta + 1$ colours.
        text: 'If $G$ is 3-colourable, then the greedy colouring algorithm colours $G$ with at most 3 colours.',
        answer: false,
      },
      {
        // Confirmed by the German exam screenshot. Counterexample: the path $a, c, b, d$ with edges
        // $\{a,b\}, \{b,c\}, \{c,d\}$ ordered $a, c, b, d$ needs 3 colours.
        text: 'If $G$ is 2-colourable, then the greedy colouring algorithm colours $G$ with at most 2 colours.',
        answer: false,
      },
      {
        // Confirmed by the German exam screenshot. Greedy never gives a vertex a colour of one of its neighbours.
        text: 'The greedy colouring algorithm produces a valid colouring of $G$.',
        answer: true,
      },
      {
        // Confirmed by the German exam screenshot.
        text: 'The greedy colouring algorithm computes a colouring of $G$ in polynomial time.',
        answer: true,
      },
      {
        // Confirmed by the German exam screenshot. No odd cycle means bipartite, i.e. 2-colourable - same
        // counterexample as in B.
        text: 'If $G$ contains no odd-length cycles, then the greedy colouring algorithm colours $G$ with at most 2 colours.',
        answer: false,
      },
    ],
  },
  {
    kind: 'multi',
    id: 'tsp-knapsack',
    title: 'TSP and knapsack',
    prompt: 'Which of the following statements are always true?',
    pointsPerStatement: 1,
    statements: [
      {
        // Confirmed by the German exam screenshot. Backtracking enumerates all tours, just not in polynomial time.
        text: 'The TSP-Backtrack algorithm finds an optimal solution to the TSP problem.',
        answer: true,
      },
      {
        // Confirmed by the German exam screenshot. It is a heuristic: feasible, fast, but not optimal.
        text: 'The nearest-neighbour algorithm finds a feasible solution to the TSP problem in polynomial time.',
        answer: true,
      },
      {
        // Confirmed by the German exam screenshot. Greedy by value density solves the fractional variant.
        text: 'The fractional knapsack problem can be solved in polynomial time.',
        answer: true,
      },
      {
        // Confirmed by the German exam screenshot. Fractional solutions may take a fraction of an item.
        text: 'Every feasible solution to the fractional knapsack problem is also a feasible solution to the integer knapsack problem.',
        answer: false,
      },
      {
        // Confirmed by the German exam screenshot. See B - nearest neighbour is not optimal.
        text: 'The nearest-neighbour algorithm finds an optimal solution to the TSP problem in polynomial time.',
        answer: false,
      },
    ],
  },
  {
    kind: 'multi',
    id: 'lp-duality',
    title: 'LP duality',
    prompt: 'Which of the following statements are always true?',
    promptExtra: [
      'Consider an LP of the form $\\max c^T x$ subject to $Ax \\geq 0$ and $x \\geq 0$.',
    ],
    pointsPerStatement: 1,
    statements: [
      {
        // Confirmed by the German exam screenshot. Strong duality.
        text: 'If the above LP has an optimal solution and the corresponding dual LP also has an optimal solution, then their objective function values are equal.',
        answer: true,
      },
      {
        // Confirmed by the German exam screenshot. The primal is always feasible but may be unbounded, and then
        // the dual is infeasible.
        text: 'If the above LP has a feasible solution, then the corresponding dual LP also has a feasible solution.',
        answer: false,
      },
      {
        // Confirmed by the German exam screenshot. $x = 0$ satisfies $Ax \geq 0$ and $x \geq 0$.
        text: 'The above LP has a feasible solution.',
        answer: true,
      },
      {
        // Confirmed by the German exam screenshot. The LP may be unbounded, e.g. $\max x$ subject to $x \geq 0$.
        text: 'If the above LP has a feasible solution, then it also has an optimal solution.',
        answer: false,
      },
      {
        // Confirmed by the German exam screenshot. Weak duality only gives $c^T x \leq b^T y$ for feasible
        // solutions; equality holds for optimal ones.
        text: 'If the above LP has a feasible solution and the corresponding dual LP also has a feasible solution, then their objective function values are equal.',
        answer: false,
      },
    ],
  },

  {
    kind: 'multi',
    id: 'residual-network-cut',
    title: 'Residual network without $s,t$-path',
    prompt:
      'If there is no $s,t-$path left in the residual network $N_f$, then it always holds:',
    pointsPerStatement: 1,
    statements: [
      {
        // Skipped in the exam. Every flow satisfies $\operatorname{val}(f) \leq \operatorname{cap}(S)$.
        text: 'There is a cut $S$ with $\\operatorname{cap}(S) < \\operatorname{val}(f)$.',
        answer: false,
      },
      {
        text: 'There is a cut $S$ with $\\operatorname{cap}(S) = \\operatorname{val}(f)$.',
        answer: true,
      },
      {
        // Skipped in the exam. Max-flow min-cut, so $f$ is maximum.
        text: 'There is no flow $f\'$ with $\\operatorname{val}(f\') > \\operatorname{val}(f)$.',
        answer: true,
      },
      { text: 'The algorithm of Ford-Fulkerson fails to find a new flow.', answer: true },
      {
        // Skipped in the exam. The zero flow is always smaller.
        text: 'There is no flow $f\'$ with $\\operatorname{val}(f\') < \\operatorname{val}(f)$.',
        answer: false,
      },
    ],
  },
  {
    kind: 'multi',
    id: 'two-matchings-larger',
    title: 'Two matchings with $|M| < |M\'|$',
    prompt:
      'If $M$ and $M\'$ are two matchings in the graph $G$ with $|M| < |M\'|$, then it always holds:',
    pointsPerStatement: 1,
    statements: [
      {
        // Skipped in the exam. $M'$ is the larger matching, so it has no augmenting path.
        text: 'Every path in the symmetric difference of $M$ and $M\'$ is an $M\'$-augmenting path.',
        answer: false,
      },
      {
        // Skipped in the exam. The symmetric difference also contains non-augmenting paths.
        text: 'Every path in the symmetric difference of $M$ and $M\'$ is an $M$-augmenting path.',
        answer: false,
      },
      {
        // Skipped in the exam. $M'$ is maximum among the two, so it cannot be augmented here.
        text: 'There always exists an $M\'$-augmenting path.',
        answer: false,
      },
      { text: 'There always exists an $M$-augmenting path.', answer: true },
      {
        // Skipped in the exam. Every vertex has degree at most 2 in the symmetric difference.
        text: 'The symmetric difference of $M$ and $M\'$ consists of cycles and paths.',
        answer: true,
      },
    ],
  },
  {
    kind: 'multi',
    id: 'bipartite-graph',
    title: 'Bipartite graphs',
    prompt: 'If $G$ is a bipartite graph on $n$ vertices, then it always holds:',
    pointsPerStatement: 1,
    statements: [
      {
        // Skipped in the exam. The larger of the two sides has at least $n/2$ vertices
        // and is independent.
        text: 'The largest independent set of $G$ contains at least $\\frac{n}{2}$ vertices.',
        answer: true,
      },
      {
        // Skipped in the exam. Counterexample: $C_4$ is bipartite and has a cycle.
        text: '$G$ contains no cycle.',
        answer: false,
      },
      { text: '$G$ is 3-colourable.', answer: true },
      {
        // Skipped in the exam. Bipartite is exactly 2-colourable.
        text: '$G$ is 2-colourable.',
        answer: true,
      },
      {
        // Skipped in the exam. A bipartite graph has no cycle of odd length.
        text: '$G$ contains no odd cycle.',
        answer: true,
      },
    ],
  },
  {
    kind: 'single',
    id: 'sat-independent-set-at-least-one',
    title: 'SAT: at least one vertex per position',
    prompt:
      'Which formula ensures that for each of the $k$ vertices of the independent set at least one vertex from $V$ is selected?',
    promptExtra: [
      'Let $n, k \\in \\mathbb{N}$ be arbitrary and let $G = (V, E)$ be a graph on the vertex set $V = \\{v_1, \\ldots, v_n\\}$. A SAT formula can be given that is satisfiable exactly if $G$ has an independent set of size $k$.',
      'For this let $e_{i,j}$ with $i \\neq j \\in [n]$ each be $\\{0, 1\\}$-variables that are 1 exactly if $\\{v_i, v_j\\} \\in E$. Furthermore let $x_{i,j}$ with $i \\in [n]$ and $j \\in [k]$ also be $\\{0, 1\\}$-variables stating that vertex $v_i$ shall be the $j$-th vertex of the independent set. The SAT formula shall guarantee that every satisfying assignment actually represents an independent set of size $k$. In the following, two parts of such a SAT formula are to be determined.',
    ],
    points: 2,
    options: [
      {
        text: '$\\bigvee_{1 \\leq i \\leq n} \\bigwedge_{1 \\leq j \\leq k} x_{i,j}$',
        correct: false,
      },
      {
        text: '$\\bigvee_{1 \\leq j \\leq k} \\bigwedge_{1 \\leq i \\leq n} x_{i,j}$',
        correct: false,
      },
      {
        text: '$\\bigwedge_{1 \\leq j \\leq k} \\bigvee_{1 \\leq i \\leq n} x_{i,j}$',
        correct: true,
      },
      {
        text: '$\\bigwedge_{1 \\leq i \\leq n} \\bigvee_{1 \\leq j \\leq k} x_{i,j}$',
        correct: false,
      },
    ],
  },
  {
    kind: 'single',
    id: 'sat-independent-set-no-edge',
    title: 'SAT: no edge inside the set',
    prompt:
      'Which formula ensures that the vertices of the independent set cannot be connected to each other?',
    promptExtra: [
      'Let $n, k \\in \\mathbb{N}$ be arbitrary and let $G = (V, E)$ be a graph on the vertex set $V = \\{v_1, \\ldots, v_n\\}$. A SAT formula can be given that is satisfiable exactly if $G$ has an independent set of size $k$.',
      'For this let $e_{i,j}$ with $i \\neq j \\in [n]$ each be $\\{0, 1\\}$-variables that are 1 exactly if $\\{v_i, v_j\\} \\in E$. Furthermore let $x_{i,j}$ with $i \\in [n]$ and $j \\in [k]$ also be $\\{0, 1\\}$-variables stating that vertex $v_i$ shall be the $j$-th vertex of the independent set. The SAT formula shall guarantee that every satisfying assignment actually represents an independent set of size $k$. In the following, two parts of such a SAT formula are to be determined.',
    ],
    points: 2,
    options: [
      {
        text: '$\\bigwedge_{1 \\leq i_1 \\leq n} \\bigwedge_{\\substack{1 \\leq i_2 \\leq n \\\\ i_1 \\neq i_2}} e_{i_1,i_2} \\vee ((\\bigwedge_{1 \\leq j \\leq k} \\overline{x_{i_1,j}}) \\vee (\\bigwedge_{1 \\leq j \\leq k} \\overline{x_{i_2,j}}))$',
        correct: false,
      },
      {
        text: '$\\bigwedge_{1 \\leq i_1 \\leq n} \\bigwedge_{\\substack{1 \\leq i_2 \\leq n \\\\ i_1 \\neq i_2}} e_{i_1,i_2} \\vee ((\\bigvee_{1 \\leq j \\leq k} x_{i_1,j}) \\wedge (\\bigvee_{1 \\leq j \\leq k} x_{i_2,j}))$',
        correct: false,
      },
      {
        text: '$\\bigwedge_{1 \\leq i_1 \\leq n} \\bigwedge_{\\substack{1 \\leq i_2 \\leq n \\\\ i_1 \\neq i_2}} \\overline{e_{i_1,i_2}} \\vee ((\\bigwedge_{1 \\leq j \\leq k} \\overline{x_{i_1,j}}) \\vee (\\bigwedge_{1 \\leq j \\leq k} \\overline{x_{i_2,j}}))$',
        correct: true,
      },
      {
        text: '$\\bigwedge_{1 \\leq i_1 \\leq n} \\bigwedge_{\\substack{1 \\leq i_2 \\leq n \\\\ i_1 \\neq i_2}} e_{i_1,i_2} \\vee ((\\bigvee_{1 \\leq j \\leq k} \\overline{x_{i_1,j}}) \\wedge (\\bigvee_{1 \\leq j \\leq k} \\overline{x_{i_2,j}}))$',
        correct: false,
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // VIPS practice quizzes. No official key - every answer below is AI-derived.
  // ---------------------------------------------------------------------------

  {
    kind: 'multi',
    id: 'vips-graph-1234',
    source: 'vips',
    title: 'Concrete graph on 4 vertices',
    prompt:
      'Let $G := (V, E)$ with $V := \\{1, 2, 3, 4\\}$ and $E := \\{\\{1,2\\}, \\{2,3\\}, \\{3,4\\}, \\{1,3\\}\\}$. Then the following holds:',
    pointsPerStatement: 1,
    statements: [
      // The induced subgraph on $\{1, 4\}$ has no edge.
      { text: 'Every induced subgraph of $G$ is connected.', answer: false },
      // A single vertex induces a connected subgraph.
      { text: 'Every induced subgraph of $G$ is not connected.', answer: false },
      // The triangle $1, 2, 3$.
      { text: '$K_3$ is a subgraph of $G$.', answer: true },
      // Vertex 4 has degree 1, so it lies on no cycle.
      { text: '$C_4$ is a subgraph of $G$.', answer: false },
      { text: '$C_4$ is not a subgraph of $G$.', answer: true },
      { text: '$G$ is connected.', answer: true },
      // 4 vertices and 4 edges, and it contains a triangle.
      { text: '$G$ is not a tree.', answer: true },
    ],
  },
  {
    kind: 'multi',
    id: 'vips-hamiltonian-cycle',
    source: 'vips',
    title: 'Cycle through all vertices',
    prompt:
      'Let $G$ be a graph with a cycle that includes every vertex of $G$. Then the following must hold:',
    pointsPerStatement: 1,
    statements: [
      // Counterexample: $G = C_n$ itself, where every degree is exactly 2.
      { text: 'Some vertices of $G$ have degree greater than 2.', answer: false },
      // The cycle may have chords.
      { text: 'All vertices of $G$ have at most degree 2.', answer: false },
      { text: 'All vertices of $G$ have at least degree 2.', answer: true },
      // Counterexample: $K_4$ has a Hamiltonian cycle and only odd degrees.
      { text: 'All vertices of $G$ have even degree.', answer: false },
      { text: '$G$ is connected.', answer: true },
      { text: '$G$ is not a tree.', answer: true },
    ],
  },
  {
    kind: 'multi',
    id: 'vips-two-triangles',
    source: 'vips',
    title: 'Two triangles sharing a vertex',
    prompt:
      'Let $G := (V, E)$ be a graph with $V := \\{a, b, c, d, e\\}$ and $E := \\{\\{a,b\\}, \\{b,c\\}, \\{c,a\\}, \\{c,d\\}, \\{d,e\\}, \\{e,c\\}\\}$. Then it holds:',
    pointsPerStatement: 1,
    statements: [
      // The triangles $abc$ and $cde$ share the vertex $c$, so e.g. $\{a, d\}$ is maximum.
      { text: '$\\alpha(G) = 2$.', answer: true },
      { text: '$\\alpha(G) = 3$.', answer: false },
      // $a, c, b$.
      { text: 'There is an $a,b-$path of length 2 in $G$.', answer: true },
      // A path of length 5 needs 6 distinct vertices, but $|V| = 5$.
      { text: 'There is an $a,b-$path of length 5 in $G$.', answer: false },
      // $c$ is the cut vertex: $G - c$ falls apart into $ab$ and $de$.
      { text: '$G - c$ is connected.', answer: false },
      { text: '$G - a$ is connected.', answer: true },
      { text: '$\\omega(G) = 2$.', answer: false },
      { text: '$\\omega(G) = 3$.', answer: true },
      // $\{e, b\}$ is not an edge.
      { text: '$(a, c, d, e, b)$ is an $a,b-$walk in $G$.', answer: false },
      // A walk may repeat the vertex $c$.
      { text: '$(a, c, d, e, c, b)$ is an $a,b-$walk in $G$.', answer: true },
    ],
  },
  {
    kind: 'multi',
    id: 'vips-tree-leaf',
    source: 'vips',
    title: 'Tree with a leaf $x$',
    prompt:
      'Let $T = (V, E)$ be a tree with $n = |V| \\geq 2$ and $x, y \\in V$ such that $x$ is a leaf and $\\{x, y\\} \\notin E$. Then the following always holds:',
    pointsPerStatement: 1,
    statements: [
      { text: '$T - x$ is a tree.', answer: true },
      // Counterexample: the star $K_{1,3}$ loses a leaf and keeps only 2.
      { text: '$T - x$ has the same number of leaves as $T$.', answer: false },
      // Counterexample: the path $a, b, c$ keeps 2 leaves after removing the leaf $a$.
      { text: '$T - x$ has fewer leaves than $T$.', answer: false },
      // $y$ is only required to be non-adjacent to $x$.
      { text: '$y$ is a leaf of $T$.', answer: false },
      // $y$ may be a leaf as well, e.g. the other end of a path.
      { text: '$T - y$ is not a tree.', answer: false },
      // $y$ may be an inner vertex, then $T - y$ falls apart.
      { text: '$T - y$ is a tree.', answer: false },
      // Adding an edge to a tree always closes a cycle.
      { text: '$T^+ := (V, E \\cup \\{x, y\\})$ is a tree.', answer: false },
    ],
  },
  {
    kind: 'multi',
    id: 'vips-plane-connected',
    source: 'vips',
    title: 'Connected plane graph',
    prompt:
      'Let $G := (V, E, R)$ be a connected, plane graph, and let $x, y \\in V$ be two non-adjacent vertices of $G$. Then the following always holds:',
    pointsPerStatement: 1,
    statements: [
      { text: '$|V| - |E| + |R| = 0$.', answer: false },
      // Euler's formula for connected plane graphs.
      { text: '$|V| - |E| + |R| = 2$.', answer: true },
      // Counterexample: a triangle has no leaf, a path has one - neither is forced.
      { text: '$G$ has no leaf.', answer: false },
      { text: '$G$ has a leaf.', answer: false },
      // Counterexample: adding an edge to a path keeps it planar.
      { text: "$G' = (V, E \\cup \\{x, y\\})$ is not planar.", answer: false },
      { text: '$G$ has a cycle of odd length.', answer: false },
      { text: '$G$ has a cycle of even length.', answer: false },
    ],
  },
  {
    kind: 'multi',
    id: 'vips-c6',
    source: 'vips',
    title: 'The cycle $C_6$',
    prompt:
      'Let $G := (V, E)$ be a graph with $V := \\{1, 2, 3, 4, 5, 6\\}$ and $E := \\{\\{1,2\\}, \\{2,3\\}, \\{3,4\\}, \\{4,5\\}, \\{5,6\\}, \\{6,1\\}\\}$. Then the following holds:',
    pointsPerStatement: 1,
    statements: [
      // $2, 3, 4, 5$.
      { text: '$\\operatorname{dist}_G(2, 5) = 3$.', answer: true },
      { text: '$\\operatorname{dist}_G(2, 5) = 2$.', answer: false },
      // Greedy gives $4 \to 1$, $1 \to 1$, $6 \to 2$, $3 \to 2$, $5 \to 3$, $2 \to 3$.
      {
        text: 'The Greedy-Colouring-Algorithm yields a 3-colouring with vertex ordering $(4, 1, 6, 3, 5, 2)$.',
        answer: true,
      },
      // Greedy gives $1 \to 1$, $4 \to 1$, $2 \to 2$, $5 \to 2$, $3 \to 3$, $6 \to 3$.
      {
        text: 'The Greedy-Colouring-Algorithm yields a 3-colouring with vertex ordering $(1, 4, 2, 5, 3, 6)$.',
        answer: true,
      },
      // $C_6$ is bipartite.
      { text: '$\\chi(G) > 2$.', answer: false },
      { text: '$\\chi(G) = 2$.', answer: true },
      { text: '$G$ contains a cycle of even length.', answer: true },
      { text: '$G$ contains a cycle of odd length.', answer: false },
    ],
  },
  {
    kind: 'multi',
    id: 'vips-subdivisions',
    source: 'vips',
    title: 'Subdivisions in a graph containing $C_n$',
    prompt:
      'Let $G = (V, E)$ be a graph on $n \\geq 4$ vertices that contains $C_n$ as a subgraph. Which of the following statements are always true?',
    pointsPerStatement: 1,
    statements: [
      // A subdivision of $K_{2,2} = C_4$ is any cycle of length $\geq 4$.
      { text: '$G$ contains a subdivision of $K_{2,2}$.', answer: true },
      // A subdivision of $K_3$ is any cycle.
      { text: '$G$ contains a subdivision of $K_3$.', answer: true },
      // $G$ may be exactly $C_n$.
      { text: '$G$ contains a subdivision of $K_5$.', answer: false },
      { text: '$G$ contains a subdivision of $K_{3,3}$.', answer: false },
      // $G$ may also be $K_n$, which does contain those subdivisions.
      { text: '$G$ contains no subdivision of $K_5$.', answer: false },
      { text: '$G$ contains no subdivision of $K_{3,3}$.', answer: false },
      // Both are possible: $C_n$ is bipartite for even $n$, not bipartite for odd $n$.
      { text: '$G$ is bipartite.', answer: false },
      { text: '$G$ is not bipartite.', answer: false },
    ],
  },
  {
    kind: 'multi',
    id: 'vips-o-notation',
    source: 'vips',
    title: 'O-notation',
    prompt:
      'Let $f : \\mathbb{N} \\to \\mathbb{R}_{\\geq 0}$, $g : \\mathbb{N} \\to \\mathbb{R}_{\\geq 0}$ and $h : \\mathbb{N} \\to \\mathbb{R}_{\\geq 0}$ with $f(n) = O(h(n))$ and $g(n) = O(h(n))$. Which of the following statements are always true?',
    pointsPerStatement: 1,
    statements: [
      // $|h - g|$ may be constantly 0.
      { text: '$f(n) = O(|h(n) - g(n)|)$.', answer: false },
      { text: '$f(n) + g(n) = O(h(n))$.', answer: true },
      // $g = O(h) \leq O(f + h)$.
      { text: '$g(n) = O(f(n) + h(n))$.', answer: true },
      // Counterexample: $f \equiv 0$ and $g = h$.
      { text: '$g(n) = O(f(n))$.', answer: false },
      { text: '$f(n) = O(g(n))$.', answer: false },
      // A constant factor does not matter in the O-notation.
      { text: '$f(n) = O(\\frac{h(n)}{100^{100}})$.', answer: true },
      { text: '$g(n) = O(\\frac{h(n)}{100^{100}})$.', answer: true },
    ],
  },
  {
    kind: 'multi',
    id: 'vips-bfs',
    source: 'vips',
    title: 'BFS',
    prompt: 'In a BFS starting at $u$, the following always holds:',
    promptExtra: [
      'Let $G = (V, E)$ be a connected graph, and $u, v, w \\in V$ arbitrary, distinct vertices of $G$.',
    ],
    pointsPerStatement: 1,
    statements: [
      // $G$ is connected and a vertex is marked when it is enqueued.
      { text: '$v$ enters the queue exactly once.', answer: true },
      // The predecessor is set when $v$ is discovered and never overwritten.
      {
        text: 'If $v$ is marked as predecessor of $w$, this can still change later.',
        answer: false,
      },
      // BFS processes the vertices in non-decreasing distance from $u$.
      {
        text: 'If $v$ is marked as explored before $w$, then $\\operatorname{dist}(u, v) \\leq \\operatorname{dist}(u, w)$.',
        answer: true,
      },
      { text: '$v$ is marked as explored when enqueued.', answer: true },
      { text: '$v$ is marked as explored when dequeued.', answer: false },
    ],
  },
  {
    kind: 'multi',
    id: 'vips-dfs',
    source: 'vips',
    title: 'DFS',
    prompt: 'In a DFS starting at $u$, the following always holds:',
    promptExtra: [
      'Let $G = (V, E)$ be a connected graph, and $u, v, w \\in V$ arbitrary, distinct vertices of $G$.',
    ],
    pointsPerStatement: 1,
    statements: [
      // Every neighbour that is still unexplored pushes $v$ again.
      { text: '$v$ is placed onto the stack exactly once.', answer: false },
      // $w$ can be pushed several times, the last push wins.
      {
        text: 'If $v$ is marked as predecessor of $w$, this can still change later.',
        answer: true,
      },
      // DFS runs down one branch first, so a far vertex may be explored early.
      {
        text: 'If $v$ is marked as explored before $w$, then $\\operatorname{dist}(u, v) \\leq \\operatorname{dist}(u, w)$.',
        answer: false,
      },
      { text: '$v$ is marked as explored when it is popped.', answer: true },
      { text: '$v$ is marked as explored when it is pushed.', answer: false },
    ],
  },
  {
    kind: 'multi',
    id: 'vips-floyd-warshall',
    source: 'vips',
    title: 'Floyd-Warshall',
    prompt:
      'Let $G$ be a directed graph without negative cycles, and let $d^k_{i,j}$ and $\\mathcal{P}^k_{i,j}$ be defined as in the algorithm of Floyd-Warshall. Then the following always holds:',
    pointsPerStatement: 1,
    statements: [
      // $d^0$ holds the direct edge weights and 0 on the diagonal.
      { text: '$d^0_{i,j} = \\infty$ for all $i, j \\in [n]$.', answer: false },
      // Allowing one more intermediate vertex can only shorten a path.
      { text: '$d^k_{i,j} \\leq d^{k-1}_{i,j}$ for all $i, j, k \\in [n]$.', answer: true },
      { text: '$d^k_{i,j} \\geq d^{k-1}_{i,j}$ for all $i, j, k \\in [n]$.', answer: false },
      {
        text: 'The algorithm of Floyd-Warshall computes the distance for all pairs of vertices.',
        answer: true,
      },
      // Only the inner vertices are restricted to $[k]$, $i$ and $j$ are arbitrary.
      { text: 'If $i > k$ or $j > k$, then $\\mathcal{P}^k_{i,j}$ is empty.', answer: false },
      // At most $k$ inner vertices plus $i$ and $j$.
      {
        text: 'A path in $\\mathcal{P}^k_{i,j}$ can contain at most $k + 2$ vertices.',
        answer: true,
      },
      {
        text: 'A path in $\\mathcal{P}^k_{i,j}$ can contain at most $k + 1$ vertices.',
        answer: false,
      },
    ],
  },
  {
    kind: 'multi',
    id: 'vips-kruskal',
    source: 'vips',
    title: "Kruskal's algorithm",
    prompt:
      'Let $T$ be the tree that is constructed while using the algorithm of Kruskal on a weighted graph $G$. Then the following always holds:',
    pointsPerStatement: 1,
    statements: [
      { text: 'By adding an edge to $T$, the number of connected components of $T$ is reduced by 1.', answer: true },
      { text: 'At the start, each vertex is its own R-vertex.', answer: true },
      { text: 'An edge added to $T$ is never removed again.', answer: true },
      // Union by size only guarantees that the component at least doubles.
      {
        text: 'When a vertex gets a new R-vertex, the size of its connected component has exactly doubled.',
        answer: false,
      },
      // Equal R-vertices would mean the edge closes a cycle.
      {
        text: 'An edge $\\{x, y\\}$ can only be added to $T$ if $x$ and $y$ have different R-vertices.',
        answer: true,
      },
      // Edges are never removed at all.
      {
        text: 'An edge added to $T$ is removed again if and only if its R-vertex changes.',
        answer: false,
      },
      // It is exactly the other way round.
      {
        text: 'An edge $\\{x, y\\}$ is added to $T$ if and only if $x$ and $y$ have the same R-vertex.',
        answer: false,
      },
    ],
  },
  {
    kind: 'multi',
    id: 'vips-residual-network',
    source: 'vips',
    title: 'Residual network without $s,t$-path',
    prompt:
      'When the residual network $N_f$ does not contain an $s,t-$path, then the following always holds:',
    pointsPerStatement: 1,
    statements: [
      // Max-flow min-cut: $f$ is maximum.
      {
        text: 'There is no flow $f\'$ with $\\operatorname{val}(f\') > \\operatorname{val}(f)$.',
        answer: true,
      },
      // Only the edges crossing the minimum cut are saturated, not necessarily those at $s$.
      { text: 'All edges leaving $s$ have capacity 0 in $N_f$.', answer: false },
      // As soon as $\operatorname{val}(f) > 0$ there are backward edges from $t$ towards $s$.
      { text: 'There is no $t,s-$path in $N_f$.', answer: false },
      { text: 'The algorithm of Ford-Fulkerson does not find a new flow.', answer: true },
      // The zero flow always exists and is smaller.
      {
        text: 'There is no flow $f\'$ with $\\operatorname{val}(f\') < \\operatorname{val}(f)$.',
        answer: false,
      },
    ],
  },
  {
    kind: 'multi',
    id: 'vips-two-matchings',
    source: 'vips',
    title: 'Two matchings with $|M| < |M\'|$',
    prompt:
      'When $M$ and $M\'$ are two matchings in $G$ with $|M| < |M\'|$, then the following always holds:',
    pointsPerStatement: 1,
    statements: [
      // The symmetric difference also contains paths that are not augmenting.
      {
        text: 'Every path in the symmetric difference of $M$ and $M\'$ is an $M$-augmenting path.',
        answer: false,
      },
      // The edges of such a path alternate between $M$ and $M'$ by construction.
      {
        text: 'Every path in the symmetric difference of $M$ and $M\'$ is an $M$-alternating path.',
        answer: true,
      },
      { text: '$M\'$ is a perfect matching.', answer: false },
      // Every vertex has degree at most 2 in the symmetric difference.
      {
        text: 'The symmetric difference of $M$ and $M\'$ consists of paths and cycles.',
        answer: true,
      },
      // Berge: $M$ is not maximum, so an augmenting path exists.
      { text: 'There is an $M$-augmenting path.', answer: true },
    ],
  },
  {
    kind: 'multi',
    id: 'vips-matching-vertex-cover-23',
    source: 'vips',
    title: 'Matching of size 7 in a graph on 23 vertices',
    prompt:
      'Let $G = (V, E)$ be a graph with $|V| = 23$, and $M^*$ a matching in $G$ with $|M^*| = 7$. Then the following always holds:',
    pointsPerStatement: 1,
    statements: [
      // $M^*$ need not be maximum; if the maximum matching is larger, König forces a
      // larger minimum vertex cover and no cover of size exactly 7 exists.
      { text: 'If $G$ is bipartite, there is a vertex cover of $G$ of size 7.', answer: false },
      // Each of the 7 disjoint edges needs its own vertex.
      { text: 'Each vertex cover of $G$ has size at least 7.', answer: true },
      { text: '$G$ has a vertex cover of size 23.', answer: true },
      // A cover of size 7 caps every matching at 7, and $|M^*| = 7$.
      {
        text: 'If $G$ has a vertex cover of size 7, $M^*$ is a maximal matching of $G$.',
        answer: true,
      },
      // König's theorem, reading "maximal" as "maximum".
      {
        text: 'If $M^*$ is maximal, and $G$ is bipartite, then $G$ has a vertex cover of size 7.',
        answer: true,
      },
      // A vertex cover says nothing about bipartiteness, e.g. $K_3$ has one of size 2.
      { text: 'If there is a vertex cover of size 7, $G$ is bipartite.', answer: false },
    ],
  },
  {
    kind: 'multi',
    id: 'vips-network-cut',
    source: 'vips',
    title: 'Network and cut',
    prompt:
      'Let $N = (V, A, s, t, c)$ be a network, and let $S$ be a cut of $N$. Then the following always holds:',
    pointsPerStatement: 1,
    statements: [
      // The flow coming back from $\bar S$ into $S$ has to be subtracted.
      {
        text: 'For each flow $f$, it holds $\\operatorname{val}(f) = \\sum_{(x,y) \\in A,\\, x \\in S,\\, y \\in \\bar{S}} f(x, y)$.',
        answer: false,
      },
      { text: 'For each flow $f$, it holds $\\operatorname{val}(f) \\leq \\operatorname{cap}(S)$.', answer: true },
      { text: '$s \\in S$ and $t \\notin S$.', answer: true },
      // Equality only holds for a minimum cut.
      {
        text: 'When $f$ is a maximal flow, then $\\operatorname{val}(f) = \\operatorname{cap}(S)$.',
        answer: false,
      },
      {
        text: '$\\operatorname{cap}(S) = \\sum_{(x,y) \\in A,\\, x \\in S,\\, y \\in \\bar{S}} c(x, y)$.',
        answer: true,
      },
    ],
  },
  {
    kind: 'multi',
    id: 'vips-knapsack',
    source: 'vips',
    title: 'Knapsack',
    prompt:
      'For a knapsack problem with $n$ items and weights $g_i$, values $f_i$ for $i \\in [n]$, and capacity $b < \\sum_{i=1}^{n} g_i$, the following always holds:',
    pointsPerStatement: 1,
    statements: [
      // Fractions are allowed, so the capacity can always be filled up completely.
      { text: 'The optimal solution to the fractional problem has weight $b$.', answer: true },
      // Greedy by value density $f_i / g_i$.
      {
        text: 'An optimal solution to the fractional problem can be found in polynomial time.',
        answer: true,
      },
      { text: 'The Backtracking3 algorithm runs in polynomial time.', answer: false },
      {
        text: 'The Backtracking3 algorithm always finds an optimal solution to the knapsack problem.',
        answer: true,
      },
      // The greedy algorithm starts with exactly this item.
      {
        text: 'The optimal solution to the fractional problem may always include the item $i = \\operatorname{argmax}_{i \\in [n]} \\{f_i / g_i\\}$.',
        answer: true,
      },
      // For the integer problem that item may not fit alongside the rest.
      {
        text: 'The optimal solution to the knapsack problem always includes the item $i = \\operatorname{argmax}_{i \\in [n]} \\{f_i / g_i\\}$.',
        answer: false,
      },
      // The fractional optimum is an upper bound and usually strictly larger.
      {
        text: 'If the knapsack problem has an optimal solution, it has the same value as the optimal solution to the fractional problem.',
        answer: false,
      },
    ],
  },
  {
    kind: 'multi',
    id: 'vips-tsp-backtrack',
    source: 'vips',
    title: 'TSP-Backtrack$_{MST}$',
    prompt:
      'If the $\\mathrm{TSP\\text{-}Backtrack}_{MST}$ algorithm does not use further recursive calls, then:',
    pointsPerStatement: 1,
    statements: [
      // Pruning only rules out strictly better tours, ties are still possible.
      {
        text: 'the current partial tour might still be part of an optimal complete tour.',
        answer: true,
      },
      // The bound compares partial tour PLUS the MST bound against the best tour.
      {
        text: 'the cost of the current partial tour is at least as high as the cost of the best complete tour found so far.',
        answer: false,
      },
      // The MST bound underestimates the best completion, so this follows from pruning.
      {
        text: 'the cost of the best complete tour found so far is no greater than the cost of the current partial tour plus the cost of the best completion to a full tour.',
        answer: true,
      },
      { text: 'the MST algorithm has found not just a tree, but a path.', answer: false },
      { text: 'the MST algorithm has found a better partial tour.', answer: false },
    ],
  },
  {
    kind: 'multi',
    id: 'vips-duality',
    source: 'vips',
    title: 'Weak and strong duality',
    prompt:
      'Which of the following statements about weak and strong duality in linear optimization are correct? Let $(P)$ denote the primal and $(D)$ the dual program.',
    pointsPerStatement: 1,
    statements: [
      // If $(D)$ had an optimum, strong duality would give $(P)$ one as well.
      { text: 'If $(P)$ has no optimal solution, then $(D)$ also has none.', answer: true },
      // Weak duality only gives the bound $c^T x \leq b^T y$.
      {
        text: 'Weak duality implies that feasible solutions of $(P)$ and $(D)$ must also be optimal.',
        answer: false,
      },
      {
        text: 'If $(P)$ has an optimal solution, then $(D)$ has a feasible solution with the same optimal value.',
        answer: true,
      },
      // Counterexample: $(P)$ infeasible and $(D)$ unbounded - $(D)$ is feasible.
      {
        text: 'If $(P)$ has no optimal solution, then $(D)$ has no feasible solution with finite objective value.',
        answer: false,
      },
      // Both feasible means both bounded by weak duality, then strong duality applies.
      {
        text: 'If both $(P)$ and $(D)$ have feasible solutions, then they share the same optimal objective value.',
        answer: true,
      },
    ],
  },
  {
    kind: 'multi',
    id: 'vips-lp-concrete',
    source: 'vips',
    title: 'A concrete LP',
    prompt: 'Which of the following statements are correct for the following linear program?',
    promptExtra: [
      '$\\min \\alpha x_1 + \\beta x_2$ subject to\n$2x_1 + x_2 \\geq 6$\n$x_1 + x_2 \\geq 4$\n$x_1 \\geq 0, \\quad x_2 \\geq 0$',
    ],
    pointsPerStatement: 1,
    statements: [
      // $2 \cdot 2 + 3 = 7 \geq 6$ and $2 + 3 = 5 \geq 4$.
      { text: 'The point $(2, 3)$ is feasible.', answer: true },
      // $2 \cdot 1 + 3 = 5 < 6$.
      { text: 'The point $(1, 3)$ is feasible.', answer: false },
      // The vertices are $(0,6), (2,2), (4,0)$ with objective values $6, 8, 12$.
      {
        text: 'If $\\alpha = 3$ and $\\beta = 1$, then $(4, 0)$ is an optimal solution.',
        answer: false,
      },
      // $(0, 6)$ has value 6 and is better than the 8 of $(2, 2)$.
      {
        text: 'If $\\alpha = 3$ and $\\beta = 1$, then $(2, 2)$ is an optimal solution.',
        answer: false,
      },
      // $(3, 3)$ satisfies both constraints strictly, and $(2, 2)$ is smaller in both
      // coordinates, hence strictly better for all $\alpha, \beta > 0$.
      {
        text: 'There exists a choice of $\\alpha > 0$ and $\\beta > 0$ such that $(3, 3)$ is an optimal solution.',
        answer: false,
      },
    ],
  },
  {
    kind: 'multi',
    id: 'vips-ilp-duality',
    source: 'vips',
    title: 'ILP and LP relaxation',
    prompt:
      'Let $(P^*)$ be a feasible and bounded ILP with minimization objective, $(P)$ its LP relaxation, $(D)$ the dual of $(P)$, and $(D^*)$ the ILP corresponding to $(D)$. Furthermore, assume all programs are feasible and bounded, and let $f(P^*)$, $f(P)$, $f(D)$, and $f(D^*)$ be the respective optimal objective values. Then the following always holds:',
    pointsPerStatement: 1,
    statements: [
      // $(D)$ is a maximization problem, so the integrality constraint can only lower it.
      { text: '$f(D^*) \\geq f(D)$.', answer: false },
      { text: '$f(D^*) \\leq f(D)$.', answer: true },
      // Relaxing a minimization problem can only lower the optimum.
      { text: '$f(P^*) \\geq f(P)$.', answer: true },
      { text: '$f(P^*) \\leq f(P)$.', answer: false },
      // The integrality gap breaks the duality on the ILP level.
      { text: '$f(P^*) = f(D^*)$.', answer: false },
      // Strong duality for the LP relaxation.
      { text: '$f(P) = f(D)$.', answer: true },
      // Equality is possible whenever the ILPs happen to be integral.
      { text: '$f(P^*) + f(D^*) < f(P) + f(D)$.', answer: false },
    ],
  },
  {
    kind: 'multi',
    id: 'vips-lp-polyhedron',
    source: 'vips',
    title: 'Feasible region of an LP',
    prompt:
      'Let $(P)$ be a feasible and bounded LP. Let $V$ be the set of vertices (corners) of the feasible region of $(P)$. Then the following always holds:',
    pointsPerStatement: 1,
    statements: [
      // The set of optimal solutions is a face, hence convex.
      {
        text: 'If $x$ and $y$ are two optimal solutions of $(P)$, then for every $0 \\leq \\lambda \\leq 1$, the point $z = \\lambda x + (1 - \\lambda) y$ is also an optimal solution of $(P)$.',
        answer: true,
      },
      // From dimension 3 on a point may need more than two vertices.
      {
        text: 'For every feasible solution $x$ of $(P)$, there exist two vertices $v, w \\in V$ and a $0 \\leq \\lambda \\leq 1$ such that $x = \\lambda v + (1 - \\lambda) w$.',
        answer: false,
      },
      // The feasible region is an intersection of half-spaces, hence convex.
      {
        text: 'If $x$ and $y$ are two feasible solutions of $(P)$, then for every $0 \\leq \\lambda \\leq 1$, the point $z = \\lambda x + (1 - \\lambda) y$ is also a feasible solution of $(P)$.',
        answer: true,
      },
      // A whole edge or face may be optimal, and its interior points are not vertices.
      { text: 'Every optimal solution of $(P)$ lies in $V$.', answer: false },
      // Fundamental theorem of linear programming.
      { text: 'At least one optimal solution of $(P)$ lies in $V$.', answer: true },
      // Minkowski, assuming the feasible region itself is bounded.
      { text: 'Every feasible solution of $(P)$ lies in $\\operatorname{conv}(V)$.', answer: true },
    ],
  },
  {
    kind: 'multi',
    id: 'vips-clique-variants',
    source: 'vips',
    title: 'CLIQUE: search, optimization, decision',
    prompt:
      'Consider for $\\mathit{CLIQUE}(G, k)$ the search problem $(\\mathcal{S})$, the optimization problem $(\\mathcal{O})$, and the decision problem $(\\mathcal{E})$ as defined in the lecture. Then the following always holds:',
    pointsPerStatement: 1,
    statements: [
      // $(\mathcal{E})$ asks for a clique of size $k$, not whether $G$ itself is one.
      { text: '$(\\mathcal{E})$ decides whether $G$ is a clique.', answer: false },
      { text: '$(\\mathcal{E})$ decides whether $G$ contains a clique of size $k$.', answer: true },
      // The search problem returns a clique of size $k$ if one exists.
      { text: '$(\\mathcal{S})$ returns a clique of size $k$.', answer: true },
      { text: '$(\\mathcal{S})$ returns a clique of size $\\omega(G)$.', answer: false },
      // The optimization problem asks for a largest clique.
      { text: '$(\\mathcal{O})$ returns a clique of size $k$.', answer: false },
      { text: '$(\\mathcal{O})$ returns a clique of size $\\omega(G)$.', answer: true },
    ],
  },
  {
    kind: 'multi',
    id: 'vips-np-hard',
    source: 'vips',
    title: 'NP-hard and NP',
    prompt:
      'Suppose that $B$ and $C$ are decision problems such that $B \\in \\mathrm{NP}$ and $C$ is NP-hard. Which of the following statements are always true?',
    pointsPerStatement: 1,
    statements: [
      // $B \in \mathrm{NP}$, so $\mathrm{P} = \mathrm{NP}$ would give $B \in \mathrm{P}$.
      { text: 'If $B \\notin \\mathrm{P}$, then $\\mathrm{P} \\neq \\mathrm{NP}$.', answer: true },
      // NP-hard plus in NP is exactly the definition of NP-complete.
      { text: 'If $C \\in \\mathrm{NP}$, then $C$ is NP-complete.', answer: true },
      // That would make $B$ NP-hard, which does not follow from $B \in \mathrm{NP}$.
      { text: '$C \\leq_p B$.', answer: false },
      // Everything in NP reduces to $C$, so NP $\subseteq$ P.
      { text: 'If $C \\in \\mathrm{P}$, then $\\mathrm{P} = \\mathrm{NP}$.', answer: true },
      // $B$ may be an easy problem in NP, e.g. a trivial one.
      { text: 'If $\\mathrm{P} \\neq \\mathrm{NP}$, then $B \\notin \\mathrm{P}$.', answer: false },
    ],
  },
  {
    kind: 'multi',
    id: 'vips-p-np',
    source: 'vips',
    title: 'P and NP',
    prompt:
      'Suppose that $A$ and $B$ are decision problems such that $A \\in \\mathrm{P}$ and $B \\in \\mathrm{NP}$. Which of the following statements are always true?',
    pointsPerStatement: 1,
    statements: [
      // NP-hard by the reductions plus $B \in \mathrm{NP}$.
      {
        text: 'If $C \\leq_p B$ for all decision problems $C \\in \\mathrm{NP}$, then $B$ is NP-complete.',
        answer: true,
      },
      // $A \in \mathrm{P}$ reduces to almost anything, that proves nothing about $B$.
      { text: 'If $A \\leq_p B$, then $B$ is NP-complete.', answer: false },
      // $B$ need not be NP-hard, so this only puts one NP problem into P.
      { text: 'If $B \\leq_p A$, then $\\mathrm{P} = \\mathrm{NP}$.', answer: false },
      // Here $A \in \mathrm{P}$ becomes NP-hard, hence $\mathrm{NP} \subseteq \mathrm{P}$.
      {
        text: 'If $C \\leq_p A$ for all decision problems $C \\in \\mathrm{NP}$, then $\\mathrm{P} = \\mathrm{NP}$.',
        answer: true,
      },
      { text: '$A \\notin \\mathrm{NP}$.', answer: false },
    ],
  },
]
