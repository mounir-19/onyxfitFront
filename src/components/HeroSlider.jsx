import { useState, useEffect, useRef } from "react";
import { SLIDES } from "../data/index.js";

export default function HeroSlider() {
  const [idx, setIdx] = useState(0);
  const timer = useRef(null);
  const n = SLIDES.length;

  useEffect(() => {
    timer.current = setInterval(() => setIdx((p) => (p + 1) % n), 5500);
    return () => clearInterval(timer.current);
  }, []);

  const s = SLIDES[idx];

  return (
    <div className="hero-bg relative h-[420px] md:h-[480px] flex items-center overflow-hidden">
      <div
        key={idx}
        className="animate-fade-slide-up relative z-10 max-w-screen-xl mx-auto w-full h-full px-6 md:px-10 py-8 md:py-14 flex items-center justify-between gap-4 md:gap-6"
      >
        {/* LEFT TEXT */}
        <div className="flex-none max-w-[280px] md:max-w-[380px]">
          <span className="inline-block bg-red-500 text-white text-[10px] font-bold tracking-[0.13em] px-2.5 py-[3px] rounded-sm mb-3 md:mb-4">
            {s.badge}
          </span>
          <h1 className="bebas text-[clamp(42px,7.5vw,92px)] leading-[0.92] text-white tracking-[0.01em] mb-3 md:mb-4 drop-shadow-2xl">
            {s.l1}
            <br />
            {s.l2}
          </h1>
          <p className="text-zinc-400 text-[12px] md:text-[13px] leading-[1.65] mb-5 md:mb-7 max-w-[240px] md:max-w-[280px]">
            {s.sub}
          </p>
          <button className="bg-red-500 hover:bg-red-600 text-white border-0 px-6 md:px-7 py-[10px] md:py-[11px] rounded text-[12px] md:text-[13px] font-bold tracking-[0.08em] cursor-pointer flex items-center gap-2 transition-all duration-150 hover:-translate-y-px active:translate-y-0">
            SHOP NOW
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* RIGHT PRODUCT IMAGE */}
        <div className="flex-none w-[clamp(160px,38%,430px)] relative flex items-center justify-center">
          <div className="absolute inset-0 bg-red-500/10 blur-3xl rounded-full" />
          <img
            src={s.img}
            alt=""
            className="w-full max-h-[280px] md:max-h-[360px] object-contain drop-shadow-2xl relative z-10" onError={(e) => { e.target.style.opacity = "0"; }}
          />
        </div>
      </div>

      {/* DOTS */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`h-[10px] rounded-full border-0 cursor-pointer p-0 transition-all duration-300 ${i === idx ? "bg-red-500 w-6" : "bg-white/35 hover:bg-white/55 w-[10px]"}`}
          />
        ))}
      </div>
    </div>
  );
}