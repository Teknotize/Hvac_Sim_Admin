import { create } from 'zustand';

interface ToastState {
    message: string;
    type: 'success' | 'error' | 'progress' | null;
    isOpen: boolean;
    progress: number;
    total: number;
    completed: number;
    showToast: (message: string, type: 'success' | 'error' | 'progress') => void;
    hideToast: () => void;
    startProgress: (total: number) => void;
    updateProgress: (completed: number) => void;
    completeProgress: (success: boolean, message?: string) => void;
}

const useToastStore = create<ToastState>((set) => ({
    message: '',
    type: null,
    isOpen: true,
    progress: 0,
    total: 0,
    completed: 0,

    showToast: (message, type) => set({ message, type, isOpen: true }),
    hideToast: () => set({ isOpen: false }),

    startProgress: (total) => set({
        isOpen: true,
        type: 'progress',
        message: 'Starting email sending...',
        total,
        completed: 0,
        progress: 0
    }),

    updateProgress: (completed) => set((state) => {
        const progress = state.total > 0 ? Math.min(Math.round((completed / state.total) * 100), 100) : 0;
        return {
            completed,
            progress,
            message: `Sending emails... (${completed}/${state.total})`
        };
    }),

    completeProgress: (success, message) => set({
        isOpen: true,
        type: success ? 'success' : 'error',
        message: message || (success ? 'All emails sent successfully!' : 'Failed to send emails'),
        progress: success ? 100 : 0
    })
}));

export default useToastStore;