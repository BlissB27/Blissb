import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/data/products';
import { getProductImageSrc } from '@/lib/productImage';

export type CartItem = {
  id: string;
  product: Product;
  quantity: number;
  flavor?: string; // Para cakes que requieren sabor específico
  customMessage?: string; // Para desserts que permiten mensaje personalizado
};

type CartStore = {
  items: CartItem[];
  isOpen: boolean;
  
  // Actions
  addItem: (product: Product, quantity?: number, flavor?: string, customMessage?: string) => void;
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
  getShippingInfo: () => {
    totalCookies: number;
    dozensRequired: number;
    shippingCost: number;
    message: string;
  };
  getTotalWithDelivery: () => number;
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
  validateProduct: (product: Product, flavor?: string) => {
    isValid: boolean;
    error?: string;
  };
};

// Constantes
const MINIMUM_COOKIES_REQUIRED = 4;
const SHIPPING_COST_PER_DOZEN = 15; // $15 por cada 12 galletas
const COOKIES_PER_DOZEN = 12;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (product, quantity = 1, flavor, customMessage) => {
        const normalizedProduct = {
          ...product,
          image: getProductImageSrc(product.image),
        };

        // Validar producto antes de agregar
        const productValidation = get().validateProduct(normalizedProduct, flavor);
        if (!productValidation.isValid) {
          console.error(productValidation.error);
          return;
        }

        // Validar cantidad mínima
        const quantityValidation = get().validateMinimumQuantity(normalizedProduct, quantity);
        if (!quantityValidation.isValid) {
          console.error(quantityValidation.error);
          return;
        }

        // Validar stock disponible
        const stock = normalizedProduct.stock ?? 0;
        if (stock <= 0) {
          console.error(`${normalizedProduct.name} is out of stock`);
          return;
        }

        set((state) => {
          // Para productos con sabor o desserts con mensaje, crear un ID único
          let itemId = normalizedProduct.id;
          if (flavor) {
            // Cualquier producto con sabor seleccionado
            itemId = `${normalizedProduct.id}-${flavor}`;
          } else if (customMessage) {
            // Para productos con mensaje personalizado, crear ID único
            itemId = `${normalizedProduct.id}-${Date.now()}`;
          }

          const existingItem = state.items.find(item => item.id === itemId);

          // Si existe y NO tiene mensaje personalizado, incrementar cantidad
          if (existingItem && !customMessage) {
            const newQuantity = existingItem.quantity + quantity;
            // Verificar que no exceda el stock disponible
            if (newQuantity > stock) {
              console.error(`Cannot add more items. Only ${stock} in stock.`);
              return {
                items: state.items.map(item =>
                  item.id === itemId
                    ? { ...item, quantity: stock }
                    : item
                ),
                isOpen: true,
              };
            }

            return {
              items: state.items.map(item =>
                item.id === itemId
                  ? { ...item, quantity: newQuantity }
                  : item
              ),
              isOpen: true,
            };
          }

          // Validar stock al agregar nuevo item
          if (quantity > stock) {
            console.error(`Cannot add ${quantity} items. Only ${stock} in stock.`);
            quantity = stock;
          }

          // Agregar nuevo item
          return {
            items: [...state.items, {
              id: itemId,
              product: normalizedProduct,
              quantity,
              flavor,
              customMessage
            }],
            isOpen: true,
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

          // Validate minimum quantity
          const validation = get().validateMinimumQuantity(item.product, quantity);
          if (!validation.isValid) {
            console.error(validation.error);
            return state;
          }

          // Validate stock availability
          const stock = item.product.stock ?? 0;
          if (quantity > stock) {
            console.error(`Cannot add more than ${stock} items. Only ${stock} in stock.`);
            // Set to max available stock instead of failing silently
            return {
              items: state.items.map(i =>
                i.id === productId
                  ? { ...i, quantity: stock }
                  : i
              ),
            };
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
      
      getShippingInfo: () => {
        // Solo contar cookies individuales (excluir cajas)
        const cookieItems = get().items.filter(item =>
          item.product.category === 'cookies' && item.product.isSoldInBox !== true
        );
        const totalCookies = cookieItems.reduce((sum, item) => sum + item.quantity, 0);
        const dozensRequired = Math.ceil(totalCookies / COOKIES_PER_DOZEN);
        const shippingCost = dozensRequired * SHIPPING_COST_PER_DOZEN;

        let message = '';
        if (totalCookies === 0) {
          message = 'Shipping costs calculated at checkout';
        } else if (totalCookies < COOKIES_PER_DOZEN) {
          message = `Shipping cost: $${SHIPPING_COST_PER_DOZEN} for up to ${COOKIES_PER_DOZEN} cookies`;
        } else {
          message = `Shipping cost: $${shippingCost} for ${totalCookies} cookies (${dozensRequired} dozen${dozensRequired > 1 ? 's' : ''})`;
        }

        return {
          totalCookies,
          dozensRequired,
          shippingCost,
          message
        };
      },

      getTotalWithDelivery: () => {
        const subtotal = get().getTotalPrice();
        const shippingInfo = get().getShippingInfo();

        // Importar deliveryStore de forma dinámica para evitar dependencias circulares
        // El delivery fee se calculará en el componente que use esta función
        return subtotal + shippingInfo.shippingCost;
      },

      getMinimumCookiesInfo: () => {
        // Solo contar cookies individuales (excluir cajas)
        const cookieItems = get().items.filter(item =>
          item.product.category === 'cookies' && item.product.isSoldInBox !== true
        );
        const currentCookies = cookieItems.reduce((total, item) => total + item.quantity, 0);

        // Si no hay galletas en el carrito, permitir continuar
        // Si hay galletas, debe tener al menos el mínimo requerido
        const hasEnoughCookies = currentCookies === 0 || currentCookies >= MINIMUM_COOKIES_REQUIRED;

        return {
          hasEnoughCookies,
          currentCookies,
          minimumRequired: MINIMUM_COOKIES_REQUIRED,
        };
      },
      
      validateMinimumQuantity: (_product, quantity) => {
        // Validación básica: mínimo 1 para cualquier producto
        if (quantity < 1) {
          return {
            isValid: false,
            error: `Minimum quantity is 1`,
          };
        }

        return { isValid: true };
      },

      validateProduct: (product, flavor) => {
        // Validar que los productos con flavors disponibles tengan sabor especificado
        if (product.flavors && product.flavors.length > 0 && !flavor) {
          return {
            isValid: false,
            error: `Please select a flavor for ${product.name}`,
          };
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
