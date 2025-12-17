import { Outlet } from "react-router-dom";

import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";
import MobileBottomNav from "../components/layout/MobileBottomNav.jsx";
//import TopAnnouncementBar from "../components/layout/TopAnnouncementBar";


export default function MainLayout() {
  return (
    <>
      {/*<TopAnnouncementBar />*/}
      <Navbar />
      <main className="pt-16 min-h-screen bg-[#faf8f6] pb-20 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
