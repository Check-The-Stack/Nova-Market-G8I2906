import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { Product, CartItem } from '../types';

interface CartState { items: CartItem[] }

type Action =
  | { type: 'ADD_ITEM'; product: Product; quantity?: number }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR' };

interface CartContextValue {
  items: CartItem[];
  total: number;
  totalItems: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.product.id === action.product.id);
      if (existing) return { items: state.items.map(i => i.product.id === action.product.id ? { ...i, quantity: i.quantity + (action.quantity ?? 1) } : i) };
      return { items: [...state.items, { product: action.product, quantity: action.quantity ?? 1 }] };
    }
    case 'REMOVE_ITEM': return { items: state.items.filter(i => i.product.id !== action.productId) };
    case 'UPDATE_QUANTITY': return { items: state.items.map(i => i.product.id === action.productId ? { ...i, quantity: action.quantity } : i) };
    case 'CLEAR': return { items: [] };
    default: return state;
  }
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });
  const total = state.items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const totalItems = state.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items, total, totalItems,
        addItem: (p, q) => dispatch({ type: 'ADD_ITEM', product: p, quantity: q }),
        removeItem: (id) => dispatch({ type: 'REMOVE_ITEM', productId: id }),
        updateQuantity: (id, q) => dispatch({ type: 'UPDATE_QUANTITY', productId: id, quantity: q }),
        clear: () => dispatch({ type: 'CLEAR' }),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
