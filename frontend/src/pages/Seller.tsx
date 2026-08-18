import type { FC, ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { Canting, DyeDrop, StageMark, Tag } from '@/components/batik'
import {
  DEFAULT_MATERIALS,
  DEFAULT_WORKERS,
  type Material,
  type Worker,
  computeAI,
  fmtDate,
  rupiah,
} from '@/lib/ai'

let uid = 100
const nextId = () => `x${uid++}`

const Seller: FC = () => {
  const [workers, setWorkers] = useState<Worker[]>(DEFAULT_WORKERS)
  const [materials, setMaterials] = useState<Material[]>(DEFAULT_MATERIALS)
  const [target, setTarget] = useState(40) // pesanan yang ingin disanggupi

  const dailyCapacity = workers.reduce((s, w) => s + (w.rate || 0), 0)
  const ai = useMemo(() => computeAI(target, dailyCapacity), [target, dailyCapacity])
  const alloc = useMemo(() => allocate(workers, ai.poQty), [workers, ai.poQty])

  return (
    <main className="mx-auto max-w-[1180px] px-5 pb-24 pt-10 sm:px-8">
      {/* Header & Stage Mark */}
      <StageMark
        numeral="B"
        title="Dasbor Pembatik & AI Estimator"
        sub="Kelola produksi canting, stok kain mori, dan jadwal celup warna."
      />

      <div className="mt-4 mb-3 flex items-center gap-2">
        <DyeDrop className="h-4 w-3" />
        <span className="text-sm font-semibold text-ocean">Meja kerja sanggar</span>
      </div>
      <h1 className="max-w-2xl font-display text-4xl text-navy">Catat kekuatan sanggar hari ini</h1>
      <p className="mt-2 max-w-xl text-[15px] text-deep/70">
        Isi apa adanya — jumlah tangan yang siap membatik dan bahan yang ada di gudang.
        Dari sini mesin menghitung sanggup berapa banyak, seberapa cepat, dan berapa modalnya.
      </p>
      <Canting className="mt-4 h-2 w-52 text-sky" />

      {/* Overview Cards (Status Aktif & Insight AI) */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-sky/60 bg-white p-6 shadow-sm">
          <Tag>Status Produksi Aktif</Tag>
          <h3 className="mt-2 font-display text-xl text-navy">Pesanan Dalam Pengerjaan</h3>
          <ul className="mt-4 space-y-3 text-sm text-deep">
            <li className="flex justify-between border-b border-sky/20 pb-2">
              <span>Batik Pinto Aceh (Custom 2m)</span>
              <span className="font-semibold text-[color:var(--color-warn)]">Tahap Menutup Lilin</span>
            </li>
            <li className="flex justify-between border-b border-sky/20 pb-2">
              <span>Kain Motif Pucuk Rebung</span>
              <span className="font-semibold text-[color:var(--color-ok)]">Pencelupan Warna Ke-2</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-sky/60 bg-white p-6 shadow-sm">
          <Tag>Rekomendasi AI</Tag>
          <h3 className="mt-2 font-display text-xl text-navy">Optimalisasi Stok</h3>
          <p className="mt-3 text-sm leading-relaxed text-deep/80">
            Permintaan motif <strong>Bungong Jeumpa</strong> diproyeksikan naik 24% minggu depan. Disarankan menyiapkan 5 lembar kain mori primissima dan pewarna indigo ekstra.
          </p>
        </div>
      </div>

      {/* Form Input & Output AI */}
      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_1fr]">
        {/* Kolom input mentah */}
        <div className="flex flex-col gap-10">
          {/* Pekerja */}
          <section>
            <StageMark numeral="satu" title="Tangan yang membatik" sub="Berapa lembar sanggup diselesaikan tiap orang dalam sehari?" />
            <div className="flex flex-col gap-3">
              {workers.map((w, i) => (
                <div key={w.id} className="rounded-2xl border border-sky/60 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <span className="hand-numeral text-xl text-ocean/70">Pembatik {i + 1}</span>
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
            <StageMark numeral="dua" title="Bahan di gudang" sub="Beli banyak sekaligus, supplier beri harga miring — batas diskonnya diisi di sini." />
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
          {/* Berapa pesanan yang ingin disanggupi */}
          <div className="rounded-3xl border border-sky/60 bg-white p-6">
            <Tag>Uji kesanggupan</Tag>
            <p className="mt-2 text-[15px] text-deep/70">Ada pesanan masuk sekian lembar — sanggup?</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center rounded-2xl border border-sky/70 bg-soft">
                <button onClick={() => setTarget(Math.max(1, target - 1))} className="h-11 w-11 text-xl text-deep hover:text-ocean">−</button>
                <input
                  type="number"
                  value={target}
                  min={1}
                  onChange={(e) => setTarget(Math.max(1, Math.round(Number(e.target.value) || 1)))}
                  className="w-20 bg-transparent py-2.5 text-center font-display text-xl text-navy outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button onClick={() => setTarget(target + 1)} className="h-11 w-11 text-xl text-deep hover:text-ocean">+</button>
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
            <p className="mt-1 text-[15px] text-deep/70">{ai.poQty} lembar dibagi adil sesuai kecepatan tiap orang.</p>
            <div className="mt-4 flex flex-col gap-3">
              {alloc.map((a) => (
                <div key={a.id}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="font-medium text-navy">{a.name || 'Pembatik'}</span>
                    <span className="font-mono text-navy">{a.assigned} lbr</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-sky/40">
                    <div className="h-full rounded-full bg-ocean transition-all" style={{ width: `${a.load}%` }} />
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
      <span>{label}{b ? <>{b})</> : null}</span>
      <span className="text-navy">{value}</span>
    </div>
  )
}

function patch<T extends { id: string }>(set: (v: T[]) => void, list: T[], id: string, upd: Partial<T>) {
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