// ============================================================
// COLLECTOR DASHBOARD - Manage projects, see donations
// ============================================================

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, FolderOpen, DollarSign, Users, ExternalLink, AlertCircle,
  X, ImageIcon, CheckCircle, TrendingUp
} from 'lucide-react';
import { useStore, type ProjectCategory } from '../lib/store';
import { formatCurrency, calcProgress, getCategoryLabel, formatDate } from '../lib/utils';

const projectImages = [
  '/images/community.jpg',
  '/images/mosque.jpg',
  '/images/shelter.jpg',
  '/images/orphanage.jpg',
  '/images/water-project.jpg',
];

export default function CollectorDashboard() {
  const { currentUser, projects, createProject } = useStore();
  const navigate = useNavigate();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('zakaat');
  const [selectedImage, setSelectedImage] = useState(projectImages[0]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else if (currentUser.role !== 'collector') {
      navigate('/dashboard/donor');
    }
  }, [currentUser, navigate]);

  if (!currentUser || currentUser.role !== 'collector') return null;

  const myProjects = projects.filter((p) => p.collectorId === currentUser.id);
  const totalRaised = myProjects.reduce((sum, p) => sum + p.raisedAmount, 0);
  const totalDonors = myProjects.reduce((sum, p) => sum + p.donors.length, 0);
  const canCreateMore = myProjects.length < 3;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise((r) => setTimeout(r, 800));

    const result = createProject({
      title,
      description,
      goalAmount: parseFloat(goalAmount) || 0,
      category,
      image: selectedImage,
    });

    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTitle('');
      setDescription('');
      setGoalAmount('');
      setTimeout(() => {
        setSuccess(false);
        setShowCreateForm(false);
      }, 2000);
    } else {
      setError(result.error || 'Failed to create project.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="font-display text-3xl font-bold text-text-primary mb-1">Collector Dashboard</h1>
          <p className="text-text-muted">Manage your projects and track donations, {currentUser.name}.</p>
        </div>
        <button
          onClick={() => {
            if (canCreateMore) {
              setShowCreateForm(true);
            }
          }}
          disabled={!canCreateMore}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-primary-light text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 shrink-0"
        >
          <Plus size={18} />
          New Project
        </button>
      </motion.div>

      {/* Limit warning */}
      {!canCreateMore && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-4 bg-amber-50 text-amber-800 rounded-xl mb-6"
        >
          <AlertCircle size={18} />
          <p className="text-sm">You've reached the maximum of 3 projects. Please manage existing projects before creating new ones.</p>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Raised', value: formatCurrency(totalRaised), icon: DollarSign, color: 'bg-primary/10 text-primary' },
          { label: 'Active Projects', value: `${myProjects.length}/3`, icon: FolderOpen, color: 'bg-blue-100 text-blue-600' },
          { label: 'Total Donors', value: totalDonors.toString(), icon: Users, color: 'bg-rose-100 text-rose-600' },
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

      {/* Projects list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-border overflow-hidden"
      >
        <div className="p-6 border-b border-border">
          <h2 className="font-semibold text-lg">Your Projects</h2>
        </div>

        {myProjects.length > 0 ? (
          <div className="divide-y divide-border-light">
            {myProjects.map((project) => {
              const progress = calcProgress(project.raisedAmount, project.goalAmount);
              return (
                <div key={project.id} className="p-5 hover:bg-surface transition-colors">
                  <div className="flex items-start gap-4">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-20 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link
                            to={`/project/${project.id}`}
                            className="text-sm font-semibold text-text-primary hover:text-primary transition-colors flex items-center gap-1"
                          >
                            {project.title}
                            <ExternalLink size={12} />
                          </Link>
                          <p className="text-xs text-text-muted mt-0.5">
                            {getCategoryLabel(project.category)} · Created {formatDate(project.createdAt)}
                          </p>
                        </div>
                        <span className="text-sm font-bold text-primary shrink-0">{formatCurrency(project.raisedAmount)}</span>
                      </div>

                      {/* Mini progress bar */}
                      <div className="mt-3">
                        <div className="h-1.5 bg-surface-warm rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-text-muted mt-1">
                          <span>{progress}% of {formatCurrency(project.goalAmount)}</span>
                          <span>{project.donors.length} donors</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-surface-warm flex items-center justify-center mx-auto mb-4">
              <FolderOpen size={24} className="text-text-muted" />
            </div>
            <h3 className="font-semibold text-text-primary mb-2">No projects yet</h3>
            <p className="text-sm text-text-muted mb-4">Create your first project and start collecting donations.</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark"
            >
              <Plus size={14} /> Create Project
            </button>
          </div>
        )}
      </motion.div>

      {/* Create Project Modal */}
      <AnimatePresence>
        {showCreateForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateForm(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg bg-white rounded-2xl shadow-2xl z-50 overflow-y-auto max-h-[90vh]"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl font-bold">Create New Project</h2>
                  <button onClick={() => setShowCreateForm(false)} className="p-1 rounded-lg hover:bg-surface-warm">
                    <X size={20} />
                  </button>
                </div>

                {success ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                      <CheckCircle size={32} className="text-success" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">Project Created!</h3>
                    <p className="text-sm text-text-muted">Your project is now live and accepting donations.</p>
                  </div>
                ) : (
                  <form onSubmit={handleCreate} className="space-y-4">
                    {error && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 text-danger text-sm rounded-xl">
                        <AlertCircle size={16} />
                        {error}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">Project Title</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="Give your project a compelling title"
                        className="w-full px-4 py-3 bg-surface-warm border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">Description</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows={3}
                        placeholder="Describe your project and how the funds will be used"
                        className="w-full px-4 py-3 bg-surface-warm border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">Goal Amount ($)</label>
                        <input
                          type="number"
                          min="100"
                          value={goalAmount}
                          onChange={(e) => setGoalAmount(e.target.value)}
                          required
                          placeholder="10000"
                          className="w-full px-4 py-3 bg-surface-warm border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">Category</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                          className="w-full px-4 py-3 bg-surface-warm border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        >
                          <option value="zakaat">Zakaat Donations</option>
                          <option value="umrah">Umrah Donations</option>
                          <option value="shelters">Shelters</option>
                          <option value="orphanages">Orphanages</option>
                        </select>
                      </div>
                    </div>

                    {/* Image selection */}
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Project Image</label>
                      <div className="grid grid-cols-5 gap-2">
                        {projectImages.map((img) => (
                          <button
                            key={img}
                            type="button"
                            onClick={() => setSelectedImage(img)}
                            className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                              selectedImage === img ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-border'
                            }`}
                          >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                            {selectedImage === img && (
                              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                <CheckCircle size={16} className="text-white" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-gradient-to-r from-primary to-primary-light text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Creating...
                        </span>
                      ) : (
                        'Create Project'
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
