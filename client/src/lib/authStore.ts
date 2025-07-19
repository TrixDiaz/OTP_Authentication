import { create } from 'zustand';

export type AuthFlowType = 'login' | 'register';

interface AuthState {
    email: string;
    flowType: AuthFlowType | null;
    setEmail: (email: string) => void;
    setFlowType: (flowType: AuthFlowType | null) => void;
    clearEmail: () => void;
    clearFlowType: () => void;
    clearAll: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    email: '',
    flowType: null,
    setEmail: (email: string) => set({ email }),
    setFlowType: (flowType: AuthFlowType | null) => set({ flowType }),
    clearEmail: () => set({ email: '' }),
    clearFlowType: () => set({ flowType: null }),
    clearAll: () => set({ email: '', flowType: null }),
})); 