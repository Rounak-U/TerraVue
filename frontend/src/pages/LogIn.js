import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
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
                <div className="text-left bg-white/5 border border-white/10 rounded-2xl p-4 text-gray-300 mb-4 text-sm leading-relaxed">
                    <p className="mb-3 text-gray-400">Use the concierge credentials shared with operations.</p>
                    <div className="mt-2 inline-flex items-center py-1 px-3 rounded-full bg-white/10 text-xs tracking-wide">Email: admin@gmail.com</div>
                    <div className="mt-2 inline-flex items-center py-1 px-3 rounded-full bg-white/10 text-xs tracking-wide">Password: Admin@123</div>
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
        <div className="flex flex-col md:flex-row h-screen overflow-hidden md:overflow-auto">

            {/* Left Section with Sliding Image */}
            <motion.div
                className="flex-1 md:flex-[0.7] relative p-2 bg-gray-900"
                key={currentImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0 }}
            >
                <img src={images[currentImage]} alt="Travel destination" className="w-full md:ml-10 h-96 md:h-screen object-cover rounded-2xl object-center" />
                <div className="absolute inset-0 flex flex-col justify-end items-start p-4 md:p-8">
                    <h1 className="text-pink-500 font-bold font-['Poppins'] text-2xl md:text-3xl mb-4">TERRAVUE</h1>
                    <button className="absolute top-4 right-4 md:top-8 md:right-8 px-3 py-1 md:px-4 md:py-2 bg-white/20 border border-white/30 rounded-lg text-white font-semibold text-xs md:text-sm cursor-pointer transition-all duration-200 hover:bg-white/40 hover:-translate-y-0.5" onClick={() => navigate("/")}>Back to Website →</button>
                    <h2 className="text-white font-['Gill Sans'] tracking-wider font-medium text-2xl md:text-4xl w-full md:w-3/5">Capturing Moments, Creating Memories</h2>
                </div>
            </motion.div>

            {/* Right Section with Form */}
            <div className="flex-1 bg-gray-900 flex justify-center items-center p-5 md:p-0">
                <div className={`bg-gray-900 p-5 md:p-10 w-full max-w-lg text-center rounded-xl ${authMode === "admin" ? "text-sm" : ""}`}>
                    <div className="flex gap-3 mb-4 md:mb-6">
                        {["traveler", "admin"].map((mode) => (
                            <button
                                key={mode}
                                type="button"
                                className={`flex-1 py-2 md:py-3 px-3 md:px-4 rounded-full border border-white/20 bg-transparent text-gray-300 uppercase tracking-widest text-xs cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-pink-500 hover:to-pink-600 hover:text-black hover:border-transparent ${authMode === mode ? "bg-gradient-to-r from-pink-500 to-pink-600 text-black border-transparent" : ""}`}
                                onClick={() => setAuthMode(mode)}
                            >
                                {mode === "traveler" ? "Traveler" : "Admin"}
                            </button>
                        ))}
                    </div>
                    <h2 className={`text-white mb-5 md:mb-10 text-left font-medium text-3xl md:text-4xl ${authMode === "admin" ? "text-2xl md:text-3xl tracking-wide" : ""}`}>
                        {modeCopy[authMode].heading}
                    </h2>
                    {modeCopy[authMode].subText}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg outline-none transition-colors duration-300 focus:border-pink-500"
                        />

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg outline-none transition-colors duration-300 focus:border-pink-500"
                        />

                        <motion.button
                            className="w-full py-3 md:py-4 bg-pink-600 text-white border-none rounded-lg text-base md:text-lg font-bold cursor-pointer transition-colors duration-300 hover:bg-pink-700"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Processing..." : modeCopy[authMode].cta}
                        </motion.button>
                    </form>

                    {authMode === "traveler" ? (
                        <div className="mt-5 text-gray-400 text-center">
                            <p className="mb-4">Or Log In With</p>
                            <div className="flex justify-center">
                                {isGoogleConfigured ? (
                                    <div className="flex justify-center">
                                        <div className="w-64 md:w-80 max-w-full rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200">
                                            <GoogleLogin
                                                onSuccess={handleGoogleSuccess}
                                                onError={handleGoogleError}
                                                shape="pill"
                                                theme="outline"
                                                text="signin_with"
                                            />
                                        </div>
                                        {isGoogleLoading && <p className="text-sm text-gray-400 mt-2 text-center">Connecting to Google...</p>}
                                    </div>
                                ) : (
                                    <button className="w-64 md:w-80 max-w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-500 border-2 border-gray-300 rounded-full font-semibold text-base md:text-lg cursor-not-allowed transition-all duration-200 shadow-md">
                                        Google Sign-In unavailable
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm mt-6">
                            Need traveler access? Switch back to the Traveler tab.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LogIn;
