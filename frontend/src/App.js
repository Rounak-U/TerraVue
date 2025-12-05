import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Support from "./pages/Support";
import ScrollToTop from "./components/ScrollToTop";
import LogIn from "./pages/LogIn";
import { Navigate } from 'react-router-dom';
import "./App.css";
import About from "./pages/About";
import Blogs from "./pages/Blogs";
import Contact from "./pages/Contact";
import After from "./pages/After";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import ExploreTours from "./pages/ExploreTours";
import TourDetail from "./pages/TourDetail";
import Cart from "./pages/Cart";
import BookingSuccess from "./pages/BookingSuccess";
import Favourites from "./pages/Favourites";
import SupportCenter from "./pages/SupportCenter";
import MyBookings from "./pages/MyBookings";
import AdminLogin from "./pages/AdminLogin";
import AdminSupportDesk from "./pages/AdminSupportDesk";
import AdminRoute from "./components/AdminRoute";
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotifyContext';

function Layout() {
  const location = useLocation();

  // Pages where Navbar should be hidden
  const hideNavbarPaths = ["/login", "/register", "/admin/login"];

  const showNavbar =
    !hideNavbarPaths.includes(location.pathname.toLowerCase()) &&
    !location.pathname.startsWith("/tour/") &&
    !location.pathname.startsWith("/dashboard") &&
    !location.pathname.startsWith("/profile") &&
    !location.pathname.startsWith("/cart") &&
    !location.pathname.startsWith("/booking-success") &&
    !location.pathname.startsWith("/explore-tours") &&
    !location.pathname.startsWith("/favourites") &&
    !location.pathname.startsWith("/support-center") &&
    !location.pathname.startsWith("/bookings") &&
    !location.pathname.startsWith("/admin");

  return (
    <div className="app">
      <ScrollToTop />
      {showNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/support" element={<Support />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/tour" element={<Navigate to="/dashboard" replace />} />
        <Route path="/about" element={<About />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/after" element={<After />} />
        <Route path="/chat" element={<ProtectedRoute element={<Chat />} />} />
        <Route path="/tour/:tourTitle" element={<ProtectedRoute element={<TourDetail />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/explore-tours" element={<ProtectedRoute element={<ExploreTours />} />} />
        <Route path="/cart" element={<ProtectedRoute element={<Cart />} />} />
        <Route path="/booking-success" element={<ProtectedRoute element={<BookingSuccess />} />} />
        <Route path="/favourites" element={<ProtectedRoute element={<Favourites />} />} />
        <Route path="/support-center" element={<ProtectedRoute element={<SupportCenter />} />} />
        <Route path="/bookings" element={<ProtectedRoute element={<MyBookings />} />} />
        <Route path="/admin/support" element={<AdminRoute element={<AdminSupportDesk />} />} />
      </Routes>

    </div>
  );
}

function App() {
  return (
    <NotificationProvider>
      <Router>
        <CartProvider>
          <Layout />
        </CartProvider>
      </Router>
    </NotificationProvider>
  );
}

export default App;
