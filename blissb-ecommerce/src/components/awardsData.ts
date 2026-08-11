// Datos compartidos entre el server component `Awards` (fetch a Strapi) y el
// client component `AwardsView` (presentacional con PhotoSwipe). Módulo plano
// —sin "use client"— para que el server component pueda importar el VALOR de los
// defaults (un módulo cliente devolvería una referencia de cliente, no el array).

export type AwardPhotoView = {
  src: string;
  alt: string;
  width: number;
  height: number;
  objectPosition?: string;
};

// Fotos por defecto (las que viven en /public). Se usan cuando Strapi no tiene
// una foto en ese slot todavía. El orden mapea a los 4 huecos de la sección:
// [0]=2024 izquierda, [1]=2024 derecha, [2]=2023 izquierda, [3]=2023 derecha.
export const DEFAULT_AWARD_PHOTOS: AwardPhotoView[] = [
  { src: "/img/Premio/homep1.jpeg", alt: "2024 Award 1", width: 3024, height: 4032 },
  { src: "/img/Premio/homep2.jpeg", alt: "2024 Award 2", width: 2048, height: 2048 },
  { src: "/img/Premio/prime.jpeg", alt: "2023 Award 1", width: 1080, height: 1920, objectPosition: "top" },
  { src: "/img/Premio/homep.jpeg", alt: "2023 Award 2", width: 4032, height: 3024 },
];
