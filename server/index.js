const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const env = require('dotenv');
const bodyParser = require('body-parser');
const User = require('./Models/User');
const Event = require('./Models/Event');
const Gift = require('./Models/Gift');

app.use(cors());
app.use(bodyParser.json());
env.config();

const port = process.env.PORT || 5000;
const URL = process.env.URL;

// Connect to database
mongoose.connect(URL)
    .then(() => console.log("connected to database"))
    .catch((err) => console.log(err));

//Routes and middleware
const register = require('./Routing/Register.js');
const ProtectedRoute = require('./Routing/ProtectedRoute.js');
const authenticate = require('./Verification/Authentication.js');

app.use('/register', register);
app.use('/protected', authenticate,ProtectedRoute);

const server = http.createServer(app);

// Set up Socket.io and bind it to the HTTP server
const io = new Server(server, {
    cors: {
        origin: "*",  
        methods: ["GET", "POST"],
    }
});


// Inside your socket connection
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Listen for getUsers
    socket.on('getUsers', async () => {
        const users = await User.find();
        socket.emit('usersData', users);
    });

    // Listen for getGifts
    socket.on('getGifts', async () => {
        const gifts = await Gift.find();
        socket.emit('giftsData', gifts);
    });

    // Listen for getMyEvents
    socket.on('getMyEvents', async (userId) => {
        const events = await Event.find({ created_by: userId });
        socket.emit('userEvents', events);
    });

    // Listen for getUserEvents (events for friends)
    socket.on('getUserEvents', async (userId) => {
        const user = await User.findById(userId);
        const friendsEvents = await Event.find({ created_by: { $in: user.friends } });
        socket.emit('friendEvents', friendsEvents);
    });

    // Handle event addition
    socket.on('eventAdded', async ({ UserId, EventData }) => {
        try {
            socket.broadcast.emit('eventAdded', { UserId, EventData });
        } catch (error) {
            console.error('Error broadcasting event:', error);
        }
    });

    // Handle event updates
    socket.on('eventUpdated', async ({ UserId, EventData, EventId }) => {
        try {
            socket.broadcast.emit('eventUpdated', { UserId, EventData, EventId });
        } catch (error) {
            console.error('Error updating event:', error);
        }
    });

    // Handle friend request sent
    socket.on('friendRequestSent', async ({ senderId, receiverId }) => {
        socket.to(receiverId).emit('friendRequestSent', { senderId, receiverId });
    });

    // Handle friend request accepted
    socket.on('friendRequestAccepted', async ({ accepterId, senderId }) => {
        const AccepterEvents = await Event.find({ created_by: accepterId });
        const SenderEvents = await Event.find({ created_by: senderId });

        socket.to(accepterId).emit('friendRequestAccepted', { accepterId, senderId, AccepterEvents, SenderEvents });
        socket.to(senderId).emit('friendRequestAccepted', { accepterId, senderId, AccepterEvents, SenderEvents });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});


server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
