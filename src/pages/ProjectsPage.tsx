// ============================================================
// PROJECTS PAGE - Browse all projects with filters
// ============================================================

import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Heart, Landmark, Home, Users } from 'lucide-react';
import { useStore, type ProjectCategory } from '../lib/store';
import ProjectCard from '../components/ProjectCard';
import { getCategoryLabel } from '../lib/utils';

const categoryFilters: { key: ProjectCategory | 'all'; label: string; icon: React.ElementType }[] = [
  { key: 'all', label: 'All Projects', icon: Filter },
  { key: 'zakaat', label: 'Zakaat', icon: Heart },
  { key: 'umrah', label: 'Umrah', icon: Landmark },
  { key: 'shelters', label: 'Shelters', icon: Home },
  { key: 'orphanages', label: 'Orphanages', icon: Users },
];

export default function ProjectsPage() {
  const { projects, searchQuery, setSearchQuery } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = (searchParams.get('category') as ProjectCategory | null) || 'all';
  const isFeatured = searchParams.get('featured') === 'true';
  const urlSearch = searchParams.get('search') || '';

  // Combined search from URL and store
  const effectiveSearch = urlSearch || searchQuery;

  // Filter projects
  const filtered = useMemo(() => {
    let result = [...projects];

    // Category filter
    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Featured filter
    if (isFeatured) {
      result = result.filter((p) => p.featured);
    }

    // Search filter
    if (effectiveSearch) {
      const q = effectiveSearch.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.collectorName.toLowerCase().includes(q) ||
          getCategoryLabel(p.category).toLowerCase().includes(q)
      );
    }

    return result;
  }, [projects, activeCategory, isFeatured, effectiveSearch]);

  const handleCategoryChange = (cat: string) => {
    const params = new URLSearchParams(searchParams);
    if (cat === 'all') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    params.delete('featured');
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-3xl font-bold text-text-primary mb-2">
          {isFeatured ? 'Featured Projects' : activeCategory !== 'all' ? getCategoryLabel(activeCategory as ProjectCategory) : 'All Projects'}
        </h1>
        <p className="text-text-muted">
          {filtered.length} project{filtered.length !== 1 ? 's' : ''} found
        </p>
      </motion.div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input
            type="text"
            placeholder="Search projects..."
            value={effectiveSearch}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {categoryFilters.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.key || (cat.key === 'all' && activeCategory === 'all');
            return (
              <button
                key={cat.key}
                onClick={() => handleCategoryChange(cat.key)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white text-text-secondary border border-border hover:border-primary/30 hover:text-primary'
                }`}
              >
                <Icon size={14} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Project Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="w-16 h-16 rounded-full bg-surface-warm flex items-center justify-center mx-auto mb-4">
            <Search size={24} className="text-text-muted" />
          </div>
          <h3 className="font-semibold text-lg text-text-primary mb-2">No projects found</h3>
          <p className="text-sm text-text-muted">Try adjusting your search or filters</p>
        </motion.div>
      )}
    </div>
  );
}
