import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
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
            const response = await axios.post("http://localhost:5000/login", formData);
            setMessage(response.data.message);
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("userType", response.data.type);
                if(response.data.type === "admin") {
                    navigate("/admin");
                }else{
                    navigate("/dashboard");
                }
            }
        } catch (error) {
            setMessage(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <button type="submit">Login</button>
            </form>
            <p className="login-message">{message}</p>
            <button className="login-toggle-btn" onClick={() => navigate("/register")}>
                Don't have an account? Register
            </button>
        </div>
    );
};

export default Login;
