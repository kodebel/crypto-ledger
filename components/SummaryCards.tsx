import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Summary = {
    balance: string;
    wallet: string;
    deposit: string;
    withdrawl: string;
};

export default function SummaryCards() {
    const [summary, setSummary] = useState<Summary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('/api/summaries')
            .then(res => {
                setSummary(res.data);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to load summary');
                setLoading(false);
            });
    }, []);

    if (loading) return <div>...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!summary) return null;

    const formatCurrency = (val: string) =>
        Number(val).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });

    const balanceValue = Number(summary.balance);

    return (
        <div className="row mb-4 flex-nowrap overflow-auto m-0">
            <div className="col-md-3 col-3 mb-3" style={{ minWidth: 220 }}>
                <div className={`card bg-gray text-dark-emphasis border-0`}>
                    <div className="card-body text-end">
                        <p className="card-title">Balance</p>
                        <h6 className={`card-text ${balanceValue < 0 ? 'text-danger' : 'text-success'}`}>{formatCurrency(summary.balance)}</h6>
                    </div>
                </div>
            </div>
            <div className="col-md-3 col-3 mb-3" style={{ minWidth: 220 }}>
                <div className="card bg-gray text-dark-emphasis border-0">
                    <div className="card-body text-end">
                        <p className="card-title">Wallet</p>
                        <h6 className="card-text">{formatCurrency(summary.wallet)}</h6>
                    </div>
                </div>
            </div>
            <div className="col-md-3 col-3 mb-3" style={{ minWidth: 220 }}>
                <div className="card bg-gray text-dark-emphasis border-0">
                    <div className="card-body text-end">
                        <p className="card-title">Total Deposit</p>
                        <h6 className="card-text">{formatCurrency(summary.deposit)}</h6>
                    </div>
                </div>
            </div>
            <div className="col-md-3 col-3 mb-3" style={{ minWidth: 220 }}>
                <div className="card bg-gray text-dark-emphasis border-0">
                    <div className="card-body text-end">
                        <p className="card-title">Total Withdrawal</p>
                        <h6 className="card-text">{formatCurrency(summary.withdrawl)}</h6>
                    </div>
                </div>
            </div>
        </div>
    );
}
