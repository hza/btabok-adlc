import { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import { NODES, PHASES } from '../btabok-adlc-model';
import { NODE_W, SNAP, BAND_PADDING, DEFAULT_SCALE, SCROLL_SURFACE, snapV } from '../constants';

// Content is translated to the center of the scroll surface so there is equal panning room in all directions
const CONTENT_OFFSET = SCROLL_SURFACE / 2;
import { NODE_POSITIONS } from '../positions';

function applyScale(
  transformG: SVGGElement | null,
  containerDiv: HTMLDivElement | null,
  scrollEl: HTMLDivElement | null,
  sc: number,
  showGrid: boolean,
) {
  if (transformG) {
    transformG.setAttribute('transform', `translate(${CONTENT_OFFSET},${CONTENT_OFFSET}) scale(${sc})`);
  }
  if (containerDiv && showGrid && scrollEl) {
    const px = scrollEl.scrollLeft;
    const py = scrollEl.scrollTop;
    const minor = 20 * sc;
    const major = 4 * minor;
    const offXMinor = ((CONTENT_OFFSET - px) % minor + minor) % minor;
    const offYMinor = ((CONTENT_OFFSET - py) % minor + minor) % minor;
    const offXMajor = ((CONTENT_OFFSET - px) % major + major) % major;
    const offYMajor = ((CONTENT_OFFSET - py) % major + major) % major;
    containerDiv.style.backgroundSize = [
      `${major}px ${major}px`, `${major}px ${major}px`,
      `${minor}px ${minor}px`, `${minor}px ${minor}px`,
    ].join(',');
    containerDiv.style.backgroundPosition = [
      `${offXMajor}px ${offYMajor}px`, `${offXMajor}px ${offYMajor}px`,
      `${offXMinor}px ${offYMinor}px`, `${offXMinor}px ${offYMinor}px`,
    ].join(',');
  }
}

function computeInitialScroll(positions: Record<string, { x: number; y: number }>, sc: number) {
  const xs = NODES.map(n => positions[n.id].x);
  const ys = NODES.map(n => positions[n.id].y);
  // CONTENT_OFFSET shifts content to the center of the scroll surface;
  // subtract the desired viewport margin (72/86) to land the content in view
  return {
    left: CONTENT_OFFSET + Math.min(...xs) * sc - 72,
    top:  CONTENT_OFFSET + Math.min(...ys) * sc - 86,
  };
}

export function useCanvasInteraction() {
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>(
    () => Object.fromEntries(NODES.map(n => [n.id, { ...NODE_POSITIONS[n.id] }]))
  );

  const scaleRef = useRef(DEFAULT_SCALE);

  // React state only for triggering re-renders on zoom/fit/reset
  const [panScale, setPanScale] = useState({ scale: DEFAULT_SCALE });

  const [isDraggingNode, setIsDraggingNode] = useState(false);
  const [isPanDragging, setIsPanDragging] = useState(false);

  const transformGRef      = useRef<SVGGElement | null>(null);
  const containerDivRef    = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const showGridRef        = useRef(true);

  const posRef   = useRef(positions);
  const dragNode = useRef<{ id: string; sx: number; sy: number; ox: number; oy: number } | null>(null);
  const dragPan  = useRef<{ sx: number; sy: number; opx: number; opy: number } | null>(null);

  useEffect(() => { posRef.current = positions; }, [positions]);

  useLayoutEffect(() => {
    const scrollEl = scrollContainerRef.current;
    if (scrollEl) {
      const s = computeInitialScroll(posRef.current, scaleRef.current);
      scrollEl.scrollLeft = s.left;
      scrollEl.scrollTop  = s.top;
    }
    applyScale(transformGRef.current, containerDivRef.current, scrollContainerRef.current, scaleRef.current, showGridRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep grid in sync with native scroll
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const onScroll = () => applyScale(transformGRef.current, containerDivRef.current, el, scaleRef.current, showGridRef.current);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const commitPanScale = useCallback(() => {
    setPanScale({ scale: scaleRef.current });
  }, []);

  const handleWheel = useCallback((e: WheelEvent, scrollEl: HTMLDivElement) => {
    if (!e.ctrlKey) return; // let browser handle scroll panning natively
    e.preventDefault();

    const LINE = 16, PAGE = 400;
    const mult = e.deltaMode === 2 ? PAGE : e.deltaMode === 1 ? LINE : 1;
    const dy = e.deltaY * mult;

    const rect = scrollEl.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const oldScale = scaleRef.current;
    const newScale = Math.min(3, Math.max(0.18, oldScale * Math.exp(-dy / 300)));

    // Anchor: canvas point under cursor stays fixed after zoom.
    // With translate(OFFSET,OFFSET) scale(sc), canvas coord = (scroll + cursor - OFFSET) / sc
    // => newScroll = OFFSET + (scroll + cursor - OFFSET) * ratio - cursor
    const ratio = newScale / oldScale;
    scrollEl.scrollLeft = CONTENT_OFFSET + (scrollEl.scrollLeft + mx - CONTENT_OFFSET) * ratio - mx;
    scrollEl.scrollTop  = CONTENT_OFFSET + (scrollEl.scrollTop  + my - CONTENT_OFFSET) * ratio - my;
    scaleRef.current = newScale;
    applyScale(transformGRef.current, containerDivRef.current, scrollEl, newScale, showGridRef.current);
    scheduleCommit();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const commitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scheduleCommit = useCallback(() => {
    if (commitTimer.current) clearTimeout(commitTimer.current);
    commitTimer.current = setTimeout(() => { commitTimer.current = null; commitPanScale(); }, 150);
  }, [commitPanScale]);

  const dragCursorTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startNodeDrag = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (e.button !== 0) return;
    const pos = posRef.current[id];
    dragNode.current = { id, sx: e.clientX, sy: e.clientY, ox: pos.x, oy: pos.y };
    dragCursorTimer.current = setTimeout(() => setIsDraggingNode(true), 100);
  }, []);

  const startPanDrag = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const scrollEl = scrollContainerRef.current;
    if (!scrollEl) return;
    dragPan.current = { sx: e.clientX, sy: e.clientY, opx: scrollEl.scrollLeft, opy: scrollEl.scrollTop };
    setIsPanDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragNode.current) {
      const { id, sx, sy, ox, oy } = dragNode.current;
      const dx = (e.clientX - sx) / scaleRef.current;
      const dy = (e.clientY - sy) / scaleRef.current;
      setPositions(cur => {
        const next = { ...cur, [id]: { x: snapV(ox + dx), y: Math.max(SNAP, snapV(oy + dy)) } };
        const bands = PHASES.map(ph => {
          const xs = NODES.filter(n => n.phase === ph).map(n => next[n.id].x);
          return { ph, maxX: Math.max(...xs) + NODE_W + BAND_PADDING };
        });
        const gap = 3 * SNAP;
        for (let i = 1; i < bands.length; i++) {
          const phaseNodes = NODES.filter(n => n.phase === bands[i].ph);
          const minX  = Math.min(...phaseNodes.map(n => next[n.id].x));
          const shift = bands[i - 1].maxX + gap - minX;
          if (shift !== 0) {
            for (let j = i; j < bands.length; j++) {
              NODES.filter(n => n.phase === bands[j].ph).forEach(n => {
                next[n.id] = { ...next[n.id], x: next[n.id].x + shift };
              });
              bands[j].maxX += shift;
            }
          }
        }
        return next;
      });
    } else if (dragPan.current) {
      const { sx, sy, opx, opy } = dragPan.current;
      const scrollEl = scrollContainerRef.current;
      if (scrollEl) {
        scrollEl.scrollLeft = opx - (e.clientX - sx);
        scrollEl.scrollTop  = opy - (e.clientY - sy);
        // grid updates automatically via the scroll event listener
      }
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    if (dragCursorTimer.current) { clearTimeout(dragCursorTimer.current); dragCursorTimer.current = null; }
    dragNode.current = null;
    dragPan.current  = null;
    setIsDraggingNode(false);
    setIsPanDragging(false);
  }, []);

  const resetPositions = useCallback(() => {
    const defaultPos = Object.fromEntries(NODES.map(n => [n.id, { ...NODE_POSITIONS[n.id] }]));
    setPositions(defaultPos);
    scaleRef.current = DEFAULT_SCALE;
    const scrollEl = scrollContainerRef.current;
    if (scrollEl) {
      const s = computeInitialScroll(defaultPos, DEFAULT_SCALE);
      scrollEl.scrollLeft = s.left;
      scrollEl.scrollTop  = s.top;
      applyScale(transformGRef.current, containerDivRef.current, scrollEl, DEFAULT_SCALE, showGridRef.current);
    }
    commitPanScale();
  }, [commitPanScale]);

  const fitToScreen = useCallback((containerEl: HTMLElement) => {
    const scrollEl = scrollContainerRef.current;
    if (!scrollEl) return;
    const { width, height } = containerEl.getBoundingClientRect();
    const ps   = posRef.current;
    const xs   = Object.values(ps).map(p => p.x);
    const ys   = Object.values(ps).map(p => p.y);
    const minX = Math.min(...xs), minY = Math.min(...ys);
    const maxX = Math.max(...xs) + NODE_W;
    const maxY = Math.max(...ys) + 140;
    const ns   = Math.min(0.98, (width - 48) / (maxX - minX), (height - 48) / (maxY - minY));
    scaleRef.current = ns;
    const contentW = (maxX - minX) * ns;
    const contentH = (maxY - minY) * ns;
    scrollEl.scrollLeft = CONTENT_OFFSET + minX * ns - (width  - contentW) / 2;
    scrollEl.scrollTop  = CONTENT_OFFSET + minY * ns - (height - contentH) / 2;
    applyScale(transformGRef.current, containerDivRef.current, scrollEl, ns, showGridRef.current);
    commitPanScale();
  }, [commitPanScale]);

  const resetZoom = useCallback(() => {
    const scrollEl = scrollContainerRef.current;
    if (!scrollEl) return;
    const oldScale = scaleRef.current;
    const newScale = DEFAULT_SCALE;
    const { width, height } = scrollEl.getBoundingClientRect();
    const cx = width / 2, cy = height / 2;
    const ratio = newScale / oldScale;
    scrollEl.scrollLeft = CONTENT_OFFSET + (scrollEl.scrollLeft + cx - CONTENT_OFFSET) * ratio - cx;
    scrollEl.scrollTop  = CONTENT_OFFSET + (scrollEl.scrollTop  + cy - CONTENT_OFFSET) * ratio - cy;
    scaleRef.current = newScale;
    applyScale(transformGRef.current, containerDivRef.current, scrollEl, newScale, showGridRef.current);
    commitPanScale();
  }, [commitPanScale]);

  const zoomIn = useCallback(() => {
    const scrollEl = scrollContainerRef.current;
    if (!scrollEl) return;
    const oldScale = scaleRef.current;
    const newScale = Math.min(3, Math.round(oldScale * 10 + 1) / 10);
    const { width, height } = scrollEl.getBoundingClientRect();
    const cx = width / 2, cy = height / 2;
    const ratio = newScale / oldScale;
    scrollEl.scrollLeft = CONTENT_OFFSET + (scrollEl.scrollLeft + cx - CONTENT_OFFSET) * ratio - cx;
    scrollEl.scrollTop  = CONTENT_OFFSET + (scrollEl.scrollTop  + cy - CONTENT_OFFSET) * ratio - cy;
    scaleRef.current = newScale;
    applyScale(transformGRef.current, containerDivRef.current, scrollEl, newScale, showGridRef.current);
    commitPanScale();
  }, [commitPanScale]);

  const zoomOut = useCallback(() => {
    const scrollEl = scrollContainerRef.current;
    if (!scrollEl) return;
    const oldScale = scaleRef.current;
    const newScale = Math.max(0.18, Math.round(oldScale * 10 - 1) / 10);
    const { width, height } = scrollEl.getBoundingClientRect();
    const cx = width / 2, cy = height / 2;
    const ratio = newScale / oldScale;
    scrollEl.scrollLeft = CONTENT_OFFSET + (scrollEl.scrollLeft + cx - CONTENT_OFFSET) * ratio - cx;
    scrollEl.scrollTop  = CONTENT_OFFSET + (scrollEl.scrollTop  + cy - CONTENT_OFFSET) * ratio - cy;
    scaleRef.current = newScale;
    applyScale(transformGRef.current, containerDivRef.current, scrollEl, newScale, showGridRef.current);
    commitPanScale();
  }, [commitPanScale]);

  // ── pinch-to-zoom (touch) ────────────────────────────────────────────────────
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    let pinchDist0 = 0;
    let pinchScale0 = 1;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const t1 = e.touches[0], t2 = e.touches[1];
        pinchDist0  = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        pinchScale0 = scaleRef.current;
        e.preventDefault();
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 2 || pinchDist0 === 0) return;
      e.preventDefault();
      const t1 = e.touches[0], t2 = e.touches[1];
      const dist     = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const newScale = Math.min(3, Math.max(0.18, pinchScale0 * dist / pinchDist0));
      const rect  = el.getBoundingClientRect();
      const midX  = (t1.clientX + t2.clientX) / 2 - rect.left;
      const midY  = (t1.clientY + t2.clientY) / 2 - rect.top;
      const ratio = newScale / scaleRef.current;
      el.scrollLeft    = CONTENT_OFFSET + (el.scrollLeft + midX - CONTENT_OFFSET) * ratio - midX;
      el.scrollTop     = CONTENT_OFFSET + (el.scrollTop  + midY - CONTENT_OFFSET) * ratio - midY;
      scaleRef.current = newScale;
      applyScale(transformGRef.current, containerDivRef.current, el, newScale, showGridRef.current);
    };

    const onTouchEnd = () => {
      if (pinchDist0 !== 0) {
        pinchDist0 = 0;
        commitPanScale();
      }
    };

    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove',  onTouchMove,  { passive: false });
    el.addEventListener('touchend',   onTouchEnd);
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove',  onTouchMove);
      el.removeEventListener('touchend',   onTouchEnd);
    };
  }, [commitPanScale]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    positions,
    scale: panScale.scale,
    isDraggingNode,
    isPanDragging,
    transformGRef,
    containerDivRef,
    scrollContainerRef,
    showGridRef,
    handleWheel, startNodeDrag, startPanDrag,
    handleMouseMove, handleMouseUp,
    resetPositions, fitToScreen, zoomIn, zoomOut, resetZoom,
  };
}
