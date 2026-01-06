import React from "react";
import { Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryPage from "./pages/CategoryPage";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import SellerDashboard from "./pages/SellerDashboard";
import SellerOnboarding from "./pages/SellerOnboarding";
import CreateProduct from "./pages/CreateProduct";
import EditProduct from "./pages/EditProduct";
import DeleteProduct from "./pages/DeleteProduct";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";

// Auth Pages
import Login3D from "./pages/auth/Login3D";
import Register3D from "./pages/auth/Register3D";
import ResetPassword from "./pages/auth/ResetPassword";
import Onboarding from "./pages/auth/Onboarding";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { SellerProductsProvider } from "./context/SellerProductsContext";

export default function App() {
  return (
    <AuthProvider>
      <SellerProductsProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col bg-gray-950 text-white">
            <Header /> {/* Always visible */}

            <main className="flex-grow container mx-auto px-4 py-6">
              <Routes>
                {/* PUBLIC */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/product/:id" element={<Product />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/category/:categoryName" element={<CategoryPage />} />

                {/* AUTH */}
                <Route path="/login" element={<Login3D />} />
                <Route path="/register" element={<Register3D />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/onboarding" element={<Onboarding />} />

                {/* CART (buyer only) */}
                <Route
                  path="/cart"
                  element={
                    <PrivateRoute type="buyer">
                      <Cart />
                    </PrivateRoute>
                  }
                />

                {/* CHECKOUT (guest & buyer) */}
                <Route path="/checkout" element={<Checkout />} />

                {/* SELLER */}
                <Route
                  path="/seller"
                  element={
                    <PrivateRoute type="seller">
                      <SellerDashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/seller/onboard"
                  element={
                    <PrivateRoute type="seller">
                      <SellerOnboarding />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/seller/create-product"
                  element={
                    <PrivateRoute type="seller">
                      <CreateProduct />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/seller/edit-product/:id"
                  element={
                    <PrivateRoute type="seller">
                      <EditProduct />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/seller/delete-product/:id"
                  element={
                    <PrivateRoute type="seller">
                      <DeleteProduct />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/seller/analytics"
                  element={
                    <PrivateRoute type="seller">
                      <AnalyticsDashboard />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </main>

            <Footer /> {/* Always visible */}
          </div>
        </CartProvider>
      </SellerProductsProvider>
    </AuthProvider>
  );
}
