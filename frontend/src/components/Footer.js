import "./Footer.css";
import Instagram from '../assets/instagram.png';
import Facebook from '../assets/facebook.png';
import { Link } from "react-router-dom";
import Telegram from '../assets/telegram.png';
import WhatsApp from '../assets/whatsapp.png';
import Gmail from '../assets/communication.png';

function Footer() {
    return (
        <div className="footer-container">
            <div className="footer-about">
                <h3>About</h3>
                <Link to="/about">About Us</Link>
                <a href="/blogs">Blogs</a>
                <a href="/gallery">Gallery</a>
            </div>
            <div className="footer-support">
                <h3>Follow Us</h3>
                <a href="#"><img src={Facebook} className="social-icon" alt="Facebook" />Facebook</a>
                <a href="#"><img src={Instagram} className="social-icon" alt="Instagram" />Instagram</a>
                <a href="#"><img src={WhatsApp} className="social-icon" alt="WhatsApp" />WhatsApp</a>
                <a href="#"><img src={Telegram} className="social-icon" alt="Telegram" />Telegram</a>
                <a href="#"><img src={Gmail} className="social-icon" alt="Mail" />Mail Us</a>
            </div>
            <div className="footer-newsletter">
                <h3>Stay Updated with Our Latest Offers!</h3>
                <form className="newsletter-form">
                    <input type="email" placeholder="Enter your email" required />
                    <button type="submit" className="subscribe-btn">Subscribe</button>
                </form>
            </div>
            <div className="footer-branding">
                <h1>TERRAVUE</h1>
                <p>© 2025 TERRAVUE. All rights reserved.</p>
            </div>
        </div>
    );
}

export default Footer;