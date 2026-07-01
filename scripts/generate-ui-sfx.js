import { Buffer } from 'node:buffer'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outDir = path.join(root, 'public/assets')
const sampleRate = 44100

function clamp(value, min = -1, max = 1) {
  return Math.max(min, Math.min(max, value))
}

function sine(freq, time) {
  return Math.sin(2 * Math.PI * freq * time)
}

function envelope(time, duration, attack, release) {
  if (time < 0 || time > duration)
    return 0
  return Math.min(1, time / attack, (duration - time) / release)
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

function makePickGlass() {
  const duration = 0.24
  const total = Math.round(duration * sampleRate)
  const samples = new Float32Array(total)
  for (let i = 0; i < total; i += 1) {
    const t = i / sampleRate
    const pingEnv = Math.exp(-t * 18)
    const tapEnv = Math.exp(-t * 92)
    const shimmerEnv = Math.exp(-t * 28)
    const tap = sine(1180, t) * tapEnv * 0.1
    const ping = (sine(1760, t) * 0.42 + sine(2320, t) * 0.18 + sine(3520, t) * 0.08) * pingEnv
    const shimmer = sine(2640, t + 0.003) * shimmerEnv * 0.08
    samples[i] = (tap + ping + shimmer) * 0.56
  }
  return samples
}

function makePickWood() {
  const duration = 0.18
  const total = Math.round(duration * sampleRate)
  const samples = new Float32Array(total)
  for (let i = 0; i < total; i += 1) {
    const t = i / sampleRate
    const bodyEnv = Math.exp(-t * 34)
    const tapEnv = Math.exp(-t * 105)
    const body = (sine(360, t) * 0.46 + sine(520, t) * 0.24 + sine(740, t) * 0.1) * bodyEnv
    const tap = sine(1250, t) * tapEnv * 0.06
    samples[i] = (body + tap) * 0.62
  }
  return samples
}

function makePutDown() {
  const duration = 0.2
  const total = Math.round(duration * sampleRate)
  const samples = new Float32Array(total)
  for (let i = 0; i < total; i += 1) {
    const t = i / sampleRate
    const env = envelope(t, duration, 0.006, 0.16)
    const freq = 280 - 70 * Math.min(1, t / duration)
    const thump = sine(freq, t) * 0.62 + sine(freq * 0.5, t) * 0.22
    const softTap = sine(520, t) * Math.exp(-t * 48) * 0.07
    samples[i] = (thump + softTap) * env * 0.68
  }
  return samples
}

function generate(name, samples) {
  const wavPath = path.join(outDir, `${name}.wav`)
  const mp3Path = path.join(outDir, `${name}.mp3`)
  writeWavMono(wavPath, samples)
  execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-i', wavPath, '-c:a', 'libmp3lame', '-q:a', '4', mp3Path], { stdio: 'inherit' })
  fs.rmSync(wavPath)
  console.log(`Generated ${path.relative(root, mp3Path)}`)
}

generate('pick-bottle', makePickWood())
generate('pick-bottle-glass-preview', makePickGlass())
generate('pick-bottle-wood-preview', makePickWood())
generate('put-down-bottle', makePutDown())
