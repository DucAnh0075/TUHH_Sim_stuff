import type { Exam } from '../types'
import {
  ADC1_NOTE,
  ADC1_PROMPT,
  CACHE_NOTE,
  CHOICE_NOTE,
  CLOZE_NOTE,
  CLOZE_PROMPT,
  EDF_EXTRA,
  EDF_PROMPT,
  EDF_STATES,
  MC_NOTE,
  PARETO_NOTE_EXTRA,
  PARETO_PROMPT,
  PETRINET_PROMPT,
  RTC_PROMPT_TAIL,
  SEMAPHORE_EXTRA,
  SEMAPHORE_STATES,
  SEMAPHORE_TAIL,
  STATECHART_PROMPT_HEAD,
  STATECHART_STATES,
  VHDL_NOTE,
  VHDL_PROMPT,
  cachePrompt,
  grades,
  ticks,
} from './common'

/** ES Winter Term 2024/2025, evaluation report of 26.3.2025 (85.0 / 90 points). */
export const WS2425: Exam = {
  id: 'ws2425',
  term: 'ES Winter Term 2024/2025',
  order: 5,
  totalPoints: 90,
  grades: grades(90),
  tasks: [
    {
      kind: 'cloze',
      id: 'cloze',
      title: 'Cloze Task',
      points: 10,
      prompt: CLOZE_PROMPT,
      note: CLOZE_NOTE,
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
        // The 2022 multiple choice grades this very statement as false; both are kept
        // the way their own exam graded them.
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

    {
      kind: 'grid',
      id: 'statechart',
      title: 'StateCharts',
      points: 15,
      prompt: STATECHART_PROMPT_HEAD,
      promptExtra: [
        '$(s, a, b, f, d, q, a, b, c, t, s, a, b, q)$',
        'Note that H denotes the History mechanism. Also, name the state / states the model is in after the reset.',
      ],
      figure: 'ws2425/statechart',
      variant: 'statechart',
      rows: ['(Reset)', 's', 'a', 'b', 'f', 'd', 'q', 'a', 'b', 'c', 't', 's', 'a', 'b', 'q'],
      cols: ['A', 'B', 'E', 'F', 'G', 'I', 'J', 'U', 'C', 'K', 'L', 'O', 'M', 'N', 'D', 'Q', 'R', 'T', 'S'],
      states: STATECHART_STATES,
      solutionFigure: 'ws2425/statechart-solution',
    },

    {
      kind: 'choice',
      id: 'cenet',
      title: 'C/E Net',
      points: 5,
      prompt:
        'Assume the following Condition/Event Net $N = (C, E, F)$. $C$ denotes conditions, $E$ events, and $F$ flow relations. Derive the correct set of flow relations for the given C/E Net. Only one of the following sets is correct.',
      note: CHOICE_NOTE,
      figure: 'ws2425/cenet',
      correct: 0,
      options: [
        {
          text: '(c1,e1)(c2,e4)(c2,e5)(c2,e6)(c3,e2)(c3,e5)(c4,e2)(c5,e3)(c6,e3)(c7,e1)(c8,e1)(c8,e5)(e1,c2)(e2,c1)(e3,c2)(e3,c4)(e3,c8)(e4,c3)(e5,c5)(e5,c6)(e6,c7)',
        },
        {
          text: '(c1,e4)(c1,e3)(c7,e3)(c8,e2)(c2,e1)(c2,e4)(c6,e1)(c5,e3)(c3,e3)(c3,e2)(e3,c2)(e4,c2)(e2,c1)(e1,c5)(e1,c4)(e6,c8)(e2,c6)(e3,c2)(e3,c6)(e4,c3)(e5,c7)',
        },
        {
          text: '(c1,e1)(c2,e4)(c2,e5)(c2,e6)(c3,e2)(c3,e5)(c4,e2)(c5,e3)(c6,e3)(c7,e1)(c8,e1)(c8,e5)(e3,c2)(e3,c4)(e3,c8)(e4,c3)(e5,c5)(e5,c6)(e6,c7)',
        },
        {
          text: '(c1,e1)(c1,e2)(c2,e1)(c3,e2)(c8,e4)(c7,e5)(c5,e3)(c6,e3)(c6,e1)(c6,e2)(c4,e3)(c3,e2)(e1,c3)(e1,c6)(e1,c5)(e2,c4)(e3,c2)(e3,c6)(e3,c8)(e4,c5)(e5,c8)(e6,c3)(e1,c2)(e1,c1)(e3,c4)',
        },
        {
          text: '(c1,e3),(c2,e1)(c2,e5)(c3,e4)(c4,e6)(c5,e5)(c5,e1)(c7,e3)(c8,e3)(e1,c5)(e2,c4)(e3,c2)(e3,c6)(e2,c4)(e3,c1)(e2,c4)(e3,c8)(e4,c2)(e4,c5)(e5,c8)(e6,c3)',
        },
        {
          text: '(c1,e1)(c2,e4)(c2,e5)(c2,e6)(c3,e2)(c3,e5)(c4,e2)(c5,e3)(c6,e3)(c7,e1)(c8,e1)(c8,e5)(e1,c2)(e2,c1)(e3,c2)(e3,c4)(e3,c8)(e4,c3)(e5,c5)(e5,c6)(e6,c7)(e6,c3)',
        },
      ],
    },

    {
      kind: 'multi',
      id: 'petrinet',
      title: 'Petrinets',
      points: 2,
      prompt: PETRINET_PROMPT,
      promptExtra: [
        '$F = (c1, e1)(c1, e4)(c2, e2)(c3, e2)(c4, e3)(c5, e4)(e1, c5)(e2, c4)(e3, c2)(e4, c3)$',
      ],
      note: MC_NOTE,
      pointsPerStatement: 1,
      statements: [
        { text: 'The given net is pure', answer: true },
        { text: 'The given net is not simple', answer: false },
      ],
    },

    {
      kind: 'fields',
      id: 'vhdl',
      title: 'VHDL',
      points: 8,
      prompt: VHDL_PROMPT,
      note: VHDL_NOTE,
      figure: 'ws2425/vhdl',
      layout: 'vhdl',
      pointsPerField: 1,
      columns: ['F', 'ena', 'E'],
      fields: [
        { id: 'vhdl-000', inputs: ['0', '0', '0'], expected: 'Z' },
        { id: 'vhdl-001', inputs: ['0', '0', '1'], expected: 'X' },
        { id: 'vhdl-010', inputs: ['0', '1', '0'], expected: '1' },
        { id: 'vhdl-011', inputs: ['0', '1', '1'], expected: 'X' },
        { id: 'vhdl-100', inputs: ['1', '0', '0'], expected: '1' },
        { id: 'vhdl-101', inputs: ['1', '0', '1'], expected: 'X' },
        { id: 'vhdl-110', inputs: ['1', '1', '0'], expected: '0' },
        { id: 'vhdl-111', inputs: ['1', '1', '1'], expected: 'X' },
      ],
    },

    {
      kind: 'fields',
      id: 'adc1',
      title: 'A/D Converter 1',
      points: 2,
      prompt: ADC1_PROMPT,
      note: ADC1_NOTE,
      figure: 'ws2425/adc1',
      layout: 'single',
      pointsPerField: 2,
      fields: [
        { id: 'adc1-f', label: 'Minimum sample frequency:', expected: '200', unit: 'kHz', compare: 'number', points: 2 },
      ],
    },

    {
      kind: 'fields',
      id: 'adc2',
      title: 'A/D Converter 2',
      points: 3,
      prompt:
        'In the following, a schematic of a flash A/D Converter is given which distinguishes between 8 different, equidistant, positive analog voltage ranges. Assuming $V_{ref}$ = 5V, determine the binary outputs of the A/D Converter for the following input voltages. The output is assumed to be left-MSB (left-Most-Significant-Bit).',
      note: 'Note: A single correct answer is worth 1P.',
      figure: 'ws2425/adc2',
      layout: 'adc',
      pointsPerField: 1,
      subtasks: [
        { id: 'adc2-1', label: 'h(t) = 0.3V' },
        { id: 'adc2-2', label: 'h(t) = 0.6V' },
        { id: 'adc2-3', label: 'h(t) = 0.7V' },
      ],
      fields: [
        { id: 'adc2-1', label: 'h(t) = 0.3V', expected: '0', compare: 'number' },
        { id: 'adc2-2', label: 'h(t) = 0.6V', expected: '0', compare: 'number' },
        { id: 'adc2-3', label: 'h(t) = 0.7V', expected: '1', compare: 'number' },
      ],
    },

    {
      kind: 'grid',
      id: 'sched-prio',
      title: 'Scheduling (Priority) 1',
      points: 7,
      prompt:
        'Consider a system with three tasks $T_1$, $T_2$ and $T_3$, all accessing a shared resource. $T_3$ has the highest priority, $T_2$ the lowest. The tasks access this shared resource exclusively using a semaphore.',
      promptExtra: [
        ...SEMAPHORE_EXTRA,
        'What is the resulting schedule for the task set given in the following table if preemptive, priority-based scheduling is used? Mark the critical, as well as the non-critical execution times in the following diagram for the given task set.',
        ...SEMAPHORE_TAIL,
      ],
      variant: 'gantt',
      rows: ['T1', 'T2', 'T3'],
      cols: ticks(33),
      states: SEMAPHORE_STATES,
      table: {
        headers: ['Task', 'Arrival', 'Execution Sequence', 'Duration'],
        rows: [
          ['T1', '1', 'N,N,N,S,N,S,S,S,N,S,N,N', '12'],
          ['T2', '0', 'S,S,S,N,N,S,S,S', '8'],
          ['T3', '5', 'N,S,S,N,S,S,S,N,N,N', '10'],
        ],
      },
      solutionFigure: 'ws2425/sched-prio-solution',
    },

    {
      kind: 'grid',
      id: 'sched-pip',
      title: 'Scheduling (Priority, PIP) 2',
      points: 7,
      prompt:
        'Consider a system with three tasks $T_1$, $T_2$ and $T_3$, all accessing a shared resource. $T_3$ has the highest priority, $T_2$ the lowest. The tasks access this shared resource exclusively using a semaphore.',
      promptExtra: [
        ...SEMAPHORE_EXTRA,
        'What is the resulting schedule for the task set given in the following table if preemptive, priority-based scheduling with priority inheritance protocol is used? Mark the critical, as well as the non-critical execution times in the following diagram for the given task set.',
        ...SEMAPHORE_TAIL,
      ],
      variant: 'gantt',
      rows: ['T1', 'T2', 'T3'],
      cols: ticks(33),
      states: SEMAPHORE_STATES,
      table: {
        headers: ['Task', 'Arrival', 'Execution Sequence', 'Duration'],
        rows: [
          ['T1', '1', 'N,S,S,N,N,S,S,S,N,S,N,N', '12'],
          ['T2', '0', 'S,S,S,N,N,S,S,S', '8'],
          ['T3', '5', 'N,S,S,N,S,S,S,N,N,N', '10'],
        ],
      },
      solutionFigure: 'ws2425/sched-pip-solution',
    },

    {
      kind: 'fields',
      id: 'pareto',
      title: 'Pareto',
      points: 10,
      prompt: PARETO_PROMPT,
      promptExtra: [PARETO_NOTE_EXTRA],
      note: 'You can hover over a single point to see the exact coordinates and the platform of this point. A point "B0" belongs to the hardware platform B, whereas a point "A0" belongs to the hardware platform A.',
      figure: 'ws2425/pareto',
      layout: 'pareto',
      pointsPerField: 2,
      subtasks: [
        { id: 'pareto-a', label: 'Platform A' },
        { id: 'pareto-b', label: 'Platform B' },
        { id: 'pareto-overall', label: 'Overall Pareto-optimal' },
        { id: 'pareto-dominated', label: 'Dominated by A2' },
        { id: 'pareto-dominating', label: 'Dominating B0' },
      ],
      fields: [
        {
          id: 'pareto-a',
          group:
            'What are the Pareto-optimal configurations for each hardware platform assuming minimization of objectives? (2P for each platform)',
          label: 'Platform A:',
          expected: 'a1,a3',
          compare: 'set',
        },
        {
          id: 'pareto-b',
          group:
            'What are the Pareto-optimal configurations for each hardware platform assuming minimization of objectives? (2P for each platform)',
          label: 'Platform B:',
          expected: 'b0,b1,b4',
          compare: 'set',
        },
        {
          id: 'pareto-overall',
          group: 'What are the overall Pareto-optimal configurations assuming minimization of objectives? (2P)',
          expected: 'a1,a3,b4',
          compare: 'set',
        },
        {
          id: 'pareto-dominated',
          group: 'Which configurations are overall dominated by the design A2? (2P)',
          expected: 'a4,b2,b3',
          compare: 'set',
        },
        {
          id: 'pareto-dominating',
          group: 'Which configurations are overall dominating the design B0? (2P)',
          expected: 'a1,a3',
          compare: 'set',
        },
      ],
    },

    {
      kind: 'choice',
      id: 'rtc',
      title: 'Real-Time Calculus',
      points: 4,
      prompt: `An event stream with the following properties is assumed: At least one event arrives within every 3 ticks and a second event may follow with a minimum delay of 1 tick. ${RTC_PROMPT_TAIL}`,
      note: CHOICE_NOTE,
      correct: 5,
      options: [
        { figure: 'ws2425/rtc-a' },
        { figure: 'ws2425/rtc-b' },
        { figure: 'ws2425/rtc-c' },
        { figure: 'ws2425/rtc-d' },
        { figure: 'ws2425/rtc-e' },
        { figure: 'ws2425/rtc-f' },
      ],
    },

    {
      kind: 'fields',
      id: 'caches-wc',
      title: 'Caches 1',
      points: 6,
      prompt: cachePrompt(4, 'worst-case'),
      note: CACHE_NOTE,
      layout: 'cache',
      pointsPerField: 1.5,
      cacheColumns: ['c_0', 'c_1', 'c_2', 'c_3'],
      before: [
        { label: 'S_1', cells: ['{a,t}', '{b,c}', '{g,d}', '{f}'] },
        { label: 'S_2', cells: ['{f,g,t}', '{a}', '{e,k}', '{b,d}'] },
      ],
      fields: [
        { id: 'cwc-0', expected: 't', compare: 'set' },
        { id: 'cwc-1', expected: 'a', compare: 'set' },
        { id: 'cwc-2', expected: 'g', compare: 'set' },
        { id: 'cwc-3', expected: 'f,b,d', compare: 'set' },
      ],
    },

    {
      kind: 'fields',
      id: 'caches-bc',
      title: 'Caches 2',
      points: 6,
      prompt: cachePrompt(4, 'best-case'),
      note: CACHE_NOTE,
      layout: 'cache',
      pointsPerField: 1.5,
      cacheColumns: ['c_0', 'c_1', 'c_2', 'c_3'],
      before: [
        { label: 'S_1', cells: ['{a}', '{b,c}', '{g,d}', '{f}'] },
        { label: 'S_2', cells: ['{f,g}', '{a}', '{e,k}', '{b,d}'] },
      ],
      fields: [
        { id: 'cbc-0', expected: 'a,f,g', compare: 'set' },
        { id: 'cbc-1', expected: 'b,c', compare: 'set' },
        { id: 'cbc-2', expected: 'd,e,k', compare: 'set' },
        { id: 'cbc-3', expected: '', compare: 'set' },
      ],
    },

    {
      kind: 'grid',
      id: 'sched-edf',
      title: 'Scheduling (EDF) 3',
      points: 5,
      prompt: EDF_PROMPT,
      promptExtra: EDF_EXTRA,
      variant: 'gantt',
      rows: ['T1', 'T2', 'T3', 'T4'],
      cols: ticks(30),
      states: EDF_STATES,
      table: {
        headers: ['Task', 'Arrival', 'Absolute Deadline', 'Duration'],
        rows: [
          ['T1', '0', '15', '6'],
          ['T2', '2', '13', '7'],
          ['T3', '5', '9', '4'],
          ['T4', '3', '25', '8'],
        ],
      },
      solutionFigure: 'ws2425/sched-edf-solution',
    },
  ],
}
