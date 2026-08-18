import type { ReactNode } from 'react'

/* Guratan canting — garis tangan yang tidak lurus, dipakai sebagai aksen. */
export function Canting({
  className = '',
  color = 'currentColor',
}: {
  className?: string
  color?: string
}) {
  return (
    <svg viewBox="0 0 240 8" preserveAspectRatio="none" className={className} aria-hidden="true">
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
export function DyeDrop({
  className = '',
  color = '#4a7fa7',
}: {
  className?: string
  color?: string
}) {
  return (
    <svg viewBox="0 0 16 22" className={className} aria-hidden="true">
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
          className={`hand-numeral shrink-0 text-5xl leading-none ${
            invert ? 'text-sky/70' : 'text-ocean/70'
          }`}
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
        {sub && (
          <p className={`mt-1 text-[15px] ${invert ? 'text-sky/75' : 'text-deep/70'}`}>{sub}</p>
        )}
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
    <span
      className={`inline-flex items-center gap-1.5 text-sm font-semibold ${
        invert ? 'text-sky' : 'text-ocean'
      }`}
    >
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

/* Minimal Artisanal Vector Icons (Pengganti Emoji Tanpa Slop) */
export function CameraIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  )
}

export function ShieldIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

export function UserIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

export function ClockIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

export function AlertIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

export function CheckIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export function SlidersIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  )
}

export function LogIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}

export function ArrowRight({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  )
}
