import { GetServerSideProps } from 'next';
import React, { useState } from 'react';
import jwt from 'jsonwebtoken';
import Layout from '../components/Layout';
import TransactionTable from "../components/transaction/TransactionTable";
import TransactionFormModal from "../components/transaction/TransactionFormModal";
import WithdrawalsCard from "../components/WithdrawalsCard";
import SummaryCards from "../components/SummaryCards";

export default function Home({ username }: { username: string }) {

    const [filter, setFilter] = useState<{ start: string; end: string }>({ start: '', end: '' });

    return (
        <Layout>
            <div className="text-center m-4">
                <h6>Woyyy, {username}!</h6>
            </div>
            <SummaryCards />
            <TransactionTable />
            <WithdrawalsCard start={filter.start} end={filter.end} />
            <TransactionFormModal />
        </Layout>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req } = context;
    const token = req.cookies?.token || '';

    try {
        const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
        const decoded = jwt.verify(token, JWT_SECRET) as { username: string };
        return { props: { username: decoded.username } };
    } catch {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }
};
