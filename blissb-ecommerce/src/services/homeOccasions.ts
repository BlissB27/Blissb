import { strapiGet, getStrapiMediaUrl } from '@/lib/strapi';

export type HomeOccasion = {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
};

const POPULATE = { 'populate[image]': 'true', 'sort': 'order:asc' };

// Devuelve las tarjetas de la sección "Cookies for Every Occasion" del home,
// mapeadas por su `key` (events / corporate-gifts / catering). Si el
// content-type no existe o está vacío, devuelve {} y el Banner usa sus valores
// por defecto.
export async function getHomeOccasions(): Promise<Record<string, HomeOccasion>> {
  try {
    const res: any = await strapiGet('/home-occasions', POPULATE);
    const map: Record<string, HomeOccasion> = {};
    for (const s of res?.data || []) {
      if (!s?.key) continue;
      map[s.key] = {
        title: s.title || undefined,
        description: s.description || undefined,
        image: s.image?.url ? getStrapiMediaUrl(s.image.url) : undefined,
        imageAlt: s.imageAlt || undefined,
      };
    }
    return map;
  } catch (error) {
    console.error('Error fetching home occasions:', error);
    return {};
  }
}
