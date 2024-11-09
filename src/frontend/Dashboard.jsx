import React, { useState } from 'react';
import './Dash.css';

export const Dashboard = (props) => {
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [swiftCode, setSwiftCode] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');

    const handleLogout = () => {
        props.onFormSwitch('login');
        alert('You have been logged out.');
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();

        const paymentData = {
            amount,
            currency,
            swiftCode
        };

        try {
            const response = await fetch('https://localhost:3001/api/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData),
            });

            if (response.ok) {
                alert('Payment submitted successfully!');
            } else {
                alert('Failed to submit payment.');
            }
        } catch (error) {
            console.error('Error submitting payment:', error);
            alert('Error submitting payment.');
        }
    };

    const handleSwiftCodeChange = (e) => {
        const value = e.target.value;
        if (/^[A-Za-z0-9]{8,11}$/.test(value)) { // SWIFT/BIC format (8-11 alphanumeric characters)
            setSwiftCode(value);
        }
    };

    const handleCardHolderChange = (e) => {
        const value = e.target.value;
        if (/^[a-zA-Z\s]*$/.test(value)) { // Only allow letters and spaces
            setCardHolder(value);
        }
    };

    const handleCardNumberChange = (e) => {
        const value = e.target.value;
        if (/^\d{16}$/.test(value)) { // 16-digit card number
            setCardNumber(value);
        }
    };

    const handleExpiryDateChange = (e) => {
        setExpiryDate(e.target.value); // YYYY-MM format is enforced by type="month"
    };

    const handleCvvChange = (e) => {
        const value = e.target.value;
        if (/^\d{3,4}$/.test(value)) { // 3 or 4 digit CVV
            setCvv(value);
        }
    };

    return (
        <div className="dash-container">
            <nav className="navbar">
                <div className="navbar-right">
                    <span className="nav-link logout" onClick={handleLogout}>Log Out</span>
                </div>
            </nav>
            <div className="dashboard-content">
                <h1>Payment Portal</h1>
                <form className="payment-form" onSubmit={handlePaymentSubmit}>
                    <div className="form-left">
                        <label htmlFor="amount">Amount</label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            required
                        />
                        
                        <label htmlFor="currency">Currency</label>
                        <select
                            id="currency"
                            name="currency"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                        >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                            <option value="ZAR">ZAR</option>
                        </select>

                        <label htmlFor="swiftCode">SWIFT Code</label>
                        <input
                            type="text"
                            id="swiftCode"
                            name="swiftCode"
                            value={swiftCode}
                            onChange={handleSwiftCodeChange}
                            placeholder="Enter SWIFT code"
                            required
                        />
                    </div>

                    <div className="form-right">
                        <label htmlFor="cardHolder">Card Holder Name</label>
                        <input
                            type="text"
                            id="cardHolder"
                            name="cardHolder"
                            value={cardHolder}
                            onChange={handleCardHolderChange}
                            placeholder="Card holder name"
                            required
                        />

                        <label htmlFor="cardNumber">Card Number</label>
                        <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="Enter card number"
                            required
                        />

                        <label htmlFor="expiryDate">Expiry Date</label>
                        <input
                            type="month"
                            id="expiryDate"
                            name="expiryDate"
                            value={expiryDate}
                            onChange={handleExpiryDateChange}
                            required
                        />

                        <label htmlFor="cvv">CVV</label>
                        <input
                            type="text"
                            id="cvv"
                            name="cvv"
                            value={cvv}
                            onChange={handleCvvChange}
                            placeholder="CVV"
                            required
                        />
                    </div>
                    
                    <button type="submit">Pay Now</button>
                </form>
            </div>
        </div>
    );
};
