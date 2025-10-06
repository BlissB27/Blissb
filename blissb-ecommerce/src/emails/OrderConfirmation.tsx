import * as React from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  color?: string;
}

interface OrderConfirmationEmailProps {
  customerName: string;
  orderNumber: string;
  orderDate: string;
  products: Product[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export const OrderConfirmationEmail = ({
  customerName,
  orderNumber,
  orderDate,
  products,
  subtotal,
  shipping,
  total,
  shippingAddress,
}: OrderConfirmationEmailProps) => {
  return (
    <html>
      <head>
        <style>{`
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .content {
            background: #ffffff;
            padding: 30px 20px;
            border: 1px solid #e5e7eb;
            border-top: none;
          }
          .greeting {
            font-size: 18px;
            margin-bottom: 20px;
          }
          .order-info {
            background: #f9fafb;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
          }
          .order-info p {
            margin: 5px 0;
          }
          .order-info strong {
            color: #667eea;
          }
          .product-list {
            margin: 20px 0;
          }
          .product-item {
            display: flex;
            padding: 15px;
            border-bottom: 1px solid #e5e7eb;
            align-items: center;
          }
          .product-item:last-child {
            border-bottom: none;
          }
          .product-image {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 6px;
            margin-right: 15px;
          }
          .product-details {
            flex: 1;
          }
          .product-name {
            font-weight: 600;
            margin-bottom: 5px;
          }
          .product-meta {
            font-size: 14px;
            color: #6b7280;
          }
          .product-price {
            font-weight: 600;
            color: #667eea;
          }
          .totals {
            margin: 20px 0;
            padding: 15px;
            background: #f9fafb;
            border-radius: 6px;
          }
          .totals-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
          }
          .totals-row.total {
            font-weight: bold;
            font-size: 18px;
            border-top: 2px solid #667eea;
            padding-top: 15px;
            margin-top: 10px;
            color: #667eea;
          }
          .shipping-address {
            background: #f9fafb;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
          }
          .shipping-address h3 {
            margin-top: 0;
            color: #667eea;
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #6b7280;
            font-size: 14px;
            border-top: 1px solid #e5e7eb;
            margin-top: 20px;
          }
          .button {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
          }
        `}</style>
      </head>
      <body>
        <div className="header">
          <h1>Thank You for Your Order!</h1>
        </div>
        <div className="content">
          <p className="greeting">Hello {customerName},</p>
          <p>
            Your order has been confirmed and is being processed. You will receive
            a confirmation email when your order has been shipped.
          </p>

          <div className="order-info">
            <p>
              <strong>Order Number:</strong> {orderNumber}
            </p>
            <p>
              <strong>Date:</strong> {orderDate}
            </p>
          </div>

          <h2>Order Summary</h2>
          <div className="product-list">
            {products.map((product) => (
              <div key={product.id} className="product-item">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                  />
                )}
                <div className="product-details">
                  <div className="product-name">{product.name}</div>
                  <div className="product-meta">
                    Quantity: {product.quantity}
                    {product.size && ` • Size: ${product.size}`}
                    {product.color && ` • Color: ${product.color}`}
                  </div>
                </div>
                <div className="product-price">
                  ${(product.price * product.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="totals">
            <div className="totals-row">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="totals-row">
              <span>Shipping:</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="totals-row total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="shipping-address">
            <h3>Shipping Address</h3>
            <p>{shippingAddress.street}</p>
            <p>
              {shippingAddress.city}, {shippingAddress.state}{' '}
              {shippingAddress.zipCode}
            </p>
            <p>{shippingAddress.country}</p>
          </div>

          <center>
            <a href="https://blissbbakery.com" className="button">
              Continue Shopping
            </a>
          </center>

          <p style={{ marginTop: '30px', fontSize: '14px', color: '#6b7280' }}>
            If you have any questions about your order, please don't hesitate to
            contact us.
          </p>
        </div>
        <div className="footer">
          <p>© 2025 Blissb Bakery. All rights reserved.</p>
          <p>This is an automated email, please do not reply to this message.</p>
        </div>
      </body>
    </html>
  );
};

export default OrderConfirmationEmail;
