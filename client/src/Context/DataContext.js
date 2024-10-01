import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { LoginContext } from './LoginContext';
import axios from 'axios';
import { io } from "socket.io-client";

export const DataContext = createContext();

// DataProvider to wrap the application
export const DataProvider = ({ children }) => {
    // Login state from loginContext
    const { loginStatus, CurrentUser } = useContext(LoginContext);

    // State for users and gifts
    const [users, setUsers] = useState([]);     //Get List of All the Users
    const [gifts, setGifts] = useState([]);      //Get Data for all the Gifts
    const [userEvents, setUserEvents] = useState([]);
    const [friendsEvents, setFriendsEvents] = useState([]);
    const [user, setUser] = useState(CurrentUser); // Copy of the current user for manipulation

    const socket = useMemo(() => io("http://localhost:5000"), []);

    // Fetch Users and Gifts when the component first mounts
    useEffect(() => {
        socket.emit('getUsers');
        socket.emit('getGifts');

        socket.on('usersData', (data) => setUsers(data));
        socket.on('giftsData', (data) => setGifts(data));

        // Cleanup listeners
        return () => {
            socket.off('usersData');
            socket.off('giftsData');
        };
    }, [socket]);

    // Fetch MyEvents and UserEvents when loginStatus changes
    useEffect(() => {
        console.log("Current User is ",CurrentUser);
        if (loginStatus && user != null) {
            socket.emit('getMyEvents', user._id);
            socket.emit('getUserEvents', user._id);
        }
    }, [loginStatus, user?._id, socket]);

    // Add Event
    const addEvent = async (newEventData) => {
        if (!loginStatus) {
            alert('You must be logged in to perform this action.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/protected/event', newEventData, {
                headers: { 'auth-token': localStorage.getItem('token') },
            });
            const event = response.data.event;
            socket.emit('eventAdded', { EventData: event, UserId: user._id });
        } catch (error) {
            console.error(error);
        }
    };

    // Update Event
    const updateEvent = async (eventId, updatedEventData) => {
        if (!loginStatus) {
            alert('You must be logged in to perform this action.');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:5000/protected/event/${eventId}`, updatedEventData, {
                headers: { 'auth-token': localStorage.getItem('token') },
            });
            const event = response.data.event;
            socket.emit('eventUpdated', { EventData: event, UserId: user._id, EventId: eventId });
        } catch (error) {
            console.error(error);
        }
    };

    // Send Friend Request
    const sendFriendRequest = async (friendId) => {
        if (!loginStatus) {
            alert('You must be logged in to perform this action.');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:5000/protected/friend-request/${friendId}`, {}, {
                headers: { 'auth-token': localStorage.getItem('token') },
            });
            socket.emit('friendRequestSent', { senderId: user._id, receiverId: friendId });
        } catch (error) {
            console.error(error);
        }
    };

    // Accept Friend Request
    const acceptFriendRequest = async (friendId) => {
        if (!loginStatus) {
            alert('You must be logged in to perform this action.');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:5000/protected/friend-request/${friendId}/accept`, {}, {
                headers: { 'auth-token': localStorage.getItem('token') },
            });
            socket.emit('friendRequestAccepted', { accepterId: user._id, senderId: friendId });
        } catch (error) {
            console.error(error);
        }
    };

    // Socket listeners for real-time updates
    useEffect(() => {
        // Listen for userEvents
        socket.on('userEvents', (data) => {
            setUserEvents(data);
        });

        // Listen for friend events
        socket.on('friendEvents', (data) => {
            setFriendsEvents(data);
        });

        // Listen for new events
        socket.on('eventAdded', ({ UserId, EventData }) => {
            if (user.Friends.includes(UserId)) {
                // Push the event to FriendEvents if the userId is a friend
                setFriendsEvents((prevFriendEvents) => [...prevFriendEvents, EventData]);
            } else if (user._id === UserId) {
                // Push the event to MyEvents if the event belongs to the current user
                setUserEvents((prevEvents) => [...prevEvents, EventData]);
            }
        });

        // Listen for event updates
        socket.on('eventUpdated', ({ UserId, EventData, EventId }) => {
            if (user.Friends.includes(UserId)) {
                // Update the FriendEvents if the userId is a friend
                setFriendsEvents((prevFriendEvents) => {
                    const updatedEvents = prevFriendEvents.map((event) =>
                        event._id === EventId ? EventData : event
                    );
                    return updatedEvents;
                });
            } else if (user._id === UserId) {
                // Update the MyEvents if the event belongs to the current user
                setUserEvents((prevEvents) => {
                    const updatedEvents = prevEvents.map((event) =>
                        event._id === EventId ? EventData : event
                    );
                    return updatedEvents;
                });
            }
        });

        // Listen for friend requests
        socket.on('friendRequestSent', ({ senderId, receiverId }) => {
            if (user._id === receiverId) {
                // Add the senderId to friendRequests if the current user is the receiver
                setUser((prevUser) => ({
                    ...prevUser,
                    FriendRequests: [...prevUser.FriendRequests, senderId],
                }));
            }
        });

        // Listen for accepted friend requests
        socket.on('friendRequestAccepted', ({ accepterId, senderId, AccepterEvents, SenderEvents }) => {
            if (user._id === senderId) {
                // Add accepterId to friends and add their events to FriendEvents
                setUser((prevUser) => ({
                    ...prevUser,
                    Friends: [...prevUser.Friends, accepterId],
                }));

                setFriendsEvents((prevFriendEvents) => [...prevFriendEvents, ...AccepterEvents]);
            } else if (user._id === accepterId) {
                // Add senderId to friends, remove from friendRequests, and add their events to FriendsEvents
                setUser((prevUser) => ({
                    ...prevUser,
                    Friends: [...prevUser.Friends, senderId],
                    FriendRequests: prevUser.FriendRequests.filter((id) => id !== senderId),
                }));

                setFriendsEvents((prevFriendEvents) => [...prevFriendEvents, ...SenderEvents]);
            }
        });

        return () => {
            socket.off('userEvents');
            socket.off('friendEvents');
            socket.off('eventAdded');
            socket.off('eventUpdated');
            socket.off('friendRequestSent');
            socket.off('friendRequestAccepted');
        };
    }, [user, socket]);

    return (
        <DataContext.Provider
            value={{
                user,
                setUser,
                users,
                gifts,
                userEvents,
                friendsEvents,
                addEvent,
                updateEvent,
                sendFriendRequest,
                acceptFriendRequest,
            }}
        >
            {children}
        </DataContext.Provider>
    );
};
