import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaStar, FaShoppingCart, FaFire } from "react-icons/fa";
import Swal from "sweetalert2";
import { addToCart } from "../../api/index.api";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const [variantIndex, setVariantIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const variant = product.variants[variantIndex];

  /* 🔢 Discount calculation */
  const discount =
    variant.mrp > variant.price
      ? Math.round(((variant.mrp - variant.price) / variant.mrp) * 100)
      : 0;

  /* 🛒 ADD TO CART */
  const handleAddToCart = async () => {
  const token = localStorage.getItem("token");

  // 🔒 USER NOT LOGGED IN
  if (!token) {
    Swal.fire({
      icon: "warning",
      title: "Login Required",
      text: "Please login to add products to your cart",
      confirmButtonText: "Login",
      confirmButtonColor: "#8fbc8f",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/login");
      }
    });
    return;
  }

  // ✅ USER LOGGED IN → ADD TO CART
  try {
    setLoading(true);

    await addToCart({
      productId: product._id,
      variantSku: variant.sku,
      quantity: 1,
    });

    Swal.fire({
      icon: "success",
      title: "Added to cart 🛒",
      timer: 1200,
      showConfirmButton: false,
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Failed to add",
      text: error?.response?.data?.message || "Something went wrong",
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="relative bg-[#f7f7f5] rounded-3xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">

      {/* 🔥 BESTSELLER */}
      {product.isBestSeller && (
        <span className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
          <FaFire className="text-xs" /> Bestseller
        </span>
      )}

      {/* 💸 DISCOUNT */}
      {discount > 0 && (
        <span className="absolute top-3 right-3 z-10 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
          {discount}% OFF
        </span>
      )}

      {/* IMAGE */}
      <Link to={`/products/${product._id}`}>
        <div className="bg-white h-52 w-full overflow-hidden group flex items-center justify-center">
          <img
            src={product.images?.[0]?.url}
            alt={product.productName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      </Link>

      {/* CONTENT */}
      <div className="p-5 space-y-2">

        {/* TITLE + RATING */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2">
            {product.productName}
          </h3>

          {product.ratings > 0 && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <FaStar className="text-yellow-500" />
              {product.ratings.toFixed(1)}
            </div>
          )}
        </div>

        {/* DESCRIPTION (FIXED) */}
        <p className="text-sm text-gray-600 line-clamp-2">
          {product.description}
        </p>

        {/* VARIANTS */}
        <div className="flex gap-2 flex-wrap mt-2">
          {product.variants.map((v, i) => (
            <button
              key={i}
              onClick={() => setVariantIndex(i)}
              className={`px-3 py-1 text-xs rounded-full border transition
                ${
                  i === variantIndex
                    ? "bg-green-100 text-green-800 border-green-300"
                    : "bg-white text-gray-600 border-gray-300 hover:border-gray-500"
                }`}
            >
              {v.weight}
            </button>
          ))}
        </div>

        {/* PRICE + CART */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-lg font-semibold text-gray-900">
              ₹{variant.price}
            </span>
            {variant.mrp > variant.price && (
              <span className="ml-2 text-sm line-through text-gray-400">
                ₹{variant.mrp}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={variant.stock === 0 || loading}
            className="p-3 rounded-xl bg-[#8fbc8f] text-white
                       hover:bg-[#93c572] transition
                       disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <FaShoppingCart />
          </button>
        </div>

        {/* STOCK */}
        {variant.stock === 0 && (
          <p className="text-xs text-red-500 font-medium">
            Out of stock
          </p>
        )}
      </div>
    </div>
  );
}
