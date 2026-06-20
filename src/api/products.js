import api from "./axios";

// ========================
// PRODUCTS
// ========================

// Get all products with pagination and filters
export const getProducts = (params = {}) => {
  return api.get("/store/products", { params });
};

// Get all inactive products (admin only)
export const getInactiveProducts = (params = {}) => {
  return api.get("/admin/products/inactive", { params });
};

// Get single product by ID
export const getProductById = (id) => {
  return api.get(`/store/products/${id}`);
};

// Create new product with variants
export const createProduct = (data) => {
  return api.post("/admin/products", data);
};

// Update product
export const updateProduct = (id, data) => {
  return api.patch(`/admin/products/${id}`, data);
};

// Reactivate product
export const reactivateProduct = (id) => {
  return api.patch(`/admin/products/${id}`, { is_active: true });
};

// Deactivate product (soft delete)
export const deactivateProduct = (id) => {
  return api.patch(`/admin/products/${id}`, { is_active: false });
};

// Delete product permanently
export const deleteProduct = (id) => {
  return api.delete(`/admin/products/${id}`);
};

// ========================
// CATEGORIES
// ========================

// Get all categories
export const getCategories = () => {
  return api.get("/store/categories");
};

// Create category (admin)
export const createCategory = (data) => {
  return api.post("/admin/categories", data);
};

// ========================
// SIZES
// ========================

// Get all sizes
export const getSizes = () => {
  return api.get("/store/sizes");
};

// ========================
// VARIANTS
// ========================

// Get variants for a specific product
export const getProductVariants = (productId) => {
  return api.get(`/store/products/${productId}/variants`);
};

// Add variant to existing product
export const addVariantToProduct = (productId, data) => {
  return api.post(`/admin/products/${productId}/variants`, data);
};

// Update variant
export const updateVariant = (variantId, data) => {
  return api.patch(`/admin/variants/${variantId}`, data);
};

// Delete variant (soft delete)
export const deleteVariant = (variantId) => {
  return api.delete(`/admin/variants/${variantId}`);
};
export const getProductReviews = (productId) =>
  api.get(`/store/products/${productId}/reviews`);

export const addProductReview = (productId, data) =>
  api.post(`/store/products/${productId}/reviews`, data);