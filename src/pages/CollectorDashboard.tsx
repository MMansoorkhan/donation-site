// ============================================================
// COLLECTOR DASHBOARD - Manage projects, see donations
// ============================================================

import { useState } from 'react';
import { useStore } from '../lib/store';

export default function CollectorDashboard() {
  const { createProject } = useStore();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    // Add logic here as needed
    const result = await createProject({ title: "New Project", description: "Desc", category: "zakaat", goalAmount: 1000, image: "" });
    setLoading(false);
  };

  return <div className="p-8"><h1>Collector Dashboard</h1><button onClick={handleCreate}>Create Project</button></div>;
}
