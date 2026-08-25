import type { FC } from "react";
import {
  ArrowRight,
  Canting,
  DyeDrop,
  ShieldIcon,
  Tag,
  UserIcon,
} from "@/components/batik";
import bgPattern from "@/assets/background.svg";
import { MOTIFS } from "@/lib/ai";
import logo from "@/assets/logo.svg";

type Page = "landing" | "customer" | "pengrajin" | "owner" | "auth";

interface LandingProps {
  go: (page: Page) => void;
}

export const Landing: FC<LandingProps> = ({ go }) => {
  return (
    <main>
      {
      }
      <section className="relative min-h-[calc(100vh-40px)] overflow-hidden bg-navy px-5 py-16 text-soft sm:px-8 sm:py-24">
        {
        }
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-100"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(10, 25, 47, 0.45), rgba(10, 25, 47, 0.9)), url(${bgPattern})`,
          }}
        />

        <div className="relative mx-auto max-w-[1000px]">
          {
          }
          <div className="flex items-center gap-2 text-sky/80"></div>

          {
          }
          <div className="-ml-10 flex h-23 w-[520px] items-center overflow-hidden">
            <img
              src={logo}
              alt="TwinCraft"
              className="h-full w-full object-contain scale-650"
            />
          </div>

          <p className="mt-6 max-w-4xl text-base sm:text-lg leading-relaxed text-sky/90 text-justify sm:text-left">
            TwinCraft adalah platform integrasi manufaktur cerdas berbasis
            Digital Twin dan AI yang dirancang khusus untuk melestarikan
            sekaligus memodernisasi industri batik tulis nusantara. Melalui
            pemodelan simulasi visual tahapan produksi, optimasi Bill of
            Materials (BoM) otomatis, serta pantauan sanggar terpadu, TwinCraft
            menghadirkan transparansi produksi bagi pembeli dan kendali
            efisiensi penuh bagi pemilik sanggar.
          </p>

          {
          }
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {
            }
            <button
              onClick={() => go("customer")}
              className="group flex flex-col justify-between rounded-3xl bg-soft p-6 text-left shadow-lg transition-all duration-200 hover:bg-white hover:shadow-xl"
            >
              <div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-sky/30 text-navy">
                  <UserIcon className="h-5 w-5" />
                </div>
                <p className="font-display text-xl text-navy">Pembeli</p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-navy group-hover:text-navy">
                Masuk sebagai Pembeli{" "}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </button>

            {
            }
            <button
              onClick={() => go("pembatik")}
              className="group flex flex-col justify-between rounded-3xl bg-soft p-6 text-left shadow-lg transition-all duration-200 hover:bg-white hover:shadow-xl"
            >
              <div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-sky/30 text-navy">
                  <UserIcon className="h-5 w-5" />
                </div>
                <p className="font-display text-xl text-navy">Pengrajin</p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-navy group-hover:text-navy">
                Masuk sebagai Pengrajin{" "}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </button>

            {
            }
            <button
              onClick={() => go("owner")}
              className="group flex flex-col justify-between rounded-3xl bg-soft p-6 text-left shadow-lg transition-all duration-200 hover:bg-white hover:shadow-xl"
            >
              <div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-sky/30 text-navy">
                  <UserIcon className="h-5 w-5" />
                </div>
                <p className="font-display text-xl text-navy">
                  Pemilik Sanggar
                </p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-navy group-hover:text-navy">
                Masuk sebagai Pemilik{" "}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {
      }
      <section className="border-t border-sky/50 bg-[#eef4fa]">
        <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-8 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Tag>Ragam motif</Tag>
              <h2 className="mt-2 font-display text-3xl text-navy">
                Tiga motif yang bisa Anda pesan
              </h2>
            </div>
            <button
              onClick={() => go("customer")}
              className="group flex items-center gap-2 text-sm font-semibold text-ocean hover:text-deep"
            >
              <span>Lihat katalog</span>
              <ArrowRight className="h-4 w-4 text-ocean transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {MOTIFS.map((m) => (
              <figure
                key={m.id}
                className="overflow-hidden rounded-3xl border border-sky/60 bg-[#d9cdb6]"
              >
                <img
                  src={m.img}
                  alt={`Batik motif ${m.name}`}
                  className="h-56 w-full object-cover"
                />
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
  );
};

export default Landing;
