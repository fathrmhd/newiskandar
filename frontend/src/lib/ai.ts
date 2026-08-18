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
export type Worker = {
  id: string
  name: string
  skill: string
  rate: number
  stationId?: string
  status?: 'active' | 'idle' | 'break' | 'warning'
  currentLocation?: string
  activeHoursToday?: number
  breakMinutesToday?: number
  complianceScore?: number
}

export type Material = { id: string; name: string; need: number; unit: string; minDiscount: number }

export const DEFAULT_WORKERS: Worker[] = [
  {
    id: 'w1',
    name: 'Bu Nuraini',
    skill: 'Batik tulis halus (Pinto Aceh)',
    rate: 0.9,
    stationId: 'st-1',
    status: 'active',
    currentLocation: 'Meja Canting Utama 01',
    activeHoursToday: 6.8,
    breakMinutesToday: 45,
    complianceScore: 99.2,
  },
  {
    id: 'w2',
    name: 'Pak Yusuf',
    skill: 'Nge-cap tembaga & canting',
    rate: 0.7,
    stationId: 'st-2',
    status: 'active',
    currentLocation: 'Stasiun Cap Tembaga 02',
    activeHoursToday: 6.3,
    breakMinutesToday: 45,
    complianceScore: 96.5,
  },
  {
    id: 'w3',
    name: 'Bu Salmah',
    skill: 'Pewarnaan indigo alami',
    rate: 0.8,
    stationId: 'st-3',
    status: 'active',
    currentLocation: 'Bak Pencelupan Indigo 03',
    activeHoursToday: 6.5,
    breakMinutesToday: 50,
    complianceScore: 98.0,
  },
  {
    id: 'w4',
    name: 'Pak Ridwan',
    skill: 'Pelorodan & QC mutu',
    rate: 0.75,
    stationId: 'st-4',
    status: 'idle',
    currentLocation: 'Area Pelorodan & QC 04',
    activeHoursToday: 5.6,
    breakMinutesToday: 35,
    complianceScore: 89.5,
  },
]

export const DEFAULT_MATERIALS: Material[] = [
  { id: 'm1', name: 'Kain mori primisima', need: 60, unit: 'm', minDiscount: 100 },
  { id: 'm2', name: 'Malam / lilin batik', need: 5, unit: 'kg', minDiscount: 10 },
  { id: 'm3', name: 'Pewarna indigo alami', need: 40, unit: 'takar', minDiscount: 50 },
]

/* --- Model 1 Kamera Sentral Sanggar (Single Camera AI Surveillance) --- */
export interface Workstation {
  id: string
  name: string
  code: string
  stage: string
  assignedWorkerId: string
  assignedWorkerName: string
  cameraName: string
  ipCamera: string
  fps: number
  resolution: string
  currentActivity: string
  complianceRate: number
  idleSeconds: number
  status: 'active' | 'idle' | 'warning' | 'break'
}

export const CENTRAL_CAMERA: Workstation = {
  id: 'cam-central',
  name: 'Kamera Sentral Sanggar — AI Optical Surveillance',
  code: 'CAM-SANGGAR-01',
  stage: 'Monitoring Terpadu Seluruh Pengrajin',
  assignedWorkerId: 'all',
  assignedWorkerName: '4 Pengrajin Terpantau',
  cameraName: 'Sensor Optik Sentral Wide-Angle AI',
  ipCamera: 'rtsp://cam-central.sanggar.local:554/live',
  fps: 30,
  resolution: '1920x1080 (HD AI Stream)',
  currentActivity: 'Pengawasan Aktif Area Canting, Cap, Celup, & Pelorodan',
  complianceRate: 96.4,
  idleSeconds: 0,
  status: 'active',
}

// Data kompatibilitas untuk workstation individual bila diperlukan
export const WORKSTATIONS: Workstation[] = [
  CENTRAL_CAMERA,
  {
    id: 'st-1',
    name: 'Meja Canting Utama 01',
    code: 'POS-01',
    stage: 'Nyanting Pola Halus',
    assignedWorkerId: 'w1',
    assignedWorkerName: 'Bu Nuraini',
    cameraName: 'Kamera Sentral (Zona Canting)',
    ipCamera: 'rtsp://cam-central.sanggar.local:554/live?zone=canting',
    fps: 30,
    resolution: '1920x1080 (HD)',
    currentActivity: 'Mencanting Garis Isen-isen (Pinto Aceh)',
    complianceRate: 98.2,
    idleSeconds: 0,
    status: 'active',
  },
  {
    id: 'st-2',
    name: 'Stasiun Cap Tembaga 02',
    code: 'POS-02',
    stage: 'Nge-cap Motif Dasar',
    assignedWorkerId: 'w2',
    assignedWorkerName: 'Pak Yusuf',
    cameraName: 'Kamera Sentral (Zona Cap)',
    ipCamera: 'rtsp://cam-central.sanggar.local:554/live?zone=cap',
    fps: 30,
    resolution: '1920x1080 (HD)',
    currentActivity: 'Pengecapan Canting Cap Tembaga',
    complianceRate: 94.5,
    idleSeconds: 12,
    status: 'active',
  },
  {
    id: 'st-3',
    name: 'Bak Pencelupan Indigo 03',
    code: 'POS-03',
    stage: 'Pewarnaan Celup Alami',
    assignedWorkerId: 'w3',
    assignedWorkerName: 'Bu Salmah',
    cameraName: 'Kamera Sentral (Zona Celup)',
    ipCamera: 'rtsp://cam-central.sanggar.local:554/live?zone=celup',
    fps: 28,
    resolution: '1920x1080 (HD)',
    currentActivity: 'Pencelupan Indigofera Celup Ke-2',
    complianceRate: 96.0,
    idleSeconds: 0,
    status: 'active',
  },
  {
    id: 'st-4',
    name: 'Area Pelorodan & QC 04',
    code: 'POS-04',
    stage: 'Pelorodan & Mutu',
    assignedWorkerId: 'w4',
    assignedWorkerName: 'Pak Ridwan',
    cameraName: 'Kamera Sentral (Zona Pelorodan)',
    ipCamera: 'rtsp://cam-central.sanggar.local:554/live?zone=pelorodan',
    fps: 30,
    resolution: '1920x1080 (HD)',
    currentActivity: 'Menunggu Pengeringan / Meja Kosong Sementara',
    complianceRate: 88.5,
    idleSeconds: 190,
    status: 'warning',
  },
]

/* --- Laporan Kronologis Aktivitas & Pergerakan Pengrajin (Chronicle Feed) --- */
export interface AuditLog {
  id: string
  timestamp: string
  workerName: string
  stationId: string
  stationName: string
  type:
    | 'inactivity_warning'
    | 'movement'
    | 'break_start'
    | 'break_end'
    | 'task_milestone'
    | 'resumed'
    | 'system_check'
  location: string
  destinationLocation?: string
  durationMinutes?: number
  severity: 'low' | 'medium' | 'high'
  status: 'resolved' | 'active_alert' | 'approved' | 'logged'
  note: string
}

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-01',
    timestamp: '15:10 WIB',
    workerName: 'Bu Nuraini',
    stationId: 'st-1',
    stationName: 'Meja Canting Utama 01',
    type: 'task_milestone',
    location: 'Meja Canting Utama',
    severity: 'low',
    status: 'logged',
    note: 'Pengrajin Bu Nuraini menyelesaikan kain motif Pinto Aceh tahap 1 (isian isen-isen lengkap).',
  },
  {
    id: 'log-02',
    timestamp: '14:22 WIB',
    workerName: 'Pak Ridwan',
    stationId: 'st-4',
    stationName: 'Area Pelorodan & QC 04',
    type: 'inactivity_warning',
    location: 'Area Pelorodan',
    durationMinutes: 3.2,
    severity: 'high',
    status: 'active_alert',
    note: 'Pengrajin Pak Ridwan meninggalkan area pelorodan melebihi batas waktu toleransi 3 menit tanpa izin terencana.',
  },
  {
    id: 'log-03',
    timestamp: '13:40 WIB',
    workerName: 'Bu Salmah',
    stationId: 'st-3',
    stationName: 'Bak Pencelupan Indigo 03',
    type: 'task_milestone',
    location: 'Bak Pencelupan Indigo',
    severity: 'low',
    status: 'logged',
    note: 'Pengrajin Bu Salmah melakukan aerasi kain dan pencelupan indigofera tahap ke-2.',
  },
  {
    id: 'log-04',
    timestamp: '12:00 WIB',
    workerName: 'Pak Yusuf',
    stationId: 'st-2',
    stationName: 'Stasiun Cap Tembaga 02',
    type: 'break_start',
    location: 'Stasiun Cap Tembaga',
    destinationLocation: 'Ruang Istirahat Sanggar',
    durationMinutes: 45,
    severity: 'low',
    status: 'approved',
    note: 'Pengrajin Pak Yusuf istirahat siang terjadwal (kembali tepat waktu pada 12:45 WIB).',
  },
  {
    id: 'log-05',
    timestamp: '10:15 WIB',
    workerName: 'Bu Nuraini',
    stationId: 'st-1',
    stationName: 'Meja Canting Utama 01',
    type: 'movement',
    location: 'Meja Canting Utama',
    destinationLocation: 'Ruang Pemanas Malam Lilin',
    durationMinutes: 13,
    severity: 'low',
    status: 'approved',
    note: 'Pengrajin Bu Nuraini izin ke ruang pemanas lilin untuk mengambil lelehan malam klowong baru.',
  },
  {
    id: 'log-06',
    timestamp: '09:20 WIB',
    workerName: 'Pak Yusuf',
    stationId: 'st-2',
    stationName: 'Stasiun Cap Tembaga 02',
    type: 'movement',
    location: 'Stasiun Cap Tembaga',
    destinationLocation: 'Gudang Kain Mori',
    durationMinutes: 8,
    severity: 'low',
    status: 'resolved',
    note: 'Pengrajin Pak Yusuf mengambil 3 lembar kain mori primissima siap cap di rak penyimpanan.',
  },
  {
    id: 'log-07',
    timestamp: '08:05 WIB',
    workerName: 'Bu Nuraini',
    stationId: 'st-1',
    stationName: 'Meja Canting Utama 01',
    type: 'system_check',
    location: 'Meja Canting Utama',
    severity: 'low',
    status: 'resolved',
    note: 'Pengrajin Bu Nuraini tiba di sanggar dan memulai mencanting pola Pinto Aceh.',
  },
]

export function computeAI(
  qty: number,
  dailyCapacity = DEFAULT_WORKERS.reduce((s, a) => s + (a.rate || 0), 0)
) {
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
    tier,
    readyUsed,
    poQty,
    bom,
    materialTotal,
    dailyCapacity: cap,
    productionDays,
    materialLead,
    finishing,
    totalDays,
    slaDate,
    materialPerUnit,
    overhead,
    labor,
    hpp,
    margin,
    marginPct,
    stockRemaining,
    reorderPoint,
    stockRisk,
    subtotal: tier.price * qty,
  }
}
export type AI = ReturnType<typeof computeAI>
