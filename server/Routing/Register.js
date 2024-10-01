const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const bcrypt = require('bcryptjs');


// SignUp route
router.post('/signUp', async (req, res) => {
    const { user } = req.body;
    try {
        const existingUser = await User.findOne({ Email: user.Email });
        
        if (existingUser) {
            return res.status(400).send({ msg: "User Already Exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.Password, salt);

        const newUser = new User({
            Name: user.Name,
            Email: user.Email,
            Password: hashedPassword,
            Friends: [],
            Wishlist: [],
            Friend_requests: [],   
        });

        await newUser.save();
        return res.status(201).send({ msg: "User Created Successfully" });

    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
});

// Sign In route
router.post('/signIn', async (req, res) => {
    const { user } = req.body;
    try {
        // Find the user and populate the fields you need, excluding the password
        const existingUser = await User.findOne({ Email: user.Email })                              
            .populate('Friends', '_id Name')                    // Populate friends with both the friendID (_id) and Name
            .populate('Wishlist')                               // Populate wishlist (adjust fields if necessary)
            .populate('Friend_requests','_id Name')             // Populate Friend_requests 
                 
        if (!existingUser) {
            return res.status(404).send({ msg: "User Not found" });
        }

        const isMatch = await bcrypt.compare(user.Password, existingUser.Password);
        if (!isMatch) {
            return res.status(401).send({ msg: "Invalid Credentials" });
        }

        existingUser.Password = undefined;
        const Secretkey = process.env.Key;
        const token = jwt.sign({ userId: existingUser._id }, Secretkey, { expiresIn: '1h' });
        const expiryTime = 3600000 + Date.now(); // 

        return res.status(200).send({
            msg: "User Logged In Successfully",
            token,
            expiryTime,
            Currentuser: existingUser               // `existingUser` without password, with populated friends,friend_requests
        });

    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
});


module.exports = router;
