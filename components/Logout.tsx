import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

export default function Logout() {
    const router = useRouter();

    const handleLogout = () => {
        Cookies.remove('token');
        router.push('/login');
    };

    return (
        <button className="btn btn-outline-danger mt-3" onClick={handleLogout}>
            Logout
        </button>
    );
}
