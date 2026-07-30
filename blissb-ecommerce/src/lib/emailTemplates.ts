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

export function generateOrderConfirmationHTML(data: {
  customerName: string;
  orderNumber: string;
  orderDate: string;
  products: Product[];
  subtotal: number;
  shipping: number;
  processingFee?: number;
  total: number;
  shippingAddress: ShippingAddress;
  deliveryType?: string;
  deliveryDate?: string;
  deliveryTime?: string;
  specialMessage?: string;
}) {
  const productsHTML = data.products
    .map(
      (product) => `
    <div style="display: flex; padding: 15px; border-bottom: 1px solid #e5e7eb; align-items: center;">
      ${
        product.image
          ? `<img src="${product.image}" alt="${product.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 6px; margin-right: 15px;" />`
          : ''
      }
      <div style="flex: 1;">
        <div style="font-weight: 600; margin-bottom: 5px;">${product.name}</div>
        <div style="font-size: 14px; color: #6b7280;">
          Quantity: ${product.quantity}
          ${product.size ? ` • Size: ${product.size}` : ''}
          ${product.color ? ` • Color: ${product.color}` : ''}
        </div>
      </div>
      <div style="font-weight: 600; color: #667eea;">
        $${(product.price * product.quantity).toFixed(2)}
      </div>
    </div>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 28px;">Thank You for Your Order!</h1>
  </div>

  <div style="background: #ffffff; padding: 30px 20px; border: 1px solid #e5e7eb; border-top: none;">
    <p style="font-size: 18px; margin-bottom: 20px;">Hello ${data.customerName},</p>
    <p>Your order has been confirmed and is being processed. You will receive a confirmation email when your order has been shipped.</p>

    <div style="background: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0;">
      <p style="margin: 5px 0;"><strong style="color: #667eea;">Order Number:</strong> ${data.orderNumber}</p>
      <p style="margin: 5px 0;"><strong style="color: #667eea;">Date:</strong> ${data.orderDate}</p>
      ${data.deliveryType ? `<p style="margin: 5px 0;"><strong style="color: #667eea;">Delivery Method:</strong> ${data.deliveryType.charAt(0).toUpperCase() + data.deliveryType.slice(1)}</p>` : ''}
      ${data.deliveryDate ? `<p style="margin: 5px 0;"><strong style="color: #667eea;">Delivery Date:</strong> ${data.deliveryDate}</p>` : ''}
      ${data.deliveryTime ? `<p style="margin: 5px 0;"><strong style="color: #667eea;">Delivery Time:</strong> ${data.deliveryTime}</p>` : ''}
    </div>

    <h2>Order Summary</h2>
    <div style="margin: 20px 0;">
      ${productsHTML}
    </div>

    <div style="margin: 20px 0; padding: 15px; background: #f9fafb; border-radius: 6px;">
      <div style="display: flex; justify-content: space-between; padding: 8px 0;">
        <span>Subtotal:</span>
        <span>$${data.subtotal.toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 8px 0;">
        <span>Shipping:</span>
        <span>$${data.shipping.toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 8px 0;">
        <span>Fees:</span>
        <span>$${(data.processingFee || 0).toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; border-top: 2px solid #667eea; padding-top: 15px; margin-top: 10px; color: #667eea;">
        <span>Total:</span>
        <span>$${data.total.toFixed(2)}</span>
      </div>
    </div>

    <div style="background: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #667eea;">Shipping Address</h3>
      <p style="margin: 5px 0;">${data.shippingAddress.street}</p>
      ${(data.shippingAddress.city || data.shippingAddress.state || data.shippingAddress.zipCode) ? `<p style="margin: 5px 0;">${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zipCode}</p>` : ''}
      <p style="margin: 5px 0;">${data.shippingAddress.country}</p>
    </div>

    ${data.specialMessage ? `
    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #92400e;">Special Instructions</h3>
      <p style="margin: 5px 0;">${data.specialMessage}</p>
    </div>` : ''}

    <center>
      <a href="https://blissbbakery.com" style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
        Continue Shopping
      </a>
    </center>

    <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
      If you have any questions about your order, please don't hesitate to contact us.
    </p>
  </div>

  <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; margin-top: 20px;">
    <p>© ${new Date().getFullYear()} Bliss-B Desserts. All rights reserved.</p>
    <p>This is an automated email, please do not reply to this message.</p>
  </div>
</body>
</html>
  `;
}

export function generateAdminOrderHTML(data: {
  orderNumber: string;
  orderDate: string;
  customerName: string;
  customerEmail: string;
  products: Product[];
  subtotal: number;
  shipping: number;
  processingFee?: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentId: string;
  deliveryType?: string;
  deliveryDate?: string;
  deliveryTime?: string;
  specialMessage?: string;
}) {
  const productsHTML = data.products
    .map(
      (product) => `
    <div style="display: flex; padding: 15px; background: white; border-radius: 6px; margin-bottom: 10px; align-items: center;">
      ${
        product.image
          ? `<img src="${product.image}" alt="${product.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px; margin-right: 15px;" />`
          : ''
      }
      <div style="flex: 1;">
        <div style="font-weight: 600; margin-bottom: 5px;">${product.name}</div>
        <div style="font-size: 13px; color: #6b7280;">
          <strong>Quantity:</strong> ${product.quantity}
          ${product.size ? ` • Size: ${product.size}` : ''}
          ${product.color ? ` • Color: ${product.color}` : ''}
        </div>
        <div style="font-size: 13px; color: #6b7280;">
          Unit price: $${product.price.toFixed(2)}
        </div>
      </div>
      <div style="font-weight: 600; color: #10b981; font-size: 16px;">
        $${(product.price * product.quantity).toFixed(2)}
      </div>
    </div>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 700px; margin: 0 auto; padding: 20px; background: #f3f4f6;">
  <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 28px;">🛍️ New Order Received</h1>
    <p style="margin: 10px 0 0 0; font-size: 16px;">Order #${data.orderNumber}</p>
  </div>

  <div style="background: #ffffff; padding: 30px 20px; border: 1px solid #e5e7eb; border-top: none;">
    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <strong>⚡ Action Required:</strong> New order received and confirmed. Proceed with preparation and shipping process.
    </div>

    ${data.specialMessage ? `
    <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <strong style="color: #b91c1c;">📝 Special Instructions from customer:</strong>
      <p style="margin: 8px 0 0 0; color: #7f1d1d;">${data.specialMessage}</p>
    </div>` : ''}

    <div style="margin: 25px 0; padding: 20px; background: #f9fafb; border-radius: 6px;">
      <h2 style="margin-top: 0; color: #10b981; font-size: 18px; border-bottom: 2px solid #10b981; padding-bottom: 10px;">📋 Order Information</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px; background: white; border-radius: 4px; margin: 5px;"><strong>Order Number:</strong> ${data.orderNumber}</td>
          <td style="padding: 10px; background: white; border-radius: 4px; margin: 5px;"><strong>Date:</strong> ${data.orderDate}</td>
        </tr>
        <tr>
          <td style="padding: 10px; background: white; border-radius: 4px; margin: 5px;"><strong>Status:</strong> <span style="background: #10b981; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px;">Confirmed</span></td>
          <td style="padding: 10px; background: white; border-radius: 4px; margin: 5px;"><strong>Payment:</strong> ${data.paymentMethod}</td>
        </tr>
      </table>
      <div style="padding: 10px; background: white; border-radius: 4px; margin-top: 15px;">
        <strong>Payment ID:</strong> <span style="font-family: monospace; font-size: 13px;">${data.paymentId}</span>
      </div>
      ${data.deliveryType || data.deliveryDate ? `
      <div style="padding: 10px; background: white; border-radius: 4px; margin-top: 15px;">
        ${data.deliveryType ? `<p style="margin: 4px 0;"><strong>Delivery Method:</strong> ${data.deliveryType.charAt(0).toUpperCase() + data.deliveryType.slice(1)}</p>` : ''}
        ${data.deliveryDate ? `<p style="margin: 4px 0;"><strong>Requested Delivery Date:</strong> ${data.deliveryDate}</p>` : ''}
        ${data.deliveryTime ? `<p style="margin: 4px 0;"><strong>Requested Delivery Time:</strong> ${data.deliveryTime}</p>` : ''}
      </div>` : ''}
    </div>

    <div style="margin: 25px 0; padding: 20px; background: #f9fafb; border-radius: 6px;">
      <h2 style="margin-top: 0; color: #10b981; font-size: 18px; border-bottom: 2px solid #10b981; padding-bottom: 10px;">👤 Customer Information</h2>
      <p><strong>Name:</strong> ${data.customerName}</p>
      <p><strong>Email:</strong> ${data.customerEmail}</p>
    </div>

    <div style="margin: 25px 0; padding: 20px; background: #f9fafb; border-radius: 6px;">
      <h2 style="margin-top: 0; color: #10b981; font-size: 18px; border-bottom: 2px solid #10b981; padding-bottom: 10px;">📦 Products (${data.products.length})</h2>
      ${productsHTML}
    </div>

    <div style="margin: 25px 0; padding: 20px; background: #f9fafb; border-radius: 6px;">
      <h2 style="margin-top: 0; color: #10b981; font-size: 18px; border-bottom: 2px solid #10b981; padding-bottom: 10px;">💰 Payment Summary</h2>
      <div style="display: flex; justify-content: space-between; padding: 10px 0; font-size: 15px;">
        <span>Subtotal:</span>
        <span>$${data.subtotal.toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 10px 0; font-size: 15px;">
        <span>Shipping:</span>
        <span>$${data.shipping.toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 10px 0; font-size: 15px;">
        <span>Fees:</span>
        <span>$${(data.processingFee || 0).toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 20px; border-top: 2px solid #10b981; padding-top: 15px; margin-top: 10px; color: #10b981;">
        <span>Total Paid:</span>
        <span>$${data.total.toFixed(2)}</span>
      </div>
    </div>

    <div style="margin: 25px 0; padding: 20px; background: #f9fafb; border-radius: 6px;">
      <h2 style="margin-top: 0; color: #10b981; font-size: 18px; border-bottom: 2px solid #10b981; padding-bottom: 10px;">🚚 Shipping Address</h2>
      <div style="background: white; padding: 15px; border-radius: 6px;">
        <p style="margin: 5px 0; font-weight: 600; font-size: 15px;">${data.customerName}</p>
        <p style="margin: 5px 0;">${data.shippingAddress.street}</p>
        ${(data.shippingAddress.city || data.shippingAddress.state || data.shippingAddress.zipCode) ? `<p style="margin: 5px 0;">${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zipCode}</p>` : ''}
        <p style="margin: 5px 0;">${data.shippingAddress.country}</p>
        ${data.shippingAddress.phone ? `<p style="margin: 5px 0;"><strong>Phone:</strong> ${data.shippingAddress.phone}</p>` : ''}
      </div>
    </div>

    <div style="background: #ecfdf5; padding: 20px; border-radius: 6px; margin-top: 20px;">
      <p style="margin: 0; font-size: 14px; color: #047857;"><strong>Next Steps:</strong></p>
      <ol style="margin: 10px 0; padding-left: 20px; color: #065f46;">
        <li>Verify product availability in inventory</li>
        <li>Prepare package for shipping</li>
        <li>Generate shipping label</li>
        <li>Notify customer with tracking number</li>
      </ol>
    </div>
  </div>

  <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 13px; background: white; border-top: 1px solid #e5e7eb;">
    <p>© ${new Date().getFullYear()} Bliss-B Desserts Admin Panel</p>
    <p>This is an automated email generated by the order system.</p>
  </div>
</body>
</html>
  `;
}
