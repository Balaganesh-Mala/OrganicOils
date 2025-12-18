import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import {
  FiMenu,
  FiX,
  FiShoppingCart,
  FiUser,
  FiPackage,
  FiHome,
} from "react-icons/fi";
import { FaCrown } from "react-icons/fa";

import { getPublicSettings, getCart } from "../../api/index.api";

const navLinkBase = "flex items-center gap-1 pb-1 transition relative";
const navLinkActive =
  "text-black after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-[#8fbc8f]";
const navLinkInactive = "text-gray-700 hover:text-black";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [logo, setLogo] = useState(null);
  const [storeName, setStoreName] = useState("Store");
  const { cartCount } = useCart();


  /* ================= LOAD SETTINGS ================= */
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await getPublicSettings();
        const settings = res.data.settings;

        setStoreName(settings?.storeName || "Store");
        setLogo(settings?.logo?.url || null);
      } catch (err) {
        console.error("Settings load failed", err);
      }
    };

    loadSettings();
  }, []);

  

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#faf9f7]/85 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* LOGO */}
        <NavLink to="/" className="flex items-center gap-3">
          {logo ? (
            <img
              src={logo}
              alt={storeName}
              className="w-10 h-10 object-contain"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded" />
          )}

          <span className="text-lg font-semibold text-gray-900">
            {storeName}
          </span>
        </NavLink>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/subscriptions"
            className={({ isActive }) =>
              `flex items-center gap-1 pb-1 transition relative
     ${
       isActive
         ? "text-black after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-[#d4af37]"
         : "text-gray-700 hover:text-black"
     }`
            }
          >
            <FaCrown size={18} className="text-[#d4af37]" />
            <span>Subscriptions</span>
          </NavLink>

          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`
            }
          >
            Orders
          </NavLink>

          {/* CART */}
          <NavLink
            to="/cart"
            className="relative text-gray-700 hover:text-black"
          >
            <FiShoppingCart size={20} />

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#8fbc8f] text-white text-xs rounded-full px-1.5">
                {cartCount}
              </span>
            )}
          </NavLink>

          {/* PROFILE */}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? "text-black" : "text-gray-700 hover:text-black"
            }
          >
            <FiUser size={20} />
          </NavLink>
        </div>

        {/* MOBILE MENU BUTTON */}
        <div className="md:hidden flex items-center gap-3">
          {/* SUBSCRIPTIONS ICON (MOBILE ONLY) */}
          <NavLink
            to="/subscriptions"
            className="flex items-center justify-center
      w-9 h-9 rounded-full
      bg-[#f1f7f1]
      hover:bg-[#e7f2e7]
      transition"
          >
            <FaCrown className="text-[#d4af37] text-lg" />
          </NavLink>

          {/* MENU TOGGLE */}
          <button
            className="text-2xl text-gray-700"
            onClick={() => setOpen(!open)}
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white border-t">
          <div className="px-6 py-4 flex flex-col gap-2">
            {/* HOME */}
            <NavLink
              to="/"
              end
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 py-2 px-3 rounded-lg transition
           ${
             isActive
               ? "bg-[#f1f7f1] text-black border-l-4 border-[#8fbc8f]"
               : "text-gray-700 hover:bg-gray-100"
           }`
              }
            >
              <FiHome size={18} />
              <span className="relative">
                Home
                {/* underline */}
                <span
                  className={`absolute left-0 -bottom-0.5 h-[2px] bg-[#8fbc8f] transition-all
              ${window.location.pathname === "/" ? "w-full" : "w-0"}
            `}
                />
              </span>
            </NavLink>

            {/* PRODUCTS */}
            <NavLink
              to="/products"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 py-2 px-3 rounded-lg transition
           ${
             isActive
               ? "bg-[#f1f7f1] text-black border-l-4 border-[#8fbc8f]"
               : "text-gray-700 hover:bg-gray-100"
           }`
              }
            >
              <FiPackage size={18} />
              <span className="relative">
                Products
                <span
                  className={`absolute left-0 -bottom-0.5 h-[2px] bg-[#8fbc8f]
              ${window.location.pathname === "/products" ? "w-full" : "w-0"}
            `}
                />
              </span>
            </NavLink>
            {/* SUBSCRIPTIONS */}
            <NavLink
              to="/subscriptions"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 py-2 px-3 rounded-lg transition
     ${
       isActive
         ? "bg-[#f1f7f1] text-black border-l-4 border-[#8fbc8f]"
         : "text-gray-700 hover:bg-gray-100"
     }`
              }
            >
              <FaCrown size={18} />
              Subscriptions
            </NavLink>

            {/* ORDERS */}
            <NavLink
              to="/orders"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 py-2 px-3 rounded-lg transition
           ${
             isActive
               ? "bg-[#f1f7f1] text-black border-l-4 border-[#8fbc8f]"
               : "text-gray-700 hover:bg-gray-100"
           }`
              }
            >
              <FiPackage size={18} />
              Orders
            </NavLink>

            {/* CART */}
            <NavLink
              to="/cart"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 py-2 px-3 rounded-lg transition
           ${
             isActive
               ? "bg-[#f1f7f1] text-black border-l-4 border-[#8fbc8f]"
               : "text-gray-700 hover:bg-gray-100"
           }`
              }
            >
              <FiShoppingCart size={18} />
              Cart
              {cartCount > 0 && (
                <span className="ml-auto bg-[#8fbc8f] text-white text-xs px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </NavLink>

            {/* PROFILE */}
            <NavLink
              to="/profile"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 py-2 px-3 rounded-lg transition
           ${
             isActive
               ? "bg-[#f1f7f1] text-black border-l-4 border-[#8fbc8f]"
               : "text-gray-700 hover:bg-gray-100"
           }`
              }
            >
              <FiUser size={18} />
              Profile
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
}
