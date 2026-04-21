// ============================================================
// ZUSTAND STORE - Central state management for the donation platform
// Simulates Firebase Auth + Firestore with local state
// ============================================================

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

// ----- TYPE DEFINITIONS -----

export type UserRole = 'donor' | 'collector';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  idNumber?: string;
  organization?: string;
  createdAt: string;
}

export type ProjectCategory = 'zakaat' | 'umrah' | 'shelters' | 'orphanages';

export interface Project {
  id: string;
  collectorId: string;
  collectorName: string;
  title: string;
  description: string;
  category: ProjectCategory;
  goalAmount: number;
  raisedAmount: number;
  image: string;
  donors: DonationRecord[];
  featured: boolean;
  createdAt: string;
}

export interface DonationRecord {
  id: string;
  donorId: string;
  donorName: string;
  projectId: string;
  projectTitle: string;
  amount: number;
  platformFee: number;
  tip: number;
  totalPaid: number;
  createdAt: string;
}

// ----- STORE INTERFACE -----

interface AppStore {
  // Auth state
  currentUser: User | null;
  users: User[];
  
  // Data state
  projects: Project[];
  donations: DonationRecord[];
  
  // UI state
  sidebarOpen: boolean;
  searchQuery: string;
  
  // Auth actions
  signup: (userData: Omit<User, 'id' | 'createdAt'>) => { success: boolean; error?: string };
  login: (email: string, password: string, role: UserRole) => { success: boolean; error?: string };
  logout: () => void;
  
  // Project actions
  createProject: (project: Omit<Project, 'id' | 'collectorId' | 'collectorName' | 'raisedAmount' | 'donors' | 'featured' | 'createdAt'>) => { success: boolean; error?: string };
  
  // Donation actions
  makeDonation: (projectId: string, amount: number, tip: number) => { success: boolean; error?: string };
  
  // UI actions
  toggleSidebar: () => void;
  setSearchQuery: (query: string) => void;
}

// ----- SEED DATA -----
// Pre-populated projects so the platform looks alive

const seedProjects: Project[] = [
  {
    id: 'proj-1',
    collectorId: 'collector-1',
    collectorName: 'Islamic Relief Fund',
    title: 'Zakaat Fund for Families in Need',
    description: 'Help us distribute Zakaat to underprivileged families across the region. Every contribution goes directly to those who need it most, providing food, clothing, and essential supplies during difficult times.',
    category: 'zakaat',
    goalAmount: 50000,
    raisedAmount: 32500,
    image: '/images/community.jpg',
    donors: [
      { id: 'd1', donorId: 'donor-1', donorName: 'Ahmed K.', projectId: 'proj-1', projectTitle: 'Zakaat Fund for Families in Need', amount: 500, platformFee: 25, tip: 10, totalPaid: 535, createdAt: '2024-12-01' },
      { id: 'd2', donorId: 'donor-2', donorName: 'Sara M.', projectId: 'proj-1', projectTitle: 'Zakaat Fund for Families in Need', amount: 1000, platformFee: 50, tip: 20, totalPaid: 1070, createdAt: '2024-12-05' },
    ],
    featured: true,
    createdAt: '2024-11-15',
  },
  {
    id: 'proj-2',
    collectorId: 'collector-2',
    collectorName: 'Umrah Assistance Foundation',
    title: 'Sponsor Umrah for Elderly Pilgrims',
    description: 'Many elderly Muslims dream of performing Umrah but cannot afford it. This project sponsors their journey, covering travel, accommodation, and all necessary arrangements for a blessed pilgrimage.',
    category: 'umrah',
    goalAmount: 75000,
    raisedAmount: 48750,
    image: '/images/mosque.jpg',
    donors: [
      { id: 'd3', donorId: 'donor-3', donorName: 'Omar H.', projectId: 'proj-2', projectTitle: 'Sponsor Umrah for Elderly Pilgrims', amount: 2000, platformFee: 100, tip: 50, totalPaid: 2150, createdAt: '2024-12-10' },
    ],
    featured: true,
    createdAt: '2024-11-20',
  },
  {
    id: 'proj-3',
    collectorId: 'collector-1',
    collectorName: 'Islamic Relief Fund',
    title: 'Build a Shelter for Displaced Families',
    description: 'Thousands of families have been displaced and need safe shelter. Help us build temporary and permanent housing solutions that provide dignity and protection from the elements.',
    category: 'shelters',
    goalAmount: 120000,
    raisedAmount: 67200,
    image: '/images/shelter.jpg',
    donors: [
      { id: 'd4', donorId: 'donor-1', donorName: 'Ahmed K.', projectId: 'proj-3', projectTitle: 'Build a Shelter for Displaced Families', amount: 5000, platformFee: 250, tip: 100, totalPaid: 5350, createdAt: '2024-12-08' },
    ],
    featured: true,
    createdAt: '2024-11-25',
  },
  {
    id: 'proj-4',
    collectorId: 'collector-3',
    collectorName: 'Bright Futures Org',
    title: 'Support Our Orphanage — Education & Care',
    description: 'Our orphanage cares for 120 children, providing education, meals, healthcare, and a loving environment. Your donations help us keep the lights on and give these children a brighter future.',
    category: 'orphanages',
    goalAmount: 40000,
    raisedAmount: 28000,
    image: '/images/orphanage.jpg',
    donors: [
      { id: 'd5', donorId: 'donor-2', donorName: 'Sara M.', projectId: 'proj-4', projectTitle: 'Support Our Orphanage — Education & Care', amount: 300, platformFee: 15, tip: 5, totalPaid: 320, createdAt: '2024-12-12' },
    ],
    featured: false,
    createdAt: '2024-12-01',
  },
  {
    id: 'proj-5',
    collectorId: 'collector-2',
    collectorName: 'Umrah Assistance Foundation',
    title: 'Clean Water Wells for Rural Communities',
    description: 'Access to clean water is a basic human right. This project funds the construction of water wells in rural areas where families walk miles daily for contaminated water.',
    category: 'zakaat',
    goalAmount: 30000,
    raisedAmount: 12600,
    image: '/images/water-project.jpg',
    donors: [],
    featured: false,
    createdAt: '2024-12-05',
  },
];

const seedDonations: DonationRecord[] = [
  { id: 'd1', donorId: 'donor-1', donorName: 'Ahmed K.', projectId: 'proj-1', projectTitle: 'Zakaat Fund for Families in Need', amount: 500, platformFee: 25, tip: 10, totalPaid: 535, createdAt: '2024-12-01' },
  { id: 'd2', donorId: 'donor-2', donorName: 'Sara M.', projectId: 'proj-1', projectTitle: 'Zakaat Fund for Families in Need', amount: 1000, platformFee: 50, tip: 20, totalPaid: 1070, createdAt: '2024-12-05' },
  { id: 'd3', donorId: 'donor-3', donorName: 'Omar H.', projectId: 'proj-2', projectTitle: 'Sponsor Umrah for Elderly Pilgrims', amount: 2000, platformFee: 100, tip: 50, totalPaid: 2150, createdAt: '2024-12-10' },
  { id: 'd4', donorId: 'donor-1', donorName: 'Ahmed K.', projectId: 'proj-3', projectTitle: 'Build a Shelter for Displaced Families', amount: 5000, platformFee: 250, tip: 100, totalPaid: 5350, createdAt: '2024-12-08' },
  { id: 'd5', donorId: 'donor-2', donorName: 'Sara M.', projectId: 'proj-4', projectTitle: 'Support Our Orphanage — Education & Care', amount: 300, platformFee: 15, tip: 5, totalPaid: 320, createdAt: '2024-12-12' },
];

// Simple password store (simulating auth — NOT for production)
const passwords: Record<string, string> = {
  'ahmed@example.com': 'password123',
  'sara@example.com': 'password123',
  'omar@example.com': 'password123',
};

const seedUsers: User[] = [
  { id: 'donor-1', name: 'Ahmed K.', email: 'ahmed@example.com', role: 'donor', createdAt: '2024-10-01' },
  { id: 'donor-2', name: 'Sara M.', email: 'sara@example.com', role: 'donor', createdAt: '2024-10-15' },
  { id: 'donor-3', name: 'Omar H.', email: 'omar@example.com', role: 'donor', createdAt: '2024-11-01' },
];

// ----- STORE CREATION -----

export const useStore = create<AppStore>((set, get) => ({
  // Initial state
  currentUser: null,
  users: seedUsers,
  projects: seedProjects,
  donations: seedDonations,
  sidebarOpen: false,
  searchQuery: '',

  // Sign up a new user
  signup: (userData) => {
    const { users } = get();
    
    // Check if email already exists
    if (users.find(u => u.email === userData.email)) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    
    const newUser: User = {
      ...userData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    
    // Store password (simulation only)
    passwords[userData.email] = 'password123';
    
    set(state => ({
      users: [...state.users, newUser],
      currentUser: newUser,
    }));
    
    return { success: true };
  },

  // Log in an existing user
  login: (email, _password, role) => {
    const { users } = get();
    const user = users.find(u => u.email === email && u.role === role);
    
    if (!user) {
      return { success: false, error: 'No account found with these credentials.' };
    }
    
    set({ currentUser: user });
    return { success: true };
  },

  // Log out
  logout: () => {
    set({ currentUser: null });
  },

  // Create a new project (collector only)
  createProject: (projectData) => {
    const { currentUser, projects } = get();
    
    if (!currentUser || currentUser.role !== 'collector') {
      return { success: false, error: 'Only collectors can create projects.' };
    }
    
    // Check 3-project limit
    const userProjects = projects.filter(p => p.collectorId === currentUser.id);
    if (userProjects.length >= 3) {
      return { success: false, error: 'You have reached the maximum of 3 projects. Please manage existing projects before creating new ones.' };
    }
    
    const newProject: Project = {
      ...projectData,
      id: uuidv4(),
      collectorId: currentUser.id,
      collectorName: currentUser.name,
      raisedAmount: 0,
      donors: [],
      featured: false,
      createdAt: new Date().toISOString(),
    };
    
    set(state => ({
      projects: [...state.projects, newProject],
    }));
    
    return { success: true };
  },

  // Make a donation to a project
  makeDonation: (projectId, amount, tip) => {
    const { currentUser, projects } = get();
    
    if (!currentUser) {
      return { success: false, error: 'Please log in to make a donation.' };
    }
    
    const project = projects.find(p => p.id === projectId);
    if (!project) {
      return { success: false, error: 'Project not found.' };
    }
    
    const platformFee = amount * 0.05; // 5% platform fee
    const totalPaid = amount + platformFee + tip;
    
    const donation: DonationRecord = {
      id: uuidv4(),
      donorId: currentUser.id,
      donorName: currentUser.name,
      projectId,
      projectTitle: project.title,
      amount,
      platformFee,
      tip,
      totalPaid,
      createdAt: new Date().toISOString(),
    };
    
    set(state => ({
      donations: [...state.donations, donation],
      projects: state.projects.map(p =>
        p.id === projectId
          ? {
              ...p,
              raisedAmount: p.raisedAmount + amount,
              donors: [...p.donors, donation],
            }
          : p
      ),
    }));
    
    return { success: true };
  },

  // Toggle sidebar
  toggleSidebar: () => {
    set(state => ({ sidebarOpen: !state.sidebarOpen }));
  },

  // Update search query
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },
}));
