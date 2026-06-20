import { useState } from "react";
import Sidebar from "./components/sidebar.jsx";
import DashboardPage from "./pages/dashboard.jsx";
import OrdersPage from "./pages/Orders.jsx";
import CategoriesPage from "./pages/category.jsx";
import ProductsPage from "./pages/products.jsx";
import UsersPage from "./pages/users.jsx";
import AdminsPage from "./pages/Adminspage.jsx";
import Navbar from "../components/Navbar.jsx";

export default function AdminDashboard({ onNavigate }) {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardPage />;
      case "orders":
        return <OrdersPage />;
      case "categories":
        return <CategoriesPage />;
      case "products":
        return <ProductsPage />;
      case "users":
        return <UsersPage />;
      case "admins":
        return <AdminsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Navbar */}
      <Navbar onNavigate={onNavigate} />

      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-16 left-4 z-50 w-10 h-10 bg-zinc-900 text-white rounded-lg flex items-center justify-center shadow-lg"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </button>

      <div className="flex mt-[52px]">
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onNavigate={onNavigate}
        />
        
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "ml-0"}`}>
          <div className="p-6 lg:p-8">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}