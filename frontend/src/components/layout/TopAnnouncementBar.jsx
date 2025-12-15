export default function TopAnnouncementBar() {
  return (
    <div className="w-full bg-[#8fbc8f] text-white overflow-hidden fixed top-0 left-0 z-50">
      <div className="relative flex">
        {/* TRACK */}
        <div className="flex whitespace-nowrap animate-marquee">
          <AnnouncementText />
          <AnnouncementText />
        </div>
      </div>
    </div>
  );
}

function AnnouncementText() {
  return (
    <div className="flex items-center gap-10 px-6 py-2 text-sm font-medium">
      <span>📞 Call us: +91 98765 43210</span>
      <span>🎉 Flat 10% OFF on first order</span>
      <span>🆕 New Product Launch: Cold Pressed Sesame Oil</span>
      <span>🚚 Free Delivery on orders above ₹999</span>
    </div>
  );
}
