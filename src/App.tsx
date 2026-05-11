import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  PHASE_STYLES, PHASES, PHASE_LABEL,
  NODES, EDGES,
} from './btabok-adlc-model';

const IMP_COLOR: Record<1 | 2 | 3, string> = {
  1: '#94A3B8',
  2: '#94A3B8',
  3: '#F5A44A',
};
import type { Phase } from './btabok-adlc-model';
import { NODE_W, BAND_PADDING } from './constants';
import { computeNodeSvgHeight } from './utils/nodeLayout';
import { computeEdgePaths } from './utils/edgeUtils';
import { useCanvasInteraction } from './hooks/useCanvasInteraction';
import NodeCardSvg from './components/NodeCardSvg';
import TopBar from './components/TopBar';
import { SelectedPanel, LegendPanel, PhasePanel } from './components/Sidebar';


const NODE_MAP = new Map(NODES.map(n => [n.id, n]));

export default function App() {
  const {
    positions, pan, scale, isPanning, isDraggingNode,
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
    if (containerRef.current) handleWheel(e, containerRef.current);
  }, [handleWheel]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [onWheel]);

  // ── canvas mouse down ────────────────────────────────────────────────────────
  const panStartPos = useRef<{ x: number; y: number } | null>(null);

  const handleCanvasDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as Element;
    if (target.closest('[data-node]')) return;
    panStartPos.current = { x: e.clientX, y: e.clientY };
    startPanDrag(e);
  }, [startPanDrag]);

  const handleCanvasUp = useCallback((e: React.MouseEvent) => {
    if (panStartPos.current) {
      const dx = Math.abs(e.clientX - panStartPos.current.x);
      const dy = Math.abs(e.clientY - panStartPos.current.y);
      if (dx < 4 && dy < 4) setSelectedId(null);
      panStartPos.current = null;
    }
    handleMouseUp();
  }, [handleMouseUp]);

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
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('width',  String(canvasW));
    bg.setAttribute('height', String(canvasH));
    bg.setAttribute('fill', '#ffffff');
    clone.insertBefore(bg, clone.firstChild);
    const blob = new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'btabok-adlc.svg';
    a.click();
    URL.revokeObjectURL(url);
  }, [canvasW, canvasH]);

  const infiniteGridStyle = useMemo(() => {
    const minor = 20 * scale;
    const major = 4 * minor;
    const offXMinor = ((pan.x % minor) + minor) % minor;
    const offYMinor = ((pan.y % minor) + minor) % minor;
    const offXMajor = ((pan.x % major) + major) % major;
    const offYMajor = ((pan.y % major) + major) % major;
    return {
      backgroundImage: [
        'linear-gradient(rgba(203,213,225,0.3) 1px, transparent 1px)',
        'linear-gradient(90deg, rgba(203,213,225,0.3) 1px, transparent 1px)',
        'linear-gradient(rgba(203,213,225,0.2) 1px, transparent 1px)',
        'linear-gradient(90deg, rgba(203,213,225,0.2) 1px, transparent 1px)',
      ].join(','),
      backgroundSize: [
        `${major}px ${major}px`, `${major}px ${major}px`,
        `${minor}px ${minor}px`, `${minor}px ${minor}px`,
      ].join(','),
      backgroundPosition: [
        `${offXMajor}px ${offYMajor}px`, `${offXMajor}px ${offYMajor}px`,
        `${offXMinor}px ${offYMinor}px`, `${offXMinor}px ${offYMinor}px`,
      ].join(','),
    };
  }, [pan.x, pan.y, scale]);

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
        onFit={() => containerRef.current && fitToScreen(containerRef.current)}
        onSave={handleSave}
        cardImportanceLevel={cardImportanceLevel}
        onCardImportanceLevelChange={setCardImportanceLevel}
        onShowSwimlanesChange={setShowSwimlanes}
        onShowGridChange={setShowGrid}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onToggleSidebar={() => setShowLegend(v => !v)}
        onDownload={handleDownload}
      />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* canvas */}
        <div
          ref={containerRef}
          style={{ flex: 1, overflow: 'hidden', position: 'relative',
            cursor: (isPanning || isDraggingNode) ? 'grabbing' : 'grab', background: '#FFFFFF',
            ...(showGrid ? infiniteGridStyle : {}) }}
          onMouseDown={handleCanvasDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleCanvasUp}
          onMouseLeave={handleCanvasUp}
        >
          <div style={{
            position: 'absolute', transformOrigin: '0 0',
            transform: `translate(${pan.x}px,${pan.y}px) scale(${scale})`,
          }}>
            <svg ref={svgRef} width={canvasW} height={canvasH} overflow="visible"
              style={{ position: 'absolute', top: 0, left: 0 }}>
              <defs>
                <marker id="mHi" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                  <polygon points="0 0,7 3.5,0 7" fill="#7F77DD"/>
                </marker>
                {([1, 2, 3] as const).map(imp => (
                  <marker key={imp} id={`mImp${imp}`} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                    <polygon points="0 0,7 3.5,0 7" fill={IMP_COLOR[imp]}/>
                  </marker>
                ))}
                <filter id="nodeShadow" x="-10%" y="-10%" width="120%" height="130%">
                  <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(0,0,0,0.08)"/>
                </filter>
                <filter id="nodeShadowSelected" x="-20%" y="-20%" width="140%" height="150%">
                  <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="rgba(0,0,0,0.16)"/>
                </filter>
              </defs>

              <g pointerEvents="none">
                {showSwimlanes && phaseBands.map(({ ph, minX, maxX, style }) => (
                  <g key={ph}>
                    <rect x={minX} y={0} width={maxX - minX} height={canvasH}
                      fill={style.bg} stroke={style.band} strokeWidth="1" opacity="0.72"/>
                    <rect x={minX} y={0} width={maxX - minX} height={24}
                      fill={style.band} opacity={selectedPhase === ph ? 1 : 0.75}/>
                    <text x={minX + (maxX - minX) / 2} y={16}
                      textAnchor="middle" fontSize={12} fontWeight="600"
                      fontFamily="system-ui,-apple-system,sans-serif"
                      fill={style.text} style={{ userSelect: 'none' }}>
                      {PHASE_LABEL[ph]}
                    </text>
                  </g>
                ))}

                {edgePaths.map(edge => {
                  const hi   = connectedEdgeIds ? connectedEdgeIds.has(edge.id) : false;
                  const dimS = connectedEdgeIds ? !hi : false;
                  const impColor = IMP_COLOR[edge.importance];
                  const opacity = dimS ? 0.15 : hi ? 1 : 0.55;
                  const stroke  = hi ? '#7F77DD' : impColor;
                  const sw      = hi ? 2.2 : edge.importance === 3 ? 2 : edge.importance === 2 ? 1.7 : 1.3;
                  return (
                    <g key={edge.id} opacity={opacity}>
                      <path d={edge.path} fill="none"
                        stroke={stroke}
                        strokeWidth={sw}
                        markerEnd={`url(#${hi ? 'mHi' : `mImp${edge.importance}`})`}/>
                      <text x={edge.mx} y={edge.my - 5}
                        textAnchor="middle" fontSize={12} fontFamily="system-ui"
                        fill="#000000"
                        stroke="white" strokeWidth="2.8" paintOrder="stroke">
                        {edge.label}
                      </text>
                    </g>
                  );
                })}
              </g>

              {visibleNodes.map(node => {
                const dimmed = !!(connectedNodeIds && !connectedNodeIds.has(node.id));
                return (
                  <NodeCardSvg key={node.id} node={node} pos={positions[node.id]}
                    selected={node.id === selectedId}
                    dimmed={dimmed}
                    dragging={isDraggingNode && node.id === selectedId}
                    onMouseDown={(e: React.MouseEvent) => handleNodeDown(e, node.id)}/>
                );
              })}
            </svg>
          </div>
        </div>

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
