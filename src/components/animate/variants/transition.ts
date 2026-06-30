import type { TranEnterType, TranExitType, TranHoverType } from '../types'

/** 移动端默认略快，手感更干脆 */
export function varTranHover(props?: TranHoverType) {
  const duration = props?.duration ?? 0.24
  const ease = props?.ease ?? [0.43, 0.13, 0.23, 0.96]
  return { duration, ease }
}

export function varTranEnter(props?: TranEnterType) {
  const duration = props?.durationIn ?? 0.4
  const ease = props?.easeIn ?? [0.43, 0.13, 0.23, 0.96]
  return { duration, ease }
}

export function varTranExit(props?: TranExitType) {
  const duration = props?.durationOut ?? 0.28
  const ease = props?.easeOut ?? [0.43, 0.13, 0.23, 0.96]
  return { duration, ease }
}
