import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "../ui/ProductCard";
import { getProducts } from "../../api/index.api";

export default function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD FEATURED PRODUCTS ================= */
  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const res = await getProducts({
          isFeatured: true,
          isActive: true,
        });

        setFeaturedProducts(res.data.products || []);
      } catch (err) {
        console.error("Failed to load featured products", err);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  /* ================= LOADING ================= */
  if (loading) return null;

  /* ================= EMPTY ================= */
  if (featuredProducts.length === 0) return null;

  return (
    <section className="bg-[#f5faf5] py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
            Featured Products
          </h2>

          <p className="text-gray-600 mt-2 max-w-xl">
            Hand-picked premium products made with traditional methods and pure ingredients
          </p>

          <div className="mt-4 h-1 w-20 bg-[#8fbc8f] rounded-full" />
        </motion.div>

        {/* GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {featuredProducts.slice(0, 8).map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
