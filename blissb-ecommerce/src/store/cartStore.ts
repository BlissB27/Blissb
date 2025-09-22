import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/data/products';

export type CartItem = {
  id: string;
  product: Product;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  isOpen: boolean;
  
  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  
  // Getters
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemQuantity: (productId: string) => number;
  getFreeShippingProgress: () => {
    current: number;
    target: number;
    remaining: number;
    percentage: number;
    isEligible: boolean;
  };
  getMinimumCookiesInfo: () => {
    hasEnoughCookies: boolean;
    currentCookies: number;
    minimumRequired: number;
  };
  
  // Validation
  validateMinimumQuantity: (product: Product, quantity: number) => {
    isValid: boolean;
    error?: string;
  };
};

// Constantes
const FREE_SHIPPING_THRESHOLD = 320;
const MINIMUM_COOKIES_REQUIRED = 4;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (product, quantity = 1) => {
        const validation = get().validateMinimumQuantity(product, quantity);
        
        if (!validation.isValid) {
          console.error(validation.error);
          return;
        }
        
        set((state) => {
          const existingItem = state.items.find(item => item.id === product.id);
          
          if (existingItem) {
            return {
              items: state.items.map(item =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
              isOpen: true, // Auto-abrir drawer al agregar
            };
          }
          
          return {
            items: [...state.items, { id: product.id, product, quantity }],
            isOpen: true, // Auto-abrir drawer al agregar
          };
        });
      },
      
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== productId),
        }));
      },
      
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        set((state) => {
          const item = state.items.find(item => item.id === productId);
          if (!item) return state;
          
          const validation = get().validateMinimumQuantity(item.product, quantity);
          if (!validation.isValid) {
            console.error(validation.error);
            return state;
          }
          
          return {
            items: state.items.map(item =>
              item.id === productId
                ? { ...item, quantity }
                : item
            ),
          };
        });
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },
      
      openCart: () => {
        set({ isOpen: true });
      },
      
      closeCart: () => {
        set({ isOpen: false });
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + (item.product.price * item.quantity),
          0
        );
      },
      
      getItemQuantity: (productId) => {
        const item = get().items.find(item => item.id === productId);
        return item?.quantity || 0;
      },
      
      getFreeShippingProgress: () => {
        const current = get().getTotalPrice();
        const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - current);
        const percentage = Math.min(100, (current / FREE_SHIPPING_THRESHOLD) * 100);
        
        return {
          current,
          target: FREE_SHIPPING_THRESHOLD,
          remaining,
          percentage,
          isEligible: current >= FREE_SHIPPING_THRESHOLD,
        };
      },
      
      getMinimumCookiesInfo: () => {
        const cookieItems = get().items.filter(item => item.product.category === 'cookies');
        const currentCookies = cookieItems.reduce((total, item) => total + item.quantity, 0);
        
        return {
          hasEnoughCookies: currentCookies >= MINIMUM_COOKIES_REQUIRED,
          currentCookies,
          minimumRequired: MINIMUM_COOKIES_REQUIRED,
        };
      },
      
      validateMinimumQuantity: (product, quantity) => {
        if (product.category === 'cookies') {
          const allowedQuantities = [4, 10, 15];
          if (!allowedQuantities.includes(quantity)) {
            return {
              isValid: false,
              error: `Please select 4, 10, or 15 pieces for ${product.name}`,
            };
          }
        }
        
        return { isValid: true };
      },
    }),
    {
      name: 'bliss-b-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);