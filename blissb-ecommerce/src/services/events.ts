import { strapiGet, getStrapiMediaUrl } from '@/lib/strapi';

export type EventItem = {
  id: string;
  title: string;
  info: string;
  flyer: string;
  date?: string;
  location?: string;
};

// populate=* no baja el archivo de media anidado en Strapi v5; el flyer se pide explícito.
const EVENT_POPULATE = {
  'populate[flyer]': 'true',
  'sort': 'date:asc',
};

function transformEvent(e: any): EventItem {
  return {
    id: e.documentId || String(e.id),
    title: e.title || '',
    info: e.info || '',
    flyer: getStrapiMediaUrl(e.flyer?.url || ''),
    date: e.date || undefined,
    location: e.location || undefined,
  };
}

// Todos los eventos publicados. Si Strapi está vacío o el content-type aún no
// existe (no desplegado), devuelve [] y la web simplemente no muestra eventos.
export async function getAllEvents(): Promise<EventItem[]> {
  try {
    const res: any = await strapiGet('/events', EVENT_POPULATE);
    return (res?.data || []).map(transformEvent);
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

// Próximos eventos para el preview del home. Los que no tienen fecha se tratan
// como vigentes; si no hay ninguno "futuro", cae a los primeros disponibles.
export async function getUpcomingEvents(limit = 3): Promise<EventItem[]> {
  const all = await getAllEvents();
  const now = Date.now();
  const upcoming = all.filter((e) => !e.date || new Date(e.date).getTime() >= now);
  return (upcoming.length > 0 ? upcoming : all).slice(0, limit);
}
