import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./LogIn.css";
import Mountains from "../assets/mountains.jpg";
import Fall from "../assets/fall.jpg";
import Hiking from "../assets/hiking.jpg";
import Google from "../assets/google.png";
import api from "../api/axios";

function LogIn() {
    const images = [Hiking, Fall, Mountains];
    const [currentImage, setCurrentImage] = useState(0);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prevImage) => (prevImage + 1) % images.length);
        }, 10000);
        return () => clearInterval(interval);
    }, [images.length]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await api.post("/api/auth/login", {
                email,
                password,
            });

            if (response.data.success) {
                // Store access and refresh tokens separately
                localStorage.setItem("accessToken", response.data.accessToken || response.data.token);
                if (response.data.refreshToken) {
                    localStorage.setItem("refreshToken", response.data.refreshToken);
                }
                localStorage.setItem("user", JSON.stringify(response.data.user));
                toast.success("Login successful!");
                setTimeout(() => navigate("/dashboard"), 800); // redirect to dashboard
            } else {
                toast.error(response.data.message || "Login failed.");
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error(error.response?.data?.message || "Something went wrong!");
        }

        setIsSubmitting(false);
    };

    const handleGoogleLogin = async () => {
        toast.info("Google login feature is not available.");
    };

    return (
        <div className="login-container">

            {/* Left Section with Sliding Image */}
            <motion.div
                className="login-image-section"
                key={currentImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0 }}
            >
                <img src={images[currentImage]} alt="Travel destination" className="login-image" />
                <div className="login-image-text">
                    <h1>TERRAVUE</h1>
                    <button className="BackButton" onClick={() => navigate("/")}>Back to Website →</button>
                    <h2>Capturing Moments, Creating Memories</h2>
                </div>
            </motion.div>

            {/* Right Section with Form */}
            <div className="login-form-section">
                <div className="login-form">
                    <h2>Log in</h2>
                    <p>Don't have an account? <Link to="/register">Sign up</Link></p>

                    <form onSubmit={handleLogin}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <motion.button
                            className="create-account-btn"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Logging in..." : "Log in"}
                        </motion.button>
                    </form>

                    <div className="login-options">
                        <p className="registerp">Or Log In With</p>
                        <div className="social-login">
                            <button className="google-btn" onClick={handleGoogleLogin}>
                                <img src={Google} alt="Google" /> Google
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LogIn;
