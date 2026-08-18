import type { FC } from 'react'
import { StageMark, StockBadge, Tag } from '@/components/batik'

interface Product {
  id: string
  name: string
  motif: string
  price: number
  stock: number
  risk: 'ok' | 'warn' | 'danger'
}

const SAMPLE_PRODUCTS: Product[] = [
  { id: '1', name: 'Kain Batik Bungong Jeumpa', motif: 'Bungong Jeumpa', price: 850_000, stock: 4, risk: 'ok' },
  { id: '2', name: 'Selendang Pintu Aceh', motif: 'Pinto Aceh', price: 620_000, stock: 1, risk: 'warn' },
  { id: '3', name: 'Kain Panjang Rencong Sutra', motif: 'Rencong Tradisional', price: 1_250_000, stock: 0, risk: 'danger' },
]

const Customer: FC = () => {
  return (
    <main className="mx-auto max-w-[1180px] px-5 py-12 sm:px-8">
      <StageMark
        numeral="A"
        title="Galeri & Koleksi Batik"
        sub="Pilih batik tulis khas Aceh yang dibuat langsung dengan canting dan pewarna alami."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SAMPLE_PRODUCTS.map((item) => (
          <div key={item.id} className="flex flex-col justify-between rounded-xl border border-sky/40 bg-white p-6 shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <Tag>{item.motif}</Tag>
                <StockBadge risk={item.risk} readyUsed={item.stock} />
              </div>
              <h3 className="mt-4 font-display text-xl text-navy">{item.name}</h3>
              <p className="mt-2 text-lg font-bold text-ocean">
                Rp {item.price.toLocaleString('id-ID')}
              </p>
            </div>
            <button
              disabled={item.stock === 0}
              className={`mt-6 w-full rounded-lg py-2.5 font-medium transition ${
                item.stock > 0
                  ? 'bg-deep text-soft hover:bg-navy'
                  : 'cursor-not-allowed bg-sky/30 text-navy/40'
              }`}
            >
              {item.stock > 0 ? 'Pesan Sekarang' : 'Habis'}
            </button>
          </div>
        ))}
      </div>
    </main>
  )
}

export default Customer