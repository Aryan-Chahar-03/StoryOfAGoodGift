import React, { useState, useContext } from 'react';
import { DataContext } from '../Context/DataContext';
import { useParams, useNavigate } from 'react-router-dom';
import '../Styles/Event.css';
import { LoginContext } from '../Context/LoginContext';

function EditEvent() {
    const { userEvents, updateEvent } = useContext(DataContext);
    const {loginStatus} = useContext(LoginContext);
    const { eventId } = useParams(); // Correcting param to "id" if your route is editPage/:id
    const navigate = useNavigate(); // To redirect after update
    
    const [event, setEvent] = useState(() => {
        // Find the event by ID or return a default object (optional fallback)
        return userEvents.find(event => event.id === parseInt(eventId)) || {
            event_name: '',
            event_description: '',
            event_date: ''
        };
    });

    const [errors, setErrors] = useState({}); // Define errors state

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEvent((prevEvent) => ({
            ...prevEvent,
            [name]: value
        }));
    };

    const validate = () => {
        let isValid = true;
        let newErrors = {};

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

        if (validate()) {
            updateEvent(event); // Assuming updateEvent handles the update logic
            // Redirect to another page, e.g., event list or event details
            navigate('/events');
        }
    };

    const handleCancel = () => {
        // Redirect back to the previous page or event details instead of clearing the form
        navigate('/'); // Go back to the previous page
    };

    if(!loginStatus){
        alert('You must be logged in');
        navigate('/Login');
    }

    return (
        <div className="addStory_mainContainer">
            <div className="addStory">
                <h2 className="addStory_header">Edit Event</h2>

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
                        {errors.event_name && <div className="error">{errors.event_name}</div>}
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
                        {errors.event_description && (
                            <div className="error">{errors.event_description}</div>
                        )}
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
                        {errors.event_date && <div className="error">{errors.event_date}</div>}
                    </div>

                    <div className="addStoryButtonDiv">
                        <button
                            className="addStoryButton"
                            style={{ backgroundColor: '#FF7373' }}
                            onClick={handleSubmit}
                        >
                            Update Event
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

export default EditEvent;
