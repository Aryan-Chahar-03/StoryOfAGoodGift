import React, { createContext, useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Create Context
export const LoginContext = createContext();

// Context Provider
export const LoginProvider = ({ children }) => {
    const [loginStatus, setLoginStatus] = useState(false);  // To track if user is logged in              
    const [CurrentUser, setUser] = useState(null);                 // Store user info 
    const navigate = useNavigate();
    

    // 1. Handle SignUp
    const handleSignUp = async (user) => {
        try {
            const response = await axios.post('http://localhost:5000/register/signUp', {user : user});
            console.log('User created:', response.data.msg);
            navigate('/login');                                  //We will redirect to the login page
        } catch (error) {
            console.error('SignUp Error:', error.response?.data?.msg || error.message);
        }
    };

    // 2. Handle SignIn
    const handleSignIn = async (user) => {
        try {
            const response = await axios.post('http://localhost:5000/register/signIn', {user : user});
            const { token, expiryTime,Currentuser} = response.data;  // Destructure token and expiryTime
            console.log("Response is ",response.data);
            setUser(Currentuser);                                    // Store user info
            setLoginStatus(true);                                    // Set login status
            localStorage.setItem('token', token);                    // Store token in localStorage
            localStorage.setItem('expiryTime', expiryTime);          // Store expiryTime in localStorage
            autoLogout(expiryTime);                                  // Set AutoLogout based on expiryTime
            console.log('Logged in successfully');
            navigate('/');                                              // We will redirect to the home page
        } catch (error) {
            console.error('SignIn Error:', error.response?.data?.message || error.message);
        }
    };

    // 3. Handle Logout
    const handleLogout = () => {
        alert('You have been logged out.');
        setLoginStatus(false);
        setUser(null);
        localStorage.removeItem('token');       // Clear token
        localStorage.removeItem('expiryTime');  // Clear expiry time
        console.log('Logged out successfully');
    };

    // 4. Auto Logout when token expires
    const autoLogout = (expiryTime) => {
        const currentTime = new Date().getTime();
        const timeUntilLogout = expiryTime - currentTime;

        setTimeout(() => {
            handleLogout();
        }, timeUntilLogout);
    };

    // Load token and expiryTime from localStorage and validate on app start
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedExpiryTime = localStorage.getItem('expiryTime');
        const currentTime = new Date().getTime();

        if (storedToken && storedExpiryTime > currentTime) {
            setLoginStatus(true);
            autoLogout(storedExpiryTime);  // Set up auto logout for remaining time
        }
    }, []);

    return (
        <LoginContext.Provider value={{
            loginStatus,
            handleSignUp,
            handleSignIn,
            handleLogout,
            CurrentUser,
        }}>
            {children}
        </LoginContext.Provider>
    );
};
