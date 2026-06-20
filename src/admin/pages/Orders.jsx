import { useState, useEffect } from "react";
import { getAllOrders, updateOrderStatus } from "../../api/order.js";

const VALID_STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getAllOrders();
      setOrders(response.data.data || []);
    } catch (err) {
      console.error("Orders error:", err);
      setError(err.response?.data?.error || "Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshOrders = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
    confirmed: "bg-blue-100 text-blue-700 border-blue-300",
    shipped: "bg-purple-100 text-purple-700 border-purple-300",
    delivered: "bg-green-100 text-green-700 border-green-300",
    cancelled: "bg-red-100 text-red-700 border-red-300",
  };

  const handleStatusUpdate = async () => {
    if (!newStatus || !selectedOrder || newStatus === selectedOrder.status) return;

    try {
      setError("");
      await updateOrderStatus(selectedOrder.id, newStatus);
      setOrders(prev =>
        prev.map(order =>
          order.id === selectedOrder.id
            ? { ...order, status: newStatus }
            : order
        )
      );
      setShowStatusModal(false);
      setSelectedOrder(null);
      setNewStatus("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update status");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredOrders = statusFilter
    ? orders.filter((o) => o.status === statusFilter)
    : orders;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-1">All Orders</h1>
          <p className="text-zinc-500 text-sm">Manage all customer orders ({orders.length})</p>
        </div>
        <button
          onClick={refreshOrders}
          disabled={refreshing}
          className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-md text-xs font-semibold transition-colors disabled:opacity-50 flex items-center gap-1.5"
        >
          {refreshing ? (
            <>
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Refreshing...
            </>
          ) : (
            <>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </>
          )}
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1 -mb-1">
        <button
          onClick={() => setStatusFilter(null)}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${statusFilter === null
            ? "bg-zinc-900 text-white shadow-sm"
            : "bg-white border border-zinc-200 text-zinc-700 hover:border-zinc-900 hover:shadow-xs"
            }`}
        >
          All ({orders.length})
        </button>
        {VALID_STATUSES.map((status) => {
          const count = orders.filter((o) => o.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize whitespace-nowrap transition-all flex-shrink-0 ${statusFilter === status
                ? "bg-zinc-900 text-white shadow-sm"
                : "bg-white border border-zinc-200 text-zinc-700 hover:border-zinc-900 hover:shadow-xs"
                }`}
            >
              {status} ({count})
            </button>
          );
        })}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <p className="text-red-700 text-xs">{error}</p>
            <button
              onClick={fetchOrders}
              className="px-2.5 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-md transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 border-3 border-zinc-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-zinc-900 mb-1">Loading orders...</p>
            <p className="text-zinc-500 text-sm">Fetching all orders from database</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <h2 className="text-xl font-bold text-zinc-900 mb-3">
              {statusFilter ? `No ${statusFilter} orders` : "No orders yet"}
            </h2>
            <p className="text-zinc-500 text-base max-w-sm mx-auto">
              {statusFilter
                ? `No orders with ${statusFilter} status found.`
                : "No orders in the system yet. Orders will appear here when customers place them."
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-zinc-700 uppercase tracking-wider">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-zinc-700 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-zinc-700 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-zinc-700 uppercase tracking-wider">Items</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-zinc-700 uppercase tracking-wider">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-zinc-700 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-zinc-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-sm font-semibold text-zinc-900"># {order.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-zinc-900 text-sm">{order.user_name}</div>
                      <div className="text-xs text-zinc-500">{order.user_email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusColors[order.status] || 'bg-gray-100 text-gray-700 border-gray-300'}`}>
                        {order.status?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-zinc-900">
                      {(order.items || []).length} item{((order.items || []).length !== 1) ? 's' : ''}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="text-lg font-bold text-zinc-900">€{order.total}</div>
                      <div className="text-xs text-zinc-500">incl. shipping</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-500">{formatDate(order.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowDetailsModal(true);
                          }}
                          className="px-3 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold rounded-md transition-all"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowStatusModal(true);
                            setNewStatus(order.status);
                          }}
                          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-md transition-all"
                        >
                          Status
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-xl">
            {/* Header */}
            <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-zinc-900">Order #{selectedOrder.id}</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusColors[selectedOrder.status]}`}>
                  {selectedOrder.status.toUpperCase()}
                </span>
              </div>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedOrder(null);
                }}
                className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-base font-bold text-zinc-900 mb-3">Customer</h3>
                  <div className="space-y-1.5 text-sm">
                    <p><span className="text-zinc-500">Name:</span> {selectedOrder.user_name}</p>
                    <p><span className="text-zinc-500">Email:</span> {selectedOrder.user_email}</p>
                    <p><span className="text-zinc-500">Phone:</span> {selectedOrder.user_phone || '—'}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900 mb-3">Shipping</h3>
                  <div className="bg-zinc-50 p-3 rounded-lg">
                    <p className="font-semibold text-sm">{selectedOrder.shipping_address || 'No address'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-zinc-900 mb-4">Order Items</h3>
                <div className="border border-zinc-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-zinc-50">
                      <tr>
                        <th className="px-4 py-2.5 text-left text-xs font-bold text-zinc-700">Product</th>
                        <th className="px-4 py-2.5 text-left text-xs font-bold text-zinc-700">Details</th>
                        <th className="px-4 py-2.5 text-right text-xs font-bold text-zinc-700">Price</th>
                        <th className="px-4 py-2.5 text-right text-xs font-bold text-zinc-700">Qty</th>
                        <th className="px-4 py-2.5 text-right text-xs font-bold text-zinc-700">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {(selectedOrder.items || []).map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2.5 font-semibold text-zinc-900 text-sm">{item.product_name}</td>
                          <td className="px-4 py-2.5 text-xs text-zinc-600">
                            {item.flavor && `${item.flavor}, `}{item.size_label || '—'}
                          </td>
                          <td className="px-4 py-2.5 text-xs text-zinc-900 text-right">
                            €{Number(item.unit_price).toFixed(2)}
                          </td>
                          <td className="px-4 py-2.5 text-xs font-semibold text-zinc-900 text-right">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-2.5 text-xs font-bold text-zinc-900 text-right">
                            €{(Number(item.unit_price) * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border-t border-zinc-200 pt-4 mt-6">
                <div className="flex flex-col sm:flex-row justify-between items-end gap-3 bg-zinc-50 p-4 rounded-lg">
                  <div className="space-y-0.5 text-xs">
                    <div>Subtotal: €{selectedOrder.subtotal}</div>
                    <div>Shipping: €{selectedOrder.shipping_cost}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-zinc-900">€{selectedOrder.total}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-zinc-200 bg-zinc-50">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowStatusModal(true);
                    setShowDetailsModal(false);
                  }}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-semibold text-xs uppercase tracking-wide transition-all"
                >
                  Update Status
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedOrder(null);
                  }}
                  className="flex-1 bg-zinc-200 hover:bg-zinc-300 text-zinc-900 py-2 px-4 rounded-lg font-semibold text-xs uppercase tracking-wide transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-xl max-w-sm w-full p-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-zinc-900">Update Status</h3>
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedOrder(null);
                }}
                className="p-1.5 hover:bg-zinc-100 rounded-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-md text-xs text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-2.5 mb-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Order #{selectedOrder.id}</label>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusColors[selectedOrder.status]}`}>
                  Current: {selectedOrder.status.toUpperCase()}
                </span>
              </div>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full p-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              >
                {VALID_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 pt-3">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedOrder(null);
                  setNewStatus("");
                }}
                className="flex-1 bg-zinc-200 hover:bg-zinc-300 text-zinc-900 py-2.5 px-4 rounded-lg font-semibold transition-all text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={newStatus === selectedOrder.status || !newStatus}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white py-2.5 px-4 rounded-lg font-semibold uppercase tracking-wide transition-all flex items-center justify-center gap-1.5 text-xs"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
