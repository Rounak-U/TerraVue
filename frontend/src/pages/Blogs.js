import React from "react";
import "./Blogs.css";
import Bl from "../assets/blogs.jpg";
import Footer from "../components/Footer";

function Blogs() {
    return (
        <div>
            {/* Hero Section */}
            <div className="BlogImage">
                <div className="Blim">
                    <img src={Bl} alt="Travel" />
                    <div className="OverB">
                        <h1>Travel Blogs</h1>
                    </div>
                </div>
            </div>
            <div class="Videos-Section">
                <div class="Videos-Containers">
                    <div class="Container">
                        <iframe src="https://www.youtube.com/embed/9wVoJu9PrpQ" allowfullscreen></iframe>
                    </div>
                    <div class="Container">
                        <iframe src="https://www.youtube.com/embed/ti39UJYgc5s" allowfullscreen></iframe>
                    </div>
                    <div class="Container">
                        <iframe src="https://www.youtube.com/embed/-F_aUhe0bgQ" allowfullscreen></iframe>
                    </div>
                    <div class="Container">
                        <iframe src="https://www.youtube.com/embed/qzN7UY4D8VQ" ></iframe>
                    </div>
                    <div class="Container">
                        <iframe src="https://www.youtube.com/embed/Lr2Xur5I-NU" allowfullscreen></iframe>
                    </div>
                    <div class="Container">
                        <iframe src="https://www.youtube.com/embed/XYwP-QndGG0" allowfullscreen></iframe>
                    </div>
                </div>
            </div>



            <Footer />
        </div >
    );
}

export default Blogs;
