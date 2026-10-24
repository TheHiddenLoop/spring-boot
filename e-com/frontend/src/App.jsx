import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Toasts from "./components/layout/Toasts";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import AdminPage from "./pages/AdminPage";
import ProductFormPage from "./pages/ProductFormPage";
import NotFound from "./pages/NotFound";
import { fetchProducts } from "./store/productsSlice";
import { APP_NAME, APP_TAGLINE } from "./config";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = `${APP_NAME} | ${APP_TAGLINE}`;
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <main className="min-h-[70vh] pt-6 pb-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/new" element={<ProductFormPage />} />
          <Route path="/admin/edit/:id" element={<ProductFormPage />} />
          <Route path="/add-product" element={<Navigate to="/admin/new" replace />} />
          <Route path="/add_product" element={<Navigate to="/admin/new" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Toasts />
    </BrowserRouter>
  );
}
