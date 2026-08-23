import { useState, type FC } from 'react'
import {
  CheckIcon,
  StageMark,
  Tag,
  UserIcon,
} from '@/components/batik'
import { DEFAULT_WORKERS, type Worker } from '@/lib/ai'

interface DashboardPembatikProps {
  currentWorkerId?: string
  onLogout?: () => void
}

export const DashboardPembatik: FC<DashboardPembatikProps> = ({
  currentWorkerId = 'w1',
  onLogout,
}) => {
  // Ambil data pekerja langsung dari props (sudah spesifik per akun)
  const worker: Worker = DEFAULT_WORKERS.find((w) => w.id === currentWorkerId) || DEFAULT_WORKERS[0]
  const currentStation = worker.currentLocation || 'Nyanting'
  
  // State untuk pencatatan waktu 1 produk (satuan menit)
  const [productionTime, setProductionTime] = useState({
    activeMinutes: 95,
    breakMinutes: 15, // Waktu idle/hak istirahat
  })

  // Kalkulasi Waktu
  const idealDuration = 120 // Durasi ideal pengerjaan 1 produk (menit)
  const totalDuration = productionTime.activeMinutes + productionTime.breakMinutes
  const isTargetMet = totalDuration <= idealDuration + 10 // Toleransi 10 menit

  return (
    <main className="mx-auto max-w-[1180px] px-5 pb-24 pt-8 sm:px-8">
      
      {/* Bar Header Stasiun Pembatik */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-sky/70 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ocean text-soft">
            <UserIcon className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-ocean">
                Dashboard Kerja Pengrajin
              </span>
        
            </div>
            <h1 className="font-display text-2xl text-navy sm:text-3xl">
              {worker.name}
            </h1>
            <p className="text-xs text-deep/70">
              Keahlian: {worker.skill.replace('Aceh', 'Klasik')}
            </p>
            <p className="text-xs text-deep/70">
              Skor Kepatuhan : 100%
            </p>
          </div>
        </div>

        {/* Profil Pembatik Logout - Dropdown Dihapus */}
        <div className="flex flex-wrap items-center gap-2">
          {onLogout && (
            <button
              onClick={onLogout}
              className="rounded-xl border border-sky/60 bg-white px-3 py-2 text-xs font-semibold text-deep/70 hover:bg-sky/20 hover:text-navy transition-colors"
            >
              Keluar Akun
            </button>
          )}
        </div>
      </div>

      {/* Grid Utama Stasiun Kerja */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr]">
        
        {/* Kolom 1: Pencatatan Waktu Per Produk & Evaluasi */}
        <div className="space-y-6">
          <StageMark  
            title="Durasi Kerja"
          />

          <div className="rounded-3xl border border-sky/60 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-sky/30 pb-4">
              <Tag>Kinerja Pengerjaan 1 Produk</Tag>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-soft p-4 border border-sky/30">
                <p className="text-xs text-deep/60 mb-1">Durasi Kerja Efektif</p>
                <p className="font-display text-3xl text-navy">{productionTime.activeMinutes} <span className="text-sm font-sans text-deep/60">Menit</span></p>
              </div>
              <div className="rounded-2xl bg-soft p-4 border border-sky/30">
                <p className="text-xs text-deep/60 mb-1">Idle Time</p>
                <p className="font-display text-3xl text-navy">{productionTime.breakMinutes} <span className="text-sm font-sans text-deep/60">Menit</span></p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between bg-sky/10 p-4 rounded-2xl border border-sky/20">
              <div>
                <p className="text-sm font-semibold text-navy">Total Durasi Produksi</p>
                <p className="text-xs text-deep/70">Waktu Ideal Workstation: {idealDuration} Menit</p>
              </div>
              <div className="text-right">
                <p className={`font-display text-2xl ${totalDuration > idealDuration + 10 ? 'text-[color:var(--color-danger)]' : 'text-ocean'}`}>
                  {totalDuration} <span className="text-sm">Menit</span>
                </p>
              </div>
            </div>
          </div>

          {/* Sistem Reward */}
          <div className={`rounded-3xl border p-6 shadow-sm flex items-start gap-4 transition-colors ${isTargetMet ? 'bg-[color:var(--color-ok)]/10 border-[color:var(--color-ok)]/30' : 'bg-white border-sky/60'}`}>
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${isTargetMet ? 'bg-[color:var(--color-ok)] text-white' : 'bg-sky/20 text-deep'}`}>
              <CheckIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className={`font-display text-xl ${isTargetMet ? 'text-[color:var(--color-ok)]' : 'text-navy'}`}>
                {isTargetMet ? 'Target Tercapai' : 'Fokus Penyelesaian Target'}
              </h3>
              <h3 className={`font-display text-xl ${isTargetMet ? 'text-[color:var(--color-ok)]' : 'text-navy'}`}>
                {isTargetMet ? 'Anda Mendapat Reward!' : 'Fokus Penyelesaian Target'}
              </h3>
              <p className="mt-1 text-sm text-deep/75">
                {isTargetMet 
                  ? 'Kinerja Anda sangat baik. Waktu istirahat anda tidak mengurangi waktu produksi. Reward-nya bakal digabung ke insentif akhir pekan, ya.' 
                  : 'Selesaikan produk sesuai rentang durasi ideal untuk mengaktifkan insentif reward.'}
              </p>
            </div>
          </div>
        </div>

        {/* Kolom 2: SOP / QC & Status Kehadiran */}
        <div className="flex flex-col gap-6">
          
          {/* Dinamis: SOP atau Quality Control berupa Bullet Points */}
          <div className="rounded-3xl border border-sky/60 bg-white p-6 shadow-sm">
            <Tag>{currentStation === 'Kain Jadi (QC)' ? 'Quality Assurance (QC)' : 'SOP Mutu Sanggar'}</Tag>
            <h4 className="mt-2 font-display text-xl text-navy">
              {currentStation === 'Kain Jadi (QC)' ? 'Pengecekan Kualitas Akhir' : 'Standar Pengerjaan Pos'}
            </h4>
            
            <ul className="mt-5 list-inside list-disc space-y-3 text-sm text-deep/80 marker:text-ocean">
              {currentStation === 'Kain Jadi (QC)' ? (
                <>
                  <li>Warna tidak luntur dan meresap sempurna ke serat kain.</li>
                  <li>Sisa lilin malam (pelorodan) bersih 100% dari permukaan.</li>
                  <li>Kain tidak menyusut signifikan dan siap untuk dipacking.</li>
                </>
              ) : (
                <>
                  <li>Persiapan alat dan bahan baku sesuai takaran stasiun meja kerja.</li>
                  <li>Pengerjaan dilakukan tanpa merusak integritas kain mori.</li>
                  <li>Pembersihan area kerja setelah satu *batch* selesai.</li>
                </>
              )}
            </ul>
          </div>

          {/* Status Kepatuhan & Manajemen SDM */}
      

        </div>
      </div>
    </main>
  )
}

export default DashboardPembatik