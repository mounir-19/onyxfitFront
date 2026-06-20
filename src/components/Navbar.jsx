import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

// Keep all the supplement/nutrition links, remove only Food, Sportswear, Accessories
const NAV_LINKS = [
  "Protein",
  "Pre-Workout",
  "Creatine",
  "Vitamins",
  "Weight Loss",
  "Offers"
];

export default function Navbar({
  cartCount,
  onCartOpen,
  onNavigate,
  currentPage,
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleAccountClick = () => {
    if (user) {
      onNavigate('profile');
    } else {
      onNavigate('login');
    }
  };

  const handleLogout = () => {
    if (confirm('Log out?')) {
      logout();
      onNavigate('home');
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 transition-all duration-200 ${scrolled ? "bg-zinc-950/95 backdrop-blur-md" : "bg-[#0d0d0d]"
        }`}
    >
      <div className="max-w-screen-xl mx-auto px-6 h-[52px] flex items-center justify-between">
        {/* LOGO */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center max-h-full bg-transparent border-0 cursor-pointer p-0"
        >
          <img src={logo} alt="OnyxFit" className="h-10 w-auto" />
          <span className="text-lg font-extrabold tracking-tight text-white">
            ONYX<span className="text-red-500">FIT</span>
          </span>
        </button>

        {/* Desktop nav - Keep supplement links */}
        <ul className="hidden lg:flex items-center gap-6 list-none">
          {NAV_LINKS.map((l) => (
            <li key={l}>
              <button
                onClick={() => onNavigate("catalogue")}
                className="nav-underline text-zinc-400 hover:text-white text-[12px] font-medium tracking-[0.04em] no-underline transition-colors duration-150 pb-0.5 bg-transparent border-0 cursor-pointer"
              >
                {l}
              </button>
            </li>
          ))}
        </ul>

        {/* Right icons */}
        <div className="flex items-center gap-1">
          {/* Search */}
          <button
            onClick={() => onNavigate("catalogue")}
            className="text-zinc-400 hover:text-white bg-transparent border-0 cursor-pointer p-1.5 transition-colors duration-150"
            aria-label="Search"
          >
            <svg
              className="w-[17px] h-[17px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>

          {/* Admin - Only show if user is admin */}
          {isAdmin && (
            <button
              onClick={() => onNavigate("admin")}
              className={`text-zinc-400 hover:text-white bg-transparent border-0 cursor-pointer p-1.5 transition-colors duration-150 ${currentPage === "admin" ? "text-red-500" : ""
                }`}
              aria-label="Admin Panel"
              title="Admin Panel"
            >
              <svg
                className="w-[17px] h-[17px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </button>
          )}

          {/* Account - Shows login state, goes to profile */}
          <button
            onClick={handleAccountClick}
            className={`text-zinc-400 hover:text-white bg-transparent border-0 cursor-pointer p-1.5 transition-colors duration-150 relative ${currentPage === "profile" ? "text-red-500" : ""
              }`}
            aria-label={user ? 'My Account' : 'Login'}
            title={user ? `${user.first_name || user.email} — My Account` : 'Login'}
          >
            <svg
              className="w-[17px] h-[17px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            {user && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-zinc-900"></span>
            )}
          </button>

          {/* Logout - separate icon, only when logged in */}
          {user && (
            <button
              onClick={handleLogout}
              className="text-zinc-400 hover:text-red-400 bg-transparent border-0 cursor-pointer p-1.5 transition-colors duration-150"
              aria-label="Logout"
              title="Logout"
            >
              <svg
                className="w-[17px] h-[17px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          )}

          {/* Cart */}
          <button
            onClick={onCartOpen}
            className="relative text-zinc-400 hover:text-white bg-transparent border-0 cursor-pointer p-1.5 transition-colors duration-150"
            aria-label="Shopping Cart"
          >
            <svg
              className="w-[17px] h-[17px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[9px] font-extrabold rounded-full w-[15px] h-[15px] flex items-center justify-center leading-none">
                {cartCount}
              </span>
            )}
          </button>

          {/* Hamburger - Mobile only */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="lg:hidden text-zinc-400 hover:text-white bg-transparent border-0 cursor-pointer p-1.5"
            aria-label="Menu"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              {mobileOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-zinc-900 border-t border-zinc-800 px-6 pb-4">
          {NAV_LINKS.map((l) => (
            <button
              key={l}
              onClick={() => {
                onNavigate("catalogue");
                setMobileOpen(false);
              }}
              className="block w-full text-left text-zinc-400 hover:text-white py-2.5 text-[13px] border-b border-zinc-800 transition-colors bg-transparent cursor-pointer"
            >
              {l}
            </button>
          ))}

          {user && (
            <div className="py-2.5 border-b border-zinc-800">
              <p className="text-[11px] text-zinc-500 mb-1">Logged in as</p>
              <p className="text-[13px] text-white font-semibold">{user.first_name} {user.last_name}</p>
            </div>
          )}

          {isAdmin && (
            <button
              onClick={() => {
                onNavigate("admin");
                setMobileOpen(false);
              }}
              className="block w-full text-left text-zinc-400 hover:text-white py-2.5 text-[13px] border-b border-zinc-800 transition-colors bg-transparent cursor-pointer"
            >
              ADMIN PANEL
            </button>
          )}

          {user ? (
            <>
              <button
                onClick={() => {
                  onNavigate("profile");
                  setMobileOpen(false);
                }}
                className="flex items-center gap-2 w-full text-left text-zinc-400 hover:text-white py-2.5 text-[13px] border-b border-zinc-800 transition-colors bg-transparent cursor-pointer"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                MY ACCOUNT
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="flex items-center gap-2 w-full text-left text-zinc-400 hover:text-white py-2.5 text-[13px] transition-colors bg-transparent cursor-pointer"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                LOGOUT
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                onNavigate("login");
                setMobileOpen(false);
              }}
              className="block w-full text-left text-zinc-400 hover:text-white py-2.5 text-[13px] transition-colors bg-transparent cursor-pointer"
            >
              LOGIN
            </button>
          )}
        </div>
      )}
    </nav>
  );
}