import Hero from "../components/sections/Hero";
import BestSeller from "../components/sections/BestSeller";
import FeaturedProducts from "../components/sections/FeaturedProducts";
import FixedBanner from "../components/sections/FixedBanner";
import RecentlyViewed from "../components/sections/RecentlyViewed";
import CustomerReviews from "../components/sections/CustomerReviews";
import InstagramVideos from "../components/sections/InstagramVideos";
import CategorySection from "../components/sections/CategorySection";

const Home = () => {
  return (
    <>
      <Hero />
      <CategorySection />
      <BestSeller />
      <FeaturedProducts />
      <FixedBanner />
      <RecentlyViewed/>
      <CustomerReviews />
      <InstagramVideos />
    </>
  );
}
export default Home;