import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StatsCards.css";

const StatsCards = () => {
    const [userCount, setUserCount] = useState(0);
    const [pdfCount, setPdfCount] = useState(0);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const userResponse = await axios.get("http://localhost:5000/admin/user-count", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });

                const pdfResponse = await axios.get("http://localhost:5000/admin/pdf-count", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });

                setUserCount(userResponse.data.count);
                setPdfCount(pdfResponse.data.count);
            } catch (error) {
                console.error("Error fetching counts:", error);
            }
        };

        fetchCounts();
    }, []);

    return (
        <div className="stats-container">
            <div className="stat-card users">
                <h3>👥 Total Users</h3>
                <p>{userCount}</p>
            </div>
            <div className="stat-card pdfs">
                <h3>📄 Total PDFs</h3>
                <p>{pdfCount}</p>
            </div>
        </div>
    );
};

export default StatsCards;
