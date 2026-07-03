// @ts-nocheck
export function initMocaipingGame(root: ParentNode = document) {
    if (typeof window.__mocaipingDestroyCurrent === "function") {
      window.__mocaipingDestroyCurrent();
    }

    const canvas = root.querySelector("#game");
    const ctx = canvas.getContext("2d");
    const statusEl = root.querySelector("#status");
    const movesEl = root.querySelector("#moves");
    const timerEl = root.querySelector("#timer");
    const ruleTagEl = root.querySelector("#ruleTag");
    const toastEl = root.querySelector("#toast");
    const undoButton = root.querySelector("#undo");
    const hintButton = root.querySelector("#hint");
    const restartButton = root.querySelector("#restart");
    const settingsButton = root.querySelector("#settings");
    const settingsPanel = root.querySelector("#settingsPanel");
    const settingsCloseButton = root.querySelector("#settingsClose");
    const settingsTabGame = root.querySelector("#settingsTabGame");
    const settingsTabSound = root.querySelector("#settingsTabSound");
    const settingsTabTeaching = root.querySelector("#settingsTabTeaching");
    const settingsSections = root.querySelectorAll(".settings-section");
    const easyModeButton = root.querySelector("#easyMode");
    const hardModeButton = root.querySelector("#hardMode");
    const levelGrid = root.querySelector("#levelGrid");
    const toolbarMusicButton = root.querySelector("#toolbarMusic");
    const toolbarSoundButton = root.querySelector("#toolbarSound");
    const musicButton = root.querySelector("#music");
    const soundButton = root.querySelector("#sound");
    const teachingButton = root.querySelector("#teaching");
    const teachingToddlerButton = root.querySelector("#teachingToddler");
    const teachingNormalButton = root.querySelector("#teachingNormal");
    const speechZhButton = root.querySelector("#speechZh");
    const speechEnButton = root.querySelector("#speechEn");
    const speechBothButton = root.querySelector("#speechBoth");
    const masterVolumeInput = root.querySelector("#masterVolume");
    const masterVolumeValue = root.querySelector("#masterVolumeValue");
    const musicVolumeInput = root.querySelector("#musicVolume");
    const musicVolumeValue = root.querySelector("#musicVolumeValue");
    const sfxVolumeInput = root.querySelector("#sfxVolume");
    const sfxVolumeValue = root.querySelector("#sfxVolumeValue");
    const voiceVolumeInput = root.querySelector("#voiceVolume");
    const voiceVolumeValue = root.querySelector("#voiceVolumeValue");
    const resultPanel = root.querySelector("#resultPanel");
    const resultTitle = root.querySelector("#resultTitle");
    const resultStars = root.querySelector("#resultStars");
    const resultMoves = root.querySelector("#resultMoves");
    const resultBest = root.querySelector("#resultBest");
    const resultRestartButton = root.querySelector("#resultRestart");
    const resultNextButton = root.querySelector("#resultNext");
    const coverIntro = root.querySelector("#coverIntro");
    const gameShell = root.querySelector(".game-shell");
    const WATER_AUDIO_URL = "assets/pour-water.mp3";
    const UI_SFX_URLS = {
      pick: "assets/pick-bottle.mp3",
      putDown: "assets/put-down-bottle.mp3"
    };
    const MUSIC_AUDIO_URL = "assets/background-music.mp3";
    const MUSIC_MAX_GAIN = 1.65;
    const WATER_FILE_MAX_VOLUME = 1;
    const WATER_MUSIC_DUCK = 0.28;
    const SAVE_KEY = "mocaiping-settings-v4";
    const GUIDE_KEY = "mocaiping-first-guide-seen";
    const finaleRainbowImage = new Image();
    finaleRainbowImage.src = "assets/brand/finale-rainbow-bridge.png";
    const audioDebugEnabled = new URLSearchParams(window.location.search).get("debugAudio") === "1";
    const audioDebugEl = audioDebugEnabled ? document.createElement("div") : null;
    if (audioDebugEl && gameShell) {
      audioDebugEl.className = "audio-debug";
      audioDebugEl.setAttribute("aria-live", "polite");
      gameShell.appendChild(audioDebugEl);
    }
    let destroyed = false;
    let renderFrame = 0;

    const COLORS = {
      berry: "#7c4bd9",
      coral: "#ff6b6b",
      mint: "#45d18a",
      ocean: "#2296d5",
      orange: "#ff963a",
      moss: "#66a51f",
      navy: "#2c4dd8",
      slate: "#5e6a73",
      pink: "#fa79ad",
      lemon: "#f6ce45"
    };

    const COLOR_WORDS = {
      berry: { zh: "紫色", en: "purple" },
      coral: { zh: "红色", en: "red" },
      mint: { zh: "绿色", en: "green" },
      ocean: { zh: "蓝色", en: "blue" },
      orange: { zh: "橙色", en: "orange" },
      moss: { zh: "绿色", en: "green" },
      navy: { zh: "深蓝色", en: "dark blue" },
      slate: { zh: "灰色", en: "gray" },
      pink: { zh: "粉色", en: "pink" },
      lemon: { zh: "黄色", en: "yellow" }
    };

    const TEACHING_LINES = {
      pick: { zh: "拿起瓶子", en: "Pick up the bottle", toddlerZh: "拿起", toddlerEn: "Pick up", voice: "pick-up", speakZh: "我们拿起这个瓶子。", speakEn: "Pick up the bottle." },
      emptyPick: { zh: "先选有水的瓶子", en: "Pick a bottle with water", toddlerZh: "有水的", toddlerEn: "With water", voice: "empty-pick", speakZh: "先选一个有水的瓶子。", speakEn: "Pick a bottle with water first." },
      sameBottle: { zh: "放下瓶子", en: "Put down the bottle", toddlerZh: "放下", toddlerEn: "Put down", voice: "put-down", speakZh: "我们把瓶子放下。", speakEn: "Put down the bottle." },
      differentColor: { zh: "颜色不同", en: "Different color", toddlerZh: "不一样", toddlerEn: "Different", voice: "different-color", speakZh: "这个颜色不一样，换一个试试。", speakEn: "This color is different. Try another one." },
      fullBottle: { zh: "瓶子满了", en: "The bottle is full", toddlerZh: "满了", toddlerEn: "Full", voice: "full-bottle", speakZh: "这个瓶子已经满了。", speakEn: "The bottle is full." },
      emptyBottle: { zh: "空瓶不能倒出", en: "The bottle is empty", toddlerZh: "空的", toddlerEn: "Empty", voice: "empty-bottle", speakZh: "这个瓶子是空的，换一个试试。", speakEn: "This bottle is empty. Try another one." },
      receiveOnly: { zh: "这个瓶子只能接水", en: "This bottle can only receive water", toddlerZh: "接水", toddlerEn: "Receive", voice: "receive-only", speakZh: "这个瓶子只能接水。", speakEn: "This bottle can only receive water." },
      pourOnly: { zh: "这个瓶子只能倒出", en: "This bottle can only pour out", toddlerZh: "倒出", toddlerEn: "Pour out", voice: "pour-only", speakZh: "这个瓶子只能往外倒。", speakEn: "This bottle can only pour out." },
      switchBottle: { zh: "换一个瓶子倒", en: "Choose another bottle", toddlerZh: "换一个", toddlerEn: "Another one", voice: "switch-bottle", speakZh: "换一个瓶子试试看。", speakEn: "Choose another bottle." },
      restart: { zh: "重新开始", en: "Restart", toddlerZh: "重来", toddlerEn: "Restart", voice: "restart", speakZh: "重新开始。", speakEn: "Restart." },
      undo: { zh: "撤销一步", en: "Undo one move", toddlerZh: "撤销", toddlerEn: "Undo", voice: "undo", speakZh: "撤销一步。", speakEn: "Undo one move." },
      openSettings: { zh: "打开设置", en: "Open settings", toddlerZh: "设置", toddlerEn: "Settings", voice: "open-settings", speakZh: "打开设置。", speakEn: "Open settings." },
      closeSettings: { zh: "关闭设置", en: "Close settings", toddlerZh: "关闭", toddlerEn: "Close", voice: "close-settings", speakZh: "关闭设置。", speakEn: "Close settings." },
      nextLevel: { zh: "进入下一关", en: "Next level", toddlerZh: "下一关", toddlerEn: "Next", voice: "next-level", speakZh: "进入下一关。", speakEn: "Next level." },
      teachingOn: { zh: "教学开启", en: "Teaching voice is on", toddlerZh: "教学开", toddlerEn: "Voice on", voice: "teaching-on", speakZh: "教学开启。", speakEn: "Teaching voice is on." },
      teachingOff: { zh: "教学朗读已关闭", en: "Teaching voice is off", toddlerZh: "教学关", toddlerEn: "Voice off", voice: "teaching-off", speakZh: "教学朗读已关闭。", speakEn: "Teaching voice is off." },
      languageZh: { zh: "切换到中文朗读", en: "Chinese voice", toddlerZh: "中文", toddlerEn: "Chinese", voice: "language-zh", speakZh: "切换到中文朗读。", speakEn: "Chinese voice." },
      languageEn: { zh: "切换到英文朗读", en: "English voice", toddlerZh: "英文", toddlerEn: "English", voice: "language-en", speakZh: "切换到英文朗读。", speakEn: "English voice." },
      languageBoth: { zh: "切换到双语朗读", en: "Bilingual voice", toddlerZh: "双语", toddlerEn: "Bilingual", voice: "language-both", speakZh: "切换到双语朗读。", speakEn: "Bilingual voice." },
      toddlerMode: { zh: "切换到幼宝模式", en: "Toddler mode", toddlerZh: "幼宝模式", toddlerEn: "Toddler mode", voice: "toddler-mode", speakZh: "切换到幼宝模式。", speakEn: "Toddler mode." },
      normalMode: { zh: "切换到常规模式", en: "Normal mode", toddlerZh: "常规模式", toddlerEn: "Normal mode", voice: "normal-mode", speakZh: "切换到常规模式。", speakEn: "Normal mode." },
      finish: { zh: "恭喜通关", en: "Congratulations", toddlerZh: "真棒", toddlerEn: "Great", voice: "finish", speakZh: "太棒了，完成了。", speakEn: "Great job. You did it." },
      timeUp: { zh: "时间到了", en: "Time is up", toddlerZh: "时间到", toddlerEn: "Time up", voice: "time-up", speakZh: "时间到了，没关系，我们再试一次。", speakEn: "Time is up. It's okay. Let's try again." }
    };

    const LEVELS = [
      {
        title: "暖身空瓶",
        tag: "经典",
        bottles: [
          ["navy", "navy", "mint", "mint"],
          ["mint", "mint", "navy", "navy"],
          ["coral", "coral", "orange", "orange"],
          ["orange", "orange", "coral", "coral"],
          ["ocean", "ocean", "berry", "berry"],
          ["berry", "berry", "ocean", "ocean"],
          [],
          []
        ]
      },
      {
        title: "分层液体",
        tag: "分层",
        bottles: [
          ["mint", "coral", "mint", "berry"],
          ["orange", "ocean", "berry", "orange"],
          ["coral", "slate", "ocean", "mint"],
          ["berry", "orange", "slate", "coral"],
          ["ocean", "mint", "coral", "slate"],
          ["slate", "berry", "orange", "ocean"],
          [],
          []
        ]
      },
      {
        title: "窄口瓶",
        tag: "容量 3",
        bottles: [
          { colors: ["ocean", "mint", "berry"], capacity: 3 },
          { colors: ["berry", "orange", "ocean"], capacity: 3 },
          { colors: ["orange", "mint", "orange"], capacity: 3 },
          { colors: ["mint", "berry", "ocean"], capacity: 3 },
          { colors: [], capacity: 3 },
          { colors: [], capacity: 3 }
        ]
      },
      {
        title: "单向收集",
        tag: "特殊瓶",
        bottles: [
          ["navy", "orange", "mint", "pink"],
          ["pink", "mint", "navy", "orange"],
          ["orange", "pink", "mint", "navy"],
          ["mint", "navy", "orange", "pink"],
          { colors: [], capacity: 4, receiveOnly: true },
          { colors: [], capacity: 4, receiveOnly: true },
          []
        ]
      },
      {
        title: "限时闪拌",
        tag: "限时",
        time: 90,
        bottles: [
          ["berry", "lemon", "ocean", "coral"],
          ["ocean", "berry", "mint", "lemon"],
          ["mint", "coral", "lemon", "berry"],
          ["lemon", "mint", "coral", "ocean"],
          ["coral", "ocean", "berry", "mint"],
          [],
          []
        ]
      }
    ];

    const HARD_LEVELS = [
      {
        title: "少空瓶开局",
        tag: "困难",
        targetMoves: 18,
        bottles: [
          ["navy", "navy", "mint", "berry"],
          ["mint", "mint", "berry", "navy"],
          ["berry", "berry", "navy", "mint"],
          ["coral", "coral", "orange", "orange"],
          ["orange", "orange", "coral", "coral"],
          []
        ]
      },
      {
        title: "容量混拌",
        tag: "混合容量",
        targetMoves: 24,
        bottles: [
          { colors: ["berry", "ocean", "mint"], capacity: 3 },
          { colors: ["ocean", "mint", "berry"], capacity: 3 },
          { colors: ["mint", "berry", "ocean"], capacity: 3 },
          ["coral", "lemon", "orange", "coral"],
          ["orange", "coral", "lemon", "orange"],
          ["lemon", "orange", "coral", "lemon"],
          { colors: [], capacity: 3 },
          []
        ]
      },
      {
        title: "单向陷阱",
        tag: "单向瓶",
        targetMoves: 28,
        bottles: [
          ["navy", "pink", "mint", "orange"],
          ["orange", "navy", "pink", "mint"],
          ["mint", "orange", "navy", "pink"],
          ["pink", "mint", "orange", "navy"],
          { colors: [], capacity: 4, receiveOnly: true },
          { colors: ["slate", "slate", "berry", "berry"], capacity: 4, pourOnly: true },
          ["berry", "berry", "slate", "slate"],
          []
        ]
      },
      {
        title: "五层大瓶",
        tag: "容量 5",
        targetMoves: 34,
        bottles: [
          { colors: ["berry", "ocean", "mint", "orange", "lemon"], capacity: 5 },
          { colors: ["lemon", "berry", "ocean", "mint", "orange"], capacity: 5 },
          { colors: ["orange", "lemon", "berry", "ocean", "mint"], capacity: 5 },
          { colors: ["mint", "orange", "lemon", "berry", "ocean"], capacity: 5 },
          { colors: ["ocean", "mint", "orange", "lemon", "berry"], capacity: 5 },
          { colors: [], capacity: 5 },
          { colors: [], capacity: 5 }
        ]
      },
      {
        title: "限时乱流",
        tag: "困难限时",
        targetMoves: 32,
        time: 75,
        bottles: [
          ["berry", "lemon", "ocean", "coral"],
          ["ocean", "mint", "berry", "lemon"],
          ["mint", "coral", "lemon", "berry"],
          ["lemon", "berry", "mint", "ocean"],
          ["coral", "ocean", "coral", "mint"],
          [],
          []
        ]
      },
      {
        title: "终极闪拌",
        tag: "综合挑战",
        targetMoves: 20,
        time: 90,
        bottles: [
          ["navy", "orange", "mint", "pink"],
          ["pink", "slate", "navy", "orange"],
          ["orange", "pink", "mint", "navy"],
          ["mint", "navy", "slate", "pink"],
          ["slate", "orange", "slate", "mint"],
          { colors: [], capacity: 4, receiveOnly: true },
          []
        ]
      }
    ];

    const MODES = {
      easy: { label: "简单", levels: LEVELS },
      hard: { label: "困难", levels: HARD_LEVELS }
    };

    function validateLevel(level) {
      const counts = new Map();
      const capacities = new Set();
      level.bottles.map(normalizeBottle).forEach((bottle) => {
        capacities.add(bottle.capacity);
        bottle.colors.forEach((color) => {
          counts.set(color, (counts.get(color) || 0) + 1);
        });
      });
      const invalid = [...counts.entries()].filter(([, count]) => !capacities.has(count));
      if (invalid.length) {
        console.warn("关卡颜色数量可能不可通关：", level.title, invalid);
      }
    }

    const state = {
      mode: "easy",
      levelIndex: 0,
      bottles: [],
      selected: -1,
      moves: 0,
      history: [],
      layouts: [],
      animation: null,
      particles: [],
      celebration: null,
      finale: null,
      toastUntil: 0,
      message: "",
      completed: false,
      failed: false,
      settingsOpen: false,
      settingsTab: "game",
      resultOpen: false,
      resultAutoTimer: null,
      musicOn: false,
      masterVolume: 0.85,
      musicVolume: 0.7,
      sfxVolume: 1.2,
      voiceVolume: 1,
      sfx: false,
      teaching: false,
      speechOn: false,
      speechMode: "both",
      teachingStyle: "normal",
      teachingAudio: null,
      musicTrack: null,
      bestStars: {},
      bestMoves: {},
      unlocked: { easy: LEVELS.length - 1, hard: 0 },
      hint: null,
      guideStep: 0,
      audio: null,
      timerStartedAt: 0,
      timeLeft: null,
      timerText: "",
      lastFrame: performance.now()
    };

    function activeMode() {
      return MODES[state.mode] || MODES.easy;
    }

    function activeLevels() {
      return activeMode().levels;
    }

    function activeLevel() {
      return activeLevels()[state.levelIndex];
    }

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    function rotatedBottleBounds(x, y, width, height, angle) {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const points = [
        { x: -width / 2, y: 0 },
        { x: width / 2, y: 0 },
        { x: -width / 2, y: height },
        { x: width / 2, y: height }
      ].map((point) => ({
        x: x + point.x * cos - point.y * sin,
        y: y + point.x * sin + point.y * cos
      }));

      return points.reduce(
        (bounds, point) => ({
          minX: Math.min(bounds.minX, point.x),
          maxX: Math.max(bounds.maxX, point.x),
          minY: Math.min(bounds.minY, point.y),
          maxY: Math.max(bounds.maxY, point.y)
        }),
        { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }
      );
    }

    function keepPourBottleInView(x, y, width, height, angle) {
      const margin = Math.min(28, Math.max(16, canvas.clientWidth * 0.045));
      const bottomMargin = 10;
      const bounds = rotatedBottleBounds(x, y, width, height, angle);
      let dx = 0;
      let dy = 0;

      if (bounds.minX < margin) dx += margin - bounds.minX;
      if (bounds.maxX + dx > canvas.clientWidth - margin) dx -= bounds.maxX + dx - (canvas.clientWidth - margin);
      if (bounds.minY < margin) dy += margin - bounds.minY;
      if (bounds.maxY + dy > canvas.clientHeight - bottomMargin) {
        dy -= bounds.maxY + dy - (canvas.clientHeight - bottomMargin);
      }

      return { x: x + dx, y: y + dy };
    }

    function levelKey(index = state.levelIndex, mode = state.mode) {
      return `${mode}-${index}`;
    }

    function maxUnlocked(mode = state.mode) {
      const levels = MODES[mode].levels;
      const saved = Number(state.unlocked[mode]);
      return clamp(Number.isFinite(saved) ? saved : 0, 0, levels.length - 1);
    }

    function isLevelUnlocked(index, mode = state.mode) {
      if (mode === "easy") return true;
      return index <= maxUnlocked(mode);
    }

    function unlockNextLevel() {
      const next = state.levelIndex + 1;
      if (next < activeLevels().length) {
        state.unlocked[state.mode] = Math.max(maxUnlocked(), next);
      }
    }

    function hideResult() {
      state.resultOpen = false;
      if (state.resultAutoTimer) {
        clearTimeout(state.resultAutoTimer);
        state.resultAutoTimer = null;
      }
      updateHud();
    }

    function savePreferences() {
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify({
          mode: state.mode,
          levelIndex: state.levelIndex,
          musicOn: false,
          sfx: state.sfx,
          teaching: state.teaching,
          speechOn: state.speechOn,
          speechMode: state.speechMode,
          teachingStyle: state.teachingStyle,
          masterVolume: state.masterVolume,
          musicVolume: state.musicVolume,
          sfxVolume: state.sfxVolume,
          voiceVolume: state.voiceVolume,
          bestStars: state.bestStars,
          bestMoves: state.bestMoves,
          unlocked: state.unlocked
        }));
      } catch (error) {
        console.warn("设置保存失败", error);
      }
    }

    function loadPreferences() {
      try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return;
        const saved = JSON.parse(raw);
        state.musicOn = false;
        if (MODES[saved.mode]) state.mode = saved.mode;
        const levels = activeLevels();
        state.levelIndex = clamp(Number(saved.levelIndex) || 0, 0, levels.length - 1);
        state.sfx = Boolean(saved.sfx);
        state.teaching = Boolean(saved.teaching);
        state.speechOn = state.teaching && Boolean(saved.speechOn);
        if (["zh", "en", "both"].includes(saved.speechMode)) state.speechMode = saved.speechMode;
        if (["normal", "toddler"].includes(saved.teachingStyle)) state.teachingStyle = saved.teachingStyle;
        if (Number.isFinite(Number(saved.masterVolume))) state.masterVolume = clamp(Number(saved.masterVolume), 0, 3);
        if (Number.isFinite(Number(saved.musicVolume))) state.musicVolume = clamp(Number(saved.musicVolume), 0, 1.5);
        if (Number.isFinite(Number(saved.sfxVolume))) state.sfxVolume = clamp(Number(saved.sfxVolume), 0, 2);
        if (Number.isFinite(Number(saved.voiceVolume))) state.voiceVolume = clamp(Number(saved.voiceVolume), 0, 1.5);
        state.bestStars = saved.bestStars && typeof saved.bestStars === "object" ? saved.bestStars : {};
        state.bestMoves = saved.bestMoves && typeof saved.bestMoves === "object" ? saved.bestMoves : {};
        if (saved.unlocked && typeof saved.unlocked === "object") {
          state.unlocked.easy = LEVELS.length - 1;
          state.unlocked.hard = clamp(Number(saved.unlocked.hard) || 0, 0, HARD_LEVELS.length - 1);
        }
        if (!isLevelUnlocked(state.levelIndex)) state.levelIndex = maxUnlocked();
      } catch (error) {
        console.warn("设置读取失败", error);
      }
    }

    function normalizeBottle(input) {
      if (Array.isArray(input)) {
        return { colors: [...input], capacity: 4, receiveOnly: false, pourOnly: false };
      }
      return {
        colors: [...(input.colors || [])],
        capacity: input.capacity || 4,
        receiveOnly: Boolean(input.receiveOnly),
        pourOnly: Boolean(input.pourOnly)
      };
    }

    function loadLevel(index) {
      const levels = activeLevels();
      const targetIndex = Math.max(0, Math.min(index, levels.length - 1));
      if (!isLevelUnlocked(targetIndex)) {
        showToast("先通过前面的关卡");
        return;
      }
      const level = levels[targetIndex];
      validateLevel(level);
      stopWaterNoise(true);
      if (state.resultAutoTimer) clearTimeout(state.resultAutoTimer);
      state.resultAutoTimer = null;
      state.resultOpen = false;
      state.levelIndex = targetIndex;
      state.bottles = level.bottles.map(normalizeBottle);
      state.selected = -1;
      state.moves = 0;
      state.history = [];
      state.animation = null;
      state.particles = [];
      state.celebration = null;
      state.finale = null;
      state.completed = false;
      state.failed = false;
      state.timerStartedAt = performance.now();
      state.timeLeft = level.time || null;
      state.timerText = "";
      state.hint = null;
      showToast(level.title);
      updateHud();
      savePreferences();
    }

    function snapshot() {
      return JSON.stringify({
        bottles: state.bottles,
        moves: state.moves,
        timeLeft: state.timeLeft,
        timerStartedAt: state.timerStartedAt
      });
    }

    function restore(data) {
      const parsed = JSON.parse(data);
      state.bottles = parsed.bottles;
      state.moves = parsed.moves;
      state.timeLeft = parsed.timeLeft;
      state.timerStartedAt = parsed.timerStartedAt;
      state.selected = -1;
      state.completed = false;
      state.failed = false;
      state.animation = null;
      state.celebration = null;
      state.finale = null;
      state.timerText = "";
      state.hint = null;
      updateHud();
    }

    function formatTimer(level) {
      return level.time ? `剩余 ${Math.max(0, Math.ceil(state.timeLeft || 0))}s` : "不限时";
    }

    function updateHud() {
      const level = activeLevel();
      const timerText = formatTimer(level);
      statusEl.textContent = `${activeMode().label} ${state.levelIndex + 1}`;
      movesEl.textContent = level.targetMoves ? `步数 ${state.moves}/${level.targetMoves}` : `步数 ${state.moves}`;
      timerEl.textContent = timerText;
      state.timerText = timerText;
      ruleTagEl.textContent = level.tag;
      undoButton.disabled = state.history.length === 0 || Boolean(state.animation);
      hintButton.disabled = Boolean(state.animation) || state.completed || state.failed;
      musicButton.textContent = state.musicOn ? "音乐开" : "音乐关";
      soundButton.textContent = state.sfx ? "音效开" : "音效关";
      teachingButton.textContent = state.teaching ? "教学开" : "教学关";
      musicButton.classList.toggle("is-on", state.musicOn);
      musicButton.classList.toggle("is-off", !state.musicOn);
      soundButton.classList.toggle("is-on", state.sfx);
      soundButton.classList.toggle("is-off", !state.sfx);
      toolbarMusicButton.classList.toggle("is-on", state.musicOn);
      toolbarMusicButton.classList.toggle("is-off", !state.musicOn);
      toolbarMusicButton.setAttribute("aria-label", state.musicOn ? "关闭背景音乐" : "开启背景音乐");
      toolbarMusicButton.title = state.musicOn ? "关闭背景音乐" : "开启背景音乐";
      toolbarSoundButton.classList.toggle("is-on", state.sfx);
      toolbarSoundButton.classList.toggle("is-off", !state.sfx);
      toolbarSoundButton.setAttribute("aria-label", state.sfx ? "关闭倒水音效" : "开启倒水音效");
      toolbarSoundButton.title = state.sfx ? "关闭倒水音效" : "开启倒水音效";
      teachingButton.classList.toggle("is-on", state.teaching);
      teachingButton.classList.toggle("is-off", !state.teaching);
      masterVolumeInput.value = Math.round(state.masterVolume * 100);
      masterVolumeValue.textContent = `${Math.round(state.masterVolume * 100)}%`;
      musicVolumeInput.value = Math.round(state.musicVolume * 100);
      musicVolumeValue.textContent = `${Math.round(state.musicVolume * 100)}%`;
      sfxVolumeInput.value = Math.round(state.sfxVolume * 100);
      sfxVolumeValue.textContent = `${Math.round(state.sfxVolume * 100)}%`;
      voiceVolumeInput.value = Math.round(state.voiceVolume * 100);
      voiceVolumeValue.textContent = `${Math.round(state.voiceVolume * 100)}%`;
      updateAudioDebug();
      easyModeButton.classList.toggle("active", state.mode === "easy");
      hardModeButton.classList.toggle("active", state.mode === "hard");
      speechZhButton.classList.toggle("active", state.speechMode === "zh");
      speechEnButton.classList.toggle("active", state.speechMode === "en");
      speechBothButton.classList.toggle("active", state.speechMode === "both");
      teachingToddlerButton.classList.toggle("active", state.teachingStyle === "toddler");
      teachingNormalButton.classList.toggle("active", state.teachingStyle === "normal");
      settingsTabGame.classList.toggle("active", state.settingsTab === "game");
      settingsTabSound.classList.toggle("active", state.settingsTab === "sound");
      settingsTabTeaching.classList.toggle("active", state.settingsTab === "teaching");
      settingsSections.forEach((section) => {
        section.classList.toggle("active", section.dataset.settingsSection === state.settingsTab);
      });
      renderLevelGrid();
      settingsPanel.classList.toggle("open", state.settingsOpen);
      settingsPanel.setAttribute("aria-hidden", state.settingsOpen ? "false" : "true");
      resultPanel.classList.toggle("open", state.resultOpen);
      resultPanel.setAttribute("aria-hidden", state.resultOpen ? "false" : "true");
    }

    function renderLevelGrid() {
      if (!levelGrid) return;
      const levels = activeLevels();
      if (levelGrid.dataset.mode === state.mode && Number(levelGrid.dataset.count) === levels.length) {
        [...levelGrid.children].forEach((button, index) => {
          const stars = state.bestStars[levelKey(index)] || 0;
          const locked = !isLevelUnlocked(index);
          button.textContent = locked ? `${index + 1} 锁` : stars ? `${index + 1} ${"★".repeat(stars)}` : `${index + 1}`;
          button.classList.toggle("active", index === state.levelIndex);
          button.classList.toggle("locked", locked);
          button.disabled = locked;
        });
        return;
      }
      levelGrid.dataset.mode = state.mode;
      levelGrid.dataset.count = String(levels.length);
      levelGrid.innerHTML = "";
      levels.forEach((_, index) => {
        const button = document.createElement("button");
        button.type = "button";
        const stars = state.bestStars[levelKey(index)] || 0;
        const locked = !isLevelUnlocked(index);
        button.textContent = locked ? `${index + 1} 锁` : stars ? `${index + 1} ${"★".repeat(stars)}` : `${index + 1}`;
        button.disabled = locked;
        button.classList.toggle("locked", locked);
        button.addEventListener("click", () => {
          if (!isLevelUnlocked(index)) {
            showToast("先通过前面的关卡");
            return;
          }
          loadLevel(index);
          showToast(`${activeMode().label} ${index + 1}`);
          savePreferences();
        });
        levelGrid.appendChild(button);
      });
      [...levelGrid.children].forEach((button, index) => {
        button.classList.toggle("active", index === state.levelIndex);
      });
    }

    function showToast(message) {
      state.message = message;
      state.toastUntil = performance.now() + 1500;
      toastEl.textContent = message;
      toastEl.classList.add("show");
    }

    function scoreStars(level) {
      if (!level.targetMoves) return 3;
      const extraMoves = state.moves - level.targetMoves;
      if (extraMoves <= 0) return 3;
      if (extraMoves <= 3) return 2;
      return 1;
    }

    function starText(stars) {
      return "★".repeat(stars) + "☆".repeat(3 - stars);
    }

    function bottleLabel(index) {
      return `${index + 1}号瓶`;
    }

    function recordBest(stars) {
      const key = levelKey();
      state.bestStars[key] = Math.max(state.bestStars[key] || 0, stars);
      state.bestMoves[key] = Math.min(state.bestMoves[key] || Infinity, state.moves);
    }

    function showResult(stars, hasNextLevel) {
      const best = state.bestMoves[levelKey()] || state.moves;
      state.resultOpen = true;
      resultTitle.textContent = hasNextLevel ? "通关啦" : "恭喜通关";
      resultStars.textContent = starText(stars);
      resultMoves.textContent = `本关 ${state.moves} 步`;
      resultBest.textContent = `最佳 ${best} 步`;
      resultNextButton.textContent = hasNextLevel ? "下一关" : "完成";
      resultNextButton.disabled = false;
      updateHud();
      if (hasNextLevel) {
        state.resultAutoTimer = setTimeout(() => {
          if (state.completed && !state.animation) {
            loadLevel(state.levelIndex + 1);
          }
        }, 2600);
      }
    }

    function isBottleSolved(bottle) {
      return bottle.colors.length === bottle.capacity && bottle.colors.every((color) => color === bottle.colors[0]);
    }

    function findHintMove() {
      let best = null;
      state.bottles.forEach((source, from) => {
        if (!source.colors.length || source.receiveOnly) return;
        const sourceSolved = isBottleSolved(source);
        state.bottles.forEach((target, to) => {
          const move = canPour(from, to);
          if (!move.ok) return;
          const targetTop = target.colors[target.colors.length - 1];
          const targetAfter = target.colors.length + move.amount;
          let score = 0;
          if (targetTop === move.color) score += 30;
          if (!targetTop) score += 8;
          if (targetAfter === target.capacity) score += 26;
          if (source.colors.length === move.amount) score += 12;
          if (sourceSolved) score -= 35;
          if (target.receiveOnly) score += 6;
          if (!best || score > best.score) best = { from, to, move, score };
        });
      });
      return best;
    }

    function showHint() {
      if (state.animation || state.completed || state.failed) return;
      const hint = findHintMove();
      if (!hint) {
        showToast("这一步没有可倒的瓶子，试试重开");
        return;
      }
      state.selected = -1;
      state.hint = { from: hint.from, to: hint.to, until: performance.now() + 2600 };
      showToast(`提示：${bottleLabel(hint.from)} → ${bottleLabel(hint.to)}`);
    }

    function hasSeenGuide() {
      try {
        return localStorage.getItem(GUIDE_KEY) === "1";
      } catch (error) {
        return true;
      }
    }

    function startFirstGuide() {
      if (hasSeenGuide()) return;
      state.guideStep = 1;
      setTimeout(() => {
        if (state.guideStep === 1 && !state.completed) showToast("先点一个有水的瓶子");
      }, 1900);
    }

    function completeFirstGuide() {
      state.guideStep = 3;
      try {
        localStorage.setItem(GUIDE_KEY, "1");
      } catch (error) {
        // Local storage can be unavailable in some private browsing modes.
      }
    }

    function showTeaching(line) {
      if (!state.teaching || !line) return;
      const text = teachingDisplayText(line);
      state.message = text;
      state.toastUntil = performance.now() + 2400;
      toastEl.textContent = text;
      toastEl.classList.add("show");
      speakTeaching(line);
    }

    function teachingDisplayText(line) {
      const zh = state.teachingStyle === "toddler" ? (line.toddlerZh || line.zh) : line.zh;
      const en = state.teachingStyle === "toddler" ? (line.toddlerEn || line.en) : line.en;
      if (state.speechMode === "zh") return zh;
      if (state.speechMode === "en") return en;
      return `${zh}\n${en}`;
    }

    function speakTeaching(line) {
      if (!state.teaching || !state.speechOn) return;
      stopTeachingAudio();
      if (line.voice && playTeachingVoice(line)) return;
      speakTeachingWithSynthesis(line);
    }

    function playTeachingVoice(line) {
      const queue = [];
      const style = state.teachingStyle === "toddler" ? "toddler" : "mom";
      if (state.speechMode === "zh" || state.speechMode === "both") {
        queue.push(`assets/voice/${style}/zh/${line.voice}.mp3`);
      }
      if (state.speechMode === "en" || state.speechMode === "both") {
        queue.push(`assets/voice/${style}/en/${line.voice}.mp3`);
      }
      if (!queue.length) return false;
      let index = 0;
      let failed = false;
      const playNext = () => {
        if (failed || index >= queue.length || !state.teaching || !state.speechOn) return;
        const audio = new Audio(queue[index]);
        index += 1;
        audio.preload = "auto";
        audio.volume = currentTeachingVoiceVolume();
        state.teachingAudio = audio;
        audio.addEventListener("ended", () => {
          if (state.teachingAudio === audio) state.teachingAudio = null;
          if (index < queue.length) setTimeout(playNext, 180);
        });
        audio.addEventListener("error", () => {
          failed = true;
          if (state.teachingAudio === audio) state.teachingAudio = null;
          speakTeachingWithSynthesis(line);
        }, { once: true });
        const promise = audio.play();
        if (promise && typeof promise.catch === "function") {
          promise.catch(() => {
            failed = true;
            if (state.teachingAudio === audio) state.teachingAudio = null;
            speakTeachingWithSynthesis(line);
          });
        }
      };
      playNext();
      return true;
    }

    function stopTeachingAudio() {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      if (!state.teachingAudio) return;
      state.teachingAudio.pause();
      state.teachingAudio.currentTime = 0;
      state.teachingAudio = null;
    }

    function currentTeachingVoiceVolume() {
      return Math.min(1, state.masterVolume * state.voiceVolume);
    }

    function speakTeachingWithSynthesis(line) {
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const volume = currentTeachingVoiceVolume();
      const queue = [];
      if (state.speechMode === "zh" || state.speechMode === "both") {
        queue.push({ text: line.speakZh || line.zh, lang: "zh-CN", rate: 0.82, pitch: 1.16 });
      }
      if (state.speechMode === "en" || state.speechMode === "both") {
        queue.push({ text: line.speakEn || line.en, lang: "en-US", rate: 0.86, pitch: 1.08 });
      }
      queue.forEach((item) => {
        const utterance = new SpeechSynthesisUtterance(item.text);
        utterance.lang = item.lang;
        utterance.rate = item.rate;
        utterance.pitch = item.pitch;
        utterance.volume = volume;
        const voice = preferredVoice(item.lang);
        if (voice) utterance.voice = voice;
        window.speechSynthesis.speak(utterance);
      });
    }

    function preferredVoice(lang) {
      const voices = window.speechSynthesis.getVoices();
      const sameLang = voices.filter((voice) => voice.lang && voice.lang.toLowerCase().startsWith(lang.slice(0, 2).toLowerCase()));
      const naturalNames = ["samantha", "ting-ting", "mei-jia", "sin-ji", "google", "microsoft", "premium", "natural"];
      return sameLang.find((voice) => naturalNames.some((name) => voice.name.toLowerCase().includes(name))) || sameLang[0] || null;
    }

    if ("speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }

    function pourLine(colorKey) {
      const words = COLOR_WORDS[colorKey] || { zh: "这个颜色", en: "this color" };
      const voice = `pour-${colorVoiceSlug(colorKey)}`;
      return {
        zh: `倒入${words.zh}`,
        en: `Pour in ${words.en}`,
        toddlerZh: words.zh,
        toddlerEn: words.en.charAt(0).toUpperCase() + words.en.slice(1),
        voice,
        speakZh: `我们把${words.zh}倒入瓶子里。`,
        speakEn: `Pour ${words.en} into the bottle.`
      };
    }

    function colorVoiceSlug(colorKey) {
      return {
        berry: "purple",
        coral: "red",
        mint: "green",
        moss: "green",
        ocean: "blue",
        orange: "orange",
        navy: "dark-blue",
        slate: "gray",
        pink: "pink",
        lemon: "yellow"
      }[colorKey] || "green";
    }

    function teachingLineForReason(reason) {
      if (reason.includes("空瓶")) return TEACHING_LINES.emptyBottle;
      if (reason.includes("满")) return TEACHING_LINES.fullBottle;
      if (reason.includes("同色")) return TEACHING_LINES.differentColor;
      if (reason.includes("只能接水")) return TEACHING_LINES.receiveOnly;
      if (reason.includes("只能倒出")) return TEACHING_LINES.pourOnly;
      if (reason.includes("换一个")) return TEACHING_LINES.switchBottle;
      return { zh: reason, en: "Try another move" };
    }

    function hideToastIfNeeded(now) {
      if (now > state.toastUntil) {
        toastEl.classList.remove("show");
      }
    }

    function syncAppHeight() {
      const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      document.documentElement.style.setProperty("--app-height", `${Math.max(1, Math.floor(viewportHeight))}px`);
    }

    function resizeCanvas() {
      syncAppHeight();
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * ratio));
      canvas.height = Math.max(1, Math.floor(rect.height * ratio));
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      computeLayout();
    }

    function computeLayout() {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const count = state.bottles.length || 8;
      const columns = count > 7 ? 4 : 3;
      const rows = Math.ceil(count / columns);
      const gapX = width / columns;
      const bottleWidth = Math.min(58, Math.max(44, gapX * 0.5));
      const bottleHeight = Math.min(150, Math.max(118, height / rows * 0.58));
      const top = rows === 1 ? height * 0.28 : height * 0.14;
      const rowGap = rows === 1 ? 0 : Math.min(185, height / rows);

      state.layouts = state.bottles.map((_, index) => {
        const row = Math.floor(index / columns);
        const col = index % columns;
        const used = row === rows - 1 ? count - row * columns : columns;
        const offset = (columns - used) * gapX * 0.5;
        return {
          x: offset + gapX * col + gapX / 2,
          y: top + row * rowGap,
          width: bottleWidth,
          height: bottleHeight,
          shake: 0
        };
      });
    }

    function roundedRectPath(x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
    }

    function drawBottle(bottle, layout, index, renderColors, options = {}) {
      const selected = state.selected === index;
      const invalidShake = layout.shake ? Math.sin(performance.now() / 26) * layout.shake : 0;
      const lift = selected ? -16 : 0;
      const celebration = getBottleCelebration(index);
      const x = layout.x + invalidShake + celebration.x;
      const y = layout.y + lift + celebration.y;
      const w = layout.width;
      const h = layout.height;
      const neckW = w * 0.48;
      const neckH = 16;
      const bodyX = x - w / 2;
      const bodyY = y + neckH;
      const bodyH = h - neckH;
      const innerPad = 5;
      const innerX = bodyX + innerPad;
      const innerY = bodyY + 10;
      const innerW = w - innerPad * 2;
      const innerH = bodyH - 16;
      const unitH = innerH / bottle.capacity;

      ctx.save();
      if (celebration.angle) {
        ctx.translate(x, y + h * 0.55);
        ctx.rotate(celebration.angle);
        ctx.translate(-x, -(y + h * 0.55));
      }

      if (selected) {
        const pulse = 0.55 + Math.sin(performance.now() / 150) * 0.12;
        ctx.save();
        ctx.globalAlpha = pulse;
        ctx.fillStyle = "rgba(255, 246, 139, 0.34)";
        ctx.beginPath();
        ctx.ellipse(x, y + h + 8, w * 0.6, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.62)";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }

      if (layout.shake) {
        const alertAlpha = Math.min(0.52, 0.14 + layout.shake / 24);
        ctx.save();
        ctx.globalAlpha = alertAlpha;
        ctx.strokeStyle = "#fff2a8";
        ctx.lineWidth = 3;
        roundedRectPath(bodyX - 7, bodyY - 7, w + 14, bodyH + 14, 18);
        ctx.stroke();
        ctx.strokeStyle = "rgba(255, 94, 138, 0.48)";
        ctx.lineWidth = 5;
        roundedRectPath(bodyX - 10, bodyY - 10, w + 20, bodyH + 20, 20);
        ctx.stroke();
        ctx.restore();
      }

      ctx.shadowColor = selected ? "rgba(255,255,255,0.9)" : "rgba(80,40,80,0.18)";
      ctx.shadowBlur = selected ? 18 : 8;
      ctx.shadowOffsetY = selected ? 0 : 8;

      roundedRectPath(bodyX, bodyY, w, bodyH, 13);
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.fill();
      ctx.lineWidth = selected ? 4 : 3;
      ctx.strokeStyle = selected ? "#fff7b8" : "rgba(255,255,255,0.94)";
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x - neckW / 2, y + neckH + 2);
      ctx.lineTo(x - neckW / 2, y + 5);
      ctx.quadraticCurveTo(x - neckW / 2, y, x - neckW / 2 + 5, y);
      ctx.lineTo(x + neckW / 2 - 5, y);
      ctx.quadraticCurveTo(x + neckW / 2, y, x + neckW / 2, y + 5);
      ctx.lineTo(x + neckW / 2, y + neckH + 2);
      ctx.strokeStyle = selected ? "#fff7b8" : "rgba(255,255,255,0.94)";
      ctx.lineWidth = selected ? 4 : 3;
      ctx.stroke();

      ctx.save();
      roundedRectPath(innerX, innerY, innerW, innerH, 8);
      ctx.clip();
      const colors = renderColors || bottle.colors;
      const drainUnits = Math.max(0, options.drainUnits || 0);
      colors.forEach((colorKey, layerIndex) => {
        if (!colorKey) return;
        const unitsAbove = colors.length - 1 - layerIndex;
        const visibleUnits = Math.max(0, Math.min(1, 1 - Math.max(0, drainUnits - unitsAbove)));
        if (visibleUnits <= 0) return;
        const fillH = unitH * visibleUnits;
        const fillY = innerY + innerH - unitH * layerIndex - fillH;
        ctx.fillStyle = COLORS[colorKey] || colorKey;
        ctx.fillRect(innerX, fillY + 1, innerW, fillH + 1);
        ctx.fillStyle = "rgba(255,255,255,0.13)";
        ctx.fillRect(innerX, fillY + 1, innerW, Math.min(4, fillH));
      });
      if (options.extraFill && options.extraFill.units > 0) {
        const addedUnits = Math.min(options.extraFill.units, bottle.capacity - colors.length);
        const fillH = unitH * addedUnits;
        const fillY = innerY + innerH - unitH * colors.length - fillH;
        ctx.fillStyle = COLORS[options.extraFill.color] || options.extraFill.color;
        ctx.fillRect(innerX, fillY + 1, innerW, fillH + 1);
        ctx.fillStyle = "rgba(255,255,255,0.16)";
        for (let line = 0; line < Math.ceil(addedUnits); line += 1) {
          const yLine = innerY + innerH - unitH * (colors.length + line + 1);
          if (yLine >= fillY - 1 && yLine <= fillY + fillH) {
            ctx.fillRect(innerX, yLine + 1, innerW, 4);
          }
        }
        ctx.save();
        ctx.globalAlpha = 0.22;
        ctx.fillStyle = "#fff";
        const waveY = fillY + 2 + Math.sin(performance.now() / 120 + index) * 1.6;
        ctx.beginPath();
        ctx.moveTo(innerX, waveY + 3);
        ctx.quadraticCurveTo(innerX + innerW * 0.25, waveY - 3, innerX + innerW * 0.5, waveY + 2);
        ctx.quadraticCurveTo(innerX + innerW * 0.75, waveY + 7, innerX + innerW, waveY + 1);
        ctx.lineTo(innerX + innerW, waveY + 8);
        ctx.lineTo(innerX, waveY + 8);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();

      ctx.beginPath();
      ctx.moveTo(bodyX + 11, bodyY + 18);
      ctx.lineTo(bodyX + 11, bodyY + 44);
      ctx.strokeStyle = "rgba(255,255,255,0.62)";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.stroke();

      if (!options.hideBadge) {
        if (bottle.receiveOnly) {
          drawBadge(x, bodyY + bodyH + 17, "入");
        }
        if (bottle.pourOnly) {
          drawBadge(x, bodyY + bodyH + 17, "出");
        }
        if (bottle.capacity < 4) {
          drawBadge(x, bodyY + bodyH + 17, "窄");
        }
      }
      ctx.restore();
    }

    function getBottleCelebration(index) {
      const celebration = state.celebration;
      if (!celebration || index < 0) return { x: 0, y: 0, angle: 0 };
      const bottle = state.bottles[index];
      if (!bottle || bottle.colors.length !== bottle.capacity) return { x: 0, y: 0, angle: 0 };
      const elapsed = performance.now() - celebration.startedAt;
      if (elapsed < 0 || elapsed > celebration.duration) return { x: 0, y: 0, angle: 0 };
      const progress = elapsed / celebration.duration;
      const envelope = Math.sin(Math.PI * progress);
      const wave = Math.sin(elapsed / 24 + index * 1.7);
      return {
        x: wave * 7 * envelope,
        y: -Math.abs(Math.sin(elapsed / 55 + index)) * 10 * envelope,
        angle: wave * 0.12 * envelope
      };
    }

    function drawBadge(x, y, text) {
      ctx.save();
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.strokeStyle = "rgba(36,48,68,0.18)";
      ctx.lineWidth = 1;
      roundedRectPath(x - 13, y - 10, 26, 20, 7);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#197dad";
      ctx.font = "800 12px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, x, y + 1);
      ctx.restore();
    }

    function drawHintMarkers(now) {
      if (!state.hint || now > state.hint.until) {
        state.hint = null;
        return;
      }
      const pulse = 0.5 + Math.sin(now / 120) * 0.5;
      [
        { index: state.hint.from, text: "拿", color: "#ff6fa6" },
        { index: state.hint.to, text: "倒", color: "#42bdf2" }
      ].forEach((marker) => {
        const layout = state.layouts[marker.index];
        if (!layout) return;
        ctx.save();
        ctx.translate(layout.x, layout.y + layout.height * 0.45);
        ctx.strokeStyle = marker.color;
        ctx.lineWidth = 4 + pulse * 2;
        ctx.globalAlpha = 0.72;
        roundedRectPath(-layout.width * 0.64, -layout.height * 0.08, layout.width * 1.28, layout.height * 0.72, 18);
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.fillStyle = marker.color;
        ctx.font = "900 15px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(marker.text, 0, -layout.height * 0.18);
        ctx.restore();
      });
    }

    function drawPourAnimation() {
      if (!state.animation) return;
      const anim = state.animation;
      const source = state.layouts[anim.from];
      const target = state.layouts[anim.to];
      const raw = Math.min(1, anim.elapsed / anim.duration);
      const travel = easeInOut(Math.min(1, raw / 0.28));
      const pour = easeInOut(Math.max(0, Math.min(1, (raw - 0.2) / 0.56)));
      const returnBack = easeInOut(Math.max(0, Math.min(1, (raw - 0.78) / 0.22)));
      const flowProgress = Math.max(0, Math.min(1, (raw - 0.24) / 0.54));
      const liquidProgress = easeInOut(flowProgress);
      const scale = 0.74;
      const bottle = state.bottles[anim.from];
      const animatedWidth = source.width * scale;
      const animatedHeight = source.height * scale;
      const edgeZone = Math.max(target.width * 1.7, canvas.clientWidth * 0.22);
      const leftEdgePull = clamp((edgeZone - target.x) / edgeZone, 0, 1);
      const rightEdgePull = clamp((target.x - (canvas.clientWidth - edgeZone)) / edgeZone, 0, 1);
      const edgePull = Math.max(leftEdgePull, rightEdgePull);
      const sideGap = target.width * (1.55 + edgePull * 0.28);
      const perchBaseY = clamp(target.y - target.height * 0.62, 22, canvas.clientHeight - target.height * 1.12);
      let defaultSide = source.x <= target.x ? -1 : 1;
      if (leftEdgePull > 0.35) defaultSide = 1;
      if (rightEdgePull > 0.35) defaultSide = -1;
      const safeXMin = animatedWidth * 0.92;
      const safeXMax = canvas.clientWidth - animatedWidth * 0.92;
      const sideChoices = [-1, 1].map((side) => {
        const x = clamp(target.x + side * sideGap, safeXMin, safeXMax);
        const overlapPenalty = state.layouts.reduce((score, layout, index) => {
          if (index === anim.from || index === anim.to) return score;
          const dx = Math.abs(layout.x - x);
          const dy = Math.abs(layout.y - perchBaseY);
          if (dx < source.width * 1.25 && dy < source.height * 1.05) return score + 10;
          if (dx < source.width * 1.6 && dy < source.height * 1.25) return score + 3;
          return score;
        }, 0);
        const edgePenalty = x < source.width * 1.15 || x > canvas.clientWidth - source.width * 1.15 ? 6 : 0;
        const outwardEdgePenalty = leftEdgePull > 0.35 && side < 0 ? 12 : rightEdgePull > 0.35 && side > 0 ? 12 : 0;
        const preferencePenalty = side === defaultSide ? 0 : 1.5;
        return { side, x, score: overlapPenalty + edgePenalty + outwardEdgePenalty + preferencePenalty };
      }).sort((a, b) => a.score - b.score);
      const bottleSide = sideChoices[0].side;
      const angle = -bottleSide * (0.72 - edgePull * 0.04) * pour * (1 - returnBack);
      const spoutLocalX = -bottleSide * animatedWidth * 0.48;
      const spoutLocalY = animatedHeight * 0.15;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const spoutOffsetX = spoutLocalX * cos - spoutLocalY * sin;
      const spoutOffsetY = spoutLocalX * sin + spoutLocalY * cos;
      const desiredSpoutX = clamp(
        target.x + bottleSide * target.width * 0.38,
        target.width * 0.42,
        canvas.clientWidth - target.width * 0.42
      );
      const idealPerchX = desiredSpoutX - spoutOffsetX;
      const idealPerchY = perchBaseY;
      const perchedPosition = keepPourBottleInView(
        clamp(idealPerchX, safeXMin, safeXMax),
        idealPerchY,
        animatedWidth,
        animatedHeight,
        angle
      );
      const perchX = perchedPosition.x;
      const perchY = Math.min(perchedPosition.y, target.y - target.height * 0.34);
      const moveX = source.x + (perchX - source.x) * travel;
      const moveY = source.y + (perchY - source.y) * travel - Math.sin(Math.PI * travel) * 24;
      const settleX = moveX + (source.x - moveX) * returnBack;
      const settleY = moveY + (source.y - moveY) * returnBack;
      const visiblePosition = keepPourBottleInView(settleX, settleY, animatedWidth, animatedHeight, angle);

      ctx.save();
      ctx.translate(visiblePosition.x, visiblePosition.y);
      ctx.rotate(angle);
      ctx.globalAlpha = 0.94;
      drawBottle(
        bottle,
        { x: 0, y: 0, width: animatedWidth, height: animatedHeight },
        -99,
        null,
        { hideBadge: true, drainUnits: anim.amount * liquidProgress }
      );
      ctx.restore();

      drawBottle(state.bottles[anim.to], target, anim.to, null, {
        extraFill: {
          color: anim.color,
          units: anim.amount * liquidProgress
        }
      });

      if (pour > 0.08 && raw < 0.82) {
        const startX = visiblePosition.x + spoutLocalX * cos - spoutLocalY * sin;
        const startY = visiblePosition.y + spoutLocalX * sin + spoutLocalY * cos;
        const endX = target.x;
        const endY = target.y + target.height * 0.26;
        const controlX = startX * 0.45 + endX * 0.55;
        const controlY = Math.min(startY, endY) + 24 - edgePull * 5;
        ctx.save();
        ctx.strokeStyle = "rgba(255,255,255,0.42)";
        ctx.lineWidth = 6.5;
        ctx.lineCap = "round";
        ctx.globalAlpha = 0.28;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(controlX, controlY, endX, endY);
        ctx.stroke();
        ctx.strokeStyle = COLORS[anim.color];
        ctx.lineWidth = 4.2;
        ctx.lineCap = "round";
        ctx.globalAlpha = 0.72;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(controlX, controlY, endX, endY);
        ctx.stroke();
        ctx.strokeStyle = "rgba(255,255,255,0.55)";
        ctx.lineWidth = 1.4;
        ctx.globalAlpha = 0.55;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(controlX, controlY, endX, endY);
        ctx.stroke();
        ctx.restore();

        if (Math.random() < 0.42) {
          state.particles.push({
            x: endX + (Math.random() - 0.5) * 12,
            y: endY + (Math.random() - 0.5) * 8,
            r: 1.5 + Math.random() * 1.8,
            vy: 0.6 + Math.random() * 1.3,
            life: 22,
            color: COLORS[anim.color]
          });
        }
      }
    }

    function drawParticles() {
      state.particles = state.particles.filter((p) => p.life > 0);
      state.particles.forEach((p) => {
        p.life -= 1;
        p.x += p.vx || 0;
        p.y += p.vy;
        if (p.gravity) p.vy += p.gravity;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life / (p.maxLife || 28));
        ctx.fillStyle = p.color;
        if (p.kind === "petal") {
          ctx.translate(p.x, p.y);
          ctx.rotate(p.spin || 0);
          roundedRectPath(-p.r * 1.2, -p.r * 0.55, p.r * 2.4, p.r * 1.1, p.r * 0.55);
          ctx.fill();
          p.spin = (p.spin || 0) + (p.spinSpeed || 0.08);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });
    }

    function startCelebration() {
      const now = performance.now();
      state.celebration = { startedAt: now, duration: 1180 };
      state.bottles.forEach((bottle, index) => {
        if (bottle.colors.length !== bottle.capacity || !state.layouts[index]) return;
        const layout = state.layouts[index];
        const topColor = bottle.colors[bottle.colors.length - 1];
        for (let i = 0; i < 14; i += 1) {
          const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.45;
          const speed = 2.2 + Math.random() * 3.2;
          const life = 36 + Math.random() * 22;
          state.particles.push({
            x: layout.x + (Math.random() - 0.5) * layout.width * 0.5,
            y: layout.y + 10,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            gravity: 0.13,
            r: 1.8 + Math.random() * 2.2,
            life,
            maxLife: life,
            color: Math.random() < 0.35 ? "#ffffff" : COLORS[topColor]
          });
        }
      });
    }

    function startFinale() {
      const now = performance.now();
      state.particles = state.particles.filter((p) => p.kind === "petal");
      state.finale = { startedAt: now, duration: Infinity, lastPetalAt: 0 };
      addFinalePetals(90);
    }

    function addFinalePetals(count) {
      const petalColors = ["#ff5ca8", "#fff3a3", "#65e6a3", "#58c7ff", "#b983ff", "#ff9b54", "#ffffff"];
      for (let i = 0; i < count; i += 1) {
        const delay = Math.random() * 600;
        const life = 110 + Math.random() * 70;
        state.particles.push({
          kind: "petal",
          x: Math.random() * canvas.clientWidth,
          y: -20 - delay * 0.08,
          vx: (Math.random() - 0.5) * 1.8,
          vy: 1.2 + Math.random() * 2.2,
          gravity: 0.012,
          r: 3 + Math.random() * 3.5,
          spin: Math.random() * Math.PI,
          spinSpeed: (Math.random() - 0.5) * 0.25,
          life,
          maxLife: life,
          color: petalColors[Math.floor(Math.random() * petalColors.length)]
        });
      }
    }

    function drawFinale(now) {
      if (!state.finale) return;
      const elapsed = now - state.finale.startedAt;
      const reveal = easeInOut(Math.min(1, elapsed / 900));
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const cx = w / 2;
      const rainbowTop = Math.max(104, h * 0.18);
      const baseY = Math.min(h * 0.56, rainbowTop + h * 0.34);

      if (now - state.finale.lastPetalAt > 170) {
        addFinalePetals(8);
        state.finale.lastPetalAt = now;
      }

      ctx.save();
      const rainbowWidth = Math.min(w * 0.94, 390);
      const rainbowHeight = rainbowWidth * (941 / 1672);
      const rainbowX = cx - rainbowWidth / 2;
      const rainbowY = Math.max(64, rainbowTop - rainbowHeight * 0.08);
      ctx.globalAlpha = 0.98;
      ctx.shadowColor = "rgba(255,255,255,0.55)";
      ctx.shadowBlur = 18;
      if (finaleRainbowImage.complete && finaleRainbowImage.naturalWidth) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(rainbowX, rainbowY, rainbowWidth * reveal, rainbowHeight);
        ctx.clip();
        ctx.drawImage(finaleRainbowImage, rainbowX, rainbowY, rainbowWidth, rainbowHeight);
        ctx.restore();
      } else {
        const radiusX = Math.min(w * 0.44, 190);
        const radiusY = baseY - rainbowTop;
        const stripeWidth = Math.max(8, Math.min(12, w * 0.024));
        const stripeGap = stripeWidth * 0.92;
        const rainbow = ["#ff526f", "#ff9747", "#ffe66d", "#53dd7d", "#3fd5f4", "#4f73ff", "#b867ff"];
        rainbow.forEach((color, index) => {
          ctx.beginPath();
          ctx.strokeStyle = color;
          ctx.lineWidth = stripeWidth;
          ctx.lineCap = "round";
          const offset = index * stripeGap;
          ctx.ellipse(cx, baseY + offset, radiusX - offset * 0.9, radiusY - offset * 0.62, 0, Math.PI, Math.PI + Math.PI * reveal);
          ctx.stroke();
        });
      }
      ctx.shadowBlur = 0;

      const textPulse = 1 + Math.sin(elapsed / 180) * 0.035;
      const textY = Math.min(h - 92, rainbowY + rainbowHeight + 44);
      ctx.translate(cx, textY);
      ctx.scale(textPulse, textPulse);
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      roundedRectPath(-124, -34, 248, 68, 8);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,92,168,0.35)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#e8428d";
      ctx.font = "900 30px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("恭喜通关", 0, -6);
      ctx.fillStyle = "#197dad";
      ctx.font = "800 13px sans-serif";
      ctx.fillText("撒花完结", 0, 22);
      ctx.restore();
    }

    function drawBackgroundHearts() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.save();
      ctx.globalAlpha = 0.23;
      ctx.fillStyle = "#fff";
      [[38, 64, 0.85], [198, 36, 1], [334, 58, 0.9], [90, h - 72, 0.8], [300, h - 92, 0.75]].forEach(([x, y, s]) => {
        drawHeart(Math.min(w - 24, x), y, s);
      });
      ctx.restore();
    }

    function drawHeart(x, y, scale) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      ctx.beginPath();
      ctx.moveTo(0, 12);
      ctx.bezierCurveTo(-28, -8, -12, -28, 0, -12);
      ctx.bezierCurveTo(12, -28, 28, -8, 0, 12);
      ctx.fill();
      ctx.restore();
    }

    function render(now) {
      if (destroyed) return;
      const dt = Math.min(50, now - state.lastFrame);
      state.lastFrame = now;
      tickTimer(dt);
      hideToastIfNeeded(now);

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      drawBackgroundHearts();

      state.layouts.forEach((layout) => {
        layout.shake *= 0.9;
        if (layout.shake < 0.2) layout.shake = 0;
      });

      if (!state.finale) {
        state.bottles.forEach((bottle, index) => {
          if (state.animation && index === state.animation.from) return;
          if (state.animation && index === state.animation.to) return;
          drawBottle(bottle, state.layouts[index], index);
        });
        drawHintMarkers(now);

        if (state.animation) {
          state.animation.elapsed += dt;
          drawPourAnimation();
          if (state.animation.elapsed >= state.animation.duration) {
            finishPour();
          }
        }
      }

      drawParticles();
      drawFinale(now);
      renderFrame = requestAnimationFrame(render);
    }

    function tickTimer(dt) {
      const level = activeLevel();
      if (!level.time || state.completed || state.failed) return;
      state.timeLeft -= dt / 1000;
      if (state.timeLeft <= 0) {
        state.timeLeft = 0;
        state.failed = true;
        showToast("时间到，重开试试");
        showTeaching(TEACHING_LINES.timeUp);
        updateHud();
        return;
      }
      const timerText = formatTimer(level);
      if (timerText !== state.timerText) {
        timerEl.textContent = timerText;
        state.timerText = timerText;
      }
    }

    function topRun(bottle) {
      if (!bottle.colors.length) return null;
      const color = bottle.colors[bottle.colors.length - 1];
      let amount = 0;
      for (let i = bottle.colors.length - 1; i >= 0; i -= 1) {
        if (bottle.colors[i] !== color) break;
        amount += 1;
      }
      return { color, amount };
    }

    function canPour(from, to) {
      if (from === to) return { ok: false, reason: "换一个瓶子倒" };
      const source = state.bottles[from];
      const target = state.bottles[to];
      if (!source || !target) return { ok: false, reason: "没有这个瓶子" };
      if (state.failed || state.completed) return { ok: false, reason: "当前关已结束" };
      if (!source.colors.length) return { ok: false, reason: "空瓶不能倒出" };
      if (source.receiveOnly) return { ok: false, reason: "这个瓶子只能接水" };
      if (target.pourOnly) return { ok: false, reason: "这个瓶子只能倒出" };
      const space = target.capacity - target.colors.length;
      if (space <= 0) return { ok: false, reason: "目标瓶满了" };
      const run = topRun(source);
      const targetTop = target.colors[target.colors.length - 1];
      if (targetTop && targetTop !== run.color) return { ok: false, reason: "只能倒到同色或空瓶" };
      return {
        ok: true,
        color: run.color,
        amount: Math.min(run.amount, space)
      };
    }

    function startPour(from, to, move) {
      state.history.push(snapshot());
      state.moves += 1;
      state.selected = -1;
      state.hint = null;
      state.animation = {
        from,
        to,
        color: move.color,
        amount: move.amount,
        elapsed: 0,
        duration: 3000
      };
      startWaterNoise();
      showTeaching(pourLine(move.color));
      updateHud();
    }

    function finishPour() {
      const anim = state.animation;
      const source = state.bottles[anim.from];
      const target = state.bottles[anim.to];
      for (let i = 0; i < anim.amount; i += 1) {
        target.colors.push(source.colors.pop());
      }
      state.animation = null;
      stopWaterNoise();
      if (isComplete()) {
        state.completed = true;
        const hasNextLevel = state.levelIndex < activeLevels().length - 1;
        const stars = scoreStars(activeLevel());
        unlockNextLevel();
        recordBest(stars);
        const overTarget = activeLevel().targetMoves && state.moves > activeLevel().targetMoves;
        showToast(hasNextLevel ? `${starText(stars)} ${overTarget ? "超步通关" : "通关"}，进入下一关` : `${starText(stars)} 恭喜通关！`);
        showTeaching(hasNextLevel ? TEACHING_LINES.nextLevel : TEACHING_LINES.finish);
        startCelebration();
        if (!hasNextLevel) {
          startFinale();
        }
        showResult(stars, hasNextLevel);
        savePreferences();
      }
      updateHud();
    }

    function isComplete() {
      return state.bottles.every((bottle) => {
        if (bottle.colors.length === 0) return true;
        if (bottle.colors.length !== bottle.capacity) return false;
        return bottle.colors.every((color) => color === bottle.colors[0]);
      });
    }

    function handleCanvasClick(event) {
      if (state.animation) return;
      if (state.resultOpen) return;
      unlockAudio();
      state.hint = null;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const hit = hitTest(x, y);
      if (hit < 0) return;

      if (state.selected < 0) {
        if (!state.bottles[hit].colors.length) {
          bump(hit, "先选有液体的瓶子");
          showTeaching(TEACHING_LINES.emptyPick);
          return;
        }
        state.selected = hit;
        playUiFileSfx("pick");
        showTeaching(TEACHING_LINES.pick);
        if (state.guideStep === 1) {
          state.guideStep = 2;
          showToast("再点空瓶或同色瓶");
        }
        return;
      }

      if (state.selected === hit) {
        state.selected = -1;
        playUiFileSfx("putDown");
        showTeaching(TEACHING_LINES.sameBottle);
        return;
      }

      const move = canPour(state.selected, hit);
      if (!move.ok) {
        bump(hit, move.reason);
        showTeaching(teachingLineForReason(move.reason));
        return;
      }
      startPour(state.selected, hit, move);
      if (state.guideStep === 2) {
        completeFirstGuide();
        showToast("做得很好，相同颜色会叠在一起");
      }
    }

    function hitTest(x, y) {
      for (let i = state.layouts.length - 1; i >= 0; i -= 1) {
        const box = state.layouts[i];
        const left = box.x - box.width / 2 - 12;
        const top = box.y - 12;
        const right = box.x + box.width / 2 + 12;
        const bottom = box.y + box.height + 30;
        if (x >= left && x <= right && y >= top && y <= bottom) return i;
      }
      return -1;
    }

    function bump(index, reason) {
      state.selected = -1;
      if (state.layouts[index]) state.layouts[index].shake = 7;
      showToast(reason);
    }

    function easeInOut(t) {
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    function unlockAudio(onReady) {
      if (!state.audio) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        state.audio = { ctx: new AudioContext(), water: null, music: null, primed: false };
      }
      const audioCtx = state.audio.ctx;
      let readyCalled = false;
      const markReady = () => {
        if (readyCalled || !state.audio) return;
        readyCalled = true;
        updateAudioDebug();
        if (typeof onReady === "function") onReady();
      };
      if (audioCtx.state === "suspended") {
        const resumePromise = audioCtx.resume();
        if (resumePromise && typeof resumePromise.then === "function") {
          resumePromise.then(markReady).catch(() => {});
        }
        setTimeout(() => {
          if (audioCtx.state === "running") markReady();
          updateAudioDebug();
        }, 80);
        return;
      }
      markReady();
    }

    function currentUiSfxVolume() {
      return Math.min(1, 0.92 * state.masterVolume * state.sfxVolume);
    }

    function playUiFileSfx(key) {
      if (!state.sfx) return;
      const src = UI_SFX_URLS[key];
      if (!src) return;
      const audio = new Audio(src);
      audio.preload = "auto";
      audio.volume = currentUiSfxVolume();
      audio.setAttribute("playsinline", "true");
      audio.setAttribute("webkit-playsinline", "true");
      audio.play().catch(() => {});
    }

    function startWaterNoise() {
      if (!state.sfx) return;
      unlockAudio();
      if (!state.audio) return;
      stopWaterNoise(true);
      duckMusicForWater();

      const audio = new Audio(WATER_AUDIO_URL);
      audio.preload = "auto";
      audio.loop = false;
      audio.currentTime = 0;
      audio.volume = 0;
      const fadeTimer = setInterval(() => {
        const targetVolume = currentWaterFileVolume();
        audio.volume = Math.min(targetVolume, audio.volume + Math.max(0.04, targetVolume * 0.15));
        if (audio.volume >= targetVolume) clearInterval(fadeTimer);
      }, 28);
      state.audio.water = { kind: "file", audio, fadeTimer, fadeOutTimer: null };

      audio.play().catch(() => {
        clearInterval(fadeTimer);
        if (!state.audio || !state.audio.water || state.audio.water.audio !== audio) return;
        state.audio.water = null;
      });
    }

    function stopWaterNoise(force = false) {
      if (!state.audio || !state.audio.water) return;
      const water = state.audio.water;
      state.audio.water = null;
      restoreMusicAfterWater();
      const { audio, fadeTimer, fadeOutTimer } = water;
      clearInterval(fadeTimer);
      clearInterval(fadeOutTimer);
      if (force) {
        audio.pause();
        audio.currentTime = 0;
        return;
      }
      fadeOutWaterFile(audio);
    }

    function fadeOutWaterFile(audio) {
      if (audio.paused) return;
      const fadeOut = setInterval(() => {
        audio.volume = Math.max(0, audio.volume - 0.16);
        if (audio.volume <= 0) {
          clearInterval(fadeOut);
          audio.pause();
          audio.currentTime = 0;
        }
      }, 24);
    }

    function currentMusicGain() {
      return MUSIC_MAX_GAIN * state.masterVolume * state.musicVolume;
    }

    function currentMusicVolume() {
      return Math.min(1, currentMusicGain());
    }

    function currentWaterFileVolume() {
      return Math.min(1, WATER_FILE_MAX_VOLUME * state.masterVolume * state.sfxVolume);
    }

    function createBackgroundAudio() {
      const audio = document.createElement("audio");
      audio.src = MUSIC_AUDIO_URL;
      audio.preload = "auto";
      audio.loop = true;
      audio.volume = currentMusicVolume();
      audio.controls = false;
      audio.autoplay = false;
      audio.setAttribute("playsinline", "true");
      audio.setAttribute("webkit-playsinline", "true");
      audio.style.position = "fixed";
      audio.style.left = "-9999px";
      audio.style.top = "0";
      audio.style.width = "1px";
      audio.style.height = "1px";
      audio.style.opacity = "0.01";
      audio.style.pointerEvents = "none";
      if (root instanceof Element) {
        root.appendChild(audio);
      }
      audio.load();
      return audio;
    }

    function duckMusicForWater() {
      if (!state.musicTrack) return;
      state.musicTrack.audio.volume = Math.min(1, currentMusicGain() * WATER_MUSIC_DUCK);
    }

    function restoreMusicAfterWater() {
      if (!state.musicTrack) return;
      state.musicTrack.audio.volume = currentMusicVolume();
    }

    function applyMasterVolume() {
      if (state.musicTrack) {
        state.musicTrack.audio.volume = currentMusicVolume();
      }
      if (!state.audio) {
        if (state.teachingAudio) state.teachingAudio.volume = currentTeachingVoiceVolume();
        return;
      }
      if (state.audio.water && state.audio.water.kind === "file") {
        state.audio.water.audio.volume = currentWaterFileVolume();
      }
      if (state.teachingAudio) {
        state.teachingAudio.volume = currentTeachingVoiceVolume();
      }
    }

    function startBackgroundMusic() {
      if (!state.musicOn) return;
      if (!state.musicTrack) {
        state.musicTrack = {
          kind: "file",
          audio: createBackgroundAudio(),
          stopped: true
        };
      }
      if (!state.musicTrack.stopped && !state.musicTrack.audio.paused) return;
      const music = state.musicTrack;
      const { audio } = music;
      music.stopped = false;
      audio.volume = currentMusicVolume();
      updateAudioDebug();
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise.then(updateAudioDebug).catch(() => {
          if (state.musicTrack !== music) return;
          music.stopped = true;
          state.musicOn = false;
          showToast("背景音乐被浏览器拦截，请再点一次");
          updateHud();
          updateAudioDebug();
        });
      } else {
        updateAudioDebug();
      }
    }

    function stopBackgroundMusic() {
      if (!state.musicTrack) return;
      const music = state.musicTrack;
      music.stopped = true;
      music.audio.pause();
      music.audio.currentTime = 0;
      updateAudioDebug();
    }

    function setMusicEnabled(enabled) {
      state.musicOn = enabled;
      if (state.musicOn) {
        startBackgroundMusic();
      } else {
        stopBackgroundMusic();
      }
      updateHud();
      savePreferences();
      updateAudioDebug();
    }

    function setSoundEnabled(enabled, shouldUnlock = true) {
      state.sfx = enabled;
      if (shouldUnlock) unlockAudio();
      if (!state.sfx) {
        stopWaterNoise(true);
      }
      updateHud();
      savePreferences();
      updateAudioDebug();
    }

    function audioDebugSnapshot() {
      const audioState = state.audio?.ctx?.state || "none";
      return {
        audioState,
        musicOn: state.musicOn,
        musicStarted: Boolean(state.musicTrack && !state.musicTrack.stopped && !state.musicTrack.audio.paused),
        sfxOn: state.sfx,
        waterPlaying: Boolean(state.audio?.water),
        teachingOn: state.teaching,
        speechMode: state.speechMode
      };
    }

    function updateAudioDebug() {
      const snapshot = audioDebugSnapshot();
      window.__mocaipingAudioDebug = audioDebugSnapshot;
      if (!audioDebugEl) return;
      audioDebugEl.dataset.audioState = snapshot.audioState;
      audioDebugEl.dataset.musicOn = String(snapshot.musicOn);
      audioDebugEl.dataset.musicStarted = String(snapshot.musicStarted);
      audioDebugEl.dataset.sfxOn = String(snapshot.sfxOn);
      audioDebugEl.dataset.waterPlaying = String(snapshot.waterPlaying);
      audioDebugEl.textContent = [
        `Audio: ${snapshot.audioState}`,
        `Music: ${snapshot.musicOn ? "on" : "off"}/${snapshot.musicStarted ? "started" : "stopped"}`,
        `SFX: ${snapshot.sfxOn ? "on" : "off"}`,
        `Water: ${snapshot.waterPlaying ? "playing" : "idle"}`
      ].join(" | ");
    }

    function setTeachingEnabled(enabled) {
      state.teaching = enabled;
      state.speechOn = enabled;
      if (!state.teaching) stopTeachingAudio();
      updateHud();
      savePreferences();
    }

    function setSpeechMode(mode) {
      state.speechMode = mode;
      updateHud();
      savePreferences();
      showTeaching(mode === "en" ? TEACHING_LINES.languageEn : mode === "zh" ? TEACHING_LINES.languageZh : TEACHING_LINES.languageBoth);
    }

    function setTeachingStyle(style) {
      state.teachingStyle = style;
      updateHud();
      savePreferences();
      showTeaching(style === "toddler" ? TEACHING_LINES.toddlerMode : TEACHING_LINES.normalMode);
    }

    function destroyGame() {
      if (destroyed) return;
      destroyed = true;
      if (renderFrame) cancelAnimationFrame(renderFrame);
      stopBackgroundMusic();
      stopWaterNoise(true);
      stopTeachingAudio();
      if (state.musicTrack?.audio) {
        if (typeof state.musicTrack.audio.remove === "function") {
          state.musicTrack.audio.remove();
        }
        state.musicTrack = null;
      }
      if (state.audio?.ctx && state.audio.ctx.state !== "closed") {
        state.audio.ctx.close().catch(() => {});
      }
      if (audioDebugEl) audioDebugEl.remove();
      if (window.__mocaipingDestroyCurrent === destroyGame) {
        window.__mocaipingDestroyCurrent = null;
      }
      updateAudioDebug();
    }

    window.__mocaipingDestroyCurrent = destroyGame;
    window.addEventListener("pagehide", destroyGame, { once: true });
    window.addEventListener("beforeunload", destroyGame, { once: true });

    function closeSettings() {
      state.settingsOpen = false;
      updateHud();
    }

    function setSettingsTab(tab) {
      state.settingsTab = tab;
      updateHud();
    }

    function switchMode(mode) {
      if (!MODES[mode] || state.mode === mode) {
        updateHud();
        return;
      }
      state.mode = mode;
      loadLevel(0);
      showToast(`${activeMode().label}模式`);
      savePreferences();
    }

    function startCoverIntro() {
      if (!coverIntro) return;
      const coverImage = coverIntro.querySelector(".cover-art");
      let started = false;
      const coverShownAt = performance.now();
      const isDesktopCover = window.matchMedia("(min-width: 700px) and (min-aspect-ratio: 1 / 1)").matches;
      if (coverImage) {
        coverImage.src = isDesktopCover ? "assets/brand/mocaiping-cover-desktop.png" : "assets/brand/mocaiping-cover-mobile.png";
      }
      const startOpening = () => {
        if (started) return;
        started = true;
        coverIntro.classList.add("opening");
        setTimeout(() => {
          coverIntro.classList.add("hidden");
        }, 860);
        setTimeout(() => {
          coverIntro.style.display = "none";
        }, 1160);
      };
      const waitThenOpen = () => {
        const visibleMs = performance.now() - coverShownAt;
        setTimeout(startOpening, Math.max(0, 1800 - visibleMs));
      };
      if (coverImage && coverImage.complete && coverImage.naturalWidth > 0) {
        waitThenOpen();
      } else if (coverImage) {
        coverImage.addEventListener("load", waitThenOpen, { once: true });
        coverImage.addEventListener("error", waitThenOpen, { once: true });
        setTimeout(waitThenOpen, 2600);
      } else {
        waitThenOpen();
      }
    }

    [canvas, toolbarSoundButton, soundButton].forEach((target) => {
      if (!target) return;
      target.addEventListener("pointerdown", () => {
        unlockAudio();
      }, { passive: true });
      target.addEventListener("touchstart", () => {
        unlockAudio();
      }, { passive: true });
    });

    let lastMusicGestureAt = 0;

    function handleMusicGesture(event) {
      if (event?.type === "touchend") {
        event.preventDefault();
      }
      const now = performance.now();
      if (now - lastMusicGestureAt < 420) return;
      lastMusicGestureAt = now;
      setMusicEnabled(!state.musicOn);
      showToast(state.musicOn ? "背景音乐已开启" : "背景音乐已关闭");
    }

    let lastCanvasGestureAt = 0;
    function handleCanvasGesture(event) {
      if (event.type === "pointerup" && event.pointerType === "touch") {
        event.preventDefault();
      }
      if (event.type === "touchend") {
        event.preventDefault();
      }
      const now = performance.now();
      if (now - lastCanvasGestureAt < 120) return;
      lastCanvasGestureAt = now;
      const inputEvent = event.changedTouches ? event.changedTouches[0] : event;
      handleCanvasClick(inputEvent);
    }

    if (window.PointerEvent) {
      canvas.addEventListener("pointerup", handleCanvasGesture, { passive: false });
    } else {
      canvas.addEventListener("touchend", handleCanvasGesture, { passive: false });
      canvas.addEventListener("click", handleCanvasGesture);
    }
    undoButton.addEventListener("click", () => {
      if (!state.history.length || state.animation) return;
      restore(state.history.pop());
      showToast("已撤销一步");
      showTeaching(TEACHING_LINES.undo);
    });
    hintButton.addEventListener("click", showHint);
    restartButton.addEventListener("click", () => {
      hideResult();
      loadLevel(state.levelIndex);
      showTeaching(TEACHING_LINES.restart);
    });
    resultRestartButton.addEventListener("click", () => {
      hideResult();
      loadLevel(state.levelIndex);
    });
    resultNextButton.addEventListener("click", () => {
      const hasNextLevel = state.levelIndex < activeLevels().length - 1;
      hideResult();
      if (hasNextLevel) {
        loadLevel(state.levelIndex + 1);
        showTeaching(TEACHING_LINES.nextLevel);
      }
    });
    settingsButton.addEventListener("click", () => {
      state.settingsOpen = true;
      updateHud();
      showTeaching(TEACHING_LINES.openSettings);
    });
    settingsCloseButton.addEventListener("click", () => {
      closeSettings();
      showTeaching(TEACHING_LINES.closeSettings);
    });
    settingsPanel.addEventListener("click", (event) => {
      if (event.target === settingsPanel) closeSettings();
    });
    settingsTabGame.addEventListener("click", () => setSettingsTab("game"));
    settingsTabSound.addEventListener("click", () => setSettingsTab("sound"));
    settingsTabTeaching.addEventListener("click", () => setSettingsTab("teaching"));
    easyModeButton.addEventListener("click", () => switchMode("easy"));
    hardModeButton.addEventListener("click", () => switchMode("hard"));
    toolbarMusicButton.addEventListener("touchend", handleMusicGesture, { passive: false });
    toolbarMusicButton.addEventListener("click", handleMusicGesture);
    toolbarSoundButton.addEventListener("click", () => {
      setSoundEnabled(!state.sfx);
      showToast(state.sfx ? "倒水音效已开启" : "倒水音效已关闭");
    });
    musicButton.addEventListener("touchend", handleMusicGesture, { passive: false });
    musicButton.addEventListener("click", handleMusicGesture);
    soundButton.addEventListener("click", () => {
      setSoundEnabled(!state.sfx);
      showToast(state.sfx ? "倒水音效已开启" : "倒水音效已关闭");
    });
    teachingButton.addEventListener("click", () => {
      if (state.teaching) {
        showTeaching(TEACHING_LINES.teachingOff);
        state.teaching = false;
        state.speechOn = false;
        showToast("教学朗读已关闭");
        updateHud();
        savePreferences();
        return;
      }
      setTeachingEnabled(true);
      showToast("教学开启");
      showTeaching(TEACHING_LINES.teachingOn);
    });
    speechZhButton.addEventListener("click", () => setSpeechMode("zh"));
    speechEnButton.addEventListener("click", () => setSpeechMode("en"));
    speechBothButton.addEventListener("click", () => setSpeechMode("both"));
    teachingToddlerButton.addEventListener("click", () => setTeachingStyle("toddler"));
    teachingNormalButton.addEventListener("click", () => setTeachingStyle("normal"));
    masterVolumeInput.addEventListener("input", () => {
      state.masterVolume = Number(masterVolumeInput.value) / 100;
      masterVolumeValue.textContent = `${masterVolumeInput.value}%`;
      applyMasterVolume();
      savePreferences();
    });
    masterVolumeInput.addEventListener("change", () => {
      showToast(`总音量 ${masterVolumeInput.value}%`);
      updateHud();
    });
    musicVolumeInput.addEventListener("input", () => {
      state.musicVolume = Number(musicVolumeInput.value) / 100;
      musicVolumeValue.textContent = `${musicVolumeInput.value}%`;
      applyMasterVolume();
      savePreferences();
    });
    musicVolumeInput.addEventListener("change", () => {
      showToast(`音乐音量 ${musicVolumeInput.value}%`);
      updateHud();
    });
    sfxVolumeInput.addEventListener("input", () => {
      state.sfxVolume = Number(sfxVolumeInput.value) / 100;
      sfxVolumeValue.textContent = `${sfxVolumeInput.value}%`;
      applyMasterVolume();
      savePreferences();
    });
    sfxVolumeInput.addEventListener("change", () => {
      showToast(`音效音量 ${sfxVolumeInput.value}%`);
      updateHud();
    });
    voiceVolumeInput.addEventListener("input", () => {
      state.voiceVolume = Number(voiceVolumeInput.value) / 100;
      voiceVolumeValue.textContent = `${voiceVolumeInput.value}%`;
      applyMasterVolume();
      savePreferences();
    });
    voiceVolumeInput.addEventListener("change", () => {
      showToast(`语音音量 ${voiceVolumeInput.value}%`);
      updateHud();
    });
    window.addEventListener("resize", () => {
      resizeCanvas();
    });
    window.addEventListener("orientationchange", () => {
      requestAnimationFrame(resizeCanvas);
      setTimeout(resizeCanvas, 250);
    });
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", resizeCanvas);
      window.visualViewport.addEventListener("scroll", resizeCanvas);
    }

    loadPreferences();
    state.musicTrack = {
      kind: "file",
      audio: createBackgroundAudio(),
      stopped: true
    };
    applyMasterVolume();
    loadLevel(state.levelIndex);
    syncAppHeight();
    resizeCanvas();
    requestAnimationFrame(resizeCanvas);
    setTimeout(resizeCanvas, 250);
    startCoverIntro();
    startFirstGuide();
    renderFrame = requestAnimationFrame(render);

    return destroyGame;
  
}
