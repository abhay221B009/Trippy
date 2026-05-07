import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "https://trippy-qjc4.onrender.com";

  useEffect(() => {
    // If we have a token, we could optionally verify it or just assume it's valid until an API call fails
    // For now, let's just parse the user from the token if possible (if we stored user info in token)
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser(payload);
      } catch (e) {
        console.error("Failed to parse token", e);
        setToken(null);
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const response = await fetch(`${API_URL}/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    if (response.ok) {
      setToken(result.data.token);
      localStorage.setItem("token", result.data.token);
      return { success: true };
    } else {
      return { success: false, message: result.message };
    }
  };

  const signup = async (username, email, password) => {
    const response = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const result = await response.json();
    if (response.ok) {
      return { success: true, message: result.message };
    } else {
      return { success: false, message: result.message };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, loading, API_URL }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
