import { create } from 'zustand';
import { User, LeaveRequest } from './types';

interface AppState {
  user: User | null;
  requests: LeaveRequest[];
  setUser: (user: User | null) => void;
  addRequest: (request: LeaveRequest) => void;
  updateRequest: (id: string, updates: Partial<LeaveRequest>) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  requests: [],
  setUser: (user) => set({ user }),
  addRequest: (request) =>
    set((state) => ({ requests: [...state.requests, request] })),
  updateRequest: (id, updates) =>
    set((state) => ({
      requests: state.requests.map((req) =>
        req.id === id ? { ...req, ...updates } : req
      ),
    })),
}));