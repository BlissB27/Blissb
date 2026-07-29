import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/data/products';
import { getProductImageSrc } from '@/lib/productImage';

export type BoxFlavor = {
  flavor: string;
  quantity: number;
};

export type CartItem = {
  id: string;
  product: Product;
  quantity: number;
  flavor?: string; // Para cakes que requieren sabor específico
  customMessage?: string; // Para desserts que permiten mensaje personalizado
  boxFlavors?: BoxFlavor[]; // Para cajas con reparto de sabores (ej. Mini Cookie Box)
};

export type AddItemOptions = {
  quantity?: number;
  flavor?: string;
  customMessage?: string;
  boxFlavors?: BoxFlavor[];
};

export type AddItemResult = {
  success: boolean;
  error?: string;
};

type CartStore = {
  items: CartItem[];
  isOpen: boolean;

  // Actions
  addItem: (product: Product, options?: AddItemOptions) => AddItemResult;
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
  getMinimumOrderInfo: () => {
    hasMinimumOrder: boolean;
    currentTotal: number;
    minimumRequired: number;
  };

  // Validation
  validateMinimumQuantity: (product: Product, quantity: number) => {
    isValid: boolean;
    error?: string;
  };
  validateProduct: (product: Product, flavor?: string, boxFlavors?: BoxFlavor[]) => {
    isValid: boolean;
    error?: string;
  };
};

// Constantes
const MINIMUM_ORDER_VALUE = 20; // Mínimo de subtotal para poder pagar
const SHIPPING_COST_PER_DOZEN = 15; // $15 por cada 12 galletas
const COOKIES_PER_DOZEN = 12;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (product, options = {}) => {
        const { quantity = 1, flavor, customMessage, boxFlavors } = options;

        const normalizedProduct = {
          ...product,
          image: getProductImageSrc(product.image),
        };

        // Validar producto antes de agregar
        const productValidation = get().validateProduct(normalizedProduct, flavor, boxFlavors);
        if (!productValidation.isValid) {
          return { success: false, error: productValidation.error };
        }

        // Cajas: la cantidad total la define la suma de boxFlavors, no el parámetro quantity
        const effectiveQuantity = boxFlavors
          ? boxFlavors.reduce((sum, f) => sum + f.quantity, 0)
          : quantity;

        // Validar cantidad mínima (no aplica a cajas, ya validadas contra boxSize)
        if (!boxFlavors) {
          const quantityValidation = get().validateMinimumQuantity(normalizedProduct, effectiveQuantity);
          if (!quantityValidation.isValid) {
            return { success: false, error: quantityValidation.error };
          }
        }

        set((state) => {
          // Las cajas siempre son su propia línea de carrito (cada combinación de sabores es única)
          if (boxFlavors) {
            return {
              items: [...state.items, {
                id: `${normalizedProduct.id}-box-${Date.now()}`,
                product: normalizedProduct,
                quantity: effectiveQuantity,
                boxFlavors,
              }],
              isOpen: true,
            };
          }

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
            return {
              items: state.items.map(item =>
                item.id === itemId
                  ? { ...item, quantity: item.quantity + effectiveQuantity }
                  : item
              ),
              isOpen: true,
            };
          }

          // Agregar nuevo item
          return {
            items: [...state.items, {
              id: itemId,
              product: normalizedProduct,
              quantity: effectiveQuantity,
              flavor,
              customMessage
            }],
            isOpen: true,
          };
        });

        return { success: true };
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

          // Los items de caja tienen su cantidad fija por el reparto de sabores
          if (item.boxFlavors) return state;

          // Validate minimum quantity
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

      getMinimumOrderInfo: () => {
        const currentTotal = get().getTotalPrice();
        const items = get().items;

        // Carrito vacío = válido (no bloquea antes de agregar nada)
        const hasMinimumOrder = items.length === 0 || currentTotal >= MINIMUM_ORDER_VALUE;

        return {
          hasMinimumOrder,
          currentTotal,
          minimumRequired: MINIMUM_ORDER_VALUE,
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

      validateProduct: (product, flavor, boxFlavors) => {
        // Reparto de sabores por checkboxes (cajas y productos regulares con flavors)
        if (boxFlavors) {
          if (boxFlavors.length === 0) {
            return {
              isValid: false,
              error: `Please select at least one flavor for ${product.name}`,
            };
          }

          if (boxFlavors.length > 3) {
            return {
              isValid: false,
              error: `You can select up to 3 flavors for ${product.name}`,
            };
          }

          const uniqueFlavors = new Set(boxFlavors.map(f => f.flavor));
          if (uniqueFlavors.size !== boxFlavors.length) {
            return {
              isValid: false,
              error: `Duplicate flavors selected for ${product.name}`,
            };
          }

          const total = boxFlavors.reduce((sum, f) => sum + f.quantity, 0);

          if (product.isSoldInBox) {
            if (!product.boxSize) {
              return {
                isValid: false,
                error: `${product.name} is not available yet — box configuration is pending.`,
              };
            }
            if (total !== product.boxSize) {
              return {
                isValid: false,
                error: `Selected flavor quantities must add up to ${product.boxSize} for ${product.name}`,
              };
            }
          } else if (total < 1) {
            return {
              isValid: false,
              error: `Please select at least 1 item for ${product.name}`,
            };
          }

          return { isValid: true };
        }

        if (product.isSoldInBox) {
          return {
            isValid: false,
            error: `Please select flavors for ${product.name}`,
          };
        }

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
