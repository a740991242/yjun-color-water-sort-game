import type { MotionProps } from 'motion/react'
import { m } from 'motion/react'

import { varContainer } from './variants/container'

interface Props extends MotionProps {
  className?: string
}

/** 元素进入视口时触发动画 */
export default function MotionViewport({ children, className, ...other }: Props) {
  return (
    <m.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.2 }}
      variants={varContainer()}
      className={className}
      {...other}
    >
      {children}
    </m.div>
  )
}
