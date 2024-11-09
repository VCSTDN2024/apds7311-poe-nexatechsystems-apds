import React, { useState } from "react";
import DOMPurify from 'dompurify';  // For XSS prevention

export const Login = (props) => {
    const [idNumber, setIdNumber] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [pass, setPass] = useState('');
    const [userType, setUserType] = useState('customer'); // Default to 'customer'

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepend the appropriate prefix based on user type
        const prefixedAccountNumber = userType === 'customer' ? `cust${accountNumber}` : `emp${accountNumber}`;

        // Send the login request
        const response = await fetch('https://localhost:3001/api/users/login',  
        {
            method: 'POST',
            headers: 
            {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Ensure cookies are included in the request
            mode: 'cors',
            body: JSON.stringify({ idNumber, accountNumber: prefixedAccountNumber, password: pass }),
        });

        const data = await response.text();
        if (response.status === 200) 
        {
            alert('Login successful!');
            if (prefixedAccountNumber.startsWith('cust')) {
                props.onFormSwitch('dashboard'); // Redirect to customer dashboard
            } else if (prefixedAccountNumber.startsWith('emp')) {
                props.onFormSwitch('employeesDashboard'); // Redirect to employee dashboard
            }
        } 
        else 
        {
            alert('Invalid credentials. Please try again.');
        }
        console.log(data);
    };

    return (
        <div className="auth-form-container">
    <h2>Login</h2>
    <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="idNumber">ID Number</label>
        <input
            value={DOMPurify.sanitize(idNumber)}
            onChange={(e) => setIdNumber(e.target.value)}
            type="text"
            placeholder="Your ID Number"
            id="idNumber"
            name="idNumber"
        />
        <label htmlFor="accountNumber">Account Number</label>
        <div className="account-number-container">
            <select 
                value={userType} 
                onChange={(e) => setUserType(e.target.value)}
            >
                <option value="customer">Customer</option>
                <option value="employee">Employee</option>
            </select>
            <input
                value={DOMPurify.sanitize(accountNumber)}
                onChange={(e) => setAccountNumber(e.target.value)}
                type="text"
                placeholder="Account Number (e.g 0002)"
                id="accountNumber"
                name="accountNumber"
            />
        </div>
        <label htmlFor="password">Password</label>
        <input
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            type="password"
            placeholder="***********"
            id="password"
            name="password"
        />
        <button type="submit">Log In</button>
    </form>
    <button className="link-btn" onClick={() => props.onFormSwitch('register')}>
        Don't have an account? Register
    </button>
</div>

    );
};
