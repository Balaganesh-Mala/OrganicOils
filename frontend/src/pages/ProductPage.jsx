import { useState, useMemo } from "react";
import ProductCard from "../components/ui/ProductCard";
import { products } from "../data/products";
import { categories } from "../data/categories";
import { FiSearch } from "react-icons/fi";

export default function ProductPage() {
  /* ================= STATE ================= */
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [sortBy, setSortBy] = useState("DEFAULT");

  /* ================= FILTER + SORT ================= */
  const filteredProducts = useMemo(() => {
    let data = [...products];

    // 🔍 SEARCH
    if (search.trim()) {
      data = data.filter((p) =>
        p.productName.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 📂 CATEGORY FILTER
    if (selectedCategory !== "ALL") {
      data = data.filter((p) => p.category === selectedCategory);
    }

    // 💰 SORT
    if (sortBy === "PRICE_LOW_HIGH") {
      data.sort((a, b) => a.variants[0].price - b.variants[0].price);
    }

    if (sortBy === "PRICE_HIGH_LOW") {
      data.sort((a, b) => b.variants[0].price - a.variants[0].price);
    }

    return data;
  }, [search, selectedCategory, sortBy]);

  return (
    <section className="bg-[#faf8f6] min-h-screen pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* ================= CONTENT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* ================= LEFT SIDEBAR ================= */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border sticky top-28 flex flex-col gap-6">
              <h3 className="font-semibold text-gray-900">Filters</h3>

              {/* ================= MOBILE VIEW ================= */}
              <div className="flex flex-col gap-4 lg:hidden">
                {/* CATEGORY DROPDOWN */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border
                   focus:outline-none focus:ring-2
                   focus:ring-[#8fbc8f]/40"
                >
                  <option value="ALL">All Categories</option>
                  {categories
                    .filter((c) => c.isActive)
                    .map((cat) => (
                      <option key={cat._id} value={cat.title}>
                        {cat.title}
                      </option>
                    ))}
                </select>

                {/* SORT */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border
                   focus:outline-none focus:ring-2
                   focus:ring-[#8fbc8f]/40"
                >
                  <option value="DEFAULT">Sort by</option>
                  <option value="PRICE_LOW_HIGH">Price: Low to High</option>
                  <option value="PRICE_HIGH_LOW">Price: High to Low</option>
                </select>
              </div>

              {/* ================= DESKTOP VIEW ================= */}
              <div className="hidden lg:flex flex-col gap-6">
                {/* CATEGORY LIST */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Categories
                  </p>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setSelectedCategory("ALL")}
                      className={`text-left px-3 py-2 rounded-lg transition
              ${
                selectedCategory === "ALL"
                  ? "bg-[#8fbc8f]/10 text-[#8fbc8f] font-medium"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
                    >
                      All Categories
                    </button>

                    {categories
                      .filter((c) => c.isActive)
                      .map((cat) => (
                        <button
                          key={cat._id}
                          onClick={() => setSelectedCategory(cat.title)}
                          className={`text-left px-3 py-2 rounded-lg transition
                  ${
                    selectedCategory === cat.title
                      ? "bg-[#8fbc8f]/10 text-[#8fbc8f] font-medium"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                        >
                          {cat.title}
                        </button>
                      ))}
                  </div>
                </div>

                {/* SORT */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Sort by Price
                  </p>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border
                     focus:outline-none focus:ring-2
                     focus:ring-[#8fbc8f]/40"
                  >
                    <option value="DEFAULT">Default</option>
                    <option value="PRICE_LOW_HIGH">Low to High</option>
                    <option value="PRICE_HIGH_LOW">High to Low</option>
                  </select>
                </div>
              </div>
            </div>
          </aside>

          {/* ================= PRODUCTS ================= */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
              <div>
                <h1 className="text-3xl font-semibold text-gray-900">
                  Products
                </h1>
                <p className="text-gray-600">
                  Showing {filteredProducts.length} products
                </p>
              </div>
              <div className="relative w-full md:w-96">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border
                         focus:outline-none focus:ring-2
                         focus:ring-[#9a6b63]/40"
                />
              </div>
            </div>
            <hr className="border-gray-200 mb-6" />
            <p className="text-gray-600">
              All products available in our store and ready to be delivered.
              order now! our products are made from the best quality
              ingredients. organic and natural products for a healthier
              lifestyle.
            </p>
            {filteredProducts.length === 0 ? (
              <p className="text-gray-500">No products found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 pb-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
            <hr className="border-gray-200 mb-6 w-full " />
            <div className="flex justify-center mt-10 w-full ">
              <button className="bg-[#8fbc8f]/60 px-5 py-3 rounded-lg text-white font-medium hover:bg-[#8fbc8f] transition">
                Load more
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
