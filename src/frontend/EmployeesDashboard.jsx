import React, { useEffect, useState } from 'react';
import './EmployeesDash.css';

export const EmployeesDashboard = ({ onFormSwitch }) => {
    const [payments, setPayments] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await fetch('https://localhost:3001/api/payments');
                if (!response.ok) {
                    throw new Error('Failed to fetch payments');
                }
                const data = await response.json();
                setPayments(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching payments:', error);
                setError('Error fetching payments');
                setPayments([]);
            }
        };

        fetchPayments();
    }, []);

    const handleVerify = async (paymentId) => {
        try {
            const response = await fetch(`https://localhost:3001/api/payments/${paymentId}/verify`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                // Update the local payments state to reflect the verification status
                setPayments(payments.map(payment => 
                    payment._id === paymentId ? { ...payment, verified: true } : payment
                ));
            } else {
                console.error('Failed to verify payment');
            }
        } catch (error) {
            console.error('Error verifying payment:', error);
        }
    };

    const handleLogout = () => {
        onFormSwitch('login');
        alert('You have been logged out.');
    };

    return (
        <div className="employees-dashboard">
            <nav className="navbar">
                <div className="navbar-right">
                    <span className="nav-link logout" onClick={handleLogout}>Log Out</span>
                </div>
            </nav>
            <h1>Employees Dashboard</h1>
            {error ? (
                <p>{error}</p>
            ) : (
                <table className="employees-table">
                    <thead>
                        <tr>
                            <th>Object ID</th>
                            <th>Amount</th>
                            <th>Currency</th>
                            <th>SWIFT Code</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map(payment => (
                            <tr key={payment._id}>
                                <td>{payment._id}</td>
                                <td>{payment.amount}</td>
                                <td>{payment.currency}</td>
                                <td>{payment.swiftCode}</td>
                                <td>{new Date(payment.date).toLocaleString()}</td>
                                <td>
                                    <button
                                        onClick={() => handleVerify(payment._id)}
                                        disabled={payment.verified}
                                        style={{ backgroundColor: payment.verified ? 'grey' : 'blue', color: 'white' }}
                                    >
                                        {payment.verified ? 'Verified' : 'Verify'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <button className="submit-button">Submit</button>
        </div>
    );
};
