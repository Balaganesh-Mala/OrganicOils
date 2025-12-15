import { useState } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaShoppingCart } from "react-icons/fa";

export default function ProductCard({ product }) {
  const [variantIndex, setVariantIndex] = useState(0);
  const variant = product.variants[variantIndex];

  return (
    <div className="bg-[#f7f7f5] rounded-3xl  transition hover:shadow-lg border border-gray-500 hover:border-gray-200 overflow-hidden">
      {/* IMAGE */}
      <Link to={`/products/${product._id}`}>
        <div className="bg-white  h-48 w-full overflow-hidden flex items-center justify-center ">
          <img
            src={product.images[0].url}
            alt={product.productName}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>

      {/* CONTENT */}
      <div className="mt-4 space-y-1 px-5 pb-5">
        {/* TITLE + RATING */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 text-base leading-snug">
            {product.productName}
          </h3>

          {product.ratings && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <FaStar className="text-yellow-500" />
              {product.ratings}
            </div>
          )}
        </div>

        {/* SHORT DESCRIPTION */}
        <p className="text-sm text-gray-600 leading-snug">
          {product.shortDescription}
        </p>

        {/* VARIANTS (SIZE / WEIGHT PILLS) */}
        <div>
          <div className="flex gap-2 flex-wrap">
            {product.variants.map((v, i) => (
              <button
                key={i}
                onClick={() => setVariantIndex(i)}
                className={`px-3 py-1 text-sm rounded-full border transition
                  ${
                    i === variantIndex
                      ? "bg-green-100 text-black border-gray-100"
                      : "bg-white text-gray-700 border-gray-300 hover:border-gray-900"
                  }`}
              >
                {v.weight}
              </button>
            ))}
          </div>
        </div>

        {/* PRICE */}
        <div className="flex items-center gap-2 pt-2">
          <span className="text-lg font-semibold text-gray-900">
            ₹{variant.price}
          </span>

          <span className="text-sm line-through text-gray-400">
            ₹{variant.mrp}
          </span>
        </div>

        {/* BUTTON */}
        <button
          disabled={variant.stock === 0}
          className="w-full mt-3 flex items-center justify-center gap-2
                     bg-[#8fbc8f] text-white py-2.5 rounded-xl
                     hover:bg-[#93c572] transition
                     disabled:bg-gray-300"
        >
          <FaShoppingCart />
          Add to cart
        </button>
      </div>
    </div>
  );
}
