const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const router = express.Router();
const saltRounds = 10;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/PaymentPortal', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// Define User Schema
const userSchema = new mongoose.Schema({
    fullName: String,
    idNumber: String,
    accountNumber: String,
    password: String
});

// Create User Model
const User = mongoose.model('User', userSchema);

// Registration Route
router.post('/register', async (req, res) => {
    try {
        const { fullName, idNumber, accountNumber, password } = req.body;

        // Validate input using RegEx
        if (!fullName || !idNumber || !accountNumber || !password) {
            return res.status(400).send('All fields are required');
        }
        const idRegex = /^[0-9]{13}$/;  // Example: ID number should be 13 digits
        const accountRegex = /^[a-zA-Z0-9]{6,10}$/;  // Example pattern for account number
        if (!idRegex.test(idNumber) || !accountRegex.test(accountNumber)) {
            return res.status(400).send('Invalid input format');
        }

        // Check if user already exists
        const existingUser = await User.findOne({ idNumber });
        if (existingUser) {
            return res.status(400).send('User with this ID number already exists');
        }

        // Hashing password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Save user to MongoDB
        const newUser = new User({ fullName, idNumber, accountNumber, password: hashedPassword });
        await newUser.save();

        res.status(201).send('User Registered');
    } catch (error) {
        res.status(500).send('Error registering user');
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { idNumber, accountNumber, password } = req.body;

        // Validate input
        if (!idNumber || !accountNumber || !password) {
            return res.status(400).send('All fields are required');
        }

        // Find user by ID number and account number
        const user = await User.findOne({ idNumber, accountNumber });
        if (user && await bcrypt.compare(password, user.password)) {
            res.status(200).send('Login Successful');
        } else {
            res.status(400).send('Invalid Credentials');
        }
    } catch (error) {
        res.status(500).send('Error logging in');
    }
});

module.exports = router;
