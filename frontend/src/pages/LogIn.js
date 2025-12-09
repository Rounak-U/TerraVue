import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import "./LogIn.css";
import Mountains from "../assets/mountains.jpg";
import Fall from "../assets/fall.jpg";
import Hiking from "../assets/hiking.jpg";
import api from "../api/axios";
import adminApi, { ADMIN_TOKEN_KEY, persistAdminProfile } from "../api/admin";
import { GoogleLogin } from "@react-oauth/google";
import { useNotify } from "../context/NotifyContext";

function LogIn({ initialMode = "traveler" }) {
    const images = [Hiking, Fall, Mountains];
    const [currentImage, setCurrentImage] = useState(0);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [authMode, setAuthMode] = useState(initialMode);
    const navigate = useNavigate();
    const isGoogleConfigured = Boolean(process.env.REACT_APP_GOOGLE_CLIENT_ID);
    const notify = useNotify();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prevImage) => (prevImage + 1) % images.length);
        }, 10000);
        return () => clearInterval(interval);
    }, [images.length]);

    useEffect(() => {
        setAuthMode(initialMode);
    }, [initialMode]);

    const modeCopy = {
        traveler: {
            heading: "Log in",
            subText: (
                <p>
                    Don't have an account? <Link to="/register">Sign up</Link>
                </p>
            ),
            cta: "Log in",
        },
        admin: {
            heading: "Admin console access",
            subText: (
                <div className="login-helper-card">
                    <p>Use the concierge credentials shared with operations.</p>
                    <div className="admin-credential-chip">Email: admin@gmail.com</div>
                    <div className="admin-credential-chip">Password: Admin@123</div>
                </div>
            ),
            cta: "Enter console",
        },
    };

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

    const handleTravelerLogin = async () => {
        setIsSubmitting(true);

        try {
            const response = await api.post("/api/auth/login", {
                email,
                password,
            });

            if (response.data.success) {
                persistSession(response.data);
                notify.success("Login successful!");
                setTimeout(() => navigate("/dashboard"), 800);
            } else {
                notify.error(response.data.message || "Login failed.");
            }
        } catch (error) {
            console.error("Login error:", error);
            notify.error(error.response?.data?.message || "Something went wrong!");
        }

        setIsSubmitting(false);
    };

    const handleAdminLogin = async () => {
        setIsSubmitting(true);
        try {
            const { data } = await adminApi.post("/api/admin/login", { email: email.trim().toLowerCase(), password });
            localStorage.setItem(ADMIN_TOKEN_KEY, data.accessToken);
            persistAdminProfile(data.admin);
            notify.success("Admin verified. Redirecting to console...");
            setTimeout(() => navigate("/admin/support"), 600);
        } catch (err) {
            const message = err?.response?.data?.message || "Unable to sign in right now";
            notify.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (authMode === "admin") {
            await handleAdminLogin();
        } else {
            await handleTravelerLogin();
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        if (!credentialResponse?.credential) {
            notify.error("Unable to verify Google credential");
            return;
        }

        setIsGoogleLoading(true);
        try {
            const response = await api.post("/api/auth/google", {
                credential: credentialResponse.credential,
            });

            if (response.data.success) {
                persistSession(response.data);
                notify.success("Logged in with Google");
                setTimeout(() => navigate("/dashboard"), 600);
            } else {
                notify.error(response.data.message || "Google login failed");
            }
        } catch (error) {
            console.error("Google login error:", error);
            notify.error(error.response?.data?.message || "Unable to sign in with Google");
        } finally {
            setIsGoogleLoading(false);
        }
    };

    const handleGoogleError = () => {
        notify.error("Google login was cancelled or failed. Please try again.");
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
                <div className={`login-form ${authMode === "admin" ? "login-form-admin" : ""}`}>
                    <div className="login-mode-switch">
                        {["traveler", "admin"].map((mode) => (
                            <button
                                key={mode}
                                type="button"
                                className={`login-mode-button ${authMode === mode ? "active" : ""}`}
                                onClick={() => setAuthMode(mode)}
                            >
                                {mode === "traveler" ? "Traveler" : "Admin"}
                            </button>
                        ))}
                    </div>
                    <h2 className={`login-heading ${authMode === "admin" ? "login-heading-admin" : ""}`}>
                        {modeCopy[authMode].heading}
                    </h2>
                    {modeCopy[authMode].subText}

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
                            {isSubmitting ? "Processing..." : modeCopy[authMode].cta}
                        </motion.button>
                    </form>

                    {authMode === "traveler" ? (
                        <div className="login-options">
                            <p className="registerp">Or Log In With</p>
                            <div className="social-login flex justify-center">
                                {isGoogleConfigured ? (
                                    <div className="google-btn-wrapper flex justify-center">
                                        <div className="google-btn-embed w-36 md:w-48 max-w-full rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200">
                                            <GoogleLogin
                                                onSuccess={handleGoogleSuccess}
                                                onError={handleGoogleError}
                                                shape="pill"
                                                theme="filled_blue"
                                                text="signin_with"
                                            />
                                        </div>
                                        {isGoogleLoading && <p className="google-loading text-sm text-gray-400 mt-2 text-center">Connecting to Google...</p>}
                                    </div>
                                ) : (
                                    <button className="w-36 md:w-48 max-w-full flex items-center justify-center gap-3 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-500 border-2 border-gray-300 rounded-full font-semibold text-base md:text-lg cursor-not-allowed transition-all duration-200 shadow-md">
                                        Google Sign-In unavailable
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p className="login-admin-note">
                            Need traveler access? Switch back to the Traveler tab.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LogIn;
