import { strapiPost } from '@/lib/strapi';
import { StrapiResponse, StrapiOrder } from '@/types/strapi';
import type { CartItem } from '@/store/cartStore';

// Order creation types
export interface CreateOrderData {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: CartItem[];
  totalAmount: number;
  stripeSessionId?: string;
  notes?: string;
}

// Transform cart items to order items format
function transformCartItemsToOrderItems(items: CartItem[]) {
  return items.map(item => ({
    productId: parseInt(item.id.split('-')[0]), // Handle flavored items (remove flavor suffix)
    productName: item.product.name,
    quantity: item.quantity,
    price: item.product.price,
    flavor: item.flavor,
  }));
}

// Create a new order
export async function createOrder(orderData: CreateOrderData): Promise<StrapiOrder | null> {
  try {
    const orderPayload = {
      data: {
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        customerPhone: orderData.customerPhone,
        shippingAddress: orderData.shippingAddress,
        items: transformCartItemsToOrderItems(orderData.items),
        totalAmount: orderData.totalAmount,
        status: 'pending' as const,
        stripeSessionId: orderData.stripeSessionId,
        notes: orderData.notes,
      }
    };

    const response: StrapiResponse<StrapiOrder> = await strapiPost('/orders', orderPayload);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
}

// Update order status (for webhook handling)
export async function updateOrderStatus(
  orderId: number,
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
  stripeSessionId?: string
): Promise<boolean> {
  try {
    const updatePayload = {
      data: {
        status,
        ...(stripeSessionId && { stripeSessionId }),
      }
    };

    await strapiPost(`/orders/${orderId}`, updatePayload);
    return true;
  } catch (error) {
    console.error(`Error updating order ${orderId}:`, error);
    return false;
  }
}

// Find order by Stripe session ID (for webhook processing)
export async function findOrderByStripeSession(sessionId: string): Promise<StrapiOrder | null> {
  try {
    // Note: This would require a custom Strapi endpoint or you can query by stripeSessionId
    // For now, we'll implement this when setting up webhooks
    console.log('Finding order by stripe session:', sessionId);
    return null;
  } catch (error) {
    console.error('Error finding order by stripe session:', error);
    return null;
  }
}