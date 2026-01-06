import React, { useEffect, useRef, useState, useMemo } from "react";
import Hls from "hls.js";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useSellerProducts } from "../context/SellerProductsContext";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const { products } = useSellerProducts();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);
  const videoRef = useRef(null);

  const featuredProducts = products.slice(0, 8);
  const trendingProducts = products.slice(0, 10);

  const categories = [
    {
      name: "electronics",
      img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "fashion",
      img: "https://images.unsplash.com/photo-1521334884684-d80222895322?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "home-garden",
      img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "sports",
      img: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "books",
      img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const suggestions = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return products
      .filter((p) => (p.name || "").toLowerCase().includes(q))
      .slice(0, 6);
  }, [query, products]);

  const handleSearch = () => {
    if (!query.trim()) return;
    navigate(`/categories?search=${encodeURIComponent(query)}`);
  };

  const handleBecomeSeller = () => {
    if (!user) return navigate("/register");
    if (user.type !== "seller") return navigate("/seller/onboard");
    navigate("/seller");
  };

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    let pos = 0;
    let raf;
    const speed = 0.5;

    const step = () => {
      pos = (pos + speed) % (el.scrollWidth || 1);
      el.scrollLeft = pos;
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [trendingProducts.length]);

  // ================= HLS HERO VIDEO =================
  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const hlsUrl =
      "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"; // Hosted HLS demo

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });
      return () => hls.destroy();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = hlsUrl;
      video.addEventListener("loadedmetadata", () => video.play());
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-gray-400">
        Loading marketplace…
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen bg-black text-white"
      >
        {/* ================= HERO ================= */}
        <section className="relative h-[95vh] flex items-center overflow-hidden">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),transparent_55%)]" />

          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <div className="max-w-2xl backdrop-blur-xl bg-black/40 border border-white/10 rounded-3xl p-10 shadow-2xl">
              <h1 className="text-6xl md:text-7xl font-extrabold leading-tight tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
                  The Global Marketplace
                </span>
              </h1>

              <p className="mt-6 text-lg text-gray-300">
                Buy and sell premium products from verified sellers worldwide —
                fast, secure, and broker-free.
              </p>

              <div className="mt-10 flex gap-4">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Search products, brands, categories…"
                  className="flex-grow px-5 py-4 rounded-2xl bg-black/60 backdrop-blur border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSearch}
                  className="px-8 py-4 rounded-2xl font-semibold bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg hover:scale-105 transition"
                >
                  Search
                </button>
              </div>

              {suggestions.length > 0 && (
                <div className="mt-3 bg-black/80 backdrop-blur border border-gray-700 rounded-xl shadow-xl">
                  {suggestions.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => navigate(`/product/${s.id}`)}
                      className="px-4 py-2 hover:bg-gray-800 cursor-pointer transition"
                    >
                      {s.name}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-10 flex gap-4">
                <button
                  onClick={handleBecomeSeller}
                  className="px-7 py-3 rounded-2xl bg-gray-800 hover:bg-gray-700 font-semibold transition"
                >
                  Become a Seller
                </button>

                <Link
                  to="/categories"
                  className="px-7 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 font-semibold transition"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ================= TRENDING ================= */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold mb-8">Trending Products</h2>
          <div
            ref={carouselRef}
            className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide"
          >
            {trendingProducts.map((p) => (
              <div
                key={p.id}
                className="relative min-w-[280px] rounded-2xl overflow-hidden shadow-xl group"
              >
                <div onClick={() => navigate(`/product/${p.id}`)}>
                  <ProductCard product={p} />
                </div>
                <button
                  onClick={() => {
                    if (!user) return navigate("/login");
                    addToCart(p, 1);
                    toast.success(`${p.name} added to cart`);
                  }}
                  className="absolute top-3 right-3 bg-green-500 px-4 py-1.5 rounded-full text-sm font-semibold opacity-0 group-hover:opacity-100 transition"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ================= CATEGORIES ================= */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
          <div className="grid md:grid-cols-5 gap-8">
            {categories.map((c) => (
              <Link
                key={c.name}
                to={`/category/${c.name}`}
                className="relative h-40 rounded-2xl overflow-hidden group shadow-lg"
              >
                <img
                  src={c.img}
                  alt={c.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-black/55 group-hover:bg-black/30 transition" />
                <span className="relative z-10 flex items-center justify-center h-full text-lg font-semibold capitalize">
                  {c.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ================= FEATURED ================= */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <h2 className="text-3xl font-bold mb-10">Featured Products</h2>
          <div className="grid md:grid-cols-4 gap-10">
            {featuredProducts.map((p) => (
              <div
                key={p.id}
                className="relative rounded-2xl overflow-hidden shadow-lg group"
              >
                <div onClick={() => navigate(`/product/${p.id}`)}>
                  <ProductCard product={p} />
                </div>
                <button
                  onClick={() => {
                    if (!user) return navigate("/login");
                    addToCart(p, 1);
                    toast.success(`${p.name} added to cart`);
                  }}
                  className="absolute top-3 right-3 bg-green-500 px-4 py-1.5 rounded-full text-sm font-semibold opacity-0 group-hover:opacity-100 transition"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="max-w-7xl mx-auto px-6 py-28">
          <div className="rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-700 to-cyan-600 p-16 flex flex-col md:flex-row justify-between items-center shadow-2xl">
            <div>
              <h3 className="text-4xl font-bold mb-3">Start Selling Today</h3>
              <p className="text-gray-200 text-lg">
                Launch your store and reach global buyers instantly.
              </p>
            </div>

            <button
              onClick={handleBecomeSeller}
              className="mt-6 md:mt-0 bg-green-500 hover:bg-green-600 px-9 py-4 rounded-2xl font-semibold transition shadow-lg"
            >
              Become a Seller
            </button>
          </div>
        </section>

        <div className="h-24" />
      </motion.main>
    </AnimatePresence>
  );
}
