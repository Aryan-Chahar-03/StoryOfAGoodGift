const express = require('express');
const router = express.Router();
const User = require('../Models/User'); 
const Event = require('../Models/Event');

// 1. Add an event
router.post('/event', async (req, res) => {
    try {
        const { event_name, event_description, event_date } = req.body.newEventData;
        const newEvent = new Event({
            event_name,
            event_description,
            event_date,
            created_by: req.user.userId, // The user creating the event
        });
        await newEvent.save();
        res.status(201).json({ message: "Event created successfully", event: newEvent });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Modify an event
router.put('/event/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { event_name, event_description, event_date } = req.body.UpdatedEventData;

        const event = await Event.findById(id);
        if (!event || event.created_by.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Unauthorized to modify this event" });
        }

        // Update event
        event.event_name = event_name || event.event_name;
        event.event_description = event_description || event.event_description;
        event.event_date = event_date || event.event_date;
        await event.save();

        res.status(200).json({ message: "Event updated successfully", event });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Send Friend Request
router.post('/friend-request/:friendId', async (req, res) => {
    const { friendId } = req.params;
    const user = await User.findById(req.user.userId);
    const friend = await User.findById(friendId);

    if (!friend || user.Friends.includes(friendId) || user.Friend_requests.includes(friendId)) {
        return res.status(400).json({ message: "Cannot send friend request" });
    }

    friend.Friend_requests.push(req.user.userId);
    await friend.save();
    res.status(200).json({ message: "Friend request sent successfully" });
});

// 4. Accept Friend Request
router.put('/friend-request/:friendId/accept', async (req, res) => {
    const { friendId } = req.params;
    const user = await User.findById(req.user.userId);
    const friend = await User.findById(friendId);

    if (!user.Friend_requests.includes(friendId)) {
        return res.status(400).json({ message: "No pending friend request from this user" });
    }

    user.Friend_requests = user.Friend_requests.filter((id) => id.toString() !== friendId.toString());
    user.Friends.push(friendId);
    friend.Friends.push(req.user.userId);

    // Share events with the new friend
    const userEvents = await Event.find({ created_by: user._id });
    const friendEvents = await Event.find({ created_by: friendId });

    await user.save();
    await friend.save();
    res.status(200).json({ message: "Friend request accepted", userEvents, friendEvents });
});

module.exports = router;
