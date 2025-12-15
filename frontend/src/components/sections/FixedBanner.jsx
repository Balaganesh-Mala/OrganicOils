import { motion } from "framer-motion";
import bannerImg from "../../assets/images/banner.png";
import BubbleLayer from "../ui/BubbleLayer";

const smokeBlobs = [
  { top: "10%", left: "5%" },
  { top: "30%", left: "60%" },
  { top: "55%", left: "20%" },
  { top: "20%", left: "80%" },
];
const bubbleLayers = {
  foreground: {
    count: 6,
    size: [28, 40],
    blur: "blur-sm",
    opacity: 0.9,
    speed: 9,
    z: "z-30",
  },
  midground: {
    count: 8,
    size: [18, 28],
    blur: "blur",
    opacity: 0.65,
    speed: 13,
    z: "z-20",
  },
  background: {
    count: 10,
    size: [10, 18],
    blur: "blur-md",
    opacity: 0.35,
    speed: 18,
    z: "z-10",
  },
};

const oilBubbles = Array.from({ length: 12 }).map((_, i) => ({
  left: `${(i * 8) % 100}%`,
  size: 10 + (i % 4) * 6,
  delay: i * 1.2,
}));

export default function FixedBanner() {
  return (
    <section
      className="relative h-[70vh] flex items-center justify-center
                 bg-fixed bg-center bg-cover overflow-hidden"
      style={{ backgroundImage: `url(${bannerImg})` }}
    >
      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/40 z-0" />

      {/* 🌫️ SMOKE CLOUDS */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {smokeBlobs.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-[120px]"
            style={{
              width: "520px",
              height: "520px",
              top: pos.top,
              left: pos.left,
              background:
                "radial-gradient(circle, rgba(255,255,255,0.25), transparent 70%)",
            }}
            animate={{
              x: [0, 60, -40, 0],
              y: [0, -40, 30, 0],
              opacity: [0.25, 0.4, 0.25],
            }}
            transition={{
              duration: 22 + i * 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <BubbleLayer config={bubbleLayers.background} />
      <BubbleLayer config={bubbleLayers.midground} />
      <BubbleLayer config={bubbleLayers.foreground} />

      {/* 🫧 FLOATING OIL BUBBLES */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {oilBubbles.map((bubble, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              width: bubble.size + 12,
              height: bubble.size + 12,
              left: bubble.left,
              bottom: "-8%",
              background:
                "radial-gradient(circle at 30% 30%, rgba(255, 220, 140, 0.95), rgba(255, 180, 90, 0.35) 60%, transparent 75%)",
              boxShadow: "0 0 18px rgba(255, 200, 120, 0.45)",
            }}
            animate={{
              y: ["0%", "-120%"],
              x: [0, 10, -10, 0],
              opacity: [1, 2.85, 1],
            }}
            transition={{
              duration: 10 + i * 1.5,
              repeat: Infinity,
              delay: bubble.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* 🌿 CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative z-30 max-w-3xl mx-auto px-6 text-center text-white"
      >
        <h2 className="text-3xl md:text-5xl font-bold leading-tight">
          Pure. Traditional. Organic.
        </h2>

        <p className="mt-4 text-lg md:text-xl text-gray-200">
          Cold pressed oils, organic seeds & authentic pickles — crafted the
          traditional way for healthy living.
        </p>

        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <a
            href="/products"
            className="px-8 py-3 rounded-full text-lg font-medium
                       bg-[#8fbc8f] text-white
                       hover:bg-[#93c572] transition"
          >
            Shop Now
          </a>

          <a
            href="/products"
            className="px-8 py-3 rounded-full text-lg font-medium
                       border border-white/70 text-white
                       hover:bg-white/10 transition"
          >
            Explore Products
          </a>
        </div>
      </motion.div>
    </section>
  );
}
