import { strapiPost } from '@/lib/strapi';

type OrderItem = {
  name: string;
  price: number;
  quantity: number;
  size?: string;
  message?: string;
};

type ShippingAddress = {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
};

type OrderRecord = {
  orderNumber: string;
  paymentId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  processingFee: number;
  total: number;
  shippingAddress: ShippingAddress;
  deliveryType?: string;
  deliveryDate?: string;
  deliveryTime?: string;
  specialMessage?: string;
};

// Guarda la orden en Strapi para que la clienta pueda verla en su panel de
// admin. Best-effort: si falla, no debe tumbar el webhook (el pago ya se
// cobró y el email/pushover no dependen de esto) — el caller atrapa errores.
export async function createOrderRecord(order: OrderRecord): Promise<boolean> {
  await strapiPost('/orders', { data: order });
  return true;
}
