// frontend/src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { SellerProductsProvider } from "./context/SellerProductsContext";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <SellerProductsProvider>
        <CartProvider>
          <BrowserRouter basename="/me-broker">
            <App />
          </BrowserRouter>
        </CartProvider>
      </SellerProductsProvider>
    </AuthProvider>
  </React.StrictMode>
);
