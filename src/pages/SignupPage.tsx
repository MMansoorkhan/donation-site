// ============================================================
// SIGNUP PAGE - Donor (simple) and Collector (detailed) signup
// ============================================================

import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Mail, Lock, User, Phone, FileText, Building, AlertCircle, CheckCircle } from 'lucide-react';
import { useStore, type UserRole } from '../lib/store';

export default function SignupPage() {
  const { signup } = useStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialRole = (searchParams.get('role') as UserRole) || 'donor';
  const [role, setRole] = useState<UserRole>(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [organization, setOrganization] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const userData = {
      name,
      email,
      role,
      password,
      ...(role === 'collector' && { phone, idNumber, organization }),
    };

    const result = await signup(userData);
    setLoading(false);

    if (result.success) {
      navigate(role === 'donor' ? '/dashboard/donor' : '/dashboard/collector');
    } else {
      setError(result.error || 'Signup failed.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-surface">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>
          {error && <div className="p-3 bg-red-50 text-danger text-sm rounded-xl mb-4 flex items-center gap-2"><AlertCircle size={16}/>{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Full Name" className="w-full p-3 border rounded-xl" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email" className="w-full p-3 border rounded-xl" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password" className="w-full p-3 border rounded-xl" />
            <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-white rounded-xl font-bold">
              {loading ? 'Creating...' : 'Sign Up'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
