import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Props = {
    start?: string;
    end?: string;
};

export default function WithdrawalsCard({ start, end }: Props) {
    const [withdrawal, setWithdrawal] = useState<string>('0');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        let url = '/api/withdrawals';
        const params: Record<string, string> = {};
        if (start) params.start = start;
        if (end) params.end = end;
        const query = new URLSearchParams(params).toString();
        if (query) url += `?${query}`;
        axios.get(url)
            .then(res => {
                setWithdrawal(res.data.withdrawl || '0');
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load withdrawal');
                setLoading(false);
            });
    }, [start, end]);

    if (loading) return <div>Loading withdrawal...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="card bg-dark text-white mb-3">
            <div className="card-body text-start">
                <h6 className="card-title">Total Withdrawal</h6>
                <h4 className="card-text">
                    {Number(withdrawal).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                </h4>
            </div>
        </div>
    );
}

