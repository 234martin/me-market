// frontend/src/pages/CategoriesPage.jsx
import React from "react";
import { Link } from "react-router-dom";

const categories = [
  {
    name: "Electronics",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Fashion",
    img: "https://images.unsplash.com/photo-1521334884684-d80222895322?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Home & Garden",
    img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Sports",
    img: "https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Toys",
    img: "https://images.unsplash.com/photo-1583337130417-4f2443c318f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Beauty",
    img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Automotive",
    img: "https://images.unsplash.com/photo-1502877338535-766e1452684a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Books",
    img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Groceries",
    img: "https://images.unsplash.com/photo-1598514984046-1103d99a4b18?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  },
];

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-gray-900 pt-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-10 text-center">
          Explore Categories
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/category/${cat.name}`}
              className="group relative rounded-3xl overflow-hidden shadow-2xl transform transition duration-300 hover:scale-[1.03]"
            >
              {/* Background image */}
              <div className="absolute inset-0">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors duration-500"></div>
              </div>

              {/* Category info */}
              <div className="relative z-10 p-6 flex flex-col justify-end h-56">
                <span className="bg-white/10 px-3 py-1 rounded-full text-sm font-semibold text-white mb-2">
                  {cat.name}
                </span>
                <h2 className="text-2xl font-bold text-white">{cat.name}</h2>
                <p className="text-gray-300 text-sm mt-1">
                  Explore top products in {cat.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
