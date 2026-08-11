// Datos compartidos entre el server component `Banner` (que hace fetch a Strapi)
// y el client component `BannerCards` (presentacional). Vive en un módulo plano
// —sin "use client"— porque un server component no puede importar un VALOR desde
// un módulo cliente (llegaría como referencia de cliente, no como el array real).

export type Occasion = {
  /** Clave estable que enlaza con el content-type `home-occasion` de Strapi. */
  key: "events" | "corporate-gifts" | "catering";
  title: string;
  description: string;
  imageSrc: string;
  imageAlt?: string;
  href?: string;
  ctaLabel: string;
  /** Color del panel de texto (lado sólido) */
  panelBg: string;
  panelText?: string;
  /** Foco de la imagen por si el asset tiene margen interno */
  objectPosition?: string; // ej. "center" | "center top" | "left center"
};

// Título, texto e imagen se editan desde Strapi (home-occasion). El resto
// (enlace, etiqueta del botón, color del panel) son constantes de marca que
// viven en el código; estos valores por defecto se usan tal cual cuando Strapi
// no tiene datos todavía.
export const DEFAULT_OCCASIONS: Occasion[] = [
  {
    key: "events",
    title: "Events",
    description:
      "Bliss-B travels to you. Our cookie and cake carts bring a full dessert experience to your event, served fresh from start to finish.",
    imageSrc: "/img/carrito.jpeg",
    href: "/corporate?section=cookie-cart",
    ctaLabel: "Book Our Cart",
    panelBg: "#9B562C",
    objectPosition: "center",
  },
  {
    key: "corporate-gifts",
    title: "Corporate Gifts",
    description:
      "Share Bliss-B with clients and teams. Each cookie carries your logo, packaged fresh in a clean, ready-to-share box.",
    imageSrc: "/img/corporate.jpeg",
    href: "/corporate?section=corporate-gifting",
    ctaLabel: "Get a Quote",
    panelBg: "#7A4522",
    objectPosition: "center",
  },
  {
    key: "catering",
    title: "Catering",
    description:
      "Cookies, brownies, and more, in the quantities your event calls for. Perfect for weddings, parties, and gatherings.",
    imageSrc: "/img/caterine.jpeg",
    href: "/corporate?section=catering",
    ctaLabel: "See Catering Options",
    panelBg: "#9B562C",
    objectPosition: "center",
  },
];
