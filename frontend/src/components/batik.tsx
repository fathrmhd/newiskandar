import type { ReactNode } from 'react'

/* Guratan canting — garis tangan yang tidak lurus, dipakai sebagai aksen. */
export function Canting({ className = '', color = 'currentColor' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 240 8" preserveAspectRatio="none" className={className} aria-hidden>
      <path
        d="M0 5 C 18 1, 34 7, 52 4 S 88 1, 108 5 S 148 8, 168 3 S 208 1, 240 5"
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

/* Setetes pewarna celup — penanda proses batik, pengganti eyebrow generik. */
export function DyeDrop({ className = '', color = '#4a7fa7' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 16 22" className={className} aria-hidden>
      <path
        d="M8 1C8 1 1.5 9 1.5 14.5A6.5 6.5 0 0 0 14.5 14.5C14.5 9 8 1 8 1Z"
        fill={color}
        opacity="0.9"
      />
    </svg>
  )
}

/*
 * Penanda tahap — treatment personal, BUKAN "TAHAP X · JUDUL" uppercase mono.
 * Angka ditulis tangan (Fraunces italic) di samping judul, ditemani tetes celup.
 */
export function StageMark({
  numeral,
  title,
  sub,
  invert = false,
}: {
  numeral?: string
  title: string
  sub?: string
  invert?: boolean
}) {
  return (
    <div className="mb-6 flex items-start gap-4">
      {numeral && (
        <span
          className={`hand-numeral shrink-0 text-5xl leading-none ${invert ? 'text-sky/70' : 'text-ocean/70'}`}
        >
          {numeral}
        </span>
      )}
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <DyeDrop className="h-4 w-3" color={invert ? '#b3cfe5' : '#4a7fa7'} />
          <h2 className={`font-display text-2xl sm:text-3xl ${invert ? 'text-soft' : 'text-navy'}`}>
            {title}
          </h2>
        </div>
        {sub && <p className={`mt-1 text-[15px] ${invert ? 'text-sky/75' : 'text-deep/70'}`}>{sub}</p>}
        <Canting
          className={`mt-2 h-2 w-44 ${invert ? 'text-ocean' : 'text-sky'}`}
          color={invert ? '#4a7fa7' : '#4a7fa7'}
        />
      </div>
    </div>
  )
}

/* Label kecil non-generik: sentence case, tracking normal, dengan tetes celup. */
export function Tag({ children, invert = false }: { children: ReactNode; invert?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${invert ? 'text-sky' : 'text-ocean'}`}>
      <DyeDrop className="h-3.5 w-2.5" color={invert ? '#b3cfe5' : '#4a7fa7'} />
      {children}
    </span>
  )
}

export function StockBadge({ risk, readyUsed }: { risk: string; readyUsed: number }) {
  const map: Record<string, { c: string; t: string }> = {
    ok: { c: 'var(--color-ok)', t: `Siap kirim · ${readyUsed} lembar` },
    warn: { c: 'var(--color-warn)', t: `Stok menipis · ${readyUsed} lembar` },
    danger: { c: 'var(--color-danger)', t: 'Stok siap habis' },
  }
  const m = map[risk]
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[13px] font-medium"
      style={{ backgroundColor: `color-mix(in srgb, ${m.c} 15%, transparent)`, color: m.c }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: m.c }} />
      {m.t}
    </span>
  )
}
