import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/* ================= HERO BACKGROUND IMAGES ================= */
import image1 from "../../assets/images/hero1.png";
import image2 from "../../assets/images/hero2.png";
import image3 from "../../assets/images/hero3.png";

/* ================= CATEGORY CARD IMAGES ================= */
import heroCard1 from "../../assets/images/heroCard1.png";
import heroCard2 from "../../assets/images/heroCard2.png";
import heroCard3 from "../../assets/images/heroCard3.png";
import heroCard4 from "../../assets/images/heroCard4.png";
import heroCard5 from "../../assets/images/heroCard5.png";
import heroCard6 from "../../assets/images/heroCard6.png";
import heroCard7 from "../../assets/images/heroCard7.png";

export default function Hero() {
  const navigate = useNavigate();

  /* ================= HERO SLIDES ================= */
  const slides = [
    {
      title: "Pure & Traditional Organic Oils",
      subtitle: "Cold pressed. Chemical free. Straight from farmers.",
      image: image1,
    },
    {
      title: "Healthy Cooking Starts Here",
      subtitle: "Traditional methods for modern kitchens.",
      image: image2,
    },
    {
      title: "Taste the Authenticity",
      subtitle: "Oils, pickles & seeds made with care.",
      image: image3,
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  /* ================= CATEGORY CARDS ================= */
  const categories = [
    {
      title: "Cold Pressed Oils",
      slug: "cold-pressed-oils",
      image: heroCard1,
    },
    {
      title: "Organic Seeds",
      slug: "organic-seeds",
      image: heroCard2,
    },
    {
      title: "Traditional Pickles",
      slug: "traditional-pickles",
      image: heroCard3,
    },
    {
      title: "Cooking Oils",
      slug: "cooking-oils",
      image: heroCard4,
    },
    {
      title: "Groundnut Products",
      slug: "groundnut-products",
      image: heroCard5,
    },
    {
      title: "Healthy Snacks",
      slug: "healthy-snacks",
      image: heroCard6,
    },
    {
      title: "Millets",
      slug: "millets",
      image: heroCard7,
    },
  ];

  const [cardIndex, setCardIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCardIndex((prev) => (prev + 1) % categories.length);
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  const visibleCards = Array.from({ length: 7 }, (_, i) =>
    categories[(cardIndex + i) % categories.length]
  );

  return (
    <section className="relative w-full h-[100vh] overflow-hidden">
      {/* ================= BACKGROUND SLIDES ================= */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url(${slide.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ))}

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/30" />

      {/* ================= CENTER TEXT ================= */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-2xl">
          {/*slides[currentSlide].title*/}
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mt-4 max-w-2xl">
          {/*slides[currentSlide].subtitle*/}
        </p>
      </div>

      {/* ================= DOTS ================= */}
      <div className="absolute bottom-40 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`w-3 h-3 rounded-full ${
              currentSlide === i ? "bg-[#9a6b63]" : "bg-white/40"
            }`}
          />
        ))}
      </div>

      {/* ================= CATEGORY CARDS ================= */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center">
        <div className="flex gap-6 items-end">
          <CategoryCard img={visibleCards[6]} size="sm" rotate={-6} />
          <CategoryCard img={visibleCards[0]} size="md" rotate={-6} />
          <CategoryCard img={visibleCards[1]} size="lg" rotate={-3} />
          <CategoryCard
            img={visibleCards[2]}
            size="xl"
            center
            onClick={() =>
              navigate(`/products?category=${visibleCards[2].slug}`)
            }
          />
          <CategoryCard img={visibleCards[3]} size="lg" rotate={3} />
          <CategoryCard img={visibleCards[4]} size="md" rotate={6} />
          <CategoryCard img={visibleCards[5]} size="sm" rotate={6} />
        </div>
      </div>
    </section>
  );
}

/* ================= CATEGORY CARD ================= */

function CategoryCard({ img, size, rotate = 0, center = false, onClick }) {
  const sizes = {
    sm: "w-[100px] h-[160px]",
    md: "w-[120px] h-[180px]",
    lg: "w-[140px] h-[200px]",
    xl: "w-[170px] h-[240px]",
  };

  return (
    <motion.div
      onClick={onClick}
      className={`cursor-pointer ${sizes[size]}
        rounded-2xl overflow-hidden shadow-xl
        bg-white/10 backdrop-blur-lg
        border border-white/20 hover:border-[#9a6b63]`}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{
        opacity: 1,
        y: center ? -10 : 0,
        scale: center ? 1.1 : 1,
        rotate,
      }}
      whileHover={{ scale: 1.15, rotate: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
    >
      <motion.img
        src={img.image}
        alt={img.title}
        className="w-full h-full object-cover"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
