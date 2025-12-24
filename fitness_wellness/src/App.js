import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Faq from "./pages/Faq";
import Blog from "./pages/Blog";
import BlogId from "./components/BlogContent/Article/Article";
import Contact from "./pages/Contact";
import Footer from "./components/Footer/Footer";
import NotFound from "./components/NotFound/NotFound";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import ShopContext from "./components/ShopContext/ShopContext";
// Add these imports
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import UserProfile from "./components/Auth/UserProfile";

function App() {
  const location = useLocation();

  // Simple backend check
  const checkBackend = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/health');
      const data = await response.json();
      console.log('Backend status:', data.status);
    } catch (error) {
      console.warn('Backend connection failed. Make sure backend server is running on port 5000');
    }
  };

  // Check backend on app load
  useEffect(() => {
    checkBackend();
  }, []);

  return (
    <ShopContext>
      <Navbar />
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogId />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        {/* Add Auth Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
      <Footer />
    </ShopContext>
  );
}

export default App;