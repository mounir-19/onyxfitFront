import { useRef, useState, useEffect } from "react";
import { getProducts } from "../api/products.js";
import ProductCard from "./ProductCard.jsx";

export default function BestSellers({ onAdd, onNavigate, userId }) {
  const ref = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const scroll = (d) => ref.current?.scrollBy({ left: d * 240, behavior: "smooth" });

  // Load TOP 10 active products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts({
          limit: 10,        // Top 10 best sellers
          is_active: true,  // Only active products
          sort: 'created_at', // Most recent first
          order: 'desc'
        });
        setProducts(response.data.data || []);
      } catch (err) {
        console.error("Error loading best sellers:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
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
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
          <div className="flex items-center justify-center h-32">
            <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

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
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-500 text-[15px]">No best sellers available</p>
          </div>
        ) : (
          <div className="relative">
            {/* Left Arrow */}
            <button
              onClick={() => scroll(-1)}
              className="absolute -left-5 top-1/2 -translate-y-[60%] z-10 w-9 h-9 rounded-full border border-zinc-200 hover:border-zinc-900 bg-white flex items-center justify-center cursor-pointer shadow-md transition-all duration-150 hover:shadow-lg"
              disabled={products.length <= 4} // Hide if not enough items
            >
              <svg className="w-3 h-3 text-zinc-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            {/* Scrollable Container */}
            <div
              ref={ref}
              className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth pb-3 snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {products.map((p) => (
                <div
                  key={p.id}
                  className="flex-none w-[220px] snap-center cursor-pointer"
                  onClick={() => onNavigate("product", p.id)}
                >
                  <ProductCard p={p} onAdd={onAdd} userId={userId} />
                </div>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => scroll(1)}
              className="absolute -right-5 top-1/2 -translate-y-[60%] z-10 w-9 h-9 rounded-full border border-zinc-200 hover:border-zinc-900 bg-white flex items-center justify-center cursor-pointer shadow-md transition-all duration-150 hover:shadow-lg"
              disabled={products.length <= 4}
            >
              <svg className="w-3 h-3 text-zinc-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
