import { useState } from "react";

export default function ImageMagnifier({ src, zoom = 2.5 }) {
  const [backgroundPosition, setBackgroundPosition] = useState("center");
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setBackgroundPosition(`${x}% ${y}%`);
  };

  return (
    <div className="w-full">
      {/* ================= MOBILE IMAGE (NO ZOOM) ================= */}
      <img
        src={src}
        alt="Product"
        className="block md:hidden w-full h-full object-cover rounded-2xl border"
        draggable={false}
      />

      {/* ================= DESKTOP ZOOM IMAGE ================= */}
      <div
        className="
          hidden md:block
          relative w-full h-[420px]
          rounded-2xl overflow-hidden border
          cursor-zoom-in
        "
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          setBackgroundPosition("center");
        }}
        onMouseMove={handleMouseMove}
      >
        {/* ZOOM BACKGROUND */}
        <div
          className="absolute inset-0 transition-all duration-200"
          style={{
            backgroundImage: `url(${src})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition,
            backgroundSize: isHovering ? `${zoom * 100}%` : "100%",
          }}
        />

        {/* BASE IMAGE */}
        <div className="block md:hidden px-4">
          <div className="bg-white p-3 rounded-3xl shadow-sm">
            <img
              src={src}
              alt="Product"
              className="w-full h-[260px] object-cover rounded-2xl"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
