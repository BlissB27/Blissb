import { getHomeOccasions } from "@/services/homeOccasions";
import { BannerCards } from "@/components/BannerCards";
import { DEFAULT_OCCASIONS, type Occasion } from "@/components/bannerData";

// Server component: baja de Strapi los overrides editables (título, texto,
// imagen) y los mezcla sobre los valores por defecto de marca. Si Strapi está
// vacío o no responde, cada tarjeta cae a su contenido por defecto — la sección
// nunca se rompe.
export default async function Banner() {
  let overrides: Record<string, { title?: string; description?: string; image?: string; imageAlt?: string }> = {};
  try {
    overrides = await getHomeOccasions();
  } catch {
    overrides = {};
  }

  const occasions: Occasion[] = DEFAULT_OCCASIONS.map((base) => {
    const o = overrides[base.key] || {};
    return {
      ...base,
      title: o.title || base.title,
      description: o.description || base.description,
      imageSrc: o.image || base.imageSrc,
      imageAlt: o.imageAlt || base.title,
    };
  });

  return <BannerCards occasions={occasions} />;
}
