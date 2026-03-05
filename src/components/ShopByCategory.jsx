import { CATS } from "../data/index.js";

export default function ShopByCategory() {
  return (
    <section className="bg-white py-14 px-6">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-[26px] font-bold text-zinc-900 mb-9">
          shop by category
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {CATS.map((cat) => (
            <button
              key={cat.label}
              className="flex flex-col items-center gap-3 cursor-pointer group bg-transparent border-0 p-0"
            >
              <div className="w-full aspect-square rounded-2xl bg-zinc-900 overflow-hidden flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
                <img
                  src={cat.img}
                  alt={cat.label}
                  className="w-4/5 h-4/5 object-contain"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </div>
              <span className="text-[12.5px] font-semibold text-zinc-900 text-center leading-snug whitespace-pre-line">
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
