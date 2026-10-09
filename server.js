require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const port = 3000;

// Set EJS as templating engine
app.set('view engine', 'ejs');

// MySQL Database connection
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'movies_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Route to display movies
app.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM movies ORDER BY release_year DESC');
        res.render('index', { movies: rows });
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).send('Error retrieving movies from the database. Please ensure your database is running and configured correctly.');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
