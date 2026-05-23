import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  PHASE_STYLES, PHASES,
  NODES, EDGES,
} from './btabok-adlc-model';

import type { Phase } from './btabok-adlc-model';
import { NODE_W, BAND_PADDING } from './constants';
import { computeNodeSvgHeight } from './utils/nodeLayout';
import { computeEdgePaths } from './utils/edgeUtils';
import { useCanvasInteraction } from './hooks/useCanvasInteraction';
import Canvas from './components/Canvas';
import TopBar from './components/TopBar';
import { SelectedPanel, LegendPanel, PhasePanel } from './components/Sidebar';


const NODE_MAP = new Map(NODES.map(n => [n.id, n]));

export default function App() {
  const {
    positions, isDraggingNode, isPanDragging,
    transformGRef, containerDivRef, scrollContainerRef, showGridRef,
    handleWheel, startNodeDrag, startPanDrag,
    handleMouseMove, handleMouseUp,
    resetPositions, fitToScreen, zoomIn, zoomOut, resetZoom,
  } = useCanvasInteraction();

  const [selectedId,    setSelectedId]    = useState<string | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);
  const [showSwimlanes, setShowSwimlanes] = useState(true);
  const [showGrid,      setShowGrid]      = useState(true);
  const [showLegend, setShowLegend] = useState(() => window.innerWidth > 600);
  const [editMode,   setEditMode]   = useState(false);
  const [showGroups, setShowGroups] = useState(false);
  const [saved,       setSaved]       = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef       = useRef<SVGSVGElement>(null);
  const nodeHeights = useMemo(
    () => Object.fromEntries(NODES.map(n => [n.id, computeNodeSvgHeight(n)])),
    [],
  );

  // ── keyboard zoom ────────────────────────────────────────────────────────────
  useEffect(() => {
    const PAN_STEP = 80;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        const el = scrollContainerRef.current;
        if (!el) return;
        e.preventDefault();
        const step = e.shiftKey ? PAN_STEP * 3 : PAN_STEP;
        if (e.key === 'ArrowLeft')  el.scrollLeft -= step;
        if (e.key === 'ArrowRight') el.scrollLeft += step;
        if (e.key === 'ArrowUp')    el.scrollTop  -= step;
        if (e.key === 'ArrowDown')  el.scrollTop  += step;
        return;
      }
      // Toggle sidebar with ']' key (ignore when typing in inputs)
      if (e.key === ']') {
        const active = document.activeElement as HTMLElement | null;
        if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) return;
        e.preventDefault();
        setShowLegend(v => !v);
        return;
      }
      if (!(e.metaKey || e.ctrlKey)) return;
      if (e.key === '=' || e.key === '+') {
        e.preventDefault();
        zoomIn();
      } else if (e.key === '-') {
        e.preventDefault();
        zoomOut();
      } else if (e.key === '0') {
        e.preventDefault();
        resetZoom();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [zoomIn, zoomOut, resetZoom, scrollContainerRef]);

  // ── wheel zoom ───────────────────────────────────────────────────────────────
  const onWheel = useCallback((e: WheelEvent) => {
    if (!e.ctrlKey) return; // let browser handle scroll panning natively
    if (scrollContainerRef.current) handleWheel(e, scrollContainerRef.current);
  }, [handleWheel, scrollContainerRef]);

  // Add wheel listener to scroll container for zooming, with proper cleanup.
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [onWheel]);

  // ── canvas mouse down ────────────────────────────────────────────────────────
  const panStartPos = useRef<{ x: number; y: number } | null>(null);
  const pendingSelectRef = useRef<{ id: string; x: number; y: number } | null>(null);

  // If user clicks on canvas (not on a node), we start a pan drag. If the mouseup happens without significant movement, we clear the selection.
  const handleCanvasDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as Element;
    if (target.closest('[data-node]')) return;
    panStartPos.current = { x: e.clientX, y: e.clientY };
    startPanDrag(e);
  }, [startPanDrag]);

  // If mouseup happens after a pan drag, we check if there was significant movement. If not, we clear the selection (deselect nodes).
  const handleCanvasUp = useCallback((e: React.MouseEvent) => {
    const DRAG_THRESHOLD = 4;
    if (pendingSelectRef.current) {
      const { id, x, y } = pendingSelectRef.current;
      const dx = Math.abs(e.clientX - x);
      const dy = Math.abs(e.clientY - y);
      if (dx < DRAG_THRESHOLD && dy < DRAG_THRESHOLD) setSelectedId(id);
      pendingSelectRef.current = null;
    } else if (panStartPos.current) {
      const dx = Math.abs(e.clientX - panStartPos.current.x);
      const dy = Math.abs(e.clientY - panStartPos.current.y);
      if (dx < DRAG_THRESHOLD && dy < DRAG_THRESHOLD) setSelectedId(null);
      panStartPos.current = null;
    }
    handleMouseUp();
  }, [handleMouseUp]);

  // ── node mouse down ─────────────────────────────────────────────────────────
  const handleNodeDown = useCallback((e: React.MouseEvent, id: string) => {
    if (editMode) {
      setSelectedId(id);
      startNodeDrag(e, id);
    } else {
      pendingSelectRef.current = { id, x: e.clientX, y: e.clientY };
      startPanDrag(e);
    }
  }, [editMode, startNodeDrag, startPanDrag]);

  // ── copy positions ───────────────────────────────────────────────────────────
  const handleSave = useCallback(() => {
    const entries = Object.entries(positions)
      .map(([id, pos]) => `  ${id}: { x:${pos.x}, y:${pos.y} },`)
      .join('\n');
    const src = `export const NODE_POSITIONS: Record<string, { x: number; y: number }> = {\n${entries}\n};\n`;
    navigator.clipboard.writeText(src).then(() => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }, [positions]);


  // ── derived ──────────────────────────────────────────────────────────────────
  const canvasW = useMemo(
    () => Math.max(...Object.values(positions).map(p => p.x)) + NODE_W + 80,
    [positions],
  );
  const canvasH = useMemo(
    () => Math.max(...Object.values(positions).map(p => p.y)) + 200 + 80,
    [positions],
  );

  const handleDownload = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('width',  String(canvasW));
    clone.setAttribute('height', String(canvasH));
    // Remove pan/scale transform so the export shows all content at natural coordinates
    clone.removeAttribute('style');
    const g = clone.querySelector('g[transform]');
    if (g) g.removeAttribute('transform');
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('width',  String(canvasW));
    bg.setAttribute('height', String(canvasH));
    bg.setAttribute('fill', '#ffffff');
    clone.insertBefore(bg, clone.firstChild);
    const blob = new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19).replace('T', '_');
    a.download = `btabok-adlc_${ts}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }, [canvasW, canvasH]);

  const handleFit = useCallback(() => {
    containerRef.current && fitToScreen(containerRef.current);
  }, [fitToScreen]);

  const handleToggleSidebar = useCallback(() => {
    setShowLegend(v => !v);
  }, []);

  // ── swipe to show/hide sidebar (mobile) ──────────────────────────────────────
  const showLegendRef = useRef(showLegend);
  useEffect(() => { showLegendRef.current = showLegend; }, [showLegend]);

  useEffect(() => {
    const SWIPE_MIN_X = 120;
    const SWIPE_MAX_Y = 50;
    let startX = 0, startY = 0, singleTouch = false;

    const onTouchStart = (e: TouchEvent) => {
      singleTouch = e.touches.length === 1;
      if (!singleTouch) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!singleTouch || e.changedTouches.length !== 1) return;
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dy) > SWIPE_MAX_Y || Math.abs(dx) < SWIPE_MIN_X) return;
      if (dx > 0 && showLegendRef.current) setShowLegend(false);
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend',   onTouchEnd,   { passive: true });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend',   onTouchEnd);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Grid background is managed imperatively by the hook (applyScale + scroll listener)
  const infiniteGridStyle = useMemo(() => ({
    backgroundImage: [
      'linear-gradient(rgba(203,213,225,0.3) 1px, transparent 1px)',
      'linear-gradient(90deg, rgba(203,213,225,0.3) 1px, transparent 1px)',
      'linear-gradient(rgba(203,213,225,0.2) 1px, transparent 1px)',
      'linear-gradient(90deg, rgba(203,213,225,0.2) 1px, transparent 1px)',
    ].join(','),
  }), []);

  const [cardImportanceLevel, setCardImportanceLevel] = useState<1 | 2 | 3>(1);
  const visibleNodes = useMemo(() => {
    const importanceFiltered = NODES.filter(n => !n.importance || n.importance >= cardImportanceLevel);
    if (showGroups) {
      // Show group nodes, hide their items
      return importanceFiltered.filter(n => n.group === n.id || !n.group);
    } else {
      // Show item nodes, hide group nodes
      return importanceFiltered.filter(n => n.group !== n.id);
    }
  }, [cardImportanceLevel, showGroups]);

  const visibleNodeIds = useMemo(() => new Set(visibleNodes.map(n => n.id)), [visibleNodes]);

  // When showGroups is on, remap edges from member nodes to their group node
  const visibleEdges = useMemo(() => {
    if (!showGroups) {
      return EDGES.filter(e => visibleNodeIds.has(e.from) && visibleNodeIds.has(e.to));
    }
    // Build member→group map
    const memberToGroup = new Map<string, string>();
    NODES.forEach(n => { if (n.group && n.group !== n.id) memberToGroup.set(n.id, n.group); });
    const remap = (id: string) => memberToGroup.get(id) ?? id;
    const seen = new Set<string>();
    const result: typeof EDGES = [];
    for (const e of EDGES) {
      const from = remap(e.from);
      const to   = remap(e.to);
      if (from === to) continue; // self-loop after remap
      if (!visibleNodeIds.has(from) || !visibleNodeIds.has(to)) continue;
      const key = `${from}→${to}`;
      if (seen.has(key)) continue;
      seen.add(key);
      result.push({ ...e, from, to });
    }
    return result;
  }, [visibleNodeIds, showGroups]);

  const { connectedEdgeIds, connectedNodeIds } = useMemo(() => {
    if (!selectedId) return { connectedEdgeIds: null, connectedNodeIds: null };
    const connEdges = visibleEdges.filter(e => e.from === selectedId || e.to === selectedId);
    return {
      connectedEdgeIds: new Set(connEdges.map(e => e.id)),
      connectedNodeIds: new Set([selectedId, ...connEdges.flatMap(e => [e.from, e.to])]),
    };
  }, [selectedId, visibleEdges]);

  const phaseBands = useMemo(
    () => PHASES.map(ph => {
      const ns = NODES.filter(n => n.phase === ph);
      if (!ns.length) return null;
      const xs   = ns.map(n => positions[n.id].x);
      const minX = Math.min(...xs) - BAND_PADDING;
      const maxX = Math.max(...xs) + NODE_W + BAND_PADDING;
      return { ph, minX, maxX, style: PHASE_STYLES[ph] };
    }).filter(Boolean) as { ph: Phase; minX: number; maxX: number; style: { bg:string; band:string; text:string } }[],
    [positions],
  );

  const edgePaths = useMemo(
    () => computeEdgePaths(visibleEdges, positions, nodeHeights, NODE_MAP),
    [visibleEdges, positions, nodeHeights],
  );

  const { selectedNode, outgoing, incoming } = useMemo(() => {
    if (!selectedId) return { selectedNode: null, outgoing: [], incoming: [] };
    return {
      selectedNode: NODE_MAP.get(selectedId) ?? null,
      outgoing: visibleEdges.filter(e => e.from === selectedId).map(e => ({ e, n: NODE_MAP.get(e.to)! })),
      incoming: visibleEdges.filter(e => e.to === selectedId).map(e => ({ e, n: NODE_MAP.get(e.from)! })),
    };
  }, [selectedId, visibleEdges]);

  // ── render ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh',
      fontFamily: 'system-ui,-apple-system,sans-serif', background: '#FFFFFF' }}>

      {saved && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          background: '#1E293B', color: '#F1F5F9', borderRadius: 8,
          padding: '10px 20px', fontSize: 14, fontWeight: 500,
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)', zIndex: 9999,
          pointerEvents: 'none',
        }}>
          ✓ Copied position as configuration to clipboard
        </div>
      )}
      <TopBar
        showSwimlanes={showSwimlanes}
        showGrid={showGrid}
        showSidebar={showLegend}
        saved={saved}
        onReset={resetPositions}
        onFit={handleFit}
        onSave={handleSave}
        cardImportanceLevel={cardImportanceLevel}
        onCardImportanceLevelChange={setCardImportanceLevel}
        onShowSwimlanesChange={setShowSwimlanes}
        onShowGridChange={setShowGrid}
        editMode={editMode}
        onToggleEditMode={() => setEditMode(v => !v)}
        showGroups={showGroups}
        onToggleGroups={() => setShowGroups(v => !v)}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onToggleSidebar={handleToggleSidebar}
        onDownload={handleDownload}
      />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* canvas */}
        <Canvas
          containerRef={containerRef}
          containerDivRef={containerDivRef}
          scrollContainerRef={scrollContainerRef}
          transformGRef={transformGRef}
          svgRef={svgRef}
          canvasH={canvasH}
          isDraggingNode={isDraggingNode}
          isPanDragging={isPanDragging}
          showGrid={showGrid}
          showGridRef={showGridRef}
          infiniteGridStyle={infiniteGridStyle}
          showSwimlanes={showSwimlanes}
          phaseBands={phaseBands}
          selectedPhase={selectedPhase}
          edgePaths={edgePaths}
          connectedEdgeIds={connectedEdgeIds}
          connectedNodeIds={connectedNodeIds}
          visibleNodes={visibleNodes}
          selectedId={selectedId}
          positions={positions}
          onCanvasDown={handleCanvasDown}
          onMouseMove={handleMouseMove}
          onCanvasUp={handleCanvasUp}
          onNodeDown={handleNodeDown}
        />

        {/* sidebar */}
        {showLegend && <div style={{
          width: 320, background: '#FFFFFF',
          borderLeft: '1px solid #E2E8F0',
          overflowY: 'auto', flexShrink: 0, fontSize: 14, color: '#334155',
        }}>
          <LegendPanel style={{ display: selectedPhase || selectedNode ? 'none' : undefined }}/>
          {selectedNode && !selectedPhase && <SelectedPanel node={selectedNode} outgoing={outgoing} incoming={incoming} onPhaseClick={ph => setSelectedPhase(ph)}/>}
          {selectedPhase && <PhasePanel phase={selectedPhase} onClose={() => setSelectedPhase(null)}/>}
        </div>}
      </div>
    </div>
  );
}
