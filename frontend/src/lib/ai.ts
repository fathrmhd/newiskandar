/* ------------------------------------------------------------------ */
/*  New Iskandar — mesin AI (mock inference) untuk batik tulis Aceh.    */
/*  Dipakai lintas halaman: Customer (harga/SLA/status) & Seller (HPP). */
/* ------------------------------------------------------------------ */

export const TODAY = new Date('2026-08-16T08:00:00')
export const READY_STOCK = 9 // lembar batik siap etalase

// Katalog motif — Smart Commerce.
export const MOTIFS = [
  {
    id: 'awan',
    name: 'Awan Meucanek',
    sku: 'BTK-AC-014',
    note: 'motif awan berarak khas pesisir Aceh',
    img: 'https://images.unsplash.com/photo-1761516659497-8478e39d2b26?w=700&h=800&fit=crop&auto=format',
  },
  {
    id: 'pinto',
    name: 'Pinto Aceh',
    sku: 'BTK-AC-021',
    note: 'gerbang berukir, simbol kehormatan',
    img: 'https://images.unsplash.com/photo-1604973104381-870c92f10343?w=700&h=800&fit=crop&auto=format',
  },
  {
    id: 'pucok',
    name: 'Pucok Rebung',
    sku: 'BTK-AC-033',
    note: 'tunas bambu, lambang tumbuh & harapan',
    img: 'https://images.unsplash.com/photo-1761516659539-20ec6f407ca4?w=700&h=800&fit=crop&auto=format',
  },
]

// AI Dynamic HPP & Tiered BOM Optimizer — ambang diskon kuantitas supplier.
export const TIERS = [
  { min: 1, max: 10, price: 345000, material: 128000, label: 'Eceran' },
  { min: 11, max: 50, price: 305000, material: 112000, label: 'Grosir' },
  { min: 51, max: Infinity, price: 265000, material: 96000, label: 'Ekspor' },
]

// Bill of Material per 1 lembar Batik Tulis (2,4 m).
export const BOM = [
  { name: 'Kain mori primisima', per: 2.4, unit: 'm', price: 26000 },
  { name: 'Malam / lilin batik (klowong + tembokan)', per: 0.18, unit: 'kg', price: 48000 },
  { name: 'Pewarna indigo & napthol', per: 3, unit: 'takar', price: 14000 },
  { name: 'Soda abu & TRO (bahan bantu celup)', per: 0.12, unit: 'kg', price: 16000 },
]

// Tahapan proses batik yang sebenarnya.
export const BATIK_STAGES = [
  { name: 'Nyanting / Nge-cap', note: 'menggambar motif dengan malam' },
  { name: 'Pewarnaan / Celup', note: 'pencelupan indigo & napthol' },
  { name: 'Pelorodan', note: 'meluruhkan malam dengan air panas' },
  { name: 'Penjemuran', note: 'pengeringan alami di angin-angin' },
  { name: 'Finishing & QC', note: 'pelipatan, penyetrikaan, mutu' },
]

export const rupiah = (n: number) => 'Rp' + Math.round(n).toLocaleString('id-ID')
export const fmtDate = (d: Date) =>
  d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
export const shortDate = (d: Date) =>
  d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
export const addDays = (d: Date, days: number) => {
  const r = new Date(d)
  r.setDate(r.getDate() + Math.ceil(days))
  return r
}

/* --- Digital Twin sanggar: dikelola sebagai data mentah oleh Seller --- */
export type Worker = { id: string; name: string; skill: string; rate: number }
export type Material = { id: string; name: string; need: number; unit: string; minDiscount: number }

export const DEFAULT_WORKERS: Worker[] = [
  { id: 'w1', name: 'Bu Nuraini', skill: 'Batik tulis halus', rate: 0.9 },
  { id: 'w2', name: 'Pak Yusuf', skill: 'Nge-cap tembaga', rate: 0.7 },
  { id: 'w3', name: 'Bu Salmah', skill: 'Pewarnaan indigo', rate: 0.8 },
  { id: 'w4', name: 'Pak Ridwan', skill: 'Pelorodan & finishing', rate: 0.75 },
]

export const DEFAULT_MATERIALS: Material[] = [
  { id: 'm1', name: 'Kain mori primisima', need: 60, unit: 'm', minDiscount: 100 },
  { id: 'm2', name: 'Malam / lilin batik', need: 5, unit: 'kg', minDiscount: 10 },
  { id: 'm3', name: 'Pewarna indigo alami', need: 40, unit: 'takar', minDiscount: 50 },
]

export function computeAI(qty: number, dailyCapacity = DEFAULT_WORKERS.reduce((s, a) => s + a.rate, 0)) {
  const tier = TIERS.find((t) => qty >= t.min && qty <= t.max) ?? TIERS[TIERS.length - 1]
  const readyUsed = Math.min(qty, READY_STOCK)
  const poQty = Math.max(0, qty - READY_STOCK)

  const bom = BOM.map((b) => {
    const total = b.per * qty
    return { ...b, total, cost: total * b.price }
  })
  const materialTotal = bom.reduce((s, b) => s + b.cost, 0)

  // AI Adaptive SLA Predictor.
  const complexity = 1.2 // batik tulis motif rumit
  const cap = Math.max(0.1, dailyCapacity)
  const productionDays = poQty > 0 ? (poQty / cap) * complexity : 0
  const materialLead = poQty > 0 ? 2 : 0
  const finishing = qty > 0 ? 3 : 0 // pelorodan + penjemuran + QC
  const totalDays = materialLead + productionDays + finishing
  const slaDate = addDays(TODAY, totalDays)

  // AI Dynamic HPP.
  const materialPerUnit = tier.material
  const overhead = 21000
  const labor = 64000
  const baseCost = materialPerUnit + overhead + labor
  const hpp = baseCost * 1.18
  const margin = tier.price - hpp
  const marginPct = (margin / tier.price) * 100

  const stockRemaining = READY_STOCK - readyUsed
  const reorderPoint = 6
  const stockRisk =
    stockRemaining <= 0 ? 'danger' : stockRemaining <= reorderPoint ? 'warn' : 'ok'

  return {
    tier, readyUsed, poQty, bom, materialTotal, dailyCapacity: cap, productionDays,
    materialLead, finishing, totalDays, slaDate, materialPerUnit, overhead, labor,
    hpp, margin, marginPct, stockRemaining, reorderPoint, stockRisk,
    subtotal: tier.price * qty,
  }
}
export type AI = ReturnType<typeof computeAI>
