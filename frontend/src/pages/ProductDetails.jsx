import { useParams } from "react-router-dom";
import { useState } from "react";
import { products } from "../data/products";
import ImageMagnifier from "../components/ui/ImageMagnifier";
import ProductCard from "../components/ui/ProductCard";
import { useEffect } from "react";
import { addRecentlyViewed } from "../utils/recentlyViewed";

import {
  FaStar,
  FaCheckCircle,
  FaLeaf,
  FaGlobe,
  FaInfoCircle,
  FaShoppingCart,
  FaBolt,
  FaRegStar,
} from "react-icons/fa";

import { motion } from "framer-motion";

export default function ProductDetails() {
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p._id === id);

  useEffect(() => {
    if (product) {
      addRecentlyViewed(product);
    }
  }, [product]);

  if (!product) {
    return (
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <p className="text-red-600 font-semibold">Product not found.</p>
      </section>
    );
  }
  const handleVariantChange = (index) => {
    setVariantIndex(index);
    setQuantity(1);
  };

  const [variantIndex, setVariantIndex] = useState(0);
  const variant = product.variants[variantIndex];

  const similarProducts = products.filter(
    (p) => p.category === product.category && p._id !== product._id
  );

  return (
    <motion.section
      className="bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        {/* ================= MAIN PRODUCT ================= */}
        <div className="grid  md:grid-cols-2 lg:grid-cols-2 gap-16 items-start">
          {/* IMAGE GALLERY WITH ZOOM */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="p-6 relative lg:sticky lg:top-28"
          >
            {/* WRAPPER */}
            <div className="flex flex-col md:flex-row gap-4 items-start">
              {/* THUMBNAILS — LEFT ON DESKTOP, BOTTOM ON MOBILE */}
              {product.images.length > 1 && (
                <div
                  className="
          flex md:flex-col gap-3
          order-2 md:order-1
          justify-center
        "
                >
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition
              ${
                activeImage === index
                  ? "border-[#9a6b63]"
                  : "border-gray-200 hover:border-[#9a6b63]"
              }`}
                    >
                      <img
                        src={img.url}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* MAIN IMAGE */}
              <div className="flex-1 order-1 md:order-2">
                <ImageMagnifier
                  src={product.images[activeImage].url || ""}
                  alt={product.productName}
                  zoom={1.5}
                />
              </div>
            </div>
          </motion.div>

          {/* DETAILS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-3"
          >
            {/* TITLE */}
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
                {product.productName}
              </h1>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
              <p className="text-sm text-gray-500 mt-1">{product.brand}</p>
            </div>

            {/* BADGES + RATING */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {product.isOrganic && (
                <span className="inline-flex items-center gap-1 text-green-700">
                  <FaLeaf size={14} /> Organic
                </span>
              )}
              {product.coldPressed && (
                <span className="text-gray-600">| Cold Pressed </span>
              )}
              |
              <span className="flex items-center gap-1 text-yellow-500">
                <FaStar />
                <span className="text-gray-800 font-medium">
                  {product.ratings}
                </span>
                <span className="text-gray-500">({product.numOfReviews})</span>
              </span>
            </div>

            {/* PRICE */}
            <div className="flex items-end gap-4">
              <span className="text-3xl font-semibold text-gray-900">
                ₹{variant.price}
              </span>
              <span className="line-through text-gray-400">₹{variant.mrp}</span>
              <span className="text-sm text-green-600">
                Save ₹{variant.mrp - variant.price}
              </span>
            </div>

            {/* VARIANTS */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Quantity</p>
              <div className="flex gap-3 flex-wrap">
                {product.variants.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => handleVariantChange(i)}
                    className={`px-4 py-2 text-sm rounded-md border transition
            ${
              i === variantIndex
                ? "border-gray-900 text-gray-900"
                : "border-gray-300 text-gray-600 hover:border-gray-900"
            }`}
                  >
                    {v.weight}
                  </button>
                ))}
              </div>
            </div>

            {/* QUANTITY */}
            {variant.stock > 0 && (
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Quantity</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 border rounded-md text-lg"
                  >
                    −
                  </button>

                  <span className="min-w-[32px] text-center font-medium">
                    {quantity}
                  </span>

                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(variant.stock, q + 1))
                    }
                    className="w-9 h-9 border rounded-md text-lg"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* STOCK STATUS */}
            <div>
              {variant.stock === 0 && (
                <span className="inline-block px-3 py-1 text-sm rounded-full bg-red-100 text-red-700">
                  Out of stock
                </span>
              )}

              {variant.stock > 0 && variant.stock < 10 && (
                <span className="inline-block px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800">
                  Limited stock ({variant.stock} left)
                </span>
              )}

              {variant.stock >= 10 && (
                <span className="inline-block px-3 py-1 text-sm rounded-full bg-green-100 text-green-700">
                  In stock
                </span>
              )}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                disabled={variant.stock === 0}
                className={`flex-1 py-3 rounded-md text-base transition
      ${
        variant.stock === 0
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-[#8fbc8f] text-white hover:bg-[#93c572]"
      }`}
              >
                Buy Now
              </button>

              <button
                disabled={variant.stock === 0}
                className={`flex-1 py-3 rounded-md border transition
      ${
        variant.stock === 0
          ? "border-gray-300 text-gray-400 cursor-not-allowed"
          : "border-[#8fbc8f] text-gray-900 hover:bg-gray-100"
      }`}
              >
                Add to Cart
              </button>
            </div>

            {/* DESCRIPTION */}
            <div className="pt-0 space-y-0">
              <p className="text-gray-700 leading-relaxed">
                {product.shortDescription || ""}
              </p>
            </div>

            {/* META */}
            <div className="pt-0 space-y-1 text-sm text-gray-600">
              <p>
                <strong>Ingredients:</strong> {product.ingredients.join(", ")}
              </p>
              <p>
                <strong>Shelf Life:</strong> {product.shelfLife}
              </p>
              <p>
                <strong>Storage:</strong> {product.storageInstructions}
              </p>
              <p>
                <strong>Made in:</strong> {product.madeIn}
              </p>
            </div>
          </motion.div>
        </div>
        {/* ================= SIMILAR PRODUCTS ================= */}
        {similarProducts.length > 0 && (
          <div className="mt-28">
            <h2 className="text-3xl font-bold mb-10">Similar Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {similarProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
        {/* ================= CUSTOMER REVIEWS ================= */}
        <div className="mt-24 max-w-4xl">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">
            Customer Reviews
          </h2>

          {product.reviews?.length === 0 ? (
            <p className="text-gray-500">No reviews yet.</p>
          ) : (
            <div className="space-y-6">
              {product.reviews.map((review, i) => (
                <div
                  key={i}
                  className="bg-white border rounded-xl p-6 hover:shadow-md transition"
                >
                  {/* HEADER */}
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{review.name}</h4>

                    {/* STAR RATING */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) =>
                        star <= review.rating ? (
                          <FaStar
                            key={star}
                            className="text-yellow-500"
                            size={14}
                          />
                        ) : (
                          <FaRegStar
                            key={star}
                            className="text-gray-300"
                            size={14}
                          />
                        )
                      )}
                    </div>
                  </div>

                  {/* COMMENT */}
                  <p className="mt-3 text-gray-700 leading-relaxed text-sm">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
