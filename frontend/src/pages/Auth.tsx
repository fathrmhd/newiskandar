import { useState, type FC } from 'react'
import { ArrowRight, Canting, CheckIcon, DyeDrop, ShieldIcon, UserIcon } from '@/components/batik'
import { DEFAULT_WORKERS } from '@/lib/ai'

export type UserRole = 'customer' | 'worker' | 'owner'

export interface AuthSession {
  role: UserRole
  name: string
  email: string
  workerId?: string
}

interface AuthProps {
  onLogin: (session: AuthSession) => void
  onCancel?: () => void
}

export const Auth: FC<AuthProps> = ({ onLogin, onCancel }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer')
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(DEFAULT_WORKERS[0].id)
  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleQuickLogin = (role: UserRole) => {
    if (role === 'customer') {
      onLogin({
        role: 'customer',
        name: 'Ahmad Fauzi',
        email: 'ahmad.fauzi@gmail.com',
      })
    } else if (role === 'worker') {
      const w = DEFAULT_WORKERS.find((x) => x.id === selectedWorkerId) || DEFAULT_WORKERS[0]
      onLogin({
        role: 'worker',
        name: w.name,
        email: `${w.id}@sanggar.newiskandar.id`,
        workerId: w.id,
      })
    } else {
      onLogin({
        role: 'owner',
        name: 'Teuku Iskandar (Owner)',
        email: 'owner@sanggar.newiskandar.id',
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedRole === 'customer') {
      onLogin({
        role: 'customer',
        name: name || 'Pembeli Batik',
        email: email || 'pembeli@newiskandar.id',
      })
    } else if (selectedRole === 'worker') {
      const w = DEFAULT_WORKERS.find((x) => x.id === selectedWorkerId) || DEFAULT_WORKERS[0]
      onLogin({
        role: 'worker',
        name: name || w.name,
        email: email || `${w.id}@sanggar.newiskandar.id`,
        workerId: w.id,
      })
    } else {
      onLogin({
        role: 'owner',
        name: name || 'Pemilik Sanggar',
        email: email || 'owner@newiskandar.id',
      })
    }
  }

  return (
    <main className="mx-auto max-w-[1000px] px-5 py-14 sm:px-8">
      {/* Header Autentikasi */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2">
          <DyeDrop className="h-4 w-3" />
          <span className="text-sm font-semibold text-ocean">Portal Autentikasi Tiga Peran</span>
        </div>
        <h1 className="mt-3 font-display text-4xl text-navy sm:text-5xl">
          Masuk ke New Iskandar
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-[15px] text-deep/75">
          Akses disesuaikan berdasarkan hak akses peran: Pembeli, Staf Pembatik, atau Pemilik Sanggar.
        </p>
        <Canting className="mx-auto mt-5 h-2 w-48 text-ocean/70" />
      </div>

      {/* Pemilihan 3 Kartu Peran */}
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Peran 1: Pembeli */}
        <button
          type="button"
          onClick={() => setSelectedRole('customer')}
          className={`flex flex-col rounded-3xl border-2 p-6 text-left transition-all ${
            selectedRole === 'customer'
              ? 'border-ocean bg-white shadow-md ring-2 ring-ocean/20'
              : 'border-sky/60 bg-white/70 hover:border-sky'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky/30 text-deep">
              <UserIcon className="h-5 w-5" />
            </span>
            {selectedRole === 'customer' && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ocean text-soft">
                <CheckIcon className="h-3.5 w-3.5" />
              </span>
            )}
          </div>
          <h3 className="mt-4 font-display text-xl text-navy">Pembeli</h3>
          <p className="mt-1 text-xs text-deep/70">
            Pemesanan batik tulis custom, kalkulasi SLA transparan, dan pelacakan tahapan produksi.
          </p>
        </button>

        {/* Peran 2: Pembatik */}
        <button
          type="button"
          onClick={() => setSelectedRole('worker')}
          className={`flex flex-col rounded-3xl border-2 p-6 text-left transition-all ${
            selectedRole === 'worker'
              ? 'border-ocean bg-white shadow-md ring-2 ring-ocean/20'
              : 'border-sky/60 bg-white/70 hover:border-sky'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky/30 text-deep">
              <DyeDrop className="h-5 w-4" />
            </span>
            {selectedRole === 'worker' && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ocean text-soft">
                <CheckIcon className="h-3.5 w-3.5" />
              </span>
            )}
          </div>
          <h3 className="mt-4 font-display text-xl text-navy">Staf Pembatik</h3>
          <p className="mt-1 text-xs text-deep/70">
            Antarmuka kerja harian stasiun pembatik, checklist SOP pengerjaan, dan sistem peringatan ketiadaan.
          </p>
        </button>

        {/* Peran 3: Pemilik */}
        <button
          type="button"
          onClick={() => setSelectedRole('owner')}
          className={`flex flex-col rounded-3xl border-2 p-6 text-left transition-all ${
            selectedRole === 'owner'
              ? 'border-ocean bg-white shadow-md ring-2 ring-ocean/20'
              : 'border-sky/60 bg-white/70 hover:border-sky'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky/30 text-deep">
              <ShieldIcon className="h-5 w-5" />
            </span>
            {selectedRole === 'owner' && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ocean text-soft">
                <CheckIcon className="h-3.5 w-3.5" />
              </span>
            )}
          </div>
          <h3 className="mt-4 font-display text-xl text-navy">Pemilik Sanggar</h3>
          <p className="mt-1 text-xs text-deep/70">
            Pengawasan multi-kamera AI stasiun kerja, audit log kepatuhan kehadiran, dan simulasi kapasitas/HPP.
          </p>
        </button>
      </div>

      {/* Formulir Masuk & Akses Cepat Demo */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr]">
        {/* Formulir Kredensial */}
        <div className="rounded-3xl border border-sky/60 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between border-b border-sky/30 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-ocean">
                {isRegister ? 'Pendaftaran Akun' : 'Masuk ke Sistem'}
              </span>
              <h2 className="font-display text-2xl text-navy">
                {selectedRole === 'customer'
                  ? 'Akun Pembeli'
                  : selectedRole === 'worker'
                    ? 'Akun Staf Pembatik'
                    : 'Akun Pemilik Sanggar'}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs font-semibold text-ocean hover:text-deep transition-colors"
            >
              {isRegister ? 'Sudah punya akun? Masuk' : 'Daftar akun baru'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-deep/70 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="mis. Bu Nuraini / Teuku Iskandar"
                  className="w-full rounded-xl border border-sky/70 bg-soft px-4 py-2.5 text-sm text-navy outline-none focus:border-ocean transition-colors"
                />
              </div>
            )}

            {selectedRole === 'worker' && (
              <div>
                <label className="block text-xs font-semibold text-deep/70 mb-1">
                  Pilih Profil Pembatik
                </label>
                <select
                  value={selectedWorkerId}
                  onChange={(e) => setSelectedWorkerId(e.target.value)}
                  className="w-full rounded-xl border border-sky/70 bg-soft px-4 py-2.5 text-sm text-navy outline-none focus:border-ocean transition-colors"
                >
                  {DEFAULT_WORKERS.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} — {w.skill}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-deep/70 mb-1">
                {selectedRole === 'customer' ? 'Alamat Email' : 'ID / Email Sanggar'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  selectedRole === 'customer'
                    ? 'nama@email.com'
                    : 'staf@sanggar.newiskandar.id'
                }
                className="w-full rounded-xl border border-sky/70 bg-soft px-4 py-2.5 text-sm text-navy outline-none focus:border-ocean transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-deep/70 mb-1">Kata Sandi</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-sky/70 bg-soft px-4 py-2.5 text-sm text-navy outline-none focus:border-ocean transition-colors"
              />
            </div>

            <button
              type="submit"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-ocean py-3.5 font-semibold text-soft shadow transition-all hover:bg-deep active:scale-[0.98]"
            >
              <span>{isRegister ? 'Daftarkan Akun' : 'Masuk Sekarang'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Akses Cepat Demo (1-Click Login) */}
        <div className="flex flex-col gap-4 rounded-3xl border border-ocean/30 bg-gradient-to-b from-navy via-deep to-[#244b70] p-6 sm:p-8 text-soft shadow-sm">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky">
              <DyeDrop className="h-3.5 w-2.5" color="#b3cfe5" /> Akses Cepat Pengujian (1-Klik)
            </span>
            <h3 className="mt-2 font-display text-2xl text-soft">Masuk Otomatis Sesuai Peran</h3>
            <p className="mt-1 text-xs leading-relaxed text-sky/75">
              Gunakan tombol di bawah untuk langsung mencoba tampilan antarmuka tiap peran tanpa mengisi formulir.
            </p>
          </div>

          <div className="mt-3 space-y-3">
            <button
              onClick={() => handleQuickLogin('customer')}
              className="flex w-full items-center justify-between rounded-2xl border border-white/15 bg-white/10 p-4 text-left backdrop-blur transition-all hover:bg-white/20"
            >
              <div>
                <p className="font-semibold text-soft text-sm">Masuk sebagai Pembeli</p>
                <p className="text-[11px] text-sky/70">Akses laman pemesanan batik & SLA</p>
              </div>
              <ArrowRight className="h-4 w-4 text-sky" />
            </button>

            <button
              onClick={() => handleQuickLogin('worker')}
              className="flex w-full items-center justify-between rounded-2xl border border-white/15 bg-white/10 p-4 text-left backdrop-blur transition-all hover:bg-white/20"
            >
              <div>
                <p className="font-semibold text-soft text-sm">Masuk sebagai Staf Pembatik</p>
                <p className="text-[11px] text-sky/70">Akses dashboard meja kerja & peringatan</p>
              </div>
              <ArrowRight className="h-4 w-4 text-sky" />
            </button>

            <button
              onClick={() => handleQuickLogin('owner')}
              className="flex w-full items-center justify-between rounded-2xl border border-white/15 bg-white/10 p-4 text-left backdrop-blur transition-all hover:bg-white/20"
            >
              <div>
                <p className="font-semibold text-soft text-sm">Masuk sebagai Pemilik Sanggar</p>
                <p className="text-[11px] text-sky/70">Akses grid kamera AI, audit log, & HPP</p>
              </div>
              <ArrowRight className="h-4 w-4 text-sky" />
            </button>
          </div>

          {onCancel && (
            <button
              onClick={onCancel}
              className="mt-2 text-center text-xs text-sky/60 hover:text-soft transition-colors"
            >
              Kembali ke Halaman Beranda
            </button>
          )}
        </div>
      </div>
    </main>
  )
}

export default Auth
