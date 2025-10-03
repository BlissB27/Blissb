const STRAPI_URL = process.env.STRAPI_API_URL || process.env.NEXT_PUBLIC_STRAPI_URL + '/api';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

// Helper function for Strapi API requests
async function strapiRequest(path: string, options: RequestInit = {}) {
  const url = `${STRAPI_URL}${path}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add authorization token if available
  if (STRAPI_TOKEN) {
    headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      // Enable caching for GET requests
      next: options.method === 'GET' || !options.method ? { revalidate: 60 } : undefined,
    });

    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Strapi request failed:', error);
    throw error;
  }
}

// GET request helper
export async function strapiGet(path: string, params?: Record<string, string>) {
  const searchParams = params ? new URLSearchParams(params).toString() : '';
  const url = searchParams ? `${path}?${searchParams}` : path;

  return strapiRequest(url);
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