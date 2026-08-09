import { strapiGet } from '@/lib/strapi';

// Fechas (YYYY-MM-DD) que la dueña marcó como no disponibles para delivery y
// pickup desde Strapi. Si el content-type no existe o Strapi falla, devuelve []
// (la web usa solo las reglas de horario fijas, sin bloqueos).
export async function getBlockedDates(): Promise<string[]> {
  try {
    const res: any = await strapiGet('/blocked-dates', {
      'filters[active][$eq]': 'true',
      'fields[0]': 'date',
      'pagination[pageSize]': '200',
    });
    return (res?.data || [])
      .map((d: any) => d?.date)
      .filter((d: any): d is string => typeof d === 'string');
  } catch (error) {
    console.error('Error fetching blocked dates:', error);
    return [];
  }
}
