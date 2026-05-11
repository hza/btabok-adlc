import { useState, useRef, useCallback, useEffect } from 'react';
import { NODES, PHASES } from '../btabok-adlc-model';
import { NODE_W, SNAP, BAND_PADDING, DEFAULT_SCALE, snapV } from '../constants';
import { NODE_POSITIONS } from '../positions';

function applyPanScale(
  transformDiv: HTMLDivElement | null,
  containerDiv: HTMLDivElement | null,
  px: number, py: number, sc: number,
  showGrid: boolean,
) {
  if (transformDiv) {
    transformDiv.style.transform = `translate(${px}px,${py}px) scale(${sc})`;
  }
  if (containerDiv && showGrid) {
    const minor = 20 * sc;
    const major = 4 * minor;
    const offXMinor = ((px % minor) + minor) % minor;
    const offYMinor = ((py % minor) + minor) % minor;
    const offXMajor = ((px % major) + major) % major;
    const offYMajor = ((py % major) + major) % major;
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

export function useCanvasInteraction() {
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>(
    () => Object.fromEntries(NODES.map(n => [n.id, { ...NODE_POSITIONS[n.id] }]))
  );

  const initialPan = (() => {
    const xs = NODES.map(n => NODE_POSITIONS[n.id].x);
    const ys = NODES.map(n => NODE_POSITIONS[n.id].y);
    const minX = Math.min(...xs), minY = Math.min(...ys);
    return { x: 72 - minX * DEFAULT_SCALE, y: 86 - minY * DEFAULT_SCALE };
  })();

  // pan/scale kept in refs for zero-overhead updates during panning
  const panRef   = useRef(initialPan);
  const scaleRef = useRef(DEFAULT_SCALE);

  // React state only for triggering re-renders when pan/scale commit (zoom, fit, reset)
  const [panScale, setPanScale] = useState({ pan: initialPan, scale: DEFAULT_SCALE });

  const [isDraggingNode, setIsDraggingNode] = useState(false);

  // Refs to DOM elements — hook writes directly to bypass React rendering during pan
  const transformDivRef  = useRef<HTMLDivElement | null>(null);
  const containerDivRef  = useRef<HTMLDivElement | null>(null);
  const showGridRef      = useRef(true);

  const posRef   = useRef(positions);
  const dragNode = useRef<{ id: string; sx: number; sy: number; ox: number; oy: number } | null>(null);
  const dragPan  = useRef<{ sx: number; sy: number; opx: number; opy: number } | null>(null);

  useEffect(() => { posRef.current = positions; }, [positions]);

  const commitPanScale = useCallback(() => {
    setPanScale({ pan: { ...panRef.current }, scale: scaleRef.current });
  }, []);

  const handleWheel = useCallback((e: WheelEvent, _containerEl: HTMLElement) => {
    e.preventDefault();
    panRef.current = { x: panRef.current.x - e.deltaX, y: panRef.current.y - e.deltaY };
    applyPanScale(transformDivRef.current, containerDivRef.current, panRef.current.x, panRef.current.y, scaleRef.current, showGridRef.current);
    // Debounce the React state commit so the grid re-renders once after scrolling settles
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
    dragPan.current = { sx: e.clientX, sy: e.clientY, opx: panRef.current.x, opy: panRef.current.y };
    if (containerDivRef.current) containerDivRef.current.style.cursor = 'grabbing';
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragNode.current) {
      const { id, sx, sy, ox, oy } = dragNode.current;
      const dx = (e.clientX - sx) / scaleRef.current;
      const dy = (e.clientY - sy) / scaleRef.current;
      setPositions(cur => {
        const next = { ...cur, [id]: { x: snapV(ox + dx), y: snapV(oy + dy) } };
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
      panRef.current = { x: opx + e.clientX - sx, y: opy + e.clientY - sy };
      applyPanScale(transformDivRef.current, containerDivRef.current, panRef.current.x, panRef.current.y, scaleRef.current, showGridRef.current);
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    if (dragCursorTimer.current) { clearTimeout(dragCursorTimer.current); dragCursorTimer.current = null; }
    if (containerDivRef.current) containerDivRef.current.style.cursor = 'grab';
    const wasPanning = !!dragPan.current;
    dragNode.current = null;
    dragPan.current  = null;
    setIsDraggingNode(false);
    if (wasPanning) commitPanScale();
  }, [commitPanScale]);

  const resetPositions = useCallback(() => {
    const defaultPos = Object.fromEntries(NODES.map(n => [n.id, { ...NODE_POSITIONS[n.id] }]));
    setPositions(defaultPos);
    const minX = Math.min(...Object.values(defaultPos).map(p => p.x));
    const minY = Math.min(...Object.values(defaultPos).map(p => p.y));
    panRef.current   = { x: 72 - minX * DEFAULT_SCALE, y: 86 - minY * DEFAULT_SCALE };
    scaleRef.current = DEFAULT_SCALE;
    applyPanScale(transformDivRef.current, containerDivRef.current, panRef.current.x, panRef.current.y, scaleRef.current, showGridRef.current);
    commitPanScale();
  }, [commitPanScale]);

  const fitToScreen = useCallback((containerEl: HTMLElement) => {
    const { width, height } = containerEl.getBoundingClientRect();
    const ps   = posRef.current;
    const xs   = Object.values(ps).map(p => p.x);
    const ys   = Object.values(ps).map(p => p.y);
    const minX = Math.min(...xs), minY = Math.min(...ys);
    const maxX = Math.max(...xs) + NODE_W;
    const maxY = Math.max(...ys) + 140;
    const ns   = Math.min(0.98, (width - 48) / (maxX - minX), (height - 48) / (maxY - minY));
    panRef.current   = { x: (width - (maxX - minX) * ns) / 2 - minX * ns, y: (height - (maxY - minY) * ns) / 2 - minY * ns };
    scaleRef.current = ns;
    applyPanScale(transformDivRef.current, containerDivRef.current, panRef.current.x, panRef.current.y, scaleRef.current, showGridRef.current);
    commitPanScale();
  }, [commitPanScale]);

  const zoomIn = useCallback(() => {
    scaleRef.current = Math.min(3, Math.round(scaleRef.current * 10 + 1) / 10);
    applyPanScale(transformDivRef.current, containerDivRef.current, panRef.current.x, panRef.current.y, scaleRef.current, showGridRef.current);
    commitPanScale();
  }, [commitPanScale]);

  const zoomOut = useCallback(() => {
    scaleRef.current = Math.max(0.18, Math.round(scaleRef.current * 10 - 1) / 10);
    applyPanScale(transformDivRef.current, containerDivRef.current, panRef.current.x, panRef.current.y, scaleRef.current, showGridRef.current);
    commitPanScale();
  }, [commitPanScale]);

  return {
    positions,
    pan: panScale.pan,
    scale: panScale.scale,
    isDraggingNode,
    transformDivRef,
    containerDivRef,
    showGridRef,
    handleWheel, startNodeDrag, startPanDrag,
    handleMouseMove, handleMouseUp,
    resetPositions, fitToScreen, zoomIn, zoomOut,
  };
}
