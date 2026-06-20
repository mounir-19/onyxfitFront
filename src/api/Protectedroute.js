import { Navigate } from "react-router-dom";
import { isAuthenticated, isAdmin } from "../api/authApi";

/**
 * ProtectedRoute - Component to protect routes that require authentication
 * 
 * @param {boolean} adminOnly - If true, only admins can access this route
 * @param {React.Component} children - The component to render if authorized
 */
export default function ProtectedRoute({ adminOnly = false, children }) {
    // Check if user is authenticated
    if (!isAuthenticated()) {
        // Not logged in, redirect to login page
        return <Navigate to="/login" replace />;
    }

    // If route requires admin access, check if user is admin
    if (adminOnly && !isAdmin()) {
        // User is logged in but not an admin, redirect to home
        return <Navigate to="/" replace />;
    }

    // User is authorized, render the protected component
    return children;
}