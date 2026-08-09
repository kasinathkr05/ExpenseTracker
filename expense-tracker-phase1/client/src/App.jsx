import { useEffect, useState } from 'react';
import { api } from './services/api';

// This is a temporary Phase 1 placeholder. Pages, routing, and the real
// dashboard UI are built in Phase 3 onward.
export default function App() {
  const [apiStatus, setApiStatus] = useState('checking...');

  useEffect(() => {
    api
      .get('/health')
      .then((data) => setApiStatus(data.status))
      .catch(() => setApiStatus('unreachable'));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white shadow-sm rounded-xl p-8 max-w-md w-full text-center space-y-2">
        <h1 className="text-2xl font-semibold text-slate-800">ExpenseTracker</h1>
        <p className="text-slate-500">Phase 1 scaffold running.</p>
        <p className="text-sm text-slate-400">
          API status:{' '}
          <span
            className={apiStatus === 'ok' ? 'text-green-600 font-medium' : 'text-red-500 font-medium'}
          >
            {apiStatus}
          </span>
        </p>
      </div>
    </div>
  );
}
