import { useState, useEffect } from "react";
import "./EditProfile.css"; // Import the CSS file
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        phone: "",
        nic: "",
        email: "",
        adress: "",
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(()=>{
        const token = localStorage.getItem("token");
        if(!token){
            navigate("/");
        }
    })
    useEffect(() => {
        // Fetch user details if needed
        const fetchUserDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("http://localhost:5000/user/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setFormData(data);
                } else {
                    setError(data.message || "Failed to fetch user data");
                }
            } catch (err) {
                setError("Error fetching user data");
            }
        };

        fetchUserDetails();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/user/edit", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
                navigate("/dashboard");
            } else {
                setError(data.message || "Update failed");
            }
        } catch (err) {
            setError("Network error");
        }
    };

    return (
        <div className="edit-profile-container">
            <h2>Edit Profile</h2>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="edit-profile-form">
                <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="First Name"
                    required
                />
                <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Last Name"
                    required
                />
                <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                    required
                />
                <input
                    type="text"
                    name="nic"
                    value={formData.nic}
                    onChange={handleChange}
                    placeholder="NIC (Cannot Change)"
                    disabled
                />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email (Cannot Change)"
                    disabled
                />
                <textarea
                    name="adress"
                    value={formData.adress}
                    onChange={handleChange}
                    placeholder="Address"
                    required
                ></textarea>
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
};

export default EditProfile;
