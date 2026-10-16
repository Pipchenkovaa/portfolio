const W = '/wallpaper';
const DESKTOP_WIDTHS = [1280, 1920, 2560, 3200];

/** Фото на обоях. Портретный кроп для телефона, AVIF → WebP → JPEG; это LCP-картинка, грузим сразу. */
export function Wallpaper() {
  return (
    <div className="wallpaper" aria-hidden="true">
      <picture>
        <source
          media="(max-width: 720px)"
          type="image/avif"
          srcSet={`${W}/mobile-780.avif 780w, ${W}/mobile-1170.avif 1170w`}
          sizes="100vw"
        />
        <source
          media="(max-width: 720px)"
          type="image/webp"
          srcSet={`${W}/mobile-780.webp 780w, ${W}/mobile-1170.webp 1170w`}
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
        <img src={`${W}/desktop-1920.jpg`} alt="" fetchPriority="high" decoding="async" />
      </picture>
    </div>
  );
}
