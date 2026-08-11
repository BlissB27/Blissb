'use client';

import { useEffect, useState } from 'react';
import type { Decoration } from '@/components/SeasonalDecorations';

// ⚠️ SOLO DEV — simula el preset que activaría la clienta en Strapi Cloud, sin
// desplegar. Poner un adorno aquí es como "activar Navidad en el panel". Fast
// Refresh lo aplica en vivo sobre el sitio real. Volver a `null` = comportamiento
// real (lee el tema activo de Strapi). QUITAR antes del deploy final.
const DEV_PREVIEW: Decoration | null = null;

export type ClientSeasonalTheme = {
  key: string;
  name: string;
  logoUrl: string | null;
  logoWhiteUrl: string | null;
  decoration: Decoration;
};

// Lee el preset estacional ACTIVO desde Strapi (site-setting.activeTheme), vía la
// route /api/site-settings que ya usa el resto del chrome. Es el mismo mecanismo
// de producción: lo que la clienta active en el panel de Strapi Cloud es lo que
// se refleja aquí. Sin tema activo → decoration 'none' y logos null (fallback).
export function useSeasonalTheme(): { theme: ClientSeasonalTheme | null; decoration: Decoration } {
  const [theme, setTheme] = useState<ClientSeasonalTheme | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/site-settings')
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setTheme(d?.theme ?? null);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return { theme, decoration: DEV_PREVIEW ?? theme?.decoration ?? 'none' };
}
