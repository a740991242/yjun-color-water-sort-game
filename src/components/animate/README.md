# Motion 动画（H5）

基于 [Motion](https://motion.dev/)（原 Framer Motion）封装，与 PC 端 `pc/admin` 使用同一套 API（`motion/react`）。

## 全局

`App` 已包裹 `MotionLazy`，路由根布局使用 `MotionPage` 实现页面切换动画。

## 常用组件

| 组件 | 用途 |
| ---- | ---- |
| `MotionLazy` | 按需加载动画特性，减小首包 |
| `MotionContainer` | 子元素级联入场（stagger） |
| `MotionViewport` | 滚动进入视口时触发 |
| `MotionPage` | 路由 Outlet 页面过渡 |

## 示例

```tsx
import { m } from 'motion/react'
import { MotionContainer, varFade } from '@/components/animate'

function Card() {
  return (
    <MotionContainer>
      <m.div variants={varFade().inUp}>内容 A</m.div>
      <m.div variants={varFade().inUp}>内容 B</m.div>
    </MotionContainer>
  )
}
```

预设变体：`varFade`、`varSlide`、`getVariant('fadeInUp')` 等，见 `variants/`。

## 说明

- 包名请使用 `motion`，不要安装已弃用的 `framer-motion` 主包名（v12+ 官方推荐 `motion`）。
- 系统开启「减少动态效果」时，`MotionPage` 会自动跳过路由动画。
