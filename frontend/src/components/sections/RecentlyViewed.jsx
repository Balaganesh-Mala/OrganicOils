import ProductCard from "../ui/ProductCard";
import useRecentlyViewed from "../../hooks/useRecentlyViewed";
import { motion } from "framer-motion";

export default function RecentlyViewed() {
  const products = useRecentlyViewed() || [];

  if (!products.length) return null;

  return (
    <section className="mt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35 }}
        className="text-2xl font-semibold text-gray-900 mb-8"
      >
        Recently Viewed
      </motion.h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {products.slice(0, 8).map((product) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
