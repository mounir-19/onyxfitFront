import { useState, useEffect, useRef } from "react";
import { getAdmins, createAdmin, deleteAdmin, updateAdmin } from "../../api/admin";

export default function AdminsPage() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: ""
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;
        fetchAdmins();
        return () => { hasFetched.current = false; };
    }, []);

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await getAdmins();
            setAdmins(response.data.data || response.data || []);
        } catch (err) {
            console.error("Error fetching admins:", err);
            setError(err.response?.data?.error || "Failed to load admins");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.firstName || (!formData.password && !editingId)) return;

        try {
            setSaving(true);
            setError("");

            const payload = {
                email: formData.email.trim(),
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                phone: formData.phone.trim()
            };

            if (editingId) {
                await updateAdmin(editingId, payload);
            } else {
                payload.password = formData.password;
                await createAdmin(payload);
            }

            await fetchAdmins();

            setFormData({ email: "", password: "", firstName: "", lastName: "", phone: "" });
            setEditingId(null);
            setShowModal(false);

        } catch (err) {
            console.error("Error saving admin:", err);
            setError(err.response?.data?.error || "Failed to save admin");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (admin) => {
        setEditingId(admin.id);
        setFormData({
            email: admin.email,
            password: "",
            firstName: admin.first_name,
            lastName: admin.last_name,
            phone: admin.phone
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (deleteConfirmId === id) {
            try {
                await deleteAdmin(id);
                await fetchAdmins();
                setDeleteConfirmId(null);
            } catch (err) {
                console.error("Error deleting admin:", err);
                setError(err.response?.data?.error || "Failed to delete admin");
            }
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-zinc-500">Loading admins...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-zinc-900 mb-2">
                        Admins ({admins.length})
                    </h1>
                    <p className="text-zinc-500">Manage administrator accounts</p>
                </div>

                <button
                    onClick={() => {
                        setEditingId(null);
                        setFormData({ email: "", password: "", firstName: "", lastName: "", phone: "" });
                        setShowModal(true);
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                    disabled={saving}
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    Create Admin
                </button>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex justify-between items-center">
                    {error}
                    <button onClick={() => setError("")} className="font-bold ml-2">×</button>
                </div>
            )}

            <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
                {admins.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="text-5xl mb-4">👨‍💼</div>
                        <p className="text-lg font-bold text-zinc-900 mb-2">No admins yet</p>
                        <p className="text-zinc-500 mb-6">Create your first admin account</p>
                        <button
                            onClick={() => {
                                setEditingId(null);
                                setFormData({ email: "", password: "", firstName: "", lastName: "", phone: "" });
                                setShowModal(true);
                            }}
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold"
                        >
                            Create First Admin
                        </button>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-zinc-50 border-b border-zinc-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-extrabold text-zinc-700 uppercase tracking-wider">
                                    Admin
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-extrabold text-zinc-700 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-extrabold text-zinc-700 uppercase tracking-wider">
                                    Phone
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-extrabold text-zinc-700 uppercase tracking-wider">
                                    Created
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-extrabold text-zinc-700 uppercase tracking-wider w-32">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {admins.map((admin) => (
                                <tr key={admin.id} className="hover:bg-zinc-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                                                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-zinc-900">
                                                    {admin.first_name} {admin.last_name}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-zinc-600">{admin.email}</td>
                                    <td className="px-6 py-4 text-sm text-zinc-500">{admin.phone}</td>
                                    <td className="px-6 py-4 text-sm text-zinc-500">
                                        {formatDate(admin.created_at)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(admin)}
                                                title="Edit Admin"
                                                className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600 hover:text-blue-700"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirmId(admin.id)}
                                                title="Delete Admin"
                                                className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600 hover:text-red-700"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Delete Confirmation */}
            {deleteConfirmId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-zinc-900 mb-2">Delete Admin?</h3>
                            <p className="text-zinc-500 mb-6">
                                This action cannot be undone. This admin account will be permanently deleted.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-4 py-2 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirmId)}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                            >
                                Delete Admin
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create/Edit Admin Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-zinc-900">
                                {editingId ? "Edit Admin" : "Create New Admin"}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setEditingId(null);
                                    setError("");
                                    setFormData({ email: "", password: "", firstName: "", lastName: "", phone: "" });
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
                                <label className="block text-sm font-semibold text-zinc-700 mb-2">First Name *</label>
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder="John"
                                    required
                                    disabled={saving}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-zinc-700 mb-2">Last Name</label>
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder="Doe"
                                    disabled={saving}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-zinc-700 mb-2">Email *</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder="admin@example.com"
                                    required
                                    disabled={saving}
                                />
                            </div>

                            {!editingId && (
                                <div>
                                    <label className="block text-sm font-semibold text-zinc-700 mb-2">Password *</label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="••••••••"
                                        required
                                        disabled={saving}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-zinc-700 mb-2">Phone</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder="+1 555 123 4567"
                                    disabled={saving}
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingId(null);
                                        setError("");
                                        setFormData({ email: "", password: "", firstName: "", lastName: "", phone: "" });
                                    }}
                                    className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-4 py-2 rounded-lg transition-colors"
                                    disabled={saving}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving || !formData.email || !formData.firstName || (!formData.password && !editingId)}
                                    className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                                >
                                    {saving ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            {editingId ? "Updating..." : "Creating..."}
                                        </>
                                    ) : (
                                        editingId ? "Update Admin" : "Create Admin"
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
