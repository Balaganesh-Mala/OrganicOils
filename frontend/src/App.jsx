import { Route, Routes } from "react-router-dom";

import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/layout/ScrollToTop";
import MySubscriptions from "./pages/MySubscriptions";
import Subscribe from "./pages/Subscribe";
import ContactUs from "./pages/ContactUs";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/subscriptions" element={<MySubscriptions />} />
          <Route path="/subscribe/:productId" element={<Subscribe />} />
          <Route path="/contact" element={<ContactUs/>}/>
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
