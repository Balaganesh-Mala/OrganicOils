import { motion } from "framer-motion";

function BubbleLayer({ config }) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${config.z}`}>
      {[...Array(config.count)].map((_, i) => {
        const size =
          Math.random() * (config.size[1] - config.size[0]) +
          config.size[0];

        return (
          <motion.span
            key={i}
            className={`absolute rounded-full ${config.blur}`}
            style={{
              width: size,
              height: size,
              left: `${Math.random() * 100}%`,
              bottom: "-10%",
              opacity: config.opacity,
              background:
                "radial-gradient(circle at 30% 30%, rgba(255,220,140,0.95), rgba(255,180,90,0.35) 60%, transparent 75%)",
              boxShadow: "0 0 16px rgba(255, 200, 120, 0.45)",
            }}
            animate={{
              y: ["0%", "-120%"],
              x: [0, 12, -12, 0],
              opacity: [0, config.opacity, 0],
            }}
            transition={{
              duration: config.speed + Math.random() * 4,
              delay: Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}

export default BubbleLayer;