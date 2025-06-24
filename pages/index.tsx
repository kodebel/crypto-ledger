import { GetServerSideProps } from 'next';
import jwt from 'jsonwebtoken';
import Layout from '../components/Layout';
import TransactionTable from "../components/transaction/TransactionTable";
import TransactionFormModal from "../components/transaction/TransactionFormModal";

export default function Home({ username }: { username: string }) {
    return (
        <Layout>
            <div className="text-center">
                <h3>Welcome, {username}!</h3>
                <TransactionTable />
            </div>
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
