import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getActiveCategories } from "../../api/index.api";

export default function CategorySection() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD ACTIVE CATEGORIES ================= */
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getActiveCategories();
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error("Category load failed", err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <section className="py-20 text-center text-gray-400">
        Loading categories…
      </section>
    );
  }

  /* ================= EMPTY STATE ================= */
  if (categories.length === 0) return null;

  return (
  <section className="bg-[#f5faf5] py-24">
    <div className="max-w-7xl mx-auto px-6">
      {/* HEADER */}
      <div className="mb-14 flex flex-col items-start">
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
          Shop by Category
        </h2>
        <p className="text-gray-600 mt-2 max-w-lg">
          Carefully curated organic categories for a healthier lifestyle
        </p>
        <div className="mt-4 h-1 w-24 bg-[#8fbc8f] rounded-full" />
      </div>

      {/* CATEGORY GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {categories.map((cat, index) => (
          <motion.div
            key={cat._id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06 }}
            onClick={() => navigate(`/products?category=${cat.slug}`)}
            className="
              group cursor-pointer
              rounded-3xl overflow-hidden
              bg-white
              border border-gray-100
              shadow-sm hover:shadow-xl
              transition-all duration-300
            "
          >
            {/* IMAGE */}
            <div className="relative w-full h-40 overflow-hidden bg-[#eaf4ea]">
              {cat.image?.url ? (
                <img
                  src={cat.image.url}
                  alt={cat.title}
                  className="
                    w-full h-full object-cover
                    group-hover:scale-110 transition duration-500
                  "
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  No image
                </div>
              )}

              {/* DARK GRADIENT */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
            </div>

            {/* TITLE */}
            <div className="p-4 text-center">
              <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[#2f6a31] transition">
                {cat.title}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

}
