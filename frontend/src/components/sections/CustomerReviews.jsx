import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { FaStar } from "react-icons/fa";

import "swiper/css";

/* ===== DUMMY REVIEWS ===== */
const reviews = [
  { id: 1, name: "Priya N.", rating: 5, comment: "Very lightweight and comfortable to wear all day." },
  { id: 2, name: "Karthik R.", rating: 4, comment: "Good anti-tarnish quality, still looks new." },
  { id: 3, name: "Ritika J.", rating: 5, comment: "Lightweight and easy to carry for long hours." },
  { id: 4, name: "Shalini G.", rating: 5, comment: "Looks exactly like pictures on the website." },
  { id: 5, name: "Aarti D.", rating: 4, comment: "Looks classy on the wrist, packaging was beautiful." },
  { id: 6, name: "Anil K.", rating: 5, comment: "Premium feel and authentic quality." },
];

const ReviewCard = ({ review }) => (
  <div className="bg-white border rounded-xl px-5 py-4 shadow-sm w-[380px]">
    <div className="flex items-center gap-1 text-yellow-500 mb-2">
      {[...Array(5)].map((_, i) => (
        <FaStar
          key={i}
          size={14}
          className={i < review.rating ? "text-yellow-500" : "text-gray-300"}
        />
      ))}
    </div>

    <p className="text-sm text-gray-700 leading-relaxed mb-2">
      {review.comment}
    </p>

    <p className="text-sm font-medium text-gray-900">
      {review.name}
    </p>
  </div>
);

export default function CustomerReviews() {
  return (
    <section className="py-8 bg-[#faf8f6] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* TITLE */}
        <div className="text-center mb-14">
          <h2 className="text-3xl font-semibold text-gray-900">
            Our customers love us
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            ⭐ 4.8 star based on 611 customer reviews
          </p>
        </div>

        {/* ===== ROW 1 ===== */}
        <Swiper
          modules={[Autoplay]}
          loop
          speed={12000}              // 👈 ultra smooth
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          slidesPerView="auto"
          spaceBetween={24}
          className="mb-8"
        >
          {[...reviews, ...reviews].map((review, i) => (
            <SwiperSlide key={`row1-${i}`} className="!w-auto">
              <ReviewCard review={review} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* ===== ROW 2 (REVERSE DIRECTION) ===== */}
        <Swiper
          modules={[Autoplay]}
          loop
          speed={12000}
          autoplay={{
            delay: 0,
            reverseDirection: true,   // 👈 opposite direction
            disableOnInteraction: false,
          }}
          slidesPerView="auto"
          spaceBetween={24}
        >
          {[...reviews, ...reviews].map((review, i) => (
            <SwiperSlide key={`row2-${i}`} className="!w-auto">
              <ReviewCard review={review} />
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
}
