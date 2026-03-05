import { useState } from "react";
import Stars from "./Stars.jsx";

export default function ProductCard({ p, onAdd }) {
  const [added, setAdded] = useState(false);

  const handle = () => {
    onAdd(p);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className="bg-white rounded-lg border border-zinc-200 flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-200 h-full">
      {/* Image */}
      <div className="relative bg-zinc-100 aspect-square flex items-center justify-center p-4 overflow-hidden">
        {p.badge && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-extrabold px-[7px] py-[2px] rounded-sm tracking-[0.07em] z-10">
            {p.badge}
          </span>
        )}
        <img
          src={p.img}
          alt={p.name}
          className="w-4/5 h-4/5 object-contain"
          onError={(e) => { e.target.style.display = "none"; }}
        />
      </div>

      {/* Info */}
      <div className="px-3.5 pt-3 flex-1">
        <p className="text-[13px] font-semibold text-zinc-900 leading-snug mb-2 min-h-[36px]">
          {p.name}
        </p>
        <Stars rating={p.rating} />
        <p className="text-[11px] text-zinc-400 mt-1 mb-2">{p.reviews} Reviews</p>
        <div className="flex items-baseline gap-2 mb-3">
          {p.oldPrice && (
            <span className="text-[13px] text-red-500 line-through">
              €{p.oldPrice.toFixed(2)}
            </span>
          )}
          <span className="text-[14px] text-zinc-900 font-bold">
            From €{p.price.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={handle}
        className={`mx-3.5 mb-3.5 py-2.5 rounded text-[11px] font-extrabold tracking-[0.1em] border-0 cursor-pointer transition-colors duration-150 ${added ? "bg-green-600 text-white" : "bg-zinc-900 hover:bg-red-500 text-white"}`}
      >
        {added ? "✓ ADDED" : "+ QUICK ADD"}
      </button>
    </div>
  );
}
