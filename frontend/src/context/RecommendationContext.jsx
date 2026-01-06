// frontend/src/context/RecommendationContext.jsx
import React, { createContext, useContext, useState } from "react";

const RecommendationContext = createContext();

export const useRecommendation = () => useContext(RecommendationContext);

export const RecommendationProvider = ({ children }) => {
  const [viewedProducts, setViewedProducts] = useState([]);

  const addViewedProduct = (product) => {
    setViewedProducts((prev) => {
      if (!prev.find((p) => p.id === product.id)) {
        return [...prev, product];
      }
      return prev;
    });
  };

  return (
    <RecommendationContext.Provider value={{ viewedProducts, addViewedProduct }}>
      {children}
    </RecommendationContext.Provider>
  );
};
