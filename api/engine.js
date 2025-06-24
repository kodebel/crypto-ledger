const express = require('express');
const { Pool } = require('pg');
const router = express.Router();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Create transaction
router.post('/transactions', async (req, res) => {
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
router.get('/transactions', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM transactions ORDER BY timestamp DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get portfolio summary
router.get('/portfolios', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT 
        asset,
        SUM(CASE WHEN type IN ('buy', 'transfer_in') THEN amount ELSE 0 END) -
        SUM(CASE WHEN type IN ('sell', 'transfer_out') THEN amount ELSE 0 END) AS total_holding,
        SUM(CASE WHEN type = 'buy' THEN total ELSE 0 END) AS total_invested,
        SUM(CASE WHEN type = 'sell' THEN total ELSE 0 END) AS total_sold
      FROM transactions
      GROUP BY asset
    `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

