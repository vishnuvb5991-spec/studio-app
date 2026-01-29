import React from 'react';
import { useAuth } from '../context/AuthContext';

function Settings() {
    const { user } = useAuth();

    return (
        <div className="animate-fadeIn">
            <div style={{ marginBottom: '2rem' }}>
                <h1>Settings</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Manage your studio settings</p>
            </div>

            <div className="card" style={{ maxWidth: 600 }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Profile Information</h3>

                <div style={{ marginBottom: '1.25rem' }}>
                    <label>Full Name</label>
                    <input type="text" defaultValue={`${user?.first_name || ''} ${user?.last_name || ''}`} />
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                    <label>Email</label>
                    <input type="email" defaultValue={user?.email || ''} disabled />
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                    <label>Phone</label>
                    <input type="tel" defaultValue={user?.phone || ''} />
                </div>

                <button className="btn btn-primary">Save Changes</button>
            </div>
        </div>
    );
}

export default Settings;
