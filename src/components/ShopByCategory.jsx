import { useState, useEffect } from "react";
import { getCategories } from "../api/category"; // Your API file

export default function ShopByCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        const catsData = data.data || data || [];
        const formattedCats = catsData.map(cat => ({
          label: cat.name,
          img: cat.image_url
            ? `http://localhost:5000${cat.image_url}`
            : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%23d1d5db' width='100' height='100'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='14' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E"
        }));

        setCategories(formattedCats);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setCategories([]); // Graceful fallback
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <section className="bg-white py-14 px-6">
        <div className="max-w-screen-xl mx-auto">
          <h2 className="text-[26px] font-bold text-zinc-900 mb-9">
            shop by category
          </h2>
          <div className="hidden md:grid grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className="w-full aspect-square rounded-2xl bg-zinc-200 animate-pulse shadow-md"></div>
                <div className="h-4 w-16 bg-zinc-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
          <div className="md:hidden overflow-x-auto overflow-y-hidden -mx-6 px-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex gap-4 min-h-0">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-3 flex-shrink-0 w-[120px]">
                  <div className="w-[120px] aspect-square rounded-2xl bg-zinc-200 animate-pulse shadow-md"></div>
                  <div className="h-4 w-[120px] bg-zinc-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-14 px-6">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-[26px] font-bold text-zinc-900 mb-9">
          shop by category
        </h2>

        {/* Desktop: Grid */}
        <div className="hidden md:grid grid-cols-6 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.label}
              className="flex flex-col items-center gap-3 cursor-pointer group bg-transparent border-0 p-0"
            >
              <div className="w-full aspect-square rounded-2xl bg-gradient-to-b from-zinc-900 via-zinc-500 to-zinc-100 overflow-hidden flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
                <img
                  src={cat.img}
                  alt={cat.label}
                  className="w-4/5 h-4/5 object-contain"
                  onError={(e) => {
                    console.log(`Failed to load image for: ${cat.label}`);
                    e.target.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%23d1d5db' width='100' height='100'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='14' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
              <span className="text-[12.5px] font-semibold text-zinc-900 text-center leading-snug whitespace-pre-line">
                {cat.label}
              </span>
            </button>
          ))}
        </div>

        {/* Mobile: Horizontal Scroll (hidden scrollbar) */}
        <div className="md:hidden overflow-x-auto overflow-y-hidden -mx-6 px-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex gap-4 min-h-0">
            {categories.map((cat) => (
              <button
                key={cat.label}
                className="flex flex-col items-center gap-3 cursor-pointer group bg-transparent border-0 p-0 flex-shrink-0"
              >
                <div className="w-[120px] aspect-square rounded-2xl bg-gradient-to-b from-zinc-900 via-zinc-500 to-zinc-100 overflow-hidden flex items-center justify-center shadow-md group-active:scale-95 transition-transform duration-200">
                  <img
                    src={cat.img}
                    alt={cat.label}
                    className="w-4/5 h-4/5 object-contain"
                    onError={(e) => {
                      console.log(`Failed to load image for: ${cat.label}`);
                      e.target.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%23d1d5db' width='100' height='100'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='14' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <span className="text-[12.5px] font-semibold text-zinc-900 text-center leading-snug whitespace-pre-line w-[120px]">
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
