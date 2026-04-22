const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// GET: Fetch top 10 scores
app.get('/api/scores', async (req, res) => {
    try {
        const result = await pool.query('SELECT first_name, last_name, score FROM high_scores ORDER BY score DESC LIMIT 10');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// POST: Save a new score
app.post('/api/scores', async (req, res) => {
    const { first_name, last_name, email, score } = req.body;
    try {
        await pool.query(
            'INSERT INTO high_scores (first_name, last_name, email, score) VALUES ($1, $2, $3, $4)',
            [first_name, last_name, email, score]
        );
        res.status(201).send('Score saved!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));