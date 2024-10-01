import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LoginContext } from '../Context/LoginContext';
import { DataContext } from '../Context/DataContext';
import Navbar from './NavBar';
import '../Styles/ViewEvents.css';


const FriendsEvents = () =>{
    const {friendsEvents} = useContext(DataContext);
    const {loginStatus} = useContext(LoginContext);
    const navigate = useNavigate();

    if(!loginStatus){
        alert("You must be logged in to use this page");
        navigate('/Login');
    }

    return(
        <div className='EventPageContainer'>
            <Navbar />
            <div className='EventPage'>
                <div><h2>Friends Events</h2></div>
                {friendsEvents.length > 0 ? (
                    friendsEvents.map((event, index) => (
                        <div key={index} className="EventHolder">
                            <h3>{event.event_name}</h3>
                            <p><strong>Description: </strong>{event.event_description || 'No description available'}</p>
                            <p><strong>Date: </strong>{new Date(event.event_date).toLocaleDateString()}</p>
                        </div>
                    ))
                ) : (
                    <p>No events found.</p>
                )}
            </div>
        </div>
    )

}


export default FriendsEvents;