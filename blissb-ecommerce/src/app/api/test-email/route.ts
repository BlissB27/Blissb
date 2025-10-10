import { NextResponse } from 'next/server';
import { sendOrderEmails } from '@/lib/email';

export async function GET() {
  try {
    // Datos de prueba
    const testData = {
      customerName: 'Test Customer',
      customerEmail: 'blissbdesserts@gmail.com', // Cambia esto por tu email para recibir la prueba
      orderNumber: 'TEST-12345678',
      orderDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      products: [
        {
          id: 1,
          name: 'Chocolate Chip Cookie',
          price: 3.99,
          quantity: 2,
          image: 'https://via.placeholder.com/150',
          size: 'Large',
        },
        {
          id: 2,
          name: 'Red Velvet Cake',
          price: 25.99,
          quantity: 1,
          image: 'https://via.placeholder.com/150',
        },
      ],
      subtotal: 33.97,
      shipping: 5.00,
      total: 38.97,
      shippingAddress: {
        street: '123 Main Street',
        city: 'Atlanta',
        state: 'GA',
        zipCode: '30301',
        country: 'US',
        phone: '555-1234',
      },
      paymentMethod: 'Stripe',
      paymentId: 'pi_test_1234567890',
    };

    console.log('🧪 Testing email with data:', testData);

    // Enviar correos
    const result = await sendOrderEmails(testData);

    console.log('📧 Email results:', result);

    return NextResponse.json({
      success: true,
      message: 'Test emails sent!',
      results: {
        customer: result.customer.success ? 'Sent ✅' : `Failed: ${result.customer.error}`,
        admin: result.admin.success ? 'Sent ✅' : `Failed: ${result.admin.error}`,
      },
      details: result,
    });
  } catch (error) {
    console.error('❌ Test email error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error,
      },
      { status: 500 }
    );
  }
}
