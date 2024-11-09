import React, { useState } from "react";
import DOMPurify from 'dompurify';  // For XSS prevention

export const Register = (props) => {
    const [name, setName] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [pass, setPass] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Prepend 'cust' to the account number
        const fullAccountNumber = `cust${accountNumber}`;

        // Send the registration request
        const response = await fetch('https://localhost:3001/api/users/register', 
        {
            method: 'POST',
            headers: 
            {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Ensure cookies are included in the request
            body: JSON.stringify({ fullName: name, idNumber, accountNumber: fullAccountNumber, password: pass }),
        });

        const data = await response.text();
        if (response.status === 201) 
        {
            alert('Registration successful!');
            props.onFormSwitch('login');
        } 
        else 
        {
            alert('Registration failed. Please try again.');
        }
        console.log(data);
    };    

    // Validate input patterns
    const handleNameChange = (e) => {
        const value = e.target.value;
        if (/^[a-zA-Z\s]*$/.test(value)) { // Allow only letters and spaces
            setName(value);
        }
    };

    const handleIdNumberChange = (e) => {
        const value = e.target.value;
        if (/^\d{0,13}$/.test(value)) { // Allow only up to 13 digits
            setIdNumber(value);
        }
    };

    const handleAccountNumberChange = (e) => {
        const value = e.target.value;
        if (/^\d{0,4}$/.test(value)) { // Allow only up to 4 digits
            setAccountNumber(value);
        }
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        if (/^[A-Za-z\d]{0,16}$/.test(value)) { // Allows letters and numbers, up to 16 characters
            setPass(value);
        }
    };

    return (
        <div className="auth-form-container">
            <h2>Register</h2>
            <form className="register-form" onSubmit={handleSubmit}>
                <label htmlFor="name">Full Name</label>
                <input
                    value={DOMPurify.sanitize(name)} // Sanitize the input to prevent XSS
                    onChange={handleNameChange}
                    name="name"
                    id="name"
                    placeholder="John Doe"
                />
                <label htmlFor="idNumber">ID Number</label>
                <input
                    value={idNumber} 
                    onChange={handleIdNumberChange}
                    type="text"
                    placeholder="Your ID Number"
                    id="idNumber"
                    name="idNumber"
                />
                <label htmlFor="accountNumber">Account Number</label>
                <input
                    value={accountNumber} 
                    onChange={handleAccountNumberChange}
                    type="text"
                    placeholder="Account Number (e.g 0000)"
                    id="accountNumber"
                    name="accountNumber"
                />
                <label htmlFor="password">Password</label>
                <input
                    value={pass}
                    onChange={handlePasswordChange}
                    type="password"
                    placeholder="***********"
                    id="password"
                    name="password"
                />
                <button type="submit">Register</button>
            </form>
            <button className="link-btn" onClick={() => props.onFormSwitch('login')}>
                Already have an account? Log In
            </button>
        </div>
    );
};
