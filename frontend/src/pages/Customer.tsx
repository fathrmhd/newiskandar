import type { FC, ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { Canting, DyeDrop, StageMark, StockBadge, Tag } from '@/components/batik'
import { BATIK_STAGES, MOTIFS, TIERS, computeAI, fmtDate, rupiah, shortDate } from '@/lib/ai'

export default function Customer() {
  const [step, setStep] = useState<1 | 2>(1)
  const [motif, setMotif] = useState(MOTIFS[0].id)
  const [qty, setQty] = useState(24)
  const ai = useMemo(() => computeAI(qty), [qty])
  const chosen = MOTIFS.find((m) => m.id === motif) ?? MOTIFS[0]

  return (
    <main className="mx-auto max-w-[1180px] px-5 pb-24 pt-10 sm:px-8">
      {/* Alur 2 langkah — penanda personal, bukan stepper generik */}
      <div className="mb-8 flex items-center gap-4 text-[15px]">
        <StepDot n="satu" label="Pilih & atur" active={step === 1} done={step === 2} onClick={() => setStep(1)} />
        <Canting className="h-2 w-16 text-sky" />
        <StepDot n="dua" label="Pantau produksi" active={step === 2} done={false} onClick={() => step === 2 && setStep(2)} />
      </div>

      {step === 1 ? (
        <Screen1
          motif={motif}
          setMotif={setMotif}
          qty={qty}
          setQty={setQty}
          ai={ai}
          onNext={() => setStep(2)}
        />
      ) : (
        <Screen2 chosen={chosen} qty={qty} ai={ai} onBack={() => setStep(1)} />
      )}
    </main>
  )
}

/* ---------------- Layar 1 — pilih motif & atur intensitas -------------- */

function Screen1({
  motif,
  setMotif,
  qty,
  setQty,
  ai,
  onNext,
}: {
  motif: string
  setMotif: (v: string) => void
  qty: number
  setQty: (n: number) => void
  ai: ReturnType<typeof computeAI>
  onNext: () => void
}) {
  const clamp = (n: number) => Math.max(1, Math.min(2000, Math.round(n || 1)))
  
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_1fr]">
      <div>
        <StageMark numeral="satu" title="Pilih model batik" sub="Sentuh kain yang paling bicara ke Anda." />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {MOTIFS.map((m) => {
            const active = m.id === motif
            return (
              <button
                key={m.id}
                onClick={() => setMotif(m.id)}
                className={`overflow-hidden rounded-2xl border-2 text-left transition-all ${
                  active ? 'border-ocean shadow-md' : 'border-transparent hover:border-sky'
                }`}
              >
                <div className="relative">
                  <img src={m.img} alt={`Batik motif ${m.name}`} className="h-36 w-full bg-[#d9cdb6] object-cover" />
                  <span
                    className={`absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                      active ? 'border-ocean bg-ocean text-soft' : 'border-white bg-white/70'
                    }`}
                  >
                    {active && <Check />}
                  </span>
                </div>
                <div className="bg-white px-3 py-2">
                  <p className="font-display text-[17px] text-navy">{m.name}</p>
                  <p className="font-mono text-[11px] text-ocean/80">{m.sku}</p>
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-8">
          <StageMark title="Atur intensitas pesanan" sub="Makin banyak lembar, makin turun harga per lembarnya." />
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-2xl border border-sky/70 bg-white">
              <StepBtn onClick={() => setQty(clamp(qty - 1))} label="−" />
              <input
                type="number"
                value={qty}
                min={1}
                onChange={(e) => setQty(clamp(Number(e.target.value)))}
                className="w-20 bg-transparent py-3 text-center font-display text-2xl text-navy outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
              />
              <StepBtn onClick={() => setQty(clamp(qty + 1))} label="+" />
            </div>
            <div className="flex gap-2">
              {[10, 50, 100].map((v) => (
                <button
                  key={v}
                  onClick={() => setQty(v)}
                  className="rounded-xl border border-sky/70 bg-white px-4 py-2.5 font-mono text-sm text-deep transition-colors hover:border-ocean hover:text-ocean"
                >
                  {v}
                </button>
              ))}
            </div>
            <span className="text-sm text-deep/60">lembar</span>
          </div>
        </div>
      </div>

      {/* Ringkasan pembeli — harga, stok, SLA */}
      <aside className="flex flex-col gap-5 self-start rounded-3xl border border-sky/60 bg-white p-6">
        <div className="flex flex-wrap items-center gap-2">
          <StockBadge risk={ai.stockRisk} readyUsed={ai.readyUsed} />
          {ai.poQty > 0 && (
            <span className="rounded-full bg-[color:var(--color-warn)]/15 px-3 py-1 text-[13px] font-medium text-[color:var(--color-warn)]">
              Pre-order {ai.poQty} lembar
            </span>
          )}
        </div>

        <div>
          <Tag>Harga transparan / lembar</Tag>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="font-display text-[2.6rem] leading-none text-navy">{rupiah(ai.tier.price)}</span>
            <span className="rounded-lg bg-deep px-2.5 py-1 text-xs font-medium text-soft">Tier {ai.tier.label}</span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {TIERS.map((t) => {
              const active = t === ai.tier
              return (
                <button
                  key={t.label}
                  onClick={() => setQty(t.min === 1 ? 5 : t.min)}
                  className={`rounded-xl border px-2.5 py-2 text-left transition-all ${
                    active ? 'border-ocean bg-ocean text-soft' : 'border-sky/70 bg-soft text-deep hover:border-ocean'
                  }`}
                >
                  <p className="font-mono text-[11px] opacity-80">
                    {t.max === Infinity ? `${t.min}+` : `${t.min}–${t.max}`}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold">{rupiah(t.price)}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* SLA predictor — kartu celup indigo */}
        <div
          className="rounded-2xl border border-ocean/30 p-4 text-soft"
          style={{ backgroundImage: 'linear-gradient(180deg,#0a1931,#1a3d63 60%,#2f5b83)' }}
        >
          <Tag invert>Perkiraan selesai</Tag>
          <p className="mt-2 font-display text-2xl leading-tight text-soft">{fmtDate(ai.slaDate)}</p>
          <div className="mt-3 grid grid-cols-3 gap-2 border-t border-white/15 pt-3 font-mono text-[12px] text-sky/85">
            <span>Bahan {ai.materialLead}h</span>
            <span>Kerja {ai.productionDays.toFixed(1)}h</span>
            <span>Finishing {ai.finishing}h</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-sky/60 pt-4">
          <div>
            <Tag>Subtotal {qty} lembar</Tag>
            <p className="font-display text-2xl text-navy">{rupiah(ai.subtotal)}</p>
          </div>
          <button
            onClick={onNext}
            className="rounded-2xl bg-ocean px-6 py-3 font-semibold text-soft transition-all hover:bg-deep active:scale-[0.98]"
          >
            Proses pesanan
          </button>
        </div>
      </aside>
    </div>
  )
}

/* ---------------- Layar 2 — status pesanan diproses -------------------- */

function Screen2({
  chosen,
  qty,
  ai,
  onBack,
}: {
  chosen: (typeof MOTIFS)[number]
  qty: number
  ai: ReturnType<typeof computeAI>
  onBack: () => void
}) {
  const progress = 0.52
  const activeIndex = 1
  const active = BATIK_STAGES[activeIndex]

  return (
    <div>
      <button onClick={onBack} className="mb-6 text-sm font-semibold text-ocean hover:text-deep">← Ubah pesanan</button>
      <StageMark
        numeral="dua"
        title="Pesanan Anda sedang dikerjakan"
        sub={`${qty} lembar Batik ${chosen.name} · kode BTK-${chosen.sku.slice(-3)}-${qty}`}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-3xl border border-sky/60 bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[15px] text-deep/70">Tahap yang sedang berjalan</p>
              <p className="font-display text-3xl text-navy">{active.name}</p>
              <p className="mt-1 text-sm text-deep/60">{active.note}</p>
            </div>
            <span className="font-display text-5xl text-ocean">{Math.round(progress * 100)}%</span>
          </div>

          <div className="mt-5 h-3 w-full overflow-hidden rounded-full bg-sky/40">
            <div
              className="h-full rounded-full transition-[width] duration-700"
              style={{ width: `${progress * 100}%`, backgroundImage: 'linear-gradient(90deg,#1a3d63,#4a7fa7)' }}
            />
          </div>

          <ol className="mt-7 space-y-3">
            {BATIK_STAGES.map((s, i) => {
              const done = i < activeIndex
              const isActive = i === activeIndex
              return (
                <li key={s.name} className="flex items-center gap-3">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-[12px] ${
                      done
                        ? 'bg-[color:var(--color-ok)] text-soft'
                        : isActive
                          ? 'bg-ocean text-soft'
                          : 'border border-sky bg-soft text-deep/50'
                    }`}
                  >
                    {done ? '✓' : i + 1}
                  </span>
                  <div className="flex-1 border-b border-sky/40 pb-2">
                    <div className="flex items-baseline justify-between">
                      <p className={`font-semibold ${isActive ? 'text-navy' : done ? 'text-deep' : 'text-deep/60'}`}>
                        {s.name}
                      </p>
                      {isActive && <span className="text-[13px] font-medium text-ocean">berlangsung</span>}
                      {done && <span className="text-[13px] text-[color:var(--color-ok)]">selesai</span>}
                    </div>
                    <p className="text-sm text-deep/60">{s.note}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>

        <aside
          className="flex flex-col gap-4 self-start rounded-3xl border border-ocean/30 p-6 text-soft"
          style={{ backgroundImage: 'linear-gradient(180deg,#0a1931,#1a3d63 65%,#2f5b83)' }}
        >
          <div className="flex items-center gap-2">
            <DyeDrop className="h-4 w-3" color="#b3cfe5" />
            <p className="text-sky/80">Perkiraan tiba di tangan Anda</p>
          </div>
          <p className="font-display text-2xl leading-tight text-soft">{fmtDate(ai.slaDate)}</p>
          <div className="rounded-2xl bg-white/10 p-4 font-mono text-[13px] text-sky/85">
            <Row label="Pesan diterima" value={shortDate(new Date('2026-08-16'))} />
            <Row label="Ready stock" value={`${ai.readyUsed} lembar`} />
            <Row label="Dibuat baru" value={`${ai.poQty} lembar`} />
            <Row label="Sisa lead time" value={`${Math.max(0, Math.ceil(ai.totalDays))} hari`} last />
          </div>
          <p className="text-[13px] leading-relaxed text-sky/60">
            Kabar tahap berikut dikirim otomatis begitu kain masuk pelorodan.
          </p>
        </aside>
      </div>
    </div>
  )
}

function Row({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-1.5 ${last ? '' : 'border-b border-white/10'}`}>
      <span className="text-sky/60">{label}</span>
      <span className="text-soft">{value}</span>
    </div>
  )
}

function StepBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} className="flex h-12 w-12 items-center justify-center text-2xl text-deep transition-colors hover:text-ocean">
      {label}
    </button>
  )
}

function StepDot({ n, label, active, done, onClick }: { n: string; label: string; active: boolean; done: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 text-left">
      <span className={`hand-numeral text-2xl ${active ? 'text-ocean' : done ? 'text-[color:var(--color-ok)]' : 'text-deep/35'}`}>{n}</span>
      <span className={`${active ? 'font-semibold text-navy' : 'text-deep/55'}`}>{label}</span>
    </button>
  )
}

function Check() {
  return (
    <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="none" aria-hidden>
      <path d="M3 7l2.5 2.5L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}