import { create } from "zustand";

interface UserState {
    name: string | null;
    email: string | null;
    setUser: (user: { name: string; email: string }) => void;
    clearUser: () => void;
}

export const useUserInfoStore = create<UserState>((set) => ({
    name: null,
    email: null,
    setUser: ({ name, email }) => set({ name, email }),
    clearUser: () => set({ name: null, email: null }),
}));
