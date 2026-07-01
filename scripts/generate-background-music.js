import { Buffer } from 'node:buffer'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outDir = path.join(root, 'public/assets')
const wavPath = path.join(outDir, 'background-music.wav')
const mp3Path = path.join(outDir, 'background-music.mp3')
const m4aPath = path.join(outDir, 'background-music.m4a')

const sampleRate = 44100
const tempo = 132
const beat = 60 / tempo
const notes = [392, 466.16, 523.25, 466.16, 392, 311.13, 349.23, 392]
const bass = [98, 98, 116.54, 98, 130.81, 116.54, 98, 77.78]
const repeats = 16
const patternDuration = notes.length * beat
const duration = patternDuration * repeats
const totalSamples = Math.round(duration * sampleRate)

const melodyGain = 0.18
const bassGain = 0.17
const tickGain = 0.85
const popGain = 0.08
const masterGain = 0.86

function clamp(value, min = -1, max = 1) {
  return Math.max(min, Math.min(max, value))
}

function envelope(t, durationSeconds, attack = 0.008, release = 0.075) {
  if (t < 0 || t > durationSeconds)
    return 0
  const fadeIn = Math.min(1, t / attack)
  const fadeOut = Math.min(1, (durationSeconds - t) / release)
  return Math.max(0, Math.min(fadeIn, fadeOut))
}

function triangle(phase) {
  return 2 * Math.abs(2 * (phase - Math.floor(phase + 0.5))) - 1
}

function square(phase) {
  return Math.sin(2 * Math.PI * phase) >= 0 ? 1 : -1
}

function melodySample(freq, t, length) {
  const env = envelope(t, length, 0.006, 0.055)
  const wobble = 1 + Math.sin(2 * Math.PI * 8 * t) * 0.012
  const phase = freq * wobble * t
  const chiptune = square(phase) * 0.62
  const round = Math.sin(2 * Math.PI * phase) * 0.34
  const nasal = Math.sin(2 * Math.PI * phase * 2) * 0.12
  return (chiptune + round + nasal) * env * melodyGain
}

function bassSample(freq, t, length) {
  const env = envelope(t, length, 0.006, 0.11)
  const drop = freq * (1.22 - Math.min(0.22, t * 1.2))
  return (triangle(drop * t) * 0.78 + square(drop * t) * 0.12 + Math.sin(2 * Math.PI * drop * t) * 0.18) * env * bassGain
}

function hashNoise(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return (x - Math.floor(x)) * 2 - 1
}

function tickSample(localT, beatIndex) {
  const length = 0.045
  if (localT < 0 || localT > length)
    return 0
  const env = Math.exp(-localT * 72)
  const accent = beatIndex % 2 === 0 ? 0.8 : 0.55
  const click = Math.sin(2 * Math.PI * 760 * localT) * 0.025
  const wood = Math.sin(2 * Math.PI * 420 * localT) * 0.045
  const noise = hashNoise(Math.floor(localT * sampleRate) + beatIndex * 97) * 0.012
  return (click + wood + noise) * env * accent * tickGain
}

function popSample(localT, freq) {
  const length = 0.105
  if (localT < 0 || localT > length)
    return 0
  const env = Math.exp(-localT * 26)
  const bend = freq * 1.5 * (1.1 - localT * 0.9)
  return (Math.sin(2 * Math.PI * bend * localT) * 0.65 + triangle(bend * 0.5 * localT) * 0.28) * env * popGain
}

function writeWavMono(filePath, samples) {
  const dataSize = samples.length * 2
  const buffer = Buffer.alloc(44 + dataSize)
  buffer.write('RIFF', 0)
  buffer.writeUInt32LE(36 + dataSize, 4)
  buffer.write('WAVE', 8)
  buffer.write('fmt ', 12)
  buffer.writeUInt32LE(16, 16)
  buffer.writeUInt16LE(1, 20)
  buffer.writeUInt16LE(1, 22)
  buffer.writeUInt32LE(sampleRate, 24)
  buffer.writeUInt32LE(sampleRate * 2, 28)
  buffer.writeUInt16LE(2, 32)
  buffer.writeUInt16LE(16, 34)
  buffer.write('data', 36)
  buffer.writeUInt32LE(dataSize, 40)

  samples.forEach((sample, index) => {
    buffer.writeInt16LE(Math.round(clamp(sample) * 32767), 44 + index * 2)
  })
  fs.writeFileSync(filePath, buffer)
}

const samples = new Float32Array(totalSamples)

for (let i = 0; i < totalSamples; i += 1) {
  const t = i / sampleRate
  const patternTime = t % patternDuration
  const step = Math.floor(patternTime / beat)
  const noteT = patternTime - step * beat
  const noteLength = beat * 0.48
  const beatIndex = Math.floor(t / beat)
  const offbeatT = noteT - beat * 0.52
  let sample = 0

  sample += melodySample(notes[step], noteT, noteLength)
  sample += bassSample(bass[step], noteT, beat * 0.42)
  sample += popSample(offbeatT, notes[step])
  sample += tickSample(t - beatIndex * beat, beatIndex)

  samples[i] = clamp(sample * masterGain, -0.98, 0.98)
}

writeWavMono(wavPath, samples)
execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-i', wavPath, '-c:a', 'libmp3lame', '-q:a', '4', mp3Path], { stdio: 'inherit' })
execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-i', wavPath, '-c:a', 'aac', '-b:a', '160k', m4aPath], { stdio: 'inherit' })
fs.rmSync(wavPath)

console.log(`Generated ${path.relative(root, mp3Path)} and ${path.relative(root, m4aPath)}`)
console.log(`tempo=${tempo}, repeats=${repeats}, duration=${duration.toFixed(2)}s, tickGain=${tickGain}`)
