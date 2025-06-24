import React, { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="min-vh-100 d-flex flex-column bg-light">
            <header className="py-3 bg-dark text-white text-center">
                <h1>Crypto Ledger</h1>
            </header>
            <main className="flex-grow-1 d-flex justify-content-center align-items-center">
                <div className="w-100" style={{ maxWidth: 400 }}>
                    {children}
                </div>
            </main>
        </div>
    );
}

