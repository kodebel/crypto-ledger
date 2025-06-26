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

type Props = {
    onFilterChange?: (filter: { start: string; end: string }) => void;
};

export default function TransactionTable({ onFilterChange }: Props) {
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
        if (onFilterChange) onFilterChange({ start, end });
    };

    const formatWIB = (iso: string) => {
        const date = new Date(iso);
        return date.toLocaleString('en-CA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).replace(',', '');
    };

    const totalPages = Math.ceil(total / limit);

    const typeOptions = [
        { value: 'buy', label: 'Buy' },
        { value: 'sell', label: 'Sell' },
        { value: 'transfer_in', label: 'Transfer In' },
        { value: 'transfer_out', label: 'Transfer Out' },
    ];

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
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Fee</th>
                        <th>Total</th>
                        <th>Asset</th>
                        <th>Created At</th>
                    </tr>
                    </thead>
                    <tbody>
                    {transactions.map(tx => (
                        <tr key={tx.id}>
                            <td>{typeOptions.find(opt => opt.value === tx.type)?.label || tx.type}</td>
                            <td>{Number(tx.amount).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
                            <td>{Number(tx.fee).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
                            <td>{Number(tx.total).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
                            <td>{tx.asset}</td>
                            <td>{formatWIB(tx.timestamp)}</td>
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

