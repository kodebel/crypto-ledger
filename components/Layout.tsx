import React, { ReactNode } from 'react';
import Logout from './Logout';

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className=" d-flex flex-column bg-light" style={{ height: '100%' }}>
            <header className="py-3 bg-dark text-white text-center position-relative">
                <h1>Crypto Ledger</h1>
                <div className="position-absolute end-0 top-0 m-3">
                    <Logout />
                </div>
            </header>
            <main className="flex-grow-1 d-flex justify-content-center align-items-center">
                <div className="w-100 px-1 py-2" style={{ maxWidth: 800 }}>
                    {children}
                </div>
            </main>
        </div>
    );
}
