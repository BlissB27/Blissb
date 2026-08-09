import { NextResponse } from 'next/server';
import { getSiteSettings } from '@/services/siteSettings';

// El cintillo (Carrusel) y el modal de descuento son client components; leen su
// configuración desde aquí (server-side, con token de Strapi) en vez de exponer
// nada. Si Strapi no responde, devuelven vacío y el front usa sus defaults.
export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}
