import { useState, useRef, useCallback, useEffect } from 'react';
import { NODES, PHASES } from '../btabok-adlc-model';
import { NODE_W, SNAP, BAND_PADDING, DEFAULT_SCALE, snapV } from '../constants';
import { NODE_POSITIONS } from '../positions';

export function useCanvasInteraction() {
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>(
    () => Object.fromEntries(NODES.map(n => [n.id, { ...NODE_POSITIONS[n.id] }]))
  );
  // Pan and zoom state. We keep these separate from positions since they don't affect the actual node positions and we want to avoid unnecessary re-renders of nodes when panning/zooming.
  const [pan,   setPan]   = useState(() => {
    const xs = NODES.map(n => NODE_POSITIONS[n.id].x);
    const ys = NODES.map(n => NODE_POSITIONS[n.id].y);
    const minX = Math.min(...xs), minY = Math.min(...ys);
    return { x: 72 - minX * DEFAULT_SCALE, y: 86 - minY * DEFAULT_SCALE };
  });
  // Zoom level (1 = 100%). We limit zooming out to 18% since the grid becomes too sparse and nodes can get lost.
  const [scale, setScale] = useState(DEFAULT_SCALE);

  const [isPanning, setIsPanning] = useState(false);
  const [isDraggingNode, setIsDraggingNode] = useState(false);

  const posRef   = useRef(positions);
  const panRef   = useRef(pan);
  const scaleRef = useRef(scale);
  const dragNode = useRef<{ id: string; sx: number; sy: number; ox: number; oy: number } | null>(null);
  const dragPan  = useRef<{ sx: number; sy: number; opx: number; opy: number } | null>(null);

  useEffect(() => { posRef.current   = positions; }, [positions]);
  useEffect(() => { panRef.current   = pan;        }, [pan]);
  useEffect(() => { scaleRef.current = scale;      }, [scale]);

  const handleWheel = useCallback((e: WheelEvent, _containerEl: HTMLElement) => {
    e.preventDefault();
    setPan(p => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }));
  }, []);

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
    setIsPanning(true);
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
      setPan({ x: opx + e.clientX - sx, y: opy + e.clientY - sy });
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    if (dragCursorTimer.current) { clearTimeout(dragCursorTimer.current); dragCursorTimer.current = null; }
    dragNode.current = null;
    dragPan.current  = null;
    setIsPanning(false);
    setIsDraggingNode(false);
  }, []);

  const resetPositions = useCallback(() => {
    const defaultPos = Object.fromEntries(NODES.map(n => [n.id, { ...NODE_POSITIONS[n.id] }]));
    setPositions(defaultPos);
    setScale(DEFAULT_SCALE);
    const minX = Math.min(...Object.values(defaultPos).map(p => p.x));
    const minY = Math.min(...Object.values(defaultPos).map(p => p.y));
    setPan({ x: 72 - minX * DEFAULT_SCALE, y: 86 - minY * DEFAULT_SCALE });
  }, []);

  const fitToScreen = useCallback((containerEl: HTMLElement) => {
    const { width, height } = containerEl.getBoundingClientRect();
    const ps   = posRef.current;
    const xs   = Object.values(ps).map(p => p.x);
    const ys   = Object.values(ps).map(p => p.y);
    const minX = Math.min(...xs), minY = Math.min(...ys);
    const maxX = Math.max(...xs) + NODE_W;
    const maxY = Math.max(...ys) + 140;
    const ns   = Math.min(0.98, (width - 48) / (maxX - minX), (height - 48) / (maxY - minY));
    setScale(ns);
    setPan({
      x: (width  - (maxX - minX) * ns) / 2 - minX * ns,
      y: (height - (maxY - minY) * ns) / 2 - minY * ns,
    });
  }, []);

  return {
    positions, pan, scale, isPanning, isDraggingNode,
    handleWheel, startNodeDrag, startPanDrag,
    handleMouseMove, handleMouseUp,
    resetPositions, fitToScreen,
    zoomIn:  () => setScale(s => Math.min(3,    Math.round(s * 10 + 1) / 10)),
    zoomOut: () => setScale(s => Math.max(0.18, Math.round(s * 10 - 1) / 10)),
  };
}
