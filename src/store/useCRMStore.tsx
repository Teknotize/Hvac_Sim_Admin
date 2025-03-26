import { create } from 'zustand';

interface CRMUser {
  [key: string]: any;
}

interface CRMStoreState {
  crmUsers: CRMUser[];
  setCRMUsers: (users: CRMUser[]) => void;
}

const useCRMStore = create<CRMStoreState>((set) => ({
  crmUsers: [],
  setCRMUsers: (users) => {
    console.log('Updating Zustand Store:', users); // Debug log
    set({ crmUsers: users });
  },
}));

export default useCRMStore;
