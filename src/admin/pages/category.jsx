import { useState, useEffect, useRef } from "react";
import { getCategories, createCategory, deleteCategory } from "../../api/category";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    parent_id: "",
    image: null,
    preview: null
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    fetchCategories();
    return () => { hasFetched.current = false; };
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getCategories();
      const sortedCategories = (data.data || data || []).sort((a, b) => a.id - b.id);
      setCategories(sortedCategories);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err.response?.data?.error || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      setFormData({
        ...formData,
        image: file,
        preview: URL.createObjectURL(file)
      });
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setSaving(true);
      setError("");

      await createCategory(formData);
      await fetchCategories();

      setFormData({ name: "", parent_id: "", image: null, preview: null });
      setShowModal(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Error creating category:", err);
      setError(err.response?.data?.error || "Failed to create category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete category "${name}"? Products in this category will become uncategorized.`)) {
      return;
    }

    try {
      await deleteCategory(id);
      await fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
      setError(err.response?.data?.error || "Failed to delete category");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const topLevelCategories = categories.filter((c) => !c.parent_id);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-500">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 mb-2">
            Categories ({categories.length})
          </h1>
          <p className="text-zinc-500">Manage product categories</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
          disabled={saving}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Category
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex justify-between items-center">
          {error}
          <button onClick={() => setError("")} className="font-bold ml-2">×</button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        {categories.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-5xl mb-4">📁</div>
            <p className="text-lg font-bold text-zinc-900 mb-2">No categories yet</p>
            <p className="text-zinc-500 mb-6">Click "Add Category" to get started</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Create First Category
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-extrabold text-zinc-700 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-extrabold text-zinc-700 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-4 text-left text-xs font-extrabold text-zinc-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-extrabold text-zinc-700 uppercase tracking-wider">
                  Parent
                </th>
                <th className="px-6 py-4 text-left text-xs font-extrabold text-zinc-700 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-4 text-left text-xs font-extrabold text-zinc-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {categories.map((category) => {
                const parent = categories.find((c) => c.id === category.parent_id);
                return (
                  <tr key={category.id} className="hover:bg-zinc-50">
                    <td className="px-6 py-4 text-sm font-semibold">{category.id}</td>
                    <td className="px-6 py-4">
                      {category.image_url ? (
                        <img
                          src={`http://localhost:5000${category.image_url}`}
                          alt={category.name}
                          className="w-10 h-10 rounded-lg object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center text-xs text-zinc-500">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold">{category.name}</td>
                    <td className="px-6 py-4 text-sm text-zinc-500">
                      {parent ? (
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                          {parent.name}
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          Root
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500">
                      {formatDate(category.created_at)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleDelete(category.id, category.name)}
                        className="text-red-500 hover:text-red-700 font-semibold text-xs px-3 py-1.5 border border-red-200 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-zinc-900">Add New Category</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setError("");
                  setFormData({ name: "", parent_id: "", image: null, preview: null });
                }}
                className="text-zinc-400 hover:text-zinc-900"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g. Protein, Pre-Workout"
                  required
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-2">
                  Category Image
                </label>
                <div className="border-2 border-dashed border-zinc-200 rounded-lg p-4 hover:border-zinc-300 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={saving}
                  />
                  {formData.preview ? (
                    <div className="text-center">
                      <img
                        src={formData.preview}
                        alt="Preview"
                        className="w-24 h-24 mx-auto rounded-lg object-cover mb-2 shadow-md"
                      />
                      <p className="text-xs text-zinc-500 truncate max-w-[200px]">
                        {formData.image?.name}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, image: null, preview: null });
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="text-xs text-red-500 hover:text-red-600 mt-1 font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div
                      className="flex flex-col items-center justify-center cursor-pointer py-8 hover:bg-zinc-50 rounded-lg transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="w-12 h-12 bg-zinc-200 rounded-lg flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-zinc-500" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <p className="text-sm font-semibold text-zinc-700 mb-1">Upload Image</p>
                      <p className="text-xs text-zinc-500">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-2">
                  Parent Category (Optional)
                </label>
                <select
                  value={formData.parent_id}
                  onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                  className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={saving}
                >
                  <option value="">— Root Level —</option>
                  {topLevelCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setError("");
                    setFormData({ name: "", parent_id: "", image: null, preview: null });
                  }}
                  className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-4 py-2 rounded-lg transition-colors"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !formData.name.trim()}
                  className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    "Create Category"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}