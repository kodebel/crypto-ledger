const express = require('express');
const { Pool } = require('pg');
const router = express.Router();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Get portfolio summary
router.get('/', async (req, res) => {
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

