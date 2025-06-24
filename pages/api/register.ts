// import type { NextApiRequest, NextApiResponse } from 'next';
// import { Pool } from 'pg';
//
// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL, // Set this in your environment variables
// });
//
// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     if (req.method !== 'POST') return res.status(405).end();
//     const { username, password } = req.body;
//     if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
//
//     try {
//         const userExists = await pool.query('SELECT 1 FROM users WHERE username = $1', [username]);
//         if (userExists.rowCount > 0) return res.status(409).json({ error: 'User exists' });
//
//         await pool.query(
//             'INSERT INTO users (username, password) VALUES ($1, $2)',
//             [username, password]
//         );
//         res.status(201).json({ message: 'User registered' });
//     } catch (err: any) {
//         res.status(500).json({ error: err.message });
//     }
// }