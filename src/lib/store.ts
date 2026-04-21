// ============================================================
// ZUSTAND STORE - Central state management for the donation platform
// Connected to Real Firebase Auth + Firestore
// ============================================================

import { create } from 'zustand';
import { auth, db } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  onSnapshot 
} from 'firebase/firestore';

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
  
  // Database Init
  initDatabase: () => void;
  
  // Auth actions (Notice the added password string to signup)
  signup: (userData: Omit<User, 'id' | 'createdAt'> & { password?: string }) => Promise<{ success: boolean; error?: string }>;
  login: (email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  
  // Project actions
  createProject: (project: Omit<Project, 'id' | 'collectorId' | 'collectorName' | 'raisedAmount' | 'donors' | 'featured' | 'createdAt'>) => Promise<{ success: boolean; error?: string }>;
  
  // Donation actions
  makeDonation: (projectId: string, amount: number, tip: number) => Promise<{ success: boolean; error?: string }>;
  
  // UI actions
  toggleSidebar: () => void;
  setSearchQuery: (query: string) => void;
}

// ----- SEED DATA -----
// We keep the seed data so the UI doesn't look empty before real data is added.

const seedProjects: Project[] = [
  {
    id: 'proj-1',
    collectorId: 'collector-1',
    collectorName: 'Islamic Relief Fund',
    title: 'Zakaat Fund for Families in Need',
    description: 'Help us distribute Zakaat to underprivileged families across the region.',
    category: 'zakaat',
    goalAmount: 50000,
    raisedAmount: 32500,
    image: '/images/community.jpg',
    donors: [],
    featured: true,
    createdAt: '2024-11-15',
  }
];

// ----- STORE CREATION -----

export const useStore = create<AppStore>((set, get) => ({
  // Initial state
  currentUser: null,
  users: [],
  projects: seedProjects, // Starts with seed data until Firebase loads
  donations: [],
  sidebarOpen: false,
  searchQuery: '',

  // ==========================================
  // 1. DATABASE & AUTH INITIALIZATION
  // ==========================================
  initDatabase: () => {
    // A. Listen for Auth Changes (Keeps user logged in on refresh)
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          set({ currentUser: userDoc.data() as User });
        }
      } else {
        set({ currentUser: null });
      }
    });

    // B. Listen for real-time Project updates
    onSnapshot(collection(db, 'projects'), (snapshot) => {
      const liveProjects = snapshot.docs.map(doc => doc.data() as Project);
      // If database has projects, show them. Otherwise fallback to seed data.
      set({ projects: liveProjects.length > 0 ? liveProjects : seedProjects });
    });

    // C. Listen for real-time Donation updates
    onSnapshot(collection(db, 'donations'), (snapshot) => {
      const liveDonations = snapshot.docs.map(doc => doc.data() as DonationRecord);
      set({ donations: liveDonations });
    });
  },

  // ==========================================
  // 2. AUTHENTICATION
  // ==========================================
  signup: async (userData) => {
    try {
      const password = userData.password || 'password123'; // Fallback if UI doesn't pass it yet
      
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, password);
      const firebaseUser = userCredential.user;

      const newUser: User = {
        id: firebaseUser.uid,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        phone: userData.phone || '',
        organization: userData.organization || '',
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
      
      set({ currentUser: newUser });
      return { success: true };
    } catch (error: any) {
      console.error("Signup Error:", error);
      return { success: false, error: error.message };
    }
  },

  login: async (email, password, role) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        
        if (userData.role !== role) {
          await signOut(auth);
          return { success: false, error: `This email is registered as a ${userData.role}.` };
        }

        set({ currentUser: userData });
        return { success: true };
      }
      return { success: false, error: 'User profile data not found.' };
    } catch (error: any) {
      console.error("Login Error:", error);
      return { success: false, error: 'Invalid email or password.' };
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      set({ currentUser: null });
    } catch (error) {
      console.error("Logout Error:", error);
    }
  },

  // ==========================================
  // 3. CLOUD DATA ACTIONS
  // ==========================================
  createProject: async (projectData) => {
    const { currentUser, projects } = get();
    
    if (!currentUser || currentUser.role !== 'collector') {
      return { success: false, error: 'Only collectors can create projects.' };
    }
    
    const userProjects = projects.filter(p => p.collectorId === currentUser.id);
    if (userProjects.length >= 3) {
      return { success: false, error: 'You have reached the maximum of 3 projects.' };
    }
    
    try {
      const newProjectRef = doc(collection(db, 'projects'));
      
      const newProject: Project = {
        ...projectData,
        id: newProjectRef.id,
        collectorId: currentUser.id,
        collectorName: currentUser.name,
        raisedAmount: 0,
        donors: [],
        featured: false,
        createdAt: new Date().toISOString(),
      };
      
      await setDoc(newProjectRef, newProject);
      return { success: true };
    } catch (error: any) {
      console.error("Project Creation Error:", error);
      return { success: false, error: 'Failed to create project.' };
    }
  },

  makeDonation: async (projectId, amount, tip) => {
    const { currentUser, projects } = get();
    
    if (!currentUser) return { success: false, error: 'Please log in to make a donation.' };
    
    const project = projects.find(p => p.id === projectId);
    if (!project) return { success: false, error: 'Project not found.' };
    
    try {
      const platformFee = amount * 0.05;
      const totalPaid = amount + platformFee + tip;
      
      const newDonationRef = doc(collection(db, 'donations'));
      
      const donation: DonationRecord = {
        id: newDonationRef.id,
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
      
      await setDoc(newDonationRef, donation);
      
      const projectRef = doc(db, 'projects', projectId);
      await updateDoc(projectRef, {
        raisedAmount: project.raisedAmount + amount,
        donors: [...project.donors, donation]
      });
      
      return { success: true };
    } catch (error: any) {
      console.error("Donation Error:", error);
      return { success: false, error: 'Donation failed to process.' };
    }
  },

  // ==========================================
  // 4. UI ACTIONS
  // ==========================================
  toggleSidebar: () => {
    set(state => ({ sidebarOpen: !state.sidebarOpen }));
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },
}));
