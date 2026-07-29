import { Resend } from 'resend';
import {
  generateOrderConfirmationHTML,
  generateAdminOrderHTML,
} from './emailTemplates';

const resend = new Resend(process.env.RESEND_API_KEY);

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  color?: string;
}

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

interface OrderEmailData {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  orderDate: string;
  products: Product[];
  subtotal: number;
  shipping: number;
  processingFee?: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod?: string;
  paymentId?: string;
  deliveryType?: string;
  deliveryDate?: string;
  deliveryTime?: string;
}

/**
 * Envía email de confirmación al cliente
 */
export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  try {
    const emailHtml = generateOrderConfirmationHTML({
      customerName: data.customerName,
      orderNumber: data.orderNumber,
      orderDate: data.orderDate,
      products: data.products,
      subtotal: data.subtotal,
      shipping: data.shipping,
      processingFee: data.processingFee,
      total: data.total,
      shippingAddress: data.shippingAddress,
      deliveryType: data.deliveryType,
      deliveryDate: data.deliveryDate,
      deliveryTime: data.deliveryTime,
    });

    const result = await resend.emails.send({
      from: 'Bliss-B Desserts <orders@blissbbakery.com>',
      to: data.customerEmail,
      subject: `Order Confirmation #${data.orderNumber}`,
      html: emailHtml,
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return { success: false, error };
  }
}

/**
 * Envía email de notificación al admin
 */
export async function sendAdminOrderNotification(data: OrderEmailData) {
  try {
    const emailHtml = generateAdminOrderHTML({
      orderNumber: data.orderNumber,
      orderDate: data.orderDate,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      products: data.products,
      subtotal: data.subtotal,
      shipping: data.shipping,
      processingFee: data.processingFee,
      total: data.total,
      shippingAddress: data.shippingAddress,
      paymentMethod: data.paymentMethod || 'Stripe',
      paymentId: data.paymentId || '',
      deliveryType: data.deliveryType,
      deliveryDate: data.deliveryDate,
      deliveryTime: data.deliveryTime,
    });

    const adminEmail = process.env.ADMIN_EMAIL || 'blissbdesserts@gmail.com';

    const result = await resend.emails.send({
      from: 'Bliss-B Desserts <orders@blissbbakery.com>',
      to: adminEmail,
      subject: `🛍️ New Order #${data.orderNumber} - ${data.customerName}`,
      html: emailHtml,
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    return { success: false, error };
  }
}

/**
 * Envía ambos emails (cliente y admin) al confirmar una orden
 */
export async function sendOrderEmails(data: OrderEmailData) {
  const [customerResult, adminResult] = await Promise.all([
    sendOrderConfirmationEmail(data),
    sendAdminOrderNotification(data),
  ]);

  return {
    customer: customerResult,
    admin: adminResult,
  };
}
