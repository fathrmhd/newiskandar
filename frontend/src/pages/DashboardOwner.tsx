import type { FC, ReactNode } from "react";
import { useMemo, useState, useEffect } from "react";
import {
  CameraIcon,
  CheckIcon,
  SlidersIcon,
  StageMark,
  Tag,
  UserIcon,
} from "@/components/batik";
import {
  CENTRAL_CAMERA,
  DEFAULT_MATERIALS,
  DEFAULT_WORKERS,
  type Material,
  type Worker,
  computeAI,
  fmtDate,
  rupiah,
} from "@/lib/ai";
import { BatikDigitalTwinAnimation } from "@/components/BatikDigitalTwinAnimation";
import liveCamImg from "../assets/live.png";

interface DashboardOwnerProps {
  onLogout?: () => void;
}

let uid = 100;

const nextId = () => `x${uid++}`;

export const DashboardOwner: FC<DashboardOwnerProps> = ({ onLogout }) => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString("id-ID"));
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString("id-ID"));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [activeTab, setActiveTab] = useState<
    "surveillance" | "hr" | "warehouse"
  >("surveillance");
  const [workers, setWorkers] = useState<Worker[]>(DEFAULT_WORKERS);
  const [materials, setMaterials] = useState<Material[]>(DEFAULT_MATERIALS);
  const [target, setTarget] = useState(40);

  const [dynamicHppConfig, setDynamicHppConfig] = useState({
    baseLaborCost: 45000,
    baseOverhead: 15000,
    materialsCost: 85000,
  });

  const dailyCapacity = Math.round(
    workers.reduce((s, w) => s + (w.rate || 0), 0),
  );
  const ai = useMemo(
    () => computeAI(target, dailyCapacity),
    [target, dailyCapacity],
  );
  const alloc = useMemo(() => allocate(workers, ai.poQty), [workers, ai.poQty]);

  const dynamicHPP =
    dynamicHppConfig.baseLaborCost +
    dynamicHppConfig.baseOverhead +
    dynamicHppConfig.materialsCost;

  return (
    <main className="mx-auto max-w-[1180px] px-5 pb-28 pt-8 sm:px-8">
      {
      }
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-sky/70 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-soft">
            <UserIcon className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-ocean">
                Dashboard Pemilik
              </span>
              <span className="rounded-full bg-sky/30 px-2 py-0.5 font-mono text-[11px] text-deep">
                Sistem Terpadu AI
              </span>
            </div>
            <h1 className="font-display text-2xl text-navy sm:text-3xl">
              Teuku Iskandar
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-2xl border border-sky/80 bg-soft p-1.5 shadow-inner">
            <button
              onClick={() => setActiveTab("surveillance")}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                activeTab === "surveillance"
                  ? "bg-navy text-soft shadow-sm"
                  : "text-deep/70 hover:text-navy"
              }`}
            >
              <CameraIcon className="h-3.5 w-3.5" /> Kamera & HPP
            </button>
            <button
              onClick={() => setActiveTab("hr")}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                activeTab === "hr"
                  ? "bg-navy text-soft shadow-sm"
                  : "text-deep/70 hover:text-navy"
              }`}
            >
              <UserIcon className="h-3.5 w-3.5" /> Manajemen Pekerja
            </button>
            <button
              onClick={() => setActiveTab("warehouse")}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                activeTab === "warehouse"
                  ? "bg-navy text-soft shadow-sm"
                  : "text-deep/70 hover:text-navy"
              }`}
            >
              <SlidersIcon className="h-3.5 w-3.5" /> Safety Stock
            </button>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="rounded-xl border border-sky/60 bg-white px-3 py-2 text-xs font-semibold text-deep/70 transition-colors hover:bg-sky/20 hover:text-navy"
            >
              Keluar
            </button>
          )}
        </div>
      </div>

      {
      }
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-sky/60 bg-white p-5 shadow-sm">
          <Tag>Kapasitas Harian Sanggar</Tag>
          <p className="mt-2 font-display text-3xl text-navy">
            {dailyCapacity}{" "}
            <span className="text-base text-deep/60">lbr/hari</span>
          </p>
          <div className="mt-2 flex items-center justify-between text-xs text-deep/70">
            <span>Estimasi Output</span>
            <span className="font-mono text-ocean">Berdasarkan SDM</span>
          </div>
        </div>
      </div>

      {activeTab === "surveillance" && (
        <div className="mt-8 space-y-12">
          <section>
            <StageMark
              title="Proses Produksi"
              sub="Pemodelan virtual dari tahapan pembuatan batik untuk memantau alur kerja secara ilustratif."
            />
            <BatikDigitalTwinAnimation initialStage={1} />
          </section>

          <section className="border-t border-sky/40 pt-10">
            <StageMark
              title="Pantauan Visual Sanggar (Kamera)"
              sub="Tampilan langsung (live stream) dari kamera sentral untuk memastikan kelancaran area produksi."
            />

            <div className="rounded-3xl border border-sky/60 bg-white p-6 shadow-sm">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-sky/30 pb-4">
                <div>
                  <h3 className="font-display text-xl text-navy">
                    {CENTRAL_CAMERA.name}
                  </h3>
                  <p className="mt-1 text-xs text-deep/70">
                    Area Cakupan: Zona Terpadu Sanggar
                  </p>
                </div>
                <span className="flex items-center gap-2 rounded-full bg-[color:var(--color-ok)]/15 px-3 py-1 font-mono text-xs font-semibold text-[color:var(--color-ok)]">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--color-ok)] opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--color-ok)]"></span>
                  </span>
                  Live RTSP Standby
                </span>
              </div>

              {
              }
              <div className="relative mx-auto aspect-video max-w-4xl overflow-hidden rounded-2xl border border-sky/40 bg-navy shadow-inner group">
                <img
                  src={liveCamImg}
                  alt="Pantauan CCTV Sanggar"
                  className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                />

                {
                }
                <div className="absolute right-4 top-4 flex items-center gap-2 rounded bg-black/60 px-3 py-1.5 font-mono text-xs font-medium text-white backdrop-blur-sm">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-600"></span>
                  </span>
                  LIVE {currentTime}
                </div>

                <div className="absolute bottom-4 left-4 rounded bg-black/60 px-3 py-1.5 font-mono text-xs font-medium uppercase text-white/90 backdrop-blur-sm">
                  CAM 01 - AREA {CENTRAL_CAMERA.name}
                </div>
              </div>
              {
              }

              <p className="mx-auto mt-6 max-w-2xl rounded-xl border border-sky/30 bg-soft/50 py-3 text-center text-xs text-deep/60">
                Kamera ini murni digunakan sebagai antarmuka pantauan visual
                (*display only*). Pencatatan log aktivitas dinonaktifkan untuk
                mengedepankan evaluasi berbasis penyelesaian target.
              </p>
            </div>
          </section>

          {
          }
          <section className="border-t border-sky/40 pt-10">
            <StageMark
              title="HPP"
              sub="Input harga material dan tenaga kerja (BoM) untuk menghitung Harga Pokok Penjualan secara dinamis."
            />
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_1fr]">
              <div className="flex flex-col gap-4">
                <div className="rounded-2xl border border-sky/60 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 font-display text-xl text-navy">
                    Input Harga Bill of Materials (BoM)
                  </h3>
                  <div className="space-y-4">
                    <Field label="Biaya Material Dasar (Kain, Pewarna)">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-navy">Rp</span>
                        <input
                          type="number"
                          value={dynamicHppConfig.materialsCost}
                          onChange={(e) =>
                            setDynamicHppConfig({
                              ...dynamicHppConfig,
                              materialsCost: Number(e.target.value),
                            })
                          }
                          className={inputCls}
                        />
                      </div>
                    </Field>
                    <Field label="Biaya Tenaga Kerja per Lembar">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-navy">Rp</span>
                        <input
                          type="number"
                          value={dynamicHppConfig.baseLaborCost}
                          onChange={(e) =>
                            setDynamicHppConfig({
                              ...dynamicHppConfig,
                              baseLaborCost: Number(e.target.value),
                            })
                          }
                          className={inputCls}
                        />
                      </div>
                    </Field>
                    <Field label="Biaya Operasional">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-navy">Rp</span>
                        <input
                          type="number"
                          value={dynamicHppConfig.baseOverhead}
                          onChange={(e) =>
                            setDynamicHppConfig({
                              ...dynamicHppConfig,
                              baseOverhead: Number(e.target.value),
                            })
                          }
                          className={inputCls}
                        />
                      </div>
                    </Field>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
                <div className="rounded-3xl border border-sky/60 bg-white p-6 shadow-sm">
                  <Tag>Kalkulasi HPP</Tag>
                  <div className="mt-3 flex items-baseline justify-between border-b border-sky/30 pb-3">
                    <span className="font-semibold text-[14px] text-deep/70">
                      Total HPP Dinamis
                    </span>
                    <span className="font-display text-3xl text-navy">
                      {rupiah(dynamicHPP)}
                    </span>
                  </div>
                  <div className="mt-4 space-y-2 font-mono text-[12px] text-deep/75">
                    <Line
                      label="Material Dasar"
                      value={rupiah(dynamicHppConfig.materialsCost)}
                    />
                    <Line
                      label="Tenaga Kerja"
                      value={rupiah(dynamicHppConfig.baseLaborCost)}
                    />
                    <Line
                      label="Operasional"
                      value={rupiah(dynamicHppConfig.baseOverhead)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {activeTab === "hr" && (
        <div className="mt-8 space-y-12">
          {
          }
          <section>
            <StageMark
              title="Distribusi Beban Kerja (Target SDM)"
              sub="Atur kemampuan produksi harian per individu untuk mengukur kapasitas total sanggar."
            />
            <div className="flex max-w-4xl flex-col gap-3">
              {workers.map((w, i) => (
                <div
                  key={w.id}
                  className="rounded-2xl border border-sky/60 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-ocean">
                      Pengrajin {i + 1}
                    </span>
                    {workers.length > 1 && (
                      <button
                        onClick={() =>
                          setWorkers(workers.filter((x) => x.id !== w.id))
                        }
                        className="text-[13px] text-deep/50 hover:text-[color:var(--color-danger)]"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-[1.2fr_1.2fr_auto]">
                    <Field label="Nama Pengrajin">
                      <input
                        value={w.name}
                        onChange={(e) =>
                          patch(setWorkers, workers, w.id, {
                            name: e.target.value,
                          })
                        }
                        className={inputCls}
                        placeholder="Contoh: Budi"
                      />
                    </Field>
                    <Field label="Stasiun Keahlian">
                      <input
                        value={w.skill}
                        onChange={(e) =>
                          patch(setWorkers, workers, w.id, {
                            skill: e.target.value,
                          })
                        }
                        className={inputCls}
                        placeholder="Contoh: Canting"
                      />
                    </Field>
                    <Field label="Target Harian (Lbr)">
                      <input
                        type="number"
                        step="1"
                        min={1}
                        value={w.rate}
                        onChange={(e) =>
                          patch(setWorkers, workers, w.id, {
                            rate: Math.round(Number(e.target.value)),
                          })
                        }
                        className={`${inputCls} w-24 text-center font-mono`}
                      />
                    </Field>
                  </div>
                </div>
              ))}
              <AddBtn
                onClick={() =>
                  setWorkers([
                    ...workers,
                    { id: nextId(), name: "", skill: "", rate: 1 },
                  ])
                }
              >
                Tambah Pengrajin
              </AddBtn>
            </div>
          </section>

          <section className="border-t border-sky/40 pt-10">
            <StageMark
              title="Kinerja SDM & Hak Pekerja"
              sub="Evaluasi berfokus pada penyelesaian tugas. Waktu izin dan istirahat dihormati sebagai hak pekerja."
            />
            <div className="rounded-3xl border border-sky/60 bg-white p-6 shadow-sm sm:p-8">
              <Tag>Kinerja Harian Pengrajin</Tag>
              <h3 className="mt-2 font-display text-2xl text-navy">
                Analisis Aktivitas & Waktu Kerja
              </h3>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {workers.map((w) => (
                  <div
                    key={w.id}
                    className="space-y-3 rounded-2xl border border-[color:var(--color-ok)]/30 bg-soft p-5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[color:var(--color-ok)]/20 text-deep">
                        <UserIcon className="h-4 w-4" />
                      </span>
                    </div>
                    <div>
                      <h4 className="font-display text-lg text-navy">
                        {w.name}
                      </h4>
                      <p className="text-xs text-deep/70">
                        Posisi: {w.currentLocation || "Stasiun Kerja"}
                      </p>
                    </div>
                    <div className="space-y-2 border-t border-sky/30 pt-3 font-mono text-xs text-deep/80">
                      <div className="flex justify-between">
                        <span>Waktu Aktif:</span>
                        <span className="font-semibold text-navy">
                          {w.activeHoursToday} Jam
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Durasi Istirahat:</span>
                        <span className="text-ocean">
                          {w.breakMinutesToday} Menit
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {activeTab === "warehouse" && (
        <div className="mt-8 space-y-8">
          {
          }
          <StageMark
            title="Safety Stock"
            sub="Simulasi kesanggupan produksi dan kebutuhan stok bahan baku."
          />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_1fr]">
            <div className="flex flex-col gap-10">
              <section>
                <div className="mb-4">
                  <h3 className="font-display text-xl text-navy">
                    Manajemen Stok Bahan Baku
                  </h3>
                </div>
                <div className="flex flex-col gap-3">
                  {materials.map((m) => {
                    const discount = m.need >= m.minDiscount;
                    return (
                      <div
                        key={m.id}
                        className="rounded-2xl border border-sky/60 bg-white p-4 shadow-sm"
                      >
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1.6fr_1fr_1fr_auto] sm:items-end">
                          <Field label="Nama Bahan">
                            <input
                              value={m.name}
                              onChange={(e) =>
                                patch(setMaterials, materials, m.id, {
                                  name: e.target.value,
                                })
                              }
                              className={inputCls}
                              placeholder="Kain Mori / Lilin"
                            />
                          </Field>
                          <Field label="Kuantitas">
                            <input
                              type="number"
                              min={0}
                              value={m.need}
                              onChange={(e) =>
                                patch(setMaterials, materials, m.id, {
                                  need: Number(e.target.value),
                                })
                              }
                              className={`${inputCls} font-mono`}
                            />
                          </Field>
                          <Field label="Satuan Unit">
                            <select
                              value={m.unit}
                              onChange={(e) =>
                                patch(setMaterials, materials, m.id, {
                                  unit: e.target.value,
                                })
                              }
                              className={inputCls}
                            >
                              <option value="Meter (m)">Meter (m)</option>
                              <option value="Kilogram (kg)">
                                Kilogram (kg)
                              </option>
                              <option value="Pcs">Pcs</option>
                              <option value="Liter (l)">Liter (l)</option>
                            </select>
                          </Field>
                          {materials.length > 1 && (
                            <button
                              onClick={() =>
                                setMaterials(
                                  materials.filter((x) => x.id !== m.id),
                                )
                              }
                              className="pb-2.5 text-[13px] text-deep/50 hover:text-[color:var(--color-danger)]"
                            >
                              Hapus
                            </button>
                          )}
                        </div>
                        <div className="mt-3 flex items-center justify-between border-t border-sky/30 pt-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-deep/60">
                              Batas Minimum Harga Grosir:
                            </span>
                            <input
                              type="number"
                              min={1}
                              value={m.minDiscount}
                              onChange={(e) =>
                                patch(setMaterials, materials, m.id, {
                                  minDiscount: Number(e.target.value),
                                })
                              }
                              className="w-16 rounded border border-sky/70 bg-soft px-2 py-1 text-xs outline-none focus:border-ocean"
                            />
                            <span className="font-mono text-xs">{m.unit}</span>
                          </div>
                          <p
                            className="text-[12px] font-medium"
                            style={{
                              color: discount
                                ? "var(--color-ok)"
                                : "var(--color-warn)",
                            }}
                          >
                            {discount
                              ? `✓ Syarat grosir terpenuhi`
                              : `Butuh ${m.minDiscount - m.need} ${m.unit} lagi`}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <AddBtn
                    onClick={() =>
                      setMaterials([
                        ...materials,
                        {
                          id: nextId(),
                          name: "",
                          need: 0,
                          unit: "Kilogram (kg)",
                          minDiscount: 10,
                        },
                      ])
                    }
                  >
                    Tambah Jenis Bahan Baku
                  </AddBtn>
                </div>
              </section>
            </div>
            <div className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-3xl border border-sky/60 bg-white p-6 shadow-sm">
                <Tag>Simulasi Antrian Produksi</Tag>
                <p className="mt-2 text-[15px] text-deep/70">
                  Uji kapasitas waktu berdasarkan pesanan masuk.
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex items-center rounded-2xl border border-sky/70 bg-soft">
                    <button
                      onClick={() => setTarget(Math.max(1, target - 1))}
                      className="h-11 w-11 text-xl text-deep hover:text-ocean"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={target}
                      min={1}
                      onChange={(e) =>
                        setTarget(
                          Math.max(1, Math.round(Number(e.target.value) || 1)),
                        )
                      }
                      className="w-20 bg-transparent py-2.5 text-center font-display text-xl text-navy outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      onClick={() => setTarget(target + 1)}
                      className="h-11 w-11 text-xl text-deep hover:text-ocean"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-deep/60">Lembar Kain</span>
                </div>
              </div>
              <div
                className="rounded-3xl border border-ocean/30 p-6 text-soft shadow-sm"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg,#0a1931,#1a3d63 65%,#2f5b83)",
                }}
              >
                <Tag invert>Estimasi Selesai (SLA)</Tag>
                <p className="mt-2 font-display text-2xl leading-tight">
                  {fmtDate(ai.slaDate)}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/15 pt-4 font-mono text-[13px] text-sky/85">
                  <Stat
                    label="Kapasitas Sanggar"
                    value={`${dailyCapacity} lbr/hari`}
                  />
                  <Stat
                    label="Beban Produksi Baru"
                    value={`${ai.poQty} lembar`}
                  />
                  <Stat
                    label="Total Waktu Antrian"
                    value={`${Math.ceil(ai.totalDays)} Hari`}
                  />
                  <Stat
                    label="Sisa Bahan Siap"
                    value={`${ai.readyUsed} lembar`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

const inputCls =
  "w-full rounded-xl border border-sky/70 bg-soft px-3 py-2 text-sm text-navy outline-none transition-colors focus:border-ocean";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block w-full">
      <span className="mb-1 block text-[12px] font-semibold uppercase tracking-wide text-deep/70">
        {label}
      </span>
      {children}
    </label>
  );
}

function AddBtn({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-ocean/50 py-3.5 text-sm font-semibold text-ocean transition-colors hover:border-ocean hover:bg-ocean/5"
    >
      + {children}
    </button>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-0.5 text-sky/60">{label}</p>
      <p className="font-semibold text-soft">{value}</p>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-sky/30 pb-2 pt-1">
      <span>{label}</span>
      <span className="font-semibold text-navy">{value}</span>
    </div>
  );
}

function patch<T extends { id: string }>(
  set: (v: T[]) => void,
  list: T[],
  id: string,
  upd: Partial<T>,
) {
  set(list.map((x) => (x.id === id ? { ...x, ...upd } : x)));
}

function allocate(workers: Worker[], poQty: number) {
  const totalRate = workers.reduce((s, w) => s + (w.rate || 0), 0) || 1;
  const raw = workers.map((w) => ({
    ...w,
    exact: (poQty * (w.rate || 0)) / totalRate,
  }));
  const maxAssigned = Math.max(1, ...raw.map((r) => Math.ceil(r.exact)));
  let done = 0;
  return raw.map((r, i) => {
    const assigned =
      i === raw.length - 1 ? Math.max(0, poQty - done) : Math.round(r.exact);
    done += assigned;
    return {
      ...r,
      assigned,
      load: Math.min(100, (assigned / maxAssigned) * 100),
    };
  });
}

export default DashboardOwner;