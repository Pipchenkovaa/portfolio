const W = '/wallpaper';
const DESKTOP_WIDTHS = [1280, 1600, 2048];

/** Фото на обоях. Портретный кроп для телефона, AVIF → WebP → JPEG; это LCP-картинка, грузим сразу. */
export function Wallpaper() {
  return (
    <div className="wallpaper" aria-hidden="true">
      <picture>
        <source
          media="(max-width: 720px)"
          type="image/avif"
          srcSet={`${W}/mobile-640.avif 640w, ${W}/mobile-900.avif 900w`}
          sizes="100vw"
        />
        <source
          media="(max-width: 720px)"
          type="image/webp"
          srcSet={`${W}/mobile-640.webp 640w, ${W}/mobile-900.webp 900w`}
          sizes="100vw"
        />
        <source
          type="image/avif"
          srcSet={DESKTOP_WIDTHS.map((w) => `${W}/desktop-${w}.avif ${w}w`).join(', ')}
          sizes="100vw"
        />
        <source
          type="image/webp"
          srcSet={DESKTOP_WIDTHS.map((w) => `${W}/desktop-${w}.webp ${w}w`).join(', ')}
          sizes="100vw"
        />
        <img src={`${W}/desktop-1600.jpg`} alt="" fetchPriority="high" decoding="async" />
      </picture>
    </div>
  );
}
