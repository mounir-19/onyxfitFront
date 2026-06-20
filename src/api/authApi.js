import api from "./axios";

// Register new user
export const register = async (data) => {
  const response = await api.post("/auth/register", data);

  // Save auth data after successful registration
  if (response.data.user && response.data.user.token) {
    const { token, ...userData } = response.data.user;
    saveAuthData(userData, token);
  }

  return response;
};

// Login user
export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);

  // Save auth data after successful login
  if (response.data.user && response.data.user.token) {
    const { token, ...userData } = response.data.user;
    saveAuthData(userData, token);
  }

  return response;
};

// Logout user
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
  return null;
};

export const updateProfile = (userId, data) => {
  return api.patch(`/auth/profile/${userId}`, data);
};

export const changePassword = (userId, data) => {
  return api.patch(`/auth/password/${userId}`, data);
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

// Check if user is admin
export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === "admin";
};

// Save auth data to localStorage
export const saveAuthData = (user, token) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};