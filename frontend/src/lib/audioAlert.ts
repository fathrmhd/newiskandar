let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (AudioCtx) {
      audioCtx = new AudioCtx()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {})
  }
  return audioCtx
}

export function playWarningSound(type: 'warning' | 'resolved' | 'click' = 'warning') {
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime

    if (type === 'warning') {
      const notes = [587.33, 440.0, 349.23] // D5, A4, F4
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, now + i * 0.15)

        gain.gain.setValueAtTime(0.001, now + i * 0.15)
        gain.gain.exponentialRampToValueAtTime(0.18, now + i * 0.15 + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.25)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(now + i * 0.15)
        osc.stop(now + i * 0.15 + 0.28)
      })
    } else if (type === 'resolved') {
      const notes = [349.23, 440.0, 587.33, 698.46]
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now + i * 0.1)

        gain.gain.setValueAtTime(0.001, now + i * 0.1)
        gain.gain.exponentialRampToValueAtTime(0.12, now + i * 0.1 + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.2)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(now + i * 0.1)
        osc.stop(now + i * 0.1 + 0.22)
      })
    } else {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(880, now)

      gain.gain.setValueAtTime(0.05, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.07)
    }
  } catch (err) {
    console.warn('Gagal memutar audio peringatan:', err)
  }
}
