import Instagram from '../assets/instagram.png';
import Facebook from '../assets/facebook.png';
import { Link } from "react-router-dom";
import Telegram from '../assets/telegram.png';
import WhatsApp from '../assets/whatsapp.png';
import Gmail from '../assets/communication.png';

function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-12 px-6 md:px-12 lg:px-20">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* About Section */}
                <div>
                    <h3 className="text-xl font-bold mb-4 text-pink-500">About</h3>
                    <ul className="space-y-2">
                        <li><Link to="/about" className="hover:text-pink-400 transition-colors">About Us</Link></li>
                        <li><a href="/blogs" className="hover:text-pink-400 transition-colors">Blogs</a></li>
                        <li><a href="/gallery" className="hover:text-pink-400 transition-colors">Gallery</a></li>
                    </ul>
                </div>

                {/* Follow Us Section */}
                <div>
                    <h3 className="text-xl font-bold mb-4 text-pink-500">Follow Us</h3>
                    <ul className="space-y-3">
                        <li>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-pink-400 transition-colors">
                                <img src={Facebook} className="w-5 h-5" alt="Facebook" />
                                <span>Facebook</span>
                            </a>
                        </li>
                        <li>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-pink-400 transition-colors">
                                <img src={Instagram} className="w-5 h-5" alt="Instagram" />
                                <span>Instagram</span>
                            </a>
                        </li>
                        <li>
                            <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-pink-400 transition-colors">
                                <img src={WhatsApp} className="w-5 h-5" alt="WhatsApp" />
                                <span>WhatsApp</span>
                            </a>
                        </li>
                        <li>
                            <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-pink-400 transition-colors">
                                <img src={Telegram} className="w-5 h-5" alt="Telegram" />
                                <span>Telegram</span>
                            </a>
                        </li>
                        <li>
                            <a href="mailto:support@terravue.com" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-pink-400 transition-colors">
                                <img src={Gmail} className="w-5 h-5" alt="Mail" />
                                <span>Mail Us</span>
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Newsletter Section */}
                <div className="md:col-span-2 lg:col-span-1">
                    <h3 className="text-xl font-bold mb-4 text-pink-500">Stay Updated!</h3>
                    <p className="mb-4 text-gray-300">Get the latest offers and updates.</p>
                    <form className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            required
                            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-white"
                        />
                        <button
                            type="submit"
                            className="px-6 py-2 bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors font-medium"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>

                {/* Branding Section */}
                <div className="text-center lg:text-right">
                    <h1 className="text-3xl md:text-4xl font-bold text-pink-500 mb-2 font-['Kanit'] tracking-wider">TERRAVUE</h1>
                    <p className="text-gray-400">© 2025 TERRAVUE. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;