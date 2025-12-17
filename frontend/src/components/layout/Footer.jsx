import { useEffect, useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getPublicSettings } from "../../api/index.api";

export default function Footer() {
  const [settings, setSettings] = useState(null);

  /* ================= LOAD STORE SETTINGS ================= */
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await getPublicSettings();
        setSettings(res.data.settings);
      } catch (err) {
        console.error("Failed to load footer settings", err);
      }
    };

    loadSettings();
  }, []);

  return (
    <footer className="w-full bg-[#faf7f5] pt-16 pb-6 border-t border-[#e6dcd8]">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-12">

        {/* ================= COMPANY INFO ================= */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            {settings?.logo?.url ? (
              <img
                src={settings.logo.url}
                alt={settings.storeName}
                className="w-12 h-12 object-contain"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded" />
            )}

            <h3 className="text-xl font-bold text-gray-900">
              {settings?.storeName || "Store"}
            </h3>
          </div>

          <p className="text-gray-600 leading-relaxed text-sm">
            {settings?.storeName || "Our store"} brings you 100% natural,
            cold-pressed oils, traditionally prepared seeds, and authentic
            homemade pickles. Pure ingredients, honest processes, and
            uncompromised quality.
          </p>
        </div>

        {/* ================= QUICK LINKS ================= */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Links
          </h4>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>
              <Link to="/" className="hover:text-[#8fbc8f] transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-[#8fbc8f] transition">
                Products
              </Link>
            </li>
            <li>
              <Link to="/orders" className="hover:text-[#8fbc8f] transition">
                Orders
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-[#8fbc8f] transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* ================= PRODUCT CATEGORIES ================= */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Our Products
          </h4>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>Cold Pressed Oils</li>
            <li>Organic Seeds</li>
            <li>Traditional Pickles</li>
            <li>Natural Food Products</li>
          </ul>
        </div>

        {/* ================= CONTACT INFO ================= */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Contact Us
          </h4>

          {settings?.supportPhone && (
            <div className="flex items-center gap-3 text-gray-700 mb-3 text-sm">
              <FaPhoneAlt className="text-[#8fbc8f]" />
              <span>{settings.supportPhone}</span>
            </div>
          )}

          {settings?.supportEmail && (
            <div className="flex items-center gap-3 text-gray-700 mb-3 text-sm">
              <FaEnvelope className="text-[#8fbc8f]" />
              <span>{settings.supportEmail}</span>
            </div>
          )}

          {settings?.address && (
            <div className="flex items-start gap-3 text-gray-700 text-sm">
              <FaMapMarkerAlt className="text-[#8fbc8f] mt-1" />
              <span className="whitespace-pre-line">
                {settings.address}
              </span>
            </div>
          )}
        </div>

      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="w-full text-center mt-12 pt-6 border-t border-[#e6dcd8]">
        <p className="text-gray-600 text-sm">
          © {new Date().getFullYear()}{" "}
          <strong className="text-gray-800">
            {settings?.storeName || "Store"}
          </strong>{" "}
          — All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
