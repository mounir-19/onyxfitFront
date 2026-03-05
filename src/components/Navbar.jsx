import { useState, useEffect } from "react";
import { NAV_LINKS } from "../data/index.js";
import logo from "../assets/logo.svg";
import logotext from "../assets/logotext.svg";
export default function Navbar({
  cartCount,
  onCartOpen,
  onNavigate,
  currentPage,
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 transition-all duration-200 ${scrolled ? "bg-zinc-950/95 backdrop-blur-md" : "bg-[#0d0d0d]"}`}
    >
      <div className="max-w-screen-xl mx-auto px-6 h-[52px] flex items-center justify-between">
        {/* LOGO */}
        <div className="max-h-full max-w-40 flex ">
          <img src={logo} alt="Logo" className=" " />
          <img src={logotext} alt="Logo" className="" />
        </div>

        {/* Desktop nav */}
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

          {/* Account */}
          <button className="text-zinc-400 hover:text-white bg-transparent border-0 cursor-pointer p-1.5 transition-colors duration-150">
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
          </button>

          {/* Cart */}
          <button
            onClick={onCartOpen}
            className="relative text-zinc-400 hover:text-white bg-transparent border-0 cursor-pointer p-1.5 transition-colors duration-150"
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

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="lg:hidden text-zinc-400 hover:text-white bg-transparent border-0 cursor-pointer p-1.5"
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
              className="block w-full text-left text-zinc-400 hover:text-white py-2.5 text-[13px] border-b border-zinc-800 last:border-0 transition-colors bg-transparent cursor-pointer"
            >
              {l}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
