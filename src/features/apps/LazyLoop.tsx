'use client';

import { useEffect, useRef } from 'react';

/**
 * Беззвучный луп интерфейса. Грузится и играет, только когда виден в окне;
 * при prefers-reduced-motion остаётся на постере.
 */
export function LazyLoop({
  src,
  poster,
  label,
  width,
  height,
}: {
  src: string;
  poster: string;
  label: string;
  width?: number;
  height?: number;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          if (!v.src) v.src = src;
          void v.play().catch(() => {});
        } else v.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      width={width}
      height={height}
    />
  );
}
