import { NextResponse } from 'next/server';
import { getBlockedDates } from '@/services/blockedDates';

// El calendario de fulfillment se calcula en el cliente (DeliverySelector /
// checkout), pero las fechas bloqueadas viven en Strapi y se leen con token
// server-side. Este endpoint las expone (solo las fechas, nada sensible).
export async function GET() {
  const dates = await getBlockedDates();
  return NextResponse.json({ dates });
}
