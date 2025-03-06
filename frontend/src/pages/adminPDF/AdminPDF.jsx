import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminPDF.css";

const AdminPDF = () => {
    const [pdfs, setPdfs] = useState([]);
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    
    useEffect(() => {
        fetchPdfs();
    }, []);

    const fetchPdfs = async () => {
        try {
            const response = await axios.get("http://localhost:5000/pdfs");
            setPdfs(response.data);
        } catch (error) {
            console.error("Error fetching PDFs:", error);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !title) {
            alert("Please select a file and enter a title");
            return;
        }

        const formData = new FormData();
        formData.append("pdf", file);
        formData.append("title", title);

        try {
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:5000/admin/upload-pdf", formData, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
            });
            alert("PDF uploaded successfully!");
            fetchPdfs();
        } catch (error) {
            console.error("Error uploading PDF:", error);
        }
    };

    const handleDelete = async (pdfId) => {
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`http://localhost:5000/admin/delete-pdf/${pdfId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("PDF deleted successfully!");
            fetchPdfs();
        } catch (error) {
            console.error("Error deleting PDF:", error);
        }
    };

    return (
        <div className="admin-pdf-container">
            <h2>Manage PDFs</h2>

            <form onSubmit={handleUpload} className="upload-form">
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} required />
                <button type="submit">Upload PDF</button>
            </form>

            <h3>Uploaded PDFs</h3>
            <ul className="pdf-list">
                {pdfs.map((pdf) => (
                    <li key={pdf.pdf_id}>
                        <a href={pdf.url} target="_blank" rel="noopener noreferrer">{pdf.title}</a>
                        <button className="delete-btn" onClick={() => handleDelete(pdf.pdf_id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminPDF;
