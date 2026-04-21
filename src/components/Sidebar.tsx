// ============================================================
// SIDEBAR - Category navigation + quick links
// ============================================================

import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Landmark, Home, Users, TrendingUp, Star, X } from 'lucide-react';
import { useStore } from '../lib/store';

const categories = [
  { key: 'zakaat', label: 'Zakaat Donations', icon: Heart, color: 'text-emerald-600' },
  { key: 'umrah', label: 'Umrah Donations', icon: Landmark, color: 'text-blue-600' },
  { key: 'shelters', label: 'Shelters', icon: Home, color: 'text-amber-600' },
  { key: 'orphanages', label: 'Orphanages', icon: Users, color: 'text-rose-600' },
];

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useStore();
  const location = useLocation();

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header (mobile only) */}
      <div className="flex items-center justify-between p-4 border-b border-border lg:hidden">
        <span className="font-display font-bold text-lg">Menu</span>
        <button onClick={toggleSidebar} className="p-1 rounded-lg hover:bg-surface-warm">
          <X size={20} />
        </button>
      </div>

      {/* Categories */}
      <div className="p-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Categories</h3>
        <div className="space-y-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = location.search.includes(`category=${cat.key}`);
            return (
              <Link
                key={cat.key}
                to={`/projects?category=${cat.key}`}
                onClick={() => sidebarOpen && toggleSidebar()}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-secondary hover:bg-surface-warm hover:text-text-primary'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-primary' : cat.color} />
                {cat.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Links */}
      <div className="p-4 border-t border-border-light">
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Quick Links</h3>
        <div className="space-y-1">
          <Link
            to="/projects"
            onClick={() => sidebarOpen && toggleSidebar()}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:bg-surface-warm hover:text-text-primary transition-all"
          >
            <TrendingUp size={18} className="text-text-muted" />
            All Projects
          </Link>
          <Link
            to="/projects?featured=true"
            onClick={() => sidebarOpen && toggleSidebar()}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:bg-surface-warm hover:text-text-primary transition-all"
          >
            <Star size={18} className="text-text-muted" />
            Featured
          </Link>
        </div>
      </div>

      {/* CTA Card */}
      <div className="mt-auto p-4">
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-4">
          <p className="text-sm font-semibold text-text-primary mb-1">Want to collect donations?</p>
          <p className="text-xs text-text-secondary mb-3">Create a collector account and start your first project today.</p>
          <Link
            to="/signup?role=collector"
            onClick={() => sidebarOpen && toggleSidebar()}
            className="inline-block text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            Get Started →
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white border-r border-border h-[calc(100vh-64px)] sticky top-16 overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 shadow-2xl lg:hidden overflow-y-auto"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
