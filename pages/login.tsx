import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Cookies from 'js-cookie';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (res.ok) {
            Cookies.set('token', data.token, { expires: 1 }); // expires in 1 day
            router.push('/');
        } else {
            setError(data.error || 'Login failed');
        }
    };

    return (
        <Layout>
            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                <h2 className="text-center">Login</h2>
                {error && <div className="alert alert-danger text-center">{error}</div>}
                <input
                    className="form-control"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <input
                    className="form-control"
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button type="submit" className="btn btn-dark w-100">Login</button>
            </form>
        </Layout>
    );
}
