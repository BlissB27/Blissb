import { strapiGet, getStrapiMediaUrl } from '@/lib/strapi';

export type CorporateSectionImage = {
  url: string;
  alt: string;
};

export type CorporateSection = {
  title?: string;
  // El campo "image" en Strapi acepta varias fotos (media multiple) — la
  // dueña puede subir 1 o varias y CorporateContent las apila en la sección.
  images?: CorporateSectionImage[];
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
      const rawImages = Array.isArray(s.image) ? s.image : s.image ? [s.image] : [];
      map[s.key] = {
        title: s.title || undefined,
        images: rawImages
          .filter((img: any) => img?.url)
          .map((img: any) => ({
            url: getStrapiMediaUrl(img.url),
            alt: img.alternativeText || s.imageAlt || s.title || 'Bliss-B',
          })),
        body: Array.isArray(s.body) && s.body.length > 0 ? s.body : undefined,
      };
    }
    return map;
  } catch (error) {
    console.error('Error fetching corporate sections:', error);
    return {};
  }
}
