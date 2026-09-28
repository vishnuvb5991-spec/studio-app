import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initStudioMCP } from './mcp/studioMcp';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

// Register Preetha Studio as a WebMCP server so AI agents can
// interact with bookings, approvals, and studio data directly in-browser.
initStudioMCP();
