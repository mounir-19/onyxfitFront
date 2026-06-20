import { useState } from "react";
import Stars from "./Stars.jsx";
import { addToCart } from "../api/cart";

export default function ProductCard({ p, onAdd, userId }) {
  const [added, setAdded] = useState(false);

  const handleAdd = async (e) => {
    e.stopPropagation();

    console.log("ProductCard - Add to cart clicked");
    console.log("ProductCard - User ID:", userId);
    console.log("ProductCard - Product:", p);

    if (!userId) {
      alert("Please log in to add items to cart");
      return;
    }

    const variant = p.variants?.[0];
    if (!variant) {
      alert("This product has no available variants");
      return;
    }

    try {
      console.log("ProductCard - Adding variant:", variant.id);
      await addToCart({
        user_id: userId,
        variant_id: variant.id,
        quantity: 1
      });

      if (onAdd) onAdd(p);
      setAdded(true);
      setTimeout(() => setAdded(false), 1400);
    } catch (err) {
      console.error("ProductCard - Error adding to cart:", err);
      alert(err.response?.data?.error || "Failed to add to cart");
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    return `${baseURL}${imagePath}`;
  };

  // Safely get price from first variant
  const price = p.variants?.[0]?.price;
  const priceDisplay = price ? `€${parseFloat(price).toFixed(2)}` : "Price N/A";

  return (
    <div className="bg-white rounded-lg border border-zinc-200 flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-200 h-full group">
      {/* Image */}
      <div className="relative bg-zinc-100 aspect-square flex items-center justify-center p-4 overflow-hidden">
        {p.badge && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-extrabold px-[7px] py-[2px] rounded-sm tracking-[0.07em] z-10">
            {p.badge}
          </span>
        )}
        <img
          src={getImageUrl(p.image_url)}
          alt={p.name}
          className="w-4/5 h-4/5 object-contain group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      </div>

      {/* Info */}
      <div className="px-3.5 pt-3 flex-1">
        <p className="text-[10px] font-bold tracking-[0.1em] text-red-500 uppercase mb-0.5">
          {p.brand || "Brand"}
        </p>
        <p className="text-[13px] font-semibold text-zinc-900 leading-snug mb-2 min-h-[36px]">
          {p.name}
        </p>
        <Stars rating={p.rating || 0} />
        <p className="text-[11px] text-zinc-400 mt-1 mb-2">
          {p.reviews > 0 ? `${p.reviews} Reviews` : "No reviews yet"}
        </p>
        <div className="flex items-baseline gap-2 mb-3">
          {p.oldPrice && (
            <span className="text-[11px] text-zinc-400 line-through">
              €{parseFloat(p.oldPrice).toFixed(2)}
            </span>
          )}
          <span className="text-[16px] text-zinc-900 font-bold">
            {priceDisplay}
          </span>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={handleAdd}
        disabled={!p.variants || p.variants.length === 0 || !userId}
        className={`mx-3.5 mb-3.5 py-2.5 rounded text-[11px] font-extrabold tracking-[0.1em] border-0 cursor-pointer transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${added
            ? "bg-green-600 text-white"
            : "bg-zinc-900 hover:bg-red-500 text-white"
          }`}
      >
        {!userId ? "LOG IN TO ADD" : added ? "✓ ADDED" : "+ QUICK ADD"}
      </button>
    </div>
  );
}