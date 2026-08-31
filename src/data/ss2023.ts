import type { Exam } from '../types'
import {
  ADC1_NOTE,
  ADC1_PROMPT,
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
  CACHE_NOTE,
  grades,
  ticks,
} from './common'

/**
 * ES Summer Term 2023, evaluation report of 22.8.2023 (75.0 / 90 points, grade 2.0).
 * Everything verbatim from the report; the answers follow the printed solutions and
 * the green/red grading.
 */
export const SS2023: Exam = {
  id: 'ss2023',
  term: 'ES Summer Term 2023',
  order: 3,
  totalPoints: 90,
  grades: grades(90),
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
        { text: 'A Pareto-set contains all Pareto-optimal solutions.', answer: true },
        {
          text: 'Static Power Consumption is caused by charging capacitors when logic levels are switched.',
          answer: false,
        },
        { text: 'Kahn Process Networks are not Turing-complete.', answer: false },
        { text: 'CSMA/CA guarantees predictable response times to all bus participants.', answer: false },
        { text: "A VHDL signal with a value of 'X' is stronger than a signal with a value of '0'", answer: false },
        { text: 'The implicit path enumeration technique can be used as a part of WCET estimation.', answer: true },
        {
          text: 'CSMA/CA guarantees predictable response times only for the highest priority participant.',
          answer: true,
        },
        { text: 'A tight WCET estimate means $WCET_{EST} < WCET$.', answer: false },
        {
          // Left unanswered in the report (0.00 points), so the key is derived: running
          // slower until the deadline is reached saves energy.
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

    {
      kind: 'grid',
      id: 'statechart',
      title: 'StateCharts',
      points: 12,
      prompt: STATECHART_PROMPT_HEAD,
      promptExtra: ['$(s, a, b, c, f, d, a, t, s, b, d)$', STATECHART_PROMPT_TAIL],
      figure: 'ss2023/statechart',
      variant: 'statechart',
      rows: ['(Reset)', 's', 'a', 'b', 'c', 'f', 'd', 'a', 't', 's', 'b', 'd'],
      cols: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'L', 'I', 'J', 'S', 'K', 'M', 'N', 'O', 'P', 'Q', 'R', 'T'],
      states: STATECHART_STATES,
      solutionFigure: 'ss2023/statechart-solution',
    },

    {
      kind: 'choice',
      id: 'cenet',
      title: 'C/E Net',
      points: 5,
      prompt: CENET_PROMPT,
      note: CHOICE_NOTE,
      figure: 'ss2023/cenet',
      correct: 5,
      options: [
        {
          text: '(c1,e1)(c1,e2)(c2,e1)(c3,e2)(c5,e1)(c5,e3)(c6,e3)(c6,e1)(c6,e2)(c4,e3)(c3,e2)(e1,c3)(e1,c6)(e1,c5)(e2,c4)(e3,c2)(e3,c6)(e1,c2)(e1,c1)(e3,c4)',
        },
        {
          text: '(c1,e1)(c2,e1)(c3,e2)(c4,e2)(c5,e3)(c6,e1)(c6,e3)(e1,c1)(e1,c3)(e1,c6)(e1,c2)(e1,c5)(e1,c3)(e2,c4)(e3,c5)(e3,c1)',
        },
        {
          text: '(c1,e1)(c1,e2)(c2,e1)(c3,e2)(c3,e3)(c4,e3)(c5,e1)(c5,e3)(c6,e2)(c4,e1)(c3,e2)(e1,c6)(e1,c5)(e2,c6)(e3,c2)(e3,c6)',
        },
        {
          text: '(c1,e1)(c1,e2)(c2,e1)(c3,e3)(c3,e2)(c4,e3)(c5,e3)(c6,e1)(c3,e1)(c3,e1)(e1,c3)(e1,c6)(e1,c5)(e2,c4)(e3,c2)(e3,c6)(e1,c4)(e1,c1)(e2,c4)',
        },
        {
          text: '(c1,e2)(c1,e2)(c2,e1)(c3,e2)(c3,e3)(c3,e1)(c4,e3)(c5,e1)(c5,e3)(c6,e3)(e1,c5)(e2,c4)(e3,c2)(e3,c6)(e2,c4)(e3,c1)(e2,c4)',
        },
        {
          text: '(c1,e1)(c2,e1)(c3,e2)(c4,e2)(c5,e3)(c6,e1)(e1,c1)(e1,c3)(e1,c4)(e1,c5)(e2,c2)(e2,c6)(e3,c3)(e3,c4)(e3,c1)(e3,c6)',
        },
      ],
    },

    {
      kind: 'multi',
      id: 'petrinet',
      title: 'Petrinets',
      points: 2,
      prompt: PETRINET_PROMPT,
      promptExtra: ['$F = (c1, e1)(c2, e1)(c3, e2)(c4, e1)(c4, e3)(e1, c3)(e2, c4)(e3, c1)(e3, c3)$'],
      note: MC_NOTE,
      pointsPerStatement: 1,
      statements: [
        { text: 'The given net is pure', answer: true },
        { text: 'The given net is simple', answer: true },
      ],
    },

    {
      kind: 'fields',
      id: 'vhdl',
      title: 'VHDL',
      points: 8,
      prompt: VHDL_PROMPT,
      note: VHDL_NOTE,
      figure: 'ss2023/vhdl',
      layout: 'vhdl',
      pointsPerField: 1,
      columns: ['F', 'ena', 'E'],
      fields: [
        { id: 'vhdl-000', inputs: ['0', '0', '0'], expected: 'Z' },
        { id: 'vhdl-001', inputs: ['0', '0', '1'], expected: '0' },
        { id: 'vhdl-010', inputs: ['0', '1', '0'], expected: '1' },
        { id: 'vhdl-011', inputs: ['0', '1', '1'], expected: 'X' },
        { id: 'vhdl-100', inputs: ['1', '0', '0'], expected: 'Z' },
        { id: 'vhdl-101', inputs: ['1', '0', '1'], expected: '0' },
        { id: 'vhdl-110', inputs: ['1', '1', '0'], expected: '1' },
        { id: 'vhdl-111', inputs: ['1', '1', '1'], expected: 'X' },
      ],
    },

    {
      kind: 'fields',
      id: 'adc1',
      title: 'A/D Converter 1',
      points: 6,
      prompt: ADC1_PROMPT,
      note: ADC1_NOTE,
      figure: 'ss2023/adc1',
      layout: 'single',
      pointsPerField: 6,
      fields: [
        {
          id: 'adc1-f',
          label: 'Minimum sample frequency:',
          expected: '50',
          unit: 'kHz',
          compare: 'number',
          points: 6,
        },
      ],
    },

    {
      kind: 'fields',
      id: 'adc2',
      title: 'A/D Converter 2',
      points: 6,
      prompt:
        'In the following, a schematic of a flash A/D Converter is given which distinguishes between 4 different, equidistant, positive analog voltage ranges. Assuming $V_{ref}$ = 5V, determine the binary outputs of the A/D Converter for the following input voltages. The output is assumed to be left-MSB (left-Most-Significant-Bit).',
      note: 'Note: A single correct answer is worth 2P.',
      figure: 'ss2023/adc2',
      layout: 'adc',
      pointsPerField: 2,
      subtasks: [
        { id: 'adc2-1', label: 'h(t) = 2V' },
        { id: 'adc2-2', label: 'h(t) = 0.7V' },
        { id: 'adc2-3', label: 'h(t) = 2.1V' },
      ],
      fields: [
        { id: 'adc2-1', label: 'h(t) = 2V', expected: '1', compare: 'number' },
        { id: 'adc2-2', label: 'h(t) = 0.7V', expected: '0', compare: 'number' },
        { id: 'adc2-3', label: 'h(t) = 2.1V', expected: '1', compare: 'number' },
      ],
    },

    {
      kind: 'grid',
      id: 'sched-prio',
      title: 'Scheduling (Priority) 1',
      points: 7,
      prompt:
        'Consider a system with three tasks accessing shared resource $T_1$, $T_2$ and $T_3$. $T_2$ has the highest priority, $T_3$ the lowest. The tasks access this shared resource exclusively using a semaphore.',
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
          ['T1', '2', 'S,N,N,S,S,N,N,N,N', '9'],
          ['T2', '3', 'S,S,N,N,N,N', '6'],
          ['T3', '9', 'S,S,S,N,N,N,N,N', '8'],
        ],
      },
      solutionFigure: 'ss2023/sched-prio-solution',
    },

    {
      kind: 'grid',
      id: 'sched-pip',
      title: 'Scheduling (Priority, PIP) 2',
      points: 7,
      prompt:
        'Consider a system with three tasks accessing shared resource $T_1$, $T_2$ and $T_3$. $T_3$ has the highest priority, $T_2$ the lowest. The tasks access this shared resource exclusively using a semaphore.',
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
          ['T1', '2', 'S,N,N,S,S,S,S,N,N', '9'],
          ['T2', '3', 'S,S,N,N,N,N', '6'],
          ['T3', '6', 'S,S,S,N,N,N,N,N', '8'],
        ],
      },
      solutionFigure: 'ss2023/sched-pip-solution',
    },

    {
      kind: 'fields',
      id: 'pareto',
      title: 'Pareto 1',
      points: 10,
      prompt: PARETO_PROMPT,
      promptExtra: [PARETO_NOTE_EXTRA],
      note: PARETO_NOTE,
      figure: 'ss2023/pareto',
      layout: 'pareto',
      pointsPerField: 2,
      subtasks: [
        { id: 'pareto-a', label: 'Platform A' },
        { id: 'pareto-b', label: 'Platform B' },
        { id: 'pareto-overall', label: 'Overall Pareto-optimal' },
        { id: 'pareto-dominated', label: 'Dominated by B1' },
        { id: 'pareto-dominating', label: 'Dominating A5' },
      ],
      fields: [
        {
          id: 'pareto-a',
          group:
            'What are the Pareto-optimal configurations for each hardware platform assuming minimization of objectives? (2P for each platform)',
          label: 'Platform A:',
          expected: 'a0,a2,a3',
          compare: 'set',
        },
        {
          id: 'pareto-b',
          group:
            'What are the Pareto-optimal configurations for each hardware platform assuming minimization of objectives? (2P for each platform)',
          label: 'Platform B:',
          expected: 'b0,b5',
          compare: 'set',
        },
        {
          id: 'pareto-overall',
          group:
            'What are the overall Pareto-optimal configurations assuming minimization of objectives? (2P)',
          expected: 'a0,a2,b0,b5',
          compare: 'set',
        },
        {
          id: 'pareto-dominated',
          group: 'Which configurations are overall dominated by the design B1? (2P)',
          expected: 'a1,a4,a5,b3,b4',
          compare: 'set',
        },
        {
          id: 'pareto-dominating',
          group: 'Which configurations are overall dominating the design A5? (2P)',
          expected: 'a0,b0,b1',
          compare: 'set',
        },
      ],
    },

    {
      kind: 'choice',
      id: 'rtc',
      title: 'Real-Time Calculus',
      points: 4,
      prompt: `An event stream with the following properties is assumed: One event arrives within every 6 ticks and a second event may follow with a delay of 1 tick. ${RTC_PROMPT_TAIL}`,
      note: CHOICE_NOTE,
      correct: 4,
      options: [
        { figure: 'ss2023/rtc-a' },
        { figure: 'ss2023/rtc-b' },
        { figure: 'ss2023/rtc-c' },
        { figure: 'ss2023/rtc-d' },
        { figure: 'ss2023/rtc-e' },
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
        { label: 'S_1', cells: ['{a}', '{d, c}', '{x}', '{l, w}'] },
        { label: 'S_2', cells: ['{l, a}', '{w}', '{d, c}', '{u}'] },
      ],
      fields: [
        { id: 'cwc-0', expected: 'a', compare: 'set' },
        { id: 'cwc-1', expected: '', compare: 'set' },
        { id: 'cwc-2', expected: 'd,c', compare: 'set' },
        { id: 'cwc-3', expected: 'w,l', compare: 'set' },
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
        { label: 'S_1', cells: ['{a}', '{d, c}', '{x}', '{l, w}'] },
        { label: 'S_2', cells: ['{l, a}', '{w}', '{d, c}', '{u}'] },
      ],
      fields: [
        { id: 'cbc-0', expected: 'a,l', compare: 'set' },
        { id: 'cbc-1', expected: 'd,c,w', compare: 'set' },
        { id: 'cbc-2', expected: 'x', compare: 'set' },
        { id: 'cbc-3', expected: 'u', compare: 'set' },
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
          ['T1', '1', '17', '8'],
          ['T2', '0', '18', '6'],
          ['T3', '3', '16', '6'],
          ['T4', '4', '25', '3'],
        ],
      },
      solutionFigure: 'ss2023/sched-edf-solution',
    },
  ],
}
