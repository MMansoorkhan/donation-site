// ============================================================
// LAYOUT - Main app layout with navbar, sidebar, and content area
// ============================================================

import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

// Pages that should NOT show the sidebar
const noSidebarRoutes = ['/login', '/signup', '/dashboard/donor', '/dashboard/collector'];

export default function Layout() {
  const location = useLocation();
  const showSidebar = !noSidebarRoutes.some((r) => location.pathname.startsWith(r));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        {showSidebar && <Sidebar />}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
