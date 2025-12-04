import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

import { IoMdArrowRoundBack, IoMdCart } from "react-icons/io";
import "./TourDetails.css";

// Icons
import Tag from "../assets/tag.png";
import Clock from "../assets/time.png";
import People from "../assets/user.png";
import Minimum from "../assets/photo.png";
import Check from "../assets/check.png";

// Sample fallback image (until dynamic images are handled via DB or file uploads)
import Kyoto from "../assets/kyoto.jpg";

const TourDetails = () => {
    const { title } = useParams();
    console.log("Title from URL:", title);
    const [tour, setTour] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTour = async () => {
            try {
                const response = await api.get(`/api/tours/${title}`);
                setTour(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching tour:", error);
                setLoading(false);
            }
        };
        fetchTour();
    }, [title]);

    const convertCurrency = (price, currency) => {
        return currency === "INR" ? `₹${price.toLocaleString()}` : `$${price.toFixed(2)}`;
    };

    if (loading) return <div>Loading...</div>;
    if (!tour) return <div>Tour not found</div>;

    return (
        <div className="tour-details">
            <div className='HeaderText'>
                <Link to="/dashboard" className="Arrow"><IoMdArrowRoundBack /></Link>
                <div className='HeaderTextContent'>
                    <h4>{tour.country}</h4>
                    <h1>{tour.title} - {tour.country}</h1>
                </div>
                <div className='AddCart'>
                    <button className='CartButton'>Add
                        <div className='Cart'><IoMdCart /></div>
                    </button>
                </div>
            </div>

            <div className='Components'>
                <div className='component'>
                    <img src={Tag} alt="Price Tag" />
                    <div className="text">
                        <p>From</p>
                        <strong>{convertCurrency(tour.price, tour.currency)}</strong>
                    </div>
                </div>
                <div className='component'>
                    <img src={Clock} alt="Clock Icon" />
                    <div className="text">
                        <p>Duration</p>
                        <strong>{tour.days} Days</strong>
                    </div>
                </div>
                <div className='component'>
                    <img src={People} alt="People Icon" />
                    <div className="text">
                        <p>Max People</p>
                        <strong>{tour.people || "N/A"}</strong>
                    </div>
                </div>
                <div className='component'>
                    <img src={Minimum} alt="Age Icon" />
                    <div className="text">
                        <p>Min Age</p>
                        <strong>{tour.age || "N/A"}</strong>
                    </div>
                </div>
            </div>

            {/* Static image gallery for now */}
            <div className="image-gallery">
                <img src={Kyoto} alt="Gallery" className="gallery-item small" />
                <img src={Kyoto} alt="Gallery" className="gallery-item large" />
                <img src={Kyoto} alt="Gallery" className="gallery-item small" />
                <img src={Kyoto} alt="Gallery" className="gallery-item small" />
                <img src={Kyoto} alt="Gallery" className="gallery-item small" />
            </div>

            <div className='AboutTour'>
                <h3>About This Tour</h3>
                <p className='des'>{tour.description}</p>
            </div>

            <div className='Highlights'>
                <h3>Highlights</h3>
                <p><img src={Check} alt="check" /> Learn more about this activity’s enhanced health & hygiene measures.</p>
                <p><img src={Check} alt="check" /> Tour the city with a licensed local tour guide.</p>
                <p><img src={Check} alt="check" /> Ride in comfort in a climate-controlled luxury vehicle.</p>
                <p><img src={Check} alt="check" /> Enjoy guided walking tours of iconic sites.</p>
                <p><img src={Check} alt="check" /> Take seasonal boat cruises for breathtaking views.</p>
            </div>
        </div>
    );
};

export default TourDetails;
