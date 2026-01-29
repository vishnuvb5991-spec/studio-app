import React from 'react';
import { CreditCard } from 'lucide-react';

function Payments() {
    return (
        <div className="animate-fadeIn">
            <div style={{ marginBottom: '2rem' }}>
                <h1>Payments</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Track all transactions</p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
                <CreditCard size={64} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                <h3>No Payments Yet</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Payment history will appear here</p>
            </div>
        </div>
    );
}

export default Payments;
