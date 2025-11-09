import React from "react";
import "./Contact.css";
import Con from "../assets/Contact.jpg";
import Footer from "../components/Footer";

function Contact() {
    return (
        <div className="Contact">
            <div className="ContactImage">
                <div className="Clim">
                    <img src={Con} alt="Contact" />
                    <div className="OverContact">
                        <h1>Contact Us</h1>
                    </div>
                </div>
            </div>
            <div className="Contact-TextForm">
                <div className="Contact-Text">
                    <h4>Contact</h4>
                    <h1>Have Questions? Feel Free To Write Us</h1>
                    <p>If you have any questions or need assistance, please feel free to contact us. We are here to help and ready to respond promptly to your inquiries.</p>
                </div>
                <div className="Contact-Form">
                    <form className="contact-form">
                        <input id="Name" placeholder="Name" />
                        <input id="Email" placeholder="Email" />
                        <textarea id="message" placeholder="Message"></textarea>
                        <button type="submit">Send Message</button>
                    </form>
                </div>

            </div>
            <Footer />
        </div>
    );
}

export default Contact;