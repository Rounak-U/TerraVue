import React from "react";
import "./Home.css";
import SampleVideo from "../assets/GW.mp4";
import Navbar from "../components/Navbar";
import { animate, motion } from 'framer-motion';
import Search from "../assets/search.png";
import Book from "../assets/book.png";
import Payment from "../assets/payment.png";
import Destination from "../assets/Destination.png";
import Footer from "../components/Footer";

function Home() {

    const cardVariants = {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <div className="body">
            <div className="Content">
                <div className="video-container">
                    <video className="video" src={SampleVideo} autoPlay loop muted />
                </div>
                <div className="FlexCards">
                    <div className="FCards">
                        <h1>10M+</h1>
                        <p>Customers</p>
                    </div>
                    <div className="FCards">
                        <h1>05+</h1>
                        <p>Years of Experience</p>
                    </div>
                    <div className="FCards">
                        <h1>500+</h1>
                        <p>Destinations Worldwide</p>
                    </div>
                    <div className="FCards">
                        <h1>4.7</h1>
                        <p>Average Rating</p>
                    </div>
                </div>
                <div>
                    <div className="BestTalk">
                        <motion.div
                            className="Best"
                            variants={cardVariants}
                            initial='initial'
                            whileInView='animate'
                        >
                            <p>Best location</p>
                            <h1>Indian Tourism</h1>
                        </motion.div>
                        <motion.div className="BestInfo"
                            variants={cardVariants}
                            initial='initial'
                            whileInView='animate'
                        >
                            <p>
                                Extraordinary natural beauty, enjoy the rich culture, and experience
                                the friendliness of the local people.
                            </p>
                        </motion.div>
                    </div>
                    <div className="Photos">
                        <div className="PSection1">
                            <motion.div
                                className="Photo1"
                                variants={cardVariants}
                                initial="initial"
                                whileInView="animate"
                            >
                                <h1>Taj Mahal, Agra</h1>
                                <h2>Agra Tour</h2>
                            </motion.div>
                            <motion.div
                                className="Photo2"
                                variants={cardVariants}
                                initial="initial"
                                whileInView="animate"
                            >
                                <h1>Rishikesh, Uttarakhand</h1>
                                <h2>Uttarakhand Tour</h2>
                            </motion.div>
                        </div>
                        <div className="PSection2">
                            <motion.div
                                className="Photo3"
                                variants={cardVariants}
                                initial="initial"
                                whileInView="animate"
                            >
                                <h1>Ladakh, Jammu & Kashmir</h1>
                                <h2>J&K Tour</h2>
                            </motion.div>
                            <motion.div
                                className="Photo4"
                                variants={cardVariants}
                                initial="initial"
                                whileInView="animate"
                            >
                                <h1>Munnar, Kerala</h1>
                                <h2>Kerala Tour</h2>
                            </motion.div>
                        </div>
                        <div className="PSection3">
                            <motion.div
                                className="Photo5"
                                variants={cardVariants}
                                initial="initial"
                                whileInView="animate"
                                whileHover="hover"
                            >
                                <h1>Manali, Himachal</h1>
                                <h2>Himachal Tour</h2>
                            </motion.div>
                            <motion.div
                                className="Photo6"
                                variants={cardVariants}
                                initial="initial"
                                whileInView="animate"
                                whileHover="hover"
                            >
                                <h1>Hawa Mahal, Jaipur</h1>
                                <h2>Jaipur Tour</h2>
                            </motion.div>
                        </div>
                    </div>
                </div>
                <div className="works">
                    {/* Animated Image Section */}
                    <motion.div
                        className="wpic"
                        whileInView={{ opacity: 1 }}
                        initial={{ opacity: 0 }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                    >
                        <p className="caption">
                            Embark on a journey to find your dream destination, where adventure and relaxation await,
                            creating unforgettable memories along the way.
                        </p>
                    </motion.div>

                    <motion.div
                        className="text"
                        whileInView={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 50 }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                    >
                        <p>How it works</p>
                        <h1>One click for you</h1>
                        <div className="wcards">
                            <motion.div
                                className="wcard"
                                whileHover={{ scale: 1.05 }}
                                whileInView={{ opacity: 1 }}
                                initial={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >

                                <img src={Search} className="Search"></img>
                                <h2>Find your destination</h2>
                                <p>
                                    Embark on a journey to discover your dream destination, where adventure and
                                    relaxation await.
                                </p>
                            </motion.div>
                            <motion.div
                                className="wcard"
                                whileHover={{ scale: 1.05 }}
                                whileInView={{ opacity: 1 }}
                                initial={{ opacity: 0 }}
                                transition={{ duration: 0.2, delay: 0.1 }}
                            >
                                <img src={Book} className="Book"></img>
                                <h2>Book a ticket</h2>
                                <p>
                                    Ensure a smooth travel experience by booking tickets to your preferred destination
                                    via our platform.
                                </p>
                            </motion.div>
                            <motion.div
                                className="wcard"
                                whileHover={{ scale: 1.05 }}
                                whileInView={{ opacity: 1 }}
                                initial={{ opacity: 0 }}
                                transition={{ duration: 0.2, delay: 0.2 }}
                            >
                                <img src={Payment} className="Payment"></img>
                                <h2>Make payment</h2>
                                <p>
                                    We offer various payment options to meet your preferences and ensure a hassle-free
                                    transaction process.
                                </p>
                            </motion.div>
                            <motion.div
                                className="wcard"
                                whileHover={{ scale: 1.05 }}
                                whileInView={{ opacity: 1 }}
                                initial={{ opacity: 0 }}
                                transition={{ duration: 0.2, delay: 0.3 }}
                            >
                                <img src={Destination} className="Destination"></img>
                                <h2>Explore destination</h2>
                                <p>
                                    You’ll be immersed in a captivating tapestry of sights, sounds, and tastes as you
                                    wind through the ancient streets.
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                <div className="testimonial-container">
                    <motion.div
                        className="testimonial-header"
                        variants={cardVariants}
                        initial="initial"
                        whileInView="animate"
                    >
                        <h2>What Our Customers Say</h2>
                    </motion.div>
                    <div className="testimonials">
                        <motion.div
                            className="testimonial-card"
                            variants={cardVariants}
                            initial="initial"
                            whileInView="animate"
                            whileHover="hover"
                        >
                            <p className="testimonial-text">
                                "An unforgettable experience! The trip to Rishikesh was perfectly organized, with all the details taken care of. Highly recommend!"
                            </p>
                            <h4>- Rounak V.U.</h4>
                        </motion.div>
                        <motion.div
                            className="testimonial-card"
                            variants={cardVariants}
                            initial="initial"
                            whileInView="animate"
                            whileHover="hover"
                        >
                            <p className="testimonial-text">
                                "Our family vacation in Kerala was amazing! The tour package covered everything, and the local guides were friendly and knowledgeable."
                            </p>
                            <h4>- Deepanshu & Family</h4>
                        </motion.div>
                        <motion.div
                            className="testimonial-card"
                            variants={cardVariants}
                            initial="initial"
                            whileInView="animate"
                            whileHover="hover"
                        >
                            <p className="testimonial-text">
                                "The Leh Ladakh tour was surreal! We had the best time exploring the landscapes, and everything was smooth from booking to the trip itself."
                            </p>
                            <h4>- Vinod B.U.</h4>
                        </motion.div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
}

export default Home;
