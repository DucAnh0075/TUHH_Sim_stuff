import type { GraphExam } from '../../types'
import { grades } from './common'

/**
 * GTOP Sommersemester 2024 - ZWEITER Klausur-Slot ("GTOP SoSe24.pdf", Auswertungsbericht
 * fuer Matrikelnummer 420, erstellt am 16.9.2024), Prof. Dr. Anusch Taraz.
 *
 * Es gibt im SoSe 2024 mehrere verschiedene Klausuren (ein Satz pro Pruefungs-Slot). Der
 * bereits erfasste `gt-ss2024` ist der englischsprachige Slot; DIESER Bericht ist auf
 * Deutsch und enthaelt voellig andere Aufgabeninhalte -> eigenes Exam `gt-ss2024b`,
 * `language: 'de'`. In der Liste heissen die beiden "(Slot A)" / "(Slot B)"; welcher
 * Slot genau welcher Buchstabe ist, geht aus dem Bericht nicht hervor.
 *
 * Notenschluessel: der Bericht druckt exakt das Standardschema 95..50 % auf 100 Punkte ab,
 * `grades(100)` reproduziert es Zeile fuer Zeile.
 *
 * Antwortschluessel:
 *  - Floyd-Warshall, Kruskal, die B(x)-Werte bei Knapsack-Backtrack, die optimale LP-Ecke
 *    und die duale LP-Zielfunktion drucken jeden Wert direkt als "Loesung: ..."-Zeile ab
 *    - verbatim uebernommen.
 *  - Ford-Fulkersons Restnetzwerk druckt pro Kante nur "richtig", nicht die Werte; die
 *    zehn Residualgewichte unten sind aus dem vollstaendig angegebenen Fluss berechnet
 *    (s->a 3/9, s->b 2/2, a->t 5/5, b->t 0/8, a->b 0/1, b->a 2/5) und stimmen mit den
 *    rosa Kaesten der Abbildung ueberein (3,6 / 2,0 / 5,0 / 0,8 / 3,3). `val(f) = 8` ist
 *    abgedruckt.
 *  - Ford-Fulkersons Min-Schnitt-Teilaufgabe druckt keinen Schluessel; die S-Seite
 *    { s, 4 } ist an der Restnetzwerk-Abbildung abgelesen (von s fuehrt nur s<->4 heraus)
 *    und durch das FF-Teilergebnis 8,5/12 bestaetigt (7 richtige Knoten, Knoten 5 "?").
 *  - Aussagen: der Bericht druckt keinen Schluessel, nur +1/-1/0 je Aussage. Jeder
 *    Wahrheitswert unten folgt eindeutig aus den vergebenen Punkten (bei +/-1) und wurde
 *    zusaetzlich nachgerechnet; die sechs uebersprungenen Aussagen (0.00) sind
 *    `derived: true`.
 *  - Lineare Programmierung / duale Nebenbedingungen: der Bericht druckt nur die Punkte
 *    (alle +0,5, volles Teilergebnis) - zusammen mit dem vollen LP-Ergebnis (6,0/6) und
 *    der Dualisierung sind B/C/D wahr und A/E/F falsch.
 *  - Tiefensuche druckt keinen Schluessel; die sechs Wahrheitswerte sind aus dem Graphen
 *    der Abbildung per DFS-Simulation bestimmt (A/B/E/F ungueltig, C/D gueltig).
 *  - Beweispuzzle: die 10-teilige Reihenfolge unten ist die abgedruckte "Loesung"-Spalte
 *    des Berichts (Text-Auszug). `penalty: 1` je Slot.
 *  - Beweis und Reduktion werden auf Papier geloest; der Bericht druckt nur
 *    "Punktzahl +0.0/10.0". Beides sind `open`-Teile mit `derived`-Loesungsskizze fuer
 *    den Selbstabgleich.
 *
 * Figuren stammen aus pdfs/gt-ss2024b.pdf (git-ignoriert, noch nicht vorhanden). Ihre
 * `rect`s in figures.manifest.json sind aus den Seitenbildern des Berichts geschaetzt
 * (uebernommen von `gt-ss2024`, gleiches Berichtslayout) und sollten mit
 * `npm run figures -- --inspect` nachgemessen werden, sobald das PDF vorliegt.
 */
export const GT_SS2024B: GraphExam = {
  id: 'gt-ss2024b',
  title: 'GTOP Sommersemester 2024 (Slot B)',
  // Gleiches Semester wie `gt-ss2024` (order 6), anderer Slot -> direkt dahinter einsortiert.
  order: 6.5,
  language: 'de',
  totalPoints: 100,
  grades: grades(100),
  note:
    'Der Bericht weist zusaetzlich 3 Bonuspunkte aus (Hausaufgaben 0, ILIAS 1, VIP 2). Bonuspunkte '
    + 'zaehlen nur, wenn ohne sie mindestens eine 4.0 erreicht wurde - hier sind sie deshalb nicht '
    + 'eingerechnet.',
  tasks: [
    {
      id: 'ford-fulkerson',
      title: 'Ford-Fulkerson',
      points: 12,
      prompt:
        'Betrachten Sie den folgenden gerichteten Graphen $N = (V, A, s, t, c)$ mit Kapazitaet '
        + '$c : A \\to \\mathbb{R}_{\\geq 0}$ und Fluss $f$ in $N$. Der Eintrag fuer jede Kante '
        + '$e \\in A$ ist gegeben durch $(f(e)/c(e))$.',
      figure: 'gt-ss2024b/ff-network',
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
            { id: 'sa', label: '$(s,a) =$', expected: '6' },
            { id: 'as', label: '$(a,s) =$', expected: '3' },
            { id: 'sb', label: '$(s,b) =$', expected: '0' },
            { id: 'bs', label: '$(b,s) =$', expected: '2' },
            { id: 'at', label: '$(a,t) =$', expected: '0' },
            { id: 'ta', label: '$(t,a) =$', expected: '5' },
            { id: 'tb', label: '$(t,b) =$', expected: '0' },
            { id: 'bt', label: '$(b,t) =$', expected: '8' },
            { id: 'ab', label: '$(a,b) =$', expected: '3' },
            { id: 'ba', label: '$(b,a) =$', expected: '3' },
          ],
        },
        {
          kind: 'fields',
          id: 'ff-value',
          label: 'Geben Sie den Flusswert eines optimalen Flusses $f$ an.',
          pointsPerField: 3,
          fields: [{ id: 'val-f', label: '$\\mathrm{val}(f) =$', expected: '8' }],
        },
        {
          kind: 'multi',
          id: 'ff-min-cut',
          label: 'Minimaler Schnitt',
          intro:
            'Sei nun fuer ein neues Netzwerk das Restnetzwerk eines maximalen Flusses gegeben. '
            + 'Bestimmen Sie den minimalen Schnitt, indem Sie die Knoten auswaehlen, welche im '
            + 'minimalen Schnitt enthalten sind.',
          figure: 'gt-ss2024b/ff-min-cut',
          note:
            '(Richtige Antwort: 0.5 Punkte, falsche Antwort: -0.5 Punkte, Uebersprungen (?): 0 Punkte. '
            + 'Die Teilaufgabe kann nicht weniger als 0 Punkte bringen.)',
          pointsPerStatement: 0.5,
          // S-Seite = die von s im gegebenen Restnetzwerk erreichbaren Knoten. In der
          // Abbildung fuehrt von s nur die Kante s<->4 heraus (beide Richtungen, Gewicht
          // 6), 4 hat sonst nur 4->s; alle uebrigen Residualkanten (5->2, 6->2, 1->s,
          // 3->t, ...) fuehren nicht zurueck nach { s, 4 }. Also S = { s, 4 }. Das volle
          // FF-Teilergebnis 8,5/12 (7 richtige Knoten, 5 uebersprungen) bestaetigt das.
          statements: [
            { text: '$s$', answer: true },
            { text: '$1$', answer: false },
            { text: '$2$', answer: false },
            { text: '$3$', answer: false },
            { text: '$4$', answer: true },
            { text: '$5$', answer: false },
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
        'Gegeben sei ein einfacher gerichteter Graph $G_1 = (V_1, E_1, \\ell_1)$, mit '
        + '$\\ell_1 : E_1 \\to \\mathbb{R}$. Weiter sei $d^k_{i,j}$ so wie im Floyd-Warshall '
        + 'Algorithmus definiert.',
      figure: 'gt-ss2024b/floyd-warshall',
      parts: [
        {
          kind: 'fields',
          id: 'fw-values',
          label: 'Bestimmen sie nun die Werte der untenstehenden $d^k_{i,j}$:',
          pointsPerField: 2,
          fields: [
            { id: 'd573', label: '$d^7_{5,3} =$', expected: '17' },
            { id: 'd457', label: '$d^4_{5,7} =$', expected: '8' },
            { id: 'd241', label: '$d^2_{4,1} =$', expected: 'inf' },
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
            'D^3 = \\begin{pmatrix} 0 & \\infty & \\infty & -1 & \\infty \\\\ -2 & 0 & \\infty & -3 & 5 \\\\ '
            + '\\infty & \\infty & 0 & \\infty & 3 \\\\ \\infty & \\infty & 2 & 0 & 5 \\\\ -3 & -1 & \\infty & -4 & 0 \\end{pmatrix}',
          ],
          pointsPerField: 2,
          fields: [
            { id: 'd414', label: '$d^4_{1,4} =$', expected: '-1' },
            { id: 'd432', label: '$d^4_{3,2} =$', expected: 'inf' },
            { id: 'd425', label: '$d^4_{2,5} =$', expected: '2' },
          ],
        },
      ],
    },

    {
      id: 'knapsack-backtrack',
      title: 'Knapsack-Backtrack',
      points: 8,
      prompt: 'Gegeben sei ein Rucksackproblem mit $b = 18$ und den folgenden 7 Gegenstaenden:',
      display: [
        '(f_1, f_2, f_3, f_4, f_5, f_6, f_7) = (2, 5, 1, 3, 9, 4, 2) \\\\[4pt] '
        + '(g_1, g_2, g_3, g_4, g_5, g_6, g_7) = (4, 2, 1, 4, 6, 3, 1)',
      ],
      promptExtra: [
        'Weiter gilt $x_1, \\ldots, x_7 \\in \\{0, 1\\}$. Die bisher beste gefundene Loesung hat den Wert '
        + '$\\mathrm{opt}\\, f = 24$.',
        'Sie sollen nun den $\\mathrm{Backtracking3}$-Algorithmus fuer das Rucksackproblem anwenden. Seien '
        + 'dazu die folgenden vier partiellen Loesungen gegeben, bei denen jeweils 3 Elemente $x_i$ '
        + 'angegeben sind, welche vom Algorithmus noch nicht betrachtet wurden, sowie der Wert $f$ und das '
        + 'Gewicht $g$ der aktuellen Befuellung:',
        '(i) $x_2, x_4, x_7$, $f = 16$, $g = 14$ — (ii) $x_1, x_5, x_7$, $f = 13$, $g = 10$ — '
        + '(iii) $x_1, x_3, x_4$, $f = 20$, $g = 12$ — (iv) $x_3, x_4, x_7$, $f = 20$, $g = 15$.',
        'Bestimmen Sie fuer die gegebenen partiellen Loesungen jeweils $B(x)$ und geben Sie an, ob der '
        + '$\\mathrm{Backtracking3}$-Algorithmus die Untersuchung dieser partiellen Loesung weiterfuehren '
        + 'wuerde. Zur Erinnerung: Der $\\mathrm{Backtracking3}$-Algorithmus verwendet das fraktionale '
        + 'Rucksackproblem zur Berechnung von $B(x)$.',
      ],
      note:
        'Falls der errechnete Wert fraktional ist, geben Sie den Wert gerundet auf zwei Nachkommastellen '
        + 'an und benutzen Sie ein Komma als Dezimalzeichen. Beispiel: Fuer $B = 10 + \\frac{2}{3}$ geben '
        + 'Sie 10,67 ein.',
      parts: [
        {
          kind: 'fields',
          id: 'ks-b1',
          group: 'i)  $x_2, x_4, x_7$,  $f = 16$, $g = 14$',
          pointsPerField: 1,
          fields: [{ id: 'b1', label: '$B(x) =$', expected: '23.75', alternatives: ['23,75'] }],
        },
        {
          kind: 'single',
          id: 'ks-c1',
          group: 'i)  $x_2, x_4, x_7$,  $f = 16$, $g = 14$',
          points: 1,
          variant: 'inline',
          options: [{ text: 'Nein, bricht ab.' }, { text: 'Ja, bricht nicht ab.' }],
          correct: 0,
        },
        {
          kind: 'fields',
          id: 'ks-b2',
          group: 'ii)  $x_1, x_5, x_7$,  $f = 13$, $g = 10$',
          pointsPerField: 1,
          fields: [{ id: 'b2', label: '$B(x) =$', expected: '24.5', alternatives: ['24,5', '24.50', '24,50'] }],
        },
        {
          kind: 'single',
          id: 'ks-c2',
          group: 'ii)  $x_1, x_5, x_7$,  $f = 13$, $g = 10$',
          points: 1,
          variant: 'inline',
          options: [{ text: 'Nein, bricht ab.' }, { text: 'Ja, bricht nicht ab.' }],
          correct: 1,
        },
        {
          kind: 'fields',
          id: 'ks-b3',
          group: 'iii)  $x_1, x_3, x_4$,  $f = 20$, $g = 12$',
          pointsPerField: 1,
          fields: [{ id: 'b3', label: '$B(x) =$', expected: '24.5', alternatives: ['24,5', '24.50', '24,50'] }],
        },
        {
          kind: 'single',
          id: 'ks-c3',
          group: 'iii)  $x_1, x_3, x_4$,  $f = 20$, $g = 12$',
          points: 1,
          variant: 'inline',
          options: [{ text: 'Nein, bricht ab.' }, { text: 'Ja, bricht nicht ab.' }],
          correct: 1,
        },
        {
          kind: 'fields',
          id: 'ks-b4',
          group: 'iv)  $x_3, x_4, x_7$,  $f = 20$, $g = 15$',
          pointsPerField: 1,
          fields: [{ id: 'b4', label: '$B(x) =$', expected: '23.75', alternatives: ['23,75'] }],
        },
        {
          kind: 'single',
          id: 'ks-c4',
          group: 'iv)  $x_3, x_4, x_7$,  $f = 20$, $g = 15$',
          points: 1,
          variant: 'inline',
          options: [{ text: 'Nein, bricht ab.' }, { text: 'Ja, bricht nicht ab.' }],
          correct: 0,
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
      figure: 'gt-ss2024b/kruskal',
      parts: [
        {
          kind: 'fields',
          id: 'kruskal-after-6',
          label:
            'Was ist nach 6 Berechnungsschritten (d.h. nachdem die 6. Kante hinzugefuegt wurde) die '
            + 'Summe der Kantengewichte der Kanten, die bislang hinzugefuegt wurden?',
          pointsPerField: 1,
          fields: [{ id: 'sum6', expected: '25' }],
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
            { id: 'r7', label: 'R-Knoten von Knoten 7:', expected: '7' },
            { id: 'size7', label: 'Groesse der zu Knoten 7 gehoerenden Komponente:', expected: '1' },
            { id: 'r5', label: 'R-Knoten von Knoten 5:', expected: '2' },
            { id: 'size5', label: 'Groesse der zu Knoten 5 gehoerenden Komponente:', expected: '3' },
          ],
        },
        {
          kind: 'fields',
          id: 'kruskal-mst',
          label:
            'Fuehren Sie nun den Algorithmus von Kruskal bis zum Schluss aus und geben Sie die Summe der '
            + 'Kanten des Spannbaums an.',
          pointsPerField: 1,
          fields: [{ id: 'mst', label: 'Summe der Kantengewichte $=$', expected: '57' }],
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
      figure: 'gt-ss2024b/dfs',
      parts: [
        {
          kind: 'multi',
          id: 'dfs-sequences',
          pointsPerStatement: 1,
          // Kein Schluessel im Bericht. Graph aus der Abbildung: Kanten 1-3, 1-4, 1-7,
          // 1-10, 2-4, 2-8, 3-4, 3-10, 4-... , 5-6, 5-7, 5-9, 6-8, 6-9, 7-10, 8-9.
          // Wahrheitswerte per DFS-Simulation: A/B/E/F scheitern jeweils an "2 nicht
          // benachbart zu 7"; C und D sind gueltige DFS-Reihenfolgen.
          statements: [
            { text: '2, 7, 5, 9, 8, 6, 4, 1, 10, 3', answer: false },
            { text: '5, 7, 2, 4, 3, 1, 10, 8, 9, 6', answer: false },
            { text: '5, 6, 9, 8, 2, 4, 1, 10, 3, 7', answer: true },
            { text: '4, 1, 10, 7, 5, 6, 8, 2, 9, 3', answer: true },
            { text: '9, 6, 8, 2, 7, 5, 10, 3, 4, 1', answer: false },
            { text: '2, 7, 10, 1, 4, 3, 5, 6, 8, 9', answer: false },
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
        '\\min_{x \\in \\mathbb{R}^2} \\; 2x_1 - 2x_2 \\quad \\text{u.d.N.} \\\\[4pt] '
        + 'x_1 - 2x_2 \\geq 2 \\\\ 2x_1 + x_2 \\geq 9 \\\\ x_1 + x_2 \\leq 8 \\\\ x_1, x_2 \\geq 0',
      ],
      promptExtra: ['Hier sehen Sie als Hilfestellung eine entsprechende Zeichnung:'],
      figure: 'gt-ss2024b/lp-plot',
      parts: [
        {
          kind: 'fields',
          id: 'lp-vertex',
          label: 'Geben Sie die optimale Ecke an:',
          pointsPerField: 1,
          layout: 'inline',
          fields: [
            { id: 'x1', label: '$x_1 =$', expected: '4' },
            { id: 'x2', label: '$x_2 =$', expected: '1' },
          ],
        },
        {
          kind: 'single',
          id: 'lp-dual-objective',
          label: 'Kreuzen Sie die korrekte Zielfunktion des dualen Programms an.',
          points: 1,
          options: [
            { text: '$\\max_{y \\in \\mathbb{R}^3} 2y_1 + 9y_2 - 8y_3$' },
            { text: '$\\max_{y \\in \\mathbb{R}^3} 2y_1 + 9y_2 + 8y_3$' },
            { text: '$\\max_{y \\in \\mathbb{R}^2} 2y_1 - 2y_2$' },
            { text: '$\\max_{y \\in \\mathbb{R}^2} -2y_1 + 2y_2$' },
          ],
          correct: 0,
        },
        {
          kind: 'multi',
          id: 'lp-dual-constraints',
          label: 'Kreuzen Sie die Nebenbedingungen an, die im dualen Programm enthalten sind.',
          note:
            '(Richtige Antwort: 0.5 Punkte, falsche Antwort: -0.5 Punkte, Uebersprungen (?): 0 Punkte. '
            + 'Die Teilaufgabe kann nicht weniger als 0 Punkte bringen.)',
          pointsPerStatement: 0.5,
          // Primal in >=-Form: A = [[1,-2],[2,1],[-1,-1]], b = (2, 9, -8), c = (2, -2).
          // Dual: max b^T y, A^T y <= c, y >= 0 -> y1 + 2y2 - y3 <= 2 (C), -2y1 + y2 - y3 <= -2 (B),
          // y >= 0 (D). Volles LP-Ergebnis (6,0/6) bestaetigt B/C/D wahr, A/E/F falsch.
          statements: [
            { text: '$y_1 + 2y_2 + y_3 \\leq 2$', answer: false },
            { text: '$-2y_1 + y_2 - y_3 \\leq -2$', answer: true },
            { text: '$y_1 + 2y_2 - y_3 \\leq 2$', answer: true },
            { text: '$y_1, y_2, y_3 \\geq 0$', answer: true },
            { text: '$-2y_1 + y_2 + y_3 \\leq -2$', answer: false },
            { text: '$y_1, y_2, y_3 \\geq 1$', answer: false },
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
        + 'die Wahrheitswerte folgen aus den vergebenen +1/-1-Punkten je Aussage und wurden zusaetzlich '
        + 'nachgerechnet; die sechs uebersprungenen (0.00) Aussagen sind `derived`.',
      parts: [
        {
          kind: 'multi',
          id: 'aussagen-ebener-graph',
          label: 'Ebener Graph',
          intro:
            'Sei $G = (V, E, R)$ ein ebener, zusammenhaengender Graph mit $|V| \\geq 3$ und $x \\in V$ ein '
            + 'beliebiger Knoten. Welche der folgenden Aussagen gelten immer?',
          pointsPerStatement: 1,
          statements: [
            { text: 'Wenn $|R| = 1$ ist, dann muss $G$ ein Baum sein.', answer: true },
            { text: 'Wenn $G$ kein Baum ist, dann kann $x$ auch kein Blatt sein.', answer: false, derived: true },
            { text: 'Wenn $G$ ein Baum ist, dann muss $|R| = 1$ sein.', answer: true },
            { text: 'Wenn $|R| = 2$ ist, dann hat $G$ genau einen Kreis.', answer: true },
            { text: 'Wenn $|R| = 3$ ist, dann hat $G$ genau zwei Kreise.', answer: false, derived: true },
          ],
        },
        {
          kind: 'multi',
          id: 'aussagen-zusammenhang',
          label: 'Zusammenhangskomponenten',
          intro:
            'Sei $G = (V, E)$ ein Graph und $x, y, z \\in V$ drei beliebige, paarweise verschiedene '
            + 'Knoten. Welche der folgenden Aussagen gelten immer?',
          pointsPerStatement: 1,
          statements: [
            {
              text:
                'Wenn $x$ und $y$ in der gleichen Zusammenhangskomponente von $G$ liegen, dann gibt es mehr '
                + '$x,y$-Kantenzuege als $x,y$-Wege in $G$.',
              answer: true,
              derived: true,
            },
            { text: 'Es gibt hoechstens $\\frac{|V|}{2}$ Zusammenhangskomponenten in $G$.', answer: false },
            {
              text:
                'Wenn es einen $x,y$-Weg in $G$ und einen $y,z$-Weg in $G$ gibt, dann gibt es auch einen '
                + '$x,z$-Weg in $G$.',
              answer: true,
            },
            {
              text:
                'Wenn $x$, $y$ und $z$ in der gleichen Zusammenhangskomponente liegen und diese '
                + 'Zusammenhangskomponente eine $3$-Clique enthaelt, dann existiert ein $x,y$-Weg, der $z$ '
                + 'nicht enthaelt.',
              answer: false,
            },
            { text: 'Wenn $\\mathrm{dist}_G(x, y) = 4$ gilt, dann folgt $\\alpha(G) \\geq 3$.', answer: true, derived: true },
          ],
        },
        {
          kind: 'multi',
          id: 'aussagen-floyd-warshall',
          label: 'Floyd-Warshall',
          intro:
            'Sei $G$ ein gewichteter, gerichteter Graph auf $n \\geq 7$ Knoten ohne negative Zykel und '
            + 'seien $\\mathcal{P}^k_{i,j}$ und $d^k_{i,j}$ wie im Algorithmus von Floyd-Warshall definiert. '
            + 'Welche der folgenden Aussagen gelten dann immer?',
          pointsPerStatement: 1,
          statements: [
            {
              text: '$d^5_{1,2}$ wird erst berechnet, wenn $d^4_{i,j}$ fuer alle $i, j \\in [n]$ berechnet sind.',
              answer: true,
            },
            { text: '$d^3_{i,i} = 0$ fuer alle $i \\in [n]$.', answer: true },
            { text: '$d^4_{i,j} \\geq 0$ fuer alle $i, j \\in [n]$.', answer: false },
            { text: 'Die Laenge von jedem Pfad in $\\mathcal{P}^k_{i,j}$ betraegt $d^k_{i,j}$.', answer: false, derived: true },
            {
              text: '$d^k_{a,c} \\leq d^k_{a,b} + d^k_{b,c}$ fuer alle $a, b, c, k \\in [n]$.',
              answer: false,
            },
          ],
        },
        {
          kind: 'multi',
          id: 'aussagen-hamiltonkreis',
          label: 'Hamiltonkreis-Reduktion',
          intro:
            'Betrachten Sie die Probleme: Hamiltonkreis - Input: Graph $G = (V, E)$; Frage: Hat $G$ einen '
            + 'Hamiltonkreis? und Hamiltonkreis* - Input: bipartiter Graph $G = (V, E)$; Frage: Hat $G$ '
            + 'einen Hamiltonkreis? Fuer den Beweis, dass Hamiltonkreis $\\leq_p$ Hamiltonkreis* gilt, wird '
            + 'die folgende Transformation vorgeschlagen: $G\'$ wird aus $G$ gebildet, indem man zunaechst '
            + 'alle Knoten und Kanten aus $G$ uebernimmt und dann jede Kante $\\{x, y\\}$ aus $E$ durch '
            + 'einen zusaetzlichen Knoten $w_{x,y}$ unterteilt. Welche der folgenden Aussagen stimmen fuer '
            + 'alle Graphen $G$?',
          pointsPerStatement: 1,
          statements: [
            { text: 'Wenn $G\'$ einen Hamiltonkreis hat, dann hat $G$ einen Hamiltonkreis.', answer: true },
            { text: 'Die Transformation laesst sich in polynomialer Zeit durchfuehren.', answer: true },
            { text: 'Wenn $G$ einen Hamiltonkreis hat, dann hat $G\'$ einen Hamiltonkreis.', answer: false },
            { text: '$G\'$ ist bipartit.', answer: true, derived: true },
            { text: '$G\'$ hat genau $|V| + |E|$ Knoten.', answer: true },
          ],
        },
      ],
    },

    {
      id: 'beweis',
      title: 'Beweis (schriftlich)',
      points: 10,
      prompt:
        'Zeigen Sie, dass ein Graph $G = (V, E)$ genau dann bipartit ist, wenn fuer alle Subgraphen $H$ '
        + 'von $G$ gilt, dass $\\alpha(H) \\geq \\frac{|V(H)|}{2}$ ist.',
      promptExtra: ['Hinweis: ungerade Kreise.', 'Loesen Sie diese Aufgabe bitte auf dem Papier.'],
      parts: [
        {
          kind: 'open',
          id: 'beweis-bipartit',
          points: 10,
          derived: true,
          solution:
            'Der Bericht druckt keine Musterloesung ab (nur "Punktzahl +0.0/10.0"). Beweisskizze:\n'
            + '"$\\Rightarrow$": Sei $G$ bipartit mit Klassen $A, B$. Jeder Subgraph $H$ ist ebenfalls '
            + 'bipartit mit Klassen $A \\cap V(H)$ und $B \\cap V(H)$. Die groessere dieser beiden Mengen '
            + 'ist in $H$ stabil und hat mindestens $\\frac{|V(H)|}{2}$ Knoten, also '
            + '$\\alpha(H) \\geq \\frac{|V(H)|}{2}$.\n'
            + '"$\\Leftarrow$": Kontraposition. Ist $G$ nicht bipartit, so enthaelt $G$ einen ungeraden '
            + 'Kreis $C$ der Laenge $2k + 1$. Fuer den Subgraphen $H = C$ gilt '
            + '$\\alpha(C) = k < \\frac{2k+1}{2} = \\frac{|V(H)|}{2}$, im Widerspruch zur Voraussetzung. '
            + 'Also ist $G$ bipartit.',
        },
      ],
    },

    {
      id: 'reduktion',
      title: 'Reduktion (schriftlich)',
      points: 10,
      prompt:
        'Das Entscheidungsproblem $k\\text{-COVER}$ lautet: Gegeben ein Graph $G = (V, E)$ und eine '
        + 'natuerliche Zahl $k \\geq 3$, hat $G$ eine Knotenueberdeckung der Groesse $k$? Das '
        + 'Entscheidungsproblem $k\\text{-COVER}^*$ lautet: Gegeben ein Graph $G = (V, E)$ ohne isolierte '
        + 'Knoten und eine natuerliche Zahl $k \\geq 3$, hat $G$ eine Knotenueberdeckung der Groesse $k$?',
      promptExtra: [
        'Zeigen Sie $k\\text{-COVER} \\leq_p k\\text{-COVER}^*$.',
        'Loesen Sie diese Aufgabe bitte schriftlich auf dem Papier.',
      ],
      parts: [
        {
          kind: 'open',
          id: 'reduktion-cover',
          points: 10,
          derived: true,
          solution:
            'Der Bericht druckt keine Musterloesung ab (nur "Punktzahl +0.0/10.0"). Beweisskizze:\n'
            + 'Transformation: Gegeben $(G, k)$ mit $G = (V, E)$. Sei $I \\subseteq V$ die Menge der '
            + 'isolierten Knoten von $G$. Bilde $G\' = G - I$ (loesche alle isolierten Knoten) und setze '
            + '$k\' = k$. Ist $G$ kantenlos, so bilde stattdessen die feste Ja-Instanz '
            + '$G\' = (\\{a, b\\}, \\{\\{a, b\\}\\})$ mit $k\' = k$.\n'
            + '$G\'$ hat keine isolierten Knoten, ist also eine zulaessige $k\\text{-COVER}^*$-Eingabe; die '
            + 'Konstruktion laeuft in polynomieller Zeit.\n'
            + 'Korrektheit: Ein isolierter Knoten deckt keine Kante ab und liegt in keiner '
            + 'inklusionsminimalen Knotenueberdeckung. Also hat $G$ genau dann eine Knotenueberdeckung der '
            + 'Groesse $\\leq k$, wenn $G\' = G - I$ eine solche der Groesse $\\leq k$ hat. Im kantenlosen '
            + 'Fall sind beide Seiten triviale Ja-Instanzen ($k, k\' \\geq 3$). Damit gilt '
            + '$k\\text{-COVER} \\leq_p k\\text{-COVER}^*$.',
        },
      ],
    },

    {
      id: 'beweispuzzle',
      title: 'Beweispuzzle',
      points: 10,
      prompt:
        'Zeigen Sie: Eine stabile Menge $S$ ist genau dann eine groesste stabile Menge, falls es zu jeder '
        + 'zu $S$ disjunkten stabilen Menge $T$ ein Matching zwischen $S$ und $T$ gibt, welches alle Knoten '
        + 'aus $T$ ueberdeckt.',
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
            {
              id: 'fh-neg',
              text:
                'Fuer die Hinrichtung nehme an, es gibt ein solches Matching zwischen $S$ und $T$, welches '
                + '$T$ ueberdeckt, nicht.',
            },
            {
              id: 'fh-pos',
              text:
                'Fuer die Hinrichtung nehme an, es gibt ein solches Matching zwischen $S$ und $T$, welches '
                + '$T$ ueberdeckt.',
            },
            { id: 'u-caps', text: 'Dann existiert $U \\subseteq T$ mit $|N(U) \\cap S| < |U|$.' },
            { id: 'u-geq', text: 'Dann existiert $U \\subseteq T$ mit $|N(U)| \\geq |U|$.' },
            { id: 'u-lt', text: 'Dann existiert $U \\subseteq T$ mit $|N(U)| < |U|$.' },
            { id: 'sprime-def', text: 'Sei $S\' = (S \\setminus N(U)) \\cup U$.' },
            { id: 'sprime-gt', text: '$S\'$ ist eine stabile Menge und $|S\'| > |S|$, ein Widerspruch.' },
            { id: 'sprime-leq', text: '$S\'$ ist eine stabile Menge und $|S\'| \\leq |S|$.' },
            { id: 'rueck', text: 'Fuer die Rueckrichtung' },
            { id: 'w-gt', text: 'sei $W$ eine stabile Menge mit $|W| > |S|$.' },
            { id: 'w-lt', text: 'sei $W$ eine stabile Menge mit $|W| < |S|$.' },
            { id: 't-diff', text: 'Sei $T = W \\setminus S$.' },
            { id: 't-cap', text: 'Sei $T = W \\cap S$.' },
            { id: 'no-match', text: 'Dann kann es kein Matching zwischen' },
            { id: 'ts-cover', text: '$T$ und $S$ geben, welches $T$ ueberdeckt, da' },
            { id: 'tw-cover', text: '$T$ und $W$ geben, welches $T$ ueberdeckt, da' },
            { id: 'final', text: '$|T| > |S \\setminus W|$ und $W$ eine stabile Menge ist.' },
          ],
          solution: [
            'fh-neg',
            'u-caps',
            'sprime-def',
            'sprime-gt',
            'rueck',
            'w-gt',
            't-diff',
            'no-match',
            'ts-cover',
            'final',
          ],
        },
      ],
    },
  ],
}
