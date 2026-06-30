export interface ContainerProps {
  staggerIn?: number
  delayIn?: number
  staggerOut?: number
}

export function varContainer(props?: ContainerProps) {
  const staggerIn = props?.staggerIn ?? 0.06
  const delayIn = props?.delayIn ?? 0.04
  const staggerOut = props?.staggerOut ?? 0.04

  return {
    animate: {
      transition: {
        staggerChildren: staggerIn,
        delayChildren: delayIn,
      },
    },
    exit: {
      transition: {
        staggerChildren: staggerOut,
        staggerDirection: -1,
      },
    },
  }
}
