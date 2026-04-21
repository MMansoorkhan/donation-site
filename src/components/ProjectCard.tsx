// ============================================================
// PROJECT CARD - Reusable card for displaying projects
// ============================================================

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Landmark, Home, Users } from 'lucide-react';
import type { Project } from '../lib/store';
import { formatCurrency, calcProgress, getCategoryLabel } from '../lib/utils';

const categoryIcons = {
  zakaat: Heart,
  umrah: Landmark,
  shelters: Home,
  orphanages: Users,
};

const categoryColors = {
  zakaat: 'bg-emerald-100 text-emerald-700',
  umrah: 'bg-blue-100 text-blue-700',
  shelters: 'bg-amber-100 text-amber-700',
  orphanages: 'bg-rose-100 text-rose-700',
};

interface Props {
  project: Project;
  index?: number;
}

export default function ProjectCard({ project, index = 0 }: Props) {
  const progress = calcProgress(project.raisedAmount, project.goalAmount);
  const Icon = categoryIcons[project.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link
        to={`/project/${project.id}`}
        className="group block bg-white rounded-2xl overflow-hidden border border-border hover:border-primary/30 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1"
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          
          {/* Category badge */}
          <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${categoryColors[project.category]}`}>
            <Icon size={12} />
            {getCategoryLabel(project.category)}
          </div>

          {/* Featured badge */}
          {project.featured && (
            <div className="absolute top-3 right-3 bg-accent text-white px-2.5 py-1 rounded-lg text-xs font-bold">
              ★ Featured
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-semibold text-text-primary mb-1.5 line-clamp-2 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-text-muted mb-4">by {project.collectorName}</p>

          {/* Progress bar */}
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="font-semibold text-primary">{formatCurrency(project.raisedAmount)}</span>
              <span className="text-text-muted">of {formatCurrency(project.goalAmount)}</span>
            </div>
            <div className="h-2 bg-surface-warm rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: 0.3 + index * 0.08 }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>{progress}% funded</span>
            <span>{project.donors.length} donor{project.donors.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
