// Notificación push a Pushover al entrar un pedido nuevo. Best-effort: si las
// credenciales no están configuradas (PUSHOVER_APP_TOKEN / PUSHOVER_USER_KEY),
// no hace nada — nunca bloquea ni tumba el fulfillment del pedido.
type OrderPush = {
  orderNumber: string;
  customerName: string;
  total: number;
  itemCount: number;
  deliveryType?: string;
};

export async function sendOrderPush(order: OrderPush): Promise<void> {
  const token = process.env.PUSHOVER_APP_TOKEN;
  const user = process.env.PUSHOVER_USER_KEY;
  if (!token || !user) return; // sin credenciales → se omite en silencio

  const method = order.deliveryType ? ` · ${order.deliveryType}` : '';
  const message =
    `${order.customerName} — $${order.total.toFixed(2)} · ` +
    `${order.itemCount} item${order.itemCount === 1 ? '' : 's'}${method}`;

  try {
    await fetch('https://api.pushover.net/1/messages.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        user,
        title: `New order ${order.orderNumber}`,
        message,
        priority: 1, // high — que suene aunque el teléfono esté en silencio de horario
      }),
    });
  } catch (err) {
    console.error('Failed to send Pushover notification:', err);
  }
}
