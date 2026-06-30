import type { MotionProps } from 'motion/react'
import { m } from 'motion/react'

import { varContainer } from './variants/container'

interface Props extends MotionProps {
  className?: string
}

/** 列表/区块级联动画容器 */
export default function MotionContainer({ children, className, ...other }: Props) {
  return (
    <m.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={varContainer()}
      className={className}
      {...other}
    >
      {children}
    </m.div>
  )
}
