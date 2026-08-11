import { strapiGet, getStrapiMediaUrl } from '@/lib/strapi';

export type Announcement = { label: string; href: string };
export type DiscountModalConfig = {
  enabled: boolean;
  percentOff: number;
  title: string;
  subtitle: string;
};
export type Decoration = 'none' | 'snowfall' | 'fireworks' | 'autumn-leaves' | 'hearts';
export type SeasonalTheme = {
  key: string;
  name: string;
  logoUrl: string | null;
  logoWhiteUrl: string | null;
  decoration: Decoration;
};
export type SiteSettings = {
  announcements: Announcement[];
  discountModal: DiscountModalConfig | null;
  // Sólo las piezas visuales del preset activo (logo + adornos). El cintillo y el
  // modal ya vienen "resueltos" en announcements/discountModal de arriba.
  theme: SeasonalTheme | null;
};

function mapAnnouncements(list: any): Announcement[] {
  return (list || [])
    .filter((a: any) => a?.label && a?.href)
    .map((a: any) => ({ label: a.label, href: a.href }));
}

function mapDiscountModal(dm: any): DiscountModalConfig | null {
  return dm
    ? {
        enabled: dm.enabled !== false,
        percentOff: Number(dm.percentOff) || 0,
        title: dm.title || '',
        subtitle: dm.subtitle || '',
      }
    : null;
}

// Single-type editable desde Strapi (cintillo + modal de descuento + preset
// estacional activo). Si el content-type no existe o Strapi falla, devuelve vacío
// y el front usa sus valores por defecto hardcodeados.
//
// Preset estacional: si `activeTheme` está seleccionado, sus mensajes de cintillo
// y su modal (si los define) SOBREESCRIBEN a los base — así "resueltos", los
// consumidores actuales no cambian. Si `activeTheme` está vacío, todo cae a los
// valores base/hardcodeados: es el camino de "volver a la web normal".
const EMPTY: SiteSettings = { announcements: [], discountModal: null, theme: null };

function parseSiteSettings(d: any): SiteSettings {
  if (!d) return EMPTY;

  const baseAnnouncements = mapAnnouncements(d.announcements);
  const baseDiscountModal = mapDiscountModal(d.discountModal);

  const t = d.activeTheme;
  if (!t) {
    return { announcements: baseAnnouncements, discountModal: baseDiscountModal, theme: null };
  }

  const themeAnnouncements = mapAnnouncements(t.announcements);
  const themeDiscountModal = mapDiscountModal(t.discountModal);

  return {
    // El preset sólo sobreescribe si realmente trae contenido; si no, deja el base.
    announcements: themeAnnouncements.length ? themeAnnouncements : baseAnnouncements,
    discountModal: themeDiscountModal ?? baseDiscountModal,
    theme: {
      key: t.key || 'custom',
      name: t.name || '',
      logoUrl: t.logo?.url ? getStrapiMediaUrl(t.logo.url) : null,
      logoWhiteUrl: t.logoWhite?.url ? getStrapiMediaUrl(t.logoWhite.url) : null,
      decoration: (t.decoration as Decoration) || 'none',
    },
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  // Populate profundo del preset activo. Mientras `activeTheme` no esté desplegado
  // en este Strapi, la request falla (400 "Invalid key activeTheme"); en ese caso
  // caemos al populate simple para NO romper el cintillo ni el modal existentes.
  try {
    const res: any = await strapiGet('/site-setting', {
      'populate[announcements]': 'true',
      'populate[discountModal]': 'true',
      'populate[activeTheme][populate][logo]': 'true',
      'populate[activeTheme][populate][logoWhite]': 'true',
      'populate[activeTheme][populate][announcements]': 'true',
      'populate[activeTheme][populate][discountModal]': 'true',
    });
    return parseSiteSettings(res?.data);
  } catch {
    try {
      const res: any = await strapiGet('/site-setting', { populate: '*' });
      return parseSiteSettings(res?.data);
    } catch (error) {
      console.error('Error fetching site settings:', error);
      return EMPTY;
    }
  }
}
