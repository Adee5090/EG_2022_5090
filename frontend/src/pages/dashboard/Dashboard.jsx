import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import Navbar from "../../comp/nav/NavBar";

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
    <>
     {/* <Navbar/> */}
    <div className="dashboard-container">
     
      <div className="content">
        {/* Profile Section */}
        <div className="profile-card">
          <h2>User Dashboard</h2>
          {user ? (
            <div className="user-info">
              <div className="avatar">{user.first_name.charAt(0)}</div>
              <h3>
                {user.first_name} {user.last_name}
              </h3>
              <p className="email">{user.email}</p>
              <table className="details">
                <tbody>
                  <tr>
                    <td className="first-col">
                      <strong>📞 Phone:</strong>
                    </td>
                    <td>{user.phone}</td>
                  </tr>
                  <tr>
                    <td className="first-col">
                      <strong>🆔 NIC:</strong>
                    </td>
                    <td>{user.nic}</td>
                  </tr>
                  <tr>
                    <td className="first-col">
                      <strong>🏠 Address:</strong>
                    </td>
                    <td>{user.adress}</td>
                  </tr>
                </tbody>
              </table>
              <Link to={"/user/edit"}>
                <button className="edit-btn">Edit</button>
              </Link>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
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
    </>
  );
};

export default Dashboard;
