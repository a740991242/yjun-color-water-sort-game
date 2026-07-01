# Maestro iOS Tests

本目录用于 iOS Simulator 上的魔彩瓶移动端回归测试。

运行前确保：

```bash
pnpm dev -- --host 0.0.0.0 --port 5201
xcrun simctl boot 5D638AC4-9707-4415-80E7-DB65C0305D61
```

Maestro 通过 Homebrew 安装时，当前机器需要显式使用 OpenJDK：

```bash
JAVA_HOME=/opt/homebrew/opt/openjdk PATH=/opt/homebrew/opt/openjdk/bin:$PATH maestro test --device 5D638AC4-9707-4415-80E7-DB65C0305D61 .maestro/ios-smoke.yaml
JAVA_HOME=/opt/homebrew/opt/openjdk PATH=/opt/homebrew/opt/openjdk/bin:$PATH maestro test --device 5D638AC4-9707-4415-80E7-DB65C0305D61 .maestro/ios-audio-debug.yaml
```

`ios-audio-debug.yaml` 依赖 `?debugAudio=1` 的调试条，期望点击音乐后看到：

```text
Audio: running
Music: on/started
```

