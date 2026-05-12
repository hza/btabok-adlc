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
    positions, isDraggingNode,
    transformGRef, containerDivRef, scrollContainerRef, showGridRef,
    handleWheel, startNodeDrag, startPanDrag,
    handleMouseMove, handleMouseUp,
    resetPositions, fitToScreen, zoomIn, zoomOut,
  } = useCanvasInteraction();

  const [selectedId,    setSelectedId]    = useState<string | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);
  const [showSwimlanes, setShowSwimlanes] = useState(true);
  const [showGrid,      setShowGrid]      = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [saved,       setSaved]       = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef       = useRef<SVGSVGElement>(null);
  const nodeHeights = useMemo(
    () => Object.fromEntries(NODES.map(n => [n.id, computeNodeSvgHeight(n)])),
    [],
  );

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

  // If user clicks on canvas (not on a node), we start a pan drag. If the mouseup happens without significant movement, we clear the selection.
  const handleCanvasDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as Element;
    if (target.closest('[data-node]')) return;
    panStartPos.current = { x: e.clientX, y: e.clientY };
    startPanDrag(e);
  }, [startPanDrag]);

  // If mouseup happens after a pan drag, we check if there was significant movement. If not, we clear the selection (deselect nodes).
  const handleCanvasUp = useCallback((e: React.MouseEvent) => {
    if (panStartPos.current) {
      const dx = Math.abs(e.clientX - panStartPos.current.x);
      const dy = Math.abs(e.clientY - panStartPos.current.y);
      if (dx < 4 && dy < 4) setSelectedId(null);
      panStartPos.current = null;
    }
    handleMouseUp();
  }, [handleMouseUp]);

  // ── node mouse down ─────────────────────────────────────────────────────────
  const handleNodeDown = useCallback((e: React.MouseEvent, id: string) => {
    setSelectedId(id);
    startNodeDrag(e, id);
  }, [startNodeDrag]);

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
  const visibleNodes = useMemo(
    () => NODES.filter(n => !n.importance || n.importance >= cardImportanceLevel),
    [cardImportanceLevel],
  );

  const visibleNodeIds = useMemo(() => new Set(visibleNodes.map(n => n.id)), [visibleNodes]);
  const visibleEdges = useMemo(
    () => EDGES.filter(e => visibleNodeIds.has(e.from) && visibleNodeIds.has(e.to)),
    [visibleNodeIds],
  );

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
          {selectedPhase
            ? <PhasePanel phase={selectedPhase} onClose={() => setSelectedPhase(null)}/>
            : selectedNode
              ? <SelectedPanel node={selectedNode} outgoing={outgoing} incoming={incoming} onPhaseClick={ph => setSelectedPhase(ph)}/>
              : <LegendPanel/>}
        </div>}
      </div>
    </div>
  );
}
