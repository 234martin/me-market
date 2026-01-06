import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load current user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("marketplaceUser");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // Register function
  const register = ({ username, email, password, type = "buyer" }) => {
    const savedUsers = JSON.parse(localStorage.getItem("marketplaceUsers") || "[]");

    // Check if email exists (case-insensitive)
    if (savedUsers.find(u => u.email.toLowerCase() === email.trim().toLowerCase())) {
      return { success: false, message: "Email already exists" };
    }

    // Create new user
    const newUser = {
      id: Date.now(),
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim(),
      type,
    };

    savedUsers.push(newUser);
    localStorage.setItem("marketplaceUsers", JSON.stringify(savedUsers));

    // Auto-login after register
    setUser(newUser);
    localStorage.setItem("marketplaceUser", JSON.stringify(newUser));

    return { success: true };
  };

  // Login function
  const login = (email, password) => {
    const savedUsers = JSON.parse(localStorage.getItem("marketplaceUsers") || "[]");

    const found = savedUsers.find(
      u =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.password === password.trim()
    );

    if (!found) return { success: false, message: "Invalid email or password" };

    setUser(found);
    localStorage.setItem("marketplaceUser", JSON.stringify(found));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("marketplaceUser");
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
