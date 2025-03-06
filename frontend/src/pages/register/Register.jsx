import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
    const [formData, setFormData] = useState({
        phone: "",
        first_name: "",
        last_name: "",
        nic: "",
        email: "",
        address: "",
        password: "",
    });

    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/register", formData);
            setMessage(response.data.message);
            navigate("/");
        } catch (error) {
            setMessage(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="phone" placeholder="Phone" onChange={handleChange} required />
                <input type="text" name="first_name" placeholder="First Name" onChange={handleChange} required />
                <input type="text" name="last_name" placeholder="Last Name" onChange={handleChange} required />
                <input type="text" name="nic" placeholder="NIC" onChange={handleChange} required />
                <input type="text" name="address" placeholder="Address" onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <button type="submit">Register</button>
            </form>
            <p className="register-message">{message}</p>
            <button className="register-toggle-btn" onClick={() => navigate("/login")}>
                Already have an account? Login
            </button>
        </div>
    );
};

export default Register;
