// El cintillo, el modal de descuento y el tema de temporada (logo + adornos)
// leen /api/site-settings. Antes cada uno hacía su propio fetch — varios por
// visita — y cada uno pegaba a Strapi. Compartimos una sola promesa por carga
// de página. Si falla, la soltamos para que un próximo intento pueda reintentar.
let pending: Promise<any> | null = null;

export function fetchSiteSettings(): Promise<any> {
  if (!pending) {
    pending = fetch('/api/site-settings')
      .then((res) => res.json())
      .catch((error) => {
        pending = null;
        throw error;
      });
  }
  return pending;
}
