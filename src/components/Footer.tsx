// ============================================================
// FOOTER - Site-wide footer
// ============================================================

import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                <Heart className="text-white" size={18} fill="white" />
              </div>
              <span className="font-display font-bold text-xl">
                Veri<span className="text-primary">Kind</span>
              </span>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              Connecting generous hearts with meaningful causes. Transparent, trustworthy, and impactful giving.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Platform</h4>
            <div className="space-y-2">
              <Link to="/projects" className="block text-sm text-text-muted hover:text-primary transition-colors">Browse Projects</Link>
              <Link to="/signup?role=collector" className="block text-sm text-text-muted hover:text-primary transition-colors">Start a Project</Link>
              <Link to="/signup" className="block text-sm text-text-muted hover:text-primary transition-colors">Become a Donor</Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Categories</h4>
            <div className="space-y-2">
              <Link to="/projects?category=zakaat" className="block text-sm text-text-muted hover:text-primary transition-colors">Zakaat Donations</Link>
              <Link to="/projects?category=umrah" className="block text-sm text-text-muted hover:text-primary transition-colors">Umrah Donations</Link>
              <Link to="/projects?category=shelters" className="block text-sm text-text-muted hover:text-primary transition-colors">Shelters</Link>
              <Link to="/projects?category=orphanages" className="block text-sm text-text-muted hover:text-primary transition-colors">Orphanages</Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Support</h4>
            <div className="space-y-2">
              <span className="block text-sm text-text-muted">help@verikind.com</span>
              <span className="block text-sm text-text-muted">Terms of Service</span>
              <span className="block text-sm text-text-muted">Privacy Policy</span>
            </div>
          </div>
        </div>

        <div className="border-t border-border-light mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">© {new Date().getFullYear()} VeriKind. All rights reserved.</p>
          <p className="text-xs text-text-muted">Built with ❤️ for the Ummah</p>
        </div>
      </div>
    </footer>
  );
}
