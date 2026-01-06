import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Load cart from localStorage (guest cart)
  useEffect(() => {
    const savedCart = localStorage.getItem("marketplaceCart");
    if (savedCart) setCartItems(JSON.parse(savedCart));
  }, []);

  // Update localStorage & total price
  useEffect(() => {
    localStorage.setItem("marketplaceCart", JSON.stringify(cartItems));
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(total);
  }, [cartItems]);

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        const updatedCart = prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        toast.success(`${product.name} quantity: ${updatedCart.find(i => i.id === product.id).quantity}`);
        return updatedCart;
      } else {
        toast.success(`${product.name} added to cart!`);
        return [...prev, { ...product, quantity }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    const removedItem = cartItems.find((item) => item.id === id);
    setCartItems(prev => prev.filter(item => item.id !== id));
    if (removedItem) toast.success(`${removedItem.name} removed from cart.`);
  };

  // Update quantity
  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return removeFromCart(id);
    setCartItems(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity } : item))
    );
    toast.success(`Quantity updated!`);
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    toast.success("Cart cleared!");
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};
