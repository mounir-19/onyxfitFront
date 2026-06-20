import api from "./axios";

/**
 * ===========================
 * CLIENT-SIDE ORDERS
 * ===========================
 */

/**
 * Create a new order from cart
 * @param {Object} orderData - { user_id, items, shipping_address, shipping_cost }
 * @returns {Promise} Axios response
 */
export const createOrder = (orderData) => {
    return api.post("/orders/create", orderData);
};

/**
 * Get orders for a specific user
 * @param {string} userId
 * @returns {Promise} Axios response
 */
export const getUserOrders = (userId) => {
    return api.get(`/orders/user/${userId}`);
};

/**
 * Get a single order's details
 * @param {string} orderId
 * @returns {Promise} Axios response
 */
export const getOrder = (orderId) => {
    return api.get(`/orders/${orderId}`);
};

/**
 * Create a Stripe payment intent for an order
 * @param {string} orderId
 * @returns {Promise} Axios response
 */
export const createPaymentIntent = (orderId) => {
    return api.post(`/orders/${orderId}/create-payment-intent`);
};

/**
 * ===========================
 * ADMIN-SIDE ORDERS
 * ===========================
 * These require the user to be an admin and the backend to check isAdmin middleware
 */

/**
 * Get all orders (admin)
 * @returns {Promise} Axios response
 */
export const getAllOrders = () => {
    return api.get("/orders");
};

/**
 * Update order status (admin)
 * @param {string} orderId
 * @param {string} status - e.g., 'pending', 'shipped', 'delivered', 'cancelled'
 * @returns {Promise} Axios response
 */
export const updateOrderStatus = (orderId, status) => {
    return api.patch(`/orders/${orderId}/status`, { status });
};
