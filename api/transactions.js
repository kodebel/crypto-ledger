const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

module.exports = async (req, res) => {
    if (req.method === 'POST') {
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
    } else if (req.method === 'GET') {
        try {
            const result = await pool.query('SELECT * FROM transactions ORDER BY timestamp DESC');
            res.json(result.rows);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};

