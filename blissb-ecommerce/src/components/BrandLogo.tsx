'use client';

import Image from 'next/image';
import { useSeasonalTheme } from '@/hooks/useSeasonalTheme';

const FALLBACK = { main: '/img/logobb.png', white: '/img/logo-white.png' } as const;

// Logo de marca que respeta el preset estacional activo (site-setting.activeTheme).
// Si el preset trae un logo propio lo usa; si no, cae al logo por defecto. Es un
// client component para poder leer el tema, pero se puede renderizar dentro de
// componentes server (Footer, CheckoutHeader).
export function BrandLogo({
  variant = 'main',
  width,
  height,
  alt,
  className,
  style,
  priority,
}: {
  variant?: 'main' | 'white';
  width: number;
  height: number;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
}) {
  const { theme } = useSeasonalTheme();
  const themed = variant === 'white' ? theme?.logoWhiteUrl : theme?.logoUrl;
  const src = themed || FALLBACK[variant];

  return (
    <Image src={src} width={width} height={height} alt={alt} className={className} style={style} priority={priority} />
  );
}
