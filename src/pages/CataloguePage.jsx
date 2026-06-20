import { useState, useMemo, useEffect, useCallback } from "react";
import Stars from "../components/Stars.jsx";
import { getProducts, getCategories } from "../api/products";
import { addToCart } from "../api/cart";

/* ── FILTER CONFIG ── */
const GOALS_LIST = ["All", "Lean Muscle", "Gain Mass", "Lose Weight", "Recovery", "Strength", "General Health"];
const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Best Rated" },
  { value: "reviews", label: "Most Reviewed" },
];

function ActivePill({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 bg-zinc-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-[0.05em]">
      {label}
      <button onClick={onRemove} className="border-0 bg-transparent cursor-pointer text-zinc-400 hover:text-white leading-none p-0 ml-0.5">✕</button>
    </span>
  );
}

function CatalogueCard({ p, onAdd, onNavigate, userId }) {
  const [added, setAdded] = useState(false);

  const handle = useCallback(async (e) => {
    e.stopPropagation();

    if (!userId) {
      alert("Please log in to add items to cart");
      return;
    }

    const variant = p.variants?.[0];
    if (!variant) {
      alert("This product has no available variants");
      return;
    }

    const cartData = {
      user_id: userId,
      variant_id: variant.id,
      quantity: 1
    };

    try {
      const response = await addToCart(cartData);
      onAdd(p);
      setAdded(true);
      setTimeout(() => setAdded(false), 1400);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add to cart");
    }
  }, [p, onAdd, userId]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    return `${baseURL}${imagePath}`;
  };

  return (
    <div
      onClick={() => onNavigate("product", p.id)}
      className="bg-white rounded-lg border border-zinc-200 flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-200 h-full cursor-pointer group"
    >
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
          onError={(e) => { e.target.style.display = "none"; }}
        />
      </div>

      <div className="px-3.5 pt-3 flex-1">
        <p className="text-[10px] font-bold tracking-[0.1em] text-red-500 uppercase mb-0.5">{p.brand || "Brand"}</p>
        <p className="text-[13px] font-semibold text-zinc-900 leading-snug mb-2 min-h-[36px]">{p.name}</p>
        <Stars rating={p.rating || 0} />
        <p className="text-[11px] text-zinc-400 mt-1 mb-2">{p.reviews > 0 ? `${p.reviews} Reviews` : "No reviews yet"}</p>
        <div className="flex items-baseline gap-2 mb-3">
          {p.oldPrice && (
            <span className="text-[11px] text-zinc-400 line-through">€{p.oldPrice.toFixed(2)}</span>
          )}
          <span className="text-[16px] text-zinc-900 font-bold">
            {p.variants?.[0]?.price ? `€${p.variants[0].price}` : "Price N/A"}
          </span>
        </div>
      </div>

      <button
        onClick={handle}
        disabled={!p.variants || p.variants.length === 0 || !userId}
        className={`mx-3.5 mb-3.5 py-2.5 rounded text-[11px] font-extrabold tracking-[0.1em] border-0 cursor-pointer transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${added ? "bg-green-600 text-white" : "bg-zinc-900 hover:bg-red-500 text-white"
          }`}
      >
        {!userId ? "LOG IN TO ADD" : added ? "✓ ADDED" : "+ QUICK ADD"}
      </button>
    </div>
  );
}

export default function CataloguePage({ onAdd, onNavigate, userId, initialCategoryName }) {
  // ✅ FIXED: Load data ONCE only
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterKey, setFilterKey] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [goal, setGoal] = useState("All");
  const [maxPrice, setMaxPrice] = useState(200);
  const [sort, setSort] = useState("featured");
  const [sideOpen, setSideOpen] = useState(false);
  useEffect(() => {
    console.log("🔄 CataloguePage FIRST LOAD");
    loadData();
  }, []);

  useEffect(() => {
    console.log("🔍 Filter init:", { category, goal, maxPrice });
    return () => {
      // Reset on unmount (when navigating away)
      setFilterKey(prev => prev + 1);
    };
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        getProducts({}),
        getCategories()
      ]);

      const allCategories = [{ id: "All", name: "All" }, ...(categoriesRes.data.data || [])];
      setProducts(productsRes.data.data || []);
      setCategories(allCategories);

      // Apply category filter from nav link if it matches
      if (initialCategoryName) {
        const match = allCategories.find(
          (c) => c.name.toLowerCase() === initialCategoryName.toLowerCase()
        );
        if (match) {
          setCategory(match.id);
          setSideOpen(true);
        }
      }
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  }, [initialCategoryName]);

  // ✅ PERFECT FILTERING - Client side only
  const filtered = useMemo(() => {
    let list = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.category_name && p.category_name.toLowerCase().includes(q))
      );
    }

    if (category !== "All") {
      list = list.filter((p) => p.category_id === category);
    }

    if (goal !== "All") {
      list = list.filter((p) => p.goal?.includes(goal));
    }

    list = list.filter((p) => {
      const price = p.variants?.[0]?.price || 0;
      return price <= maxPrice;
    });

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => (a.variants?.[0]?.price || 0) - (b.variants?.[0]?.price || 0));
        break;
      case "price-desc":
        list.sort((a, b) => (b.variants?.[0]?.price || 0) - (a.variants?.[0]?.price || 0));
        break;
      case "rating":
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "reviews":
        list.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
        break;
      default:
        break;
    }
    return list;
  }, [products, search, category, goal, maxPrice, sort]);

  const activeFilters = [
    ...(category !== "All" ? [{ label: `Category: ${categories.find(c => c.id === category)?.name}`, clear: () => setCategory("All") }] : []),
    ...(goal !== "All" ? [{ label: `Goal: ${goal}`, clear: () => setGoal("All") }] : []),
    ...(maxPrice < 200 ? [{ label: `Max: €${maxPrice}`, clear: () => setMaxPrice(200) }] : []),
  ];

  const clearAll = useCallback(() => {
    setCategory("All");
    setGoal("All");
    setMaxPrice(200);
    setSearch("");
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-500">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-50 min-h-screen">
      <div className="bg-zinc-900 py-10 px-6">
        <div className="max-w-screen-xl mx-auto">
          <nav className="flex items-center gap-2 text-[11px] text-zinc-500 font-medium tracking-[0.05em] mb-4">
            <button onClick={() => onNavigate("home")} className="hover:text-zinc-300 bg-transparent border-0 cursor-pointer p-0 transition-colors">HOME</button>
            <span>/</span>
            <span className="text-zinc-300">CATALOGUE</span>
          </nav>
          <h1 className="bebas text-[52px] text-white tracking-[0.03em] leading-none">
            ALL <span className="text-red-500">PRODUCTS</span>
          </h1>
          <p className="text-zinc-400 text-[13px] mt-2">{filtered.length} product{filtered.length !== 1 ? "s" : ""} found</p>
        </div>
      </div>

      <div className="bg-white border-b border-zinc-200 px-6 py-4">
        <div className="max-w-screen-xl mx-auto flex items-center gap-3">
          <div className="flex-1 relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, brands, categories..."
              className="w-full pl-10 pr-4 py-2.5 border border-zinc-300 rounded-lg text-[13px] text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-600 bg-white"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 border-0 bg-transparent cursor-pointer">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            )}
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-zinc-300 rounded-lg px-3 py-2.5 text-[12px] font-semibold text-zinc-700 bg-white focus:outline-none focus:border-zinc-600 cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          <button
            onClick={() => setSideOpen((o) => !o)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-[12px] font-bold tracking-[0.05em] cursor-pointer transition-all duration-150 ${sideOpen ? "bg-zinc-900 text-white border-zinc-900" : "bg-white text-zinc-700 border-zinc-300 hover:border-zinc-700"
              }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="20" y2="12" /><line x1="10" y1="18" x2="20" y2="18" />
            </svg>
            FILTERS
          </button>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="bg-white border-b border-zinc-100 px-6 py-2.5">
          <div className="max-w-screen-xl mx-auto flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-zinc-500 tracking-[0.05em]">ACTIVE:</span>
            {activeFilters.map((f) => (
              <ActivePill key={f.label} label={f.label} onRemove={f.clear} />
            ))}
            <button onClick={clearAll} className="text-[11px] text-red-500 hover:text-red-700 font-bold bg-transparent border-0 cursor-pointer ml-1 transition-colors">
              Clear all
            </button>
          </div>
        </div>
      )}

      <div className="max-w-screen-xl mx-auto px-6 py-8 flex gap-8 items-start">
        {sideOpen && (
          <aside className="w-[220px] flex-none sticky top-[68px]">
            <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
              <div className="p-5 border-b border-zinc-100">
                <p className="text-[11px] font-extrabold tracking-[0.1em] text-zinc-900 uppercase mb-3">Category</p>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    className={`w-full text-left flex items-center justify-between py-1.5 text-[12.5px] font-semibold cursor-pointer border-0 bg-transparent transition-colors duration-100 ${category === c.id ? "text-red-500" : "text-zinc-600 hover:text-zinc-900"
                      }`}
                  >
                    {c.name}
                    {category === c.id && (
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M20 6 9 17l-5-5" /></svg>
                    )}
                  </button>
                ))}
              </div>

              <div className="p-5 border-b border-zinc-100">
                <p className="text-[11px] font-extrabold tracking-[0.1em] text-zinc-900 uppercase mb-3">Goal</p>
                {GOALS_LIST.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGoal(g)}
                    className={`w-full text-left flex items-center justify-between py-1.5 text-[12.5px] font-semibold cursor-pointer border-0 bg-transparent transition-colors duration-100 ${goal === g ? "text-red-500" : "text-zinc-600 hover:text-zinc-900"
                      }`}
                  >
                    {g}
                    {goal === g && (
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M20 6 9 17l-5-5" /></svg>
                    )}
                  </button>
                ))}
              </div>

              <div className="p-5">
                <p className="text-[11px] font-extrabold tracking-[0.1em] text-zinc-900 uppercase mb-3">Max Price</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] text-zinc-500">€0</span>
                  <span className="text-[13px] font-extrabold text-zinc-900">€{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={200}
                  step={5}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-red-500 cursor-pointer"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-zinc-400">€5</span>
                  <span className="text-[10px] text-zinc-400">€200</span>
                </div>
              </div>
            </div>

            {activeFilters.length > 0 && (
              <button
                onClick={clearAll}
                className="w-full mt-3 py-2 border border-zinc-300 hover:border-red-400 text-[11px] font-extrabold tracking-[0.08em] text-zinc-500 hover:text-red-500 rounded-lg bg-transparent cursor-pointer transition-all duration-150"
              >
                RESET ALL FILTERS
              </button>
            )}
          </aside>
        )}

        <div className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-[18px] font-extrabold text-zinc-900 mb-2">No products found</p>
              <p className="text-[13px] text-zinc-400 mb-6">Try adjusting your search or filters</p>
              <button onClick={clearAll} className="bg-red-500 hover:bg-red-600 text-white border-0 px-6 py-2.5 rounded text-[12px] font-extrabold tracking-[0.08em] cursor-pointer transition-colors">
                CLEAR FILTERS
              </button>
            </div>
          ) : (
            <div className={`grid gap-4 ${sideOpen ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2 md:grid-cols-4"}`}>
              {filtered.map((p) => (
                <CatalogueCard key={p.id} p={p} onAdd={onAdd} onNavigate={onNavigate} userId={userId} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}