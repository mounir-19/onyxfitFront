import { GOALS } from "../data/index.js";

export default function ShopByGoals() {
  return (
    <section className="bg-[#1a1a1a] py-14 px-6">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="bebas text-[54px] tracking-[0.04em] mb-7">
          <span className="text-red-500">SHOP BY </span>
          <span className="text-white">GOALS</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {GOALS.map((g) => (
            <div
              key={g.label}
              className="goal-card relative rounded-lg overflow-hidden aspect-[3/4] cursor-pointer"
            >
              <img
                src={g.img}
                alt={g.label}
                className="goal-img w-full h-full object-cover brightness-[0.6] block"
                onError={(e) => { e.target.style.display = "none"; }}
              />
              {/* Fallback bg */}
              <div className="absolute inset-0 bg-zinc-800 -z-10" />
              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              {/* Text */}
              <div className="absolute bottom-0 left-0 right-0 p-3.5">
                <div className="bebas text-white text-[21px] leading-[1.05] tracking-[0.06em] whitespace-pre-line mb-1.5">
                  {g.label}
                </div>
                <a
                  href="#"
                  className="text-white hover:text-red-400 text-[10px] font-bold tracking-[0.1em] no-underline flex items-center gap-1 transition-colors duration-150"
                >
                  SHOP NOW
                  <svg className="w-2 h-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
