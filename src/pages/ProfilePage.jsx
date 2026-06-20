import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile, changePassword } from "../api/authApi";
import { getUserOrders } from "../api/order";

const STATUS_STYLES = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
};

export default function ProfilePage({ onNavigate }) {
    const { user, login: authLogin } = useAuth();
    const [activeTab, setActiveTab] = useState("orders"); // orders | profile | password

    // Orders
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    // Profile form
    const [firstName, setFirstName] = useState(user?.first_name || "");
    const [lastName, setLastName] = useState(user?.last_name || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [profileSaving, setProfileSaving] = useState(false);
    const [profileMsg, setProfileMsg] = useState(null);

    // Password form
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [passwordSaving, setPasswordSaving] = useState(false);
    const [passwordMsg, setPasswordMsg] = useState(null);

    useEffect(() => {
        if (!user) {
            onNavigate("login");
            return;
        }
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoadingOrders(true);
            const res = await getUserOrders(user.id);
            setOrders(res.data.data);
        } catch (err) {
            console.error("Error loading orders:", err);
        } finally {
            setLoadingOrders(false);
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setProfileMsg(null);
        setProfileSaving(true);

        try {
            const res = await updateProfile(user.id, {
                firstName,
                lastName,
                phone,
            });

            // Update auth context with new info, keep existing token
            authLogin({ ...user, ...res.data.user }, user.token);
            setProfileMsg({ type: "success", text: "Profile updated successfully" });
        } catch (err) {
            setProfileMsg({ type: "error", text: err.response?.data?.error || "Failed to update profile" });
        } finally {
            setProfileSaving(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordMsg(null);

        if (newPassword !== confirmNewPassword) {
            setPasswordMsg({ type: "error", text: "New passwords don't match" });
            return;
        }
        if (newPassword.length < 6) {
            setPasswordMsg({ type: "error", text: "New password must be at least 6 characters" });
            return;
        }

        setPasswordSaving(true);

        try {
            await changePassword(user.id, {
                currentPassword,
                newPassword,
            });

            setPasswordMsg({ type: "success", text: "Password updated successfully" });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
        } catch (err) {
            setPasswordMsg({ type: "error", text: err.response?.data?.error || "Failed to update password" });
        } finally {
            setPasswordSaving(false);
        }
    };

    if (!user) return null;

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-screen-md mx-auto px-6 py-10">
                <h1 className="text-[22px] font-extrabold text-zinc-900 mb-1">My Account</h1>
                <p className="text-[13px] text-zinc-500 mb-8">{user.email}</p>

                {/* Tabs */}
                <div className="flex gap-0 border-b border-zinc-200 mb-8">
                    {[
                        { key: "orders", label: "Orders" },
                        { key: "profile", label: "Profile" },
                        { key: "password", label: "Password" },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-5 py-3 text-[11px] font-extrabold tracking-[0.1em] uppercase border-0 cursor-pointer transition-all duration-150 border-b-2 -mb-px ${activeTab === tab.key
                                ? "text-zinc-900 border-red-500 bg-transparent"
                                : "text-zinc-400 border-transparent bg-transparent hover:text-zinc-700"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ORDERS TAB */}
                {activeTab === "orders" && (
                    <div className="space-y-4">
                        {loadingOrders ? (
                            <p className="text-[13px] text-zinc-400 text-center py-8">Loading orders...</p>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-[14px] text-zinc-500 mb-4">You haven't placed any orders yet.</p>
                                <button
                                    onClick={() => onNavigate("catalogue")}
                                    className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-[12px] font-extrabold rounded-lg transition-colors border-0 cursor-pointer"
                                >
                                    BROWSE PRODUCTS
                                </button>
                            </div>
                        ) : (
                            orders.map((order) => (
                                <div key={order.id} className="border border-zinc-200 rounded-xl p-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <p className="text-[13px] font-extrabold text-zinc-900">
                                                Order #{order.id.slice(0, 8)}
                                            </p>
                                            <p className="text-[11px] text-zinc-400 mt-0.5">
                                                {new Date(order.created_at).toLocaleDateString("en-GB", {
                                                    day: "numeric", month: "short", year: "numeric"
                                                })}
                                            </p>
                                        </div>
                                        <span className={`text-[10px] font-extrabold tracking-[0.08em] uppercase px-2.5 py-1 rounded-full ${STATUS_STYLES[order.status] || "bg-zinc-100 text-zinc-600"}`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    <div className="space-y-2 mb-3">
                                        {order.items.map((item, i) => (
                                            <div key={i} className="flex items-center justify-between text-[12px]">
                                                <span className="text-zinc-700">
                                                    {item.product_name}
                                                    {item.flavor || item.size_label ? (
                                                        <span className="text-zinc-400"> · {[item.flavor, item.size_label].filter(Boolean).join(" · ")}</span>
                                                    ) : null}
                                                    <span className="text-zinc-400"> ×{item.quantity}</span>
                                                </span>
                                                <span className="text-zinc-700 font-semibold">€{item.item_total}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
                                        <span className="text-[11px] font-extrabold tracking-[0.08em] uppercase text-zinc-500">
                                            Total
                                        </span>
                                        <span className="text-[15px] font-extrabold text-zinc-900">€{order.total}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* PROFILE TAB */}
                {activeTab === "profile" && (
                    <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-md">
                        {profileMsg && (
                            <div className={`p-3 rounded-lg text-[12px] border ${profileMsg.type === "success"
                                ? "bg-green-50 border-green-200 text-green-700"
                                : "bg-red-50 border-red-200 text-red-600"
                                }`}>
                                {profileMsg.text}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[11px] font-extrabold tracking-[0.1em] text-zinc-700 uppercase mb-2">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full px-4 py-3 border border-zinc-300 rounded-lg text-[13px] focus:outline-none focus:border-red-400"
                                    required
                                    minLength={2}
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-extrabold tracking-[0.1em] text-zinc-700 uppercase mb-2">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full px-4 py-3 border border-zinc-300 rounded-lg text-[13px] focus:outline-none focus:border-red-400"
                                    required
                                    minLength={2}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-extrabold tracking-[0.1em] text-zinc-700 uppercase mb-2">
                                Phone
                            </label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-4 py-3 border border-zinc-300 rounded-lg text-[13px] focus:outline-none focus:border-red-400"
                                required
                                minLength={10}
                                maxLength={15}
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-extrabold tracking-[0.1em] text-zinc-700 uppercase mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={user.email}
                                disabled
                                className="w-full px-4 py-3 border border-zinc-200 bg-zinc-50 text-zinc-400 rounded-lg text-[13px] cursor-not-allowed"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={profileSaving}
                            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white text-[12px] font-extrabold tracking-[0.1em] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-0 cursor-pointer"
                        >
                            {profileSaving ? "Saving..." : "SAVE CHANGES"}
                        </button>
                    </form>
                )}

                {/* PASSWORD TAB */}
                {activeTab === "password" && (
                    <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                        {passwordMsg && (
                            <div className={`p-3 rounded-lg text-[12px] border ${passwordMsg.type === "success"
                                ? "bg-green-50 border-green-200 text-green-700"
                                : "bg-red-50 border-red-200 text-red-600"
                                }`}>
                                {passwordMsg.text}
                            </div>
                        )}

                        <div>
                            <label className="block text-[11px] font-extrabold tracking-[0.1em] text-zinc-700 uppercase mb-2">
                                Current Password
                            </label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-zinc-300 rounded-lg text-[13px] focus:outline-none focus:border-red-400"
                                required
                                minLength={6}
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-extrabold tracking-[0.1em] text-zinc-700 uppercase mb-2">
                                New Password
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-zinc-300 rounded-lg text-[13px] focus:outline-none focus:border-red-400"
                                required
                                minLength={6}
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-extrabold tracking-[0.1em] text-zinc-700 uppercase mb-2">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-zinc-300 rounded-lg text-[13px] focus:outline-none focus:border-red-400"
                                required
                                minLength={6}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={passwordSaving}
                            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white text-[12px] font-extrabold tracking-[0.1em] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-0 cursor-pointer"
                        >
                            {passwordSaving ? "Updating..." : "UPDATE PASSWORD"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}