import express from 'express';
import dotenv from 'dotenv';
import mysql from 'mysql';
import bodyParser from 'body-parser';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// Create MySQL connection pool using async/await
const db = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Basic route
app.get('/', (req, res) => {
    res.send('Welcome to the Express.js server with ES Modules!');
});

// Fetch all users from the database (example)
app.get('/users', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM users');
        res.json(rows);
    } catch (error) {
        res.status(500).send('Error fetching users');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
