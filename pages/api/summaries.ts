import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
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

        // Run the summary query for this user
        const summaryResult = await pool.query(
            `SELECT 
                COALESCE(SUM(CASE WHEN type = 'transfer_in' THEN amount ELSE 0 END),0) + 
                COALESCE(SUM(CASE WHEN type = 'sell' THEN amount ELSE 0 END),0) -
                (COALESCE(SUM(CASE WHEN type = 'transfer_out' THEN total ELSE 0 END),0) +
                 COALESCE(SUM(CASE WHEN type = 'buy' THEN total ELSE 0 END),0)) AS wallet,
                COALESCE(SUM(CASE WHEN type = 'transfer_in' THEN amount ELSE 0 END),0) AS deposit,
                (COALESCE(SUM(CASE WHEN type = 'transfer_in' THEN amount ELSE 0 END),0) -
                 (COALESCE(SUM(CASE WHEN type = 'transfer_out' THEN total ELSE 0 END),0) +
                  COALESCE(SUM(CASE WHEN type = 'buy' THEN total ELSE 0 END),0)) -
                 COALESCE(SUM(CASE WHEN type = 'transfer_in' THEN amount ELSE 0 END),0)) AS balance,
                COALESCE(SUM(CASE WHEN type = 'transfer_out' THEN amount ELSE 0 END),0) AS withdrawl
            FROM transactions
            WHERE user_id = $1`,
            [user_id]
        );

        res.status(200).json(summaryResult.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}
