// src/stores/cart-store.ts
import { createStore } from 'zustand/vanilla';

export interface Rating {
  rate: number;
  count: number;
}

export interface Product {
  category: string;
  description: string;
  id: string;
  image: string;
  price: number;
  rating: Rating;
  title: string;
  quantity?: number;
}

export interface CartItem extends Product {
  id: string;
}

export interface CartState {
  items: CartItem[];
  addItem: (item: Product) => void;
  updateItem: (id: string, updatedItem: Partial<Product>) => void;
  deleteItem: (id: string) => void;
  clearCart: () => void;
}

// Load initial state from localStorage
const loadCartFromLocalStorage = (): CartItem[] => {
  try {
    const storedCart = localStorage.getItem('cart-storage');
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error('Could not load cart from localStorage:', error);
    return [];
  }
};

export const defaultCartState: CartState = {
  items: loadCartFromLocalStorage(),
  addItem: () => {},
  updateItem: () => {},
  deleteItem: () => {},
  clearCart: () => {},
};

export const createCartStore = (initState: CartState = defaultCartState) => {
  const store = createStore<CartState>()((set) => ({
    ...initState,

    // Add an item to the cart
    addItem: (item) =>
      set((state) => {
        const updatedItems = [...state.items, { ...item }];
        localStorage.setItem('cart-storage', JSON.stringify(updatedItems));
        return { items: updatedItems };
      }),

    // Update an item in the cart by id
    updateItem: (id, updatedItem) =>
      set((state) => {
        const updatedItems = state.items.map((item) =>
          item.id === id ? { ...item, ...updatedItem } : item
        );
        localStorage.setItem('cart-storage', JSON.stringify(updatedItems));
        return { items: updatedItems };
      }),

    // Delete an item from the cart by id
    deleteItem: (id) =>
      set((state) => {
        const updatedItems = state.items.filter((item) => item.id !== id);
        localStorage.setItem('cart-storage', JSON.stringify(updatedItems));
        return { items: updatedItems };
      }),

    // Clear the entire cart
    clearCart: () =>
      set(() => {
        localStorage.removeItem('cart-storage');
        return { items: [] };
      }),
  }));

  return store;
};
