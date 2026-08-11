import { NextRequest, NextResponse } from 'next/server';
import { strapiPost } from '@/lib/strapi';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validar email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Guardar en Strapi para que sea visible en el admin (best-effort, no bloquea MailerLite)
    try {
      await strapiPost('/subscribers', { data: { email } });
    } catch (strapiError) {
      console.error('Failed to save subscriber to Strapi:', strapiError);
    }

    const apiToken = process.env.MAILERLITE_API_TOKEN;

    if (!apiToken) {
      console.error('MAILERLITE_API_TOKEN is not configured');
      return NextResponse.json(
        { error: 'Newsletter service is not configured' },
        { status: 500 }
      );
    }

    // Asignar el suscriptor a un grupo dispara la automatización de bienvenida
    // (email con el código de descuento) configurada en MailerLite. Si la
    // variable no está definida, el alta sigue funcionando sin grupo.
    const groupId = process.env.MAILERLITE_GROUP_ID;

    // Llamar a la API de MailerLite
    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`,
      },
      body: JSON.stringify({
        email: email,
        status: 'active',
        ...(groupId ? { groups: [groupId] } : {}),
      }),
    });

    const data = await response.json();

    // MailerLite retorna 201 si es nuevo, 200 si ya existe
    if (response.status === 201 || response.status === 200) {
      return NextResponse.json(
        {
          success: true,
          message: response.status === 201
            ? 'Successfully subscribed to newsletter!'
            : 'You are already subscribed!',
          data: data.data,
        },
        { status: 200 }
      );
    }

    // Si hay error de validación de MailerLite
    if (response.status === 422) {
      return NextResponse.json(
        {
          error: 'Invalid email address',
          details: data.errors,
        },
        { status: 422 }
      );
    }

    // Otros errores
    console.error('MailerLite API error:', data);
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: response.status }
    );

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
