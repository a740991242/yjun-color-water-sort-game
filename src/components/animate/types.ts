import type { Transition } from 'motion/react'

type Easing = NonNullable<Transition['ease']>

export interface VariantsType {
  durationIn?: number
  durationOut?: number
  easeIn?: Easing
  easeOut?: Easing
  distance?: number
}

export interface TranHoverType {
  duration?: number
  ease?: Easing
}

export interface TranEnterType {
  durationIn?: number
  easeIn?: Easing
}

export interface TranExitType {
  durationOut?: number
  easeOut?: Easing
}
