import type { FC, ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Canting, DyeDrop, StageMark, Tag } from '@/components/batik'
import {
  DEFAULT_MATERIALS,
  DEFAULT_WORKERS,
  INITIAL_AUDIT_LOGS,
  WORKSTATIONS,
  type AuditLog,
  type Material,
  type Worker,
  type Workstation,
  computeAI,
  fmtDate,
  rupiah,
} from '@/lib/ai'
import { VisionStream } from '@/components/VisionStream'
import { InactivityAlertModal, InactivityBanner } from '@/components/InactivityAlertModal'
import { playWarningSound } from '@/lib/audioAlert'

type Role = 'owner' | 'worker'
type OwnerTab = 'surveillance' | 'logs' | 'capacity'

let uid = 100
const nextId = () => `x${uid++}`

const Seller: FC = () => {
  // Role & Tab State
  const [role, setRole] = useState<Role>('owner')
  const [ownerTab, setOwnerTab] = useState<OwnerTab>('surveillance')
  const [selectedStationId, setSelectedStationId] = useState<string>('st-1')
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>('w1')

  // Data State
  const [workstations, setWorkstations] = useState<Workstation[]>(WORKSTATIONS)
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS)
  const [logFilter, setLogFilter] = useState<'all' | 'warning' | 'resolved'>('all')
  const [workers, setWorkers] = useState<Worker[]>(DEFAULT_WORKERS)
  const [materials, setMaterials] = useState<Material[]>(DEFAULT_MATERIALS)
  const [target, setTarget] = useState(40)

  // Worker Inactivity State
  const [workerSimulatedIdle, setWorkerSimulatedIdle] = useState(false)
  const [workerIdleSeconds, setWorkerIdleSeconds] = useState(0)
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false)

  // AI Calculations for Production Capacity
  const dailyCapacity = workers.reduce((s, w) => s + (w.rate || 0), 0)
  const ai = useMemo(() => computeAI(target, dailyCapacity), [target, dailyCapacity])
  const alloc = useMemo(() => allocate(workers, ai.poQty), [workers, ai.poQty])

  // Timer simulasi ketidakhadiran pekerja
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

  // Dapatkan stasiun aktif saat ini
  const activeStation =
    workstations.find((s) => s.id === selectedStationId) || workstations[0]
  const currentWorker =
    workers.find((w) => w.id === selectedWorkerId) || workers[0]

  // Handler untuk trigger warning ketiadaan
  const handleTriggerWarning = () => {
    setWorkerSimulatedIdle(true)
    setWorkerIdleSeconds(185)
    setIsWarningModalOpen(true)

    // Tambahkan ke log audit secara real-time
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      workerName: currentWorker.name,
      stationId: activeStation.id,
      stationName: activeStation.name,
      type: 'inactivity_warning',
      durationMinutes: 3.1,
      severity: 'high',
      status: 'active_alert',
      note: 'Kamera mendeteksi pekerja meninggalkan pos melebihi batas waktu 3 menit.',
    }
    setAuditLogs((prev) => [newLog, ...prev])
  }

  // Handler konfirmasi pekerja kembali
  const handleWorkerReturn = () => {
    setWorkerSimulatedIdle(false)
    setWorkerIdleSeconds(0)
    setIsWarningModalOpen(false)

    // Perbarui stasiun kerja menjadi aktif
    setWorkstations((prev) =>
      prev.map((s) =>
        s.id === selectedStationId ? { ...s, status: 'active', idleSeconds: 0 } : s
      )
    )

    // Catat log kembali bekerja
    const resolvedLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      workerName: currentWorker.name,
      stationId: activeStation.id,
      stationName: activeStation.name,
      type: 'resumed',
      durationMinutes: Math.round(workerIdleSeconds / 60) || 3,
      severity: 'medium',
      status: 'resolved',
      note: 'Pekerja telah mengonfirmasi kembali aktif di pos kerja.',
    }
    setAuditLogs((prev) => [resolvedLog, ...prev])
  }

  // Handler izin istirahat / ambil bahan
  const handleRequestBreak = (mins: number) => {
    setIsWarningModalOpen(false)
    setWorkerSimulatedIdle(false)
    setWorkerIdleSeconds(0)

    const breakLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      workerName: currentWorker.name,
      stationId: activeStation.id,
      stationName: activeStation.name,
      type: 'break_start',
      durationMinutes: mins,
      severity: 'low',
      status: 'approved',
      note: `Izin sementara selama ${mins} menit untuk pengambilan bahan lilin / istirahat.`,
    }
    setAuditLogs((prev) => [breakLog, ...prev])
  }

  return (
    <main className="mx-auto max-w-[1180px] px-5 pb-28 pt-8 sm:px-8">
      {/* Role Switcher Bar - Desain Elegan & Jelas */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-sky/70 bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-navy text-xl text-soft shadow-inner">
            {role === 'owner' ? '👑' : '🧵'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-ocean">
                Role & Hak Akses
              </span>
              <span className="rounded-full bg-sky/30 px-2 py-0.5 font-mono text-[11px] text-deep">
                RBAC Aktif
              </span>
            </div>
            <p className="font-display text-lg sm:text-xl text-navy">
              {role === 'owner'
                ? 'Dashboard Pemilik Sanggar (Owner)'
                : `Dashboard Kerja Staf: ${currentWorker.name}`}
            </p>
          </div>
        </div>

        {/* Toggle Switcher Role */}
        <div className="flex rounded-2xl border border-sky/80 bg-soft p-1.5 shadow-inner">
          <button
            onClick={() => {
              playWarningSound('click')
              setRole('owner')
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
              role === 'owner'
                ? 'bg-navy text-soft shadow-sm'
                : 'text-deep/70 hover:text-navy'
            }`}
          >
            <span>👑</span> Owner (Pemilik)
          </button>
          <button
            onClick={() => {
              playWarningSound('click')
              setRole('worker')
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
              role === 'worker'
                ? 'bg-ocean text-soft shadow-sm'
                : 'text-deep/70 hover:text-navy'
            }`}
          >
            <span>🧵</span> Pekerja (Staf)
          </button>
        </div>
      </div>

      {/* Warning Modal untuk Pekerja jika Inactivity Terdeteksi */}
      <InactivityAlertModal
        isOpen={isWarningModalOpen && role === 'worker'}
        workerName={currentWorker.name}
        stationName={activeStation.name}
        idleSeconds={workerIdleSeconds}
        onDismiss={handleWorkerReturn}
        onRequestBreak={handleRequestBreak}
      />

      {/* ========================================================================= */}
      {/* TAMPILAN ROLE OWNER (PEMILIK SANGGAR)                                     */}
      {/* ========================================================================= */}
      {role === 'owner' && (
        <div className="mt-8 space-y-8 animate-in fade-in duration-300">
          {/* Header & Sub-Navigasi Owner */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-sky/40 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <DyeDrop className="h-4 w-3" />
                <span className="text-sm font-semibold text-ocean">
                  Pusat Kendali Sanggar
                </span>
              </div>
              <h1 className="mt-1 font-display text-3xl text-navy">
                Monitoring & Manajemen Kinerja
              </h1>
              <p className="mt-1 text-sm text-deep/70">
                Pengawasan AI Optical Vision stasiun kerja, audit kepatuhan, dan simulasi kapasitas.
              </p>
            </div>

            {/* Sub-tabs Owner */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setOwnerTab('surveillance')}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  ownerTab === 'surveillance'
                    ? 'bg-ocean text-soft shadow-sm'
                    : 'border border-sky/70 bg-white text-deep hover:bg-sky/20'
                }`}
              >
                📹 Pengawasan Kamera AI
              </button>
              <button
                onClick={() => setOwnerTab('logs')}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  ownerTab === 'logs'
                    ? 'bg-ocean text-soft shadow-sm'
                    : 'border border-sky/70 bg-white text-deep hover:bg-sky/20'
                }`}
              >
                📜 Log & Evaluasi ({auditLogs.filter((l) => l.status === 'active_alert').length} Peringatan)
              </button>
              <button
                onClick={() => setOwnerTab('capacity')}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  ownerTab === 'capacity'
                    ? 'bg-ocean text-soft shadow-sm'
                    : 'border border-sky/70 bg-white text-deep hover:bg-sky/20'
                }`}
              >
                ⚙️ Digital Twin & HPP
              </button>
            </div>
          </div>

          {/* Metric Cards Ringkasan Kinerja */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-sky/60 bg-white p-5 shadow-sm">
              <Tag>Tingkat Kepatuhan</Tag>
              <p className="mt-2 font-display text-3xl text-navy">96.4%</p>
              <div className="mt-2 flex items-center justify-between text-xs text-deep/70">
                <span>Rata-rata 4 Stasiun</span>
                <span className="font-semibold text-[color:var(--color-ok)]">↑ 2.1% minggu ini</span>
              </div>
            </div>

            <div className="rounded-2xl border border-sky/60 bg-white p-5 shadow-sm">
              <Tag>Jam Kerja Aktif</Tag>
              <p className="mt-2 font-display text-3xl text-navy">31.8 Jam</p>
              <div className="mt-2 flex items-center justify-between text-xs text-deep/70">
                <span>Efektivitas Pengerjaan</span>
                <span className="font-mono text-ocean">92% On-Workstation</span>
              </div>
            </div>

            <div className="rounded-2xl border border-sky/60 bg-white p-5 shadow-sm">
              <Tag>Insiden Ketiadaan Pos</Tag>
              <p className="mt-2 font-display text-3xl text-[color:var(--color-warn)]">
                {auditLogs.filter((l) => l.type === 'inactivity_warning').length} Terdeteksi
              </p>
              <div className="mt-2 flex items-center justify-between text-xs text-deep/70">
                <span>Batas Toleransi: 3 Mnt</span>
                <span className="font-semibold text-[color:var(--color-ok)]">
                  {auditLogs.filter((l) => l.status === 'resolved').length} Terselesaikan
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-sky/60 bg-white p-5 shadow-sm">
              <Tag>Kapasitas Harian Sanggar</Tag>
              <p className="mt-2 font-display text-3xl text-navy">
                {dailyCapacity.toFixed(2)} <span className="text-base text-deep/60">lbr/hari</span>
              </p>
              <div className="mt-2 flex items-center justify-between text-xs text-deep/70">
                <span>{workers.length} Pembatik Aktif</span>
                <span className="font-mono text-ocean">4 Stasiun AI</span>
              </div>
            </div>
          </div>

          {/* TAB 1: PENGAWASAN KAMERA AI (GRID & EXPANDED STREAM) */}
          {ownerTab === 'surveillance' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <StageMark
                  numeral="satu"
                  title="Grid Kamera Cerdas Stasiun Kerja"
                  sub="Inference model Computer Vision mendeteksi keberadaan pembatik, alat canting, dan bahan secara real-time."
                />
              </div>

              {/* Grid 4 Kamera Stasiun Kerja */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {workstations.map((st) => {
                  const isSelected = st.id === selectedStationId
                  const isAlert = st.status === 'warning'

                  return (
                    <div
                      key={st.id}
                      onClick={() => setSelectedStationId(st.id)}
                      className={`cursor-pointer rounded-3xl border-2 transition-all duration-200 overflow-hidden bg-white p-4 ${
                        isSelected
                          ? 'border-ocean ring-2 ring-ocean/30 shadow-md'
                          : isAlert
                            ? 'border-[color:var(--color-danger)]/80 bg-red-50/10'
                            : 'border-sky/60 hover:border-sky'
                      }`}
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${
                              isAlert ? 'bg-[color:var(--color-danger)] animate-ping' : 'bg-[color:var(--color-ok)]'
                            }`}
                          />
                          <span className="font-display text-lg text-navy">{st.name}</span>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            isAlert
                              ? 'bg-[color:var(--color-danger)]/15 text-[color:var(--color-danger)]'
                              : 'bg-[color:var(--color-ok)]/15 text-[color:var(--color-ok)]'
                          }`}
                        >
                          {isAlert ? '⚠️ Pos Kosong' : '✓ Normal'}
                        </span>
                      </div>

                      {/* Preview Stream Mini */}
                      <VisionStream station={st} compact showControls={false} />

                      {/* Detail Status Stasiun */}
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-deep/75 font-mono border-t border-sky/30 pt-2.5">
                        <div>
                          <span className="text-deep/50 block">Pembatik:</span>
                          <span className="font-sans font-semibold text-navy">
                            {st.assignedWorkerName}
                          </span>
                        </div>
                        <div>
                          <span className="text-deep/50 block">Tahap Kerja:</span>
                          <span className="text-ocean font-sans">{st.stage}</span>
                        </div>
                        <div className="col-span-2 flex items-center justify-between text-[11px] pt-1">
                          <span className="text-deep/60">Kepatuhan: {st.complianceRate}%</span>
                          <span className="text-ocean font-sans font-semibold">
                            {isSelected ? '● Sedang Ditampilkan Penuh' : 'Klik untuk perbesar →'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Tampilan Terfokus Stasiun yang Dipilih */}
              <div className="mt-8 rounded-3xl border border-sky/70 bg-white p-6 sm:p-8 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <Tag>Stream Terfokus</Tag>
                    <h3 className="font-display text-2xl text-navy">
                      {activeStation.name} — {activeStation.assignedWorkerName}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-soft px-3 py-1 text-xs font-mono text-deep">
                      IP: {activeStation.ipCamera}
                    </span>
                  </div>
                </div>

                <VisionStream
                  station={activeStation}
                  showControls={true}
                  onTriggerAlert={handleTriggerWarning}
                />
              </div>
            </div>
          )}

          {/* TAB 2: LAPORAN & AUDIT LOG EVALUASI */}
          {ownerTab === 'logs' && (
            <div className="space-y-6">
              <StageMark
                numeral="dua"
                title="Laporan & Log Evaluasi Kehadiran"
                sub="Catatan otomatis deteksi ketidakhadiran di meja kerja untuk evaluasi kinerja harian dan perhitungan upah adil."
              />

              {/* Filter Log Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-sky/60 bg-white p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-deep/70">Filter Status:</span>
                  <button
                    onClick={() => setLogFilter('all')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                      logFilter === 'all'
                        ? 'bg-navy text-soft'
                        : 'bg-soft text-deep hover:bg-sky/20'
                    }`}
                  >
                    Semua Catatan ({auditLogs.length})
                  </button>
                  <button
                    onClick={() => setLogFilter('warning')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                      logFilter === 'warning'
                        ? 'bg-[color:var(--color-danger)] text-soft'
                        : 'bg-soft text-deep hover:bg-sky/20'
                    }`}
                  >
                    Peringatan Ketiadaan ({auditLogs.filter((l) => l.type === 'inactivity_warning').length})
                  </button>
                  <button
                    onClick={() => setLogFilter('resolved')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                      logFilter === 'resolved'
                        ? 'bg-[color:var(--color-ok)] text-soft'
                        : 'bg-soft text-deep hover:bg-sky/20'
                    }`}
                  >
                    Terselesaikan ({auditLogs.filter((l) => l.status === 'resolved').length})
                  </button>
                </div>

                <button
                  onClick={() => alert('Laporan audit harian berhasil diekspor ke CSV!')}
                  className="rounded-xl border border-ocean bg-ocean/10 px-3.5 py-1.5 text-xs font-semibold text-ocean hover:bg-ocean hover:text-soft transition-all"
                >
                  📥 Unduh Rekap Audit (CSV)
                </button>
              </div>

              {/* Tabel Log */}
              <div className="overflow-hidden rounded-3xl border border-sky/60 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-deep">
                    <thead className="border-b border-sky/50 bg-soft font-mono text-xs text-navy">
                      <tr>
                        <th className="px-5 py-3.5">Waktu</th>
                        <th className="px-5 py-3.5">Pembatik / Staf</th>
                        <th className="px-5 py-3.5">Stasiun Kerja</th>
                        <th className="px-5 py-3.5">Durasi Tidak di Pos</th>
                        <th className="px-5 py-3.5">Tingkat Insiden</th>
                        <th className="px-5 py-3.5">Status</th>
                        <th className="px-5 py-3.5">Keterangan AI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sky/20">
                      {auditLogs
                        .filter((l) => {
                          if (logFilter === 'warning') return l.type === 'inactivity_warning'
                          if (logFilter === 'resolved') return l.status === 'resolved'
                          return true
                        })
                        .map((log) => {
                          let badgeBg = 'bg-sky/20 text-deep'
                          let badgeText = 'Info'
                          if (log.severity === 'high') {
                            badgeBg = 'bg-[color:var(--color-danger)]/15 text-[color:var(--color-danger)]'
                            badgeText = 'Tinggi'
                          } else if (log.severity === 'medium') {
                            badgeBg = 'bg-[color:var(--color-warn)]/15 text-[color:var(--color-warn)]'
                            badgeText = 'Sedang'
                          } else {
                            badgeBg = 'bg-[color:var(--color-ok)]/15 text-[color:var(--color-ok)]'
                            badgeText = 'Rendah'
                          }

                          return (
                            <tr key={log.id} className="hover:bg-soft/60 transition-colors">
                              <td className="whitespace-nowrap px-5 py-4 font-mono text-xs text-navy font-medium">
                                {log.timestamp}
                              </td>
                              <td className="whitespace-nowrap px-5 py-4 font-semibold text-navy">
                                {log.workerName}
                              </td>
                              <td className="whitespace-nowrap px-5 py-4 text-xs text-deep/80">
                                {log.stationName}
                              </td>
                              <td className="whitespace-nowrap px-5 py-4 font-mono text-xs">
                                {log.durationMinutes ? `${log.durationMinutes} menit` : '—'}
                              </td>
                              <td className="whitespace-nowrap px-5 py-4">
                                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeBg}`}>
                                  {badgeText}
                                </span>
                              </td>
                              <td className="whitespace-nowrap px-5 py-4">
                                <span
                                  className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                                    log.status === 'active_alert'
                                      ? 'text-[color:var(--color-danger)] font-bold animate-pulse'
                                      : log.status === 'resolved'
                                        ? 'text-[color:var(--color-ok)]'
                                        : 'text-ocean'
                                  }`}
                                >
                                  <span
                                    className={`h-1.5 w-1.5 rounded-full ${
                                      log.status === 'active_alert'
                                        ? 'bg-[color:var(--color-danger)]'
                                        : log.status === 'resolved'
                                          ? 'bg-[color:var(--color-ok)]'
                                          : 'bg-ocean'
                                    }`}
                                  />
                                  {log.status === 'active_alert'
                                    ? 'Peringatan Aktif'
                                    : log.status === 'resolved'
                                      ? 'Terselesaikan'
                                      : 'Disetujui'}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-xs text-deep/75 max-w-xs">
                                {log.note}
                              </td>
                            </tr>
                          )
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DIGITAL TWIN, KAPASITAS SANGGAR & HPP */}
          {ownerTab === 'capacity' && (
            <div className="space-y-8">
              <StageMark
                numeral="tiga"
                title="Kapasitas Sanggar & Simulasi HPP"
                sub="Mesin AI menghitung kesanggupan pengerjaan pesanan, kebutuhan bahan baku, serta batas harga sehat."
              />

              {/* Form Input & Output AI */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_1fr]">
                {/* Kolom input mentah */}
                <div className="flex flex-col gap-10">
                  {/* Pekerja */}
                  <section>
                    <StageMark
                      numeral="satu"
                      title="Tangan yang membatik"
                      sub="Berapa lembar sanggup diselesaikan tiap orang dalam sehari?"
                    />
                    <div className="flex flex-col gap-3">
                      {workers.map((w, i) => (
                        <div key={w.id} className="rounded-2xl border border-sky/60 bg-white p-4">
                          <div className="flex items-center justify-between">
                            <span className="hand-numeral text-xl text-ocean/70">
                              Pembatik {i + 1}
                            </span>
                            {workers.length > 1 && (
                              <button
                                onClick={() => setWorkers(workers.filter((x) => x.id !== w.id))}
                                className="text-[13px] text-deep/50 hover:text-[color:var(--color-danger)]"
                              >
                                hapus
                              </button>
                            )}
                          </div>
                          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-[1.2fr_1.2fr_auto]">
                            <Field label="Nama">
                              <input
                                value={w.name}
                                onChange={(e) => patch(setWorkers, workers, w.id, { name: e.target.value })}
                                className={inputCls}
                                placeholder="mis. Bu Nuraini"
                              />
                            </Field>
                            <Field label="Keahlian">
                              <input
                                value={w.skill}
                                onChange={(e) => patch(setWorkers, workers, w.id, { skill: e.target.value })}
                                className={inputCls}
                                placeholder="mis. pewarnaan indigo"
                              />
                            </Field>
                            <Field label="Lembar / hari">
                              <input
                                type="number"
                                step="0.05"
                                min={0}
                                value={w.rate}
                                onChange={(e) => patch(setWorkers, workers, w.id, { rate: Number(e.target.value) })}
                                className={`${inputCls} w-24 text-center font-mono`}
                              />
                            </Field>
                          </div>
                        </div>
                      ))}
                      <AddBtn onClick={() => setWorkers([...workers, { id: nextId(), name: '', skill: '', rate: 0.5 }])}>
                        Tambah pembatik
                      </AddBtn>
                    </div>
                  </section>

                  {/* Material */}
                  <section>
                    <StageMark
                      numeral="dua"
                      title="Bahan di gudang"
                      sub="Beli banyak sekaligus, supplier beri harga miring — batas diskonnya diisi di sini."
                    />
                    <div className="flex flex-col gap-3">
                      {materials.map((m) => {
                        const discount = m.need >= m.minDiscount
                        return (
                          <div key={m.id} className="rounded-2xl border border-sky/60 bg-white p-4">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1.6fr_1fr_1fr_auto] sm:items-end">
                              <Field label="Nama bahan">
                                <input
                                  value={m.name}
                                  onChange={(e) => patch(setMaterials, materials, m.id, { name: e.target.value })}
                                  className={inputCls}
                                  placeholder="mis. malam / lilin"
                                />
                              </Field>
                              <Field label={`Kebutuhan (${m.unit})`}>
                                <input
                                  type="number"
                                  min={0}
                                  value={m.need}
                                  onChange={(e) => patch(setMaterials, materials, m.id, { need: Number(e.target.value) })}
                                  className={`${inputCls} font-mono`}
                                />
                              </Field>
                              <Field label="Min. diskon">
                                <input
                                  type="number"
                                  min={0}
                                  value={m.minDiscount}
                                  onChange={(e) => patch(setMaterials, materials, m.id, { minDiscount: Number(e.target.value) })}
                                  className={`${inputCls} font-mono`}
                                />
                              </Field>
                              {materials.length > 1 && (
                                <button
                                  onClick={() => setMaterials(materials.filter((x) => x.id !== m.id))}
                                  className="pb-2.5 text-[13px] text-deep/50 hover:text-[color:var(--color-danger)]"
                                >
                                  hapus
                                </button>
                              )}
                            </div>
                            <p
                              className="mt-2 text-[13px] font-medium"
                              style={{ color: discount ? 'var(--color-ok)' : 'var(--color-warn)' }}
                            >
                              {discount
                                ? `✓ Cukup untuk harga grosir — hemat bahan aktif`
                                : `Kurang ${m.minDiscount - m.need} ${m.unit} lagi untuk dapat harga grosir`}
                            </p>
                          </div>
                        )
                      })}
                      <AddBtn onClick={() => setMaterials([...materials, { id: nextId(), name: '', need: 0, unit: 'kg', minDiscount: 10 }])}>
                        Tambah jenis bahan
                      </AddBtn>
                    </div>
                  </section>
                </div>

                {/* Kolom hasil AI */}
                <div className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
                  {/* Uji kesanggupan */}
                  <div className="rounded-3xl border border-sky/60 bg-white p-6">
                    <Tag>Uji kesanggupan</Tag>
                    <p className="mt-2 text-[15px] text-deep/70">Ada pesanan masuk sekian lembar — sanggup?</p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center rounded-2xl border border-sky/70 bg-soft">
                        <button
                          onClick={() => setTarget(Math.max(1, target - 1))}
                          className="h-11 w-11 text-xl text-deep hover:text-ocean"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={target}
                          min={1}
                          onChange={(e) => setTarget(Math.max(1, Math.round(Number(e.target.value) || 1)))}
                          className="w-20 bg-transparent py-2.5 text-center font-display text-xl text-navy outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button
                          onClick={() => setTarget(target + 1)}
                          className="h-11 w-11 text-xl text-deep hover:text-ocean"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm text-deep/60">lembar</span>
                    </div>
                  </div>

                  {/* Kesanggupan & SLA */}
                  <div
                    className="rounded-3xl border border-ocean/30 p-6 text-soft"
                    style={{ backgroundImage: 'linear-gradient(180deg,#0a1931,#1a3d63 65%,#2f5b83)' }}
                  >
                    <Tag invert>Sanggup selesai</Tag>
                    <p className="mt-2 font-display text-2xl leading-tight">{fmtDate(ai.slaDate)}</p>
                    <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/15 pt-4 font-mono text-[13px] text-sky/85">
                      <Stat label="Kapasitas sanggar" value={`${dailyCapacity.toFixed(2)} lbr/hari`} />
                      <Stat label="Dibuat baru" value={`${ai.poQty} lembar`} />
                      <Stat label="Dari stok siap" value={`${ai.readyUsed} lembar`} />
                      <Stat label="Total waktu" value={`${Math.ceil(ai.totalDays)} hari`} />
                    </div>
                  </div>

                  {/* Pembagian kerja — Digital Twin */}
                  <div className="rounded-3xl border border-sky/60 bg-white p-6">
                    <Tag>Pembagian ke pembatik</Tag>
                    <p className="mt-1 text-[15px] text-deep/70">
                      {ai.poQty} lembar dibagi adil sesuai kecepatan tiap orang.
                    </p>
                    <div className="mt-4 flex flex-col gap-3">
                      {alloc.map((a) => (
                        <div key={a.id}>
                          <div className="flex items-baseline justify-between text-sm">
                            <span className="font-medium text-navy">{a.name || 'Pembatik'}</span>
                            <span className="font-mono text-navy">{a.assigned} lbr</span>
                          </div>
                          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-sky/40">
                            <div
                              className="h-full rounded-full bg-ocean transition-all"
                              style={{ width: `${a.load}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* HPP */}
                  <div className="rounded-3xl border border-sky/60 bg-white p-6">
                    <Tag>Modal & harga sehat</Tag>
                    <div className="mt-3 flex items-baseline justify-between">
                      <span className="text-[15px] text-deep/70">HPP / lembar</span>
                      <span className="font-display text-3xl text-navy">{rupiah(ai.hpp)}</span>
                    </div>
                    <div className="mt-3 space-y-1.5 font-mono text-[13px] text-deep/75">
                      <Line label="Bahan (tier " b={ai.tier.label} value={rupiah(ai.materialPerUnit)} />
                      <Line label="Overhead (malam, listrik)" value={rupiah(ai.overhead)} />
                      <Line label="Tenaga pembatik" value={rupiah(ai.labor)} />
                    </div>
                    <div className="mt-4 flex items-center justify-between rounded-xl bg-soft px-3 py-2.5">
                      <span className="text-sm text-deep/70">Untung @ {rupiah(ai.tier.price)}</span>
                      <span className="font-display text-lg text-[color:var(--color-ok)]">
                        {rupiah(ai.margin)} · {ai.marginPct.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAMPILAN ROLE PEKERJA (STAF PEMBATIK)                                      */}
      {/* ========================================================================= */}
      {role === 'worker' && (
        <div className="mt-8 space-y-8 animate-in fade-in duration-300">
          {/* Floating Banner jika Inactivity Melebihi Toleransi */}
          {workerSimulatedIdle && (
            <InactivityBanner
              idleSeconds={workerIdleSeconds}
              onResolve={handleWorkerReturn}
            />
          )}

          {/* Header Dashboard Pekerja & Pemilihan Staf */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-sky/40 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <DyeDrop className="h-4 w-3" />
                <span className="text-sm font-semibold text-ocean">
                  Antarmuka Stasiun Kerja Harian
                </span>
              </div>
              <h1 className="mt-1 font-display text-3xl text-navy">
                Ruang Kerja: {currentWorker.name}
              </h1>
              <p className="mt-1 text-sm text-deep/70">
                Stasiun: {activeStation.name} · Keahlian: {currentWorker.skill}
              </p>
            </div>

            {/* Pilihan Staf Pembatik untuk kemudahan simulasi/testing */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-deep/60">Ganti Profil Staf:</span>
              <select
                value={selectedWorkerId}
                onChange={(e) => {
                  setSelectedWorkerId(e.target.value)
                  const targetWorker = workers.find((w) => w.id === e.target.value)
                  if (targetWorker?.stationId) {
                    setSelectedStationId(targetWorker.stationId)
                  }
                }}
                className="rounded-xl border border-sky/70 bg-white px-3 py-2 text-xs font-semibold text-navy outline-none focus:border-ocean shadow-sm"
              >
                {workers.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.skill})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Panel Kontrol Simulasi Cepat (Pengujian Fitur Revisi) */}
          <div className="rounded-3xl border-2 border-dashed border-ocean/40 bg-ocean/5 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-ocean uppercase tracking-wider">
                  🧪 Panel Pengujian AI & Warning System
                </span>
                <p className="text-xs text-deep/75 mt-0.5">
                  Uji langsung respon deteksi Computer Vision dan pemicu sistem peringatan ketidakhadiran.
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
                  className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                    !workerSimulatedIdle
                      ? 'bg-[color:var(--color-ok)] text-soft shadow-sm'
                      : 'bg-white border border-sky/60 text-deep hover:bg-sky/20'
                  }`}
                >
                  🟢 1. Pekerja Aktif Membatik
                </button>

                <button
                  onClick={() => {
                    setWorkerSimulatedIdle(true)
                    setWorkerIdleSeconds(182)
                    setIsWarningModalOpen(true)
                    playWarningSound('warning')
                  }}
                  className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                    workerSimulatedIdle
                      ? 'bg-[color:var(--color-danger)] text-soft shadow-sm'
                      : 'bg-white border border-[color:var(--color-danger)]/60 text-[color:var(--color-danger)] hover:bg-red-50'
                  }`}
                >
                  ⚠️ 2. Tinggalkan Pos (&gt; 3 Menit)
                </button>

                <button
                  onClick={() => handleRequestBreak(10)}
                  className="rounded-xl border border-sky/70 bg-white px-3 py-2 text-xs font-semibold text-deep hover:bg-sky/20 transition-all"
                >
                  ☕ 3. Izin Istirahat
                </button>
              </div>
            </div>
          </div>

          {/* Grid Konten Stasiun Kerja Pekerja */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr]">
            {/* Stream Kamera AI Stasiun Kerja Pekerja */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-2xl text-navy">Feed Sensor Kamera Stasiun</h3>
                <span className="font-mono text-xs text-ocean bg-ocean/10 px-2.5 py-1 rounded-full">
                  {workerSimulatedIdle ? 'Status: Ketiadaan Terdeteksi' : 'Status: AI Vision Aktif'}
                </span>
              </div>

              <VisionStream
                station={activeStation}
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

              <div className="rounded-2xl border border-sky/60 bg-white p-4 text-xs text-deep/75">
                <p className="font-semibold text-navy mb-1">💡 Cara Kerja Sistem Peringatan AI:</p>
                <p>
                  Kamera AI menganalisis bounding box pembatik dan canting di meja kerja secara terus menerus.
                  Bila pekerja meninggalkan area lebih dari 3 menit tanpa izin terjadwal, sistem secara
                  otomatis memunculkan notifikasi visual dan audio chime ke layar ini serta mencatatnya di log owner.
                </p>
              </div>
            </div>

            {/* Kolom Status Pengerjaan & Checklist Harian */}
            <div className="flex flex-col gap-5">
              {/* Target Hari Ini */}
              <div className="rounded-3xl border border-sky/60 bg-white p-6 shadow-sm">
                <Tag>Target Harian Anda</Tag>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="font-display text-3xl text-navy">
                    {currentWorker.rate} <span className="text-lg text-deep/60">Lembar / Hari</span>
                  </span>
                  <span className="rounded-full bg-[color:var(--color-ok)]/15 px-3 py-1 font-mono text-xs font-bold text-[color:var(--color-ok)]">
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
                    <span>Motif Aktif:</span>
                    <span className="font-semibold text-navy">Pinto Aceh (2.4m Primissima)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tahap Berjalan:</span>
                    <span className="font-semibold text-ocean">Mencanting Isen-isen Halus</span>
                  </div>
                </div>
              </div>

              {/* Checklist Standar Operasional (SOP Canting) */}
              <div className="rounded-3xl border border-sky/60 bg-white p-6 shadow-sm">
                <Tag>SOP Mutu Sanggar</Tag>
                <h4 className="mt-2 font-display text-xl text-navy">Panduan Pengerjaan</h4>
                <ul className="mt-4 space-y-2.5 text-xs text-deep">
                  <li className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-ok)] text-[10px] text-soft font-bold">
                      ✓
                    </span>
                    <span>Wajan lilin malam stabil pada suhu 65°–70°C.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-ok)] text-[10px] text-soft font-bold">
                      ✓
                    </span>
                    <span>Goresan canting tembus bolak-balik serat mori.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-ok)] text-[10px] text-soft font-bold">
                      ✓
                    </span>
                    <span>Posisi duduk ergonomis menghadap gawangan.</span>
                  </li>
                </ul>
              </div>

              {/* Status Kehadiran Personal */}
              <div
                className="rounded-3xl border border-ocean/30 p-6 text-soft shadow-sm"
                style={{ backgroundImage: 'linear-gradient(180deg,#0a1931,#1a3d63 65%,#2f5b83)' }}
              >
                <Tag invert>Status Kehadiran Hari Ini</Tag>
                <p className="mt-2 font-display text-2xl leading-tight">
                  {workerSimulatedIdle ? 'Peringatan: Tidak di Pos' : 'Hadir & Beraktivitas Normal'}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/15 pt-3 font-mono text-xs text-sky/85">
                  <div>
                    <span className="text-sky/60 block">Mulai Jam:</span>
                    <span>08:00 WIB</span>
                  </div>
                  <div>
                    <span className="text-sky/60 block">Skor Kepatuhan:</span>
                    <span className="text-[color:var(--color-ok)]">98.2%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

/* --------------------------- helpers --------------------------- */

const inputCls =
  'w-full rounded-lg border border-sky/70 bg-soft px-3 py-2 text-sm text-navy outline-none transition-colors focus:border-ocean'

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[13px] text-deep/60">{label}</span>
      {children}
    </label>
  )
}

function AddBtn({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-ocean/50 py-3 text-sm font-semibold text-ocean transition-colors hover:border-ocean hover:bg-ocean/5"
    >
      + {children}
    </button>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sky/60">{label}</p>
      <p className="text-soft">{value}</p>
    </div>
  )
}

function Line({ label, b, value }: { label: string; b?: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-sky/40 pb-1.5">
      <span>
        {label}
        {b ? <>{b})</> : null}
      </span>
      <span className="text-navy">{value}</span>
    </div>
  )
}

function patch<T extends { id: string }>(
  set: (v: T[]) => void,
  list: T[],
  id: string,
  upd: Partial<T>
) {
  set(list.map((x) => (x.id === id ? { ...x, ...upd } : x)))
}

function allocate(workers: Worker[], poQty: number) {
  const totalRate = workers.reduce((s, w) => s + (w.rate || 0), 0) || 1
  const raw = workers.map((w) => ({ ...w, exact: (poQty * (w.rate || 0)) / totalRate }))
  const maxAssigned = Math.max(1, ...raw.map((r) => Math.ceil(r.exact)))
  let done = 0
  return raw.map((r, i) => {
    const assigned = i === raw.length - 1 ? Math.max(0, poQty - done) : Math.round(r.exact)
    done += assigned
    return { ...r, assigned, load: Math.min(100, (assigned / maxAssigned) * 100) }
  })
}

export default Seller