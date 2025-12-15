import { Outlet } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
//import TopAnnouncementBar from "../components/layout/TopAnnouncementBar";


export default function MainLayout() {
  return (
    <>
      {/*<TopAnnouncementBar />*/}
      <Navbar />
      <main className="pt-20">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
