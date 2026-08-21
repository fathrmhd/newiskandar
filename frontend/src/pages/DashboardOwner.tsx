import type { FC, ReactNode } from 'react'
import { useMemo, useState } from 'react'
import {
  CameraIcon,
  CheckIcon,
  StageMark,
  Tag,
  UserIcon,
} from '@/components/batik'
import {
  CENTRAL_CAMERA,
  DEFAULT_MATERIALS,
  DEFAULT_WORKERS,
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
}

let uid = 100
const nextId = () => `x${uid++}`

export const DashboardOwner: FC<DashboardOwnerProps> = ({
  onLogout,
}) => {
  // Hanya dua tab utama: Kamera & Gudang (Gabungan) & Manajemen SDM
  const [activeTab, setActiveTab] = useState<'surveillance' | 'hr'>('surveillance')

  const [workers, setWorkers] = useState<Worker[]>(DEFAULT_WORKERS)
  const [materials, setMaterials] = useState<Material[]>(DEFAULT_MATERIALS)
  const [target, setTarget] = useState(40)

  // Pembulatan kapasitas harian
  const dailyCapacity = Math.round(workers.reduce((s, w) => s + (w.rate || 0), 0))
  const ai = useMemo(() => computeAI(target, dailyCapacity), [target, dailyCapacity])
  const alloc = useMemo(() => allocate(workers, ai.poQty), [workers, ai.poQty])

  return (
    <main className="mx-auto max-w-[1180px] px-5 pb-28 pt-8 sm:px-8">
      {/* Header Pusat Kendali Pemilik Sanggar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-sky/70 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-soft">
            <UserIcon className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-ocean">
                Pusat Kendali Pemilik (Owner)
              </span>
              <span className="rounded-full bg-sky/30 px-2 py-0.5 font-mono text-[11px] text-deep">
                Sistem Terpadu AI
              </span>
            </div>
            <h1 className="font-display text-2xl text-navy sm:text-3xl">
              Manajemen Sanggar Batik
            </h1>
            <p className="text-xs text-deep/70">
              Pantauan visual, simulasi antrian produksi, & evaluasi kinerja pengrajin.
            </p>
          </div>
        </div>

        {/* Tab Navigasi & Logout */}
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
              Kamera & Gudang
            </button>
            <button
              onClick={() => setActiveTab('hr')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                activeTab === 'hr'
                  ? 'bg-navy text-soft shadow-sm'
                  : 'text-deep/70 hover:text-navy'
              }`}
            >
              <UserIcon className="h-3.5 w-3.5" />
              Manajemen SDM
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
        <div className="rounded-3xl border border-[color:var(--color-ok)]/40 bg-white p-5 shadow-sm">
          <Tag>Kepatuhan Sanggar</Tag>
          <p className="mt-2 font-display text-3xl text-[color:var(--color-ok)]">100%</p>
          <div className="mt-2 flex items-center justify-between text-xs text-deep/70">
            <span>{workers.length} Pengrajin Aktif</span>
            <span className="font-semibold text-[color:var(--color-ok)]">Optimal</span>
          </div>
        </div>

        <div className="rounded-3xl border border-sky/60 bg-white p-5 shadow-sm">
          <Tag>Jam Kerja Efektif</Tag>
          <p className="mt-2 font-display text-3xl text-navy">31.8 Jam</p>
          <div className="mt-2 flex items-center justify-between text-xs text-deep/70">
            <span>Total Efektivitas Hari Ini</span>
            <span className="font-mono text-ocean">Tercapai</span>
          </div>
        </div>

        <div className="rounded-3xl border border-sky/60 bg-white p-5 shadow-sm">
          <Tag>Pencapaian Target / Reward</Tag>
          <p className="mt-2 font-display text-3xl text-navy">
            {workers.length} <span className="text-base text-deep/60">Pengrajin</span>
          </p>
          <div className="mt-2 flex items-center justify-between text-xs text-deep/70">
            <span>Memenuhi Syarat Insentif</span>
            <span className="font-semibold text-[color:var(--color-ok)]">Berhak Reward</span>
          </div>
        </div>

        <div className="rounded-3xl border border-sky/60 bg-white p-5 shadow-sm">
          <Tag>Kapasitas Harian Sanggar</Tag>
          <p className="mt-2 font-display text-3xl text-navy">
            {dailyCapacity} <span className="text-base text-deep/60">lbr/hari</span>
          </p>
          <div className="mt-2 flex items-center justify-between text-xs text-deep/70">
            <span>Estimasi Output</span>
            <span className="font-mono text-ocean">Berdasarkan SDM</span>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* SUB-TAB 1: GABUNGAN KAMERA SENTRAL & DIGITAL TWIN / GUDANG            */}
      {/* ===================================================================== */}
      {activeTab === 'surveillance' && (
        <div className="mt-8 space-y-12">
          
          {/* --- Bagian Atas: Pantauan Kamera --- */}
          <section className="space-y-6">
            <StageMark
              numeral="satu"
              title="Pantauan Visual Sanggar"
              sub="Tampilan langsung (live stream) dari kamera sentral untuk memastikan kelancaran alur kerja di area produksi."
            />
            
            <div className="rounded-3xl border border-sky/60 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky/30 pb-4 mb-6">
                <div>
                  <h3 className="font-display text-xl text-navy">
                    {CENTRAL_CAMERA.name}
                  </h3>
                  <p className="text-xs text-deep/70 mt-1">Area Cakupan: Zona Terpadu Sanggar</p>
                </div>
                <span className="rounded-full bg-[color:var(--color-ok)]/15 px-3 py-1 font-mono text-xs font-semibold text-[color:var(--color-ok)] flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[color:var(--color-ok)] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[color:var(--color-ok)]"></span>
                  </span>
                  Live RTSP Standby
                </span>
              </div>

              {/* Komponen Kamera Ditaruh di Tengah dan Lebar */}
              <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-sky/40 bg-soft shadow-inner">
                <VisionStream station={CENTRAL_CAMERA} showControls={false} />
              </div>

              <p className="mt-6 text-center text-xs text-deep/60 bg-soft/50 py-3 rounded-xl border border-sky/30 max-w-2xl mx-auto">
                Kamera ini murni digunakan sebagai antarmuka pantauan visual (*display only*). Pencatatan log aktivitas otomatis dinonaktifkan untuk mengedepankan evaluasi berbasis penyelesaian target.
              </p>
            </div>
          </section>

          {/* --- Bagian Bawah: Digital Twin & Gudang --- */}
          <section className="space-y-8 border-t border-sky/40 pt-10">
            <StageMark
              numeral="dua"
              title="Digital Twin, Kapasitas & Manajemen Gudang"
              sub="Simulasi kesanggupan produksi, kebutuhan suplai bahan baku, serta kalkulasi Harga Pokok Penjualan (HPP)."
            />

            <BatikDigitalTwinAnimation initialStage={1} />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_1fr]">
              {/* Kolom Input Simulasi */}
              <div className="flex flex-col gap-10">
                {/* Pengaturan SDM */}
                <div>
                  <div className="mb-4">
                    <h3 className="font-display text-xl text-navy">Distribusi Beban Kerja</h3>
                    <p className="text-sm text-deep/70">Atur kemampuan produksi harian per individu.</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    {workers.map((w, i) => (
                      <div key={w.id} className="rounded-2xl border border-sky/60 bg-white p-4">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-ocean">
                            Pengrajin {i + 1}
                          </span>
                          {workers.length > 1 && (
                            <button
                              onClick={() => setWorkers(workers.filter((x) => x.id !== w.id))}
                              className="text-[13px] text-deep/50 hover:text-[color:var(--color-danger)]"
                            >
                              Hapus
                            </button>
                          )}
                        </div>
                        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-[1.2fr_1.2fr_auto]">
                          <Field label="Nama Pengrajin">
                            <input
                              value={w.name}
                              onChange={(e) => patch(setWorkers, workers, w.id, { name: e.target.value })}
                              className={inputCls}
                              placeholder="Contoh: Budi"
                            />
                          </Field>
                          <Field label="Stasiun Keahlian">
                            <input
                              value={w.skill}
                              onChange={(e) => patch(setWorkers, workers, w.id, { skill: e.target.value })}
                              className={inputCls}
                              placeholder="Contoh: Canting"
                            />
                          </Field>
                          <Field label="Target Harian (Lbr)">
                            <input
                              type="number"
                              step="1"
                              min={1}
                              value={w.rate}
                              onChange={(e) => patch(setWorkers, workers, w.id, { rate: Math.round(Number(e.target.value)) })}
                              className={`${inputCls} w-24 text-center font-mono`}
                            />
                          </Field>
                        </div>
                      </div>
                    ))}
                    <AddBtn onClick={() => setWorkers([...workers, { id: nextId(), name: '', skill: '', rate: 1 }])}>
                      Tambah Pengrajin
                    </AddBtn>
                  </div>
                </div>

                {/* Pengaturan Gudang & Material */}
                <div>
                  <div className="mb-4">
                    <h3 className="font-display text-xl text-navy">Manajemen Stok Gudang</h3>
                    <p className="text-sm text-deep/70">Atur batas kebutuhan minimum untuk memicu pembelian grosir bahan baku.</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    {materials.map((m) => {
                      const discount = m.need >= m.minDiscount
                      return (
                        <div key={m.id} className="rounded-2xl border border-sky/60 bg-white p-4">
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1.6fr_1fr_1fr_auto] sm:items-end">
                            <Field label="Nama Bahan">
                              <input
                                value={m.name}
                                onChange={(e) => patch(setMaterials, materials, m.id, { name: e.target.value })}
                                className={inputCls}
                                placeholder="Kain Mori / Lilin"
                              />
                            </Field>
                            <Field label="Kuantitas">
                              <input
                                type="number"
                                min={0}
                                value={m.need}
                                onChange={(e) => patch(setMaterials, materials, m.id, { need: Number(e.target.value) })}
                                className={`${inputCls} font-mono`}
                              />
                            </Field>
                            <Field label="Satuan Unit">
                              <select
                                value={m.unit}
                                onChange={(e) => patch(setMaterials, materials, m.id, { unit: e.target.value })}
                                className={inputCls}
                              >
                                <option value="Meter (m)">Meter (m)</option>
                                <option value="Kilogram (kg)">Kilogram (kg)</option>
                                <option value="Yard">Yard</option>
                                <option value="Pcs">Pcs</option>
                                <option value="Liter (l)">Liter (l)</option>
                              </select>
                            </Field>
                            {materials.length > 1 && (
                              <button
                                onClick={() => setMaterials(materials.filter((x) => x.id !== m.id))}
                                className="pb-2.5 text-[13px] text-deep/50 hover:text-[color:var(--color-danger)]"
                              >
                                Hapus
                              </button>
                            )}
                          </div>
                          <div className="mt-3 flex items-center justify-between border-t border-sky/30 pt-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-deep/60">Batas Minimum Harga Grosir:</span>
                              <input
                                type="number"
                                min={1}
                                value={m.minDiscount}
                                onChange={(e) => patch(setMaterials, materials, m.id, { minDiscount: Number(e.target.value) })}
                                className="w-16 rounded border border-sky/70 bg-soft px-2 py-1 text-xs outline-none focus:border-ocean"
                              />
                              <span className="text-xs font-mono">{m.unit}</span>
                            </div>
                            <p
                              className="text-[12px] font-medium"
                              style={{ color: discount ? 'var(--color-ok)' : 'var(--color-warn)' }}
                            >
                              {discount
                                ? `✓ Syarat grosir terpenuhi`
                                : `Butuh ${m.minDiscount - m.need} ${m.unit} lagi`}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                    <AddBtn onClick={() => setMaterials([...materials, { id: nextId(), name: '', need: 0, unit: 'Kilogram (kg)', minDiscount: 10 }])}>
                      Tambah Jenis Bahan Baku
                    </AddBtn>
                  </div>
                </div>
              </div>

              {/* Kolom Hasil AI & Estimasi */}
              <div className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
                {/* Uji Kesanggupan */}
                <div className="rounded-3xl border border-sky/60 bg-white p-6 shadow-sm">
                  <Tag>Simulasi Antrian Produksi</Tag>
                  <p className="mt-2 text-[15px] text-deep/70">Uji kapasitas waktu berdasarkan jumlah pesanan masuk.</p>
                  <div className="mt-4 flex items-center gap-3">
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
                    <span className="text-sm text-deep/60">Lembar Kain</span>
                  </div>
                </div>

                {/* Kesanggupan & SLA */}
                <div
                  className="rounded-3xl border border-ocean/30 p-6 text-soft shadow-sm"
                  style={{ backgroundImage: 'linear-gradient(180deg,#0a1931,#1a3d63 65%,#2f5b83)' }}
                >
                  <Tag invert>Estimasi Selesai (SLA)</Tag>
                  <p className="mt-2 font-display text-2xl leading-tight">{fmtDate(ai.slaDate)}</p>
                  <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/15 pt-4 font-mono text-[13px] text-sky/85">
                    <Stat label="Kapasitas Sanggar" value={`${dailyCapacity} lbr/hari`} />
                    <Stat label="Beban Produksi Baru" value={`${ai.poQty} lembar`} />
                    <Stat label="Total Waktu Antrian" value={`${Math.ceil(ai.totalDays)} Hari`} />
                    <Stat label="Sisa Bahan Siap" value={`${ai.readyUsed} lembar`} />
                  </div>
                </div>

                {/* Pembagian Kerja */}
                <div className="rounded-3xl border border-sky/60 bg-white p-6 shadow-sm">
                  <Tag>Distribusi Target Harian</Tag>
                  <p className="mt-1 text-[13px] text-deep/70">
                    {ai.poQty} lembar pesanan dibagi sesuai kapasitas rata-rata tiap pekerja.
                  </p>
                  <div className="mt-4 flex flex-col gap-3">
                    {alloc.map((a) => (
                      <div key={a.id}>
                        <div className="flex items-baseline justify-between text-sm">
                          <span className="font-medium text-navy">{a.name || 'Pengrajin'}</span>
                          <span className="font-mono text-ocean">{a.assigned} lbr</span>
                        </div>
                        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-sky/30">
                          <div
                            className="h-full rounded-full bg-ocean transition-all"
                            style={{ width: `${a.load}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Struktur HPP & Margin */}
                <div className="rounded-3xl border border-sky/60 bg-white p-6 shadow-sm">
                  <Tag>Struktur HPP & Penentuan Harga</Tag>
                  <div className="mt-3 flex items-baseline justify-between border-b border-sky/30 pb-3">
                    <span className="text-[14px] text-deep/70 font-semibold">Harga Pokok (HPP)</span>
                    <span className="font-display text-3xl text-navy">{rupiah(ai.hpp)}</span>
                  </div>
                  <div className="mt-4 space-y-2 font-mono text-[12px] text-deep/75">
                    <Line label="Bahan Baku & Pewarna" value={rupiah(ai.materialPerUnit)} />
                    <Line label="Tenaga Kerja (SDM)" value={rupiah(ai.labor)} />
                    <Line label="Overhead (Operasional)" value={rupiah(ai.overhead)} />
                  </div>
                  <div className="mt-5 flex items-center justify-between rounded-xl bg-[color:var(--color-ok)]/10 px-4 py-3 border border-[color:var(--color-ok)]/20">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-[color:var(--color-ok)] font-bold block mb-0.5">Potensi Keuntungan</span>
                      <span className="text-[13px] font-medium text-navy">Harga Jual: {rupiah(ai.tier.price)}</span>
                    </div>
                    <span className="font-display text-xl text-[color:var(--color-ok)] text-right">
                      {rupiah(ai.margin)} <br/>
                      <span className="text-xs font-mono">{ai.marginPct.toFixed(0)}% Margin</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      )}

      {/* ===================================================================== */}
      {/* SUB-TAB 2: MANAJEMEN SDM & KINERJA PENGRAJIN                          */}
      {/* ===================================================================== */}
      {activeTab === 'hr' && (
        <div className="mt-8 space-y-8">
          <div>
            <StageMark
              numeral="tiga"
              title="Kinerja SDM & Hak Pekerja"
              sub="Evaluasi berfokus pada penyelesaian tugas. Waktu izin dan istirahat dihormati sebagai hak pekerja dan tidak mengurangi nilai kepatuhan selama SLA terpenuhi."
            />
          </div>

          <div className="rounded-3xl border border-sky/60 bg-white p-6 sm:p-8 shadow-sm">
            <Tag>Kinerja Harian Pengrajin</Tag>
            <h3 className="mt-2 font-display text-2xl text-navy">
              Analisis Aktivitas & Waktu Kerja
            </h3>
            <p className="text-xs text-deep/70 mt-1">
              Data akumulasi jam kerja produktif dan hak waktu istirahat yang diambil oleh pengrajin.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {workers.map((w) => (
                <div
                  key={w.id}
                  className="rounded-2xl border border-[color:var(--color-ok)]/30 bg-soft p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[color:var(--color-ok)]/20 text-deep">
                      <UserIcon className="h-4 w-4" />
                    </span>
                    <span className="font-mono text-xs font-bold text-[color:var(--color-ok)] flex items-center gap-1">
                      <CheckIcon className="h-3.5 w-3.5" /> 100% Kepatuhan
                    </span>
                  </div>

                  <div>
                    <h4 className="font-display text-lg text-navy">{w.name}</h4>
                    <p className="text-xs text-deep/70">Posisi: {w.currentLocation || 'Stasiun Kerja'}</p>
                  </div>

                  <div className="space-y-2 border-t border-sky/30 pt-3 text-xs text-deep/80 font-mono">
                    <div className="flex justify-between">
                      <span>Waktu Aktif:</span>
                      <span className="font-semibold text-navy">{w.activeHoursToday} Jam</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hak Istirahat:</span>
                      <span className="text-ocean">{w.breakMinutesToday} Menit</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

/* --------------------------- Helper Functions --------------------------- */

const inputCls =
  'w-full rounded-xl border border-sky/70 bg-soft px-3 py-2 text-sm text-navy outline-none transition-colors focus:border-ocean'

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block w-full">
      <span className="mb-1 block text-[12px] font-semibold text-deep/70 uppercase tracking-wide">{label}</span>
      {children}
    </label>
  )
}

function AddBtn({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-ocean/50 py-3.5 text-sm font-semibold text-ocean transition-colors hover:border-ocean hover:bg-ocean/5"
    >
      + {children}
    </button>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sky/60 mb-0.5">{label}</p>
      <p className="text-soft font-semibold">{value}</p>
    </div>
  )
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-sky/30 pb-2 pt-1">
      <span>{label}</span>
      <span className="font-semibold text-navy">{value}</span>
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