import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "../ui/ProductCard";
import { getProducts } from "../../api/index.api";

export default function BestSeller() {
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD BEST SELLERS ================= */
  useEffect(() => {
    const loadBestSellers = async () => {
      try {
        const res = await getProducts({
          isBestSeller: true,
          isActive: true,
        });

        setBestSellers(res.data.products || []);
      } catch (err) {
        console.error("Failed to load best sellers", err);
        setBestSellers([]);
      } finally {
        setLoading(false);
      }
    };

    loadBestSellers();
  }, []);

  /* ================= LOADING STATE ================= */
  if (loading) return null;

  /* ================= EMPTY STATE ================= */
  if (bestSellers.length === 0) return null;

  return (
    <section className="bg-[#ace1af]/20 py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
            Best Sellers
          </h2>

          <p className="text-gray-600 mt-2 max-w-xl">
            Our most loved products, trusted by customers for purity and quality
          </p>

          <div className="mt-4 h-1 w-16 bg-[#ace1af] rounded-full" />
        </motion.div>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {bestSellers.slice(0, 8).map((product, index) => (
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
