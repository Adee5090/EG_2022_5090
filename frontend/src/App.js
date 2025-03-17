import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import AdminDashboard from "./pages/adminDashboard/AdminDashboard";
import AdminPDF from "./pages/adminPDF/AdminPDF";
import EditProfile from "./pages/editProfile/EditProfile";
import UploadVideo from "./pages/uploadVideo/UploadVideo";
import Navbar from "./comp/nav/NavBar";
import Footer from "./comp/footer/Footer";
import About from "./pages/about/About";
import Contact from "./pages/contact/Contact";


function App() {
    return (
        <Router>
            <Navbar/>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/user/edit" element={<EditProfile />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/pdf" element={<AdminPDF />} />
                <Route path="/admin/video/upload" element={<UploadVideo />} />
            </Routes>
            <Footer/>
        </Router>
    );
}

export default App;
