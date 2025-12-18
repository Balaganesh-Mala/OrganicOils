import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

import ImageMagnifier from "../components/ui/ImageMagnifier";
import ProductCard from "../components/ui/ProductCard";

import { getProductById, getProducts, addToCart } from "../api/index.api";

import { addRecentlyViewed } from "../utils/recentlyViewed";

import {
  FaStar,
  FaLeaf,
  FaRegStar,
  FaArrowLeft,
  FaCrown,
} from "react-icons/fa";
import { FiAlertTriangle } from "react-icons/fi";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  /* ================= STATE ================= */
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeImage, setActiveImage] = useState(0);
  const [variantIndex, setVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const variant = product?.variants?.[variantIndex];

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await getProductById(id);
        const prod = res.data.product;

        setProduct(prod);
        addRecentlyViewed(prod);

        // similar products by category
        const list = await getProducts({
          category: prod.category,
        });

        setSimilarProducts(
          list.data.products.filter((p) => p._id !== prod._id)
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  /* ================= LOGIN GUARD ================= */
  const requireLogin = () => {
    Swal.fire({
      icon: "warning",
      title: "Login Required",
      text: "Please login to continue",
      confirmButtonColor: "#8fbc8f",
      confirmButtonText: "Login",
    }).then((res) => {
      if (res.isConfirmed) navigate("/login");
    });
  };

  /* ================= VARIANT CHANGE ================= */
  const handleVariantChange = (index) => {
    setVariantIndex(index);
    setQuantity(1);
  };

  /* ================= ADD TO CART ================= */
  const handleAddToCart = async () => {
    if (!localStorage.getItem("token")) return requireLogin();

    try {
      await addToCart({
        productId: product._id,
        variantSku: variant.sku,
        quantity,
      });

      Swal.fire({
        icon: "success",
        title: "Added to cart",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire("Error", "Failed to add to cart", "error");
    }
  };

  /* ================= BUY NOW ================= */
  const handleBuyNow = async () => {
    if (!localStorage.getItem("token")) return requireLogin();

    try {
      await addItem({
        productId: product._id,
        variantSku: variant.sku,
        quantity,
      });

      navigate("/checkout");
    } catch (err) {
      Swal.fire("Error", "Unable to proceed", "error");
    }
  };
  /* ================= LOADING ================= */
  if (loading) {
    return (
      <section className="pt-32 text-center text-gray-500">
        Loading product...
      </section>
    );
  }

  if (!product) {
  return (
    <section className="min-h-screen flex items-center justify-center bg-[#faf8f6] px-4">
      <div className="p-8 max-w-sm w-full text-center  space-y-4">
        {/* ICON */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
            <FiAlertTriangle className="text-3xl text-red-500" />
          </div>
        </div>

        {/* TEXT */}
        <h2 className="text-xl font-semibold text-gray-900">
          Product not found
        </h2>

        <p className="text-sm text-gray-500">
          The product you’re looking for doesn’t exist or may have been removed.
        </p>

        {/* ACTION */}
        <button
          onClick={() => (window.location.href = "/products")}
          className="
            mt-2 px-6 py-3 rounded-xl
            bg-[#8fbc8f] text-white font-medium
            hover:bg-[#93c572] transition
          "
        >
          Browse Products
        </button>
      </div>
    </section>
  );
}

  /* ================= UI (UNCHANGED) ================= */
  return (
    <motion.section
      className="bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-16">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-black"
        >
          <FaArrowLeft /> Back to Products
        </button>
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* IMAGE */}
          <motion.div className="p-6 lg:sticky lg:top-28">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* THUMBNAILS */}
              {product.images.length > 1 && (
                <div
                  className="
          order-2 lg:order-1
          flex flex-row lg:flex-col
          gap-3
          overflow-x-auto lg:overflow-visible
        "
                >
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`w-20 h-20 flex-shrink-0 border-2 rounded-xl overflow-hidden
              ${activeImage === i ? "border-[#8fbc8f]" : "border-gray-200"}`}
                    >
                      <img
                        src={img.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* MAIN IMAGE */}
              <div className="order-1 lg:order-2 flex-1">
                <ImageMagnifier
                  src={product.images[activeImage]?.url}
                  alt={product.productName}
                  zoom={1.5}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-3"
          >
            {/* TITLE */}
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
                {product?.productName}
              </h1>

              <p className="text-gray-700 leading-relaxed">
                {product?.description}
              </p>

              <p className="text-sm text-gray-500 mt-1">{product?.brand}</p>
            </div>

            {/* BADGES + RATING */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
              {/* Organic Badge */}
              {product?.isOrganic && (
                <span className="inline-flex items-center gap-1 text-green-700 font-medium">
                  <FaLeaf size={14} /> Organic
                </span>
              )}

              {/* Cold Pressed Badge */}
              {product?.coldPressed && (
                <span className="font-medium">Cold Pressed</span>
              )}

              {/* Divider (only if any badge exists) */}
              {(product?.isOrganic || product?.coldPressed) && (
                <span className="text-gray-400">|</span>
              )}

              {/* Rating */}
              <span className="flex items-center gap-1">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={
                      index < Math.floor(product?.ratings || 0)
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }
                  />
                ))}

                <span className="text-gray-800 font-medium ml-1">
                  {product?.ratings || 0}
                </span>
                <span className="text-gray-500">
                  ({product?.numOfReviews || 0})
                </span>
              </span>
            </div>

            {/* PRICE */}
            {variant && (
              <div className="flex items-end gap-4">
                <span className="text-3xl font-semibold text-gray-900">
                  ₹{variant.price}
                </span>

                {variant.mrp > variant.price && (
                  <>
                    <span className="line-through text-gray-400">
                      ₹{variant.mrp}
                    </span>

                    <span className="text-sm text-green-600">
                      Save ₹{variant.mrp - variant.price}
                    </span>
                  </>
                )}
              </div>
            )}

            {/* VARIANTS */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Select Variant</p>

              <div className="flex gap-3 flex-wrap">
                {product?.variants?.map((v, i) => (
                  <button
                    key={v.sku || i}
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
            {variant?.stock > 0 && (
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
              {variant?.stock === 0 && (
                <span className="inline-block px-3 py-1 text-sm rounded-full bg-red-100 text-red-700">
                  Out of stock
                </span>
              )}

              {variant?.stock > 0 && variant.stock < 10 && (
                <span className="inline-block px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800">
                  Limited stock ({variant.stock} left)
                </span>
              )}

              {variant?.stock >= 10 && (
                <span className="inline-block px-3 py-1 text-sm rounded-full bg-green-100 text-green-700">
                  In stock
                </span>
              )}
            </div>

            {/* CTA */}
            <div className="pt-4 space-y-3">
              {/* BUY + CART */}
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleBuyNow}
                  disabled={variant?.stock === 0}
                  className={`flex-1 py-3 rounded-md text-base font-medium transition
        ${
          variant?.stock === 0
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[#8fbc8f] text-white hover:bg-[#93c572]"
        }`}
                >
                  Buy Now
                </button>

                <button
                  onClick={handleAddToCart}
                  disabled={variant?.stock === 0}
                  className={`flex-1 py-3 rounded-md border text-base font-medium transition
        ${
          variant?.stock === 0
            ? "border-gray-300 text-gray-400 cursor-not-allowed"
            : "border-[#8fbc8f] text-gray-900 hover:bg-gray-100"
        }`}
                >
                  Add to Cart
                </button>
              </div>

              {/* SUBSCRIPTION CTA */}
              {product?.isSubscribable && (
                <Link
                  to={`/subscribe/${product._id}`}
                  className="
      group
      flex items-center justify-center gap-2
      w-full py-3 rounded-xl
      bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500
      text-gray-900 font-semibold
      shadow-md
      hover:shadow-lg
      hover:opacity-95
      transition
    "
                >
                  <FaCrown className="text-lg text-yellow-900 group-hover:scale-110 transition" />
                  Subscribe for Daily Delivery
                </Link>
              )}
            </div>

            {/* DESCRIPTION */}
            {product?.shortDescription && (
              <div className="pt-0">
                <p className="text-gray-700 leading-relaxed">
                  {product.shortDescription}
                </p>
              </div>
            )}

            {/* META */}
            <div className="pt-0 space-y-1 text-sm text-gray-600">
              <p>
                <strong>Ingredients:</strong> {product?.ingredients?.join(", ")}
              </p>
              <p>
                <strong>Shelf Life:</strong> {product?.shelfLife}
              </p>
              <p>
                <strong>Storage:</strong> {product?.storageInstructions}
              </p>
              <p>
                <strong>Made in:</strong> {product?.madeIn}
              </p>
            </div>
          </motion.div>
        </div>

        {/* SIMILAR PRODUCTS */}
        {similarProducts.length > 0 && (
          <div className="mt-28">
            <h2 className="text-3xl font-bold mb-10">Similar Products</h2>
            <div className="grid md:grid-cols-4 gap-8">
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

          {!product?.reviews || product.reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet.</p>
          ) : (
            <div className="space-y-6">
              {product.reviews.map((review, index) => (
                <div
                  key={review._id || index}
                  className="bg-white border rounded-xl p-6 hover:shadow-md transition"
                >
                  {/* HEADER */}
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">
                      {review.name || "Anonymous"}
                    </h4>

                    {/* STAR RATING */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) =>
                        star <= (review.rating || 0) ? (
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
                  {review.comment && (
                    <p className="mt-3 text-gray-700 leading-relaxed text-sm">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
