import { Link } from "react-router-dom";
import { FiAlertTriangle, FiHome } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf9f7] px-6">
      <div className="text-center max-w-md">

        {/* ICON */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[#eaf4ea] flex items-center justify-center">
            <FiAlertTriangle size={42} className="text-[#8fbc8f]" />
          </div>
        </div>

        {/* TITLE */}
        <h1 className="text-5xl font-bold text-gray-900 mb-2">
          404
        </h1>

        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Page Not Found
        </h2>

        {/* DESCRIPTION */}
        <p className="text-gray-600 text-sm mb-8 leading-relaxed">
          Sorry, the page you’re looking for doesn’t exist or may have been
          moved. Please check the URL or go back to the homepage.
        </p>

        {/* ACTION */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3
                     rounded-full bg-[#8fbc8f] text-white
                     hover:bg-[#93c572] transition"
        >
          <FiHome size={18} />
          Back to Home
        </Link>

      </div>
    </div>
  );
}
