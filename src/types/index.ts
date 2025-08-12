export interface User {
  id: string;
  username: string;
  role: 'admin' | 'librarian' | 'user';
  email: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  section: string;
  totalCopies: number;
  availableCopies: number;
  borrowCount: number;
  lastBorrowed?: Date;
  addedDate: Date;
}

export interface BookDistribution {
  section: string;
  totalBooks: number;
  borrowedBooks: number;
  availableBooks: number;
  utilizationRate: number;
  popularityScore: number;
}

export interface OptimizationSuggestion {
  id: string;
  type: 'reallocation' | 'acquisition' | 'removal' | 'relocation';
  priority: 'high' | 'medium' | 'low';
  section: string;
  title: string;
  description: string;
  expectedImprovement: string;
  estimatedCost: number;
  implementationDifficulty: 'easy' | 'medium' | 'hard';
}

export interface DashboardStats {
  totalBooks: number;
  totalSections: number;
  averageUtilization: number;
  totalBorrowings: number;
  topSection: string;
  lowSection: string;
}