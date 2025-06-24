import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Transaction = {
    id: number;
    timestamp: string;
    type: string;
    asset: string;
    amount: string;
    total: string;
    fee: string;
};

export default function TransactionTable() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [total, setTotal] = useState(0);

    const fetchTransactions = async (pageNum = page) => {
        let url = '/api/transactions';
        const params: Record<string, string | number> = { page: pageNum, limit };
        if (start) params.start = start;
        if (end) params.end = end;
        const query = new URLSearchParams(params as any).toString();
        if (query) url += `?${query}`;
        const res = await axios.get(url);
        setTransactions(res.data.data);
        setTotal(res.data.total);
    };

    useEffect(() => {
        fetchTransactions(1);
        // eslint-disable-next-line
    }, [start, end]);

    useEffect(() => {
        fetchTransactions(page);
        // eslint-disable-next-line
    }, [page]);

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchTransactions(1);
    };

    const formatWIB = (iso: string) => {
        const date = new Date(iso);
        return date.toLocaleString('en-CA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'Asia/Jakarta',
        }).replace(',', '');
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <div>
            <form className="row g-2 mb-3" onSubmit={handleFilter}>
                <div className="col">
                    <input
                        type="date"
                        className="form-control"
                        value={start}
                        onChange={e => setStart(e.target.value)}
                        placeholder="Start date"
                    />
                </div>
                <div className="col">
                    <input
                        type="date"
                        className="form-control"
                        value={end}
                        onChange={e => setEnd(e.target.value)}
                        placeholder="End date"
                    />
                </div>
                <div className="col">
                    <button className="btn btn-outline-dark" type="submit">Filter</button>
                </div>
            </form>
            <div style={{ overflowX: 'auto' }}>
                <table className="table table-striped table-bordered">
                    <thead>
                    <tr>
                        <th>Timestamp (WIB)</th>
                        <th>Type</th>
                        <th>Asset</th>
                        <th>Amount</th>
                        <th>Total</th>
                        <th>Fee</th>
                    </tr>
                    </thead>
                    <tbody>
                    {transactions.map(tx => (
                        <tr key={tx.id}>
                            <td>{formatWIB(tx.timestamp)}</td>
                            <td>{tx.type}</td>
                            <td>{tx.asset}</td>
                            <td>{tx.amount}</td>
                            <td>{tx.total}</td>
                            <td>{tx.fee}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <nav>
                <ul className="pagination justify-content-end">
                    <li className={`page-item${page === 1 ? ' disabled' : ''}`}>
                        <button className="page-link" onClick={() => setPage(page - 1)} disabled={page === 1}>
                            Previous
                        </button>
                    </li>
                    {[...Array(totalPages)].map((_, idx) => (
                        <li key={idx + 1} className={`page-item${page === idx + 1 ? ' active' : ''}`}>
                            <button className="page-link" onClick={() => setPage(idx + 1)}>
                                {idx + 1}
                            </button>
                        </li>
                    ))}
                    <li className={`page-item${page === totalPages ? ' disabled' : ''}`}>
                        <button className="page-link" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

