import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./LogIn.css";
import Mountains from "../assets/mountains.jpg";
import Fall from "../assets/fall.jpg";
import Hiking from "../assets/hiking.jpg";
import api from "../api/axios";
import { GoogleLogin } from "@react-oauth/google";

function LogIn() {
    const images = [Hiking, Fall, Mountains];
    const [currentImage, setCurrentImage] = useState(0);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const navigate = useNavigate();
    const isGoogleConfigured = Boolean(process.env.REACT_APP_GOOGLE_CLIENT_ID);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prevImage) => (prevImage + 1) % images.length);
        }, 10000);
        return () => clearInterval(interval);
    }, [images.length]);

    const persistSession = (payload) => {
        if (!payload) return;
        const { accessToken, refreshToken, user } = payload;
        if (accessToken || payload.token) {
            localStorage.setItem("accessToken", accessToken || payload.token);
        }
        if (refreshToken) {
            localStorage.setItem("refreshToken", refreshToken);
        }
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await api.post("/api/auth/login", {
                email,
                password,
            });

            if (response.data.success) {
                persistSession(response.data);
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

    const handleGoogleSuccess = async (credentialResponse) => {
        if (!credentialResponse?.credential) {
            toast.error("Unable to verify Google credential");
            return;
        }

        setIsGoogleLoading(true);
        try {
            const response = await api.post("/api/auth/google", {
                credential: credentialResponse.credential,
            });

            if (response.data.success) {
                persistSession(response.data);
                toast.success("Logged in with Google");
                setTimeout(() => navigate("/dashboard"), 600);
            } else {
                toast.error(response.data.message || "Google login failed");
            }
        } catch (error) {
            console.error("Google login error:", error);
            toast.error(error.response?.data?.message || "Unable to sign in with Google");
        } finally {
            setIsGoogleLoading(false);
        }
    };

    const handleGoogleError = () => {
        toast.error("Google login was cancelled or failed. Please try again.");
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
                            {isGoogleConfigured ? (
                                <div className="google-btn-wrapper">
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={handleGoogleError}
                                        shape="pill"
                                        theme="outline"
                                        text="signin_with"
                                        width="260"
                                    />
                                    {isGoogleLoading && <p className="google-loading">Connecting to Google...</p>}
                                </div>
                            ) : (
                                <button className="google-btn" disabled>
                                    Google Sign-In unavailable
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LogIn;
