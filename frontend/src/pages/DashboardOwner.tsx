import type { FC, ReactNode } from 'react'
import { useMemo, useState } from 'react'
import {
  AlertIcon,
  CameraIcon,
  Canting,
  CheckIcon,
  ClockIcon,
  DyeDrop,
  LogIcon,
  ShieldIcon,
  SlidersIcon,
  StageMark,
  Tag,
  UserIcon,
} from '@/components/batik'
import {
  CENTRAL_CAMERA,
  DEFAULT_MATERIALS,
  DEFAULT_WORKERS,
  INITIAL_AUDIT_LOGS,
  type AuditLog,
  type Material,
  type Worker,
  computeAI,
  fmtDate,
  rupiah,
} from '@/lib/ai'
import { VisionStream } from '@/components/VisionStream'
import { BatikDigitalTwinAnimation } from '@/components/BatikDigitalTwinAnimation'

interface DashboardOwnerProps {
  onLogout?: () => void
  logs?: AuditLog[]
}

let uid = 100
const nextId = () => `x${uid++}`

export const DashboardOwner: FC<DashboardOwnerProps> = ({
  onLogout,
  logs = INITIAL_AUDIT_LOGS,
}) => {
  const [activeTab, setActiveTab] = useState<'surveillance' | 'logs' | 'capacity'>('surveillance')
  const [selectedWorkerFilter, setSelectedWorkerFilter] = useState<string>('all')
  const [activityTypeFilter, setActivityTypeFilter] = useState<string>('all')
  const [logFilter, setLogFilter] = useState<'all' | 'warning' | 'resolved'>('all')

  const [workers, setWorkers] = useState<Worker[]>(DEFAULT_WORKERS)
  const [materials, setMaterials] = useState<Material[]>(DEFAULT_MATERIALS)
  const [target, setTarget] = useState(40)

  const dailyCapacity = workers.reduce((s, w) => s + (w.rate || 0), 0)
  const ai = useMemo(() => computeAI(target, dailyCapacity), [target, dailyCapacity])
  const alloc = useMemo(() => allocate(workers, ai.poQty), [workers, ai.poQty])

  // Filter logs untuk Timeline Kronologis Naratif
  const filteredChronicle = useMemo(() => {
    return logs.filter((l) => {
      const matchWorker =
        selectedWorkerFilter === 'all' || l.workerName.toLowerCase().includes(selectedWorkerFilter.toLowerCase())
      const matchType =
        activityTypeFilter === 'all' ||
        (activityTypeFilter === 'warning' && l.type === 'inactivity_warning') ||
        (activityTypeFilter === 'movement' && l.type === 'movement') ||
        (activityTypeFilter === 'break' && (l.type === 'break_start' || l.type === 'break_end')) ||
        (activityTypeFilter === 'milestone' && l.type === 'task_milestone')
      return matchWorker && matchType
    })
  }, [logs, selectedWorkerFilter, activityTypeFilter])

  return (
    <main className="mx-auto max-w-[1180px] px-5 pb-28 pt-8 sm:px-8">
      {/* Header Pusat Kendali Pemilik Sanggar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-sky/70 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-soft">
            <ShieldIcon className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-ocean">
                Pusat Kendali Pemilik Sanggar (Owner)
              </span>
              <span className="rounded-full bg-sky/30 px-2 py-0.5 font-mono text-[11px] text-deep">
                1 Kamera Sentral AI
              </span>
            </div>
            <h1 className="font-display text-2xl text-navy sm:text-3xl">
              Sanggar Batik Tulis Aceh
            </h1>
            <p className="text-xs text-deep/70">
              Laporan berkala pergerakan pengrajin, waktu istirahat, kepatuhan pos, & kalkulasi HPP.
            </p>
          </div>
        </div>

        {/* Tab Navigasi Sub-Fitur & Logout */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-2xl border border-sky/80 bg-soft p-1.5 shadow-inner">
            <button
              onClick={() => setActiveTab('surveillance')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                activeTab === 'surveillance'
                  ? 'bg-navy text-soft shadow-sm'
                  : 'text-deep/70 hover:text-navy'
              }`}
            >
              <CameraIcon className="h-3.5 w-3.5" />
              Kamera Sentral & Kronologi
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                activeTab === 'logs'
                  ? 'bg-navy text-soft shadow-sm'
                  : 'text-deep/70 hover:text-navy'
              }`}
            >
              <LogIcon className="h-3.5 w-3.5" />
              Laporan Audit ({logs.filter((l) => l.status === 'active_alert').length})
            </button>
            <button
              onClick={() => setActiveTab('capacity')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                activeTab === 'capacity'
                  ? 'bg-navy text-soft shadow-sm'
                  : 'text-deep/70 hover:text-navy'
              }`}
            >
              <SlidersIcon className="h-3.5 w-3.5" />
              Digital Twin & HPP
            </button>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="rounded-xl border border-sky/60 bg-white px-3 py-2 text-xs font-semibold text-deep/70 hover:bg-sky/20 hover:text-navy transition-colors"
            >
              Keluar
            </button>
          )}
        </div>
      </div>

      {/* Metric Cards Ringkasan Kinerja Sanggar */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-sky/60 bg-white p-5 shadow-sm">
          <Tag>Kepatuhan Sanggar</Tag>
          <p className="mt-2 font-display text-3xl text-navy">96.4%</p>
          <div className="mt-2 flex items-center justify-between text-xs text-deep/70">
            <span>4 Pengrajin Terpantau</span>
            <span className="font-semibold text-[color:var(--color-ok)]">Optimal</span>
          </div>
        </div>

        <div className="rounded-3xl border border-sky/60 bg-white p-5 shadow-sm">
          <Tag>Jam Kerja Efektif</Tag>
          <p className="mt-2 font-display text-3xl text-navy">31.8 Jam</p>
          <div className="mt-2 flex items-center justify-between text-xs text-deep/70">
            <span>Total Efektivitas Hari Ini</span>
            <span className="font-mono text-ocean">92% On-Workstation</span>
          </div>
        </div>

        <div className="rounded-3xl border border-sky/60 bg-white p-5 shadow-sm">
          <Tag>Insiden Ketiadaan Pos</Tag>
          <p className="mt-2 font-display text-3xl text-[color:var(--color-warn)]">
            {logs.filter((l) => l.type === 'inactivity_warning').length} Terdeteksi
          </p>
          <div className="mt-2 flex items-center justify-between text-xs text-deep/70">
            <span>Toleransi: 3 Mnt</span>
            <span className="font-semibold text-[color:var(--color-ok)]">
              {logs.filter((l) => l.status === 'resolved').length} Tertangani
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-sky/60 bg-white p-5 shadow-sm">
          <Tag>Kapasitas Harian Sanggar</Tag>
          <p className="mt-2 font-display text-3xl text-navy">
            {dailyCapacity.toFixed(2)} <span className="text-base text-deep/60">lbr/hari</span>
          </p>
          <div className="mt-2 flex items-center justify-between text-xs text-deep/70">
            <span>{workers.length} Pembatik Aktif</span>
            <span className="font-mono text-ocean">1 Sensor Sentral</span>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* SUB-TAB 1: 1 KAMERA SENTRAL & KRONOLOGI AKTIVITAS PENGRAJIN           */}
      {/* ===================================================================== */}
      {activeTab === 'surveillance' && (
        <div className="mt-8 space-y-8">
          {/* Header Bagian Kamera Sentral */}
          <div>
            <StageMark
              numeral="satu"
              title="Kamera Sentral Sanggar & Pelaporan AI"
              sub="1 kamera sentral memantau seluruh area sanggar dan melaporkan secara otomatis jam istirahat, pergerakan pengrajin, dan status pengerjaan."
            />
          </div>

          {/* Layout Grid: 1 Kamera Utama (Kiri) & Live Laporan Naratif Kronologis (Kanan) */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_1fr]">
            {/* Kolom 1: Kamera Sentral Tunggal */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-ocean uppercase tracking-wider">
                    Sensor Optik Sentral (Wide-Angle)
                  </span>
                  <h3 className="font-display text-xl text-navy">
                    {CENTRAL_CAMERA.name}
                  </h3>
                </div>
                <span className="rounded-full bg-[color:var(--color-ok)]/15 px-3 py-1 font-mono text-xs font-semibold text-[color:var(--color-ok)]">
                  Live RTSP Standby
                </span>
              </div>

              {/* Feed Kamera Sentral Tunggal (Blank Standby / Webcam) */}
              <VisionStream station={CENTRAL_CAMERA} showControls={true} />

              <div className="rounded-3xl border border-sky/60 bg-white p-5 text-xs text-deep/75 space-y-2">
                <div className="flex items-center justify-between border-b border-sky/30 pb-2 font-semibold text-navy">
                  <span>Cakupan Area Sensor Optik:</span>
                  <span className="text-ocean">Zona Terpadu Sanggar</span>
                </div>
                <p>
                  Kamera sentral ini secara otomatis mendeteksi kehadiran, perpindahan antar-ruang
                  (meja canting, ruang lilin, bak celup, ruang istirahat), dan jeda istirahat dari
                  masing-masing pengrajin di sanggar.
                </p>
              </div>
            </div>

            {/* Kolom 2: Laporan Kronologis Aktivitas & Pergerakan Pengrajin */}
            <div className="flex flex-col rounded-3xl border border-sky/60 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sky/30 pb-4">
                <div>
                  <Tag>Laporan AI Real-Time</Tag>
                  <h3 className="font-display text-2xl text-navy">Kronologi Aktivitas Pengrajin</h3>
                </div>
                <span className="rounded-full bg-soft px-3 py-1 text-xs font-mono text-deep">
                  {filteredChronicle.length} Peristiwa Terpantau
                </span>
              </div>

              {/* Filter Cepat Pengrajin & Tipe */}
              <div className="mt-4 flex flex-wrap gap-2">
                <select
                  value={selectedWorkerFilter}
                  onChange={(e) => setSelectedWorkerFilter(e.target.value)}
                  className="rounded-xl border border-sky/70 bg-soft px-3 py-1.5 text-xs font-semibold text-navy outline-none focus:border-ocean transition-colors"
                >
                  <option value="all">Semua Pengrajin</option>
                  <option value="Nuraini">Bu Nuraini (Canting)</option>
                  <option value="Yusuf">Pak Yusuf (Cap Tembaga)</option>
                  <option value="Salmah">Bu Salmah (Pewarnaan)</option>
                  <option value="Ridwan">Pak Ridwan (Pelorodan)</option>
                </select>

                <select
                  value={activityTypeFilter}
                  onChange={(e) => setActivityTypeFilter(e.target.value)}
                  className="rounded-xl border border-sky/70 bg-soft px-3 py-1.5 text-xs font-semibold text-navy outline-none focus:border-ocean transition-colors"
                >
                  <option value="all">Semua Jenis Laporan</option>
                  <option value="break">Jam Istirahat & Izin</option>
                  <option value="movement">Pergerakan Antar-Ruang</option>
                  <option value="warning">Peringatan Ketiadaan Meja</option>
                  <option value="milestone">Penyelesaian Tahap Produksi</option>
                </select>
              </div>

              {/* Timeline Naratif Pengrajin Sesuai Permintaan Pengguna */}
              <div className="mt-5 space-y-4 max-h-[520px] overflow-y-auto pr-1">
                {filteredChronicle.map((item) => {
                  let indicatorColor = 'bg-ocean'
                  let badgeText = 'Aktivitas'
                  let badgeBg = 'bg-sky/20 text-deep'

                  if (item.type === 'inactivity_warning') {
                    indicatorColor = 'bg-[color:var(--color-danger)]'
                    badgeText = 'Peringatan Ketiadaan'
                    badgeBg = 'bg-[color:var(--color-danger)]/15 text-[color:var(--color-danger)]'
                  } else if (item.type === 'break_start' || item.type === 'break_end') {
                    indicatorColor = 'bg-[color:var(--color-warn)]'
                    badgeText = 'Istirahat / Jeda'
                    badgeBg = 'bg-[color:var(--color-warn)]/15 text-[color:var(--color-warn)]'
                  } else if (item.type === 'movement') {
                    indicatorColor = 'bg-ocean'
                    badgeText = 'Pergerakan Ruang'
                    badgeBg = 'bg-ocean/15 text-ocean'
                  } else if (item.type === 'task_milestone') {
                    indicatorColor = 'bg-[color:var(--color-ok)]'
                    badgeText = 'Penyelesaian Tahap'
                    badgeBg = 'bg-[color:var(--color-ok)]/15 text-[color:var(--color-ok)]'
                  }

                  return (
                    <div
                      key={item.id}
                      className="relative flex gap-3.5 rounded-2xl border border-sky/40 bg-soft p-4 transition-all hover:bg-white hover:shadow-sm"
                    >
                      {/* Timeline Dot */}
                      <span
                        className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${indicatorColor}`}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <span className="font-mono text-xs font-bold text-navy">
                            {item.timestamp}
                          </span>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${badgeBg}`}>
                            {badgeText}
                          </span>
                        </div>

                        {/* Narasi Laporan Kamera AI */}
                        <p className="mt-1.5 text-xs font-medium text-navy leading-relaxed">
                          {item.note}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-deep/60 font-mono">
                          <span>Lokasi: {item.location}</span>
                          {item.destinationLocation && (
                            <span>→ Menuju: {item.destinationLocation}</span>
                          )}
                          {item.durationMinutes && (
                            <span className="font-semibold text-deep">
                              Durasi: {item.durationMinutes} menit
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Rekapitulasi Per-Pengrajin (Aktivitas Harian Terpantau Kamera) */}
          <div className="rounded-3xl border border-sky/60 bg-white p-6 sm:p-8 shadow-sm">
            <Tag>Rekapitulasi Harian Pengrajin</Tag>
            <h3 className="mt-2 font-display text-2xl text-navy">
              Analisis Aktivitas & Waktu Kerja Terpantau Kamera Sentral
            </h3>
            <p className="text-xs text-deep/70 mt-1">
              Data akumulasi jam kerja produktif, jam istirahat, serta posisi terakhir terpantau AI.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {workers.map((w) => (
                <div
                  key={w.id}
                  className="rounded-2xl border border-sky/60 bg-soft p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky/30 text-deep">
                      <UserIcon className="h-4 w-4" />
                    </span>
                    <span className="font-mono text-xs font-bold text-[color:var(--color-ok)]">
                      {w.complianceScore}% Kepatuhan
                    </span>
                  </div>

                  <div>
                    <h4 className="font-display text-lg text-navy">{w.name}</h4>
                    <p className="text-xs text-deep/70">{w.skill}</p>
                  </div>

                  <div className="space-y-1.5 border-t border-sky/30 pt-2.5 text-xs text-deep/80 font-mono">
                    <div className="flex justify-between">
                      <span>Waktu Aktif:</span>
                      <span className="font-semibold text-navy">{w.activeHoursToday} Jam</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Istirahat:</span>
                      <span>{w.breakMinutesToday} Menit</span>
                    </div>
                    <div className="flex justify-between text-[11px] pt-1">
                      <span className="text-deep/60">Posisi:</span>
                      <span className="text-ocean truncate max-w-[120px]">{w.currentLocation}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SUB-TAB 2: LAPORAN & AUDIT LOG EVALUASI LENGKAP                        */}
      {/* ===================================================================== */}
      {activeTab === 'logs' && (
        <div className="mt-8 space-y-6">
          <StageMark
            numeral="dua"
            title="Laporan & Audit Log Evaluasi Lengkap"
            sub="Rekapitulasi pencatatan otomatis kamera sentral mengenai waktu istirahat, pergerakan, dan kepatuhan pengrajin."
          />

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-sky/60 bg-white p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-deep/70">Filter Status:</span>
              <button
                onClick={() => setLogFilter('all')}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  logFilter === 'all'
                    ? 'bg-navy text-soft'
                    : 'bg-soft text-deep hover:bg-sky/20'
                }`}
              >
                Semua Catatan ({logs.length})
              </button>
              <button
                onClick={() => setLogFilter('warning')}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  logFilter === 'warning'
                    ? 'bg-[color:var(--color-danger)] text-soft'
                    : 'bg-soft text-deep hover:bg-sky/20'
                }`}
              >
                Peringatan Ketiadaan ({logs.filter((l) => l.type === 'inactivity_warning').length})
              </button>
              <button
                onClick={() => setLogFilter('resolved')}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  logFilter === 'resolved'
                    ? 'bg-[color:var(--color-ok)] text-soft'
                    : 'bg-soft text-deep hover:bg-sky/20'
                }`}
              >
                Terselesaikan ({logs.filter((l) => l.status === 'resolved' || l.status === 'approved').length})
              </button>
            </div>

            <button
              onClick={() => alert('Laporan audit aktivitas sanggar berhasil diekspor ke CSV.')}
              className="rounded-xl border border-ocean bg-ocean/10 px-3.5 py-1.5 text-xs font-semibold text-ocean hover:bg-ocean hover:text-soft transition-all"
            >
              Unduh Rekap Audit (CSV)
            </button>
          </div>

          {/* Tabel Log */}
          <div className="overflow-hidden rounded-3xl border border-sky/60 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-deep">
                <thead className="border-b border-sky/50 bg-soft font-mono text-xs text-navy">
                  <tr>
                    <th className="px-5 py-3.5">Waktu</th>
                    <th className="px-5 py-3.5">Pengrajin</th>
                    <th className="px-5 py-3.5">Lokasi / Stasiun</th>
                    <th className="px-5 py-3.5">Durasi</th>
                    <th className="px-5 py-3.5">Tipe Kejadian</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Laporan Kamera AI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky/20">
                  {logs
                    .filter((l) => {
                      if (logFilter === 'warning') return l.type === 'inactivity_warning'
                      if (logFilter === 'resolved') return l.status === 'resolved' || l.status === 'approved'
                      return true
                    })
                    .map((log) => {
                      let badgeBg = 'bg-sky/20 text-deep'
                      let badgeText = 'Info'
                      if (log.type === 'inactivity_warning') {
                        badgeBg = 'bg-[color:var(--color-danger)]/15 text-[color:var(--color-danger)]'
                        badgeText = 'Ketiadaan Pos'
                      } else if (log.type === 'movement') {
                        badgeBg = 'bg-ocean/15 text-ocean'
                        badgeText = 'Pergerakan'
                      } else if (log.type === 'break_start' || log.type === 'break_end') {
                        badgeBg = 'bg-[color:var(--color-warn)]/15 text-[color:var(--color-warn)]'
                        badgeText = 'Istirahat'
                      } else {
                        badgeBg = 'bg-[color:var(--color-ok)]/15 text-[color:var(--color-ok)]'
                        badgeText = 'Selesai Tahap'
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
                            {log.location}
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
                                  ? 'text-[color:var(--color-danger)] font-bold'
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
                                  : 'Tercatat'}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-xs text-deep/75 max-w-sm">
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

      {/* ===================================================================== */}
      {/* SUB-TAB 3: DIGITAL TWIN, KAPASITAS SANGGAR & HPP                       */}
      {/* ===================================================================== */}
      {activeTab === 'capacity' && (
        <div className="mt-8 space-y-8">
          <StageMark
            numeral="tiga"
            title="Kapasitas Sanggar & Simulasi HPP"
            sub="Mesin AI menghitung kesanggupan pengerjaan pesanan, kebutuhan bahan baku gudang, serta batas harga sehat."
          />

          {/* Animasi Digital Twin Proses Pembuatan Batik */}
          <BatikDigitalTwinAnimation initialStage={2} />

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

export default DashboardOwner
