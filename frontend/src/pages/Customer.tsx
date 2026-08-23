import type { FC, ReactNode } from "react";
import { useMemo, useState } from "react";
import {
  Canting,
  CheckIcon,
  DyeDrop,
  StageMark,
  Tag,
} from "@/components/batik";
import {
  BATIK_STAGES,
  MOTIFS,
  TIERS,
  computeAI,
  fmtDate,
  rupiah,
  shortDate,
} from "@/lib/ai";

import dt1 from "@/assets/digitaltwin1.jpeg";
import dt2 from "@/assets/digitaltwin2.jpeg";
import dt3 from "@/assets/digitaltwin3.jpeg";
import dt4 from "@/assets/digitaltwin4.jpeg";

const BRAND_GRADIENT = "linear-gradient(180deg,#0a1931,#1a3d63 60%,#2f5b83)";

export interface StageInfo {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  duration: string;
  temperature?: string;
  tool?: string;
  cropCoords: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  isFinal?: boolean;
}

export const DIGITAL_TWIN_STAGES: StageInfo[] = [
  {
    id: 1,
    name: "Pemotongan",
    cropCoords: { x: 6, y: 8, w: 50, h: 50 },
  },
  {
    id: 2,
    name: "Nyanting Motif Malam",
    cropCoords: { x: 49, y: 0, w: 50, h: 50 },
  },
  {
    id: 3,
    name: "Pencelupan",
    cropCoords: { x: 0, y: 50, w: 50, h: 50 },
  },
  {
    id: 4,
    name: "Pelorodan & QC Mutu",
    cropCoords: { x: 50, y: 50, w: 50, h: 50 },
  },
  {
    id: 5,
    name: "Pengiriman",
    isFinal: true,
  },
];

export default function Customer() {
  const [step, setStep] = useState<1 | 2>(1);
  const [motif, setMotif] = useState(MOTIFS[0].id);
  const [qty, setQty] = useState(24);

  const ai = useMemo(() => computeAI(qty), [qty]);
  const chosen = MOTIFS.find((m) => m.id === motif) ?? MOTIFS[0];

  return (
    <main className="mx-auto max-w-[1180px] px-5 pb-24 pt-10 sm:px-8">
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
  );
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
  motif: string;
  setMotif: (v: string) => void;
  qty: number;
  setQty: (n: number) => void;
  ai: ReturnType<typeof computeAI>;
  onNext: () => void;
}) {
  const clamp = (n: number) => Math.max(1, Math.min(2000, Math.round(n || 1)));

  const minDays = Math.max(1, Math.ceil(ai.totalDays));
  const maxDays = minDays + 3;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_1fr]">
      <div>
        <StageMark title="Pilih motif batik" />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {MOTIFS.map((m) => {
            const active = m.id === motif;

            return (
              <button
                key={m.id}
                onClick={() => setMotif(m.id)}
                className={`overflow-hidden rounded-2xl border-2 text-left transition-all ${
                  active
                    ? "border-ocean shadow-md"
                    : "border-transparent hover:border-sky"
                }`}
              >
                <div className="relative">
                  <img
                    src={m.img}
                    alt={`Batik motif ${m.name}`}
                    className="h-36 w-full bg-[#d9cdb6] object-cover"
                  />

                  <span
                    className={`absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                      active
                        ? "border-white/30 text-soft shadow-sm"
                        : "border-white bg-white/70"
                    }`}
                    style={active ? { backgroundImage: BRAND_GRADIENT } : undefined}
                  >
                    {active && <CheckIcon className="h-3.5 w-3.5" />}
                  </span>
                </div>

                <div className="bg-white px-3 py-2">
                  <p className="font-display text-[17px] text-navy">{m.name}</p>
                  <p className="font-mono text-[11px] text-ocean/80">{m.sku}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8">
          <StageMark title="Atur jumlah pesanan" />

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

      <aside className="flex flex-col gap-5 self-start rounded-3xl border border-sky/60 bg-white p-6">
        <div>
          <Tag>Harga</Tag>

          <div className="mt-2 flex items-baseline gap-3">
            <span className="font-display text-[2.6rem] leading-none text-navy">
              {rupiah(ai.tier.price)}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {TIERS.map((t) => {
              const active = t === ai.tier;

              return (
                <button
                  key={t.label}
                  onClick={() => setQty(t.min === 1 ? 5 : t.min)}
                  className={`rounded-xl border px-2.5 py-2 text-left transition-all ${
                    active
                      ? "border-ocean/40 text-soft shadow-sm"
                      : "border-sky/70 bg-soft text-deep hover:border-ocean"
                  }`}
                  style={active ? { backgroundImage: BRAND_GRADIENT } : undefined}
                >
                  <p className="font-mono text-[11px] opacity-80">
                    {t.max === Infinity ? `${t.min}+` : `${t.min}–${t.max}`}
                  </p>

                  <p className="mt-0.5 text-sm font-semibold">
                    {rupiah(t.price)}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div
          className="rounded-2xl border border-ocean/30 p-5 text-soft"
          style={{ backgroundImage: BRAND_GRADIENT }}
        >
          <Tag invert>Estimasi Pengerjaan</Tag>

          <p className="mt-2 font-display text-3xl leading-tight text-soft">
            {minDays} - {maxDays} Hari
          </p>

          <p className="mt-2 text-[13px] text-sky/80 border-t border-white/15 pt-3">
            *Estimasi sudah termasuk antrian dan waktu produksi
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-sky/60 pt-4">
          <div>
            <Tag>Subtotal {qty} lembar</Tag>

            <p className="font-display text-2xl text-navy">
              {rupiah(ai.subtotal)}
            </p>
          </div>

          <button
            onClick={onNext}
            className="rounded-2xl px-6 py-3 font-semibold text-soft transition-all hover:opacity-90 active:scale-[0.98] shadow-sm"
            style={{ backgroundImage: BRAND_GRADIENT }}
          >
            Proses pesanan
          </button>
        </div>
      </aside>
    </div>
  );
}

/* ---------------- Layar 2 — status pesanan diproses -------------------- */

function Screen2({
  chosen,
  qty,
  ai,
  onBack,
}: {
  chosen: (typeof MOTIFS)[number];
  qty: number;
  ai: ReturnType<typeof computeAI>;
  onBack: () => void;
}) {
  // Tahap aktif yang sedang dikerjakan pembatik (Tahap 3: Celup Indigo)
  const currentStage = DIGITAL_TWIN_STAGES[0] ?? DIGITAL_TWIN_STAGES[0];

  const minDays = Math.max(1, Math.ceil(ai.totalDays));
  const maxDays = minDays + 3;

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={onBack}
          className="text-sm font-semibold text-ocean transition-colors hover:text-deep"
        >
          ← Kembali
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        {/* Kolom Kiri: Satu Proses Tunggal Digital Twin */}
        <div className="rounded-3xl border border-sky/60 bg-white p-6 sm:p-8 shadow-sm">
          <div className="mb-6 flex">
            <span className="flex items-center gap-2 rounded-full bg-[color:var(--color-ok)]/15 px-4 py-1.5 font-mono text-xs font-semibold text-[color:var(--color-ok)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--color-ok)] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--color-ok)]" />
              </span>
              Sedang Diproses
            </span>
          </div>

          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[1fr_1.2fr]">
            {/* Visual Crop Digital Twin */}
            <div className="relative aspect-square w-full max-w-[320px] mx-auto overflow-hidden rounded-3xl border-2 border-sky/70 bg-white p-3 shadow-sm flex items-center justify-center">
              {currentStage.isFinal ? (
                <div className="relative h-full w-full overflow-hidden rounded-2xl flex items-center justify-center">
                  <img
                    src={dt3}
                    alt={currentStage.name}
                    className="h-full w-full object-contain"
                  />
                  <div className="absolute bottom-2 left-2 rounded-xl bg-navy/80 px-2.5 py-1 text-[11px] font-mono text-soft backdrop-blur">
                    Batik Tulis Selesai
                  </div>
                </div>
              ) : (
                <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white flex items-center justify-center">
                  <div
                    className="absolute h-[200%] w-[200%] transition-all duration-500 ease-out"
                    style={{
                      left: `${-currentStage.cropCoords.x * 2}%`,
                      top: `${-currentStage.cropCoords.y * 2}%`,
                    }}
                  >
                    <img
                      src={dt4}
                      alt={currentStage.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Retikel Sudut */}
              <div className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l-2 border-t-2 border-ocean/40" />
              <div className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r-2 border-t-2 border-ocean/40" />
              <div className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b-2 border-l-2 border-ocean/40" />
              <div className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b-2 border-r-2 border-ocean/40" />
            </div>

            {/* Rincian Deskripsi Proses */}
            <div className="space-y-4">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-ocean">
                  Tahap 0{currentStage.id}
                </span>
                <h3 className="mt-1 font-display text-2xl sm:text-3xl text-navy">
                  {currentStage.name}
                </h3>
                <p className="mt-1 text-xs sm:text-sm font-medium text-ocean">
                  {currentStage.subtitle}
                </p>
              </div>

              <p className="text-xs sm:text-sm leading-relaxed text-deep/80">
                {currentStage.description}
              </p>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Durasi & Ringkasan SLA */}
        <aside
          className="flex flex-col gap-4 self-start rounded-3xl border border-ocean/30 p-6 text-soft shadow-sm w-full"
          style={{ backgroundImage: BRAND_GRADIENT }}
        >
          <div className="flex items-center gap-2">
            <DyeDrop className="h-4 w-3" color="#b3cfe5" />
            <p className="text-sky/80">Durasi Produksi</p>
          </div>

          <p className="font-display text-3xl leading-tight text-soft">
            {minDays} - {maxDays} Hari
          </p>

          <div className="mt-2 rounded-2xl bg-white/10 p-4 font-mono text-[13px] text-sky/85">
            <Row label="Pesanan diterima" value={shortDate(new Date())} />
            <Row label="Motif" value={chosen.name} />
            <Row label="Jumlah" value={`${qty} lembar`} />
            <Row label="Status Saat Ini" value={currentStage.name} last />
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ---------------- Fungsi Helper -------------------- */

function Row({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between py-1.5 ${
        last ? "" : "border-b border-white/10"
      }`}
    >
      <span className="text-sky/60">{label}</span>
      <span className="text-soft">{value}</span>
    </div>
  );
}

function StepBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="flex h-12 w-12 items-center justify-center text-2xl text-deep transition-colors hover:text-ocean"
    >
      {label}
    </button>
  );
}