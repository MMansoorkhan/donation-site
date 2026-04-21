// ============================================================
// LOGIN PAGE - Separate tabs for Donor and Collector login
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, type UserRole } from '../lib/store';

export default function LoginPage() {
  const { login } = useStore();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('donor');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password, role);
    setLoading(false);
    if (result.success) {
      navigate(role === 'donor' ? '/dashboard/donor' : '/dashboard/collector');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="p-8 bg-white border rounded-2xl shadow-sm w-full max-w-md space-y-4">
        <h1 className="text-xl font-bold">Login</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded" placeholder="Email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded" placeholder="Password" />
        <button className="w-full p-2 bg-primary text-white rounded">{loading ? 'Logging in...' : 'Login'}</button>
      </form>
    </div>
  );
}
