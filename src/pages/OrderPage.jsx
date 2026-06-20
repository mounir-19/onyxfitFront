import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { createOrder, createPaymentIntent } from "../api/order";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const cardElementOptions = {
    style: {
        base: {
            fontSize: "14px",
            color: "#18181b",
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
            "::placeholder": { color: "#a1a1aa" },
        },
        invalid: { color: "#ef4444" },
    },
};

function PaymentForm({ orderId, total, onSuccess }) {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setProcessing(true);
        setError(null);

        try {
            const { data } = await createPaymentIntent(orderId);
            const { client_secret } = data;

            const result = await stripe.confirmCardPayment(client_secret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                },
            });

            if (result.error) {
                setError(result.error.message);
                setProcessing(false);
                return;
            }

            if (result.paymentIntent.status === "succeeded") {
                onSuccess();
            }
        } catch (err) {
            console.error("Payment error:", err);
            setError(err.response?.data?.error || "Payment failed. Please try again.");
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-[12px] text-red-600">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-[11px] font-extrabold tracking-[0.1em] text-zinc-700 uppercase mb-2">
                    Card Number
                </label>
                <div className="border border-zinc-300 rounded-lg px-4 py-3.5 focus-within:border-red-400">
                    <CardNumberElement options={cardElementOptions} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-[11px] font-extrabold tracking-[0.1em] text-zinc-700 uppercase mb-2">
                        Expiry Date
                    </label>
                    <div className="border border-zinc-300 rounded-lg px-4 py-3.5 focus-within:border-red-400">
                        <CardExpiryElement options={cardElementOptions} />
                    </div>
                </div>

                <div>
                    <label className="block text-[11px] font-extrabold tracking-[0.1em] text-zinc-700 uppercase mb-2">
                        CVC
                    </label>
                    <div className="border border-zinc-300 rounded-lg px-4 py-3.5 focus-within:border-red-400">
                        <CardCvcElement options={cardElementOptions} />
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={!stripe || processing}
                className="w-full h-12 bg-red-500 hover:bg-red-600 text-white font-extrabold text-[12px] tracking-[0.1em] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-0 cursor-pointer"
            >
                {processing ? "Processing..." : `PAY €${total}`}
            </button>

            <p className="text-[11px] text-zinc-400 text-center">
                Test card: 4242 4242 4242 4242, any future date, any CVC
            </p>
        </form>
    );
}

export default function OrderPage({ orderData, onNavigate, userId, user }) {
    const [step, setStep] = useState("address"); // address | payment | success
    const [shippingAddress, setShippingAddress] = useState("");
    const [fullName, setFullName] = useState(
        user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() : ""
    );
    const [phone, setPhone] = useState(user?.phone || "");
    const [email, setEmail] = useState(user?.email || "");
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState(null);
    const [order, setOrder] = useState(null);

    const items = orderData?.items || [];
    const shippingCost = 0; // TODO: set shipping cost logic if needed

    const subtotal = items.reduce(
        (sum, item) => sum + Number(item.unit_price) * item.quantity,
        0
    );
    const total = subtotal + shippingCost;

    useEffect(() => {
        if (!items.length) {
            onNavigate("home");
        }
    }, []);

    const handleCreateOrder = async (e) => {
        e.preventDefault();

        if (!shippingAddress.trim()) {
            setError("Please enter a shipping address");
            return;
        }

        if (!userId && !email.trim()) {
            setError("Please enter an email address so we can contact you about your order");
            return;
        }

        setCreating(true);
        setError(null);

        try {
            const response = await createOrder({
                user_id: userId || null,
                items: items.map((item) => ({
                    variant_id: item.variant_id,
                    quantity: item.quantity,
                })),
                shipping_address: shippingAddress,
                shipping_cost: shippingCost,
                contact_name: fullName,
                contact_phone: phone,
                contact_email: userId ? (user?.email || "") : email,
            });

            setOrder({
                id: response.data.order_id,
                total: response.data.total,
            });
            setStep("payment");
        } catch (err) {
            console.error("Order creation error:", err);
            setError(err.response?.data?.error || "Failed to create order");
        } finally {
            setCreating(false);
        }
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith("http")) return imagePath;
        const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
        return `${baseURL}${imagePath}`;
    };

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-screen-md mx-auto px-6 py-10">
                <h1 className="text-[22px] font-extrabold text-zinc-900 mb-8">
                    {step === "success" ? "Order Confirmed" : "Checkout"}
                </h1>

                {step === "success" ? (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                <path d="M20 6 9 17l-5-5" />
                            </svg>
                        </div>
                        <p className="text-[18px] font-extrabold text-zinc-900 mb-2">
                            Payment Successful!
                        </p>
                        <p className="text-[13px] text-zinc-500 mb-6">
                            Order #{order?.id?.slice(0, 8)} has been placed.
                        </p>
                        <button
                            onClick={() => onNavigate("home")}
                            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white text-[12px] font-extrabold rounded-lg transition-colors border-0 cursor-pointer"
                        >
                            CONTINUE SHOPPING
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* LEFT — Form / Payment */}
                        <div>
                            {step === "address" && (
                                <form onSubmit={handleCreateOrder} className="space-y-4">
                                    {error && (
                                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-[12px] text-red-600">
                                            {error}
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-[11px] font-extrabold tracking-[0.1em] text-zinc-700 uppercase mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full px-4 py-3 border border-zinc-300 rounded-lg text-[13px] focus:outline-none focus:border-red-400"
                                            required
                                        />
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
                                        />
                                    </div>

                                    {!userId && (
                                        <div>
                                            <label className="block text-[11px] font-extrabold tracking-[0.1em] text-zinc-700 uppercase mb-2">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="your@email.com"
                                                className="w-full px-4 py-3 border border-zinc-300 rounded-lg text-[13px] focus:outline-none focus:border-red-400"
                                                required
                                            />
                                            <p className="text-[11px] text-zinc-400 mt-1.5">
                                                We'll use this to send your order confirmation.
                                            </p>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-[11px] font-extrabold tracking-[0.1em] text-zinc-700 uppercase mb-2">
                                            Shipping Address
                                        </label>
                                        <textarea
                                            value={shippingAddress}
                                            onChange={(e) => setShippingAddress(e.target.value)}
                                            placeholder="Street, city, wilaya, postal code..."
                                            rows={4}
                                            className="w-full px-4 py-3 border border-zinc-300 rounded-lg text-[13px] resize-none focus:outline-none focus:border-red-400"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={creating}
                                        className="w-full h-12 bg-red-500 hover:bg-red-600 text-white font-extrabold text-[12px] tracking-[0.1em] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-0 cursor-pointer"
                                    >
                                        {creating ? "Creating order..." : "CONTINUE TO PAYMENT"}
                                    </button>
                                </form>
                            )}

                            {step === "payment" && order && (
                                <Elements stripe={stripePromise}>
                                    <PaymentForm
                                        orderId={order.id}
                                        total={order.total}
                                        onSuccess={() => setStep("success")}
                                    />
                                </Elements>
                            )}
                        </div>

                        {/* RIGHT — Order Summary */}
                        <div>
                            <div className="bg-zinc-50 rounded-xl p-5">
                                <p className="text-[11px] font-extrabold tracking-[0.1em] text-zinc-700 uppercase mb-4">
                                    Order Summary
                                </p>

                                {items.map((item, i) => (
                                    <div key={i} className="flex gap-3 mb-4 pb-4 border-b border-zinc-200 last:border-0 last:mb-0 last:pb-0">
                                        <div className="w-14 h-14 bg-white rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                                            {item.image_url && (
                                                <img
                                                    src={getImageUrl(item.image_url)}
                                                    alt={item.product_name}
                                                    className="w-full h-full object-contain"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[13px] font-bold text-zinc-900 leading-tight">
                                                {item.product_name}
                                            </p>
                                            <p className="text-[11px] text-zinc-500 mt-0.5">
                                                {[item.flavor, item.size_label].filter(Boolean).join(" · ")}
                                            </p>
                                            <p className="text-[11px] text-zinc-500 mt-0.5">
                                                Qty: {item.quantity}
                                            </p>
                                        </div>
                                        <p className="text-[13px] font-extrabold text-zinc-900">
                                            €{(Number(item.unit_price) * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}

                                <div className="border-t border-zinc-200 mt-4 pt-4 space-y-2">
                                    <div className="flex justify-between text-[12px] text-zinc-500">
                                        <span>Subtotal</span>
                                        <span>€{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-[12px] text-zinc-500">
                                        <span>Shipping</span>
                                        <span>{shippingCost === 0 ? "Free" : `€${shippingCost.toFixed(2)}`}</span>
                                    </div>
                                    <div className="flex justify-between text-[16px] font-extrabold text-zinc-900 pt-2 border-t border-zinc-200">
                                        <span>Total</span>
                                        <span>€{total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}