const PLACEHOLDER_IMAGE = '/img/placeholder.jpg';

export function getProductImageSrc(image?: string | null): string {
  if (!image) return PLACEHOLDER_IMAGE;

  if (image.startsWith('data:') || image.startsWith('/')) {
    return image;
  }

  try {
    const url = new URL(image);

    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
      const strapiBaseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
      return strapiBaseUrl ? `${strapiBaseUrl}${url.pathname}` : PLACEHOLDER_IMAGE;
    }

    return url.toString();
  } catch {
    return PLACEHOLDER_IMAGE;
  }
}
