import type { VariantsType } from '../types'
import { varTranEnter, varTranExit } from './transition'

export function varSlide(props?: VariantsType) {
  const distance = props?.distance ?? 80
  const durationIn = props?.durationIn
  const durationOut = props?.durationOut
  const easeIn = props?.easeIn
  const easeOut = props?.easeOut

  return {
    inUp: {
      initial: { y: distance },
      animate: { y: 0, transition: varTranEnter({ durationIn, easeIn }) },
      exit: { y: distance, transition: varTranExit({ durationOut, easeOut }) },
    },
    inDown: {
      initial: { y: -distance },
      animate: { y: 0, transition: varTranEnter({ durationIn, easeIn }) },
      exit: { y: -distance, transition: varTranExit({ durationOut, easeOut }) },
    },
    inLeft: {
      initial: { x: -distance },
      animate: { x: 0, transition: varTranEnter({ durationIn, easeIn }) },
      exit: { x: -distance, transition: varTranExit({ durationOut, easeOut }) },
    },
    inRight: {
      initial: { x: distance },
      animate: { x: 0, transition: varTranEnter({ durationIn, easeIn }) },
      exit: { x: distance, transition: varTranExit({ durationOut, easeOut }) },
    },
  }
}
