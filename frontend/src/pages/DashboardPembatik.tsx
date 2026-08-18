import { useEffect, useState, type FC } from 'react'
import {
  AlertIcon,
  Canting,
  CheckIcon,
  ClockIcon,
  DyeDrop,
  StageMark,
  Tag,
  UserIcon,
} from '@/components/batik'
import {
  CENTRAL_CAMERA,
  DEFAULT_WORKERS,
  INITIAL_AUDIT_LOGS,
  type AuditLog,
  type Worker,
} from '@/lib/ai'
import { VisionStream } from '@/components/VisionStream'
import { InactivityAlertModal, InactivityBanner } from '@/components/InactivityAlertModal'
import { playWarningSound } from '@/lib/audioAlert'

interface DashboardPembatikProps {
  currentWorkerId?: string
  onLogout?: () => void
  onAddLog?: (log: AuditLog) => void
}

export const DashboardPembatik: FC<DashboardPembatikProps> = ({
  currentWorkerId = 'w1',
  onLogout,
  onAddLog,
}) => {
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(currentWorkerId)
  const [workerSimulatedIdle, setWorkerSimulatedIdle] = useState(false)
  const [workerIdleSeconds, setWorkerIdleSeconds] = useState(0)
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false)
  const [sopChecked, setSopChecked] = useState({ s1: true, s2: true, s3: false })

  const worker: Worker =
    DEFAULT_WORKERS.find((w) => w.id === selectedWorkerId) || DEFAULT_WORKERS[0]

  // Filter aktivitas khusus pengrajin yang sedang login
  const personalLogs = INITIAL_AUDIT_LOGS.filter((l) =>
    l.workerName.toLowerCase().includes(worker.name.split(' ')[1]?.toLowerCase() || '')
  )

  // Timer simulasi ketiadaan pekerja
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (workerSimulatedIdle) {
      interval = setInterval(() => {
        setWorkerIdleSeconds((prev) => {
          const next = prev + 1
          if (next >= 180 && !isWarningModalOpen) {
            setIsWarningModalOpen(true)
          }
          return next
        })
      }, 1000)
    } else {
      setWorkerIdleSeconds(0)
    }
    return () => clearInterval(interval)
  }, [workerSimulatedIdle, isWarningModalOpen])

  // Trigger peringatan ketiadaan
  const handleTriggerWarning = () => {
    setWorkerSimulatedIdle(true)
    setWorkerIdleSeconds(185)
    setIsWarningModalOpen(true)

    if (onAddLog) {
      onAddLog({
        id: `log-${Date.now()}`,
        timestamp:
          new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        workerName: worker.name,
        stationId: 'cam-central',
        stationName: worker.currentLocation || 'Meja Kerja Sanggar',
        type: 'inactivity_warning',
        location: worker.currentLocation || 'Meja Kerja Sanggar',
        durationMinutes: 3.1,
        severity: 'high',
        status: 'active_alert',
        note: `Pengrajin ${worker.name} terdeteksi meninggalkan meja kerja melebihi batas waktu 3 menit.`,
      })
    }
  }

  // Konfirmasi pekerja kembali
  const handleWorkerReturn = () => {
    setWorkerSimulatedIdle(false)
    setWorkerIdleSeconds(0)
    setIsWarningModalOpen(false)

    if (onAddLog) {
      onAddLog({
        id: `log-${Date.now()}`,
        timestamp:
          new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        workerName: worker.name,
        stationId: 'cam-central',
        stationName: worker.currentLocation || 'Meja Kerja Sanggar',
        type: 'resumed',
        location: worker.currentLocation || 'Meja Kerja Sanggar',
        durationMinutes: Math.round(workerIdleSeconds / 60) || 3,
        severity: 'medium',
        status: 'resolved',
        note: `Pengrajin ${worker.name} telah mengonfirmasi kembali aktif di pos kerja.`,
      })
    }
  }

  // Pengajuan izin istirahat
  const handleRequestBreak = (mins: number) => {
    setIsWarningModalOpen(false)
    setWorkerSimulatedIdle(false)
    setWorkerIdleSeconds(0)

    if (onAddLog) {
      onAddLog({
        id: `log-${Date.now()}`,
        timestamp:
          new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        workerName: worker.name,
        stationId: 'cam-central',
        stationName: worker.currentLocation || 'Meja Kerja Sanggar',
        type: 'break_start',
        location: worker.currentLocation || 'Meja Kerja Sanggar',
        destinationLocation: 'Ruang Istirahat Sanggar',
        durationMinutes: mins,
        severity: 'low',
        status: 'approved',
        note: `Pengrajin ${worker.name} mengajukan izin istirahat / ambil bahan selama ${mins} menit.`,
      })
    }
  }

  return (
    <main className="mx-auto max-w-[1180px] px-5 pb-24 pt-8 sm:px-8">
      {/* Banner Peringatan Ketiadaan */}
      {workerSimulatedIdle && (
        <InactivityBanner
          idleSeconds={workerIdleSeconds}
          onResolve={handleWorkerReturn}
        />
      )}

      {/* Modal Peringatan */}
      <InactivityAlertModal
        isOpen={isWarningModalOpen}
        workerName={worker.name}
        stationName={worker.currentLocation || 'Meja Kerja Sanggar'}
        idleSeconds={workerIdleSeconds}
        onDismiss={handleWorkerReturn}
        onRequestBreak={handleRequestBreak}
      />

      {/* Bar Header Stasiun Pembatik */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-sky/70 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ocean text-soft">
            <UserIcon className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-ocean">
                Dashboard Kerja Pembatik
              </span>
              <span className="rounded-full bg-[color:var(--color-ok)]/15 px-2 py-0.5 font-mono text-[11px] font-semibold text-[color:var(--color-ok)]">
                Terhubung ke Kamera Sentral
              </span>
            </div>
            <h1 className="font-display text-2xl text-navy sm:text-3xl">
              {worker.name}
            </h1>
            <p className="text-xs text-deep/70">
              Posisi: {worker.currentLocation} · Keahlian: {worker.skill}
            </p>
          </div>
        </div>

        {/* Profil Pembatik Switcher & Logout */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedWorkerId}
            onChange={(e) => setSelectedWorkerId(e.target.value)}
            className="rounded-xl border border-sky/70 bg-soft px-3 py-2 text-xs font-semibold text-navy outline-none focus:border-ocean transition-colors"
          >
            {DEFAULT_WORKERS.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name} ({w.skill})
              </option>
            ))}
          </select>

          {onLogout && (
            <button
              onClick={onLogout}
              className="rounded-xl border border-sky/60 bg-white px-3 py-2 text-xs font-semibold text-deep/70 hover:bg-sky/20 hover:text-navy transition-colors"
            >
              Keluar Akun
            </button>
          )}
        </div>
      </div>

      {/* Panel Pengujian Sistem Peringatan AI */}
      <div className="mt-6 rounded-3xl border border-sky/60 bg-soft p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-deep/70">
              Panel Pengujian Sistem Peringatan AI
            </span>
            <p className="text-xs text-deep/60 mt-0.5">
              Simulasikan kondisi meja kerja untuk menguji timer ketiadaan dan pemicu modal peringatan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setWorkerSimulatedIdle(false)
                setWorkerIdleSeconds(0)
                setIsWarningModalOpen(false)
                playWarningSound('click')
              }}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                !workerSimulatedIdle
                  ? 'bg-[color:var(--color-ok)] text-soft shadow-sm'
                  : 'border border-sky/60 bg-white text-deep hover:bg-sky/20'
              }`}
            >
              <CheckIcon className="h-3.5 w-3.5" />
              1. Posisi Aktif Membatik
            </button>

            <button
              onClick={() => {
                setWorkerSimulatedIdle(true)
                setWorkerIdleSeconds(182)
                setIsWarningModalOpen(true)
                playWarningSound('warning')
              }}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                workerSimulatedIdle
                  ? 'bg-[color:var(--color-danger)] text-soft shadow-sm'
                  : 'border border-[color:var(--color-danger)]/60 bg-white text-[color:var(--color-danger)] hover:bg-red-50'
              }`}
            >
              <AlertIcon className="h-3.5 w-3.5" />
              2. Tinggalkan Meja (&gt; 3 Mnt)
            </button>

            <button
              onClick={() => handleRequestBreak(10)}
              className="flex items-center gap-1.5 rounded-xl border border-sky/70 bg-white px-3 py-2 text-xs font-semibold text-deep hover:bg-sky/20 transition-all"
            >
              <ClockIcon className="h-3.5 w-3.5" />
              3. Izin Istirahat / Ambil Lilin
            </button>
          </div>
        </div>
      </div>

      {/* Grid Utama Stasiun Kerja */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr]">
        {/* Kolom 1: Stream Kamera Sentral (Blank Standby / Webcam) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <StageMark
              numeral="satu"
              title="Feed Kamera Sentral Sanggar"
              sub={`Kamera sentral terhubung ke: ${CENTRAL_CAMERA.ipCamera}`}
            />
          </div>

          <VisionStream
            station={CENTRAL_CAMERA}
            isSimulatedIdle={workerSimulatedIdle}
            showControls={true}
            onToggleIdle={() => {
              if (workerSimulatedIdle) {
                handleWorkerReturn()
              } else {
                handleTriggerWarning()
              }
            }}
            onTriggerAlert={handleTriggerWarning}
          />

          {/* Timeline Aktivitas Personal Anda */}
          <div className="rounded-3xl border border-sky/60 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-sky/30 pb-3">
              <Tag>Laporan Aktivitas Anda Hari Ini</Tag>
              <span className="text-xs font-mono text-deep/60">Terpantau Kamera Sentral</span>
            </div>

            <div className="mt-4 space-y-3">
              {personalLogs.length > 0 ? (
                personalLogs.map((plog) => (
                  <div
                    key={plog.id}
                    className="flex items-start gap-3 rounded-2xl border border-sky/30 bg-soft p-3.5 text-xs text-navy"
                  >
                    <span className="font-mono font-bold text-ocean shrink-0">
                      {plog.timestamp}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-navy">{plog.note}</p>
                      <p className="text-[11px] text-deep/60 mt-1 font-mono">
                        Lokasi: {plog.location} {plog.durationMinutes ? `(Durasi: ${plog.durationMinutes} mnt)` : ''}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-deep/60 italic">
                  Belum ada aktivitas tercatat di luar meja kerja.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Kolom 2: Target Harian, SOP & Status Kehadiran */}
        <div className="flex flex-col gap-5">
          {/* Target Harian */}
          <div className="rounded-3xl border border-sky/60 bg-white p-6 shadow-sm">
            <Tag>Target Harian Anda</Tag>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="font-display text-3xl text-navy">
                {worker.rate} <span className="text-base text-deep/60">Lembar / Hari</span>
              </span>
              <span className="rounded-full bg-[color:var(--color-ok)]/15 px-3 py-1 font-mono text-xs font-semibold text-[color:var(--color-ok)]">
                Progres: 72% Selesai
              </span>
            </div>

            <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-sky/30">
              <div
                className="h-full rounded-full bg-ocean transition-all duration-500"
                style={{ width: '72%' }}
              />
            </div>

            <div className="mt-4 space-y-2 border-t border-sky/30 pt-3 text-xs text-deep/75">
              <div className="flex justify-between">
                <span>Motif Pengerjaan:</span>
                <span className="font-semibold text-navy">Pinto Aceh (2.4m Primissima)</span>
              </div>
              <div className="flex justify-between">
                <span>Posisi Kerja:</span>
                <span className="font-semibold text-ocean">{worker.currentLocation}</span>
              </div>
            </div>
          </div>

          {/* Checklist Standar Operasional (SOP Canting) */}
          <div className="rounded-3xl border border-sky/60 bg-white p-6 shadow-sm">
            <Tag>SOP Mutu Sanggar</Tag>
            <h4 className="mt-2 font-display text-xl text-navy">Standar Pengerjaan</h4>
            <div className="mt-4 space-y-3 text-xs text-deep">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sopChecked.s1}
                  onChange={(e) => setSopChecked({ ...sopChecked, s1: e.target.checked })}
                  className="mt-0.5 rounded border-sky/70 text-ocean focus:ring-ocean"
                />
                <span>Wajan lilin malam dijaga pada suhu optimal 65°–70°C.</span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sopChecked.s2}
                  onChange={(e) => setSopChecked({ ...sopChecked, s2: e.target.checked })}
                  className="mt-0.5 rounded border-sky/70 text-ocean focus:ring-ocean"
                />
                <span>Goresan canting tembus bolak-balik serat mori primissima.</span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sopChecked.s3}
                  onChange={(e) => setSopChecked({ ...sopChecked, s3: e.target.checked })}
                  className="mt-0.5 rounded border-sky/70 text-ocean focus:ring-ocean"
                />
                <span>Pemeriksaan garis isen-isen sebelum pelorodan lilin.</span>
              </label>
            </div>
          </div>

          {/* Status Kehadiran Hari Ini */}
          <div
            className="rounded-3xl border border-ocean/30 p-6 text-soft shadow-sm"
            style={{ backgroundImage: 'linear-gradient(180deg,#0a1931,#1a3d63 65%,#2f5b83)' }}
          >
            <Tag invert>Catatan Kehadiran Hari Ini</Tag>
            <p className="mt-2 font-display text-2xl leading-tight">
              {workerSimulatedIdle ? 'Peringatan: Tidak di Meja Kerja' : 'Hadir & Beraktivitas Normal'}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/15 pt-3 font-mono text-xs text-sky/85">
              <div>
                <span className="text-sky/60 block">Waktu Mulai:</span>
                <span>08:00 WIB</span>
              </div>
              <div>
                <span className="text-sky/60 block">Waktu Aktif:</span>
                <span>{worker.activeHoursToday} Jam</span>
              </div>
              <div>
                <span className="text-sky/60 block">Total Istirahat:</span>
                <span>{worker.breakMinutesToday} Menit</span>
              </div>
              <div>
                <span className="text-sky/60 block">Skor Kepatuhan:</span>
                <span className="text-[color:var(--color-ok)]">{worker.complianceScore}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default DashboardPembatik
