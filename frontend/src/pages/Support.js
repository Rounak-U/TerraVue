import React, { useState } from "react";
import "./Support.css";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import plusIcon from "../assets/plus.png";
import minusIcon from "../assets/minus.png";
import Footer from "../components/Footer";

function FAQItem({ question, answer }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="faq-item">
            <div className="faq-question" onClick={() => setIsOpen(!isOpen)}>
                {question}
                <motion.img
                    src={isOpen ? minusIcon : plusIcon}
                    alt="toggle icon"
                    className="faq-icon"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                />
            </div>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.4 }}
                className="faq-answer"
            >
                {answer}
            </motion.div>
        </div>
    );
}

function FeedbackForm() {
    const [comments, setComments] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="feedback-form-container">
            <h3>We Value Your Feedback!</h3>
            {submitted ? (
                <div className="thank-you-message">
                    <h4>Thank you for your feedback!</h4>
                    <p>Your input helps us improve our service.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="feedback-form">
                    <div className="comments">
                        <h4>Any additional comments?</h4>
                        <textarea
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            placeholder="Share your thoughts here..."
                        ></textarea>
                    </div>
                    <button type="submit" className="submit-feedback-btn">Submit</button>
                </form>
            )}
        </div>
    );
}

function Support() {
    const cardVariants = {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
        hover: { scale: 1.02, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" },
    };

    return (
        <div className="support-container">
            <div className="header-section">
                <div className="text-section">
                    <h1>Frequently Asked Questions</h1>
                    <h4>Find the answers you need. If not, <Link to="/contact" className="pink">contact us.</Link></h4>
                </div>
                <motion.div
                    className="image-section"
                    variants={cardVariants}
                    initial="initial"
                    whileInView="animate"
                >
                    <div className="image"></div>
                </motion.div>
            </div>
            <div className="faq-section">
                <div className="faq-left">
                    <h2>General FAQs</h2>
                    <p>
                        Everything you need to know about our tour packages and how they work. Can't
                        find an answer? <Link to="/chat" className="pink">Chat to our team.</Link>
                    </p>
                </div>
                <div className="faq-right">
                    <FAQItem
                        question="What are the different tour packages available?"
                        answer="We offer a wide range of tour packages for adventure, cultural, and relaxing getaways. You can browse all our packages on the Tour Packages page."
                    />
                    <FAQItem
                        question="Can I modify my booking after confirming?"
                        answer="Yes, you can modify your booking up to 48 hours before your scheduled trip. Please contact our support team for assistance."
                    />
                    <FAQItem
                        question="Are the prices on the website final?"
                        answer="The prices listed on the website include all basic costs. Additional fees may apply depending on your choice of add-ons, such as flights, insurance, or exclusive activities."
                    />
                    <FAQItem
                        question="Is there a cancellation policy?"
                        answer="Yes, we have a flexible cancellation policy. You can cancel your booking up to 7 days before departure for a full refund, subject to terms and conditions."
                    />
                </div>
            </div>
            <FeedbackForm /> {/* Add feedback form after FAQs */}
            <Footer />
        </div>
    );
}

export default Support;
