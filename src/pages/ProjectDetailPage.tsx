// ============================================================
// PROJECT DETAIL PAGE - Full project view with donation form
// ============================================================

import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Heart, Landmark, Home, Users, Share2, CheckCircle,
  AlertCircle, Clock, Shield, Upload, DollarSign
} from 'lucide-react';
import { useStore, type ProjectCategory } from '../lib/store';
import { formatCurrency, calcProgress, getCategoryLabel, formatDate } from '../lib/utils';

const categoryIcons: Record<ProjectCategory, React.ElementType> = {
  zakaat: Heart,
  umrah: Landmark,
  shelters: Home,
  orphanages: Users,
};

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, currentUser, makeDonation } = useStore();

  const project = projects.find((p) => p.id === id);

  const [donationAmount, setDonationAmount] = useState('');
  const [tip, setTip] = useState('');
  const [showDonateForm, setShowDonateForm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!project) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-2xl font-bold mb-4">Project Not Found</h2>
        <p className="text-text-muted mb-6">The project you're looking for doesn't exist or has been removed.</p>
        <Link to="/projects" className="text-primary font-semibold hover:text-primary-dark">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  const progress = calcProgress(project.raisedAmount, project.goalAmount);
  const Icon = categoryIcons[project.category];
  const amount = parseFloat(donationAmount) || 0;
  const tipAmount = parseFloat(tip) || 0;
  const platformFee = amount * 0.05;
  const totalPayment = amount + platformFee + tipAmount;

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (amount <= 0) {
      setError('Please enter a valid donation amount.');
      return;
    }

    setLoading(true);

    // 👇 FIX: Added 'await' here
    const result = await makeDonation(project.id, amount, tipAmount);
    
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setDonationAmount('');
      setTip('');
      setTimeout(() => {
        setSuccess(false);
        setShowDonateForm(false);
      }, 3000);
    } else {
      setError(result.error || 'Donation failed.');
    }
  };

  const quickAmounts = [25, 50, 100, 250, 500, 1000];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Back link */}
      <Link
        to="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to Projects
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl overflow-hidden mb-6"
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-64 sm:h-80 object-cover"
            />
          </motion.div>

          {/* Title & meta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold">
                <Icon size={12} />
                {getCategoryLabel(project.category)}
              </span>
              {project.featured && (
                <span className="px-3 py-1 rounded-lg bg-accent/10 text-accent text-xs font-bold">
                  ★ Featured
                </span>
              )}
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary mb-2">
              {project.title}
            </h1>
            <p className="text-sm text-text-muted mb-6">
              by <span className="font-medium text-text-secondary">{project.collectorName}</span> · Created {formatDate(project.createdAt)}
            </p>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-border p-6 mb-6"
          >
            <h2 className="font-semibold text-lg mb-3">About This Project</h2>
            <p className="text-text-secondary leading-relaxed">{project.description}</p>
          </motion.div>

          {/* Transparency section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl border border-border p-6 mb-6"
          >
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Shield size={18} className="text-primary" />
              Transparency & Accountability
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-surface-warm rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-primary">{formatCurrency(project.raisedAmount)}</p>
                <p className="text-xs text-text-muted mt-1">Total Raised</p>
              </div>
              <div className="bg-surface-warm rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-text-primary">{progress}%</p>
                <p className="text-xs text-text-muted mt-1">Goal Progress</p>
              </div>
              <div className="bg-surface-warm rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-text-primary">{project.donors.length}</p>
                <p className="text-xs text-text-muted mt-1">Total Donors</p>
              </div>
            </div>

            {/* Proof of usage placeholder */}
            <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
              <Upload size={24} className="text-text-muted mx-auto mb-2" />
              <p className="text-sm font-medium text-text-secondary">Proof of Usage</p>
              <p className="text-xs text-text-muted mt-1">The collector will upload receipts and proof of fund usage here</p>
            </div>
          </motion.div>

          {/* Donor list */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl border border-border p-6"
          >
            <h2 className="font-semibold text-lg mb-4">Recent Donors</h2>
            {project.donors.length > 0 ? (
              <div className="space-y-3">
                {project.donors.slice().reverse().map((donor) => (
                  <div key={donor.id} className="flex items-center justify-between py-3 border-b border-border-light last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-sm font-semibold text-primary">
                        {donor.donorName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{donor.donorName}</p>
                        <p className="text-xs text-text-muted">{formatDate(donor.createdAt)}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-primary">{formatCurrency(donor.amount)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted text-center py-6">No donations yet. Be the first to contribute!</p>
            )}
          </motion.div>
        </div>

        {/* Sidebar - Donation widget */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="sticky top-24"
          >
            <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
              {/* Progress */}
              <div className="mb-5">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-2xl font-bold text-primary">{formatCurrency(project.raisedAmount)}</span>
                  <span className="text-sm text-text-muted">of {formatCurrency(project.goalAmount)}</span>
                </div>
                <div className="h-3 bg-surface-warm rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.2, delay: 0.5 }}
                  />
                </div>
                <div className="flex justify-between text-xs text-text-muted mt-2">
                  <span>{progress}% funded</span>
                  <span>{project.donors.length} donors</span>
                </div>
              </div>

              {/* Donate button or form */}
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-6"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                      <CheckCircle size={32} className="text-success" />
                    </div>
                    <h3 className="font-semibold text-lg text-text-primary mb-1">Thank You!</h3>
                    <p className="text-sm text-text-muted">Your donation has been recorded successfully.</p>
                  </motion.div>
                ) : !showDonateForm ? (
                  <motion.div key="cta">
                    <button
                      onClick={() => {
                        if (!currentUser) {
                          navigate('/login');
                          return;
                        }
                        setShowDonateForm(true);
                      }}
                      className="w-full py-3.5 bg-gradient-to-r from-primary to-primary-light text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-0.5"
                    >
                      Donate Now
                    </button>
                    <button
                      className="w-full mt-3 py-3 text-sm font-medium text-text-secondary hover:text-primary border border-border rounded-xl hover:border-primary/30 transition-all flex items-center justify-center gap-2"
                    >
                      <Share2 size={16} />
                      Share This Project
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleDonate}
                    className="space-y-4"
                  >
                    {error && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 text-danger text-sm rounded-xl">
                        <AlertCircle size={16} />
                        {error}
                      </div>
                    )}

                    {/* Quick amounts */}
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Select Amount</label>
                      <div className="grid grid-cols-3 gap-2">
                        {quickAmounts.map((qa) => (
                          <button
                            key={qa}
                            type="button"
                            onClick={() => setDonationAmount(qa.toString())}
                            className={`py-2 rounded-lg text-sm font-semibold transition-all ${
                              donationAmount === qa.toString()
                                ? 'bg-primary text-white'
                                : 'bg-surface-warm text-text-secondary hover:bg-primary/10 hover:text-primary'
                            }`}
                          >
                            ${qa}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom amount */}
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">Or enter custom amount</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                        <input
                          type="number"
                          min="1"
                          step="0.01"
                          value={donationAmount}
                          onChange={(e) => setDonationAmount(e.target.value)}
                          placeholder="0.00"
                          className="w-full pl-10 pr-4 py-3 bg-surface-warm border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    {/* Tip */}
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">
                        Platform Tip <span className="text-text-muted font-normal">(optional)</span>
                      </label>
                      <div className="relative">
                        <Heart className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={tip}
                          onChange={(e) => setTip(e.target.value)}
                          placeholder="0.00"
                          className="w-full pl-10 pr-4 py-3 bg-surface-warm border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    {/* Breakdown */}
                    {amount > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-surface-warm rounded-xl p-4 space-y-2"
                      >
                        <div className="flex justify-between text-sm">
                          <span className="text-text-muted">Donation</span>
                          <span className="font-medium">{formatCurrency(amount)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-text-muted">Platform Fee (5%)</span>
                          <span className="font-medium">{formatCurrency(platformFee)}</span>
                        </div>
                        {tipAmount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-text-muted">Tip</span>
                            <span className="font-medium">{formatCurrency(tipAmount)}</span>
                          </div>
                        )}
                        <div className="border-t border-border pt-2 flex justify-between text-sm font-semibold">
                          <span>Total</span>
                          <span className="text-primary">{formatCurrency(totalPayment)}</span>
                        </div>
                      </motion.div>
                    )}

                    <button
                      type="submit"
                      disabled={loading || amount <= 0}
                      className="w-full py-3.5 bg-gradient-to-r from-primary to-primary-light text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                      {loading ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        `Donate ${amount > 0 ? formatCurrency(amount) : ''}`
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => { setShowDonateForm(false); setError(''); }}
                      className="w-full py-2 text-sm text-text-muted hover:text-text-secondary transition-colors"
                    >
                      Cancel
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Trust badge */}
              <div className="mt-5 pt-5 border-t border-border-light flex items-center gap-2 text-xs text-text-muted">
                <Shield size={14} className="text-primary" />
                <span>Verified project · Funds are tracked transparently</span>
              </div>
            </div>

            {/* Time info */}
            <div className="mt-4 flex items-center gap-2 text-xs text-text-muted px-2">
              <Clock size={14} />
              <span>Created {formatDate(project.createdAt)}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
