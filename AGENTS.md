@/Users/yinjun/.codex/RTK.md

# 魔彩瓶 - AI 协作规范

本文件是 `/Users/yinjun/Desktop/yjun-Datas/apps/yjun-color-water-sort-game` 的项目级 AI 工作规范，适用于 Codex、Claude、Cursor 等会读取本仓库的 AI 工具。

如果本文件与通用规则冲突，以更具体、更保护项目资产和用户数据的规则为准。

## 0. 输出协议（最高优先级）

- 默认全程静默。
- 除非用户明确要求“解释 / 总结 / 列出改动 / 给我计划 / 展开说明”，否则不要输出任何过程性文字。
- 执行任务期间禁止输出：
  - 进度说明
  - 操作计划
  - 文件改动列表
  - 代码改动说明
  - 验证过程说明
  - 命令日志
  - “我正在……”类状态更新
- 任务成功完成后，最终回复只能是：

```text
已完成
```

- 如果任务未完成，最终回复只能用一句话说明卡在哪一步和需要什么。
- 除非用户明确要求，否则不要在最终回复中附加：
  - 修改了哪些文件
  - 做了哪些改动
  - 运行了哪些命令
  - 测试是否通过
  - 后续建议
  - 任何总结性内容
- 即使完成了代码修改、测试或提交，也不要主动汇报细节；只回复“已完成”。

## 1. 项目定位

- 本项目是“魔彩瓶”颜色倒水闯关小游戏。
- 当前技术栈为 **React 19 + TypeScript + Vite + Canvas 2D + pnpm**。
- React 负责应用挂载、页面状态、工程化构建和资源组织。
- Canvas 负责瓶子、液体、水流、粒子、通关彩虹桥等游戏画面。
- 线上部署目标为 GitHub Pages。

## 2. 重要目录

- `src/mocaiping/`：魔彩瓶核心代码。
  - `MocaipingGame.tsx`：React 挂载、页面入口和游戏容器。
  - `game.ts`：Canvas 游戏主逻辑、关卡、动画、音频、教学语音。
  - `mocaiping.css`：游戏页面、设置页、封面页等样式。
- `public/assets/`：运行时静态资源，包括 MP3、封面图、Logo、彩虹桥等。
- `public/assets/voice/`：教学语音素材，区分 `mom` / `toddler`、`zh` / `en`。
- `src/mocaiping/assets/brand/`：源码侧品牌图片资源。
- `docs/`：需求文档、代码实现文档、测试用例和专项方案。
- `scripts/`：资源生成、关卡校验等辅助脚本。
- `.github/workflows/`：GitHub Pages 自动部署配置。
- `.maestro/`：移动端自动化测试脚本。

## 3. 修改原则

- 先读上下文，再改代码。修改前优先查看相关文件、README、docs 和现有实现。
- 保持最小改动，不顺手重构无关代码。
- 写好代码后不要执行 `pnpm build`，除非用户单独明确要求。
- 不要删除、覆盖或批量移动魔彩瓶相关图片、MP3、语音、封面、Logo、彩虹桥等资产，除非用户明确要求。
- 不要把 `dist/`、`node_modules/`、日志、缓存或个人本地配置提交进仓库。
- 不要擅自改 `.env*`、部署配置、GitHub Actions、仓库远程地址。
- 不要自动提交或推送，除非用户明确说“提交”“推送”“发布”等。
- 所有命令统一加 `rtk` 前缀，除非工具限制不支持。

## 4. 开发规范

- 搜索文件优先使用 `rg` / `rg --files`。
- 手工编辑文件优先使用 `apply_patch`。
- 遵循现有 TypeScript、React、Canvas 写法，不引入不必要的新框架。
- 游戏逻辑尽量集中在 `src/mocaiping/game.ts`，React 层只处理挂载、入口流程和容器状态。
- UI 样式优先在 `src/mocaiping/mocaiping.css` 内延续现有命名和视觉风格。
- 新增关卡后必须运行 `scripts/validate-levels.js`。
- 改动移动端布局后，要检查 iPhone 竖屏首屏、底部工具栏、安全区和横向溢出。

## 5. 音频与教学语音

- 项目用户明确偏好：游戏声音优先使用本地 MP3，避免 WebAudio 兜底造成重音或奇怪音色。
- 背景音乐不要在页面刷新后自动播放；移动端浏览器会拦截，且会造成按钮状态误导。
- 不要缓存“背景音乐开”状态。可以缓存音量、教学语言、教学模式、最佳成绩等。
- 倒水音效、拿起/放下音效、教学语音要避免重复叠放。
- 新增教学语音时，要同时考虑：
  - `public/assets/voice/mom/zh`
  - `public/assets/voice/mom/en`
  - `public/assets/voice/toddler/zh`
  - `public/assets/voice/toddler/en`
- 新增语音 key 后，要检查中英文、幼宝/常规模式是否都有对应 MP3。

## 6. 移动端与 iOS 注意事项

- iOS Safari、微信浏览器、iOS Chrome 对音频自动播放限制严格。
- 用户手势内只能可靠触发有限的媒体播放，不要在一个点击中同时强行播放多个音频。
- 封面页、设置页、底部工具栏要考虑 `safe-area-inset-bottom`。
- 不要依赖刷新后自动播放背景音乐。
- Canvas 尺寸变化要兼容 `visualViewport` 和移动端地址栏伸缩。

## 7. 视觉与交互要求

- 魔彩瓶整体视觉偏粉色、天蓝、玻璃瓶、彩虹、儿童友好风格。
- 按钮状态应清楚：
  - 开启类按钮可用粉色背景、白字。
  - 关闭类按钮可用浅蓝背景、蓝字。
  - 下一关等主操作可用天蓝背景、白字。
- 页面不要出现文字挤压、按钮换行、元素重叠、横向溢出。
- 倒水动画要保持瓶子在目标瓶上方或斜上方，不要贴得过近，也不要在左右边缘溢出屏幕。
- 设置页要保持易读，音量文字不能因浅色背景看不清。

## 8. 验证命令

常规代码修改后至少运行：

```bash
rtk pnpm lint
rtk pnpm typecheck
```

不要默认执行 `rtk pnpm build`。只有用户明确要求构建、发布、部署或检查生产包时，才运行 build。

关卡修改后额外运行：

```bash
rtk node scripts/validate-levels.js
```

本地开发常用：

```bash
rtk pnpm dev --host 0.0.0.0 --port 5201
```

本地访问：

```text
http://localhost:5201/
```

## 9. Git 与部署

- 查看状态、diff、日志是允许的。
- 不自动提交、不自动推送，除非用户明确要求。
- 提交前确保只包含本次任务相关文件。
- GitHub Pages 使用 GitHub Actions 发布 `dist/`。
- 仓库 Pages 设置应为：

```text
Settings -> Pages -> Source: GitHub Actions
```

线上地址：

```text
https://a740991242.github.io/yjun-color-water-sort-game/
```

## 10. 文档维护

- 产品需求、实现方案和测试用例优先写入 `docs/`。
- 和长期知识库相关的总结可以同步到 `/Users/yinjun/Desktop/yjun-Datas/yjun-brain/01-projects/魔彩瓶/`。
- 不要把普通沟通内容散落到代码文件注释里。
- 文档要写明日期、背景、影响范围、实施步骤和验收标准。
