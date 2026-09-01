import type { Exam } from '../types'
import {
  ADC1_PROMPT,
  CACHE_NOTE,
  CENET_PROMPT,
  CHOICE_NOTE,
  EDF_EXTRA,
  EDF_PROMPT,
  EDF_STATES,
  MC_NOTE,
  MC_PROMPT,
  PARETO_NOTE,
  PARETO_NOTE_EXTRA,
  PARETO_PROMPT,
  PETRINET_PROMPT,
  RTC_PROMPT_TAIL,
  SEMAPHORE_EXTRA,
  SEMAPHORE_STATES,
  SEMAPHORE_TAIL,
  STATECHART_PROMPT_HEAD,
  STATECHART_PROMPT_TAIL,
  STATECHART_STATES,
  VHDL_NOTE,
  VHDL_PROMPT,
  cachePrompt,
  grades,
  ticks,
} from './common'

/** ES Winter Term 2022, evaluation report (53.0 / 85 points, grade 3.3). */
export const WS2122: Exam = {
  id: 'ws2122',
  term: 'ES Winter Term 2022',
  order: 1,
  totalPoints: 85,
  grades: grades(85),
  tasks: [
    {
      kind: 'multi',
      id: 'mc',
      title: 'Multiple Choice',
      points: 10,
      prompt: MC_PROMPT,
      note: MC_NOTE,
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
        // Careful: this statement is graded FALSE here, while the cloze task of the
        // 2024/2025 exam expects exactly 'WCET_EST >= WCET' as the right answer.
        // Both are kept the way their own exam graded them.
        { text: 'A tight WCET estimate means $WCET_{EST} \\geq WCET$.', answer: false },
      ],
    },

    {
      kind: 'grid',
      id: 'statechart',
      title: 'StateCharts',
      points: 10,
      prompt: STATECHART_PROMPT_HEAD,
      promptExtra: ['$(s, h, a, c, e, j, i, m, b, t, s)$', STATECHART_PROMPT_TAIL],
      figure: 'ws2122/statechart',
      variant: 'statechart',
      rows: ['(Reset)', 's', 'h', 'a', 'c', 'e', 'j', 'i', 'm', 'b', 't', 's'],
      cols: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'L', 'I', 'J', 'S', 'K', 'M', 'N'],
      states: STATECHART_STATES,
      solutionFigure: 'ws2122/statechart-solution',
    },

    {
      kind: 'choice',
      id: 'cenet',
      title: 'C/E Net',
      points: 4,
      prompt: CENET_PROMPT,
      note: CHOICE_NOTE,
      figure: 'ws2122/cenet',
      correct: 1,
      options: [
        {
          text: '(c1,e1)(c1,e2)(c2,e3)(c3,e4)(c3,e2)(c4,e2)(c4,e2)(c5,e4)(c5,e3)(c6,e1)(c6,e2)(e1,c4)(e1,c4)(e2,c2)(e3,c6)(e4,c4)(e4,c6)(e4,c5)',
        },
        {
          text: '(c1,e1)(c1,e3)(c1,e4)(c2,e1)(c3,e1)(c3,e4)(c3,e3)(c4,e3)(c5,e3)(c6,e1)(c6,e2)(e2,c4)(e3,c6)(e4,c4)(e4,c5)(e4,c6)',
        },
        {
          text: '(c1,e1)(c1,e2)(c2,e3)(c3,e3)(c4,e1)(c5,e3)(c6,e3)(c1,e3)(e1,c5)(e1,c3)(e1,c2)(e2,c6)(e2,c2)(e2,c3)(e3,c2)',
        },
        {
          text: '(c1,e1)(c1,e3)(c1,e4)(c2,e1)(c3,e4)(c3,e3)(c4,e2)(c4,e3)(c5,e3)(c6,e1)(c6,e2)(e1,c3)(e3,c6)(e4,c4)(e4,c5)(e4,c6)',
        },
        {
          text: '(c1,e1)(c1,e2)(c2,e3)(c3,e3)(c4,e1)(c5,e3)(c6,e3)(c1,e3)(e1,c5)(e1,c4)(e1,c2)(e2,c4)(e2,c2)(e2,c3)(e3,c2)',
        },
        {
          text: '(c1,e1)(c1,e2)(c2,e3)(c3,e3)(c4,e1)(c5,e3)(c6,e3)(c1,e6)(e1,c5)(e1,c3)(e1,c2)(e2,c4)(e2,c5)(e2,c2)(e2,c3)(e3,c1)',
        },
      ],
    },

    {
      kind: 'multi',
      id: 'petrinet',
      title: 'Petrinets',
      points: 2,
      prompt: PETRINET_PROMPT,
      promptExtra: ['$F = (c1, e1)(c1, e2)(c2, e2)(c3, e1)(c3, e2)(c4, e1)(e1, c2)$'],
      note: MC_NOTE,
      pointsPerStatement: 1,
      statements: [
        { text: 'The given net is pure', answer: true },
        // c1 and c3 share pre- and post-set, so the net is not simple.
        { text: 'The given net is simple', answer: false },
      ],
    },

    {
      kind: 'fields',
      id: 'vhdl',
      title: 'VHDL',
      points: 8,
      prompt: VHDL_PROMPT,
      note: VHDL_NOTE,
      figure: 'ws2122/vhdl',
      layout: 'vhdl',
      pointsPerField: 1,
      // This report orders the inputs F, E, ena - unlike the other exams.
      columns: ['F', 'E', 'ena'],
      fields: [
        { id: 'vhdl-000', inputs: ['0', '0', '0'], expected: 'Z' },
        { id: 'vhdl-001', inputs: ['0', '0', '1'], expected: '1' },
        { id: 'vhdl-010', inputs: ['0', '1', '0'], expected: '0' },
        { id: 'vhdl-011', inputs: ['0', '1', '1'], expected: 'X' },
        { id: 'vhdl-100', inputs: ['1', '0', '0'], expected: 'Z' },
        { id: 'vhdl-101', inputs: ['1', '0', '1'], expected: '0' },
        { id: 'vhdl-110', inputs: ['1', '1', '0'], expected: 'X' },
        { id: 'vhdl-111', inputs: ['1', '1', '1'], expected: 'X' },
      ],
    },

    {
      kind: 'fields',
      id: 'adc1',
      title: 'A/D Converter 1',
      points: 6,
      prompt: ADC1_PROMPT,
      figure: 'ws2122/adc1',
      layout: 'single',
      pointsPerField: 6,
      fields: [
        { id: 'adc1-f', label: 'Minimum sample frequency:', expected: '100', unit: 'kHz', compare: 'number', points: 6 },
      ],
    },

    {
      kind: 'fields',
      id: 'adc2',
      title: 'A/D Converter 2',
      points: 4,
      prompt:
        'In the following, a schematic of a flash A/D Converter is given which distinguishes between 4 different, equidistant, positive analog voltage ranges. Assuming $V_{ref}$ = 5V, determine the binary outputs of the A/D Converter for the following input voltages. The output is assumed to be left-MSB (left-Most-Significant-Bit).',
      note: 'Note: A single correct answer is worth 2P.',
      figure: 'ws2122/adc2',
      layout: 'adc',
      pointsPerField: 2,
      subtasks: [
        { id: 'adc2-1', label: 'h(t) = 3V' },
        { id: 'adc2-2', label: 'h(t) = 2.4V' },
        { id: 'adc2-3', label: 'h(t) = 4V' },
      ],
      fields: [
        { id: 'adc2-1', label: 'h(t) = 3V', expected: '10', compare: 'number' },
        { id: 'adc2-2', label: 'h(t) = 2.4V', expected: '1', compare: 'number' },
        { id: 'adc2-3', label: 'h(t) = 4V', expected: '11', compare: 'number' },
      ],
    },

    {
      kind: 'grid',
      id: 'sched-prio',
      title: 'Scheduling (Priority) 1',
      points: 7,
      prompt:
        'Consider a system with three tasks $T_1$, $T_2$ and $T_3$. $T_1$ has the highest priority, $T_3$ the lowest. $T_1$ and $T_3$ access a shared resource. The tasks access this shared resource exclusively using a semaphore.',
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
          ['T1', '3', 'N,N,S,S,S,N,N,N,S,S', '10'],
          ['T2', '4', 'N,N,S,S,N,N', '6'],
          ['T3', '6', 'S,S,S,S,N,N,S,S,N,N,N', '11'],
        ],
      },
      solutionFigure: 'ws2122/sched-prio-solution',
    },

    {
      kind: 'grid',
      id: 'sched-pip',
      title: 'Scheduling (Priority, PIP) 2',
      points: 7,
      prompt:
        'Consider a system with three tasks $T_1$, $T_2$ and $T_3$. $T_1$ has the highest priority, $T_3$ the lowest. $T_1$ and $T_3$ access a shared resource. The tasks access this shared resource exclusively using a semaphore.',
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
          ['T1', '3', 'N,N,S,S,S,N,N,N,S,S', '10'],
          ['T2', '4', 'N,N,S,S,N,N', '6'],
          ['T3', '6', 'S,S,S,S,N,N,S,S,N,N,N', '11'],
        ],
      },
      solutionFigure: 'ws2122/sched-pip-solution',
    },

    {
      kind: 'fields',
      id: 'pareto',
      title: 'Pareto 1',
      points: 10,
      prompt: PARETO_PROMPT,
      promptExtra: [PARETO_NOTE_EXTRA],
      note: PARETO_NOTE,
      figure: 'ws2122/pareto',
      layout: 'pareto',
      pointsPerField: 2,
      subtasks: [
        { id: 'pareto-a', label: 'Platform A' },
        { id: 'pareto-b', label: 'Platform B' },
        { id: 'pareto-overall', label: 'Overall Pareto-optimal' },
        { id: 'pareto-dominated', label: 'Dominated by B1' },
        { id: 'pareto-dominating', label: 'Dominating B3' },
      ],
      fields: [
        {
          id: 'pareto-a',
          group:
            'What are the Pareto-optimal configurations for each hardware platform assuming minimization of objectives? (2P for each platform)',
          label: 'Platform A:',
          expected: 'A1,A2',
          compare: 'set',
        },
        {
          id: 'pareto-b',
          group:
            'What are the Pareto-optimal configurations for each hardware platform assuming minimization of objectives? (2P for each platform)',
          label: 'Platform B:',
          expected: 'B0,B2,B3',
          compare: 'set',
        },
        {
          id: 'pareto-overall',
          group: 'What are the overall Pareto-optimal configurations assuming minimization of objectives? (2P)',
          expected: 'A1,B0,B2',
          compare: 'set',
        },
        {
          id: 'pareto-dominated',
          group: 'Which configurations are overall dominated by the design B1? (2P)',
          expected: 'A4,B4',
          compare: 'set',
        },
        {
          id: 'pareto-dominating',
          group: 'Which configurations are overall dominating the design B3? (2P)',
          expected: 'A1',
          compare: 'set',
        },
      ],
    },

    {
      kind: 'choice',
      id: 'rtc',
      title: 'Real-Time Calculus',
      points: 4,
      prompt: `An event stream with the following properties is assumed: One event arrives within every 6 ticks and a second event may follow with a delay of 2 ticks. ${RTC_PROMPT_TAIL}`,
      note: CHOICE_NOTE,
      correct: 3,
      options: [
        { figure: 'ws2122/rtc-a' },
        { figure: 'ws2122/rtc-b' },
        { figure: 'ws2122/rtc-c' },
        { figure: 'ws2122/rtc-d' },
        { figure: 'ws2122/rtc-e' },
      ],
    },

    {
      kind: 'fields',
      id: 'caches-wc',
      title: 'Caches 1',
      points: 4,
      prompt: cachePrompt(4, 'worst-case'),
      note: CACHE_NOTE,
      layout: 'cache',
      pointsPerField: 1,
      cacheColumns: ['c_0', 'c_1', 'c_2', 'c_3'],
      before: [
        { label: 'S_1', cells: ['{q,v}', '{x}', '{u}', '{w, d}'] },
        { label: 'S_2', cells: ['{w}', '{y, d}', '{v}', '{x}'] },
      ],
      fields: [
        { id: 'cwc-0', expected: '', compare: 'set' },
        { id: 'cwc-1', expected: '', compare: 'set' },
        { id: 'cwc-2', expected: 'v', compare: 'set' },
        { id: 'cwc-3', expected: 'w,d,x', compare: 'set' },
      ],
    },

    {
      kind: 'fields',
      id: 'caches-bc',
      title: 'Caches 2',
      points: 4,
      prompt: cachePrompt(4, 'best-case'),
      note: CACHE_NOTE,
      layout: 'cache',
      pointsPerField: 1,
      cacheColumns: ['c_0', 'c_1', 'c_2', 'c_3'],
      before: [
        { label: 'S_1', cells: ['{q,v}', '{x}', '{u}', '{w, d}'] },
        { label: 'S_2', cells: ['{w}', '{y, d}', '{v}', '{x}'] },
      ],
      fields: [
        { id: 'cbc-0', expected: 'q,v,w', compare: 'set' },
        { id: 'cbc-1', expected: 'x,y,d', compare: 'set' },
        { id: 'cbc-2', expected: 'u', compare: 'set' },
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
          ['T1', '4', '10', '5'],
          ['T2', '6', '15', '8'],
          ['T3', '3', '20', '10'],
          ['T4', '0', '8', '4'],
        ],
      },
      solutionFigure: 'ws2122/sched-edf-solution',
    },
  ],
}
