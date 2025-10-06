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

interface AdminOrderNotificationEmailProps {
  orderNumber: string;
  orderDate: string;
  customerName: string;
  customerEmail: string;
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
    phone?: string;
  };
  paymentMethod: string;
  paymentId: string;
}

export const AdminOrderNotificationEmail = ({
  orderNumber,
  orderDate,
  customerName,
  customerEmail,
  products,
  subtotal,
  shipping,
  total,
  shippingAddress,
  paymentMethod,
  paymentId,
}: AdminOrderNotificationEmailProps) => {
  return (
    <html>
      <head>
        <style>{`
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
            background: #f3f4f6;
          }
          .header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .alert {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .content {
            background: #ffffff;
            padding: 30px 20px;
            border: 1px solid #e5e7eb;
            border-top: none;
          }
          .section {
            margin: 25px 0;
            padding: 20px;
            background: #f9fafb;
            border-radius: 6px;
          }
          .section h2 {
            margin-top: 0;
            color: #10b981;
            font-size: 18px;
            border-bottom: 2px solid #10b981;
            padding-bottom: 10px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 15px 0;
          }
          .info-item {
            padding: 10px;
            background: white;
            border-radius: 4px;
          }
          .info-item label {
            display: block;
            font-size: 12px;
            color: #6b7280;
            text-transform: uppercase;
            margin-bottom: 5px;
            font-weight: 600;
          }
          .info-item > div {
            display: block;
            font-size: 15px;
            color: #111827;
            font-weight: 500;
          }
          .product-list {
            margin: 20px 0;
          }
          .product-item {
            display: flex;
            padding: 15px;
            background: white;
            border-radius: 6px;
            margin-bottom: 10px;
            align-items: center;
          }
          .product-image {
            width: 60px;
            height: 60px;
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
            font-size: 13px;
            color: #6b7280;
          }
          .product-price {
            font-weight: 600;
            color: #10b981;
            font-size: 16px;
          }
          .totals {
            margin: 20px 0;
            padding: 20px;
            background: white;
            border-radius: 6px;
          }
          .totals-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            font-size: 15px;
          }
          .totals-row.total {
            font-weight: bold;
            font-size: 20px;
            border-top: 2px solid #10b981;
            padding-top: 15px;
            margin-top: 10px;
            color: #10b981;
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #6b7280;
            font-size: 13px;
            background: white;
            border-top: 1px solid #e5e7eb;
          }
          .badge {
            display: inline-block;
            background: #10b981;
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
          }
        `}</style>
      </head>
      <body>
        <div className="header">
          <h1>🛍️ New Order Received</h1>
          <p style={{ margin: '10px 0 0 0', fontSize: '16px' }}>
            Order #{orderNumber}
          </p>
        </div>
        <div className="content">
          <div className="alert">
            <strong>⚡ Action Required:</strong> New order received and confirmed. Proceed with preparation and shipping process.
          </div>

          <div className="section">
            <h2>📋 Order Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Order Number</label>
                <div>{orderNumber}</div>
              </div>
              <div className="info-item">
                <label>Date</label>
                <div>{orderDate}</div>
              </div>
              <div className="info-item">
                <label>Status</label>
                <div><span className="badge">Confirmed</span></div>
              </div>
              <div className="info-item">
                <label>Payment Method</label>
                <div>{paymentMethod}</div>
              </div>
            </div>
            <div className="info-item" style={{ marginTop: '15px' }}>
              <label>Payment ID (Stripe)</label>
              <div style={{ fontFamily: 'monospace', fontSize: '13px' }}>{paymentId}</div>
            </div>
          </div>

          <div className="section">
            <h2>👤 Customer Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Name</label>
                <div>{customerName}</div>
              </div>
              <div className="info-item">
                <label>Email</label>
                <div>{customerEmail}</div>
              </div>
            </div>
          </div>

          <div className="section">
            <h2>📦 Products ({products.length})</h2>
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
                      <strong>Quantity:</strong> {product.quantity}
                      {product.size && ` • Size: ${product.size}`}
                      {product.color && ` • Color: ${product.color}`}
                    </div>
                    <div className="product-meta">
                      Unit price: ${product.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="product-price">
                    ${(product.price * product.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="section">
            <h2>💰 Payment Summary</h2>
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
                <span>Total Paid:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="section">
            <h2>🚚 Shipping Address</h2>
            <div style={{ background: 'white', padding: '15px', borderRadius: '6px' }}>
              <p style={{ margin: '5px 0', fontWeight: '600', fontSize: '15px' }}>
                {customerName}
              </p>
              <p style={{ margin: '5px 0' }}>{shippingAddress.street}</p>
              <p style={{ margin: '5px 0' }}>
                {shippingAddress.city}, {shippingAddress.state}{' '}
                {shippingAddress.zipCode}
              </p>
              <p style={{ margin: '5px 0' }}>{shippingAddress.country}</p>
              {shippingAddress.phone && (
                <p style={{ margin: '5px 0' }}>
                  <strong>Phone:</strong> {shippingAddress.phone}
                </p>
              )}
            </div>
          </div>

          <div style={{ background: '#ecfdf5', padding: '20px', borderRadius: '6px', marginTop: '20px' }}>
            <p style={{ margin: '0', fontSize: '14px', color: '#047857' }}>
              <strong>Next Steps:</strong>
            </p>
            <ol style={{ margin: '10px 0', paddingLeft: '20px', color: '#065f46' }}>
              <li>Verify product availability in inventory</li>
              <li>Prepare package for shipping</li>
              <li>Generate shipping label</li>
              <li>Notify customer with tracking number</li>
            </ol>
          </div>
        </div>
        <div className="footer">
          <p>© 2025 Blissb Bakery Admin Panel</p>
          <p>This is an automated email generated by the order system.</p>
        </div>
      </body>
    </html>
  );
};

export default AdminOrderNotificationEmail;
