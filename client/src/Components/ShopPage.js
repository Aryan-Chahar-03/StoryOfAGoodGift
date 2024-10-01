import { useState, useContext } from "react";
import { DataContext } from '../Context/DataContext';
import { useNavigate ,useParams} from "react-router-dom";
import Navbar from "./NavBar";
import '../Styles/ShopPage.css';



import ShopNowImage from '../images/ShopNow.jpeg';
import EventsUpcomingImage from '../images/Eventsupcoming.jpg';
import AboutStoryOfAGoodGift from '../images/AboutStoryOfAGoodGift.jpeg';
import UpcomingEvents from '../images/UpcomingEvents.jpg';

const Shop = () => {
    const { gifts, user, setUser } = useContext(DataContext); // assuming user context for wishlist management
    const navigate = useNavigate();
    const categories = ['All', 'Category1', 'Category2', 'Category3'];
    const { category } = useParams(); 
    const [selectedCategory, setSelectedCategory] = useState(category || 'All');

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };
    const categoriesBG = [ShopNowImage, EventsUpcomingImage, AboutStoryOfAGoodGift, UpcomingEvents];

    const filteredGifts = {
        Category1: gifts.filter(gift => gift.category === 'Category1'),
        Category2: gifts.filter(gift => gift.category === 'Category2'),
        Category3: gifts.filter(gift => gift.category === 'Category3'),
    };

    const isWishlisted = (gift) => {
        return user.wishlist.includes(gift._id); // assuming gifts have an _id field
    };

    const toggleWishlist = (gift) => {
        let updatedWishlist;
        if (isWishlisted(gift)) {
            updatedWishlist = user.Wishlist.filter(id => id !== gift._id); // remove from wishlist
        } else {
            updatedWishlist = [...user.Wishlist, gift._id]; // add to wishlist
        }
        setUser({ ...user, Wishlist: updatedWishlist }); // update user context
    };

    return (
        <div className="ShopPage">
            <Navbar />
            <div className="content-container">
                <div className="Category-section">
                    {categories.map((category, index) => (
                        <div
                            key={category}
                            className={`Category-box ${selectedCategory === category ? 'active' : ''}`}
                            onClick={() => handleCategoryClick(category)}
                            style={{
                                backgroundImage: `url(${categoriesBG[index]})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backdropFilter: 'blur(10px)',
                                color: 'white'
                            }}
                        >
                            {category}
                        </div>
                    ))}
                </div>

                {categories.slice(1).map((category) => (
                    (selectedCategory === 'All' || selectedCategory === category) && (
                        <div key={category} className="shop-section">
                            <h2 className="section-title">Shop Items From {category}</h2>
                            {filteredGifts[category]?.length === 0 && <h3 className='section-title-header'>No Items Currently</h3>}
                            <div className="shop-list">
                                {filteredGifts[category]?.map((gift) => (
                                    <div key={gift._id} className="shop-card">
                                    <img src={gift.imageURL} alt={gift.name} className="gift-image" />
                                    <h3>{gift.name}</h3>
                                    <p>Price: ${gift.price}</p>
                                    <button 
                                        onClick={() => toggleWishlist(gift)} 
                                        className={isWishlisted(gift) ? 'hearted' : ''}
                                    >
                                        {isWishlisted(gift) ? '♥' : '♡'}
                                    </button>
                                </div>
                                
                                ))}
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
};

export default Shop;
