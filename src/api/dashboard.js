import api from "./axios";

export const getDashboardStats = async () => {
    try {
        const response = await api.get("/orders/dashboard");
        return response.data;
    } catch (error) {
        console.error("Dashboard stats error:", error);
        throw error;
    }
};

export const getRecentOrders = async () => {
    try {
        const response = await api.get("/orders/recent");
        return response.data;
    } catch (error) {
        console.error("Recent orders error:", error);
        throw error;
    }
};

export const getSalesAnalytics = async () => {
    try {
        const response = await api.get("/orders/sales");
        return response.data;
    } catch (error) {
        console.error("Sales analytics error:", error);
        throw error;
    }
};

export const getAllOrders = async () => {
    try {
        const response = await api.get("/order/");
        return response;
    } catch (error) {
        console.error("Get all orders error:", error);
        throw error;
    }
};

export const updateOrderStatus = async (orderId, status) => {
    try {
        const response = await api.patch(`/orders/${orderId}/status`, { status });
        return response;
    } catch (error) {
        console.error("Update order status error:", error);
        throw error;
    }
};
