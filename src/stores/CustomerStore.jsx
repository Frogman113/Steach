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

  editCustomer: (id, updatedCustomer) =>
    set((state) => ({
      customerCards: state.customerCards.map((card) =>
        card.id === id ? { ...card, ...updatedCustomer } : card,
      ),
    })),

  deleteCustomer: (id) =>
    set((state) => ({
      customerCards: state.customerCards.filter((card) => card.id !== id),
    })),
}));

export default useCustomerStore;
