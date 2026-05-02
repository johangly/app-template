import { useEffect, useRef, useState, type CSSProperties } from 'react';

export type ResponsiveGridColumnsOptions = {
  minItemWidth: number;
  gapPx?: number;
  maxCols?: number;
  avoidCols?: number[];
  measureParent?: boolean;
  initialCols?: number;
};

export function useResponsiveGridColumns<T extends HTMLElement = HTMLDivElement>(
  options: ResponsiveGridColumnsOptions
) {
  const {
    minItemWidth,
    gapPx = 16,
    maxCols = 12,
    avoidCols = [],
    measureParent = true,
    initialCols = 1,
  } = options;

  const ref = useRef<T | null>(null);
  const [cols, setCols] = useState(initialCols);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measureEl = measureParent ? (el.parentElement ?? el) : el;

    const computeCols = (width: number) => {
      const raw = Math.floor((width + gapPx) / (minItemWidth + gapPx));
      const clamped = Math.max(1, Math.min(maxCols, raw));
      if (avoidCols.includes(clamped)) {
        for (let down = clamped - 1; down >= 1; down -= 1) {
          if (!avoidCols.includes(down)) return down;
        }
      }
      return clamped;
    };

    const applyWidth = (width: number) => {
      setCols((prev) => {
        const next = computeCols(width);
        return prev === next ? prev : next;
      });
    };

    const rafId = window.requestAnimationFrame(() => {
      applyWidth(measureEl.getBoundingClientRect().width);
    });

    if (typeof ResizeObserver === 'undefined') {
      const onResize = () => applyWidth(measureEl.getBoundingClientRect().width);
      window.addEventListener('resize', onResize);
      return () => {
        window.cancelAnimationFrame(rafId);
        window.removeEventListener('resize', onResize);
      };
    }

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      const width = entry?.contentRect?.width ?? measureEl.getBoundingClientRect().width;
      applyWidth(width);
    });

    ro.observe(measureEl);

    return () => {
      window.cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [avoidCols, gapPx, maxCols, measureParent, minItemWidth]);

  const style: CSSProperties = {
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
  };

  return { ref, cols, style };
}
