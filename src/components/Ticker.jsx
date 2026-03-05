import { TICKER_TEXT } from "../data/index.js";

export default function Ticker() {
  return (
    <div className="bg-[#f5d000] overflow-hidden whitespace-nowrap mt-[52px]">
      <div className="animate-ticker inline-flex">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="inline-block py-[6px] text-[11px] font-extrabold tracking-[0.1em] text-black"
          >
            {TICKER_TEXT}&nbsp;&nbsp;&nbsp;
          </span>
        ))}
      </div>
    </div>
  );
}
