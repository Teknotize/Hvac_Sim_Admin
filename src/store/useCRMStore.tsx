import { create } from 'zustand';

interface CRMUser {
  [key: string]: any;
}


interface CRMStoreState {
  crmUsers: CRMUser[];
  originalUsers: CRMUser[]; // Store full dataset
  itemsPerPage: number; // <-- Add this
  setCRMUsers: (users: CRMUser[]) => void;
  setOriginalUsers: (users: CRMUser[]) => void;
  resetCRMUsers: () => void; // Resets filtered users to originalUsers
  setItemsPerPage: (count: number) => void; // <-- Add this
}

const useCRMStore = create<CRMStoreState>((set, get) => ({
  crmUsers: [],
  originalUsers: [],
   itemsPerPage: 10, // <-- Default value

  setCRMUsers: (users) => {
    console.log('Updating Zustand Store: crmUsers', users); // Debug log
    set({ crmUsers: users });
  },

  setOriginalUsers: (users) => {
    console.log('Updating Zustand Store: originalUsers', users); // Debug log
    set({ originalUsers: users, crmUsers: users }); // Ensure both get updated
  },

  resetCRMUsers: () => {
    const { originalUsers } = get();
    console.log('Resetting to original users:', originalUsers);
    set({ crmUsers: originalUsers });
  },
   setItemsPerPage: (count) => {
    set({ itemsPerPage: count });
  },
}));

export default useCRMStore;
