import { useState } from "react";
import "./index.css";

import Navbar from "./components/Navbar.jsx";
import Ticker from "./components/Ticker.jsx";
import HeroSlider from "./components/HeroSlider.jsx";
import ShopByCategory from "./components/ShopByCategory.jsx";
import ShopByGoals from "./components/ShopByGoals.jsx";
import BestSellers from "./components/BestSellers.jsx";
import PromoBanner from "./components/PromoBanner.jsx";
import Footer from "./components/Footer.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import CataloguePage from "./pages/CataloguePage.jsx";

export default function App() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [page, setPage] = useState("home"); // "home" | "catalogue" | "product"
  const [productId, setProductId] = useState(null);

  const navigate = (target, id = null) => {
    setPage(target);
    if (id) setProductId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addToCart = (p) => {
    setCart((prev) => {
      const key = `${p.id}-${p.flavour || ""}-${p.size || ""}`;
      const ex = prev.find((i) => i._key === key);
      if (ex)
        return prev.map((i) =>
          i._key === key ? { ...i, qty: i.qty + (p.qty || 1) } : i,
        );
      return [...prev, { ...p, qty: p.qty || 1, _key: key }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (key) =>
    setCart((p) => p.filter((i) => i._key !== key));

  const updateQty = (key, qty) => {
    if (qty <= 0) return removeFromCart(key);
    setCart((p) => p.map((i) => (i._key === key ? { ...i, qty } : i)));
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        onNavigate={navigate}
        currentPage={page}
      />

      {page === "home" && (
        <>
          <Ticker />
          <HeroSlider onNavigate={navigate} />
          <ShopByCategory onNavigate={navigate} />
          <ShopByGoals />
          <BestSellers onAdd={addToCart} onNavigate={navigate} />
          <PromoBanner />
          <Footer onNavigate={navigate} />
        </>
      )}

      {page === "catalogue" && (
        <>
          <div className="mt-[52px]">
            <CataloguePage onAdd={addToCart} onNavigate={navigate} />
          </div>
          <Footer onNavigate={navigate} />
        </>
      )}

      {page === "product" && (
        <>
          <div className="mt-[52px]">
            <ProductPage
              productId={productId}
              onAdd={addToCart}
              onNavigate={navigate}
            />
          </div>
          <Footer onNavigate={navigate} />
        </>
      )}

      {cartOpen && (
        <CartDrawer
          items={cart}
          onClose={() => setCartOpen(false)}
          onRemove={removeFromCart}
          onUpdateQty={updateQty}
        />
      )}
    </div>
  );
}
