import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./Register.css";
import Mountains from "../assets/mountains.jpg";
import Fall from "../assets/fall.jpg";
import Hiking from "../assets/hiking.jpg";
import Google from "../assets/google.png";
import axios from "axios";

function Register() {
    const images = [Hiking, Fall, Mountains];
    const [currentImage, setCurrentImage] = useState(0);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
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

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

        if (!passwordStrengthRegex.test(password)) {
            toast.warn("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
            setIsSubmitting(false);
            return;
        }

        try {
            const fullName = `${firstName} ${lastName}`;

            const response = await axios.post("http://localhost:5000/api/auth/register", {
                name: fullName,
                email,
                password,
            });

            if (response.data.success) {
                toast.success("Account created! Redirecting to login...");
                setTimeout(() => navigate("/login"), 1500);
            } else {
                toast.error(response.data.message || "Registration failed.");
            }
        } catch (error) {
            console.error("Registration error:", error);
            toast.error(error.response?.data?.message || "Something went wrong!");
        }

        setIsSubmitting(false);
    };

    const handleGoogleLogin = async () => {
        toast.info("Google registration feature is not available.");
    };

    return (
        <div className="login-container">

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

            <div className="login-form-section">
                <div className="login-form">
                    <h2>Create an account</h2>
                    <p>Already have an account? <Link to="/login">Log in</Link></p>

                    <form onSubmit={handleRegister}>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="First Name"
                                required
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                required
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                        <input
                            type="email"
                            placeholder="Email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Enter your password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <div className="terms">
                            <input type="checkbox" id="terms" required />
                            <label htmlFor="terms">
                                I agree to the <a href="#">Terms & Conditions</a>
                            </label>
                        </div>

                        <motion.button
                            className="create-account-btn"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating account..." : "Create account"}
                        </motion.button>
                    </form>

                    <div className="login-options">
                        <p className="registerp">Or Register With</p>
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

export default Register;
