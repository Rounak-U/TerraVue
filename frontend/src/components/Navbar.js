import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import "./Navbar.css";
import UserIcon from "../assets/user.png"; // 🖼️ your round user icon

function Navbar() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = async () => {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
                // call backend to revoke refresh token (best-effort)
                const { default: api } = await import('../api/axios');
                await api.post('/api/auth/logout', { token: refreshToken });
            }
        } catch (err) {
            // ignore errors
            console.warn("Logout request failed", err);
        }

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
    };

    const location = useLocation();

    const publicPaths = ["/", "/about", "/tour", "/support"];
    const path = location.pathname.toLowerCase();
    const isPublicPage = publicPaths.includes(path) || path.startsWith('/tour');

    return (
        <nav className="navbar">
            <div className="logo">
                <h1>TERRAVUE</h1>
            </div>
            <div className="nav-contents">
                <Link to="/">Home</Link>
                <Link to="/about">About Us</Link>
                <button 
                    onClick={() => user ? navigate('/dashboard') : navigate('/login')}
                    style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textDecoration: 'none' }}
                >
                    Tour Packages
                </button>
                <Link to="/support">Support</Link>
            </div>

            {/* Right Side: Show avatar or login */}
            <div className="Login">
                {user ? (
                    isPublicPage ? (
                        <div className="user-section">
                            <button className="dashboard-btn bg-gradient-to-r from-pink-600 to-red-600 text-white px-6 py-3 rounded-lg font-semibold" onClick={() => navigate('/dashboard')}>Dashboard</button>
                        </div>
                    ) : (
                        <div className="user-section flex items-center gap-4">
                            <button 
                                onClick={() => navigate('/cart')}
                                className="text-2xl hover:text-blue-400 transition"
                                title="Shopping Cart"
                            >
                                <FaShoppingCart />
                            </button>
                            <img
                                src={UserIcon}
                                alt="Profile"
                                className="user-avatar"
                                onClick={() => navigate("/profile")}
                            />
                            <button className="logout-btn" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    )
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
