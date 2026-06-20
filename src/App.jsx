import { useState, useEffect } from "react";
import "./index.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { getCart } from "./api/cart";

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
import AdminDashboard from "./admin/AdminDashboard.jsx";
import LoginPage from "./pages/Loginpage.jsx";
import RegisterPage from "./pages/Registerpage.jsx";
import OrderPage from "./pages/OrderPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

function AppContent() {
  const { user, isAdmin: userIsAdmin } = useAuth();

  const [cartOpen, setCartOpen] = useState(false);
  const [page, setPage] = useState("home");
  const [productId, setProductId] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  // Debug logging
  useEffect(() => {
    console.log("App - Current user:", user);
    console.log("App - User ID:", user?.id);
    console.log("App - Is Admin:", userIsAdmin);
  }, [user, userIsAdmin]);

  // Load cart count when user changes
  useEffect(() => {
    if (user?.id) {
      loadCartCount();
    } else {
      setCartCount(0);
    }
  }, [user]);

  const loadCartCount = async () => {
    if (!user?.id) return;

    try {
      console.log("Loading cart count for user:", user.id);
      const response = await getCart(user.id);
      const items = response.data.data || [];
      const count = items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
      console.log("Cart count loaded:", count);
    } catch (err) {
      console.error("Error loading cart count:", err);
    }
  };

  // Check authentication when trying to access admin
  useEffect(() => {
    if (page === "admin") {
      if (!user) {
        setPage("login");
        return;
      }
      if (!userIsAdmin) {
        setPage("home");
        alert("Access denied. Admin privileges required.");
      }
    }
  }, [page, user, userIsAdmin]);

  // Check authentication when trying to access profile
  useEffect(() => {
    if (page === "profile" && !user) {
      setPage("login");
    }
  }, [page, user]);

  const navigate = (target, data = null) => {
    console.log("=== NAVIGATION CALLED ===");
    console.log("Target page:", target);
    console.log("Data:", data);

    setPage(target);

    if (target === "product" && data) {
      console.log("Setting productId state to:", data);
      setProductId(data);
    }

    if (target === "checkout" && data) {
      console.log("Setting orderData state to:", data);
      setOrderData(data);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddToCart = () => {
    console.log("Item added to cart, reloading cart count");
    loadCartCount();
  };

  const handleCartUpdate = (count) => {
    console.log("Cart updated with count:", count);
    setCartCount(count);
  };

  const handleCartOpen = () => {
    console.log("Opening cart drawer");
    setCartOpen(true);
    // Reload cart when opening
    if (user?.id) {
      loadCartCount();
    }
  };

  // Debug current page state
  useEffect(() => {
    console.log("=== PAGE STATE CHANGED ===");
    console.log("Current page:", page);
    console.log("Current productId:", productId);
  }, [page, productId]);

  return (
    <div className="min-h-screen bg-white">
      {/* Only show Navbar on non-admin, non-login, and non-register pages */}
      {page !== "admin" && page !== "login" && page !== "register" && (
        <Navbar
          cartCount={cartCount}
          onCartOpen={handleCartOpen}
          onNavigate={navigate}
          currentPage={page}
        />
      )}

      {page === "admin" && <AdminDashboard onNavigate={navigate} />}

      {page === "login" && <LoginPage onNavigate={navigate} />}

      {page === "register" && <RegisterPage onNavigate={navigate} />}

      {page === "home" && (
        <>
          <Ticker />
          <HeroSlider onNavigate={navigate} />
          <ShopByCategory onNavigate={navigate} />
          <ShopByGoals />
          <BestSellers
            onAdd={handleAddToCart}
            onNavigate={navigate}
            userId={user?.id}
          />
          <PromoBanner />
          <Footer onNavigate={navigate} />
        </>
      )}

      {page === "catalogue" && (
        <>
          <div className="mt-[52px]" key="catalogue">
            <CataloguePage
              onAdd={handleAddToCart}
              onNavigate={navigate}
              userId={user?.id}
            />
          </div>
          <Footer onNavigate={navigate} />
        </>
      )}

      {page === "product" && (
        <>
          <div className="mt-[52px]">
            <ProductPage
              productId={productId}
              onAdd={handleAddToCart}
              onNavigate={navigate}
              userId={user?.id}
            />
          </div>
          <Footer onNavigate={navigate} />
        </>
      )}

      {page === "checkout" && (
        <>
          <div className="mt-[52px]">
            <OrderPage
              orderData={orderData}
              onNavigate={navigate}
              userId={user?.id}
              user={user}
            />
          </div>
          <Footer onNavigate={navigate} />
        </>
      )}

      {page === "profile" && (
        <>
          <div className="mt-[52px]">
            <ProfilePage onNavigate={navigate} />
          </div>
          <Footer onNavigate={navigate} />
        </>
      )}

      {/* Cart drawer */}
      {cartOpen && page !== "admin" && page !== "login" && page !== "register" && (
        <>
          {user ? (
            <CartDrawer
              userId={user.id}
              onClose={() => setCartOpen(false)}
              onCartUpdate={handleCartUpdate}
              isOpen={cartOpen}
              onNavigate={navigate}
            />
          ) : (
            // Show login prompt if cart opened but not logged in
            <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/55 backdrop-blur-sm">
              <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
                <svg
                  className="w-16 h-16 text-red-500 mx-auto mb-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <h2 className="text-xl font-extrabold text-zinc-900 mb-2">
                  Login Required
                </h2>
                <p className="text-zinc-600 mb-6">Please log in to view your cart</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setCartOpen(false)}
                    className="flex-1 px-4 py-2.5 border border-zinc-300 rounded text-zinc-700 font-semibold hover:bg-zinc-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setCartOpen(false);
                      navigate("login");
                    }}
                    className="flex-1 px-4 py-2.5 bg-red-500 rounded text-white font-semibold hover:bg-red-600 transition-colors"
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}