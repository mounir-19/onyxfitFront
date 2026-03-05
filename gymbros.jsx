
/* ─── ROOT APP ───────────────────────────────────────────────────────────────── */
export default function App() {
  const [cart, setCart]         = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = p => {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      if (ex) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...p, qty: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = id => setCart(p => p.filter(i => i.id !== id));

  const updateQty = (id, qty) => {
    if (qty <= 0) return removeFromCart(id);
    setCart(p => p.map(i => i.id === id ? { ...i, qty } : i));
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <>
      <MinimalStyles />
      <div className="min-h-screen bg-white">
        <Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
        <Ticker />
        <HeroSlider />
        <ShopByCategory />
        <ShopByGoals />
        <BestSellers onAdd={addToCart} />
        <PromoBanner />
        <Footer />
      </div>
      {cartOpen && (
        <CartDrawer
          items={cart}
          onClose={() => setCartOpen(false)}
          onRemove={removeFromCart}
          onUpdateQty={updateQty}
        />
      )}
    </>
  );
}
