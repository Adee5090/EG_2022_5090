import { useState } from "react";
import "./UploadVideo.css"; // Import CSS file

const UploadVideo = () => {
    const [videoID, setVideoID] = useState("");
    const [title, setTitle] = useState("");
    const [videoFile, setVideoFile] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleFileChange = (e) => {
        setVideoFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!videoID || !title) {
            setError("All fields are required.");
            return;
        }

        const formData = new FormData();
        formData.append("videoID", videoID);
        formData.append("title", title);

        try {
            const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
            const response = await fetch("http://localhost:5000/admin/upload-video", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData, // FormData does not need Content-Type (it is set automatically)
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
                setVideoID("");
                setTitle("");
                setVideoFile(null);
            } else {
                setError(data.message || "Failed to upload video");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        }
    };

    return (
        <div className="upload-video-container">
            <h2>Upload Video</h2>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="upload-video-form">
                <input
                    type="text"
                    value={videoID}
                    onChange={(e) => setVideoID(e.target.value)}
                    placeholder="Enter Video ID"
                    required
                />
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter Video Title"
                    required
                />
                <button type="submit">Upload</button>
            </form>
        </div>
    );
};

export default UploadVideo;
