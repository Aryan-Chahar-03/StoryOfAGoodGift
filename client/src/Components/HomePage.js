import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Styles/Homepage.css'; // Import the CSS file for styling
import { LoginContext } from '../Context/LoginContext';
import { DataContext } from '../Context/DataContext';
import Navbar from './NavBar';
import { FaInstagram,FaPinterest,FaLinkedin,FaPlusCircle,FaEye,FaShare,FaStore} from 'react-icons/fa';

// Import images
import ShopNowImage from '../images/ShopNow.jpeg';
import EventsUpcomingImage from '../images/Eventsupcoming.jpg';
import AboutStoryOfAGoodGift from '../images/AboutStoryOfAGoodGift.jpeg';
import UpcomingEvents from '../images/UpcomingEvents.jpg';
import WhyWrapGifts from '../images/whywrapgifts.jpg';

const Homepage = () => {
    const navigate = useNavigate(); // Initialize the useNavigate hook for navigation
    const { loginStatus } = useContext(LoginContext); // Access login status from LoginContext
    const {user} = useContext(DataContext); // Access User from DataContext

    // Handle navigation based on the button click
    const handleNavigation = (path) => {
        navigate(path);
    };

    
    return (

        <div className="homepage">
            <Navbar />
            <div className="container">
        
                {/* Featured Stories Section */}
                <div className="section-container">
                    <div className="section-left container-hover-effect">
                        <div
                            className="background-img"
                            style={{ backgroundImage: `url(${AboutStoryOfAGoodGift})` }}
                        ></div>
                    </div>
                    <div className="section-right section-content">
                    <h2>Find the right gift for that one person or occasion</h2>
                    <p>[Add a brief description here]</p>
                        <button onClick={() => handleNavigation('/shopPage')}>
                            ShopNow
                        </button>
                    </div>
                </div>


                {/* Shop Now Section */}
                <div className="section-container">
                    <div className="section-right container-hover-effect">
                        <div
                            className="background-img"
                            style={{ backgroundImage: `url(${ShopNowImage})` }}
                        ></div>
                    </div>
                    <div className="section-left section-content">
                        <h2>About Story of a Good Gift </h2>
                        <p>[Add a brief description about the "Story of a Good Gift" here]</p>
                        <button onClick={() => handleNavigation('/aboutPage')}>
                            Read More
                        </button>
                    </div>
                </div>

                {/* Wishlist Section */}
                <div className="wishlist-section">
                    <h2>Your Wishlist</h2>
                    <div onClick={() => handleNavigation('/addEvent')}>
                        <h3>Create New Event<FaPlusCircle /></h3>
                    </div>
                    <div onClick={() => handleNavigation('/viewYourEvents')}>
                        <h3>View Your Events<FaEye /></h3>
                    </div>
                    <div onClick={() => handleNavigation('/viewFriendWishlist')}>
                        <h3>View Friends Wishlists<FaShare /> </h3>
                    </div>
                </div>

                {/* Upcoming Events Section */}
                <div className="section-container">
                    <div className="section-left container-hover-effect">
                        <div
                            className="background-img"
                            style={{ backgroundImage: `url(${UpcomingEvents})` }}
                        ></div>
                    </div>
                    <div className="section-right section-content">
                        <h2>The next event is almost here</h2>
                        {loginStatus ? (
                            <p>Upcoming events of friends...</p>
                        ) : (
                            <p>Please log in to view your friends' events.</p>
                        )}
                        <button onClick={() => handleNavigation(loginStatus ? '/events' : '/login')}>
                            {loginStatus ? 'View Events' : 'Login to View'}
                        </button>
                    </div>
                </div>

                {/* Gift Wrapping Section */}
                <div className="section-container">
                    <div className="section-left section-content">
                        <h2>Why should you wrap gifts?</h2>
                        <p>[Add details about why wrapping gifts is important]</p>
                    </div>
                    <div className="section-right container-hover-effect">
                        <div
                            className="background-img"
                            style={{ backgroundImage: `url(${WhyWrapGifts})` }}
                        ></div>
                    </div>
                </div>

                {/* Featured Stores Section */}
                <div className="stores-section">
                    <h2>Featured Stores <FaStore /></h2>
                    <div className="background-img"  onClick={() => handleNavigation('/shop/Category1')}>
                        <h3>Anxious Adults</h3>
                    </div>
                    <div className="background-img" onClick={() => handleNavigation('/shop/Category2')}>
                        <h3>Goodet</h3>
                    </div>
                    <div className="background-img" onClick={() => handleNavigation('/shop/Category3')}>
                        <h3>Bollywood</h3>
                    </div>
                </div>

                {/* Gift Recommendations Section */}
                <div className="appointment-section">
                    <h2>Gift Recommendations</h2>
                    <p>1 hr | $200</p>
                    <button>Book Now</button>
                </div>

                {/* Social Media Section */}
                <div className="social-section">
                    <h2>Follow Us</h2>
                    <div><Link to="#"><FaInstagram/></Link></div>
                    <div><Link to="#"><FaLinkedin /></Link></div>
                    <div><Link to="#"><FaPinterest /></Link></div>
                </div>
            </div>

            <div className='footerContainer'>
                <p>&copy; 2024 Story of a Good Gift. All Rights Reserved.</p>
            </div>
        </div>
    );
};

export default Homepage;
