import { useEffect, useRef, useState } from 'react';
import type { ImgHTMLAttributes } from 'react';
import imageVariants from '../generated/imageVariants.json';
const transparent = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
type Variant = { src: string; width: number; height: number; bytes: number };
type Entry = { variants: Variant[]; originalBytes: number };
const images: Record<string, Entry> = imageVariants;
type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'sizes'> & {
  src: string; variant?: 'card' | 'detail' | 'hero'; eager?: boolean; sizes?: string;
};
/** No remote URL is attached until the image is visible; unknown/new URLs still work. */
export default function RecipeImage({ src, variant = 'card', eager = false, sizes, onError, ...props }: Props) {
  const ref = useRef<HTMLImageElement>(null);
  const [visibleSource, setVisibleSource] = useState<string | null>(eager ? src : null);
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const visible = eager || visibleSource === src;
  useEffect(() => {
    if (eager) return;
    if (!('IntersectionObserver' in window)) { setVisibleSource(src); return; }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setVisibleSource(src); observer.disconnect(); }
    }, { rootMargin: '0px', threshold: 0.01 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [src, eager]);
  const entry = images[src];
  const candidates = failedSource !== src ? entry?.variants.filter(v => variant !== 'card' || v.width <= 1024) : undefined;
  const choices = candidates?.length ? candidates : undefined;
  const largest = choices?.[choices.length - 1];
  const fallback = choices?.find(v => v.width >= (variant === 'card' ? 640 : 1280)) || largest;
  return <img {...props} ref={ref}
    src={visible ? fallback?.src || src : transparent}
    srcSet={visible && choices ? choices.map(v => `${v.src} ${v.width}w`).join(', ') : undefined}
    sizes={sizes || (variant === 'card' ? 'auto, (min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw' : 'auto, (min-width: 1024px) 900px, 100vw')}
    width={props.width || largest?.width} height={props.height || largest?.height}
    loading={eager ? 'eager' : 'lazy'} decoding="async"
    onError={event => {
      // Missing generated assets never hide a recipe: retry only its original, once.
      if (visible && entry && failedSource !== src) setFailedSource(src);
      else onError?.(event);
    }} />;
}
