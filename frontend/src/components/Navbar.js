import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="logo">
                <h1>TERRAVUE</h1>
            </div>
            <div className="nav-contents">
                <Link to="/">Home</Link>
                <Link to="/about">About Us</Link>
                <Link to="/Tour">Tour Packages</Link>
                <Link to="/support">Support</Link>
            </div>

            {/* Right Side: Show avatar or login */}
            <div className="Login">
                {user ? (
                    <div className="user-section">
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
                ) : (
                    <Link to="/LogIn">Login</Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
