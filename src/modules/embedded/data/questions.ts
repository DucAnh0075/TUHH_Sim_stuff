import type { Task } from '../types'

/**
 * All tasks are taken verbatim from the exam screenshots (Embedded Systems).
 * Only add REAL questions here — never invented ones.
 *
 * The answers are read off the grading colours of the screenshots: a green row means
 * the circled icon was the right one, a red row means it was the wrong one. Statements
 * that were left unanswered carry `derived: true` — there is no official key for them.
 *
 * Markup in `prompt`, `text`:
 *   $...$  -> KaTeX, e.g. '$WCET_{EST} \\geq WCET$'
 * Careful: in normal strings backslashes must be doubled ('\\geq').
 *
 * Duplicates: screenshot 1 == screenshot 3 and screenshot 2 == screenshot 7, so those
 * pages appear only once here.
 *
 * Deliberate contradiction: mc-1 grades "A tight WCET estimate means $WCET_{EST} \\geq WCET$"
 * as FALSE, while cloze-1 expects exactly 'WCET_EST >= WCET' in gap 8. Both are kept
 * the way the exam graded them — do not "fix" one of them.
 */

const MC_PROMPT = 'Evaluate the following statements. Which are right, which are wrong?'
const CLOZE_PROMPT = 'Assign the right words in the select boxes for the following statements.'

export const MC_PROBLEMS: Task[] = [
  // ------------------------------------------------------------------
  // Multiple Choice (screenshots 1/3)
  // ------------------------------------------------------------------
  {
    kind: 'multi',
    id: 'mc-1',
    title: 'Nets, Power & WCET',
    prompt: MC_PROMPT,
    points: 10,
    pointsPerStatement: 1,
    statements: [
      { text: 'A net N = (C, E, F) is called pure, if the flow relation F does not contain any loops.', answer: true },
      { text: 'A Pareto-set contains all Pareto-optimal solutions.', answer: true },
      {
        text: 'The reconstruction of sampled signales is possible if the sampling frequency is equal to the signal frequency.',
        answer: false,
      },
      { text: 'Semaphores are used to protect critical sections.', answer: true },
      {
        text: 'The average energy consumption $E_{AV}$ is based on the consumption for selected sets of input data.',
        answer: true,
      },
      { text: 'Leakage is negligable in terms of power consumption.', answer: false },
      {
        text: "VHDL uses Hasse Diagram to determine the hierachy of signales. Acoording to it 'Z' is the strongest signal.",
        answer: false,
      },
      {
        text: 'Validation is the process of computing quantitative information of some key characteristics of a certain (possibly partial) design.',
        answer: false,
      },
      {
        text: 'A preemptive scheduler schould not be used if the response times for external events have to be short.',
        answer: false,
      },
      // Careful, the exam contradicts itself here: this statement is graded FALSE,
      // while gap 8 of 'cloze-1' expects exactly 'WCET_EST >= WCET' as the right word.
      // Both are kept the way the exam graded them — do not "fix" one of them.
      { text: 'A tight WCET estimate means $WCET_{EST} \\geq WCET$.', answer: false },
    ],
  },

  // ------------------------------------------------------------------
  // Multiple Choice (screenshots 2/7)
  // ------------------------------------------------------------------
  {
    kind: 'multi',
    id: 'mc-2',
    title: 'Scheduling, Buses & Models',
    prompt: MC_PROMPT,
    points: 10,
    pointsPerStatement: 1,
    statements: [
      {
        text: 'The priority ceiling protocol guarantees that, once a task has entered a critical section, it must be blocked by lower-priority tasks until its completion.',
        answer: false,
      },
      { text: 'CSMA/CA guarantees predictable response times to all bus participants.', answer: false },
      { text: 'Any specification language has to have a notion of hierarchy.', answer: false },
      { text: 'Kahn process networks are determinate.', answer: true },
      { text: 'Scratchpad memories are typcially more energy-efficient than caches.', answer: true },
      { text: 'A net N = (C, E, F) is called pure, if the flow relation F does not contain any loops.', answer: true },
      { text: 'Rate-Monotonic scheduling is not based on static properties.', answer: false },
      { text: 'Condition/Event nets (C/E-Nets) can have tokens of different colors.', answer: false },
      { text: 'EDF is optimal for periodic scheduling.', answer: true },
      { text: 'A Pareto-set contains all Pareto-optimal solutions.', answer: true },
    ],
  },

  // ------------------------------------------------------------------
  // Multiple Choice (screenshot 4)
  // ------------------------------------------------------------------
  {
    kind: 'multi',
    id: 'mc-3',
    title: 'Power, KPN & Schedulability',
    prompt: MC_PROMPT,
    points: 10,
    pointsPerStatement: 1,
    statements: [
      { text: 'A Pareto-set contains all Pareto-optimal solutions.', answer: true },
      {
        text: 'Static Power Consumption is caused by charging capacitors when logic levels are switched.',
        answer: false,
      },
      { text: 'Kahn Process Networks are not Turing-complete.', answer: false },
      { text: 'CSMA/CA guarantees predictable response times to all bus participants.', answer: false },
      { text: "A VHDL signal with a value of 'X' is stronger than a signal with a value of '0'", answer: false },
      { text: 'The implicit path enumeration technique can be used as a part of WCET estimation.', answer: true },
      { text: 'CSMA/CA guarantees predictable response times only for the highest priority participant.', answer: true },
      { text: 'A tight WCET estimate means $WCET_{EST} < WCET$.', answer: false },
      {
        // Left unanswered in the screenshot (0.00 points, no icon circled), so the exam
        // gives no key: running slower until the deadline is reached saves energy.
        text: 'If a variable voltage processor completes a task before the deadline, the energy consumption can be reduced.',
        answer: true,
        derived: true,
      },
      {
        text: 'A task set is schedulable under a set of constraints, if a schedule exists for that set of tasks & constraints.',
        answer: true,
      },
    ],
  },

  // ------------------------------------------------------------------
  // Cloze Task (screenshot 5)
  // ------------------------------------------------------------------
  {
    kind: 'cloze',
    id: 'cloze-1',
    title: 'Design Flow, Nets & Scheduling',
    prompt: CLOZE_PROMPT,
    points: 10,
    pointsPerGap: 1,
    items: [
      {
        text: '{} is the process of checking whether a certain (possibly partial) design is appropriate for its purpose, meets all constraints, and will perform as expected.',
        answer: 'Validation',
      },
      { text: 'Petri nets are a suitable language for describing {} systems.', answer: 'distributed' },
      {
        text: 'Kahn Process Networks will always generate the same results for a given set of input data, independently of the {} of the nodes.',
        answer: 'speed',
      },
      { text: 'CSMA/CA guarantees response times {} for the highest-priority participant.', answer: 'only' },
      {
        text: 'Super-states S are called {}-super-states if exactly one of the sub-states of S is active whenever S is active.',
        answer: 'OR',
      },
      { text: 'Rate Monotonic scheduling is used for scheduling {} periodic tasks.', answer: 'independent' },
      { text: 'The priority {} protocol is used to cope with priority inversion.', answer: 'inheritance' },
      // See the comment at 'mc-1': the multiple choice block grades the very same
      // statement as FALSE. Kept as the exam graded it.
      { text: 'A tight WCET estimate means {}.', answer: 'WCET_EST >= WCET' },
      { text: 'A Pareto-set contains all {} solutions.', answer: 'Pareto-optimal' },
      { text: 'In real-time databases, the access times to hard disks are {} predictable.', answer: 'hardly' },
    ],
    distractors: [
      'Simulation',
      'Verification',
      'Evaluation',
      'sequential',
      'concurrent',
      'size',
      'always',
      'never',
      'XOR',
      'AND',
      'ceiling',
      'WCET_EST = 0',
      'WCET_EST < WCET',
      'Pareto-dominated',
      'dependent',
      'rarely',
      'well',
    ],
  },

  // ------------------------------------------------------------------
  // Cloze Task (screenshot 6)
  // ------------------------------------------------------------------
  {
    kind: 'cloze',
    id: 'cloze-2',
    title: 'WCET, StateCharts & Energy',
    prompt: CLOZE_PROMPT,
    points: 10,
    pointsPerGap: 1,
    items: [
      { text: 'The implicit path enumeration technique can be used as a part of {} estimation.', answer: 'WCET' },
      { text: 'In priority ceiling protocol, a given task $i$ is delayed at most {} by a lower-priority task.', answer: 'once' },
      { text: 'StateCharts {} assumes a broadcast mechanism for variables.', answer: 'implicitly' },
      { text: 'Faults in one Fault Containment Region should {} affect other regions.', answer: 'never' },
      {
        text: 'A Sample-and-Hold circuit is typically used to discretize a signal in the {} domain.',
        answer: 'value',
      },
      {
        text: 'A critical instant of a task is that time at which the release of a task will produce the {} response time.',
        answer: 'largest',
      },
      {
        text: 'For a given set of input data, Kahn Process Networks will {} generate the same results, independently of the speed of the nodes.',
        answer: 'always',
      },
      {
        text: 'The worst-case energy consumption $E_{WC}$ is a safe {} bound on the energey consumption.',
        answer: 'upper',
      },
      { text: 'Static power consumption is caused by {} current.', answer: 'leakage' },
      { text: 'FlexRay uses the bandwidth {} when it is needed.', answer: 'only' },
    ],
    distractors: [
      'BCET',
      'ACET',
      'twice',
      'never',
      'explicitly',
      'always',
      'discrete time',
      'time',
      'frequency',
      'smallest',
      'average',
      'lower',
      'exact',
      'switching',
      'dynamic',
      'sometimes',
    ],
  },
]
