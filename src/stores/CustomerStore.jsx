import { create } from 'zustand';

const useCustomerStore = create((set) => ({
  customerCards: [],
  currentId: 1,
  addCustomer: (newCustomer) =>
    set((state) => ({
      customerCards: [
        ...state.customerCards,
        {
          id: state.currentId,
          ...newCustomer,
        },
      ],

      currentId: state.currentId + 1,
    })),
}));

export default useCustomerStore;
