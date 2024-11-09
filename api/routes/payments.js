const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define Payment Schema
const paymentSchema = new mongoose.Schema({
    amount: Number,
    currency: String,
    swiftCode: String,
    date: { type: Date, default: Date.now },
    verified: { type: Boolean, default: false }
});

// Create Payment Model
const Payment = mongoose.model('Payment', paymentSchema);

// Handle payment submission (POST)
router.post('/', async (req, res) => {
    try {
        const { amount, currency, swiftCode } = req.body;

        // Validate input using RegEx
        const amountRegex = /^[0-9]+(\.[0-9]{1,2})?$/; // Only allows numbers with up to 2 decimal places
        const swiftRegex = /^[A-Z0-9]{8,11}$/; // Example SWIFT code pattern
        if (!amountRegex.test(amount) || !swiftRegex.test(swiftCode)) {
            return res.status(400).send('Invalid input format');
        }

        // Save payment data to MongoDB
        const payment = new Payment({
            amount,
            currency,
            swiftCode
        });

        await payment.save();

        res.status(201).send('Payment recorded successfully');
    } catch (error) {
        console.error('Error recording payment:', error);
        res.status(500).send('Error recording payment');
    }
});

// Fetch all payments (GET)
router.get('/', async (req, res) => {
    try {
        const payments = await Payment.find();
        res.status(200).json(payments);
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).send('Error fetching payments');
    }
});

// Verify payment (PUT)
router.put('/:id/verify', async (req, res) => {
    try {
        const paymentId = req.params.id;
        const payment = await Payment.findByIdAndUpdate(
            paymentId,
            { verified: true },
            { new: true }
        );
        if (!payment) {
            return res.status(404).send('Payment not found');
        }
        res.status(200).json(payment);
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).send('Error verifying payment');
    }
});

module.exports = router;
