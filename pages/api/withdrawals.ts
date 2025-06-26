import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== 'GET') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

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

        // Build query with optional timestamp filter
        let where = 'WHERE user_id = $1';
        const params: any[] = [user_id];
        let paramIdx = 2;

        const { start, end } = req.query;
        if (start && end) {
            where += ` AND timestamp BETWEEN $${paramIdx} AND $${paramIdx + 1}`;
            params.push(start, end);
        }

        const result = await pool.query(
            `SELECT 
                COALESCE(SUM(CASE WHEN type = 'transfer_out' THEN amount ELSE 0 END), 0) AS withdrawl
             FROM transactions
             ${where}`,
            params
        );

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}
