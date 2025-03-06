import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [pdfs, setPdfs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await axios.get("http://localhost:5000/user/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
                navigate("/login");
            }
        };

        const fetchPdfs = async () => {
            try {
                const response = await axios.get("http://localhost:5000/pdfs");
                setPdfs(response.data);
            } catch (error) {
                console.error("Error fetching PDFs:", error);
            }
        };

        fetchUserData();
        fetchPdfs();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="dashboard-container">
            <div className="content">
                {/* Profile Section */}
                <div className="profile-card">
                    <h2>User Dashboard</h2>
                    {user ? (
                        <div className="user-info">
                            <div className="avatar">{user.first_name.charAt(0)}</div>
                            <h3>{user.first_name} {user.last_name}</h3>
                            <p className="email">{user.email}</p>
                            <div className="details">
                                <p><strong>📞 Phone:</strong> {user.phone}</p>
                                <p><strong>🆔 NIC:</strong> {user.nic}</p>
                                <p><strong>🏠 Address:</strong> {user.adress}</p>
                                <p className={`role ${user.type === "admin" ? "admin" : "user"}`}>
                                    {user.type.toUpperCase()}
                                </p>
                            </div>
                            <button className="logout-btn" onClick={handleLogout}>Logout</button>
                        </div>
                    ) : (
                        <p>Loading user data...</p>
                    )}
                </div>

                {/* PDF Section */}
                <div className="pdf-card">
                    <h3>Available PDFs</h3>
                    {pdfs.length === 0 ? (
                        <p className="no-pdfs">No PDFs available.</p>
                    ) : (
                        <ul className="pdf-list">
                            {pdfs.map((pdf) => (
                                <li key={pdf.pdf_id}>
                                    <a href={pdf.url} target="_blank" rel="noopener noreferrer">
                                        📄 {pdf.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
