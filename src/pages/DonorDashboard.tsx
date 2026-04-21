// ============================================================
// DONOR DASHBOARD - View donation history
// ============================================================

import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ExternalLink, DollarSign, Calendar } from 'lucide-react';
import { useStore } from '../lib/store';
import { formatCurrency, formatDate } from '../lib/utils';
import { useEffect } from 'react';

export default function DonorDashboard() {
  const { currentUser, donations } = useStore();
  const navigate = useNavigate();

  // Redirect if not logged in or not a donor
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else if (currentUser.role !== 'donor') {
      navigate('/dashboard/collector');
    }
  }, [currentUser, navigate]);

  if (!currentUser || currentUser.role !== 'donor') return null;

  // Get this donor's donations
  const myDonations = donations.filter((d) => d.donorId === currentUser.id);
  const totalDonated = myDonations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-3xl font-bold text-text-primary mb-1">Donor Dashboard</h1>
        <p className="text-text-muted">Welcome back, {currentUser.name}! Here's your giving summary.</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {[
          { label: 'Total Donated', value: formatCurrency(totalDonated), icon: DollarSign, color: 'bg-primary/10 text-primary' },
          { label: 'Donations Made', value: myDonations.length.toString(), icon: Heart, color: 'bg-rose-100 text-rose-600' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl border border-border p-5"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon size={20} />
            </div>
            <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
            <p className="text-sm text-text-muted mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Donation History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-border overflow-hidden"
      >
        <div className="p-6 border-b border-border">
          <h2 className="font-semibold text-lg">Donation History</h2>
        </div>

        {myDonations.length > 0 ? (
          <div className="divide-y divide-border-light">
            {myDonations.slice().reverse().map((donation) => (
              <div key={donation.id} className="p-5 flex items-center justify-between hover:bg-surface transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Heart size={18} className="text-primary" />
                  </div>
                  <div>
                    <Link
                      to={`/project/${donation.projectId}`}
                      className="text-sm font-semibold text-text-primary hover:text-primary transition-colors flex items-center gap-1"
                    >
                      {donation.projectTitle}
                      <ExternalLink size={12} />
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar size={12} className="text-text-muted" />
                      <span className="text-xs text-text-muted">{formatDate(donation.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{formatCurrency(donation.amount)}</p>
                  <p className="text-xs text-text-muted">Total: {formatCurrency(donation.totalPaid)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-surface-warm flex items-center justify-center mx-auto mb-4">
              <Heart size={24} className="text-text-muted" />
            </div>
            <h3 className="font-semibold text-text-primary mb-2">No donations yet</h3>
            <p className="text-sm text-text-muted mb-4">Start giving to see your donation history here.</p>
            <Link
              to="/projects"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark"
            >
              Browse Projects <ExternalLink size={14} />
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}