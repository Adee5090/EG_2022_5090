import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./AdminDashBoard.css";
import StatsCards from "../StatsCards/StatsCards";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await axios.get("http://localhost:5000/admin/users", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
                navigate("/login");
            }
        };

        fetchUsers();
    }, [navigate]);

    const handleLogout = ()=>{
        localStorage.removeItem("token");
        navigate('/');
    }

    return (
        <div className="admin-dashboard">
            <nav className="log-out">
                <button onClick={handleLogout} >Log Out</button>
            </nav>
            <h2>Admin Dashboard</h2>

            {/* Include Stats Cards */}
            <StatsCards />
            <Link to={"/admin/pdf"}><button className="pdf-btn">PDF</button></Link>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Type</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.user_id}>
                            <td>{user.user_id}</td>
                            <td>{user.first_name}</td>
                            <td>{user.last_name}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td className={`role ${user.type === "admin" ? "admin" : "user"}`}>
                                {user.type.toUpperCase()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
