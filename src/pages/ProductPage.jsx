import { useState, useEffect } from "react";
import Stars from "../components/Stars.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { getProductById, getProducts, getProductReviews, addProductReview } from "../api/products";
import { addToCart } from "../api/cart";

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

export default function ProductPage({ productId, onAdd, onNavigate, userId }) {
  console.log("=== PRODUCT PAGE RENDERED ===");
  console.log("ProductPage - Received productId:", productId);
  console.log("ProductPage - Received userId:", userId);

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeImg, setActiveImg] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [added, setAdded] = useState(false);

  // Reviews
  const [reviews, setReviews] = useState([]);
  const [reviewSummary, setReviewSummary] = useState({ total: 0, average: 0, breakdown: {} });
  const [myRating, setMyRating] = useState(0);
  const [myReviewBody, setMyReviewBody] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Load product data whenever productId changes
  useEffect(() => {
    console.log("=== PRODUCT PAGE EFFECT TRIGGERED ===");
    console.log("productId:", productId);

    if (productId) {
      loadProduct();
      loadReviews();
    } else {
      console.warn("ProductPage - No productId provided!");
      setError("No product ID provided");
      setLoading(false);
    }
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("=== LOADING PRODUCT ===");
      console.log("Fetching product with ID:", productId);

      const response = await getProductById(productId);
      console.log("Product API response:", response);
      console.log("Response data:", response.data);

      const productData = response.data.data;
      console.log("Extracted product data:", productData);
      console.log("Product name:", productData?.name);
      console.log("Product description:", productData?.description);
      console.log("Product brand:", productData?.brand);
      console.log("Product variants:", productData?.variants);
      console.log("Product image_url:", productData?.image_url);

      if (!productData) {
        console.error("No product data in response");
        setError("Product not found");
        return;
      }

      setProduct(productData);
      console.log("Product state set successfully");

      // Set default variant to first one
      if (productData.variants?.length > 0) {
        console.log("Setting default variant:", productData.variants[0]);
        setSelectedVariant(productData.variants[0]);
      } else {
        console.warn("WARNING: No variants found for product!");
      }

      // Load related products from same category
      if (productData.category_id) {
        console.log("Loading related products for category:", productData.category_id);
        try {
          const relatedRes = await getProducts({
            category_id: productData.category_id,
            limit: 5
          });
          console.log("Related products response:", relatedRes);
          const relatedProducts = relatedRes.data.data
            .filter(p => p.id !== productId)
            .slice(0, 4);
          console.log("Filtered related products:", relatedProducts);
          setRelated(relatedProducts);
        } catch (relErr) {
          console.error("Error loading related products:", relErr);
          // Don't fail the whole page if related products fail
        }
      }
    } catch (err) {
      console.error("=== ERROR LOADING PRODUCT ===");
      console.error("Error object:", err);
      console.error("Error response:", err.response);
      console.error("Error message:", err.message);
      console.error("Error status:", err.response?.status);
      console.error("Error data:", err.response?.data);

      setError(err.response?.data?.error || err.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const res = await getProductReviews(productId);
      setReviews(res.data.data);
      setReviewSummary(res.data.summary);
    } catch (err) {
      console.error("Error loading reviews:", err);
    }
  };

  const handleSubmitReview = async () => {
    if (!userId) {
      alert("Please log in to leave a review");
      return;
    }
    if (myRating === 0) {
      alert("Please select a rating");
      return;
    }
    try {
      setSubmittingReview(true);
      await addProductReview(productId, {
        user_id: userId,
        rating: myRating,
        body: myReviewBody,
      });
      setMyRating(0);
      setMyReviewBody("");
      loadReviews();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleAdd = async () => {
    if (!userId) {
      alert("Please log in to add items to cart");
      return;
    }

    if (!selectedVariant) {
      alert("Please select a variant");
      return;
    }

    try {
      console.log("Adding to cart:", {
        user_id: userId,
        variant_id: selectedVariant.id,
        quantity: qty
      });

      await addToCart({
        user_id: userId,
        variant_id: selectedVariant.id,
        quantity: qty
      });

      console.log("Successfully added to cart");
      onAdd(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 1600);
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert(err.response?.data?.error || "Failed to add to cart");
    }
  };

  const handleOrderNow = () => {
    if (!selectedVariant) {
      alert("Please select a variant");
      return;
    }

    onNavigate("checkout", {
      direct: true,
      items: [
        {
          variant_id: selectedVariant.id,
          quantity: qty,
          product_name: product.name,
          flavor: selectedVariant.flavor,
          size_label: selectedVariant.size?.label,
          unit_price: selectedVariant.price,
          image_url: product.image_url,
        },
      ],
    });
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    return `${baseURL}${imagePath}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-500">Loading product...</p>
          <p className="text-xs text-zinc-400 mt-2">ID: {productId}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center max-w-md mx-4">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-xl font-bold text-zinc-900 mb-2">
            {error || "Product not found"}
          </p>
          <p className="text-zinc-500 mb-4">
            We couldn't load this product. Please try again or browse our catalogue.
          </p>
          <button
            onClick={() => onNavigate("catalogue")}
            className="px-6 py-3 bg-red-500 text-white rounded font-semibold hover:bg-red-600 transition-colors"
          >
            Return to catalogue
          </button>
        </div>
      </div>
    );
  }

  // Get unique flavors and sizes from variants
  const flavours = product.variants
    ? [...new Set(product.variants.filter(v => v.flavor).map(v => v.flavor))]
    : [];
  const sizes = product.variants
    ? [...new Set(product.variants.map(v => v.size?.label).filter(Boolean))]
    : [];

  const imgs = [getImageUrl(product.image_url)].filter(Boolean);

  return (
    <div className="bg-white min-h-screen">
      {/* ── BREADCRUMB ── */}
      <div className="max-w-screen-xl mx-auto px-6 pt-6 pb-2">
        <nav className="flex items-center gap-2 text-[11px] text-zinc-400 font-medium tracking-[0.05em]">
          <button
            onClick={() => onNavigate("home")}
            className="hover:text-zinc-900 bg-transparent border-0 cursor-pointer p-0 transition-colors"
          >
            HOME
          </button>
          <span>/</span>
          <button
            onClick={() => onNavigate("catalogue")}
            className="hover:text-zinc-900 bg-transparent border-0 cursor-pointer p-0 transition-colors"
          >
            CATALOGUE
          </button>
          <span>/</span>
          <span className="text-zinc-900 truncate max-w-[220px]">
            {product.name.toUpperCase()}
          </span>
        </nav>
      </div>

      {/* ── MAIN PRODUCT SECTION ── */}
      <div className="max-w-screen-xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* LEFT — IMAGE GALLERY */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Main image */}
            <div className="flex-1 bg-zinc-100 rounded-2xl overflow-hidden aspect-square flex items-center justify-center relative order-1 lg:order-2">
              <img
                src={imgs[activeImg] || imgs[0]}
                alt={product.name}
                className="w-4/5 h-4/5 object-contain transition-opacity duration-200"
                onError={(e) => {
                  e.target.style.opacity = "0.3";
                }}
              />
            </div>

            {/* Thumbnails */}
            {imgs.length > 1 && (
              <div className="flex lg:flex-col gap-2 order-2 lg:order-1 overflow-x-auto lg:overflow-visible">
                {imgs.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-[64px] h-[64px] rounded-lg border-2 overflow-hidden bg-zinc-100 flex-none cursor-pointer transition-all duration-150 p-0 ${activeImg === i
                        ? "border-zinc-900"
                        : "border-zinc-200 hover:border-zinc-400"
                      }`}
                  >
                    <img
                      src={src}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — PRODUCT INFO */}
          <div>
            {/* Brand + Name */}
            <p className="text-[11px] font-bold tracking-[0.12em] text-red-500 uppercase mb-1">
              {product.brand || "Brand"}
            </p>
            <h1 className="text-[22px] font-extrabold text-zinc-900 leading-snug mb-3">
              {product.name}
            </h1>

            {/* Rating - from backend */}
            <div className="flex items-center gap-2 mb-5">
              <Stars rating={Number(reviewSummary.average) || 0} />
              <span className="text-[12px] text-zinc-500">
                {reviewSummary.average || 0} · {reviewSummary.total} review{reviewSummary.total !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-zinc-100">
              <span className="text-[32px] font-extrabold text-zinc-900">
                {selectedVariant ? `€${selectedVariant.price}` : "Select variant"}
              </span>
            </div>

            {/* Flavour selector */}
            {flavours.length > 0 && (
              <div className="mb-5">
                <p className="text-[11px] font-extrabold tracking-[0.1em] text-zinc-700 uppercase mb-2">
                  Flavour:{" "}
                  <span className="text-zinc-900">{selectedVariant?.flavor || "Select"}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {flavours.map((f) => (
                    <button
                      key={f}
                      onClick={() => {
                        const variant = product.variants.find((v) => v.flavor === f);
                        if (variant) setSelectedVariant(variant);
                      }}
                      className={`px-3 py-1.5 rounded-full border text-[11px] font-semibold cursor-pointer transition-all duration-150 ${selectedVariant?.flavor === f
                          ? "bg-zinc-900 text-white border-zinc-900"
                          : "bg-white text-zinc-600 border-zinc-300 hover:border-zinc-600"
                        }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            {sizes.length > 0 && (
              <div className="mb-6">
                <p className="text-[11px] font-extrabold tracking-[0.1em] text-zinc-700 uppercase mb-2">
                  Size:{" "}
                  <span className="text-zinc-900">
                    {selectedVariant?.size?.label || "Select"}
                  </span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        const variant = product.variants.find((v) => v.size?.label === s);
                        if (variant) setSelectedVariant(variant);
                      }}
                      className={`px-4 py-2 rounded border text-[12px] font-bold cursor-pointer transition-all duration-150 ${selectedVariant?.size?.label === s
                          ? "bg-zinc-900 text-white border-zinc-900"
                          : "bg-white text-zinc-700 border-zinc-300 hover:border-zinc-700"
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock indicator */}
            {selectedVariant && (
              <p className="text-[12px] mb-4">
                {selectedVariant.stock_qty > 0 ? (
                  <span className="text-green-600 font-semibold">
                    ✓ In stock ({selectedVariant.stock_qty} available)
                  </span>
                ) : (
                  <span className="text-red-500 font-semibold">Out of stock</span>
                )}
              </p>
            )}

            {/* Qty + Actions */}
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
                  onClick={() =>
                    setQty((q) => Math.min(selectedVariant?.stock_qty || 999, q + 1))
                  }
                  disabled={!selectedVariant || qty >= selectedVariant.stock_qty}
                  className="w-10 h-11 bg-zinc-50 hover:bg-zinc-100 border-0 cursor-pointer text-zinc-700 font-bold text-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>

              {/* Add to cart - small */}
              <button
                onClick={handleAdd}
                disabled={!selectedVariant || selectedVariant.stock_qty === 0 || !userId}
                title={!userId ? "Log in to add to cart" : added ? "Added" : "Add to cart"}
                className={`w-11 h-11 rounded border-0 cursor-pointer transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${added
                    ? "bg-green-600 text-white"
                    : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                  }`}
              >
                {added ? (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                )}
              </button>

              {/* Order Now - big */}
              <button
                onClick={handleOrderNow}
                disabled={!selectedVariant || selectedVariant.stock_qty === 0}
                className="flex-1 h-11 rounded font-extrabold text-[12px] tracking-[0.1em] border-0 cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-red-500 hover:bg-red-600 text-white"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                ORDER NOW
              </button>
            </div>

            {/* Total */}
            {selectedVariant && (
              <div className="bg-zinc-50 rounded-lg px-4 py-3 mb-6 flex items-center justify-between">
                <span className="text-[12px] font-semibold text-zinc-500 tracking-[0.04em]">
                  TOTAL ({qty} item{qty > 1 ? "s" : ""})
                </span>
                <span className="text-[18px] font-extrabold text-zinc-900">
                  €{(parseFloat(selectedVariant.price) * qty).toFixed(2)}
                </span>
              </div>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-2">
              {BADGES.map((b) => (
                <div
                  key={b.label}
                  className="flex items-center gap-2.5 bg-zinc-50 rounded-lg px-3 py-2.5"
                >
                  <span className="text-zinc-500 shrink-0">{b.icon}</span>
                  <span className="text-[11px] font-semibold text-zinc-700">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS: DESCRIPTION / REVIEWS ── */}
      <div className="border-t border-zinc-100 mt-4">
        <div className="max-w-screen-xl mx-auto px-6">
          {/* Tab bar */}
          <div className="flex gap-0 border-b border-zinc-200 overflow-x-auto no-scrollbar">
            {["description", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-[11px] font-extrabold tracking-[0.1em] uppercase border-0 cursor-pointer whitespace-nowrap transition-all duration-150 border-b-2 -mb-px ${activeTab === tab
                    ? "text-zinc-900 border-red-500 bg-transparent"
                    : "text-zinc-400 border-transparent bg-transparent hover:text-zinc-700"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="py-8 max-w-2xl">
            {activeTab === "description" && (
              <p className="text-[14px] text-zinc-600 leading-[1.8]">
                {product.description || "No description available."}
              </p>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-5">
                {/* Summary bar */}
                <div className="flex items-center gap-6 p-5 bg-zinc-50 rounded-xl mb-6">
                  <div className="text-center shrink-0">
                    <p className="text-[48px] font-extrabold text-zinc-900 leading-none">
                      {reviewSummary.average || "—"}
                    </p>
                    <Stars rating={Number(reviewSummary.average) || 0} />
                    <p className="text-[11px] text-zinc-400 mt-1">{reviewSummary.total} reviews</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const pct = reviewSummary.breakdown?.[star] || 0;
                      return (
                        <div key={star} className="flex items-center gap-2">
                          <span className="text-[11px] text-zinc-500 w-3 text-right">{star}</span>
                          <svg
                            className="w-3 h-3 text-zinc-300 shrink-0"
                            viewBox="0 0 20 20"
                            fill="#ef4444"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <div className="flex-1 bg-zinc-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-red-500 h-full rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-[11px] text-zinc-400 w-7">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Write a review */}
                {userId && (
                  <div className="border border-zinc-200 rounded-xl p-5 mb-6">
                    <p className="text-[13px] font-extrabold text-zinc-900 mb-3">Write a review</p>
                    <div className="flex items-center gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setMyRating(star)}
                          className="bg-transparent border-0 cursor-pointer p-0.5"
                        >
                          <svg
                            className="w-6 h-6"
                            viewBox="0 0 20 20"
                            fill={star <= myRating ? "#ef4444" : "#e4e4e7"}
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={myReviewBody}
                      onChange={(e) => setMyReviewBody(e.target.value)}
                      placeholder="Share your experience with this product..."
                      className="w-full p-3 border border-zinc-200 rounded-lg text-[13px] resize-none focus:outline-none focus:border-red-400 mb-3"
                      rows={3}
                    />
                    <button
                      onClick={handleSubmitReview}
                      disabled={submittingReview}
                      className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white text-[12px] font-extrabold rounded transition-colors disabled:opacity-50 border-0 cursor-pointer"
                    >
                      {submittingReview ? "Submitting..." : "Submit Review"}
                    </button>
                  </div>
                )}

                {/* Reviews list */}
                {reviews.length === 0 ? (
                  <p className="text-[13px] text-zinc-400 text-center py-8">
                    No reviews yet. Be the first to review this product!
                  </p>
                ) : (
                  reviews.map((r) => (
                    <div key={r.id} className="border-b border-zinc-100 pb-5 last:border-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[13px] font-extrabold text-zinc-900">
                          {r.first_name} {r.last_name?.charAt(0)}.
                        </span>
                        <span className="text-[11px] text-zinc-400">
                          {new Date(r.created_at).toLocaleDateString("en-GB", {
                            day: "numeric", month: "short", year: "numeric"
                          })}
                        </span>
                      </div>
                      <Stars rating={r.rating} />
                      {r.body && (
                        <p className="text-[13px] text-zinc-600 leading-relaxed mt-2">{r.body}</p>
                      )}
                    </div>
                  ))
                )}
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
                <div
                  key={p.id}
                  onClick={() => {
                    console.log("Related product clicked:", p.id);
                    onNavigate("product", p.id);
                  }}
                  className="cursor-pointer"
                >
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