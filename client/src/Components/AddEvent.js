import React, { useState,useContext } from 'react';
import {DataContext} from '../Context/DataContext';
import '../Styles/Event.css'
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../Context/LoginContext';

function AddEventPage() {
    const [event, setEvent] = useState({
        event_name: '',
        event_description: '',
        event_date: ''
    });
    const [errors,setErrors] = useState();
    const navigate = useNavigate();
    const {loginStatus} = useContext(LoginContext);

    const {addEvent} = useContext(DataContext);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEvent((prevEvent) => ({
            ...prevEvent,
            [name]: value
        }));
    };

    const validate = () => {
        let isValid = true;
        let newErrors = {}; // Temporary object to store any errors
    
        if (event.event_name.trim() === '') {
            newErrors.event_name = 'Event name is required';
            isValid = false;
        }
    
        if (event.event_description.trim() === '') {
            newErrors.event_description = 'Event description is required';
            isValid = false;
        }
    
        if (event.event_date.trim() === '') {
            newErrors.event_date = 'Event date is required';
            isValid = false;
        }
    
        setErrors(newErrors); // Set all errors at once
    
        return isValid;
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if(validate()){
            addEvent(event);
            setEvent({
                event_name: '',
                event_description: '',
                event_date: ''
            });
            navigate('/events'); // Redirect to events page after adding a new event
        }
    };

    const handleCancel = () => {
        // Logic for cancelling or clearing the form
        setEvent({
            event_name: '',
            event_description: '',
            event_date: ''
        });
        navigate('/'); // Redirect to events page after canceling the form
    };

    if(!loginStatus){
        alert('You must be logged in');
        navigate('/Login');
    }


    return (
        <div className="addStory_mainContainer">
            <div className="addStory">
                <h2 className="addStory_header">Add a New Event</h2>

                <div className="addStoryForm">
                    <div className="addStoryInputField">
                        <div>Event Name</div>
                        <input
                            type="text"
                            name="event_name"
                            value={event.event_name}
                            placeholder="Event Name"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="addStoryInputField">
                        <div>Event Description</div>
                        <textarea
                            name="event_description"
                            value={event.event_description}
                            onChange={handleChange}
                            placeholder="Event description"
                            required
                        ></textarea>
                    </div>
                    <div className="addStoryInputField">
                        <div>Event Date</div>
                        <input
                            type="date"
                            name="event_date"
                            value={event.event_date}
                            onChange={handleChange}
                            required
                        />
                    </div>


                    <div className="addStoryButtonDiv">
                        <button
                            className="addStoryButton"
                            style={{ backgroundColor: '#FF7373' }}
                            onClick={handleSubmit}
                        >
                            Post Event
                        </button>
                    </div>
                </div>
                <button className="cancel" onClick={handleCancel}>
                    x
                </button>
            </div>
        </div>
    );
}

export default AddEventPage;
