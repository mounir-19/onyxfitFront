import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getDashboardStats, getRecentOrders } from "../../api/dashboard";

export default function DashboardPage() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    statusCounts: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const [statsData, ordersData] = await Promise.all([
          getDashboardStats(),  // Returns: {orders, statusCounts, totalOrders, totalSales}
          getRecentOrders(),    // Returns: {data: [...]}
        ]);

        setStats({
          totalOrders: statsData.totalOrders || 0,
          totalSales: statsData.totalSales || 0,
          statusCounts: statsData.statusCounts || {},
        });
        setOrders(ordersData.data || ordersData || []); // Handle both structures
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Use backend status counts instead of filtering recent orders
  const statusCounts = {
    pending: stats.statusCounts.pending || 0,
    confirmed: stats.statusCounts.confirmed || 0,
    shipped: stats.statusCounts.shipped || 0,
    delivered: stats.statusCounts.delivered || 0,
    cancelled: stats.statusCounts.cancelled || 0,
  };

  const lineChartData = [...orders]
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .slice(0, 10) // Limit for chart readability
    .map((order) => ({
      date: new Date(order.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      total: Number(order.total),
    }));

  const barChartData = [
    { status: "Pending", count: statusCounts.pending },
    { status: "Confirmed", count: statusCounts.confirmed },
    { status: "Shipped", count: statusCounts.shipped },
    { status: "Delivered", count: statusCounts.delivered },
    { status: "Cancelled", count: statusCounts.cancelled },
  ];

  const statCards = [
    { label: "Total Orders", value: stats.totalOrders, color: "bg-blue-500" },
    { label: "Total Sales", value: `€${Number(stats.totalSales).toLocaleString()}`, color: "bg-green-500" },
    { label: "Pending", value: statusCounts.pending, color: "bg-yellow-500" },
    { label: "Delivered", value: statusCounts.delivered, color: "bg-emerald-500" },
  ];

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      confirmed: "bg-blue-100 text-blue-800 border-blue-300",
      shipped: "bg-purple-100 text-purple-800 border-purple-300",
      delivered: "bg-green-100 text-green-800 border-green-300",
      cancelled: "bg-red-100 text-red-800 border-red-300",
    };
    return colors[status] || "bg-zinc-100 text-zinc-700 border-zinc-300";
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-zinc-200 border-t-zinc-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-zinc-900">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">Dashboard</h1>
        <p className="text-zinc-500">Overview of your store performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-zinc-200 p-6 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
              <div className="text-xs text-zinc-500 font-semibold uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
            <p className={`text-2xl font-black text-zinc-900 mb-1 ${index === 1 ? 'text-3xl' : ''}`}>
              {stat.value}
            </p>
            <p className="text-xs text-zinc-500 font-medium">Updated just now</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Orders Over Time */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <h2 className="text-xl font-bold text-zinc-900 mb-6">Order Totals Over Time</h2>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tickMargin={12} />
              <YAxis axisLine={false} tickLine={false} tickMargin={12} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ fill: "#ef4444", strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by Status */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <h2 className="text-xl font-bold text-zinc-900 mb-6">Orders by Status</h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
              <XAxis dataKey="status" axisLine={false} tickLine={false} tickMargin={12} />
              <YAxis axisLine={false} tickLine={false} tickMargin={12} />
              <Tooltip />
              <Bar
                dataKey="count"
                radius={[6, 6, 0, 0]}
                fill="#10b981"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-zinc-200 bg-gradient-to-r from-zinc-50 to-zinc-100">
          <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
            Recent Orders
            <span className="bg-zinc-200 text-xs px-2 py-0.5 rounded-full font-semibold">
              {orders.length}
            </span>
          </h2>
        </div>

        {orders.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mb-2">No recent orders</h3>
            <p className="text-zinc-500 text-sm">Orders will appear here when customers place them.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-zinc-700 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-zinc-700 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-zinc-700 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-zinc-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-zinc-700 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {orders.slice(0, 10).map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm font-semibold text-zinc-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-sm text-zinc-900">
                        {order.first_name} {order.last_name}
                      </div>
                      <div className="text-xs text-zinc-500">{order.email}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-lg font-bold text-zinc-900">€{Number(order.total).toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500">
                      {formatDate(order.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
