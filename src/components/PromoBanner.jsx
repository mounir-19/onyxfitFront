export default function PromoBanner() {
  return (
    <section className="promo-bg relative min-h-[320px] flex items-center">
      <div className="relative z-10 max-w-screen-xl mx-auto w-full px-10 py-16 flex items-center justify-between">
        {/* Left */}
        <div>
          <h2 className="bebas text-[clamp(60px,8vw,104px)] text-white leading-[0.92] tracking-[0.01em]">
            BE READY
          </h2>
          <p className="text-zinc-300 text-[clamp(12px,1.8vw,17px)] font-semibold tracking-[0.22em] uppercase mt-2 mb-8">
            FOR THE NEXT TRAINING
          </p>
          <button className="bg-white hover:bg-zinc-100 text-zinc-900 border-0 px-9 py-[13px] text-[13px] font-extrabold tracking-[0.1em] cursor-pointer transition-all duration-150 hover:-translate-y-px active:translate-y-0">
            SHOP NOW
          </button>
        </div>

        {/* Right product image */}
        <div className="hidden md:block flex-none w-[clamp(180px,38%,420px)]">
          <img
            src="https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=700&q=80"
            alt=""
            className="w-full object-contain drop-shadow-2xl"
            onError={(e) => {
              e.target.style.opacity = "0";
            }}
          />
        </div>
      </div>
    </section>
  );
}
