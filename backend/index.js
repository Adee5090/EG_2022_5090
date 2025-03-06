const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const morgan = require('morgan');
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'))

const PORT = process.env.PORT || 5000;
const SECRET_KEY = "hsdhsdjsdoljsdkjolsdj"; // Change this to a strong secret key

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'ewinners.lk',
    user: 'ewinners_adisha',
    password: 'adisha20715###', // Change as per your MySQL setup
    database: 'ewinners_gui', // Change as per your MySQL setup
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to MySQL Database');
    }
});

// Register API
app.post('/register', async (req, res) => {
    const { phone, first_name, last_name, nic, email, address, password } = req.body;

    if (!phone || !email || !password) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database
        const sql = "INSERT INTO users (phone, first_name, last_name, nic, email, adress, password) VALUES (?, ?, ?, ?, ?, ?, ?)";
        db.query(sql, [phone, first_name, last_name, nic, email, address, hashedPassword], (err, result) => {
            if (err) {
                console.error('Error inserting user:', err);
                return res.status(500).json({ message: "Database error" });
            }
            res.status(201).json({ message: "User registered successfully" });
        });
    } catch (error) {
        res.status(500).json({ message: "Error hashing password" });
    }
});

// Login API
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Missing email or password" });
    }

    // Fetch user from database
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: "Database error" });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = results[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { user_id: user.user_id, type: user.type },
            SECRET_KEY,
            { expiresIn: '2h' }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            type: user.type
        });
    });
});

// Middleware to authenticate user using JWT
const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Access Denied. No token provided" });

    try {
        const verified = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY);
        req.user = verified; // Attach user info to the request
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid Token" });
    }
};

// Fetch logged-in user's own data
app.get('/user/me', authenticateToken, (req, res) => {
    const userId = req.user.user_id; // Extracted from the token

    const sql = "SELECT user_id, phone, first_name, last_name, nic, email, adress, type FROM users WHERE user_id = ?";
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Internal Server Error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(results[0]); // Send user details
    });
});

// Middleware to verify if the user is an admin
const isAdmin = (req, res, next) => {
    if (req.user.type !== "admin") {
        return res.status(403).json({ message: "Access Denied. Admins only!" });
    }
    next();
};

app.get('/admin/users', authenticateToken, isAdmin, (req, res) => {
    const sql = "SELECT user_id, phone, first_name, last_name, nic, email, adress, type FROM users";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
        res.json(results);
    });
});

app.put('/admin/users/:id', authenticateToken, isAdmin, (req, res) => {
    const { first_name, last_name, phone, nic, email, adress, type } = req.body;
    const userId = req.params.id;

    const sql = "UPDATE users SET first_name = ?, last_name = ?, phone = ?, nic = ?, email = ?, adress = ?, type = ? WHERE user_id = ?";
    db.query(sql, [first_name, last_name, phone, nic, email, adress, type, userId], (err, result) => {
        if (err) {
            console.error("Error updating user:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json({ message: "User updated successfully" });
    });
});



// Ensure "uploads" directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
    },
});
const upload = multer({ storage });

// 📌 **Upload PDF (Admin Only)**
app.post("/admin/upload-pdf", authenticateToken, isAdmin, upload.single("pdf"), (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const { title } = req.body;
    const pdfUrl = `http://localhost:5000/uploads/${req.file.filename}`;

    const sql = "INSERT INTO pdf (url, title) VALUES (?, ?)";
    db.query(sql, [pdfUrl, title], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.status(201).json({ message: "PDF uploaded successfully", pdfUrl });
    });
});

// 📌 **Fetch All PDFs (User & Admin)**
app.get("/pdfs", (req, res) => {
    const sql = "SELECT * FROM pdf";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json(results);
    });
});

// 📌 **Delete PDF (Admin Only)**
app.delete("/admin/delete-pdf/:id", authenticateToken, isAdmin, (req, res) => {
    const pdfId = req.params.id;

    const sql = "SELECT url FROM pdf WHERE pdf_id = ?";
    db.query(sql, [pdfId], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "PDF not found" });
        }

        const filePath = results[0].url.replace("http://localhost:5000/uploads/", "uploads/");
        fs.unlink(filePath, (err) => {
            if (err) console.error("Error deleting file:", err);
        });

        db.query("DELETE FROM pdf WHERE pdf_id = ?", [pdfId], (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Database error" });
            }
            res.json({ message: "PDF deleted successfully" });
        });
    });
});

// 📌 **Serve Uploaded Files**
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// 📌 **Get Total Users Count (Admin Only)**
app.get("/admin/user-count", authenticateToken, isAdmin, (req, res) => {
    db.query("SELECT COUNT(*) AS count FROM users", (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json({ count: result[0].count });
    });
});

// 📌 **Get Total PDFs Count (Admin Only)**
app.get("/admin/pdf-count", authenticateToken, isAdmin, (req, res) => {
    db.query("SELECT COUNT(*) AS count FROM pdf", (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json({ count: result[0].count });
    });
});



// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
