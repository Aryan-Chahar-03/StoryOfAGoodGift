import '../Styles/navbar.css'; // Import CSS for Navbar
import { LoginContext } from '../Context/LoginContext';
import { useNavigate, Link } from 'react-router-dom';
import React, { useContext } from 'react';
import { FaGift } from 'react-icons/fa';

const Navbar = () => {
    const { handleLogout, loginStatus } = useContext(LoginContext);
    const navigate = useNavigate();
    
    return (
        <div className='navbar'>
            <h1>Story of a Good Gift <FaGift /></h1>
            <div className='nav' style={{marginRight : '20px'}}>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/shop/All">Store</Link></li>
                    {/* Search Icon */}
                    
                    {loginStatus ? (
                        <li><button onClick={handleLogout}>Logout</button></li>
                    ) : (
                        <li><Link to="/Login">Login</Link></li>
                    )}
                    {/* Cart Icon */}
                    
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
