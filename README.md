# 魔彩瓶

一款 React + Canvas 实现的颜色倒水闯关小游戏。React 负责页面挂载和工程化构建，Canvas 负责玻璃瓶、水流、粒子、彩虹桥等游戏画面。

## 技术栈

- React 19
- TypeScript
- Vite
- Canvas 2D
- pnpm

## 本地运行

```bash
pnpm install
pnpm dev
```

默认访问：

```text
http://localhost:5173
```

## 构建

```bash
pnpm build
```

构建产物输出到：

```text
dist/
```

## 当前功能

- Canvas 颜色倒水逻辑、真实倒水动画和咕嘟倒水音效。
- 简约玻璃瓶美术、自定义颜色、特殊瓶、限时关卡和困难模式。
- 支持撤销、重开、提示、通关结算、星级评分和最佳步数记录。
- 简单模式全关卡开放，困难模式按进度解锁。
- 设置页支持关卡、声音、教学分页。
- 支持背景音乐、音效、教学朗读、中文/英文/双语、幼宝/常规模式。
- 首次进入有封面动画和轻量新手引导。
- 最后一关有彩虹桥撒花通关动画。

## 关卡校验

新增或调整关卡后运行：

```bash
node scripts/validate-levels.js
```

脚本会检查颜色数量、瓶子容量和基础空位配置，避免明显不可玩的关卡进入正式版本。

## GitHub Pages 自动部署

本项目已经包含：

```text
.github/workflows/deploy.yml
```

推送到 `main` 后，GitHub Actions 会自动：

1. 安装 pnpm。
2. 安装依赖。
3. 执行 `pnpm build`。
4. 发布 `dist/` 到 GitHub Pages。

仓库 Pages 设置需要选择：

```text
Settings -> Pages -> Source: GitHub Actions
```

线上访问地址：

```text
https://a740991242.github.io/yjun-color-water-sort-game/
```
