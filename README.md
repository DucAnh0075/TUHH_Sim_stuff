# Graph Quiz

Exam trainer for the graph / network / complexity tasks, in the layout of the original exam:
light blue task box, statements A–E with `?` / `✓` / `✗` buttons, after evaluation green (correct)
or red (wrong) with a points label.

Scoring as in the exam: **correct +1, wrong −1, `?` 0**; a task can never score less than 0 points.

## Run

```bash
npm install
npm run dev
```

## Add a task

All questions live in [`src/data/questions.ts`](src/data/questions.ts). Only enter **real** exam
questions. Append a new object to the array:

```ts
{
  kind: 'multi',
  id: 'unique-id',
  title: 'Short title',                // shown in the headline
  prompt: 'Let $G = (V, E)$ ... Which of the following statements is always true?',
  promptExtra: ['further paragraph'],  // optional, for long preambles
  pointsPerStatement: 1,
  statements: [
    { text: 'Statement with $\\chi(G) = 7$', answer: true },   // answer = the statement is TRUE
    // ...
  ],
}
```

Math between `$...$` is typeset with KaTeX. In normal strings backslashes must be doubled
(`'$\\sum_{x \\in S} c(x, y)$'`). Line breaks (`\n`) inside `promptExtra` are preserved.
