import { useState } from "react";
import Stars from "../components/Stars.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { PRODUCTS } from "../data/index.js";

/* ── TRUST BADGES ── */
const BADGES = [
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    ),
    label: "Free shipping over €50",
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    label: "Banned substance tested",
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M20 12V22H4V12" /><path d="M22 7H2v5h20V7z" /><path d="M12 22V7" />
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
      </svg>
    ),
    label: "30-day returns",
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
    label: "Secure checkout",
  },
];

/* ── REVIEWS (static demo) ── */
const REVIEWS = [
  { name: "James R.",    rating: 5, date: "12 Feb 2025", text: "Best whey I've ever used. Mixes perfectly, no clumps, and the chocolate flavour actually tastes like chocolate. Already on my third tub." },
  { name: "Sofia M.",   rating: 5, date: "28 Jan 2025", text: "I've tried a lot of protein powders and this is hands-down the cleanest macro profile for the price. Highly recommend." },
  { name: "Lucas T.",   rating: 4, date: "5 Jan 2025",  text: "Great product overall. Only reason it's 4 stars is the vanilla flavour is a bit too sweet for me, but the chocolate is amazing." },
  { name: "Amira K.",   rating: 5, date: "19 Dec 2024", text: "I do intermittent fasting and this fits perfectly into my window. No digestive issues at all which is rare for me with whey." },
];

export default function ProductPage({ productId, onAdd, onNavigate }) {
  const product = PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0];
  const related = PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);

  const [activeImg, setActiveImg]     = useState(0);
  const [selectedFlavour, setFlavour] = useState(product.flavours[0]);
  const [selectedSize, setSize]       = useState(product.sizes[0]);
  const [qty, setQty]                 = useState(1);
  const [activeTab, setActiveTab]     = useState("description");
  const [added, setAdded]             = useState(false);

  const handleAdd = () => {
    onAdd({ ...product, flavour: selectedFlavour, size: selectedSize, qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const imgs = product.imgs?.length ? product.imgs : [product.img];

  return (
    <div className="bg-white min-h-screen">

      {/* ── BREADCRUMB ── */}
      <div className="max-w-screen-xl mx-auto px-6 pt-6 pb-2">
        <nav className="flex items-center gap-2 text-[11px] text-zinc-400 font-medium tracking-[0.05em]">
          <button onClick={() => onNavigate("home")} className="hover:text-zinc-900 bg-transparent border-0 cursor-pointer p-0 transition-colors">HOME</button>
          <span>/</span>
          <button onClick={() => onNavigate("catalogue")} className="hover:text-zinc-900 bg-transparent border-0 cursor-pointer p-0 transition-colors">CATALOGUE</button>
          <span>/</span>
          <span className="text-zinc-900 truncate max-w-[220px]">{product.name.toUpperCase()}</span>
        </nav>
      </div>

      {/* ── MAIN PRODUCT SECTION ── */}
      <div className="max-w-screen-xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* LEFT — IMAGE GALLERY */}
          <div className="flex gap-4">
            {/* Thumbnails */}
            <div className="flex flex-col gap-2">
              {imgs.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-[64px] h-[64px] rounded-lg border-2 overflow-hidden bg-zinc-100 flex-none cursor-pointer transition-all duration-150 p-0 ${activeImg === i ? "border-zinc-900" : "border-zinc-200 hover:border-zinc-400"}`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="flex-1 bg-zinc-100 rounded-2xl overflow-hidden aspect-square flex items-center justify-center relative">
              {product.badge && (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-sm tracking-[0.08em] z-10">
                  {product.badge}
                </span>
              )}
              <img
                src={imgs[activeImg]}
                alt={product.name}
                className="w-4/5 h-4/5 object-contain transition-opacity duration-200"
                onError={(e) => { e.target.style.opacity = "0.3"; }}
              />
            </div>
          </div>

          {/* RIGHT — PRODUCT INFO */}
          <div>
            {/* Brand + Name */}
            <p className="text-[11px] font-bold tracking-[0.12em] text-red-500 uppercase mb-1">{product.brand}</p>
            <h1 className="text-[22px] font-extrabold text-zinc-900 leading-snug mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-5">
              <Stars rating={product.rating} />
              {product.reviews > 0 ? (
                <span className="text-[12px] text-zinc-500">{product.rating} · {product.reviews.toLocaleString()} reviews</span>
              ) : (
                <span className="text-[12px] text-zinc-400">No reviews yet</span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-zinc-100">
              {product.oldPrice && (
                <span className="text-[16px] text-red-400 line-through font-semibold">€{product.oldPrice.toFixed(2)}</span>
              )}
              <span className="text-[28px] font-extrabold text-zinc-900">€{product.price.toFixed(2)}</span>
              {product.oldPrice && (
                <span className="text-[11px] bg-red-50 text-red-500 font-bold px-2 py-0.5 rounded-sm">
                  SAVE €{(product.oldPrice - product.price).toFixed(2)}
                </span>
              )}
            </div>

            {/* Flavour selector */}
            <div className="mb-5">
              <p className="text-[11px] font-extrabold tracking-[0.1em] text-zinc-700 uppercase mb-2">
                Flavour: <span className="text-zinc-900">{selectedFlavour}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.flavours.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFlavour(f)}
                    className={`px-3 py-1.5 rounded-full border text-[11px] font-semibold cursor-pointer transition-all duration-150 ${
                      selectedFlavour === f
                        ? "bg-zinc-900 text-white border-zinc-900"
                        : "bg-white text-zinc-600 border-zinc-300 hover:border-zinc-600"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Size selector */}
            <div className="mb-6">
              <p className="text-[11px] font-extrabold tracking-[0.1em] text-zinc-700 uppercase mb-2">
                Size: <span className="text-zinc-900">{selectedSize}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`px-4 py-2 rounded border text-[12px] font-bold cursor-pointer transition-all duration-150 ${
                      selectedSize === s
                        ? "bg-zinc-900 text-white border-zinc-900"
                        : "bg-white text-zinc-700 border-zinc-300 hover:border-zinc-700"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Qty + Add to Cart */}
            <div className="flex items-center gap-3 mb-5">
              {/* Qty */}
              <div className="flex items-center border border-zinc-300 rounded overflow-hidden">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-10 h-11 bg-zinc-50 hover:bg-zinc-100 border-0 cursor-pointer text-zinc-700 font-bold text-lg flex items-center justify-center transition-colors"
                >
                  −
                </button>
                <span className="w-12 h-11 flex items-center justify-center text-[14px] font-extrabold text-zinc-900 border-l border-r border-zinc-200">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-10 h-11 bg-zinc-50 hover:bg-zinc-100 border-0 cursor-pointer text-zinc-700 font-bold text-lg flex items-center justify-center transition-colors"
                >
                  +
                </button>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAdd}
                className={`flex-1 h-11 rounded font-extrabold text-[12px] tracking-[0.1em] border-0 cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 ${
                  added ? "bg-green-600 text-white" : "bg-red-500 hover:bg-red-600 text-white"
                }`}
              >
                {added ? (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M20 6 9 17l-5-5" /></svg>
                    ADDED TO CART
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                    ADD TO CART
                  </>
                )}
              </button>

              {/* Wishlist */}
              <button className="w-11 h-11 border border-zinc-300 rounded flex items-center justify-center text-zinc-400 hover:text-red-500 hover:border-red-300 bg-transparent cursor-pointer transition-all duration-150">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>

            {/* Total */}
            <div className="bg-zinc-50 rounded-lg px-4 py-3 mb-6 flex items-center justify-between">
              <span className="text-[12px] font-semibold text-zinc-500 tracking-[0.04em]">TOTAL ({qty} item{qty > 1 ? "s" : ""})</span>
              <span className="text-[18px] font-extrabold text-zinc-900">€{(product.price * qty).toFixed(2)}</span>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-2">
              {BADGES.map((b) => (
                <div key={b.label} className="flex items-center gap-2.5 bg-zinc-50 rounded-lg px-3 py-2.5">
                  <span className="text-zinc-500 shrink-0">{b.icon}</span>
                  <span className="text-[11px] font-semibold text-zinc-700">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS: DESCRIPTION / HIGHLIGHTS / NUTRITION / REVIEWS ── */}
      <div className="border-t border-zinc-100 mt-4">
        <div className="max-w-screen-xl mx-auto px-6">
          {/* Tab bar */}
          <div className="flex gap-0 border-b border-zinc-200 overflow-x-auto no-scrollbar">
            {["description", "highlights", "nutrition", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-[11px] font-extrabold tracking-[0.1em] uppercase border-0 cursor-pointer whitespace-nowrap transition-all duration-150 border-b-2 -mb-px ${
                  activeTab === tab
                    ? "text-zinc-900 border-red-500 bg-transparent"
                    : "text-zinc-400 border-transparent bg-transparent hover:text-zinc-700"
                }`}
              >
                {tab}
                {tab === "reviews" && product.reviews > 0 && (
                  <span className="ml-1.5 text-[9px] bg-zinc-200 text-zinc-600 px-1.5 py-0.5 rounded-full font-bold">
                    {product.reviews}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="py-8 max-w-2xl">
            {activeTab === "description" && (
              <p className="text-[14px] text-zinc-600 leading-[1.8]">{product.description}</p>
            )}

            {activeTab === "highlights" && (
              <ul className="space-y-3">
                {product.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3">
                    <span className="mt-0.5 shrink-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </span>
                    <span className="text-[14px] text-zinc-700 leading-snug">{h}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === "nutrition" && (
              <div className="border border-zinc-200 rounded-xl overflow-hidden">
                <div className="bg-zinc-900 px-5 py-3">
                  <p className="text-[11px] font-extrabold tracking-[0.1em] text-white uppercase">Nutrition Facts — Per Serving</p>
                </div>
                {product.nutrition.map((row, i) => (
                  <div
                    key={row.label}
                    className={`flex items-center justify-between px-5 py-3 ${i % 2 === 0 ? "bg-white" : "bg-zinc-50"}`}
                  >
                    <span className="text-[13px] font-semibold text-zinc-700">{row.label}</span>
                    <span className="text-[13px] font-extrabold text-zinc-900">{row.value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-5">
                {/* Summary bar */}
                {product.reviews > 0 && (
                  <div className="flex items-center gap-6 p-5 bg-zinc-50 rounded-xl mb-6">
                    <div className="text-center shrink-0">
                      <p className="text-[48px] font-extrabold text-zinc-900 leading-none">{product.rating}</p>
                      <Stars rating={product.rating} />
                      <p className="text-[11px] text-zinc-400 mt-1">{product.reviews.toLocaleString()} reviews</p>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const pct = star === 5 ? 72 : star === 4 ? 18 : star === 3 ? 6 : star === 2 ? 3 : 1;
                        return (
                          <div key={star} className="flex items-center gap-2">
                            <span className="text-[11px] text-zinc-500 w-3 text-right">{star}</span>
                            <svg className="w-3 h-3 text-zinc-300 shrink-0" viewBox="0 0 20 20" fill="#ef4444"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            <div className="flex-1 bg-zinc-200 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-red-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-[11px] text-zinc-400 w-7">{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {REVIEWS.map((r) => (
                  <div key={r.name} className="border-b border-zinc-100 pb-5 last:border-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[13px] font-extrabold text-zinc-900">{r.name}</span>
                      <span className="text-[11px] text-zinc-400">{r.date}</span>
                    </div>
                    <Stars rating={r.rating} />
                    <p className="text-[13px] text-zinc-600 leading-relaxed mt-2">{r.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── RELATED PRODUCTS ── */}
      {related.length > 0 && (
        <section className="border-t border-zinc-100 bg-zinc-50 py-14 px-6">
          <div className="max-w-screen-xl mx-auto">
            <h2 className="text-[22px] font-extrabold text-zinc-900 mb-7">You may also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p) => (
                <div key={p.id} onClick={() => onNavigate("product", p.id)} className="cursor-pointer">
                  <ProductCard p={p} onAdd={onAdd} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
