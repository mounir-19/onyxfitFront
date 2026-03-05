export default function CartDrawer({ items, onClose, onRemove, onUpdateQty }) {
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div className="fixed inset-0 z-[300] flex bg-black/55 backdrop-blur-sm">
      {/* Overlay */}
      <div className="flex-1" onClick={onClose} />

      {/* Panel */}
      <div className="animate-slide-in-right w-[380px] max-w-full bg-white flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-5 py-[17px] border-b border-zinc-200 flex justify-between items-center">
          <h3 className="text-[14px] font-extrabold tracking-[0.07em] text-zinc-900">
            YOUR CART ({items.length})
          </h3>
          <button
            onClick={onClose}
            className="bg-transparent border-0 cursor-pointer text-zinc-400 hover:text-zinc-900 p-1 transition-colors duration-150"
          >
            <svg
              className="w-[17px] h-[17px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="text-center text-zinc-400 py-16">
              <div className="text-5xl mb-3">🛒</div>
              <p className="font-semibold text-[13px]">Your cart is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item._key}
                className="flex gap-3 pb-4 mb-4 border-b border-zinc-100 last:border-0"
              >
                <div className="w-[62px] h-[62px] rounded-lg bg-zinc-100 shrink-0 overflow-hidden flex items-center justify-center">
                  <img
                    src={item.img}
                    alt=""
                    className="w-[90%] h-[90%] object-contain"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-zinc-900 leading-snug mb-0.5">
                    {item.name}
                  </p>
                  {(item.flavour || item.size) && (
                    <p className="text-[10px] text-zinc-400 mb-1">
                      {[item.flavour, item.size].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  <p className="text-[12px] text-zinc-400 mb-2">
                    €{item.price.toFixed(2)}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQty(item._key, item.qty - 1)}
                      className="w-6 h-6 border border-zinc-200 hover:bg-zinc-100 rounded bg-white cursor-pointer text-sm flex items-center justify-center transition-colors duration-150"
                    >
                      −
                    </button>
                    <span className="text-[13px] font-bold w-4 text-center">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => onUpdateQty(item._key, item.qty + 1)}
                      className="w-6 h-6 border border-zinc-200 hover:bg-zinc-100 rounded bg-white cursor-pointer text-sm flex items-center justify-center transition-colors duration-150"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => onRemove(item._key)}
                  className="bg-transparent border-0 cursor-pointer text-zinc-300 hover:text-red-500 self-start p-0.5 transition-colors duration-150"
                >
                  <svg
                    className="w-3 h-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-zinc-200">
            <div className="flex justify-between items-center mb-3.5">
              <span className="text-[12px] font-semibold text-zinc-500 tracking-[0.05em] uppercase">
                Subtotal
              </span>
              <span className="text-[17px] font-extrabold text-zinc-900">
                €{total.toFixed(2)}
              </span>
            </div>
            <button className="w-full py-[13px] bg-zinc-900 hover:bg-red-500 text-white border-0 rounded text-[11px] font-extrabold tracking-[0.12em] cursor-pointer transition-colors duration-150">
              CHECKOUT
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 mt-2 bg-transparent text-zinc-400 hover:text-zinc-900 border-0 text-[12px] font-semibold tracking-[0.04em] cursor-pointer transition-colors duration-150"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
