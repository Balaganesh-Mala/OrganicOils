import { motion } from "framer-motion";
import ProductCard from "../ui/ProductCard";
import { products } from "../../data/products";

export default function FeaturedProducts() {
  // ✅ FILTER FEATURED PRODUCTS
  const featuredProducts = products.filter(
    (product) => product.isFeatured && product.isActive
  );

  if (featuredProducts.length === 0) return null;

  return (
    <section className="bg-[#f5faf5] py-5">
      <div className="max-w-7xl mx-auto px-6">
        {/* SECTION HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-centerflex flex-col items-left"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
            Featured Products
          </h2>

          <p className="text-gray-600 mt-2 text-left">
            Hand-picked premium products made with traditional methods and pure ingredients
          </p>

          {/* ACCENT LINE */}
          <div className="mt-4 h-1 w-20 bg-[#8fbc8f]  rounded-full" />
        </motion.div>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product, index) => (
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
