import { NavLink, useLocation } from "react-router-dom";
import { FiHome, FiPackage, FiShoppingCart, FiUser, FiShoppingBag } from "react-icons/fi";
import { useCart } from "../../context/CartContext";


const tabs = [
  { to: "/", label: "Home", icon: FiHome },
  { to: "/products", label: "Products", icon: FiPackage },
  { to: "/cart", label: "Cart", icon: FiShoppingCart },
  { to: "/orders", label: "Orders", icon: FiShoppingBag },
  { to: "/profile", label: "Profile", icon: FiUser },
];

export default function MobileBottomNav() {
  const location = useLocation();
  const { cartCount } = useCart();

  const isActive = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 md:hidden flex justify-center">
      <div className="w-[92%] h-16 bg-white rounded-full shadow-lg flex items-center justify-between px-2">

        {tabs.map(({ to, label, icon: Icon }) => {
          const active = isActive(to);

          return (
            <NavLink
              key={to}
              to={to}
              className="flex-1 flex justify-center"
            >
              <div
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full transition-all
                  ${active ? "bg-[#eaf4ea] text-[#2f6a31]" : "text-gray-500"}
                `}
              >
                <div className="relative">
                  <Icon size={20} />

                  {/* CART BADGE */}
                  {label === "Cart" && cartCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-[#8fbc8f] text-white text-[10px] px-1.5 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </div>

                {active && (
                  <span className="text-xs font-medium">
                    {label}
                  </span>
                )}
              </div>
            </NavLink>
          );
        })}

      </div>
    </div>
  );
}
