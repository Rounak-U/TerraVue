import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import "./Navbar.css";
import UserIcon from "../assets/user.png"; // 🖼️ your round user icon
import { useCart } from '../context/CartContext';

// Hamburger icon SVG as a separate component
function Hamburger({ onClick, isOpen }) {
    return (
        <button
            className="hamburger"
            aria-label="Toggle navigation menu"
            onClick={onClick}
            style={{
                background: 'none',
                border: 'none',
                padding: 0,
                marginLeft: 10,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                zIndex: 200,
                transition: 'transform 0.3s ease'
            }}
        >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect 
                    x={isOpen ? "6" : "0"} 
                    y="7" 
                    width={isOpen ? "20" : "32"} 
                    height="3.5" 
                    rx="1.75" 
                    fill="#D20055" 
                    transform={isOpen ? "rotate(45 16 8.75)" : "rotate(0 16 8.75)"}
                    style={{ transition: 'all 0.3s ease' }}
                />
                <rect 
                    x={isOpen ? "6" : "0"} 
                    y="14" 
                    width="32" 
                    height="3.5" 
                    rx="1.75" 
                    fill="#D20055" 
                    opacity={isOpen ? "0" : "1"}
                    style={{ transition: 'opacity 0.3s ease' }}
                />
                <rect 
                    x={isOpen ? "6" : "0"} 
                    y="21" 
                    width={isOpen ? "20" : "32"} 
                    height="3.5" 
                    rx="1.75" 
                    fill="#D20055" 
                    transform={isOpen ? "rotate(-45 16 22.75)" : "rotate(0 16 22.75)"}
                    style={{ transition: 'all 0.3s ease' }}
                />
            </svg>
        </button>
    );
}

function Navbar() {
    const [user, setUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { cartCount, loading: cartLoading } = useCart();

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
            {/* Hamburger for mobile */}
            <div className="navbar-hamburger" style={{ display: 'none' }}>
                <Hamburger onClick={() => setMenuOpen((open) => !open)} isOpen={menuOpen} />
            </div>
            <div className={`nav-contents${menuOpen ? ' open' : ''}`}>
                <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                <Link to="/about" onClick={() => setMenuOpen(false)}>About Us</Link>
                <button 
                    onClick={() => { setMenuOpen(false); user ? navigate('/dashboard') : navigate('/login'); }}
                    style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textDecoration: 'none' }}
                >
                    Tour Packages
                </button>
                <Link to="/support" onClick={() => setMenuOpen(false)}>Support</Link>
                {user && isPublicPage && (
                    <button className="dashboard-btn" onClick={() => { setMenuOpen(false); navigate('/dashboard'); }}>Dashboard</button>
                )}
                {!user && (
                    <Link to="/login" className="login-link" onClick={() => setMenuOpen(false)}>Login</Link>
                )}
            </div>
            {/* Backdrop for mobile menu */}
            {menuOpen && <div className="menu-backdrop" onClick={() => setMenuOpen(false)}></div>}

            {/* Right Side: Show avatar or login */}
            <div className="Login">
                {user ? (
                    isPublicPage ? (
                        <div className="user-section">
                            <button className="dashboard-btn bg-gradient-to-r from-pink-600 to-red-600 text-white px-6 py-3 rounded-lg font-semibold" onClick={() => { setMenuOpen(false); navigate('/dashboard'); }}>Dashboard</button>
                        </div>
                    ) : (
                        <div className="user-section flex items-center gap-4">
                            <button 
                                onClick={() => { setMenuOpen(false); navigate('/cart'); }}
                                className="relative text-2xl hover:text-blue-400 transition"
                                title="Shopping Cart"
                            >
                                <FaShoppingCart />
                                {!cartLoading && cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 text-xs bg-pink-500 text-white rounded-full px-1.5 py-0.5">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                            <img
                                src={UserIcon}
                                alt="Profile"
                                className="user-avatar"
                                onClick={() => { setMenuOpen(false); navigate("/profile"); }}
                            />
                            <button className="logout-btn" onClick={() => { setMenuOpen(false); handleLogout(); }}>
                                Logout
                            </button>
                        </div>
                    )
                ) : (
                    <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
                )}
            </div>
            {/* Hamburger visible on mobile only, using CSS */}
            <style>{`
                @media (max-width: 900px) {
                    .navbar-hamburger { display: flex !important; align-items: center; margin-left: auto; margin-right: 16px; }
                }
            `}</style>
        </nav>
    );
}

export default Navbar;
