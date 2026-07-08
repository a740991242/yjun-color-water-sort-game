import { useCallback, useEffect, useRef, useState } from 'react'

import { initMocaipingGame } from './game'
import './mocaiping.css'

type ScreenState = 'cover' | 'opening' | 'game'
type GameMode = 'easy' | 'hard'

const COVER_MOBILE = 'assets/brand/mocaiping-cover-mobile.png'
const COVER_MOBILE_390 = 'assets/brand/mocaiping-cover-mobile-390.webp'
const COVER_MOBILE_750 = 'assets/brand/mocaiping-cover-mobile-750.webp'
const COVER_MOBILE_940 = 'assets/brand/mocaiping-cover-mobile-940.webp'
const COVER_DESKTOP_1200 = 'assets/brand/mocaiping-cover-desktop-1200.webp'
const SAVE_KEY = 'mocaiping-settings-v4'
const AUDIO_PRELOADS = [
  'assets/pour-water.mp3',
  'assets/pick-bottle.mp3',
  'assets/put-down-bottle.mp3',
  'assets/background-music.mp3',
]

function getCoverImage(): string {
  const isDesktop = window.matchMedia('(min-width: 700px) and (min-aspect-ratio: 1 / 1)').matches
  return isDesktop ? COVER_DESKTOP_1200 : COVER_MOBILE_940
}

function audioCache(): Map<string, HTMLAudioElement> {
  const host = globalThis as typeof globalThis & { __mocaipingAudioCache?: Map<string, HTMLAudioElement> }
  if (!host.__mocaipingAudioCache)
    host.__mocaipingAudioCache = new Map()
  return host.__mocaipingAudioCache
}

function preloadAudio(src: string, preload: 'auto' | 'metadata' = 'auto') {
  const cache = audioCache()
  const cached = cache.get(src)
  if (cached) {
    if (preload === 'auto' && cached.preload !== 'auto') {
      cached.preload = 'auto'
      cached.load()
    }
    return cached
  }
  const audio = new Audio(src)
  audio.preload = preload
  audio.setAttribute('playsinline', 'true')
  audio.setAttribute('webkit-playsinline', 'true')
  audio.load()
  cache.set(src, audio)
  return audio
}

function scheduleAudioPreload() {
  const run = () => {
    AUDIO_PRELOADS.forEach((src) => {
      preloadAudio(src, src.includes('background-music') ? 'metadata' : 'auto')
    })
  }
  const requestIdle = (window as typeof window & { requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number }).requestIdleCallback
  if (requestIdle)
    return requestIdle(run, { timeout: 1800 })
  return window.setTimeout(run, 900)
}

function loadSavedMode(): GameMode {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (raw) {
      const saved = JSON.parse(raw)
      if (saved.mode === 'easy' || saved.mode === 'hard')
        return saved.mode as GameMode
    }
  }
  catch {}
  return 'easy'
}

function saveSelectedMode(mode: GameMode) {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    const saved = raw ? JSON.parse(raw) : {}
    saved.mode = mode
    localStorage.setItem(SAVE_KEY, JSON.stringify(saved))
  }
  catch {}
}

const GAME_MARKUP = '<main class="game-shell">\n    <header class="topbar">\n      <div class="status" id="status">第 1 关</div>\n      <div>\n        <h1>\n          <span class="rainbow-title" aria-label="请将相同颜色的水倒在一起">\n            <span class="title-word">请将</span>\n            <span class="title-word">相同颜色</span>\n            <span class="title-word">的水</span>\n            <span class="title-break" aria-hidden="true"></span>\n            <span class="title-word">倒在</span>\n            <span class="title-word">一起</span>\n          </span>\n        </h1>\n        <div class="meta">\n          <span class="chip" id="moves">步数 0</span>\n          <span class="chip" id="timer">不限时</span>\n          <span class="chip" id="ruleTag">经典</span>\n        </div>\n      </div>\n      <button class="settings-button" type="button" id="settings" title="打开设置" aria-label="打开设置">\n        <svg viewBox="0 0 24 24" aria-hidden="true">\n          <path d="M10.9 2.9h2.2l.5 2.3c.5.2 1 .4 1.5.7l2-1.2 1.6 1.6-1.2 2c.3.5.5 1 .7 1.5l2.3.5v2.2l-2.3.5c-.2.5-.4 1-.7 1.5l1.2 2-1.6 1.6-2-1.2c-.5.3-1 .5-1.5.7l-.5 2.3h-2.2l-.5-2.3c-.5-.2-1-.4-1.5-.7l-2 1.2-1.6-1.6 1.2-2c-.3-.5-.5-1-.7-1.5l-2.3-.5v-2.2l2.3-.5c.2-.5.4-1 .7-1.5l-1.2-2 1.6-1.6 2 1.2c.5-.3 1-.5 1.5-.7l.5-2.3Z" fill="#fff" opacity=".98"/>\n          <circle cx="12" cy="12" r="3.5" fill="#39aeea"/>\n          <circle cx="12" cy="12" r="1.45" fill="#fff"/>\n        </svg>\n      </button>\n    </header>\n\n    <canvas id="game" aria-label="颜色倒水游戏画布"></canvas>\n    <div class="toast" id="toast"></div>\n\n    <footer class="toolbar">\n      <button type="button" id="undo" title="撤销上一步">撤销</button>\n      <button type="button" id="hint" title="给出一步提示">提示</button>\n      <button type="button" id="restart" title="重新开始当前关">重开</button>\n      <button class="toolbar-icon is-off" type="button" id="toolbarMusic" title="开启背景音乐" aria-label="开启背景音乐"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18.2a3 3 0 1 1-1.5-2.6V5.7c0-.6.4-1.1 1-1.2l8-1.4c.7-.1 1.3.4 1.3 1.1v10.5a3 3 0 1 1-1.5-2.6V7.2l-6.3 1.1v9.9Z" fill="currentColor"/></svg></button>\n      <button class="toolbar-icon is-off" type="button" id="toolbarSound" title="开启倒水音效" aria-label="开启倒水音效"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.4h3.2l4.2-3.5c.8-.6 1.9-.1 1.9.9v10.4c0 1-1.1 1.5-1.9.9l-4.2-3.5H4a1.4 1.4 0 0 1-1.4-1.4v-2.4A1.4 1.4 0 0 1 4 9.4Zm12.2-1.8a1 1 0 0 1 1.4 0 6.2 6.2 0 0 1 0 8.8 1 1 0 1 1-1.4-1.4 4.2 4.2 0 0 0 0-6 1 1 0 0 1 0-1.4Zm2.6-2.6a1 1 0 0 1 1.4 0 9.9 9.9 0 0 1 0 14 1 1 0 0 1-1.4-1.4 7.9 7.9 0 0 0 0-11.2 1 1 0 0 1 0-1.4Z" fill="currentColor"/></svg></button>\n    </footer>\n    <div class="result-panel" id="resultPanel" aria-hidden="true">\n      <div class="result-card" role="dialog" aria-modal="true" aria-label="通关结果">\n        <p class="result-title" id="resultTitle">恭喜通关</p>\n        <div class="result-stars" id="resultStars">★★★</div>\n        <div class="result-stats">\n          <span id="resultMoves">本关 0 步</span>\n          <span id="resultBest">最佳 0 步</span>\n        </div>\n        <div class="result-actions">\n          <button type="button" id="resultRestart">重玩</button>\n          <button class="primary" type="button" id="resultNext">下一关</button>\n        </div>\n      </div>\n    </div>\n    <div class="settings-panel" id="settingsPanel" aria-hidden="true">\n      <div class="settings-card" role="dialog" aria-modal="true" aria-label="游戏设置">\n        <div class="settings-head">\n          <p class="settings-title">设置</p>\n          <button class="settings-close" type="button" id="settingsClose" title="关闭设置">关闭</button>\n        </div>\n        <div class="settings-tabs" aria-label="设置分类">\n          <button type="button" id="settingsTabGame">关卡</button>\n          <button type="button" id="settingsTabSound">声音</button>\n          <button type="button" id="settingsTabTeaching">教学</button>\n        </div>\n        <section class="settings-group settings-section" data-settings-section="game" aria-label="游戏设置">\n          <p class="settings-group-title">游戏</p>\n          <div class="mode-switch" aria-label="模式切换">\n            <button type="button" id="easyMode">简单模式</button>\n            <button type="button" id="hardMode">困难模式</button>\n          </div>\n          <div class="level-grid" id="levelGrid" aria-label="关卡选择"></div>\n        </section>\n        <section class="settings-group settings-section" data-settings-section="sound" aria-label="声音设置">\n          <p class="settings-group-title">声音</p>\n          <div class="settings-row">\n            <span class="settings-label">背景音乐</span>\n            <button class="settings-action" type="button" id="music">音乐关</button>\n          </div>\n          <div class="settings-row">\n            <span class="settings-label">倒水音效</span>\n            <button class="settings-action" type="button" id="sound">音效关</button>\n          </div>\n          <label class="volume-control" for="masterVolume">\n            <span>总音量</span>\n            <input id="masterVolume" type="range" min="0" max="300" value="85" step="1" aria-label="总音量">\n            <span class="volume-value" id="masterVolumeValue">85%</span>\n          </label>\n          <label class="volume-control" for="musicVolume">\n            <span>音乐</span>\n            <input id="musicVolume" type="range" min="0" max="150" value="70" step="1" aria-label="音乐音量">\n            <span class="volume-value" id="musicVolumeValue">70%</span>\n          </label>\n          <label class="volume-control" for="sfxVolume">\n            <span>音效</span>\n            <input id="sfxVolume" type="range" min="0" max="200" value="120" step="1" aria-label="音效音量">\n            <span class="volume-value" id="sfxVolumeValue">120%</span>\n          </label>\n        </section>\n        <section class="settings-group settings-section" data-settings-section="teaching" aria-label="教学设置">\n          <p class="settings-group-title">教学</p>\n          <div class="settings-row">\n            <span class="settings-label">教学朗读</span>\n            <button class="settings-action" type="button" id="teaching">教学关</button>\n          </div>\n          <label class="volume-control" for="voiceVolume">\n            <span>语音</span>\n            <input id="voiceVolume" type="range" min="0" max="150" value="100" step="1" aria-label="教学语音音量">\n            <span class="volume-value" id="voiceVolumeValue">100%</span>\n          </label>\n          <div class="language-switch two" aria-label="教学语句">\n            <button type="button" id="teachingToddler">幼宝模式</button>\n            <button type="button" id="teachingNormal">常规模式</button>\n          </div>\n          <div class="language-switch" aria-label="语音语言">\n            <button type="button" id="speechZh">中文</button>\n            <button type="button" id="speechEn">English</button>\n            <button type="button" id="speechBoth">双语</button>\n          </div>\n        </section>\n      </div>\n    </div>\n  </main>'

export default function MocaipingGame() {
  const [screen, setScreen] = useState<ScreenState>('cover')
  const [selectedMode, setSelectedMode] = useState<GameMode>(loadSavedMode)
  const hostRef = useRef<HTMLDivElement>(null)
  const coverImageRef = useRef(getCoverImage())

  useEffect(() => {
    saveSelectedMode(selectedMode)
  }, [selectedMode])

  useEffect(() => {
    const taskId = scheduleAudioPreload()
    return () => {
      const cancelIdle = (window as typeof window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback
      if (cancelIdle)
        cancelIdle(taskId)
      else
        window.clearTimeout(taskId)
    }
  }, [])

  useEffect(() => {
    if (screen !== 'opening')
      return
    const timer = window.setTimeout(() => {
      setScreen('game')
    }, 860)
    return () => window.clearTimeout(timer)
  }, [screen])

  useEffect(() => {
    if (screen !== 'game')
      return
    const host = hostRef.current
    if (!host)
      return

    host.innerHTML = GAME_MARKUP
    const dispose = initMocaipingGame(host, { initialMode: selectedMode })

    return () => {
      dispose?.()
      host.innerHTML = ''
    }
  }, [screen, selectedMode])

  const handleStart = useCallback(() => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext
    if (AudioContext) {
      try {
        const ctx = new AudioContext()
        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {})
        }
      }
      catch {}
    }
    preloadAudio('assets/background-music.mp3', 'auto')
    setScreen('opening')
  }, [])

  return (
    <>
      {screen === 'cover' && (
        <div className="cover-screen">
          <picture className="cover-picture">
            <source
              type="image/webp"
              media="(min-width: 700px) and (min-aspect-ratio: 1 / 1)"
              srcSet={`${COVER_DESKTOP_1200} 1200w`}
              sizes="100vw"
            />
            <source
              type="image/webp"
              srcSet={`${COVER_MOBILE_390} 390w, ${COVER_MOBILE_750} 750w, ${COVER_MOBILE_940} 940w`}
              sizes="100vw"
            />
            <img
              className="cover-art"
              src={COVER_MOBILE}
              alt=""
              draggable={false}
              decoding="async"
              fetchPriority="high"
            />
          </picture>
          <div className="cover-mode-segmented">
            <div
              className={selectedMode === 'easy' ? 'is-active' : ''}
              onClick={() => setSelectedMode('easy')}
            >
              简单
            </div>
            <div
              className={selectedMode === 'hard' ? 'is-active' : ''}
              onClick={() => setSelectedMode('hard')}
            >
              困难
            </div>
          </div>
          <button
            type="button"
            className="cover-start-button"
            onClick={handleStart}
          >
            开始游戏
          </button>
        </div>
      )}

      {screen === 'opening' && (
        <div className="opening-curtain" aria-hidden="true">
          <div
            className="curtain-left"
            style={{ backgroundImage: `url(${coverImageRef.current})` }}
          />
          <div
            className="curtain-right"
            style={{ backgroundImage: `url(${coverImageRef.current})` }}
          />
        </div>
      )}

      <div
        ref={hostRef}
        className="mocaiping-app"
        style={{ display: screen === 'game' ? undefined : 'none' }}
      />
    </>
  )
}
