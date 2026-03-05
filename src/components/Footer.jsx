import { SOCIAL_PATHS } from "../data/index.js";

function FooterLink({ label }) {
  return (
    <a
      href="#"
      className="block text-zinc-500 hover:text-white text-[12px] no-underline mb-2.5 transition-colors duration-150"
    >
      {label}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-white pt-14 pb-6 px-6 border-t border-zinc-900">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            {/* ── LOGO PLACEHOLDER ── replace with <img src="logo.png" className="h-7 mb-4" /> ── */}
            <div className="w-[110px] h-[26px] border border-dashed border-zinc-800 rounded flex items-center justify-center text-zinc-600 text-[10px] font-mono mb-4 select-none">
              [ YOUR LOGO ]
            </div>
            <p className="text-[12px] text-zinc-500 leading-relaxed mb-5 max-w-[260px]">
              Your ultimate destination for premium fitness supplements. Build
              muscle, burn fat, and achieve your fitness goals with GymBros..
            </p>
            <div className="flex gap-2">
              {SOCIAL_PATHS.map((d, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-[33px] h-[33px] rounded-full bg-zinc-900 hover:bg-zinc-700 flex items-center justify-center text-zinc-500 hover:text-white no-underline transition-colors duration-150"
                >
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                    <path d={d} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-[12px] font-extrabold tracking-[0.1em] text-white mb-4 uppercase">
              Customer Service
            </h4>
            {["Contact Us", "Shipping Policy", "Returns & Exchanges", "FAQs", "Track Order"].map((l) => (
              <FooterLink key={l} label={l} />
            ))}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[12px] font-extrabold tracking-[0.1em] text-white mb-4 uppercase">
              Quick Links
            </h4>
            {["About Us", "Our Blog", "Loyalty Program", "Refer a Friend", "Sitemap"].map((l) => (
              <FooterLink key={l} label={l} />
            ))}
          </div>

          {/* Payment + Shipping */}
          <div>
            <h4 className="text-[12px] font-extrabold tracking-[0.1em] text-white mb-4 uppercase">
              We Accept
            </h4>
            <div className="flex flex-wrap gap-1.5 mb-6">
              {["VISA", "MC", "AMEX", "PayPal", "Apple Pay"].map((c) => (
                <span
                  key={c}
                  className="bg-zinc-900 border border-zinc-800 text-zinc-500 text-[9px] font-bold px-[7px] py-[3px] rounded-sm"
                >
                  {c}
                </span>
              ))}
            </div>
            <h4 className="text-[12px] font-extrabold tracking-[0.1em] text-white mb-2 uppercase">
              Free Shipping
            </h4>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              On orders over €50. Delivered in 2–4 business days.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-zinc-900 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-zinc-700">
            © {new Date().getFullYear()} GymBros. All rights reserved.
          </p>
          <div className="flex gap-5">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((l) => (
              <a
                key={l}
                href="#"
                className="text-[11px] text-zinc-700 hover:text-zinc-400 no-underline transition-colors duration-150"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
