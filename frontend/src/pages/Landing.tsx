import type { FC } from 'react'
import {
  ArrowRight,
  Canting,
  DyeDrop,
  ShieldIcon,
  StageMark,
  Tag,
  UserIcon,
} from '@/components/batik'
import bgPattern from '@/assets/background.svg'
import { MOTIFS } from '@/lib/ai'

type Page = 'landing' | 'customer' | 'pembatik' | 'owner' | 'auth'

interface LandingProps {
  go: (page: Page) => void
}

const PILLARS = [
  {
    tag: 'Smart Commerce',
    title: 'Harga jujur, stok pasti',
    body: 'Pembeli menaikkan kuantitas, harga per lembar turun bertingkat dan estimasi selesai dihitung ulang seketika — tanpa tawar-menawar berlarut.',
  },
  {
    tag: 'Digital Twin Sanggar',
    title: 'Kapasitas nyata pembatik',
    body: 'Setiap pesanan disimulasikan ke kapasitas asli tiap pembatik dan stok bahan, sehingga sanggar hanya menyanggupi yang benar-benar mampu dikerjakan.',
  },
  {
    tag: 'Monitoring Optik AI',
    title: 'Standar mutu & kepatuhan',
    body: 'Pengawasan sensor optik stasiun kerja dan pencatatan kepatuhan otomatis menjaga keteraturan sanggar dan akurasi evaluasi harian.',
  },
]

export const Landing: FC<LandingProps> = ({ go }) => {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-40px)] overflow-hidden bg-navy px-5 py-16 text-soft sm:px-8 sm:py-24">
        {/* Background Motif Pattern Overlay */}
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-35"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(10, 25, 47, 0.45), rgba(10, 25, 47, 0.9)), url(${bgPattern})`,
          }}
        />

        <div className="relative mx-auto max-w-[1000px]">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 text-sky/80">
            <DyeDrop className="h-4 w-3" color="#b3cfe5" />
            <span className="text-sm font-medium">Batik Tulis Aceh · Sanggar Pengrajin</span>
          </div>

          {/* Hero Title */}
          <h1 className="mt-6 font-display text-4xl leading-[1.15] text-soft sm:text-6xl lg:text-7xl">
            Malam mendingin di kain.<br />
            Keputusan tak boleh ikut mendingin.
          </h1>

          <Canting className="mt-6 h-2.5 w-64 text-ocean/80" />

          {/* Subtitle */}
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-sky/75 sm:text-lg">
            New Iskandar menautkan tangan pembatik dengan pasar dunia lewat satu mesin AI. Harga, kapasitas, rute, dan pengawasan mutu dihitung sejujur guratan canting.
          </p>

          {/* Action Cards untuk Tiga Peran */}
          <div className="mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
            {/* Kartu Pembeli */}
            <button
              onClick={() => go('customer')}
              className="group flex flex-col justify-between rounded-3xl bg-soft p-6 text-left shadow-lg transition-all duration-200 hover:bg-white hover:shadow-xl"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky/30 text-navy mb-4">
                  <UserIcon className="h-5 w-5" />
                </div>
                <p className="font-display text-xl text-navy">Saya ingin memesan</p>
                <p className="mt-1 text-xs text-deep/70">Masuk sebagai Pembeli</p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-ocean group-hover:text-navy">
                Laman Pembeli <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </button>

            {/* Kartu Pembatik */}
            <button
              onClick={() => go('pembatik')}
              className="group flex flex-col justify-between rounded-3xl border border-sky/20 bg-deep/40 p-6 text-left backdrop-blur transition-all duration-200 hover:border-sky/40 hover:bg-deep/60"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-sky mb-4">
                  <DyeDrop className="h-5 w-4" color="#b3cfe5" />
                </div>
                <p className="font-display text-xl text-soft">Staf pembatik</p>
                <p className="mt-1 text-xs text-sky/70">Dashboard Meja Kerja</p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-sky group-hover:text-soft">
                Buka Dashboard <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </button>

            {/* Kartu Pemilik Sanggar */}
            <button
              onClick={() => go('owner')}
              className="group flex flex-col justify-between rounded-3xl border border-sky/20 bg-deep/40 p-6 text-left backdrop-blur transition-all duration-200 hover:border-sky/40 hover:bg-deep/60"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-sky mb-4">
                  <ShieldIcon className="h-5 w-5" />
                </div>
                <p className="font-display text-xl text-soft">Pemilik sanggar</p>
                <p className="mt-1 text-xs text-sky/70">Pusat Kendali & Kamera</p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-sky group-hover:text-soft">
                Buka Dashboard <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Tiga Pilar Section */}
      <section className="mx-auto max-w-[1180px] px-5 py-16 sm:px-8 sm:py-24">
        <StageMark
          numeral="tiga"
          title="Tiga pilar, satu jahitan"
          sub="Detail penuh terbuka begitu Anda memilih peran — pembeli, staf pembatik, atau pemilik sanggar."
        />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <article
              key={p.tag}
              className="flex flex-col rounded-3xl border border-sky/60 bg-white p-6"
            >
              <span className="hand-numeral text-3xl text-ocean/60">{`0${i + 1}`}</span>
              <div className="mt-3">
                <Tag>{p.tag}</Tag>
              </div>
              <h3 className="mt-2 font-display text-2xl text-navy">{p.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-deep/75">{p.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Ragam Motif (Katalog Preview) */}
      <section className="border-t border-sky/50 bg-[#eef4fa]">
        <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-8 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Tag>Ragam motif</Tag>
              <h2 className="mt-2 font-display text-3xl text-navy">Tiga cerita yang bisa Anda pesan</h2>
            </div>
            <button
              onClick={() => go('customer')}
              className="group flex items-center gap-2 text-sm font-semibold text-ocean hover:text-deep"
            >
              <span>Lihat katalog</span>
              <ArrowRight className="h-4 w-4 text-ocean transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {MOTIFS.map((m) => (
              <figure key={m.id} className="overflow-hidden rounded-3xl border border-sky/60 bg-[#d9cdb6]">
                <img src={m.img} alt={`Batik motif ${m.name}`} className="h-56 w-full object-cover" />
                <figcaption className="bg-white px-4 py-3">
                  <p className="font-display text-lg text-navy">{m.name}</p>
                  <p className="text-sm text-deep/70">{m.note}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Landing