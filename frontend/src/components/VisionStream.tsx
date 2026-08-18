import { useEffect, useRef, useState, type FC } from 'react'
import type { Workstation } from '@/lib/ai'
import { AlertIcon, CameraIcon, CheckIcon, DyeDrop } from './batik'

interface VisionStreamProps {
  station: Workstation
  isSimulatedIdle?: boolean
  showControls?: boolean
  compact?: boolean
  onToggleIdle?: () => void
  onTriggerAlert?: () => void
}

export const VisionStream: FC<VisionStreamProps> = ({
  station,
  isSimulatedIdle = false,
  showControls = true,
  compact = false,
  onToggleIdle,
  onTriggerAlert,
}) => {
  const [useWebcam, setUseWebcam] = useState(false)
  const [webcamError, setWebcamError] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Inisialisasi Webcam jika diaktifkan pengguna
  useEffect(() => {
    if (useWebcam) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { width: 1280, height: 720 } })
        .then((stream) => {
          streamRef.current = stream
          if (videoRef.current) {
            videoRef.current.srcObject = stream
            videoRef.current.play()
          }
          setWebcamError(null)
        })
        .catch((err) => {
          console.warn('Webcam tidak dapat diakses:', err)
          setWebcamError('Akses kamera tidak diizinkan atau perangkat tidak ditemukan.')
          setUseWebcam(false)
        })
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }
    }
  }, [useWebcam])

  const isWarning = isSimulatedIdle || station.status === 'warning'

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border ${
        isWarning
          ? 'border-[color:var(--color-danger)]/80 bg-navy shadow-sm'
          : 'border-sky/60 bg-navy'
      }`}
    >
      {/* Header Overlay Stream */}
      <div className="absolute left-0 right-0 top-0 z-20 flex flex-wrap items-center justify-between gap-2 bg-gradient-to-b from-navy/90 via-navy/50 to-transparent p-3 sm:p-4 text-xs text-soft">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span
              className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isWarning ? 'bg-[color:var(--color-danger)] animate-ping' : 'bg-[color:var(--color-ok)]'
              }`}
            />
            <span
              className={`relative inline-flex h-2 w-2 rounded-full ${
                isWarning ? 'bg-[color:var(--color-danger)]' : 'bg-[color:var(--color-ok)]'
              }`}
            />
          </span>
          <span className="font-mono text-xs font-semibold tracking-wide text-soft">
            {station.code} · {station.name}
          </span>
          <span className="hidden rounded border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-sky/70 sm:inline">
            {station.resolution}
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px] text-sky/75">
          <span>{station.fps} FPS</span>
          <span className="hidden sm:inline">14ms Latensi</span>
        </div>
      </div>

      {/* Main Stream Display Area — Polos & Bersih (Blank Standby / Real Webcam) */}
      <div className="relative aspect-video w-full overflow-hidden bg-[#06101e] flex items-center justify-center">
        {useWebcam ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full object-cover"
          />
        ) : (
          /* Area Kamera Blank / Standby Sesuai Permintaan (Tanpa Animasi Kartun) */
          <div className="relative flex h-full w-full flex-col items-center justify-center p-6 text-center select-none">
            {/* Grid Optik Halus */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #b3cfe5 1px, transparent 1px), linear-gradient(to bottom, #b3cfe5 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }}
            />

            {/* Corner Markers Optik Sensor */}
            <div className="pointer-events-none absolute left-5 top-5 h-4 w-4 border-l border-t border-sky/30" />
            <div className="pointer-events-none absolute right-5 top-5 h-4 w-4 border-r border-t border-sky/30" />
            <div className="pointer-events-none absolute bottom-5 left-5 h-4 w-4 border-b border-l border-sky/30" />
            <div className="pointer-events-none absolute bottom-5 right-5 h-4 w-4 border-b border-r border-sky/30" />

            {/* Reticle Pusat */}
            <div className="pointer-events-none absolute flex items-center justify-center">
              <div className="h-10 w-10 rounded-full border border-sky/15" />
              <div className="absolute h-1.5 w-1.5 rounded-full bg-sky/30" />
            </div>

            {/* Standby Label */}
            <div className="relative z-10 max-w-sm">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-2xl border border-sky/20 bg-deep/40 text-sky/70">
                <CameraIcon className="h-5 w-5" />
              </div>
              <p className="font-mono text-xs tracking-wider text-sky/70 uppercase">
                {isWarning ? 'Peringatan: Ketiadaan di Pos Terdeteksi' : 'Kamera Optik Stasiun — Siaga'}
              </p>
              <p className="mt-1 font-mono text-[11px] text-sky/40">
                {station.ipCamera}
              </p>
            </div>
          </div>
        )}

        {/* Footer Overlay Status */}
        <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-wrap items-center justify-between gap-2 bg-gradient-to-t from-navy/95 via-navy/60 to-transparent p-3 sm:p-4 text-xs text-soft">
          <div className="flex items-center gap-2">
            <DyeDrop
              className="h-3.5 w-2.5 shrink-0"
              color={isWarning ? '#b0533f' : '#4c8f6b'}
            />
            <span className="text-xs text-soft">
              {isWarning
                ? 'Peringatan: Meja kerja kosong melebihi batas waktu'
                : `Aktivitas: ${station.currentActivity}`}
            </span>
          </div>

          <span className="font-mono text-[11px] text-sky/70">
            Pembatik: {station.assignedWorkerName}
          </span>
        </div>

        {webcamError && (
          <div className="absolute inset-x-4 top-14 z-30 rounded-xl border border-[color:var(--color-warn)]/60 bg-navy/95 p-3 text-xs text-[color:var(--color-warn)]">
            {webcamError}
          </div>
        )}
      </div>

      {/* Kontrol Stream & Uji Cepat (Bebas Emoji) */}
      {showControls && !compact && (
        <div className="border-t border-white/10 bg-deep/30 px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-sky/60">Sumber Tampilan:</span>
              <button
                onClick={() => setUseWebcam(false)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  !useWebcam
                    ? 'bg-ocean text-soft'
                    : 'bg-white/10 text-sky hover:bg-white/15'
                }`}
              >
                Feed Siaga Sanggar
              </button>
              <button
                onClick={() => setUseWebcam(true)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  useWebcam
                    ? 'bg-ocean text-soft'
                    : 'bg-white/10 text-sky hover:bg-white/15'
                }`}
              >
                <CameraIcon className="h-3.5 w-3.5" />
                Kamera Langsung (Webcam)
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {onToggleIdle && (
                <button
                  onClick={onToggleIdle}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                    isSimulatedIdle
                      ? 'bg-[color:var(--color-ok)] text-soft'
                      : 'border border-[color:var(--color-danger)]/60 bg-[color:var(--color-danger)]/15 text-[color:var(--color-danger)] hover:bg-[color:var(--color-danger)]/25'
                  }`}
                >
                  {isSimulatedIdle ? (
                    <>
                      <CheckIcon className="h-3.5 w-3.5" />
                      Simulasikan Pekerja Kembali
                    </>
                  ) : (
                    <>
                      <AlertIcon className="h-3.5 w-3.5" />
                      Simulasikan Tinggalkan Meja
                    </>
                  )}
                </button>
              )}

              {onTriggerAlert && (
                <button
                  onClick={onTriggerAlert}
                  className="flex items-center gap-1.5 rounded-xl border border-sky/40 bg-white/5 px-3 py-1.5 text-xs font-semibold text-sky hover:bg-white/10 transition-all"
                >
                  Uji Pemicu Peringatan
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VisionStream
