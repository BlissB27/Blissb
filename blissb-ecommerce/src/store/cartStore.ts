import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/data/products';
import { getProductImageSrc } from '@/lib/productImage';
import { FREE_SHIPPING_SUBTOTAL_THRESHOLD } from '@/lib/deliveryPricing';

export type BoxFlavor = {
  flavor: string;
  quantity: number;
};

export type CartItem = {
  id: string;
  product: Product;
  quantity: number;
  flavor?: string; // Para cakes que requieren sabor específico
  boxFlavors?: BoxFlavor[]; // Para cajas con reparto de sabores (ej. Mini Cookie Box)
  message?: string; // Mensaje corto en chocolate para cakes (se edita solo en /cart)
};

// Tope del mensaje en chocolate: alcanza para un nombre corto o "Happy Birthday",
// no para personalización libre.
export const CAKE_MESSAGE_MAX_LENGTH = 13;

export type AddItemOptions = {
  quantity?: number;
  flavor?: string;
  boxFlavors?: BoxFlavor[];
};

export type AddItemResult = {
  success: boolean;
  error?: string;
};

export type AppliedCoupon = { code: string; percentOff: number };

type CartStore = {
  items: CartItem[];
  isOpen: boolean;
  appliedCoupon: AppliedCoupon | null;

  // Actions
  addItem: (product: Product, options?: AddItemOptions) => AddItemResult;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setItemMessage: (productId: string, message: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  setCoupon: (coupon: AppliedCoupon) => void;
  clearCoupon: () => void;

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
      appliedCoupon: null,

      addItem: (product, options = {}) => {
        const { quantity = 1, flavor, boxFlavors } = options;

        const normalizedProduct = {
          ...product,
          image: getProductImageSrc(product.image),
        };

        // Validar producto antes de agregar
        const productValidation = get().validateProduct(normalizedProduct, flavor, boxFlavors);
        if (!productValidation.isValid) {
          return { success: false, error: productValidation.error };
        }

        // Stock: el backend revalida en checkout, pero el carrito nunca debe
        // dejar agregar un producto agotado ni superar el inventario disponible.
        // Se suma la cantidad ya en el carrito de este mismo producto (líneas
        // simples, por sabor y cajas comparten el mismo pool de stock).
        if (typeof normalizedProduct.stock === 'number') {
          if (normalizedProduct.stock <= 0) {
            return { success: false, error: `${normalizedProduct.name} is out of stock.` };
          }
          const alreadyInCart = get().items
            .filter((item) => item.product.id === normalizedProduct.id)
            .reduce((sum, item) => sum + item.quantity, 0);
          if (alreadyInCart + quantity > normalizedProduct.stock) {
            const remaining = Math.max(0, normalizedProduct.stock - alreadyInCart);
            return {
              success: false,
              error: remaining > 0
                ? `Only ${remaining} more of ${normalizedProduct.name} available.`
                : `You already have all available stock of ${normalizedProduct.name} in your cart.`,
            };
          }
        }

        // boxFlavors is the fixed recipe for ONE box (must sum to product.boxSize —
        // validated above in validateProduct) — it's never the cart quantity. The
        // cart quantity is always just `quantity` (how many boxes / units), same as
        // any other product, defaulting to 1.
        const quantityValidation = get().validateMinimumQuantity(normalizedProduct, quantity);
        if (!quantityValidation.isValid) {
          return { success: false, error: quantityValidation.error };
        }

        set((state) => {
          // Las cajas siempre son su propia línea de carrito (cada combinación de sabores es única)
          if (boxFlavors) {
            return {
              items: [...state.items, {
                id: `${normalizedProduct.id}-box-${Date.now()}`,
                product: normalizedProduct,
                quantity,
                boxFlavors,
              }],
              isOpen: true,
            };
          }

          // Para productos con sabor, crear un ID único por sabor
          const itemId = flavor ? `${normalizedProduct.id}-${flavor}` : normalizedProduct.id;

          const existingItem = state.items.find(item => item.id === itemId);

          // Si ya existe esa combinación, incrementar cantidad
          if (existingItem) {
            return {
              items: state.items.map(item =>
                item.id === itemId
                  ? { ...item, quantity: item.quantity + quantity }
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
              quantity,
              flavor,
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

          // Validate minimum quantity
          const validation = get().validateMinimumQuantity(item.product, quantity);
          if (!validation.isValid) {
            console.error(validation.error);
            return state;
          }

          // No dejar que el stepper del carrito supere el inventario disponible
          // (sumando otras líneas del mismo producto: sabores, cajas).
          if (typeof item.product.stock === 'number') {
            const otherLinesQty = state.items
              .filter((other) => other.id !== productId && other.product.id === item.product.id)
              .reduce((sum, other) => sum + other.quantity, 0);
            if (otherLinesQty + quantity > item.product.stock) {
              return state;
            }
          }

          // boxFlavors (the per-box flavor recipe) is untouched — quantity here
          // is just how many boxes/units, same as any other product.
          return {
            items: state.items.map(item =>
              item.id === productId ? { ...item, quantity } : item
            ),
          };
        });
      },
      
      setItemMessage: (productId, message) => {
        const trimmed = message.slice(0, CAKE_MESSAGE_MAX_LENGTH);
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId
              ? { ...item, message: trimmed.length > 0 ? trimmed : undefined }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], appliedCoupon: null });
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

      setCoupon: (coupon) => {
        set({ appliedCoupon: coupon });
      },

      clearCoupon: () => {
        set({ appliedCoupon: null });
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

        // Envío gratis a partir del umbral de subtotal (misma regla que valida el backend).
        const subtotal = get().getTotalPrice();
        const qualifiesFreeShipping = subtotal >= FREE_SHIPPING_SUBTOTAL_THRESHOLD;
        const shippingCost = qualifiesFreeShipping ? 0 : dozensRequired * SHIPPING_COST_PER_DOZEN;

        let message = '';
        if (qualifiesFreeShipping) {
          message = `Free shipping on orders over $${FREE_SHIPPING_SUBTOTAL_THRESHOLD}`;
        } else if (totalCookies === 0) {
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
      partialize: (state) => ({ items: state.items, appliedCoupon: state.appliedCoupon }),
    }
  )
);
