import { useEffect, useState, type FC } from 'react'
import { AlertIcon, Canting, CheckIcon, DyeDrop } from './batik'
import { playWarningSound } from '@/lib/audioAlert'

interface InactivityAlertModalProps {
  isOpen: boolean
  workerName: string
  stationName: string
  idleSeconds: number
  onDismiss: () => void
  onRequestBreak: (durationMinutes: number) => void
}

export const InactivityAlertModal: FC<InactivityAlertModalProps> = ({
  isOpen,
  workerName,
  stationName,
  idleSeconds,
  onDismiss,
  onRequestBreak,
}) => {
  const [muted, setMuted] = useState(false)

  // Putar suara peringatan saat modal terbuka
  useEffect(() => {
    if (isOpen && !muted) {
      playWarningSound('warning')
      const interval = setInterval(() => {
        if (!muted) playWarningSound('warning')
      }, 7000)
      return () => clearInterval(interval)
    }
  }, [isOpen, muted])

  if (!isOpen) return null

  const minutes = Math.floor(idleSeconds / 60)
  const seconds = idleSeconds % 60
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop Gelap Blur dengan nuansa Indigo Madder */}
      <div
        className="fixed inset-0 bg-navy/85 backdrop-blur-md transition-opacity"
        onClick={onDismiss}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border-2 border-[color:var(--color-danger)] bg-white p-6 sm:p-8 shadow-2xl">
        {/* Banner Aksen Atas */}
        <div className="absolute left-0 right-0 top-0 h-2 bg-[color:var(--color-danger)]" />

        {/* Header Peringatan */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--color-danger)]/15 text-[color:var(--color-danger)]">
              <AlertIcon className="h-6 w-6" />
            </span>
            <div>
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[color:var(--color-danger)]">
                <DyeDrop className="h-3 w-2" color="#b0533f" /> Sistem Peringatan Kinerja
              </span>
              <h3 className="font-display text-2xl text-navy">
                Ketiadaan di Meja Kerja Terdeteksi
              </h3>
            </div>
          </div>

          <button
            onClick={() => setMuted(!muted)}
            className="rounded-full bg-soft px-3 py-1.5 font-mono text-xs text-deep/70 hover:bg-sky/30 hover:text-navy transition-colors"
          >
            {muted ? 'Audio Mati' : 'Audio Aktif'}
          </button>
        </div>

        <Canting className="mt-4 h-2 w-48 text-[color:var(--color-danger)]/50" />

        {/* Informasi Status Ketiadaan */}
        <div className="mt-6 space-y-3 rounded-2xl border border-[color:var(--color-danger)]/20 bg-soft p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-deep/70">Pembatik:</span>
            <span className="font-semibold text-navy">{workerName}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-deep/70">Stasiun Kerja:</span>
            <span className="font-medium text-navy">{stationName}</span>
          </div>
          <div className="flex items-center justify-between border-t border-sky/40 pt-3 text-sm">
            <span className="text-deep/70">Durasi Tidak di Pos:</span>
            <span className="font-mono text-xl font-bold text-[color:var(--color-danger)]">
              {formattedTime}
            </span>
          </div>
        </div>

        <p className="mt-4 text-[14px] leading-relaxed text-deep/80">
          Kamera optik AI tidak mendeteksi kehadiran Anda di stasiun kerja melebihi batas waktu toleransi
          (3 menit). Silakan konfirmasi kehadiran Anda untuk menjaga akurasi laporan performa sanggar.
        </p>

        {/* Tombol Aksi Tanggapan */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => {
              playWarningSound('resolved')
              onDismiss()
            }}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[color:var(--color-ok)] px-5 py-3.5 font-semibold text-soft shadow transition-all hover:bg-[color:var(--color-ok)]/90 active:scale-[0.98]"
          >
            <CheckIcon className="h-4 w-4" />
            Saya Sudah Kembali di Pos
          </button>

          <button
            onClick={() => {
              playWarningSound('click')
              onRequestBreak(10)
            }}
            className="rounded-2xl border border-sky/80 bg-soft px-4 py-3.5 text-sm font-semibold text-deep hover:bg-sky/20 transition-colors"
          >
            Izin Istirahat / Ambil Lilin (10 Mnt)
          </button>
        </div>

        <p className="mt-3 text-center text-xs text-deep/50">
          Notifikasi ini secara otomatis tercatat pada Log Evaluasi Harian Pemilik Sanggar.
        </p>
      </div>
    </div>
  )
}

/**
 * Floating Warning Banner di bagian atas layar dashboard pekerja
 */
export const InactivityBanner: FC<{
  idleSeconds: number
  onResolve: () => void
}> = ({ idleSeconds, onResolve }) => {
  const minutes = Math.floor(idleSeconds / 60)
  const seconds = idleSeconds % 60
  const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border-2 border-[color:var(--color-danger)] bg-[color:var(--color-danger)]/10 px-5 py-4 text-navy shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[color:var(--color-danger)] text-soft">
          <AlertIcon className="h-5 w-5" />
        </span>
        <div>
          <p className="font-bold text-[color:var(--color-danger)] text-sm sm:text-base">
            Peringatan Kinerja: Ketiadaan di Pos Terdeteksi ({formatted})
          </p>
          <p className="text-xs text-deep/75">
            Sistem kamera mencatat Anda meninggalkan meja kerja melebihi batas waktu toleransi.
          </p>
        </div>
      </div>

      <button
        onClick={() => {
          playWarningSound('resolved')
          onResolve()
        }}
        className="flex items-center gap-1.5 rounded-xl bg-[color:var(--color-ok)] px-4 py-2 text-xs font-semibold text-soft shadow hover:bg-[color:var(--color-ok)]/90 transition-all active:scale-[0.98]"
      >
        <CheckIcon className="h-3.5 w-3.5" />
        Konfirmasi Kembali ke Pos
      </button>
    </div>
  )
}
