import api from "./axios";

// ========================
// CART OPERATIONS
// ========================

/**
 * Get cart items for the current user
 * @param {number} userId - User ID
 * @returns {Promise} Cart items
 */
export const getCart = (userId) => {
    console.log("API: getCart called with userId:", userId);
    return api.get("/store/cart", { params: { user_id: userId } });
};

/**
 * Add item to cart
 * @param {Object} data - { user_id, variant_id, quantity }
 * @returns {Promise} Added cart item
 */
export const addToCart = (data) => {
    console.log("API: addToCart called with data:", data);
    return api.post("/store/cart", data);
};

/**
 * Update cart item quantity
 * @param {number} cartItemId - Cart item ID
 * @param {number} quantity - New quantity
 * @returns {Promise} Updated cart item
 */
export const updateCartItem = (cartItemId, quantity) => {
    console.log("API: updateCartItem called with:", cartItemId, quantity);
    return api.patch(`/store/cart/${cartItemId}`, { quantity });
};

/**
 * Remove item from cart
 * @param {number} cartItemId - Cart item ID
 * @returns {Promise} Deletion result
 */
export const removeFromCart = (cartItemId) => {
    console.log("API: removeFromCart called with:", cartItemId);
    return api.delete(`/store/cart/${cartItemId}`);
};

/**
 * Clear entire cart
 * @param {number} userId - User ID
 * @returns {Promise} Clear result
 */
export const clearCart = (userId) => {
    console.log("API: clearCart called with userId:", userId);
    return api.delete(`/store/cart/clear?user_id=${userId}`);
};