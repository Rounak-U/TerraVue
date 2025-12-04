import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // <- import toastify styles
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

function Layout() {
  const location = useLocation();

  // Pages where Navbar should be hidden
  const hideNavbarPaths = ["/login", "/register"];

  const showNavbar =
    !hideNavbarPaths.includes(location.pathname.toLowerCase()) &&
    !location.pathname.startsWith("/tour/") &&
    !location.pathname.startsWith("/dashboard") &&
    !location.pathname.startsWith("/profile") &&
    !location.pathname.startsWith("/cart") &&
    !location.pathname.startsWith("/booking-success") &&
    !location.pathname.startsWith("/explore-tours") &&
    !location.pathname.startsWith("/favourites") &&
    !location.pathname.startsWith("/support-center");

  return (
    <div className="app">
      <ScrollToTop />
      {showNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/support" element={<Support />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LogIn />} />
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
      </Routes>

      {/* Global ToastContainer */}
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={true}
        closeButton={false}
        newestOnTop={true}
        limit={1}
      />


    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
