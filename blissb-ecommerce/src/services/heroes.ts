import { strapiGet, getStrapiMediaUrl } from '@/lib/strapi';

export type HeroKey = 'cookies' | 'cakes' | 'desserts' | 'corporate';

export type HeroConfig = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  image?: string;
  featuredProductSlug?: string;
};

// Configuración editable del hero de una categoría (textos, foto, producto
// destacado). Devuelve null si no hay entrada en Strapi para esa sección, y
// cada hero cae a sus valores hardcodeados.
export async function getHero(key: HeroKey): Promise<HeroConfig | null> {
  try {
    const res: any = await strapiGet('/heroes', {
      'filters[key][$eq]': key,
      'populate[image]': 'true',
      'populate[featuredProduct]': 'true',
    });
    const d = Array.isArray(res?.data) ? res.data[0] : undefined;
    if (!d) return null;

    return {
      eyebrow: d.eyebrow || undefined,
      title: d.title || undefined,
      subtitle: d.subtitle || undefined,
      image: d.image?.url ? getStrapiMediaUrl(d.image.url) : undefined,
      // featuredProduct es una relación a Product (selector en el admin); se
      // deriva su slug para que la página de cookies busque ese producto.
      featuredProductSlug: d.featuredProduct?.slug || undefined,
    };
  } catch (error) {
    console.error(`Error fetching hero "${key}":`, error);
    return null;
  }
}
