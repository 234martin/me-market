// frontend/src/components/RecommendedProducts.jsx
import React, { useMemo } from "react";
import { useSellerProducts } from "../context/SellerProductsContext";
import { useRecommendation } from "../context/RecommendationContext";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";

export default function RecommendedProducts() {
  const { products } = useSellerProducts();
  const { viewedProducts } = useRecommendation();
  const navigate = useNavigate();

  // Generate recommendations
  const recommendations = useMemo(() => {
    if (viewedProducts.length === 0) {
      // Show trending/featured if user hasn't viewed anything
      return products.slice(0, 8);
    }

    // Collect categories of viewed products
    const viewedCategories = viewedProducts.map((p) => p.category);

    // Filter products in the same category, excluding already viewed
    const recommended = products.filter(
      (p) => viewedCategories.includes(p.category) && !viewedProducts.includes(p)
    );

    // Add random products to fill up to 8
    while (recommended.length < 8 && recommended.length < products.length) {
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      if (!recommended.includes(randomProduct) && !viewedProducts.includes(randomProduct)) {
        recommended.push(randomProduct);
      }
    }

    return recommended;
  }, [viewedProducts, products]);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold mb-6">Recommended for You</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
        {recommendations.map((p) => (
          <div
            key={p.id}
            className="relative group"
            onClick={() => navigate(`/product/${p.id}`)}
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
