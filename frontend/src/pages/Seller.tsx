import type { FC } from 'react'
import { StageMark, Tag } from '@/components/batik'

const Seller: FC = () => {
  return (
    <main className="mx-auto max-w-[1180px] px-5 py-12 sm:px-8">
      <StageMark
        numeral="B"
        title="Dasbor Pembatik & AI Estimator"
        sub="Kelola produksi canting, stok kain mori, dan jadwal celup warna."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-sky/40 bg-white p-6 shadow-sm">
          <Tag>Status Produksi Aktif</Tag>
          <h3 className="mt-2 font-display text-xl text-navy">Pesanan Dalam Pengerjaan</h3>
          <ul className="mt-4 space-y-3 text-sm text-deep">
            <li className="flex justify-between border-b border-sky/20 pb-2">
              <span>Batik Pinto Aceh (Custom 2m)</span>
              <span className="font-semibold text-warn">Tahap Menutup Lilin</span>
            </li>
            <li className="flex justify-between border-b border-sky/20 pb-2">
              <span>Kain Motif Pucuk Rebung</span>
              <span className="font-semibold text-ok">Pencelupan Warna Ke-2</span>
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-sky/40 bg-white p-6 shadow-sm">
          <Tag>Rekomendasi AI</Tag>
          <h3 className="mt-2 font-display text-xl text-navy">Optimalisasi Stok</h3>
          <p className="mt-3 text-sm leading-relaxed text-deep/80">
            Permintaan motif <strong>Bungong Jeumpa</strong> diproyeksikan naik 24% minggu depan. Disarankan menyiapkan 5 lembar kain mori primissima dan pewarna indigo ekstra.
          </p>
        </div>
      </div>
    </main>
  )
}

export default Seller