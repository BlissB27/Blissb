import { strapiGet } from '@/lib/strapi';

export type Announcement = { label: string; href: string };
export type DiscountModalConfig = {
  enabled: boolean;
  percentOff: number;
  title: string;
  subtitle: string;
};
export type SiteSettings = {
  announcements: Announcement[];
  discountModal: DiscountModalConfig | null;
};

// Single-type editable desde Strapi (cintillo + modal de descuento). Si el
// content-type no existe o Strapi falla, devuelve vacío y el front usa sus
// valores por defecto hardcodeados.
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const res: any = await strapiGet('/site-setting', { populate: '*' });
    const d = res?.data;
    if (!d) return { announcements: [], discountModal: null };

    const announcements: Announcement[] = (d.announcements || [])
      .filter((a: any) => a?.label && a?.href)
      .map((a: any) => ({ label: a.label, href: a.href }));

    const dm = d.discountModal;
    const discountModal: DiscountModalConfig | null = dm
      ? {
          enabled: dm.enabled !== false,
          percentOff: Number(dm.percentOff) || 0,
          title: dm.title || '',
          subtitle: dm.subtitle || '',
        }
      : null;

    return { announcements, discountModal };
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return { announcements: [], discountModal: null };
  }
}
