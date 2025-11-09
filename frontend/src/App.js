import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // <- import toastify styles
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Support from "./pages/Support";
import ScrollToTop from "./components/ScrollToTop";
import LogIn from "./pages/LogIn";
import Tour from "./pages/Tour";
import TourDetails from "./pages/TourDetails";
import "./App.css";
import About from "./pages/About";
import Blogs from "./pages/Blogs";
import Contact from "./pages/Contact";
import After from "./pages/After";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";

function Layout() {
  const location = useLocation();

  const showNavbar =
    !["/login", "/register", "/tour"].includes(location.pathname.toLowerCase()) &&
    !location.pathname.startsWith("/tour/");

  return (
    <div className="app">
      <ScrollToTop />
      {showNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/support" element={<Support />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/tour" element={<Tour />} />
        <Route path="/about" element={<About />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/after" element={<After />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/tour/:title" element={<TourDetails />} />
        <Route path="/profile" element={<Profile />} />
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
