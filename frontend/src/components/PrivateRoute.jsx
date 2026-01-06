import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * type: "buyer" | "seller"
 * Protects routes:
 * - "seller" → must be logged in as seller
 * - "buyer" → optional login (guests allowed)
 * - undefined → public route
 */
export default function PrivateRoute({ children, type }) {
  const { user } = useAuth();

  if (type === "seller") {
    // Seller route → must be logged in as seller
    if (!user || user.type !== "seller") {
      return <Navigate to="/login" replace />;
    }
  }

  // Buyer route → allow guests
  // No redirect needed; guests can access

  return children;
}
