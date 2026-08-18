import { useEffect, useState, type FC } from 'react'
import { Canting, CheckIcon, ClockIcon, DyeDrop, StageMark, Tag } from './batik'
import dt1 from '@/assets/digitaltwin1.jpeg'
import dt2 from '@/assets/digitaltwin2.jpeg'
import dt3 from '@/assets/digitaltwin3.jpeg'
import dt4 from '@/assets/digitaltwin4.jpeg'

export interface StageInfo {
  id: number
  name: string
  subtitle: string
  description: string
  duration: string
  temperature?: string
  tool: string
  cropCoords: {
    // Koordinat crop persentase dari gambar 2x2 (digitaltwin2/4)
    x: number
    y: number
    w: number
    h: number
  }
  isFinal?: boolean
}

export const DIGITAL_TWIN_STAGES: StageInfo[] = [
  {
    id: 1,
    name: 'Pemotongan & Persiapan Mori',
    subtitle: 'Tahap 1: Pengukuran panjang 2.4 meter & perataan serat',
    description:
      'Kain mori primissima dipotong presisi sesuai ukuran standar pesanan dan dicuci untuk menghilangkan kanji alami agar malam lilin dapat meresap sempurna.',
    duration: '15 - 30 Menit',
    tool: 'Gunting Kain Tradisional & Meteran Kayu',
    cropCoords: { x: 0, y: 0, w: 50, h: 50 }, // Top-Left
  },
  {
    id: 2,
    name: 'Nyanting Motif Malam (Lilin Panas)',
    subtitle: 'Tahap 2: Penggoresan garis klowong & isen-isen halus',
    description:
      'Pembatik menggoreskan lelehan lilin malam panas menggunakan canting tembaga nomor 2 secara bolak-balik agar pola tertutup rapat dari rembesan warna.',
    duration: '2 - 3 Hari / Lembar',
    temperature: '65° - 70°C (Suhu Wajan Malam)',
    tool: 'Canting Tulis Tembaga & Wajan Lilin Listrik',
    cropCoords: { x: 50, y: 0, w: 50, h: 50 }, // Top-Right
  },
  {
    id: 3,
    name: 'Pencelupan Warna Alami (Indigo)',
    subtitle: 'Tahap 3: Perendaman fermentasi daun pasta Indigofera',
    description:
      'Kain yang telah dicanting dicelup berulang kali ke dalam bak fermentasi indigo alami untuk memperoleh kedalaman warna biru khas pesisir Aceh.',
    duration: '4 - 6 Jam (3x Celup & Aerasi)',
    temperature: 'Suhu Ruang (Fermentasi pH 9.5)',
    tool: 'Bak Celup Indigo Tradisional & Gawangan Kering',
    cropCoords: { x: 0, y: 50, w: 50, h: 50 }, // Bottom-Left
  },
  {
    id: 4,
    name: 'Pelorodan Malam & Pemeriksaan Mutu',
    subtitle: 'Tahap 4: Peluruhan lilin dengan air mendidih & QC',
    description:
      'Malam diluruhkan dalam kuali air panas mendidih dengan campuran soda abu alami, menyingkap kontras putih mori dan motif indigo yang tajam.',
    duration: '45 Menit',
    temperature: '90° - 95°C (Kuali Air Panas)',
    tool: 'Kuali Pelorodan Tembaga & Bilasan Air Bersih',
    cropCoords: { x: 50, y: 50, w: 50, h: 50 }, // Bottom-Right
  },
  {
    id: 5,
    name: 'Kain Jadi & Siap Pengiriman',
    subtitle: 'Tahap 5: Pelipatan rapi, sertifikasi keaslian, & kemasan',
    description:
      'Kain batik tulis selesai melalui seluruh tahapan dengan mutu sempurna, dilipat rapi, dan siap dikirimkan kepada pembeli.',
    duration: 'Selesai & Lolos QC',
    tool: 'Kemasan Kotak Sanggar & Sertifikat Keaslian',
    cropCoords: { x: 0, y: 0, w: 100, h: 100 },
    isFinal: true,
  },
]

interface BatikDigitalTwinAnimationProps {
  initialStage?: number
  autoPlayInterval?: number
  compact?: boolean
  showControls?: boolean
  onStageChange?: (stageId: number) => void
}

export const BatikDigitalTwinAnimation: FC<BatikDigitalTwinAnimationProps> = ({
  initialStage = 2,
  autoPlayInterval = 4000,
  compact = false,
  showControls = true,
  onStageChange,
}) => {
  const [currentStageId, setCurrentStageId] = useState<number>(initialStage)
  const [isPlaying, setIsPlaying] = useState<boolean>(true)
  const [showPatterned, setShowPatterned] = useState<boolean>(true)
  const [progress, setProgress] = useState<number>(0)
  const [viewMode, setViewMode] = useState<'focused' | 'grid'>('focused')

  const stage =
    DIGITAL_TWIN_STAGES.find((s) => s.id === currentStageId) || DIGITAL_TWIN_STAGES[0]

  // Otomatis berpindah tahap saat Auto-Play aktif
  useEffect(() => {
    if (!isPlaying) return

    const intervalTime = 100
    const stepIncrement = (intervalTime / autoPlayInterval) * 100

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          const nextStage = currentStageId >= 5 ? 1 : currentStageId + 1
          setCurrentStageId(nextStage)
          if (onStageChange) onStageChange(nextStage)
          return 0
        }
        return prev + stepIncrement
      })
    }, intervalTime)

    return () => clearInterval(timer)
  }, [isPlaying, currentStageId, autoPlayInterval, onStageChange])

  const selectStage = (id: number) => {
    setCurrentStageId(id)
    setProgress(0)
    if (onStageChange) onStageChange(id)
  }

  return (
    <div className="rounded-3xl border border-sky/60 bg-white p-6 sm:p-8 shadow-sm">
      {/* Header Visualizer */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-sky/30 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <DyeDrop className="h-4 w-3" />
            <span className="text-xs font-bold uppercase tracking-wider text-ocean">
              Animasi Digital Twin Proses Batik Tulis
            </span>
          </div>
          <h3 className="mt-1 font-display text-2xl sm:text-3xl text-navy">
            Simulasi Tahapan Karya Pengrajin
          </h3>
          <p className="text-xs text-deep/70 mt-0.5">
            Konsep ilustrasi Digital Twin menelusuri tiap fase pembuatan batik dari mori mentah hingga kain jadi.
          </p>
        </div>

        {/* Kontrol Mode Tampilan & Pola */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowPatterned(!showPatterned)}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
              showPatterned
                ? 'bg-ocean text-soft shadow-sm'
                : 'border border-sky/70 bg-soft text-deep hover:bg-sky/20'
            }`}
          >
            {showPatterned ? 'Kain Bermotif Aktif' : 'Kain Mori Polos'}
          </button>

          <button
            onClick={() => setViewMode(viewMode === 'focused' ? 'grid' : 'focused')}
            className="rounded-xl border border-sky/70 bg-soft px-3.5 py-2 text-xs font-semibold text-deep hover:bg-sky/20 transition-all"
          >
            {viewMode === 'focused' ? 'Tampilkan Semua Tahap (Grid)' : 'Tampilan Terfokus'}
          </button>
        </div>
      </div>

      {/* Navigasi Tahap 1 s/d 5 (Scrubber Interaktif) */}
      <div className="mt-6">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {DIGITAL_TWIN_STAGES.map((s) => {
            const isActive = s.id === currentStageId
            const isCompleted = s.id < currentStageId

            return (
              <button
                key={s.id}
                onClick={() => selectStage(s.id)}
                className={`flex flex-col rounded-2xl border p-3 text-left transition-all ${
                  isActive
                    ? 'border-ocean bg-ocean/10 shadow-sm ring-2 ring-ocean/30'
                    : isCompleted
                      ? 'border-sky/50 bg-soft text-deep/80 hover:border-ocean'
                      : 'border-sky/30 bg-soft/50 text-deep/50 hover:border-sky/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-ocean">
                    0{s.id}
                  </span>
                  {isActive && (
                    <span className="h-2 w-2 rounded-full bg-ocean animate-ping" />
                  )}
                  {isCompleted && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[color:var(--color-ok)] text-soft">
                      <CheckIcon className="h-2.5 w-2.5" />
                    </span>
                  )}
                </div>
                <p
                  className={`mt-2 font-display text-sm font-semibold truncate ${
                    isActive ? 'text-navy' : 'text-deep/80'
                  }`}
                >
                  {s.name.split(' ')[0]} {s.name.split(' ')[1] || ''}
                </p>
                <p className="text-[10px] text-deep/60 truncate font-mono mt-0.5">
                  {s.duration.split(' ')[0]} {s.duration.split(' ')[1] || ''}
                </p>
              </button>
            )
          })}
        </div>

        {/* Progress Bar Waktu Tahap */}
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-sky/20">
          <div
            className="h-full bg-ocean transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Konten Utama Animasi Digital Twin */}
      {viewMode === 'focused' ? (
        /* TAMPILAN TERFOKUS DENGAN CROP FOKUS TAHAP */
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_1fr] items-center">
          {/* Ilustrasi Frame Digital Twin */}
          <div className="relative aspect-square max-w-[440px] mx-auto w-full overflow-hidden rounded-3xl border-2 border-sky/70 bg-white p-4 shadow-sm flex items-center justify-center">
            {stage.isFinal ? (
              /* Tahap 5: Gambar Digital Twin 1 / 3 (Thumbs Up & Lipatan Kain) */
              <div className="relative h-full w-full overflow-hidden rounded-2xl flex items-center justify-center">
                <img
                  src={showPatterned ? dt3 : dt1}
                  alt={stage.name}
                  className="h-full w-full object-contain transition-all duration-500 hover:scale-105"
                />
                <div className="absolute bottom-2 left-2 rounded-xl bg-navy/80 px-2.5 py-1 text-[11px] font-mono text-soft backdrop-blur">
                  {showPatterned ? 'Batik Tulis Selesai' : 'Mori Siap Jahit'}
                </div>
              </div>
            ) : (
              /* Tahap 1 - 4: Crop quadrant dari gambar 2x2 (digitaltwin2/4) */
              <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white flex items-center justify-center">
                <div
                  className="absolute h-[200%] w-[200%] transition-all duration-500 ease-out"
                  style={{
                    left: `${-stage.cropCoords.x * 2}%`,
                    top: `${-stage.cropCoords.y * 2}%`,
                  }}
                >
                  <img
                    src={showPatterned ? dt4 : dt2}
                    alt={stage.name}
                    className="h-full w-full object-contain"
                  />
                </div>

                {/* Badge Penanda Tahap di Gambar */}
                <div className="absolute bottom-2 left-2 rounded-xl bg-navy/85 px-3 py-1 font-mono text-[11px] text-soft shadow backdrop-blur">
                  Tahap 0{stage.id} · {stage.name}
                </div>
              </div>
            )}

            {/* Corner Decorative Reticles */}
            <div className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l-2 border-t-2 border-ocean/40" />
            <div className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r-2 border-t-2 border-ocean/40" />
            <div className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b-2 border-l-2 border-ocean/40" />
            <div className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b-2 border-r-2 border-ocean/40" />
          </div>

          {/* Informasi Naratif Tahap Digital Twin */}
          <div className="space-y-5">
            <div>
              <span className="font-mono text-xs font-bold text-ocean uppercase tracking-wider">
                Fase 0{stage.id} dari 05
              </span>
              <h4 className="mt-1 font-display text-3xl text-navy">
                {stage.name}
              </h4>
              <p className="mt-1 text-sm font-medium text-ocean">
                {stage.subtitle}
              </p>
              <Canting className="mt-3 h-2 w-40 text-sky" />
            </div>

            <p className="text-sm leading-relaxed text-deep/85">
              {stage.description}
            </p>

            {/* Parameter Teknis Digital Twin */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 rounded-2xl border border-sky/40 bg-soft p-4 text-xs font-mono text-deep">
              <div>
                <span className="text-deep/50 block">Estimasi Durasi:</span>
                <span className="font-bold text-navy">{stage.duration}</span>
              </div>
              <div>
                <span className="text-deep/50 block">Alat Utama:</span>
                <span className="font-semibold text-ocean">{stage.tool}</span>
              </div>
              {stage.temperature && (
                <div className="sm:col-span-2 border-t border-sky/30 pt-2">
                  <span className="text-deep/50 block">Suhu Operasional:</span>
                  <span className="font-semibold text-[color:var(--color-warn)]">
                    {stage.temperature}
                  </span>
                </div>
              )}
            </div>

            {/* Tombol Play/Pause & Navigasi */}
            {showControls && (
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-semibold transition-all ${
                    isPlaying
                      ? 'bg-navy text-soft shadow'
                      : 'bg-ocean text-soft hover:bg-deep shadow'
                  }`}
                >
                  <span>{isPlaying ? 'Jeda Simulasi' : 'Jalankan Animasi Otomatis'}</span>
                </button>

                <button
                  onClick={() => selectStage(currentStageId >= 5 ? 1 : currentStageId + 1)}
                  className="rounded-2xl border border-sky/70 bg-soft px-4 py-2.5 text-xs font-semibold text-deep hover:bg-sky/20 transition-colors"
                >
                  Tahap Berikutnya →
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* TAMPILAN SEMUA TAHAP (GRID COMPARISON) */
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Kartu 1: Gambar 4 Tahap Proses */}
            <div className="rounded-3xl border border-sky/60 bg-soft p-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-display text-lg text-navy">
                  4 Tahapan Inti Proses Pembuatan
                </h4>
                <span className="font-mono text-xs text-ocean">
                  {showPatterned ? 'Kain Bermotif' : 'Kain Polos'}
                </span>
              </div>
              <div className="aspect-square w-full overflow-hidden rounded-2xl bg-white p-2 border border-sky/40">
                <img
                  src={showPatterned ? dt4 : dt2}
                  alt="4 Tahap Pembuatan Batik"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-mono text-deep/70">
                <span>1. Potong Mori (Kiri Atas)</span>
                <span>2. Nyanting Malam (Kanan Atas)</span>
                <span>3. Celup Indigo (Kiri Bawah)</span>
                <span>4. Pelorodan (Kanan Bawah)</span>
              </div>
            </div>

            {/* Kartu 2: Gambar Hasil Selesai & QC */}
            <div className="rounded-3xl border border-sky/60 bg-soft p-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-display text-lg text-navy">
                  Tahap Akhir: Kain Jadi & Lolos QC
                </h4>
                <span className="font-mono text-xs text-[color:var(--color-ok)]">
                  Siap Kirim
                </span>
              </div>
              <div className="aspect-square w-full overflow-hidden rounded-2xl bg-white p-2 border border-sky/40">
                <img
                  src={showPatterned ? dt3 : dt1}
                  alt="Kain Selesai Lolos QC"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="mt-3 text-[11px] font-mono text-deep/70">
                <p>
                  Pengrajin menyelesaikan lipatan kain batik siap etalase dan pengiriman dengan standar mutu tinggi.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BatikDigitalTwinAnimation
