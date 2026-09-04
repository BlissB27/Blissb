import { strapiGet, strapiPost } from '@/lib/strapi';

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
  couponCode?: string;
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

// Un pedido en Strapi solo existe si el pago se completó (lo crea el webhook
// de Stripe), así que "existe una orden con este email + código" es
// exactamente "este cliente ya canjeó este cupón".
export async function hasCustomerUsedCoupon(customerEmail: string, couponCode: string): Promise<boolean> {
  const res: any = await strapiGet('/orders', {
    'filters[customerEmail][$eqi]': customerEmail.trim(),
    'filters[couponCode][$eqi]': couponCode.trim(),
    'pagination[limit]': '1',
  });
  return Array.isArray(res?.data) && res.data.length > 0;
}
