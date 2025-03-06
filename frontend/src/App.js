import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import AdminDashboard from "./pages/adminDashboard/AdminDashboard";
import AdminPDF from "./pages/adminPDF/AdminPDF";


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/pdf" element={<AdminPDF />} />
            </Routes>
        </Router>
    );
}

export default App;
