// ============================================================
// UTILITY FUNCTIONS
// ============================================================

import type { ProjectCategory } from './store';

/**
 * Format a number as currency (USD)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculate the progress percentage (capped at 100%)
 */
export function calcProgress(raised: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min(Math.round((raised / goal) * 100), 100);
}

/**
 * Get a human-readable category label
 */
export function getCategoryLabel(category: ProjectCategory): string {
  const labels: Record<ProjectCategory, string> = {
    zakaat: 'Zakaat Donations',
    umrah: 'Umrah Donations',
    shelters: 'Shelters',
    orphanages: 'Orphanages',
  };
  return labels[category];
}

/**
 * Get the icon name (lucide) for a category
 */
export function getCategoryIcon(category: ProjectCategory): string {
  const icons: Record<ProjectCategory, string> = {
    zakaat: 'Heart',
    umrah: 'Landmark',
    shelters: 'Home',
    orphanages: 'Users',
  };
  return icons[category];
}

/**
 * Format a date string to a readable format
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Truncate text to a maximum length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}
