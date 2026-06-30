import { varFade } from './fade'
import { varSlide } from './slide'

export * from './container'
export * from './fade'
export * from './slide'
export * from './transition'

export function getVariant(variant = 'fadeInUp') {
  return {
    fadeIn: varFade().in,
    fadeInUp: varFade().inUp,
    fadeInDown: varFade().inDown,
    fadeInLeft: varFade().inLeft,
    fadeInRight: varFade().inRight,
    slideInUp: varSlide().inUp,
    slideInDown: varSlide().inDown,
    slideInLeft: varSlide().inLeft,
    slideInRight: varSlide().inRight,
  }[variant]
}
