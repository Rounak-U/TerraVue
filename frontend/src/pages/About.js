import React from "react";
import "./About.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import Photographer from "../assets/Photographer.jpg";
import Travel from "../assets/Travel.jpg";
import "../assets/Manali.jpg";
import Leaning from "../assets/Leaning.jpg";
import BannerImage from "../assets/Elephant.jpg";
import Backpacker from "../assets/Backpacker.jpg";
import Boat from "../assets/Boat.jpg";
import Helpdesk from "../assets/helpdesk.png";
import Suitcase from "../assets/suitcase.png";
import Search from "../assets/searchprop.png";
import Airplane from "../assets/airplane.png";

function About() {
    return (
        <div>
            {/* Hero Section */}
            <div className="AboutImage">
                <div className="Image">
                    <img src={BannerImage} alt="Travel" />
                    <div className="Overlay">
                        <h1>About Us</h1>
                    </div>
                </div>
            </div>

            <div className="Travel">
                {/* About Content */}
                <motion.div
                    className="AboutContent"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h4>Our Story</h4>
                    <h2>We're The Top Adventure Travel Company</h2>
                    <p>
                        Whether you're yearning for a romantic escape filled with enchanting moments, planning an exciting family-friendly adventure packed with cherished memories, or embarking on a thrilling solo journey to explore the world's wonders, a reputable travel agency possesses the expertise and resources to meticulously curate a custom-tailored itinerary that not only fulfills but far exceeds your wildest dreams and expectations.
                    </p>
                    <p>
                        Whether you're yearning for a romantic escape filled with enchanting moments, planning an exciting family-friendly adventure packed with cherished memories, or embarking on a thrilling solo journey to explore the world's wonders, a reputable travel agency possesses the expertise and resources to meticulously curate a custom-tailored itinerary that not only fulfills but far exceeds your wildest dreams and expectations.
                    </p>
                    <div className="Exp">
                        <div className="component1">
                            <h3>05+</h3>
                            <p>Years of Experience</p>
                        </div>
                        <div className="component1">
                            <h3>500+</h3>
                            <p>Destination Collab</p>
                        </div>
                        <div className="component1">
                            <h3>10M+</h3>
                            <p>Happy Customers</p>
                        </div>
                    </div>

                </motion.div>

                {/* Image Grid */}
                <div className="ImageGrid">
                    <img src={Travel} alt="Traveler" className="grid-item grid1" />
                    <img src={Leaning} alt="Leaning Tower" className="grid-item grid2" />
                    <img src={Photographer} alt="Photographer" className="grid-item grid3" />
                    <img src={Backpacker} alt="Backpacker" className="grid-item grid4" />
                </div>
            </div>

            <div className="ImageIcons">
                <div className="LeftSection">
                    <div className="BImage">
                        <img src={Boat} alt="Boat" />
                    </div>
                    <div className="BText">
                        <h1>Why We Excel In Travel!</h1>
                        <p>"Why we excel in travel!" is a compelling statement that encapsulates the core strengths and unique advantages of a travel-focused entity or service provider. This description implies a sense of superiority and expertise in the travel industry. Here's a detailed description based on this phrase:</p>
                        <p>At "Why we excel in travel!", we redefine the art of travel through our unwavering commitment to excellence. What sets us apart is not just our destinations, but the unparalleled experience we create for every traveler. Our journey begins with a passion for exploration, crafted into meticulously planned itineraries that uncover the extraordinary. We excel in understanding the diverse needs of our clients, tailoring each adventure to surpass expectations. Behind our success is a team of seasoned experts, well-versed in the intricacies of global travel. Their dedication ensures seamless journeys, from dream conception to reality. </p>
                        <p>We pride ourselves on forging meaningful connections with our destinations, fostering responsible tourism that respects cultures and environments. Our partnerships with local communities enrich every trip, offering authentic encounters that leave lasting impressions.</p>
                    </div>
                </div>

                <div className="Icons">
                    <div className="IconItem">
                        <img src={Helpdesk} alt="Helpdesk" />
                        <h2>Quality At Our Core</h2>
                        <p>High quality standards. Millions of reviews. A Tripadvisor company. Browse and book tours and </p>
                    </div>
                    <div className="IconItem">
                        <img src={Suitcase} alt="Suitcase" />
                        <h2>Organized Travel</h2>
                        <p>Users Can Organize And Manage Their Belongings Or Equipment More Freely When Traveling With Us</p>
                    </div>
                    <div className="IconItem">
                        <img src={Search} alt="Search" />
                        <h2>Travel Itineraries</h2>
                        <p>Our Team Of Experts Will Take Care Of All The Planning And Logistics, Providing You With A Detailed Itinerary.</p>
                    </div>
                    <div className="IconItem">
                        <img src={Airplane} alt="Airplane" />
                        <h2>Deals On Airplane Tickets</h2>
                        <p>Our Travel Agency Specializes In Providing Our Customers With The Best Deals On Airline Tickets.</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default About;
