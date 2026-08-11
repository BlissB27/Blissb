import { getAwardPhotos } from "@/services/awardPhotos";
import { AwardsView } from "@/components/AwardsView";
import { DEFAULT_AWARD_PHOTOS, type AwardPhotoView } from "@/components/awardsData";

// Server component: baja las 4 fotos de premios de Strapi (ordenadas por
// `order`) y llena por índice los 4 huecos de la sección. Cualquier hueco sin
// foto en Strapi cae a la imagen local por defecto, así la sección nunca queda
// incompleta ni se rompe si el content-type está vacío o no responde.
export async function Awards() {
  let fetched: Awaited<ReturnType<typeof getAwardPhotos>> = [];
  try {
    fetched = await getAwardPhotos();
  } catch {
    fetched = [];
  }

  const photos: AwardPhotoView[] = [0, 1, 2, 3].map((i) => {
    const f = fetched[i];
    if (!f) return DEFAULT_AWARD_PHOTOS[i];
    return {
      src: f.src,
      alt: f.alt || DEFAULT_AWARD_PHOTOS[i].alt,
      width: f.width,
      height: f.height,
    };
  });

  return <AwardsView photos={photos} />;
}
