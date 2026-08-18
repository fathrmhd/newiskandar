import { useState } from "react";
import logo from "./assets/logo.svg";
import { Canting } from "@/components/batik";
import Landing from "@/pages/Landing";
import Customer from "@/pages/Customer";
import Seller from "@/pages/Seller";

/* ------------------------------------------------------------------ */
/*  New Iskandar — AI Handicraft Commerce (Batik Tulis Aceh)           */
/*  SPA 3 halaman: Landing · Customer · Seller. Router ringan lokal.   */
/* ------------------------------------------------------------------ */

type Page = "landing" | "customer" | "seller";

const NAV: { id: Page; label: string }[] = [  
  { id: "landing", label: "Beranda" },
  { id: "customer", label: "Pembeli" },
  { id: "seller", label: "Pembatik" },
];

export default function App() {
  const [page, setPage] = useState<Page>("landing");

  const go = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-soft text-navy">
      <Header page={page} go={go} />
      {page === "landing" && <Landing go={go} />}
      {page === "customer" && <Customer />}
      {page === "seller" && <Seller />}
      <Footer />
    </div>
  );
}

function Header({ page, go }: { page: Page; go: (p: Page) => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-navy/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between px-5 py-3 sm:px-8">
        <button
          onClick={() => go("landing")}
          className="flex items-center gap-3 text-left"
        >
          <div className="flex h-12 w-32 items-center justify-center overflow-hidden rounded-lg bg-soft">
            <img
              src={logo}
              alt="New Iskandar"
              className="h-full w-full object-contain scale-240"
            />
          </div>
          <div className="hidden sm:block">
            <p className="font-display text-lg leading-none text-soft">
              New Iskandar
            </p>
          </div>
        </button>

        <nav className="flex items-center gap-6 text-sm text-sky/85 sm:gap-8">
          {NAV.map((n) => {
            const active = n.id === page;
            return (
              <button
                key={n.id}
                onClick={() => go(n.id)}
                className="group flex flex-col items-center"
              >
                <span
                  className={`transition-colors ${active ? "text-soft" : "group-hover:text-soft"}`}
                >
                  {n.label}
                </span>
                <Canting
                  className={`mt-0.5 h-1 w-8 text-ocean transition-opacity ${active ? "opacity-100" : "opacity-0 group-hover:opacity-60"}`}
                />
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy px-5 py-8 text-center sm:px-8">
      {/* Tambahkan mx-auto di sini */}
      <div className="mx-auto flex h-16 w-38 items-center justify-center overflow-hidden rounded-lg bg-soft">
        <img
          src={logo}
          alt="New Iskandar"
          className="h-full w-full object-contain scale-240"
        />
      </div>
      <Canting className="mx-auto mt-4 h-2 w-40 text-ocean" />
      <p className="mt-3 text-[13px] text-sky/60">
        New Iskandar · AI for the Backbone of the Economy
      </p>
      <p className="mt-1 text-xs text-sky/40">
        MVP purwarupa batik — AI Innovation Challenge COMPFEST 18
      </p>
    </footer>
  );
}
