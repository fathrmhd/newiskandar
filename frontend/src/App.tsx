import { useState } from 'react'
import logo from './assets/logo.svg'
import { Canting, DyeDrop, ShieldIcon, UserIcon } from '@/components/batik'
import Landing from '@/pages/Landing'
import Customer from '@/pages/Customer'
import DashboardPembatik from '@/pages/DashboardPembatik'
import DashboardOwner from '@/pages/DashboardOwner'
import Auth, { type AuthSession, type UserRole } from '@/pages/Auth'
import { INITIAL_AUDIT_LOGS, type AuditLog } from '@/lib/ai'

/* ------------------------------------------------------------------ */
/*  New Iskandar — AI Handicraft Commerce (Batik Tulis Aceh)           */
/*  SPA dengan 3 Peran: Pembeli · Staf Pembatik · Pemilik Sanggar.     */
/* ------------------------------------------------------------------ */

export type Page = 'landing' | 'customer' | 'pembatik' | 'owner' | 'auth'

const NAV_ITEMS: { id: Page; label: string; roleReq?: UserRole }[] = [
  { id: 'landing', label: 'Beranda' },
  { id: 'customer', label: 'Pembeli' },
  { id: 'pembatik', label: 'Dashboard Pembatik' },
  { id: 'owner', label: 'Dashboard Pemilik' },
]

export default function App() {
  const [page, setPage] = useState<Page>('landing')
  const [session, setSession] = useState<AuthSession | null>({
    role: 'owner',
    name: 'Teuku Iskandar (Owner)',
    email: 'owner@sanggar.newiskandar.id',
  })
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS)

  const go = (p: Page) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLogin = (newSession: AuthSession) => {
    setSession(newSession)
    if (newSession.role === 'customer') {
      go('customer')
    } else if (newSession.role === 'worker') {
      go('pembatik')
    } else {
      go('owner')
    }
  }

  const handleLogout = () => {
    setSession(null)
    go('auth')
  }

  const handleAddLog = (log: AuditLog) => {
    setAuditLogs((prev) => [log, ...prev])
  }

  return (
    <div className="min-h-screen bg-soft text-navy flex flex-col justify-between">
      <div>
        <Header page={page} go={go} session={session} onAuthClick={() => go('auth')} />

        {page === 'landing' && <Landing go={go} />}
        {page === 'customer' && <Customer />}
        {page === 'pembatik' && (
          <DashboardPembatik
            currentWorkerId={session?.workerId || 'w1'}
            onLogout={handleLogout}
            onAddLog={handleAddLog}
          />
        )}
        {page === 'owner' && (
          <DashboardOwner onLogout={handleLogout} logs={auditLogs} />
        )}
        {page === 'auth' && (
          <Auth onLogin={handleLogin} onCancel={() => go('landing')} />
        )}
      </div>

      <Footer />
    </div>
  )
}

function Header({
  page,
  go,
  session,
  onAuthClick,
}: {
  page: Page
  go: (p: Page) => void
  session: AuthSession | null
  onAuthClick: () => void
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-navy/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between px-5 py-3 sm:px-8">
        {/* Brand Logo */}
        <button
          onClick={() => go('landing')}
          className="flex items-center gap-3 text-left"
        >
          <div className="flex h-12 w-32 items-center justify-center overflow-hidden rounded-lg bg-soft">
            <img
              src={logo}
              alt="New Iskandar"
              className="h-full w-full object-contain scale-240"
            />
          </div>
          <div className="hidden sm:block">
            <p className="font-display text-lg leading-none text-soft">
              New Iskandar
            </p>
          </div>
        </button>

        {/* Navigasi Utama */}
        <nav className="flex items-center gap-5 text-sm text-sky/85 sm:gap-7">
          {NAV_ITEMS.map((n) => {
            const active = n.id === page
            return (
              <button
                key={n.id}
                onClick={() => go(n.id)}
                className="group flex flex-col items-center"
              >
                <span
                  className={`transition-colors text-xs sm:text-sm ${
                    active ? 'text-soft font-semibold' : 'group-hover:text-soft'
                  }`}
                >
                  {n.label}
                </span>
                <Canting
                  className={`mt-0.5 h-1 w-8 text-ocean transition-opacity ${
                    active ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
                  }`}
                />
              </button>
            )
          })}
        </nav>

        {/* Status Peran Pengguna / Tombol Masuk */}
        <div className="hidden lg:flex items-center gap-3">
          {session ? (
            <button
              onClick={onAuthClick}
              className="flex items-center gap-2 rounded-2xl border border-sky/30 bg-white/10 px-3.5 py-1.5 text-xs text-soft hover:bg-white/20 transition-all"
            >
              {session.role === 'owner' ? (
                <ShieldIcon className="h-3.5 w-3.5 text-sky" />
              ) : session.role === 'worker' ? (
                <DyeDrop className="h-3.5 w-2.5" color="#b3cfe5" />
              ) : (
                <UserIcon className="h-3.5 w-3.5 text-sky" />
              )}
              <span className="truncate max-w-[130px]">{session.name}</span>
              <span className="rounded bg-ocean/40 px-1.5 py-0.5 text-[10px] text-sky font-mono">
                {session.role === 'owner'
                  ? 'Owner'
                  : session.role === 'worker'
                    ? 'Pembatik'
                    : 'Pembeli'}
              </span>
            </button>
          ) : (
            <button
              onClick={onAuthClick}
              className="rounded-2xl bg-ocean px-4 py-2 text-xs font-semibold text-soft hover:bg-deep transition-all"
            >
              Masuk / Ganti Peran
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy px-5 py-8 text-center sm:px-8 mt-12">
      <div className="mx-auto flex h-16 w-38 items-center justify-center overflow-hidden rounded-lg bg-soft">
        <img
          src={logo}
          alt="New Iskandar"
          className="h-full w-full object-contain scale-240"
        />
      </div>
      <Canting className="mx-auto mt-4 h-2 w-40 text-ocean" />
      <p className="mt-3 text-[13px] text-sky/60">
        New Iskandar · AI for the Backbone of the Economy
      </p>
      <p className="mt-1 text-xs text-sky/40">
        MVP purwarupa batik — AI Innovation Challenge COMPFEST 18
      </p>
    </footer>
  )
}
