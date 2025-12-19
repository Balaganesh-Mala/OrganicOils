import { useState, useContext, useEffect, useRef } from "react";
import { FiBell, FiMenu, FiLogOut, FiUser } from "react-icons/fi";
import { AdminAuthContext } from "../../context/AdminAuthContext";
import { getPublicSettings } from "../../api/settings.api";

const AdminNavbar = ({ toggleSidebar }) => {
  const { admin, logout } = useContext(AdminAuthContext);
  const [logo, setLogo] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);

  const profileRef = useRef(null);

  /* ================= LOAD LOGO ================= */
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await getPublicSettings();
        setLogo(res.data.settings?.logo?.url || null);
      } catch (err) {
        console.log("Settings Load Error:", err);
      }
    };

    loadSettings();
  }, []);

  /* ================= CLOSE DROPDOWN ON OUTSIDE CLICK ================= */
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow z-40 h-16 flex items-center px-4 md:ml-64">
      {/* MOBILE MENU */}
      <button
        className="md:hidden mr-4 text-gray-700 hover:text-orange-600"
        onClick={toggleSidebar}
      >
        <FiMenu size={26} />
      </button>

      {/* LOGO */}
      <div className="flex items-center">
        {logo ? (
          <img src={logo} alt="Admin Logo" className="h-10 object-contain" />
        ) : (
          <span className="font-semibold text-lg text-gray-700">
            Admin Panel
          </span>
        )}
      </div>

      <div className="flex-1"></div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-6">
        {/* PROFILE */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setOpenProfile((p) => !p)}
            className="flex items-center gap-2 focus:outline-none"
          >
            {/* Avatar */}
            <div className="h-9 w-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <FiUser size={18} />
            </div>

            <span className="hidden md:block text-sm font-medium text-gray-700">
              {admin?.fullName || "Admin"}
            </span>
          </button>

          {/* DROPDOWN */}
          {openProfile && (
            <div className="absolute right-0 mt-3 w-56 bg-white shadow-lg rounded-xl border p-4 text-sm z-50">
              <p className="font-semibold text-gray-800">
                {admin?.fullName || "Admin"}
              </p>
              <p className="text-gray-500 text-xs mb-3">{admin?.email || ""}</p>

              <div className="h-px bg-gray-200 my-3"></div>

              <button
                onClick={() => {
                  logout();
                  window.location.href = "/admin/login";
                }}
                className="flex items-center gap-2 text-red-600 w-full text-left hover:bg-red-50 px-3 py-2 rounded-lg"
              >
                <FiLogOut />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
