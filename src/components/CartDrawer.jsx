import { useState, useEffect } from "react";
import { getCart, removeFromCart, updateCartItem } from "../api/cart";
export default function CartDrawer({ userId, onClose, onCartUpdate, isOpen, onNavigate }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(new Set());
  const [updating, setUpdating] = useState(new Set());

  // Reload cart whenever drawer opens or userId changes
  useEffect(() => {
    if (userId && isOpen) {
      loadCart();
    }
  }, [userId, isOpen]);

  const loadCart = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const response = await getCart(userId);
      const cartItems = response.data.data || [];
      setItems(cartItems);

      // Update total quantity in parent
      const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      onCartUpdate?.(totalQty);
    } catch (err) {
      console.error("Error loading cart:", err);
      setItems([]);
      onCartUpdate?.(0);
    } finally {
      setLoading(false);
    }
  };

  // ✅ REMOVE ITEM FUNCTION
  const handleRemove = async (cartItemId) => {
    if (!userId) return;

    setRemoving(prev => new Set(prev).add(cartItemId));

    try {
      await removeFromCart(cartItemId);

      // Optimistically update UI
      setItems(prev => prev.filter(item => item.id !== cartItemId));

      // Update parent cart count
      const newTotalQty = items
        .filter(item => item.id !== cartItemId)
        .reduce((sum, item) => sum + item.quantity, 0);
      onCartUpdate?.(newTotalQty);

    } catch (err) {
      console.error("Error removing item:", err);
      alert("Failed to remove item. Please try again.");
      // Reload cart on error
      loadCart();
    } finally {
      setRemoving(prev => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });
    }
  };

  // ✅ UPDATE QUANTITY FUNCTION
  const handleQuantityChange = async (cartItemId, newQty, stockQty) => {
    if (newQty < 1) return;
    if (stockQty != null && newQty > stockQty) return;

    setUpdating(prev => new Set(prev).add(cartItemId));

    // Optimistic update
    const prevItems = items;
    setItems(prev =>
      prev.map(item =>
        item.id === cartItemId ? { ...item, quantity: newQty } : item
      )
    );

    try {
      await updateCartItem(cartItemId, newQty);

      const newTotalQty = items
        .map(item => item.id === cartItemId ? { ...item, quantity: newQty } : item)
        .reduce((sum, item) => sum + item.quantity, 0);
      onCartUpdate?.(newTotalQty);
    } catch (err) {
      console.error("Error updating quantity:", err);
      setItems(prevItems); // revert on error
      alert(err.response?.data?.error || "Failed to update quantity");
    } finally {
      setUpdating(prev => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });
    }
  };

  const handleCheckout = () => {
    const orderItems = items.map((item) => ({
      variant_id: item.variant_id,
      quantity: item.quantity,
      product_name: item.product_name,
      flavor: item.flavor,
      size_label: item.size_label,
      unit_price: item.price,
      image_url: item.product_image,
    }));

    onClose();
    onNavigate("checkout", {
      direct: false,
      items: orderItems,
    });
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    return `${baseURL}${imagePath}`;
  };

  const total = items.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );

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
          {loading ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-[13px] text-zinc-500">Loading cart...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center text-zinc-400 py-16">
              <div className="text-5xl mb-3">🛒</div>
              <p className="font-semibold text-[13px]">Your cart is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 pb-4 mb-4 border-b border-zinc-100 last:border-0"
              >
                {/* Image */}
                <div className="w-[62px] h-[62px] rounded-lg bg-zinc-100 shrink-0 overflow-hidden flex items-center justify-center">
                  <img
                    src={getImageUrl(item.product_image)}
                    alt={item.product_name}
                    className="w-[90%] h-[90%] object-contain"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-red-500 font-bold uppercase mb-0.5">
                    {item.product_brand || "Brand"}
                  </p>
                  <p className="text-[12px] font-semibold text-zinc-900 leading-snug mb-0.5">
                    {item.product_name}
                  </p>
                  {(item.flavor || item.size_label) && (
                    <p className="text-[10px] text-zinc-400 mb-1">
                      {[item.flavor, item.size_label].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  <p className="text-[12px] text-zinc-400 mb-2">
                    €{parseFloat(item.price).toFixed(2)}
                  </p>

                  {/* Quantity controls */}
                  <div className="flex items-center border border-zinc-200 rounded w-fit overflow-hidden">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.stock_qty)}
                      disabled={updating.has(item.id) || item.quantity <= 1}
                      className="w-7 h-7 bg-zinc-50 hover:bg-zinc-100 border-0 cursor-pointer text-zinc-700 font-bold text-sm flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      −
                    </button>
                    <span className="w-8 h-7 flex items-center justify-center text-[12px] font-extrabold text-zinc-900 border-l border-r border-zinc-200">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.stock_qty)}
                      disabled={updating.has(item.id) || (item.stock_qty != null && item.quantity >= item.stock_qty)}
                      className="w-7 h-7 bg-zinc-50 hover:bg-zinc-100 border-0 cursor-pointer text-zinc-700 font-bold text-sm flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* ✅ REMOVE BUTTON */}
                <button
                  onClick={() => handleRemove(item.id)}
                  disabled={removing.has(item.id)}
                  className="shrink-0 w-7 h-7 rounded-full border border-zinc-200 hover:border-red-400 hover:bg-red-50 flex items-center justify-center transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed group hover:scale-110"
                  title="Remove item"
                >
                  {removing.has(item.id) ? (
                    <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg
                      className="w-3.5 h-3.5 text-zinc-500 group-hover:text-red-500 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
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
            <button
              onClick={handleCheckout}
              className="w-full py-[13px] bg-zinc-900 hover:bg-red-500 text-white border-0 rounded text-[11px] font-extrabold tracking-[0.12em] cursor-pointer transition-colors duration-150"
            >
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