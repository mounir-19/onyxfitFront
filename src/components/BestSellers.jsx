import { useRef } from "react";
import { PRODUCTS } from "../data/index.js";
import ProductCard from "./ProductCard.jsx";

export default function BestSellers({ onAdd, onNavigate }) {
  const ref = useRef(null);
  const scroll = (d) =>
    ref.current?.scrollBy({ left: d * 240, behavior: "smooth" });

  return (
    <section className="bg-white py-14 px-10">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[26px] font-bold text-zinc-900">Best sellers</h2>
          <button
            onClick={() => onNavigate("catalogue")}
            className="text-[12px] font-extrabold tracking-[0.08em] text-zinc-500 hover:text-zinc-900 bg-transparent border-0 cursor-pointer flex items-center gap-1 transition-colors"
          >
            VIEW ALL
            <svg
              className="w-3 h-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
        <div className="relative">
          <button
            onClick={() => scroll(-1)}
            className="absolute -left-5 top-1/2 -translate-y-[60%] z-10 w-9 h-9 rounded-full border border-zinc-200 hover:border-zinc-900 bg-white flex items-center justify-center cursor-pointer shadow-md transition-colors duration-150"
          >
            <svg
              className="w-3 h-3 text-zinc-700"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <div
            ref={ref}
            className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth pb-3"
          >
            {PRODUCTS.map((p) => (
              <div
                key={p.id}
                className="flex-none w-[220px] cursor-pointer"
                onClick={() => onNavigate("product", p.id)}
              >
                <ProductCard p={p} onAdd={onAdd} />
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll(1)}
            className="absolute -right-5 top-1/2 -translate-y-[60%] z-10 w-9 h-9 rounded-full border border-zinc-200 hover:border-zinc-900 bg-white flex items-center justify-center cursor-pointer shadow-md transition-colors duration-150"
          >
            <svg
              className="w-3 h-3 text-zinc-700"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
