import { strapiGet, getStrapiMediaUrl } from '@/lib/strapi';

export type AwardPhoto = { src: string; alt: string; width: number; height: number };

// width/height salen del propio archivo subido en Strapi (PhotoSwipe los necesita
// para el zoom del lightbox). populate=* no baja el media anidado, así que se pide
// explícito y se ordena por el campo `order`.
const POPULATE = { 'populate[image]': 'true', 'sort': 'order:asc' };

// Las 4 fotos de la sección de premios (2023/2024) del home, editables desde
// Strapi. Si el content-type no existe o está vacío, devuelve [] y el componente
// Awards usa sus fotos por defecto.
export async function getAwardPhotos(): Promise<AwardPhoto[]> {
  try {
    const res: any = await strapiGet('/award-photos', POPULATE);
    return (res?.data || [])
      .filter((p: any) => p?.image?.url)
      .map((p: any) => ({
        src: getStrapiMediaUrl(p.image.url),
        alt: p.alt || '',
        width: Number(p.image.width) || 1200,
        height: Number(p.image.height) || 1200,
      }));
  } catch (error) {
    console.error('Error fetching award photos:', error);
    return [];
  }
}
