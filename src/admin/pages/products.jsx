import { useState, useEffect } from "react";
import {
    getProducts,
    getInactiveProducts,
    getCategories,
    getSizes,
    createProduct,
    updateProduct,
    deleteProduct,
    reactivateProduct,
    addVariantToProduct,
    deleteVariant,
} from "../../api/products";
import { uploadImage } from "../../api/upload";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showVariantModal, setShowVariantModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [activeTab, setActiveTab] = useState("active"); // "active" or "inactive"
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasMore: false,
    });

    const [productForm, setProductForm] = useState({
        category_id: "",
        name: "",
        description: "",
        brand: "",
        image_url: "",
        is_active: true,
        variants: [],
    });

    const [variantForm, setVariantForm] = useState({
        sku: "",
        flavor: "",
        price: "",
        stock_qty: "",
        unit: "",
        value: "",
    });

    // Load initial data
    useEffect(() => {
        loadInitialData();
    }, []);

    // Load products when filters or tab change
    useEffect(() => {
        loadProducts();
    }, [pagination.page, categoryFilter, activeTab]);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            const [categoriesRes, sizesRes] = await Promise.all([
                getCategories(),
                getSizes(),
            ]);
            setCategories(categoriesRes.data.data || []);
            setSizes(sizesRes.data.data || []);
            await loadProducts();
        } catch (err) {
            console.error("Error loading initial data:", err);
            setError("Failed to load initial data");
        } finally {
            setLoading(false);
        }
    };

    const loadProducts = async () => {
        try {
            setLoading(true);
            const params = {
                page: pagination.page,
                limit: pagination.limit,
            };

            if (categoryFilter !== "all") {
                params.category_id = categoryFilter;
            }

            // Use different API based on active tab
            const response = activeTab === "active" 
                ? await getProducts(params)
                : await getInactiveProducts(params);

            setProducts(response.data.data || []);

            if (response.data.pagination) {
                setPagination((prev) => ({
                    ...prev,
                    ...response.data.pagination,
                }));
            }
        } catch (err) {
            console.error("Error loading products:", err);
            setError("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    // Get the API base URL for images
    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        // If it's already a full URL, return as is
        if (imagePath.startsWith('http')) return imagePath;
        // Otherwise, prepend the API base URL
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        return `${baseURL}${imagePath}`;
    };

    // Handle image file selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError("Please select a valid image file");
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError("Image size must be less than 5MB");
                return;
            }

            // Store the file for later upload
            setSelectedImageFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setError("");
        }
    };

    // Remove selected image
    const removeImage = () => {
        setImagePreview(null);
        setSelectedImageFile(null);
        setProductForm({
            ...productForm,
            image_url: ""
        });
    };

    const addVariantToForm = () => {
        if (!variantForm.sku || !variantForm.price || !variantForm.stock_qty || !variantForm.unit || !variantForm.value) {
            setError("Please fill all required variant fields");
            return;
        }

        setProductForm({
            ...productForm,
            variants: [
                ...productForm.variants,
                { ...variantForm },
            ],
        });

        setVariantForm({
            sku: "",
            flavor: "",
            price: "",
            stock_qty: "",
            unit: "",
            value: "",
        });
        setError("");
    };

    const removeVariant = (index) => {
        setProductForm({
            ...productForm,
            variants: productForm.variants.filter((_, i) => i !== index),
        });
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!productForm.name || !productForm.category_id) {
            setError("Name and category are required");
            return;
        }

        if (productForm.variants.length === 0) {
            setError("Please add at least one variant");
            return;
        }

        try {
            setLoading(true);

            // Upload image first if there's a file selected
            let imageUrl = productForm.image_url;
            if (selectedImageFile) {
                setUploadingImage(true);
                try {
                    imageUrl = await uploadImage(selectedImageFile);
                } catch (uploadErr) {
                    setError("Failed to upload image. Please try again.");
                    setUploadingImage(false);
                    setLoading(false);
                    return;
                } finally {
                    setUploadingImage(false);
                }
            }

            // Create product with uploaded image URL
            const productData = {
                ...productForm,
                image_url: imageUrl
            };

            const response = await createProduct(productData);

            if (response.data) {
                setShowProductModal(false);
                resetProductForm();
                await loadProducts();
                alert("Product created successfully!");
            }
        } catch (err) {
            console.error("Error creating product:", err);
            setError(err.response?.data?.error || "Failed to create product");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        setError("");

        if (!selectedProduct) return;

        try {
            setLoading(true);

            // Upload new image if selected
            let imageUrl = productForm.image_url;
            if (selectedImageFile) {
                setUploadingImage(true);
                try {
                    imageUrl = await uploadImage(selectedImageFile);
                } catch (uploadErr) {
                    setError("Failed to upload image. Please try again.");
                    setUploadingImage(false);
                    setLoading(false);
                    return;
                } finally {
                    setUploadingImage(false);
                }
            }

            const updateData = {
                category_id: productForm.category_id,
                name: productForm.name,
                description: productForm.description,
                brand: productForm.brand,
                image_url: imageUrl,
                is_active: productForm.is_active,
            };

            const response = await updateProduct(selectedProduct.id, updateData);

            if (response.data) {
                setShowUpdateModal(false);
                setSelectedProduct(null);
                resetProductForm();
                await loadProducts();
                alert("Product updated successfully!");
            }
        } catch (err) {
            console.error("Error updating product:", err);
            setError(err.response?.data?.error || "Failed to update product");
        } finally {
            setLoading(false);
        }
    };

    const handleReactivateProduct = async (productId) => {
        if (!confirm("Are you sure you want to reactivate this product?")) return;

        try {
            setLoading(true);
            await reactivateProduct(productId);
            await loadProducts();
            alert("Product reactivated successfully!");
        } catch (err) {
            console.error("Error reactivating product:", err);
            setError(err.response?.data?.error || "Failed to reactivate product");
        } finally {
            setLoading(false);
        }
    };

    const handleAddVariantToProduct = async (e) => {
        e.preventDefault();
        setError("");

        if (!selectedProduct) return;

        if (!variantForm.sku || !variantForm.price || !variantForm.stock_qty || !variantForm.unit || !variantForm.value) {
            setError("Please fill all required fields");
            return;
        }

        try {
            setLoading(true);
            const response = await addVariantToProduct(selectedProduct.id, variantForm);

            if (response.data) {
                setShowVariantModal(false);
                setSelectedProduct(null);
                setVariantForm({
                    sku: "",
                    flavor: "",
                    price: "",
                    stock_qty: "",
                    unit: "",
                    value: "",
                });
                await loadProducts();
                alert("Variant added successfully!");
            }
        } catch (err) {
            console.error("Error adding variant:", err);
            setError(err.response?.data?.error || "Failed to add variant");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteVariant = async (variantId) => {
        if (!confirm("Are you sure you want to delete this variant?")) return;

        try {
            setLoading(true);
            await deleteVariant(variantId);
            await loadProducts();
            alert("Variant deleted successfully!");
        } catch (err) {
            console.error("Error deleting variant:", err);
            setError(err.response?.data?.error || "Failed to delete variant");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (!confirm("Are you sure you want to permanently delete this product? This action cannot be undone.")) return;

        try {
            setLoading(true);
            await deleteProduct(productId);
            await loadProducts();
            alert("Product deleted successfully!");
        } catch (err) {
            console.error("Error deleting product:", err);
            setError(err.response?.data?.error || "Failed to delete product");
        } finally {
            setLoading(false);
        }
    };

    const openUpdateModal = (product) => {
        setSelectedProduct(product);
        setProductForm({
            category_id: product.category_id,
            name: product.name,
            description: product.description || "",
            brand: product.brand || "",
            image_url: product.image_url || "",
            is_active: product.is_active,
            variants: [],
        });
        setImagePreview(product.image_url ? getImageUrl(product.image_url) : null);
        setSelectedImageFile(null);
        setShowUpdateModal(true);
    };

    const resetProductForm = () => {
        setProductForm({
            category_id: "",
            name: "",
            description: "",
            brand: "",
            image_url: "",
            is_active: true,
            variants: [],
        });
        setImagePreview(null);
        setSelectedImageFile(null);
        setError("");
    };

    const getCategoryName = (id) => {
        const cat = categories.find((c) => c.id === id);
        return cat ? cat.name : "N/A";
    };

    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesSearch;
    });

    if (loading && products.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-zinc-500">Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-zinc-900 mb-2">Products</h1>
                    <p className="text-zinc-500">Manage your product catalog</p>
                </div>
                <button
                    onClick={() => setShowProductModal(true)}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                >
                    <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    Add Product
                </button>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                    {error}
                    <button onClick={() => setError("")} className="ml-2 font-bold">×</button>
                </div>
            )}

            {/* Tabs for Active/Inactive */}
            <div className="bg-white rounded-xl border border-zinc-200 mb-6">
                <div className="flex border-b border-zinc-200">
                    <button
                        onClick={() => {
                            setActiveTab("active");
                            setPagination(prev => ({ ...prev, page: 1 }));
                        }}
                        className={`flex-1 px-6 py-4 text-sm font-bold transition-colors ${
                            activeTab === "active"
                                ? "text-red-600 border-b-2 border-red-600 bg-red-50"
                                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                        }`}
                    >
                        Active Products
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab("inactive");
                            setPagination(prev => ({ ...prev, page: 1 }));
                        }}
                        className={`flex-1 px-6 py-4 text-sm font-bold transition-colors ${
                            activeTab === "inactive"
                                ? "text-red-600 border-b-2 border-red-600 bg-red-50"
                                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                        }`}
                    >
                        Inactive Products
                    </button>
                </div>

                {/* Search and Filters */}
                <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg
                                    className="w-5 h-5 text-zinc-400"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-500 text-sm"
                            />
                        </div>

                        <div>
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-500 text-sm"
                            >
                                <option value="all">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-3 text-sm text-zinc-500">
                        Showing {filteredProducts.length} of {pagination.total} products
                    </div>
                </div>
            </div>

            {/* Products List */}
            <div className="space-y-4">
                {filteredProducts.length === 0 ? (
                    <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
                        <div className="text-5xl mb-4">📦</div>
                        <p className="text-lg font-bold text-zinc-900 mb-2">No products found</p>
                        <p className="text-sm text-zinc-500">
                            {searchQuery || categoryFilter !== "all"
                                ? "Try adjusting your filters or search query"
                                : activeTab === "active"
                                ? "Create your first product to get started"
                                : "No inactive products"}
                        </p>
                    </div>
                ) : (
                    filteredProducts.map((product) => (
                        <div key={product.id} className="bg-white rounded-xl border border-zinc-200 p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex gap-4">
                                    {product.image_url && (
                                        <div className="w-20 h-20 rounded-lg border border-zinc-200 overflow-hidden flex-shrink-0">
                                            <img
                                                src={getImageUrl(product.image_url)}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="%23f4f4f5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23a1a1aa" font-size="12">No Image</text></svg>';
                                                }}
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-lg font-bold text-zinc-900">{product.name}</h3>
                                        <p className="text-sm text-zinc-500">
                                            {product.brand && `${product.brand} • `}
                                            {getCategoryName(product.category_id)}
                                        </p>
                                        {product.description && (
                                            <p className="text-xs text-zinc-400 mt-1">{product.description}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {activeTab === "active" ? (
                                        <>
                                            <button
                                                onClick={() => openUpdateModal(product)}
                                                className="px-3 py-2 bg-zinc-600 hover:bg-zinc-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                                            >
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                </svg>
                                                Update
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedProduct(product);
                                                    setShowVariantModal(true);
                                                }}
                                                className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition-colors"
                                            >
                                                + Add Variant
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => handleReactivateProduct(product.id)}
                                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-2"
                                        >
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                                <path d="M9 12l2 2 4-4" />
                                                <circle cx="12" cy="12" r="10" />
                                            </svg>
                                            Reactivate
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Variants - Only show for active products */}
                            {activeTab === "active" && product.variants && product.variants.length > 0 && (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-zinc-50 border-b border-zinc-200">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-extrabold text-zinc-700 uppercase">
                                                    SKU
                                                </th>
                                                <th className="px-4 py-2 text-left text-xs font-extrabold text-zinc-700 uppercase">
                                                    Flavor
                                                </th>
                                                <th className="px-4 py-2 text-left text-xs font-extrabold text-zinc-700 uppercase">
                                                    Size
                                                </th>
                                                <th className="px-4 py-2 text-left text-xs font-extrabold text-zinc-700 uppercase">
                                                    Price
                                                </th>
                                                <th className="px-4 py-2 text-left text-xs font-extrabold text-zinc-700 uppercase">
                                                    Stock
                                                </th>
                                                <th className="px-4 py-2 text-left text-xs font-extrabold text-zinc-700 uppercase">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-100">
                                            {product.variants.map((variant) => (
                                                <tr key={variant.id} className="hover:bg-zinc-50">
                                                    <td className="px-4 py-3 text-sm font-semibold text-zinc-900">
                                                        {variant.sku}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-zinc-600">
                                                        {variant.flavor || "-"}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-zinc-600">
                                                        {variant.size?.label || "-"}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-zinc-900">
                                                        €{Number(variant.price || 0).toFixed(2)}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-zinc-600">
                                                        {variant.stock_qty} units
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <button
                                                            onClick={() => handleDeleteVariant(variant.id)}
                                                            className="text-zinc-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <svg
                                                                className="w-5 h-5"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth={2}
                                                            >
                                                                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                    <button
                        onClick={() => setPagination((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                        disabled={pagination.page === 1}
                        className="px-4 py-2 border border-zinc-300 rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-zinc-600">
                        Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                        onClick={() => setPagination((prev) => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
                        disabled={!pagination.hasMore}
                        className="px-4 py-2 border border-zinc-300 rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Add Product Modal */}
            {showProductModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[85vh] flex flex-col">
                        <div className="flex items-center justify-between p-5 border-b border-zinc-200">
                            <h2 className="text-lg font-extrabold text-zinc-900">Add New Product</h2>
                            <button
                                onClick={() => {
                                    setShowProductModal(false);
                                    resetProductForm();
                                }}
                                className="text-zinc-400 hover:text-zinc-900"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                    <path d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="overflow-y-auto flex-1 p-5">
                            {error && (
                                <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
                                    {error}
                                </div>
                            )}

                            <form id="product-form" onSubmit={handleProductSubmit} className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-700 mb-1">
                                            Product Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={productForm.name}
                                            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                            className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-500 text-sm"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-zinc-700 mb-1">Brand</label>
                                        <input
                                            type="text"
                                            value={productForm.brand}
                                            onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                                            className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-500 text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-zinc-700 mb-1">Category *</label>
                                    <select
                                        value={productForm.category_id}
                                        onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                                        className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-500 text-sm"
                                        required
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-zinc-700 mb-1">Description</label>
                                    <textarea
                                        value={productForm.description}
                                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                        className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-500 text-sm"
                                        rows={2}
                                    />
                                </div>

                                {/* Image Upload Section */}
                                <div>
                                    <label className="block text-xs font-bold text-zinc-700 mb-1">Product Image</label>

                                    {imagePreview ? (
                                        <div className="relative">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-48 object-cover rounded-lg border border-zinc-300"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                                            >
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                                    <path d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-zinc-300 rounded-lg p-6 text-center hover:border-red-500 transition-colors">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                                id="product-image"
                                            />
                                            <label
                                                htmlFor="product-image"
                                                className="cursor-pointer flex flex-col items-center"
                                            >
                                                <svg className="w-12 h-12 text-zinc-400 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                    <polyline points="17 8 12 3 7 8" />
                                                    <line x1="12" y1="3" x2="12" y2="15" />
                                                </svg>
                                                <span className="text-sm text-zinc-600 font-semibold">Click to upload image</span>
                                                <span className="text-xs text-zinc-400 mt-1">PNG, JPG, GIF up to 5MB</span>
                                            </label>
                                        </div>
                                    )}
                                </div>

                                <div className="border-t pt-3">
                                    <h3 className="text-sm font-bold text-zinc-900 mb-2">Product Variants *</h3>

                                    <div className="grid grid-cols-2 gap-2 mb-2">
                                        <div>
                                            <label className="block text-xs font-bold text-zinc-700 mb-1">SKU *</label>
                                            <input
                                                type="text"
                                                value={variantForm.sku}
                                                onChange={(e) => setVariantForm({ ...variantForm, sku: e.target.value })}
                                                className="w-full px-2 py-1.5 border border-zinc-300 rounded text-xs focus:outline-none focus:border-red-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-zinc-700 mb-1">Flavor</label>
                                            <input
                                                type="text"
                                                value={variantForm.flavor}
                                                onChange={(e) => setVariantForm({ ...variantForm, flavor: e.target.value })}
                                                className="w-full px-2 py-1.5 border border-zinc-300 rounded text-xs focus:outline-none focus:border-red-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-zinc-700 mb-1">Unit *</label>
                                            <select
                                                value={variantForm.unit}
                                                onChange={(e) => setVariantForm({ ...variantForm, unit: e.target.value })}
                                                className="w-full px-2 py-1.5 border border-zinc-300 rounded text-xs focus:outline-none focus:border-red-500"
                                            >
                                                <option value="">Select unit</option>
                                                <option value="kg">kg</option>
                                                <option value="g">g</option>
                                                <option value="ml">ml</option>
                                                <option value="l">l</option>
                                                <option value="servings">servings</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-zinc-700 mb-1">Value *</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={variantForm.value}
                                                onChange={(e) => setVariantForm({ ...variantForm, value: e.target.value })}
                                                className="w-full px-2 py-1.5 border border-zinc-300 rounded text-xs focus:outline-none focus:border-red-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-zinc-700 mb-1">Price *</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={variantForm.price}
                                                onChange={(e) => setVariantForm({ ...variantForm, price: e.target.value })}
                                                className="w-full px-2 py-1.5 border border-zinc-300 rounded text-xs focus:outline-none focus:border-red-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-zinc-700 mb-1">Stock Qty *</label>
                                            <input
                                                type="number"
                                                value={variantForm.stock_qty}
                                                onChange={(e) => setVariantForm({ ...variantForm, stock_qty: e.target.value })}
                                                className="w-full px-2 py-1.5 border border-zinc-300 rounded text-xs focus:outline-none focus:border-red-500"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={addVariantToForm}
                                        className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition-colors"
                                    >
                                        + Add Variant
                                    </button>

                                    {productForm.variants.length > 0 && (
                                        <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                                            {productForm.variants.map((v, i) => (
                                                <div key={i} className="flex items-center justify-between bg-zinc-50 p-2 rounded-lg">
                                                    <span className="text-xs text-zinc-900">
                                                        {v.sku} • {v.flavor || "No flavor"} • {v.value}{v.unit} • €{v.price} • {v.stock_qty} units
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeVariant(i)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                                            <path d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>

                        <div className="flex gap-2 p-5 border-t border-zinc-200">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowProductModal(false);
                                    resetProductForm();
                                }}
                                className="flex-1 px-3 py-2 border border-zinc-300 text-zinc-700 rounded-lg text-sm font-semibold hover:bg-zinc-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="product-form"
                                disabled={loading || uploadingImage}
                                className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold disabled:opacity-50"
                            >
                                {uploadingImage ? "Uploading image..." : loading ? "Creating..." : "Create Product"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Update Product Modal - Same as before but with getImageUrl */}
            {showUpdateModal && selectedProduct && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[85vh] flex flex-col">
                        <div className="flex items-center justify-between p-5 border-b border-zinc-200">
                            <h2 className="text-lg font-extrabold text-zinc-900">Update Product</h2>
                            <button
                                onClick={() => {
                                    setShowUpdateModal(false);
                                    setSelectedProduct(null);
                                    resetProductForm();
                                }}
                                className="text-zinc-400 hover:text-zinc-900"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                    <path d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="overflow-y-auto flex-1 p-5">
                            <form id="update-product-form" onSubmit={handleUpdateProduct} className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-700 mb-1">Product Name *</label>
                                        <input
                                            type="text"
                                            value={productForm.name}
                                            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                            className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-500 text-sm"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-700 mb-1">Brand</label>
                                        <input
                                            type="text"
                                            value={productForm.brand}
                                            onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                                            className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-500 text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-zinc-700 mb-1">Category *</label>
                                    <select
                                        value={productForm.category_id}
                                        onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                                        className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-500 text-sm"
                                        required
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-zinc-700 mb-1">Description</label>
                                    <textarea
                                        value={productForm.description}
                                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                        className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-500 text-sm"
                                        rows={2}
                                    />
                                </div>

                                {/* Image Upload Section for Update */}
                                <div>
                                    <label className="block text-xs font-bold text-zinc-700 mb-1">Product Image</label>

                                    {imagePreview ? (
                                        <div className="relative">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-48 object-cover rounded-lg border border-zinc-300"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                                            >
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                                    <path d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-zinc-300 rounded-lg p-6 text-center hover:border-red-500 transition-colors">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                                id="update-product-image"
                                            />
                                            <label
                                                htmlFor="update-product-image"
                                                className="cursor-pointer flex flex-col items-center"
                                            >
                                                <svg className="w-12 h-12 text-zinc-400 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                    <polyline points="17 8 12 3 7 8" />
                                                    <line x1="12" y1="3" x2="12" y2="15" />
                                                </svg>
                                                <span className="text-sm text-zinc-600 font-semibold">Click to upload new image</span>
                                                <span className="text-xs text-zinc-400 mt-1">PNG, JPG, GIF up to 5MB</span>
                                            </label>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-zinc-50 rounded-lg p-4 border border-zinc-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="block text-xs font-bold text-zinc-700 mb-1">Product Status</label>
                                            <p className="text-xs text-zinc-500">
                                                {productForm.is_active ? 'Product is currently active' : 'Product is currently inactive'}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setProductForm({ ...productForm, is_active: !productForm.is_active })}
                                            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${productForm.is_active ? 'bg-green-500' : 'bg-zinc-300'
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${productForm.is_active ? 'translate-x-7' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="flex gap-2 p-5 border-t border-zinc-200">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowUpdateModal(false);
                                    setSelectedProduct(null);
                                    resetProductForm();
                                }}
                                className="flex-1 px-3 py-2 border border-zinc-300 text-zinc-700 rounded-lg text-sm font-semibold hover:bg-zinc-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="update-product-form"
                                disabled={loading || uploadingImage}
                                className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold disabled:opacity-50"
                            >
                                {uploadingImage ? "Uploading image..." : loading ? "Updating..." : "Update Product"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Variant Modal */}
            {showVariantModal && selectedProduct && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-extrabold text-zinc-900">
                                Add Variant to {selectedProduct.name}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowVariantModal(false);
                                    setSelectedProduct(null);
                                    setError("");
                                }}
                                className="text-zinc-400 hover:text-zinc-900"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                    <path d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleAddVariantToProduct} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-zinc-700 mb-2">SKU *</label>
                                <input
                                    type="text"
                                    value={variantForm.sku}
                                    onChange={(e) => setVariantForm({ ...variantForm, sku: e.target.value })}
                                    className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-zinc-700 mb-2">Flavor</label>
                                <input
                                    type="text"
                                    value={variantForm.flavor}
                                    onChange={(e) => setVariantForm({ ...variantForm, flavor: e.target.value })}
                                    className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-zinc-700 mb-2">Unit *</label>
                                    <select
                                        value={variantForm.unit}
                                        onChange={(e) => setVariantForm({ ...variantForm, unit: e.target.value })}
                                        className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-500"
                                        required
                                    >
                                        <option value="">Select unit</option>
                                        <option value="kg">kg</option>
                                        <option value="g">g</option>
                                        <option value="ml">ml</option>
                                        <option value="l">l</option>
                                        <option value="servings">servings</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-zinc-700 mb-2">Value *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={variantForm.value}
                                        onChange={(e) => setVariantForm({ ...variantForm, value: e.target.value })}
                                        className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-zinc-700 mb-2">Price *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={variantForm.price}
                                        onChange={(e) => setVariantForm({ ...variantForm, price: e.target.value })}
                                        className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-zinc-700 mb-2">Stock Qty *</label>
                                    <input
                                        type="number"
                                        value={variantForm.stock_qty}
                                        onChange={(e) => setVariantForm({ ...variantForm, stock_qty: e.target.value })}
                                        className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowVariantModal(false);
                                        setSelectedProduct(null);
                                        setError("");
                                    }}
                                    className="flex-1 px-4 py-2 border border-zinc-300 text-zinc-700 rounded-lg font-semibold hover:bg-zinc-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold disabled:opacity-50"
                                >
                                    {loading ? "Adding..." : "Add Variant"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}