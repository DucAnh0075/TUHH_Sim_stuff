import type { Exam } from '../types'
import { SS2022 } from './ss2022'
import { SS2023 } from './ss2023'
import { SS2024 } from './ss2024'
import { WS2122 } from './ws2122'
import { WS2425 } from './ws2425'

/** All exams, sorted by semester - that is the order of the start screen. */
export const EXAMS: Exam[] = [WS2122, SS2022, SS2023, SS2024, WS2425].sort((a, b) => a.order - b.order)
