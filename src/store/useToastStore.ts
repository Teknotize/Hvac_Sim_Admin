import { create } from 'zustand';

interface ToastState {
    message: string;
    type: 'success' | 'error' | null;
    isOpen: boolean;
    showToast: (message: string, type: 'success' | 'error') => void;
    hideToast: () => void;
}

const useToastStore = create<ToastState>((set) => ({
    message: '',
    type: null,
    isOpen: false,
    showToast: (message, type) => set({ message, type, isOpen: true }),
    hideToast: () => set({ isOpen: false }),
}));

export default useToastStore;