import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end();
    // For JWT, logout is handled client-side by deleting the token.
    res.status(200).json({ message: 'Logged out (client should delete token)' });
}

