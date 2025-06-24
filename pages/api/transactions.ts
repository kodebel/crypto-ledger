import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    try {
        if (req.method === 'POST') {
            const token = req.cookies.token;
            if (!token) return res.status(401).json({ error: 'Unauthorized' });

            const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
            let decoded: any;
            try {
                decoded = jwt.verify(token, JWT_SECRET);
            } catch {
                return res.status(401).json({ error: 'Invalid token' });
            }

            // Get user_id from username
            const userResult = await pool.query(
                'SELECT id FROM users WHERE username = $1',
                [decoded.username]
            );
            if (userResult.rowCount === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            const user_id = userResult.rows[0].id;

            const { datetime, type, asset, amount, price_per_unit, total, fee } = req.body;

            // Basic validation
            if (!type || !asset || !amount || !price_per_unit || !total || !fee) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const insertResult = await pool.query(
                `INSERT INTO transactions 
                (user_id, type, asset, amount, price_per_unit, total, fee, timestamp)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *`,
                [
                    user_id,
                    type,
                    asset,
                    amount,
                    price_per_unit,
                    total,
                    fee,
                    datetime ? new Date(datetime) : new Date()
                ]
            );

            res.status(201).json({ transaction: insertResult.rows[0] });
        } else if (req.method === 'GET') {
            const token = req.cookies.token;
            if (!token) return res.status(401).json({ error: 'Unauthorized' });

            const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
            let decoded: any;
            try {
                decoded = jwt.verify(token, JWT_SECRET);
            } catch {
                return res.status(401).json({ error: 'Invalid token' });
            }

            // Pagination params
            const page = parseInt((req.query.page as string) || '1', 10);
            const limit = parseInt((req.query.limit as string) || '10', 10);
            const offset = (page - 1) * limit;

            const result = await pool.query(
                'SELECT id, username FROM users WHERE username = $1',
                [decoded.username]
            );

            const user = result.rows[0];

            // Date range filter
            const { start, end } = req.query;
            let where = 'WHERE user_id = $1';
            const params: any[] = [user.id];
            let paramIdx = 2;

            if (start && end) {
                where += ` AND timestamp BETWEEN $${paramIdx} AND $${paramIdx + 1}`;
                params.push(start, end);
                paramIdx += 2;
            }

            // Get total count
            const countResult = await pool.query(
                `SELECT COUNT(*) FROM transactions ${where}`,
                params
            );
            const total = parseInt(countResult.rows[0].count, 10);

            // Get paginated data
            const dataResult = await pool.query(
                `SELECT * FROM transactions ${where} ORDER BY id DESC LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
                [...params, limit, offset]
            );

            res.status(200).json({
                total,
                page,
                limit,
                data: dataResult.rows,
            });
        } else {
            // Handle GET or other methods...
            res.status(405).json({ error: 'Method not allowed' });
        }

    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
}

