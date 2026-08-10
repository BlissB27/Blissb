import { strapiGet, getStrapiMediaUrl } from '@/lib/strapi';

export type CorporateSection = {
  title?: string;
  image?: string;
  imageAlt?: string;
  // Contenido del editor de bloques (WYSIWYG) de Strapi; se renderiza con <RichText>.
  body?: unknown[] | null;
};

const POPULATE = { 'populate[image]': 'true' };

// Devuelve las secciones de la página de corporate mapeadas por su `key`
// (catering / gifting / cookie-cart). Si el content-type no existe o está
// vacío, devuelve {} y CorporateContent usa su contenido por defecto.
export async function getCorporateSections(): Promise<Record<string, CorporateSection>> {
  try {
    const res: any = await strapiGet('/corporate-sections', POPULATE);
    const map: Record<string, CorporateSection> = {};
    for (const s of res?.data || []) {
      if (!s?.key) continue;
      map[s.key] = {
        title: s.title || undefined,
        image: s.image?.url ? getStrapiMediaUrl(s.image.url) : undefined,
        imageAlt: s.imageAlt || undefined,
        body: Array.isArray(s.body) && s.body.length > 0 ? s.body : undefined,
      };
    }
    return map;
  } catch (error) {
    console.error('Error fetching corporate sections:', error);
    return {};
  }
}
