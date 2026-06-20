import banner from "../assets/bottom_image.png";
import bannerMobile from "../assets/bottom_image_mobile.png";

export default function PromoBanner() {
  return (
    <section className="relative min-h-[450px] md:min-h-[500px] flex items-center overflow-hidden">

      {/* Background Image - Desktop */}
      <img
        src={banner}
        alt="training banner"
        className="hidden md:block absolute inset-0 w-full h-full object-fit"
      />

      {/* Background Image - Mobile */}
      <img
        src={bannerMobile}
        alt="training banner"
        className="md:hidden absolute inset-0 w-full h-full object-fit"
      />

      {/* Optional overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 max-w-screen-xl mx-auto w-full px-6 sm:px-8 md:px-10 py-12 sm:py-14 md:py-16 flex items-center justify-between">

        <div>
          <h2 className="bebas text-[clamp(48px,10vw,104px)] text-white leading-[0.92] tracking-[0.01em]">
            BE READY
          </h2>

          <p className="text-zinc-300 text-[clamp(11px,2vw,17px)] font-semibold tracking-[0.22em] uppercase mt-2 mb-6 sm:mb-8">
            FOR THE NEXT TRAINING
          </p>

          <button className="bg-white hover:bg-zinc-100 text-zinc-900 border-0 px-7 sm:px-9 py-3 sm:py-[13px] text-[12px] sm:text-[13px] font-extrabold tracking-[0.1em] cursor-pointer transition-all duration-150 hover:-translate-y-px active:translate-y-0">
            SHOP NOW
          </button>
        </div>

      </div>
    </section>
  );
}