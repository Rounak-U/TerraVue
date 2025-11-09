import React from "react";
import "./Chat.css";
import Footer from "../components/Footer";

function Chat() {
    return (
        <div className="ChatMain">
            <div className="Chat-Division">
                <div className="ChatText">
                    <h1>Get Instant Support – We're Here to Help!</h1>
                    <p>Chat with our support team anytime for quick assistance. Whether you have questions about bookings, cancellations, or travel plans, we're just a message away!
                    </p>
                </div>
                <div className="ChatImage">
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Chat;