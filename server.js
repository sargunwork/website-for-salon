const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from current directory
app.use(express.static(__dirname));

// Initialize Database
const db = new sqlite3.Database(path.join(__dirname, 'salon.db'), (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Create table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            service TEXT NOT NULL,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
            }
        });
    }
});

// API endpoint to book an appointment
app.post('/api/book', (req, res) => {
    const { name, phone, service, date, time } = req.body;

    if (!name || !phone || !service || !date || !time) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const sql = `INSERT INTO appointments (name, phone, service, date, time) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [name, phone, service, date, time], function(err) {
        if (err) {
            console.error('Error inserting data:', err.message);
            return res.status(500).json({ success: false, message: 'Server error, could not book appointment.' });
        }
        res.status(201).json({ 
            success: true, 
            message: 'Appointment successfully booked!',
            bookingId: this.lastID 
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
