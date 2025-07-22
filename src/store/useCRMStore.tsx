import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CRMUser {
  [key: string]: any;
}

interface CRMStoreState {
  crmUsers: CRMUser[];
  originalUsers: CRMUser[];
  // GlobalUsers: CRMUser[];
  itemsPerPage: number;
  setCRMUsers: (users: CRMUser[]) => void;
  // setGlobalUsers: (users: CRMUser[]) => void;
  setOriginalUsers: (users: CRMUser[]) => void;
  resetCRMUsers: () => void;
  setItemsPerPage: (count: number) => void;
}

const useCRMStore = create<CRMStoreState>()(
  persist(
    (set, get) => ({
      crmUsers: [],
      originalUsers: [],
      GlobalUsers: [],
      itemsPerPage: 10,

      setCRMUsers: (users) => {
        console.log('Updating Zustand Store: crmUsers', users);
        set({ crmUsers: users });
      },

      setOriginalUsers: (users) => {
        console.log('Updating Zustand Store: originalUsers', users);
        set({ originalUsers: users, crmUsers: users });
      },

      resetCRMUsers: () => {
        const { originalUsers } = get();
        console.log('Resetting to original users:', originalUsers);
        set({ crmUsers: originalUsers });
      },

      setItemsPerPage: (count) => {
        set({ itemsPerPage: count });
      },
    }),
    {
      name: 'crm-store', // localStorage key
    }
  )
);

export default useCRMStore;
