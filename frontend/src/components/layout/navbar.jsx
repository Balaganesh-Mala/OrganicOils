import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiShoppingCart,
  FiUser,
  FiPackage,
  FiHome,
} from "react-icons/fi";
import Logo from "../../assets/images/logo.jpg";

const navLinkBase = "flex items-center gap-1 pb-1 transition relative";
//checking
const navLinkActive =
  "text-black after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-[#8fbc8f]";

const navLinkInactive = "text-gray-700 hover:text-black";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#faf9f7]/85 backdrop-blur-mdborder-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* LOGO */}
        <NavLink to="/" className="flex items-center gap-3">
          <img
            src={Logo}
            alt="Pristine Organic Oils"
            className="w-10 h-10 object-contain"
          />
          <span className="text-lg font-semibold text-gray-900">
            Pristine Organic Oils
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
            className={({ isActive }) =>
              `relative ${
                isActive ? "text-black" : "text-gray-700 hover:text-black"
              }`
            }
          >
            <FiShoppingCart size={20} />
            <span className="absolute -top-2 -right-2 bg-[#8fbc8f] text-white text-xs rounded-full px-1.5">
              0
            </span>
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
        <button
          className="md:hidden text-2xl text-gray-700"
          onClick={() => setOpen(!open)}
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white border-t">
          <div className="px-6 py-4 flex flex-col gap-4">
            <NavLink
              to="/"
              end
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? "text-black font-medium border-l-4 border-[#8fbc8f] pl-3"
                  : "text-gray-700"
              }
            >
              <FiHome /> Home
            </NavLink>

            <NavLink
              to="/products"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? "text-black font-medium border-l-4 border-[#8fbc8f] pl-3"
                  : "text-gray-700"
              }
            >
              <FiPackage /> Products
            </NavLink>

            <NavLink
              to="/orders"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? "text-black font-medium border-l-4 border-[#8fbc8f] pl-3"
                  : "text-gray-700"
              }
            >
              Orders
            </NavLink>

            <NavLink
              to="/cart"
              onClick={() => setOpen(false)}
              className="text-gray-700"
            >
              <FiShoppingCart /> Cart
            </NavLink>

            <NavLink
              to="/profile"
              onClick={() => setOpen(false)}
              className="text-gray-700"
            >
              <FiUser /> Profile
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
}
