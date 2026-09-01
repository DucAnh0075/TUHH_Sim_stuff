import type { GraphExam } from '../../types'
import { grades } from './common'

/**
 * GTOP Wintersemester 2024/25 ("GTOP WiSe25.pdf"), Auswertungsbericht fuer 562838
 * (erstellt am 19.3.2025, die Reduktion-Aufgabe nachtraeglich am 24.3.2025 bewertet).
 * Der Bericht ist auf Deutsch - `language: 'de'`.
 *
 * Kein Notenschluessel im Bericht abgedruckt -> `grades(100)` (Standardschema 50..95 %).
 *
 * Antwortschluessel:
 *  - Floyd-Warshall, TSP-Backtrack und Kruskal drucken jeden Wert direkt als
 *    "Loesung: ..."-Zeile ab - verbatim uebernommen.
 *  - Ford-Fulkersons Residualnetzwerk druckt pro Kante nur "richtig", nicht die Werte;
 *    die zehn Residualgewichte unten sind aus dem vollstaendig angegebenen Fluss
 *    (s->a 5/7, s->b 5/5, a->t 2/9, b->t 8/9, a->b 3/8, b->a 0/1) berechnet und stimmen
 *    mit den rosa Kaesten der Abbildung ueberein (2,5 / 0,5 / 7,2 / 8,1 / 5,4).
 *    `val(f) = 12` ist abgedruckt.
 *  - Ford-Fulkersons Min-Schnitt-Teilaufgabe druckt keinen Schluessel; die S-Seite
 *    { s, 4, 6 } ist an den gruen markierten Auswahlfeldern abgelesen und durch das
 *    volle Ergebnis (Ford-Fulkerson 12,0/12) bestaetigt.
 *  - Tiefensuche druckt keinen Schluessel, nur die (alle gruenen) markierten Antworten;
 *    zusammen mit dem vollen Ergebnis (6,0/6) sind die sechs Wahrheitswerte damit
 *    eindeutig.
 *  - Lineare Programmierung: der Bericht druckt pro dualer Nebenbedingung nur die
 *    vergebenen Punkte. A/E/F sind gruen (+0,5), B/C/D wurden uebersprungen (0,0) und
 *    sind hier mathematisch aus der Dualisierung ergaenzt -> `derived: true`.
 *  - Aussagen: der Bericht druckt keinen Schluessel, nur +1/-1/0 je Aussage plus die
 *    markierte Antwort. Jeder Wahrheitswert unten folgt eindeutig aus diesen beiden
 *    Angaben und wurde zusaetzlich nachgerechnet.
 *  - Beweispuzzle: die 10-teilige Reihenfolge unten ist die abgedruckte "Loesung"-Spalte
 *    des Berichts (Text-Extrakt, gegen das PDF gegenzupruefen). `penalty: 1` je Slot.
 *  - Beweis und Reduktion werden auf Papier geloest; der Bericht druckt nur
 *    "Punktzahl +x/10.0". Beides sind `open`-Teile mit `derived`-Loesungsskizze.
 *
 * Figuren stammen aus pdfs/gt-ws2425.pdf (git-ignoriert, noch nicht vorhanden). Ihre
 * `rect`s in figures.manifest.json sind aus den Seitenbildern des Berichts geschaetzt und
 * sollten mit `npm run figures -- --inspect` nachgemessen werden, sobald das PDF vorliegt.
 */
export const GT_WS2425: GraphExam = {
  id: 'gt-ws2425',
  title: 'GTOP Wintersemester 2024/25',
  order: 6,
  language: 'de',
  totalPoints: 100,
  grades: grades(100),
  note: 'Kein Notenschluessel im Original-Bericht abgedruckt - Standardschema (50 % bis 95 %) verwendet.',
  tasks: [
    {
      id: 'ford-fulkerson',
      title: 'Ford-Fulkerson',
      points: 12,
      prompt:
        'Betrachten Sie den folgenden gerichteten Graphen $N = (V, A, s, t, c)$ mit Kapazitaet '
        + '$c : A \\to \\mathbb{R}_{\\geq 0}$ und Fluss $f$ in $N$. Der Eintrag fuer jede Kante '
        + '$e \\in A$ ist gegeben durch $(f(e)/c(e))$.',
      figure: 'gt-ws2425/ff-network',
      parts: [
        {
          kind: 'fields',
          id: 'ff-residual',
          label: 'Restnetzwerk',
          intro:
            'Bestimmen Sie im folgenden Graphen das Restnetzwerk von $N$. Kanten, welche im '
            + 'Restnetzwerk nicht enthalten sind, sollen dabei den Eintrag 0 erhalten.',
          pointsPerField: 0.5,
          layout: 'inline',
          fields: [
            { id: 'sa', label: '$(s,a) =$', expected: '2' },
            { id: 'as', label: '$(a,s) =$', expected: '5' },
            { id: 'sb', label: '$(s,b) =$', expected: '0' },
            { id: 'bs', label: '$(b,s) =$', expected: '5' },
            { id: 'at', label: '$(a,t) =$', expected: '7' },
            { id: 'ta', label: '$(t,a) =$', expected: '2' },
            { id: 'tb', label: '$(t,b) =$', expected: '8' },
            { id: 'bt', label: '$(b,t) =$', expected: '1' },
            { id: 'ab', label: '$(a,b) =$', expected: '5' },
            { id: 'ba', label: '$(b,a) =$', expected: '4' },
          ],
        },
        {
          kind: 'fields',
          id: 'ff-value',
          label: 'Geben Sie den Flusswert eines optimalen Flusses $f$ an.',
          pointsPerField: 3,
          fields: [{ id: 'val-f', label: '$\\mathrm{val}(f) =$', expected: '12' }],
        },
        {
          kind: 'multi',
          id: 'ff-min-cut',
          label: 'Minimaler Schnitt',
          intro:
            'Sei nun fuer ein neues Netzwerk das Restnetzwerk eines maximalen Flusses gegeben. '
            + 'Bestimmen Sie den minimalen Schnitt, indem Sie die Knoten auswaehlen, welche im '
            + 'minimalen Schnitt enthalten sind.',
          figure: 'gt-ws2425/ff-min-cut',
          note:
            '(Richtige Antwort: 0.5 Punkte, falsche Antwort: -0.5 Punkte, Uebersprungen (?): 0 Punkte. '
            + 'Die Teilaufgabe kann nicht weniger als 0 Punkte bringen.)',
          pointsPerStatement: 0.5,
          // S-Seite = die von s im gegebenen Restnetzwerk erreichbaren Knoten: { s, 4, 6 }.
          statements: [
            { text: '$s$', answer: true },
            { text: '$1$', answer: false },
            { text: '$2$', answer: false },
            { text: '$3$', answer: false },
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
        'Gegeben sei ein einfacher gerichteter Graph $G_1 = (V_1, E_1, \\ell_1)$, mit '
        + '$\\ell_1 : E_1 \\to \\mathbb{R}$. Weiter sei $d^k_{i,j}$ so wie im Floyd-Warshall Algorithmus '
        + 'definiert.',
      figure: 'gt-ws2425/floyd-warshall',
      parts: [
        {
          kind: 'fields',
          id: 'fw-values',
          label: 'Bestimmen Sie nun die Werte der untenstehenden $d^k_{i,j}$:',
          pointsPerField: 2,
          fields: [
            { id: 'd587', label: '$d^5_{8,7} =$', expected: '6' },
            { id: 'd464', label: '$d^4_{6,4} =$', expected: '0' },
            { id: 'd426', label: '$d^4_{2,6} =$', expected: 'inf' },
          ],
        },
        {
          kind: 'fields',
          id: 'fw-matrix',
          label: 'Bestimmen Sie die folgenden Werte der Matrix $D^4$:',
          intro:
            'Wir betrachten jetzt einen neuen Graphen $G_2 = (V_2, E_2, \\ell_2)$ mit '
            + '$\\ell_2 : E_2 \\to \\mathbb{R}$ und $|V_2| = 5$. Die Matrix '
            + '$D^k = (d^k_{i,j})_{1 \\leq i,j \\leq n} \\in \\mathbb{Z}^{n \\times n}$ hat allgemein die '
            + 'uebliche Form. Gegeben sei nun die Matrix $D^3 \\in \\mathbb{Z}^{5 \\times 5}$ mit '
            + '$D^3 = (d^3_{i,j})_{1 \\leq i,j \\leq 5}$:',
          display: [
            'D^3 = \\begin{pmatrix} 0 & \\infty & \\infty & 1 & 5 \\\\ \\infty & 0 & \\infty & -1 & \\infty \\\\ '
            + '2 & \\infty & 0 & -4 & 7 \\\\ 4 & 1 & \\infty & 0 & 9 \\\\ 1 & \\infty & -1 & -5 & 0 \\end{pmatrix}',
          ],
          pointsPerField: 2,
          fields: [
            { id: 'd415', label: '$d^4_{1,5} =$', expected: '5' },
            { id: 'd443', label: '$d^4_{4,3} =$', expected: 'inf' },
            { id: 'd431', label: '$d^4_{3,1} =$', expected: '0' },
          ],
        },
      ],
    },

    {
      id: 'tsp-backtrack',
      title: 'TSP-Backtrack',
      points: 8,
      prompt: 'Betrachten Sie den folgenden Graphen.',
      promptExtra: [
        'Sie sollen nun den $\\text{TSP-Backtrack}_{MST}$ Algorithmus anwenden. Seien dazu die folgenden '
        + 'partiellen Touren gegeben:',
        '$P_1 : (5, 4, 2)$ — $P_2 : (4, 5, 2)$ — $P_3 : (2, 5, 3)$ — $P_4 : (4, 3, 5)$.',
        'Weiterhin habe die bisher kuerzeste gefundene Tour den Wert $\\text{opt } f = 19$. Bestimmen Sie '
        + 'fuer die gegebenen partiellen Touren $B(P_i)$ fuer $i \\in [4]$ und geben Sie an, ob der '
        + '$\\text{TSP-Backtrack}_{MST}$ Algorithmus die Untersuchung dieser partiellen Tour weiterfuehren '
        + 'wuerde.',
      ],
      figure: 'gt-ws2425/tsp-backtrack',
      parts: [
        {
          kind: 'fields',
          id: 'tsp-b-p1',
          group: '$P_1 : (5, 4, 2)$',
          label: '$B(P_1) =$',
          pointsPerField: 1,
          fields: [{ id: 'b1', expected: '11' }],
        },
        {
          kind: 'single',
          id: 'tsp-continue-p1',
          group: '$P_1 : (5, 4, 2)$',
          points: 1,
          variant: 'inline',
          options: [{ text: 'Nein, bricht ab.' }, { text: 'Ja, bricht nicht ab.' }],
          correct: 1,
        },
        {
          kind: 'fields',
          id: 'tsp-b-p2',
          group: '$P_2 : (4, 5, 2)$',
          label: '$B(P_2) =$',
          pointsPerField: 1,
          fields: [{ id: 'b2', expected: '17' }],
        },
        {
          kind: 'single',
          id: 'tsp-continue-p2',
          group: '$P_2 : (4, 5, 2)$',
          points: 1,
          variant: 'inline',
          options: [{ text: 'Nein, bricht ab.' }, { text: 'Ja, bricht nicht ab.' }],
          correct: 1,
        },
        {
          kind: 'fields',
          id: 'tsp-b-p3',
          group: '$P_3 : (2, 5, 3)$',
          label: '$B(P_3) =$',
          pointsPerField: 1,
          fields: [{ id: 'b3', expected: '24' }],
        },
        {
          kind: 'single',
          id: 'tsp-continue-p3',
          group: '$P_3 : (2, 5, 3)$',
          points: 1,
          variant: 'inline',
          options: [{ text: 'Nein, bricht ab.' }, { text: 'Ja, bricht nicht ab.' }],
          correct: 0,
        },
        {
          kind: 'fields',
          id: 'tsp-b-p4',
          group: '$P_4 : (4, 3, 5)$',
          label: '$B(P_4) =$',
          pointsPerField: 1,
          fields: [{ id: 'b4', expected: '18' }],
        },
        {
          kind: 'single',
          id: 'tsp-continue-p4',
          group: '$P_4 : (4, 3, 5)$',
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
        'Sie sollen nun den Kruskal Algorithmus anwenden. Beachten Sie, dass einige Teilaufgaben den '
        + 'Zustand des Algorithmus abfragen, bevor dieser vollstaendig durchlaufen ist.',
      ],
      figure: 'gt-ws2425/kruskal',
      parts: [
        {
          kind: 'fields',
          id: 'kruskal-after-6',
          label:
            'Was ist nach 6 Berechnungsschritten (d.h. nachdem die 6. Kante hinzugefuegt wurde) die '
            + 'Summe der Kantengewichte der Kanten, die bislang hinzugefuegt wurden?',
          pointsPerField: 1,
          fields: [{ id: 'sum6', expected: '29' }],
        },
        {
          kind: 'fields',
          id: 'kruskal-r-vertices',
          label: 'R-Knoten und Komponentengroessen',
          intro:
            'Bestimmen Sie nachfolgend die repraesentativen Knoten (R-Knoten) nach 6 Berechnungsschritten '
            + '(d.h. nachdem die 6. Kante hinzugefuegt wurde) und geben Sie die Groesse der zugehoerigen '
            + 'Komponente an. Beachten Sie: Falls bei der Vereinigung zweier Komponenten diese gleich gross '
            + 'sind, wird der Knoten mit der kleineren Nummer repraesentativer Knoten.',
          pointsPerField: 1,
          fields: [
            { id: 'r8', label: 'R-Knoten von Knoten 8:', expected: '8' },
            { id: 'size8', label: 'Groesse der zu Knoten 8 gehoerenden Komponente:', expected: '1' },
            { id: 'r4', label: 'R-Knoten von Knoten 4:', expected: '3' },
            { id: 'size4', label: 'Groesse der zu Knoten 4 gehoerenden Komponente:', expected: '5' },
          ],
        },
        {
          kind: 'fields',
          id: 'kruskal-mst',
          label:
            'Fuehren Sie nun den Algorithmus von Kruskal bis zum Schluss aus und geben Sie die Summe der '
            + 'Kanten des Spannbaums an.',
          pointsPerField: 1,
          fields: [{ id: 'mst', label: 'Summe der Kantengewichte $=$', expected: '68' }],
        },
      ],
    },

    {
      id: 'tiefensuche',
      title: 'Tiefensuche',
      points: 6,
      prompt: 'Wir starten eine Tiefensuche im folgenden Graphen:',
      promptExtra: [
        'Waehlen Sie nachfolgend aus, ob die Tiefensuche die Knoten in den untenstehenden Knotenfolgen '
        + 'als bekannt markieren koennte oder nicht. Der erste Knoten in der Knotenfolge repraesentiert '
        + 'den Startknoten, welcher dem Algorithmus als Input gegeben wird.',
      ],
      note: '(Richtige Antwort: 1 Punkt, falsche Antwort: -1 Punkt, Uebersprungen (?): 0 Punkte.)',
      figure: 'gt-ws2425/dfs',
      parts: [
        {
          kind: 'multi',
          id: 'dfs-sequences',
          pointsPerStatement: 1,
          statements: [
            { text: '5, 6, 4, 7, 10, 2, 8, 3, 1, 9', answer: false },
            { text: '3, 8, 4, 10, 2, 6, 5, 1, 9, 7', answer: false },
            { text: '7, 9, 1, 3, 5, 6, 4, 8, 2, 10', answer: true },
            { text: '10, 4, 8, 1, 9, 7, 5, 3, 6, 2', answer: false },
            { text: '6, 2, 4, 7, 9, 1, 3, 8, 5, 10', answer: true },
            { text: '10, 7, 9, 4, 2, 6, 5, 8, 1, 3', answer: true },
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
        '\\min_{x \\in \\mathbb{R}^2} \\; -3x_1 + x_2 \\quad \\text{u.d.N.} \\\\[4pt] '
        + '2x_1 + x_2 \\leq 8 \\\\ x_1 + 2x_2 \\leq 7 \\\\ -x_1 + x_2 \\geq 2 \\\\ x_1, x_2 \\geq 0',
      ],
      promptExtra: ['Hier sehen Sie als Hilfestellung eine entsprechende Zeichnung:'],
      figure: 'gt-ws2425/lp-plot',
      parts: [
        {
          kind: 'fields',
          id: 'lp-vertex',
          label: 'Geben Sie die optimale Ecke an:',
          pointsPerField: 1,
          layout: 'inline',
          fields: [
            { id: 'x1', label: '$x_1 =$', expected: '1' },
            { id: 'x2', label: '$x_2 =$', expected: '3' },
          ],
        },
        {
          kind: 'single',
          id: 'lp-dual-objective',
          label: 'Kreuzen Sie die korrekte Zielfunktion des dualen Programms an.',
          points: 1,
          options: [
            { text: '$\\max_{y \\in \\mathbb{R}^2} 3y_1 - y_2$' },
            { text: '$\\max_{y \\in \\mathbb{R}^2} -3y_1 + y_2$' },
            { text: '$\\max_{y \\in \\mathbb{R}^3} 8y_1 + 7y_2 + 2y_3$' },
            { text: '$\\max_{y \\in \\mathbb{R}^3} -8y_1 - 7y_2 + 2y_3$' },
          ],
          correct: 3,
        },
        {
          kind: 'multi',
          id: 'lp-dual-constraints',
          label: 'Kreuzen Sie die Nebenbedingungen an, die im dualen Programm enthalten sind.',
          note:
            '(Richtige Antwort: 0.5 Punkte, falsche Antwort: -0.5 Punkte, Uebersprungen (?): 0 Punkte. '
            + 'Die Teilaufgabe kann nicht weniger als 0 Punkte bringen.)',
          pointsPerStatement: 0.5,
          // In >=-Form: A = [[-2,-1],[-1,-2],[-1,1]], b = (-8,-7,2), c = (-3,1); das Dual
          // max b^T y, A^T y <= c, y >= 0 liefert genau A, E und F. B/C/D wurden im Bericht
          // uebersprungen und sind hier rechnerisch ergaenzt.
          statements: [
            { text: '$-2y_1 - y_2 - y_3 \\leq -3$', answer: true },
            { text: '$y_1, y_2, y_3 \\geq 1$', answer: false, derived: true },
            { text: '$y_1 + 2y_2 + y_3 \\leq 1$', answer: false, derived: true },
            { text: '$2y_1 + y_2 - y_3 \\leq -3$', answer: false, derived: true },
            { text: '$y_1, y_2, y_3 \\geq 0$', answer: true },
            { text: '$-y_1 - 2y_2 + y_3 \\leq 1$', answer: true },
          ],
        },
      ],
    },

    {
      id: 'aussagen',
      title: 'Aussagen',
      points: 20,
      prompt: 'Beantworten Sie die folgenden Fragen. Es koennen mehrere Antwortmoeglichkeiten richtig sein.',
      note:
        '(Richtige Antwort: 1 Punkt, falsche Antwort: -1 Punkt, Uebersprungen (?): 0 Punkte. Die '
        + 'Teilaufgabe kann nicht weniger als 0 Punkte bringen.) Der Bericht druckt keinen Schluessel ab - '
        + 'die Wahrheitswerte unten folgen eindeutig aus den vergebenen +1/-1-Punkten je Aussage und der '
        + 'markierten Antwort und wurden zusaetzlich nachgerechnet.',
      parts: [
        {
          kind: 'multi',
          id: 'aussagen-subgraph',
          label: 'Subgraph / Spannbaum',
          intro:
            'Sei $G = (V, E)$ ein zusammenhaengender Graph mit $|V| \\geq 5$, und $H$ ein '
            + 'zusammenhaengender Subgraph von $G$, und $T$ ein aufspannender Baum von $G$. Welche der '
            + 'folgenden Aussagen gelten dann immer?',
          pointsPerStatement: 1,
          statements: [
            { text: '$H$ hat mindestens so viele Kanten wie $T$.', answer: false },
            { text: 'Jeder induzierte Subgraph von $G$ ist kreisfrei.', answer: false },
            { text: 'Es gibt mindestens eine Kante von $G$, die in $H$ und in $T$ enthalten ist.', answer: false },
            { text: 'Jeder induzierte Subgraph von $T$ ist zusammenhaengend.', answer: false },
            { text: '$T$ hat mindestens so viele Kanten wie $H$.', answer: false },
          ],
        },
        {
          kind: 'multi',
          id: 'aussagen-durchmesser',
          label: 'Durchmesser',
          intro:
            'Der Durchmesser eines Graphen $G = (V, E)$ mit $|V| \\geq 4$ ist definiert als '
            + '$\\mathrm{diam}(G) := \\max\\{\\mathrm{dist}_G(x, y) : x, y \\in V\\}$. Welche der folgenden '
            + 'Aussagen gelten dann immer?',
          pointsPerStatement: 1,
          statements: [
            {
              text: 'Die Ungleichung $\\mathrm{diam}(G) \\leq |V|$ gilt genau dann, wenn $G$ zusammenhaengend ist.',
              answer: true,
            },
            {
              text: 'Wenn $H$ ein induzierter Subgraph von $G$ ist, dann gilt $\\mathrm{diam}(H) \\leq \\mathrm{diam}(G)$.',
              answer: false,
            },
            {
              text:
                'Wenn $G$ zusammenhaengend ist und $T$ ein aufspannender Baum von $G$ ist, dann gilt '
                + '$\\mathrm{diam}(G) \\leq \\mathrm{diam}(T)$.',
              answer: true,
            },
            {
              text: 'Wenn $H$ ein induzierter Subgraph von $G$ ist, dann gilt $\\mathrm{diam}(G) \\leq \\mathrm{diam}(H)$.',
              answer: false,
            },
            { text: '$\\mathrm{diam}(C_n) = \\lfloor \\frac{n}{2} \\rfloor$.', answer: true },
          ],
        },
        {
          kind: 'multi',
          id: 'aussagen-matching',
          label: 'Matching',
          intro:
            'Sei $G = (V, E)$ ein Graph mit $|V| \\geq 3$ und $M$ ein Matching in $G$. Welche der folgenden '
            + 'Aussagen gelten immer?',
          pointsPerStatement: 1,
          statements: [
            { text: '$|M| \\leq \\frac{|V|}{2}$.', answer: true },
            {
              text: 'Wenn $P$ ein $M$-augmentierender Weg ist, muss $P$ eine ungerade Anzahl von Kanten enthalten.',
              answer: true,
            },
            { text: 'Wenn $2|M| = |V|$ ist, dann ist $M$ ein groesstes Matching.', answer: true },
            {
              text: 'Wenn es keinen $M$-augmentierenden Weg in $G$ gibt, dann ist $M$ ein groesstes Matching.',
              answer: true,
            },
            {
              text: 'Wenn $G$ zusammenhaengend ist, dann folgt, dass $|M| \\geq \\frac{|E|}{2}$.',
              answer: false,
            },
          ],
        },
        {
          kind: 'multi',
          id: 'aussagen-sat',
          label: '3-SAT',
          intro:
            'Es sei $F$ eine 3-SAT Formel in konjunktiver Normalform mit $n \\geq 4$ Variablen '
            + '$x_1, \\ldots, x_n$. $F$ enthaelt die Klauseln $C_1 := (x_1 \\vee x_2 \\vee x_3)$ und '
            + '$C_2 := (\\bar{x}_1 \\vee \\bar{x}_2 \\vee \\bar{x}_3)$ und $m \\geq 5$ weitere Klauseln. '
            + 'Welche der folgenden Aussagen gelten immer?',
          pointsPerStatement: 1,
          statements: [
            { text: '$F$ ist erfuellbar.', answer: false },
            { text: 'Es gibt keine erfuellende Belegung, in der $x_1 = x_2 = x_3$ ist.', answer: true },
            { text: 'Wenn eine Belegung $C_1$ erfuellt, dann erfuellt sie $C_2$ nicht.', answer: false },
            {
              text: 'Wenn in einer erfuellenden Belegung $x_1 = 1$ ist, dann muss in dieser Belegung $x_2 = 0$ sein.',
              answer: false,
            },
            { text: '$F$ ist nicht erfuellbar.', answer: false },
          ],
        },
      ],
    },

    {
      id: 'beweispuzzle',
      title: 'Beweispuzzle',
      points: 10,
      prompt:
        'Eine Kante heisst Bruecke, wenn durch ihr Entfernen die Anzahl der Zusammenhangskomponenten des '
        + 'Graphen steigt. Sei $G = (V, E)$ ein zusammenhaengender, bipartiter, $d$-regulaerer Graph mit '
        + '$d \\geq 2$. Zeigen Sie: $G$ besitzt keine Bruecke.',
      promptExtra: [
        'Sie koennen dafuer einige der Textbausteine von der rechten Seite auf die linke Seite ziehen und '
        + 'sortieren. Nicht alle Textbausteine muessen benutzt werden. Nutzen Sie nur notwendige Bausteine.',
      ],
      parts: [
        {
          kind: 'order',
          id: 'beweispuzzle-proof',
          intro: 'Sortieren Sie die passenden Textbausteine zu einem vollstaendigen Beweis.',
          points: 10,
          penalty: 1,
          items: [
            { id: 'c1', text: 'Nehme an, es existiert eine Bruecke $e = \\{a, b\\} \\in E$.' },
            { id: 'c2', text: 'Weil $G$ bipartit ist, muss auch $G \\setminus \\{e\\}$ bipartit sein.' },
            {
              id: 'c3',
              text:
                'Sei $A = A_1 \\cup A_2$ die Zusammenhangskomponente von $G \\setminus \\{e\\}$, die $a$ '
                + 'enthaelt, mit $a \\in A_1$.',
            },
            { id: 'c4', text: 'Der einzige Knoten in $A$ mit Grad ungleich $d$ ist $a$,' },
            {
              id: 'c5',
              text: 'da $b$ in einer anderen Zusammenhangskomponente und damit nicht in $A$ liegt.',
            },
            {
              id: 'c6',
              text:
                'Somit gilt $\\sum_{v \\in A_1} \\deg(v) = d(|A_1| - 1) + \\deg(a) = d \\cdot |A_1| - 1$ und',
            },
            { id: 'c7', text: '$\\sum_{v \\in A_2} \\deg(v) = d \\cdot |A_2|$.' },
            { id: 'c8', text: 'Da $A = A_1 \\cup A_2$ bipartit ist,' },
            {
              id: 'c9',
              text:
                'muss $\\sum_{v \\in A_1} \\deg(v) = \\sum_{v \\in A_2} \\deg(v)$, also '
                + '$d \\cdot |A_1| - 1 = d \\cdot |A_2|$, gelten,',
            },
            { id: 'c10', text: 'was nicht moeglich ist und somit einen Widerspruch darstellt.' },
            { id: 'd1', text: 'Nehme an, es existiert keine Bruecke in $G$.' },
            { id: 'd2', text: 'Somit gilt $\\sum_{v \\in A_1} \\deg(v) = d \\cdot |A_1|$ und' },
            {
              id: 'd3',
              text:
                'muss $\\sum_{v \\in A_1} \\deg(v) < \\sum_{v \\in A_2} \\deg(v)$, also '
                + '$d \\cdot |A_1| - 1 > d \\cdot |A_2|$, gelten,',
            },
            {
              id: 'd4',
              text:
                'Daher kann $\\sum_{v \\in A_1} \\deg(v)$ nicht gerade sein, was einen Widerspruch darstellt.',
            },
            { id: 'd5', text: 'Damit gilt $b \\in A_2$.' },
          ],
          solution: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10'],
        },
      ],
    },

    {
      id: 'beweis',
      title: 'Beweis (schriftlich)',
      points: 10,
      prompt:
        'Sei $G$ ein zusammenhaengender Graph und sei $d$ die Laenge eines laengsten Wegs in $G$. Weiter '
        + 'seien $P_1$ und $P_2$ zwei unterschiedliche Wege der Laenge $d$ in $G$. Zeigen Sie, dass $P_1$ '
        + 'und $P_2$ sich in mindestens einem Knoten schneiden.',
      promptExtra: ['Loesen Sie diese Aufgabe bitte auf dem Papier.'],
      parts: [
        {
          kind: 'open',
          id: 'beweis-longest-paths',
          points: 10,
          derived: true,
          solution:
            'Der Bericht druckt keine Musterloesung ab (nur "Punktzahl +0.0/10.0"). Beweisskizze '
            + '(Widerspruch):\n'
            + 'Angenommen, $P_1$ und $P_2$ sind knotendisjunkt. Da $G$ zusammenhaengend ist, gibt es einen '
            + 'kuerzesten Weg $Q$ von einem Knoten $u \\in V(P_1)$ zu einem Knoten $w \\in V(P_2)$; als '
            + 'kuerzester solcher Weg ist $Q$ im Inneren disjunkt zu $P_1 \\cup P_2$ und hat Laenge '
            + '$|Q| \\geq 1$.\n'
            + 'Der Knoten $u$ zerlegt $P_1$ in zwei Teilwege; der laengere hat Laenge $\\geq d/2$. Ebenso '
            + 'zerlegt $w$ den Weg $P_2$, und der laengere Teil hat Laenge $\\geq d/2$.\n'
            + 'Haengt man (laengere Haelfte von $P_1$) $+ Q +$ (laengere Haelfte von $P_2$) aneinander, '
            + 'entsteht ein Weg der Laenge $\\geq d/2 + |Q| + d/2 = d + |Q| \\geq d + 1 > d$ - Widerspruch '
            + 'zur Maximalitaet von $d$.\n'
            + 'Also koennen $P_1$ und $P_2$ nicht knotendisjunkt sein und schneiden sich in mindestens '
            + 'einem Knoten.',
        },
      ],
    },

    {
      id: 'reduktion',
      title: 'Reduktion (schriftlich)',
      points: 10,
      prompt:
        'Das Entscheidungsproblem $3-\\mathrm{COL}$ lautet: Gegeben ein Graph $G$, ist $G$ 3-faerbbar? '
        + 'Das Entscheidungsproblem $3-\\mathrm{COL}^*$ lautet: Gegeben ein Graph $G$, in dem jeder Knoten '
        + 'Grad mindestens 2 hat, ist $G$ 3-faerbbar?',
      promptExtra: [
        'Zeigen Sie $3-\\mathrm{COL} \\leq_p 3-\\mathrm{COL}^*$.',
        'Loesen Sie diese Aufgabe bitte schriftlich auf dem Papier.',
      ],
      parts: [
        {
          kind: 'open',
          id: 'reduktion-3col',
          points: 10,
          derived: true,
          solution:
            'Der Bericht druckt keine Musterloesung ab (nur "Punktzahl +4.0/10.0"). Beweisskizze:\n'
            + 'Transformation: Bilde aus der Eingabe $G = (V, E)$ von $3-\\mathrm{COL}$ die Eingabe $G\'$ von '
            + '$3-\\mathrm{COL}^*$, indem fuer jeden Knoten $v \\in V$ zwei neue Knoten $a_v, b_v$ und die '
            + 'Kanten $\\{v, a_v\\}, \\{v, b_v\\}, \\{a_v, b_v\\}$ hinzugefuegt werden (ein Dreieck auf '
            + '$v, a_v, b_v$).\n'
            + 'Zulaessigkeit: Jeder urspruengliche Knoten $v$ hat nun Grad $\\geq 2$, und $a_v, b_v$ haben '
            + 'Grad genau 2. Also erfuellt $G\'$ die Gradbedingung von $3-\\mathrm{COL}^*$.\n'
            + '"$\\Rightarrow$": Aus einer 3-Faerbung von $G$ erhaelt man eine von $G\'$, indem $a_v$ und '
            + '$b_v$ mit den zwei Farben gefaerbt werden, die von $f(v)$ verschieden sind.\n'
            + '"$\\Leftarrow$": Die Einschraenkung einer 3-Faerbung von $G\'$ auf $V$ ist eine 3-Faerbung '
            + 'von $G$, da $G$ induzierter Teilgraph von $G\'$ ist.\n'
            + 'Die Konstruktion fuegt $2|V|$ Knoten und $3|V|$ Kanten hinzu, laeuft also in polynomieller '
            + 'Zeit. Damit gilt $3-\\mathrm{COL} \\leq_p 3-\\mathrm{COL}^*$.',
        },
      ],
    },
  ],
}
