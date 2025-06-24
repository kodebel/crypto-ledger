const express = require('express');
const { Pool } = require('pg');
const router = express.Router();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Create transaction
router.post('/', async (req, res) => {
    const { type, asset, amount, price_per_unit, total, fee, note } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO transactions (type, asset, amount, price_per_unit, total, fee, note)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [type, asset, amount, price_per_unit, total, fee, note]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all transactions
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM transactions ORDER BY timestamp DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

