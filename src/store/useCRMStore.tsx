import { create } from "zustand";

interface CRMUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  business?: string;
  tags: string[];
  createdAt: string;
  subscriptionLevel?: string;
  isChecked?: boolean;
}

interface CRMStoreState {
  crmUsers: CRMUser[];
  originalUsers: CRMUser[]; // Store full dataset
  setCRMUsers: (users: CRMUser[]) => void;
  setOriginalUsers: (users: CRMUser[]) => void;
  resetCRMUsers: () => void; // Resets filtered users to originalUsers
}

const useCRMStore = create<CRMStoreState>((set, get) => ({
  crmUsers: [],
  originalUsers: [],

  setCRMUsers: (users) => {
    set({ crmUsers: users });
  },

  setOriginalUsers: (users) => {
    set({ originalUsers: users, crmUsers: users }); // Ensure both get updated
  },

  resetCRMUsers: () => {
    const { originalUsers } = get();

    set({ crmUsers: originalUsers });
  },
}));

export default useCRMStore;
