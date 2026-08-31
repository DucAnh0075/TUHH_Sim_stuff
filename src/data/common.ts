import type { GridState } from '../types'

/**
 * Wording that is identical in every report. Everything here is verbatim from the
 * PDFs - typos included ("typcically", "signales", "energey", "seperator").
 */

export const MC_PROMPT = 'Evaluate the following statements. Which are right, which are wrong?'

export const MC_NOTE =
  'Evaluate each of the following statements and decide if it is true or false. A right answer is worth 1 point, a wrong or missing answer 0 points.'

export const CLOZE_PROMPT = 'Assign the right words in the select boxes for the following statements.'

export const CLOZE_NOTE =
  'A correct answer is worth 1 point, a wrong or missing answer is graded with 0 points. You will not receive fewer than 0 points for this overall task. In the evalation the gaps will be displayed as your answer (points | correct answer).'

export const CHOICE_NOTE =
  'Select one of the following answers. You will only receive points for this task if your selection corresponds to the correct answer.'

export const CENET_PROMPT =
  'Assume the following Condition/Event Net $N = (C, E, F)$. $C$ denotes conditions, $E$ events and $F$ flow relations. Derive the correct set of flow relations for the given C/E Net. Only one of the following sets is correct.'

export const VHDL_PROMPT =
  'Suppose that a bus as shown in the circuit is given. Complete the IEEE 1164 values for the depicted bus. Assume that no other member is sending simultaneously on the bus.'

export const VHDL_NOTE =
  'A correct entry is worth 1 point, whereas an incorrect or missing entry is worth 0 points.'

export const ADC1_PROMPT =
  'In the following, the plot of an audio signal is given. Assume that you want to capture this signal using an A/D Converter. What is the minimum sampling frequency (in kHz) to be used for the A/D Conversion, such that the signal can be reconstructed after the discretization without errors?'

export const ADC1_NOTE =
  'You can zoom into the diagram with the mouse by dragging the window frame to the position where you want to zoom in. Double-click to exit the zoom view.'

export const PARETO_PROMPT =
  'A startup is developing a novel embedded system for a multimedia application. They have two different hardware platforms (A and B) that consist of a number of high and low speed processors. Changing scheduling configurations lead to various task-to-processor mappings resulting in different energy consumptions and execution times. Assume that we want to minimize the objectives.'

export const PARETO_NOTE_EXTRA =
  'Note: Use a comma (",") to enumerate multiple design configurations. For an empty set of configurations, just leave an input field empty.'

export const PARETO_NOTE =
  'You can hover over a single point to see the exact coordinates and the platform of this point. A point "B6" belongs to the hardware platform B, whereas a point "A6" belongs to the hardware platform A.'

export const RTC_PROMPT_TAIL =
  'Choose the corresponding set of arrival curves, which represent this event stream!'

export const PETRINET_PROMPT = 'Assume a Petrinet with the following flow relation:'

export const EDF_PROMPT =
  'The following table describes four independent tasks to be scheduled on a single-core processor. What is the resulting schedule for the given task set if preemptive earliest deadline first scheduling is used? Assume that the context switch times are negligible.'

export const EDF_EXTRA = [
  'Use the 2 buttons to change between a selection of idle (task is not being executed actively) and Active (task is being actively executed).',
  'Note: The diagram is initially filled completely with Idle.',
]

/** The three shared paragraphs of both semaphore scheduling tasks. */
export const SEMAPHORE_EXTRA = [
  'In the following table, $N$ marks the execution of a "non-critical (normal) code block" for one clock cycle. $S$ marks the execution of a "code block in a critical section protected by semaphore $S$" for one clock cycle.',
]

export const SEMAPHORE_TAIL = [
  'Use the 3 buttons to change between a selection of idle (task is not being executed actively), Critical (a critical phase is being executed) and Non-Critical (a non-critical phase is being executed).',
  'Note: The diagram is initially filled completely with Idle.',
]

export const CACHE_PROMPT_HEAD =
  'Static cache analysis is performed as part of the WCET estimation process. The following diagram shows two abstract cache states $S_1$ and $S_2$ of a {WAYS}-way set associative cache before a control flow join. The replacement policy of the cache follows the Least-Recently-Used strategy (LRU). Column $c_0$ holds the youngest entry.'

export function cachePrompt(ways: number, analysis: 'worst-case' | 'best-case'): string {
  return `${CACHE_PROMPT_HEAD.replace('{WAYS}', String(ways))} What would be the state after the control flow join according to a ${analysis} analysis? Use the fields in the second table for your answer.`
}

export const CACHE_NOTE =
  'Note: Use a comma (",") as a seperator for multiple variables in one entry. For an empty cache entry, just leave an input field empty.'

export const STATECHART_PROMPT_HEAD =
  'Suppose the StateCharts model in the following diagram is given. In the following table, mark the states the model is in after each input of the following sequence:'

export const STATECHART_PROMPT_TAIL =
  'Note that H denotes the History mechanism. Also name the state / states the model is in after the reset.'

// ---------------------------------------------------------------------- grid states

/** Report colours of the scheduling charts. */
export const SEMAPHORE_STATES: GridState[] = [
  { label: 'Idle', color: '#90ee90' },
  { label: 'Non-Critical', color: '#1e90ff' },
  { label: 'Critical', color: '#ff00ff' },
]

export const EDF_STATES: GridState[] = [
  { label: 'Idle', color: '#90ee90' },
  { label: 'Active', color: '#1e90ff' },
]

export const STATECHART_STATES: GridState[] = [
  { label: 'nicht aktiv', color: '#cfe6f5' },
  { label: 'aktiv', color: '#5f9c1e' },
]

/** Tick labels '0' ... 'last' for the Gantt charts. */
export function ticks(last: number): string[] {
  return Array.from({ length: last + 1 }, (_, i) => String(i))
}

/** The conversion table rows of a report, 1.0 ... 4.0. */
export function grades(total: number) {
  return [
    { grade: '1.0', percent: 95 },
    { grade: '1.3', percent: 90 },
    { grade: '1.7', percent: 85 },
    { grade: '2.0', percent: 80 },
    { grade: '2.3', percent: 75 },
    { grade: '2.7', percent: 70 },
    { grade: '3.0', percent: 65 },
    { grade: '3.3', percent: 60 },
    { grade: '3.7', percent: 55 },
    { grade: '4.0', percent: 50 },
  ].map(({ grade, percent }) => ({ grade, percent, points: Math.round(total * percent) / 100 }))
}
