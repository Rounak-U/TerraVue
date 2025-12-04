import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import "./Tour.css";

import GPS from "../assets/gps.png";
import Clock from "../assets/time.png";

import Kerala from "../assets/Munnar.jpg";
import Cappadocia from "../assets/cappadocia.jpg";
import Santorini from "../assets/Santorini.jpg";
import Bali from "../assets/bali.jpg";
import Phuket from "../assets/phuket.jpg";
import Maldives from "../assets/maldives1.jpg";
import Paris from "../assets/paris.jpg";
import Kyoto from "../assets/kyoto.jpg";
import Dubai from "../assets/dubai.jpg";
import Rome from "../assets/rome.jpg";
import Barcelona from "../assets/barcelona.jpg";
import NewYork from "../assets/newyork.jpg";
import Sydney from "../assets/sydney.jpg";
import Goa from "../assets/goa.jpg";
import Rajasthan from "../assets/rajasthan.jpg";
import { IoMdArrowRoundBack } from "react-icons/io";

const imageMap = {
    "Cappadocia": Cappadocia,
    "Santorini": Santorini,
    "Bali": Bali,
    "Phuket": Phuket,
    "Maldives": Maldives,
    "Paris": Paris,
    "Kyoto": Kyoto,
    "Dubai": Dubai,
    "Rome": Rome,
    "Barcelona": Barcelona,
    "New-York": NewYork,
    "Sydney": Sydney,
    "Goa": Goa,
    "Kerala": Kerala,
    "Rajasthan": Rajasthan
};

function Tour() {
    const navigate = useNavigate();
    const [tours, setTours] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const res = await (await import('../api/axios')).default.get('/api/tours');
                const data = res.data;
                const updated = data.map((tour) => ({
                    ...tour,
                    image: imageMap[tour.title] || ""
                }));
                setTours(updated);
            } catch (err) {
                console.error("Failed to fetch tours:", err);
            }
        };

        fetchTours();
    }, []);

    const convertCurrency = (price, currency) => {
        return currency === "INR"
            ? `₹${price.toLocaleString()}`
            : `$${price.toFixed(2)}`;
    };

    return (
        <div>
            <div className="UserDe"></div>
            <div className="Header">
                <div className="Headertext">
                    <Link to="/" className="Arrow">
                        <IoMdArrowRoundBack />
                    </Link>
                    <h4 className="Subheading">The Perfect Tour</h4>
                    <h1 className="MainHeading">Trending Destinations</h1>
                </div>
            </div>

            <div className="tour-grid">
                {tours.map((tour) => (
                    <motion.div key={tour._id} className="tour-card" whileHover={{ scale: 1.01 }}>
                        <img src={tour.image} alt={tour.title} />
                        <div className="tour-info">
                            <h3>{tour.title} - {tour.country}</h3>
                            <p className="Clock">
                                <div className="GPS">
                                    <img src={GPS} alt="GPS Icon" /> {tour.country}
                                </div>
                                <div className="Time">
                                    <img src={Clock} alt="Clock Icon" /> {tour.days} days
                                </div>
                            </p>
                            <div className="LocationDescription">{tour.description}</div>
                            <div className="FromDet">
                                <div>
                                    <p className="From">
                                        From <br />
                                        <strong>{convertCurrency(tour.price, tour.currency)}</strong>{" "}
                                        <s className="Old">{convertCurrency(tour.oldPrice, tour.currency)}</s>
                                    </p>
                                </div>
                                <div>
                                    <Link to={`/tour/${tour.title}`} className="details-button">Details</Link>

                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export default Tour;
