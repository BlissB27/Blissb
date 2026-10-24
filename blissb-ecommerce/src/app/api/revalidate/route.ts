import { timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { STRAPI_CACHE_TAG } from '@/lib/strapi';

// Webhook de Strapi (Settings → Webhooks): cuando la clienta crea/edita/publica
// algo, Strapi llama aquí y vaciamos la caché de Strapi para que el cambio se
// vea en la próxima visita, aunque la caché normal dure 1h (ver lib/strapi.ts).
// Strapi manda el secreto en el header `Authorization: Bearer <secreto>`.
function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.STRAPI_WEBHOOK_SECRET;
  if (!secret) return false;

  const received = Buffer.from(request.headers.get('authorization') ?? '');
  const expected = Buffer.from(`Bearer ${secret}`);
  return received.length === expected.length && timingSafeEqual(received, expected);
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // expire: 0 → la próxima visita trae datos nuevos en vez de servir los viejos
  revalidateTag(STRAPI_CACHE_TAG, { expire: 0 });
  return NextResponse.json({ revalidated: true });
}
