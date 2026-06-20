import api from "./axios";
import { uploadImage } from "./upload";

export const getCategories = async (params = {}) => {
    try {
        const response = await api.get("/store/categories");
        return response.data;
    } catch (error) {
        console.error("Get categories error:", error);
        throw error;
    }
};

// Create category (unchanged - admin only)
export const createCategory = async (categoryData) => {
    try {
        let image_url = null;

        // Upload image FIRST if provided
        if (categoryData.image instanceof File && categoryData.image.size > 0) {
            image_url = await uploadImage(categoryData.image);
            console.log("✅ Image uploaded:", image_url);
        }

        const payload = {
            name: categoryData.name.trim(),
            parent_id: categoryData.parent_id ? parseInt(categoryData.parent_id) : null,
            image_url: image_url
        };

        console.log("📤 Sending payload:", payload);

        const response = await api.post("/admin/categories", payload);
        console.log("✅ Category created:", response.data);

        return response.data;
    } catch (error) {
        console.error("Create category error:", error);
        throw error;
    }
};
export const deleteCategory = (id) => {
    return api.delete(`/admin/categories/${id}`);
};
