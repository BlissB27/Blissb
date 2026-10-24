const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

// Strapi Cloud cobra por request y el sitio tiene poco tráfico: con una caché
// corta casi cada visita (sobre todo bots) llegaba con la caché vencida y volvía
// a pedir todo. Cacheamos 1h y Strapi avisa por webhook (/api/revalidate) cuando
// la clienta publica algo, así los cambios se ven al instante igual.
export const STRAPI_CACHE_TAG = 'strapi';
const STRAPI_REVALIDATE_SECONDS = 3600;

// Carries the HTTP status so callers can tell "not found" (expected, e.g. a
// product lookup miss) apart from a genuine failure worth logging.
export class StrapiRequestError extends Error {
  status: number;
  constructor(status: number, statusText: string) {
    super(`Strapi API error: ${status} ${statusText}`);
    this.name = 'StrapiRequestError';
    this.status = status;
  }
}

export function isStrapiNotFound(error: unknown): boolean {
  return error instanceof StrapiRequestError && error.status === 404;
}

function getStrapiApiUrl() {
  const serverUrl = typeof window === 'undefined' ? process.env.STRAPI_API_URL : undefined;
  const publicUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const baseUrl = serverUrl || (publicUrl ? `${publicUrl}/api` : '');

  if (!baseUrl) {
    throw new Error(
      'Missing Strapi URL. Set NEXT_PUBLIC_STRAPI_URL in blissb-ecommerce/.env and restart the Next dev server.'
    );
  }

  return baseUrl.replace(/\/$/, '');
}

// Helper function for Strapi API requests
async function strapiRequest(path: string, options: RequestInit = {}) {
  const strapiUrl = getStrapiApiUrl();
  const url = `${strapiUrl}${path}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };

  // Add authorization token if available
  if (typeof window === 'undefined' && STRAPI_TOKEN) {
    headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`;
  }

  const isGet = options.method === 'GET' || !options.method;
  const response = await fetch(url, {
    ...options,
    headers,
    // GETs se cachean salvo que el caller pida datos frescos (cache: 'no-store')
    next: isGet && !options.cache
      ? { revalidate: STRAPI_REVALIDATE_SECONDS, tags: [STRAPI_CACHE_TAG] }
      : undefined,
  }).catch((error) => {
    console.error('Strapi request failed:', error);
    throw error;
  });

  if (!response.ok) {
    // 404 just means "not found" (product/category lookup miss) — a routine
    // outcome across many callers, not an application error worth logging.
    if (response.status !== 404) {
      const errorText = await response.text();
      console.error(`Strapi API error (${response.status}) for ${path}: ${errorText}`);
    }
    throw new StrapiRequestError(response.status, response.statusText);
  }

  return await response.json();
}

// GET request helper. `fresh: true` salta la caché — para lecturas que deben
// reflejar el estado real al momento (stock antes de descontar, cupón ya usado).
export async function strapiGet(
  path: string,
  params?: Record<string, string>,
  { fresh = false }: { fresh?: boolean } = {}
) {
  const searchParams = params ? new URLSearchParams(params).toString() : '';
  const url = searchParams ? `${path}?${searchParams}` : path;

  return strapiRequest(url, fresh ? { cache: 'no-store' } : {});
}

// POST request helper
export async function strapiPost(path: string, data: any) {
  return strapiRequest(path, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// PUT request helper
export async function strapiPut(path: string, data: any) {
  return strapiRequest(path, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// Helper to get full media URL
export function getStrapiMediaUrl(url: string | null): string {
  if (!url) return '';

  // If it's already a full URL, return as is
  if (url.startsWith('http')) return url;

  // Otherwise, prepend the Strapi base URL
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  return `${baseUrl}${url}`;
}
