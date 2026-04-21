// ============================================================
// HOME PAGE - Hero, featured projects, categories, premium section
// ============================================================

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Eye, TrendingUp, Heart, Landmark, Home, Users, Star } from 'lucide-react';
import { useStore } from '../lib/store';
import ProjectCard from '../components/ProjectCard';
import { formatCurrency } from '../lib/utils';

// Animation variants for staggered reveals
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

export default function HomePage() {
  const { projects } = useStore();
  const featuredProjects = projects.filter((p) => p.featured);

  // Compute platform stats
  const totalRaised = projects.reduce((sum, p) => sum + p.raisedAmount, 0);
  const totalDonors = new Set(projects.flatMap((p) => p.donors.map((d) => d.donorId))).size;
  const totalProjects = projects.length;

  const categories = [
    { key: 'zakaat', label: 'Zakaat Donations', icon: Heart, color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50', desc: 'Fulfill your obligation and purify your wealth' },
    { key: 'umrah', label: 'Umrah Donations', icon: Landmark, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', desc: 'Help others perform the sacred pilgrimage' },
    { key: 'shelters', label: 'Shelters', icon: Home, color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50', desc: 'Provide safe housing for displaced families' },
    { key: 'orphanages', label: 'Orphanages', icon: Users, color: 'from-rose-500 to-rose-600', bg: 'bg-rose-50', desc: 'Support and nurture children in need' },
  ];

  return (
    <div className="min-h-screen">
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary-light to-primary min-h-[540px] flex items-center">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white rounded-full translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white/90 px-4 py-1.5 rounded-full text-sm font-medium mb-6"
            >
              <Star size={14} fill="currentColor" />
              Trusted by thousands of donors worldwide
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6"
            >
              Give with{' '}
              <span className="text-accent-light">Purpose</span>,{' '}
              <br className="hidden sm:block" />
              Change Lives
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-white/80 mb-8 max-w-lg leading-relaxed"
            >
              A transparent platform connecting generous hearts with verified causes.
              Every donation is tracked, every impact is visible.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-primary font-semibold rounded-xl hover:shadow-xl hover:shadow-black/10 transition-all hover:-translate-y-0.5"
              >
                Donate Now
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/signup?role=collector"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/15 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/25 hover:bg-white/25 transition-all"
              >
                Start a Project
              </Link>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-3 gap-4 mt-12 max-w-lg"
          >
            {[
              { value: formatCurrency(totalRaised), label: 'Total Raised' },
              { value: totalDonors.toString(), label: 'Active Donors' },
              { value: totalProjects.toString(), label: 'Projects' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-xs sm:text-sm text-white/60 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== TRUST INDICATORS ===== */}
      <section className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Verified Projects', desc: 'Every collector is verified before they can create projects' },
              { icon: Eye, title: 'Full Transparency', desc: 'Track every dollar from donation to impact' },
              { icon: TrendingUp, title: '95% to Causes', desc: 'Only 5% platform fee — the rest goes directly to projects' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex items-start gap-4 p-4"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="text-primary" size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary mb-1">{item.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-3xl font-bold text-text-primary mb-3">Browse by Category</h2>
          <p className="text-text-muted max-w-md mx-auto">Choose a cause close to your heart and make a difference today</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.key}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Link
                  to={`/projects?category=${cat.key}`}
                  className={`block p-6 rounded-2xl ${cat.bg} border border-transparent hover:border-primary/20 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="text-white" size={22} />
                  </div>
                  <h3 className="font-semibold text-text-primary mb-1">{cat.label}</h3>
                  <p className="text-sm text-text-muted">{cat.desc}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ===== FEATURED PROJECTS ===== */}
      <section className="bg-white border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-10"
          >
            <div>
              <h2 className="font-display text-3xl font-bold text-text-primary mb-2">Featured Projects</h2>
              <p className="text-text-muted">Hand-picked causes that need your support right now</p>
            </div>
            <Link
              to="/projects"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
            >
              View All <ArrowRight size={16} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>

          <div className="sm:hidden mt-6 text-center">
            <Link
              to="/projects"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
            >
              View All Projects <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== PREMIUM MEMBERS / HOW IT WORKS ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl font-bold text-text-primary mb-3">How SadaqahHub Works</h2>
          <p className="text-text-muted max-w-md mx-auto">Simple, transparent, and impactful — in just three steps</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Choose a Cause', desc: 'Browse verified projects across multiple categories and find a cause that resonates with you.', color: 'from-primary to-primary-light' },
            { step: '02', title: 'Make a Donation', desc: 'Contribute any amount. 95% goes directly to the project, with full transparency on fees.', color: 'from-secondary to-secondary-light' },
            { step: '03', title: 'See the Impact', desc: 'Track your donation, see progress updates, and know exactly where your money went.', color: 'from-accent to-accent-light' },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative bg-white rounded-2xl p-8 border border-border hover:shadow-lg transition-all duration-300 text-center group"
            >
              <div className={`inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <span className="text-white font-bold text-lg">{item.step}</span>
              </div>
              <h3 className="font-semibold text-lg text-text-primary mb-2">{item.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary-light rounded-3xl p-10 md:p-16 text-center"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white rounded-full translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-accent rounded-full -translate-x-1/3 translate-y-1/3" />
          </div>
          <div className="relative">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-white/80 max-w-lg mx-auto mb-8">
              Whether you want to donate or collect, SadaqahHub makes it easy, transparent, and rewarding.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/signup"
                className="px-8 py-3.5 bg-white text-primary font-semibold rounded-xl hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                Join as Donor
              </Link>
              <Link
                to="/signup?role=collector"
                className="px-8 py-3.5 bg-white/15 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/25 hover:bg-white/25 transition-all"
              >
                Join as Collector
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
