import { AnimatePresence, m, useReducedMotion } from 'motion/react'
import { useLocation, useOutlet } from 'react-router'

import { varFade } from './variants/fade'

/** 路由切换页面过渡（配合根布局 Outlet 使用） */
export default function MotionPage() {
  const location = useLocation()
  const outlet = useOutlet()
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return outlet
  }

  return (
    <AnimatePresence mode="wait">
      <m.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={varFade({ distance: 24 }).inRight}
        style={{ minHeight: '100%' }}
      >
        {outlet}
      </m.div>
    </AnimatePresence>
  )
}
