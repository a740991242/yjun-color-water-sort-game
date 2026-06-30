import type { ReactNode } from 'react'
import { domMax, LazyMotion, m } from 'motion/react'

interface Props {
  children: ReactNode
}

/**
 * 按需加载 Motion 特性，减小首包体积
 * @see https://motion.dev/docs/react-reduce-bundle-size
 */
export function MotionLazy({ children }: Props) {
  return (
    <LazyMotion strict features={domMax}>
      <m.div style={{ minHeight: '100%' }}>{children}</m.div>
    </LazyMotion>
  )
}
