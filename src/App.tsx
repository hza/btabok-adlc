import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  PHASE_STYLES, PHASES, PHASE_LABEL,
  NODES, EDGES,
} from './model';
import type { Phase } from './model';
import { NODE_W } from './constants';
import { computeEdgePaths } from './utils/edgeUtils';
import { useCanvasInteraction } from './hooks/useCanvasInteraction';
import NodeCard from './components/NodeCard';
import TopBar from './components/TopBar';
import { SelectedPanel, LegendPanel } from './components/Sidebar';

function edgeGreyColor(importance: number): string {
  // importance 1 → rgba light, importance 10 → near-black
  // use opacity to exaggerate the spread at the low end
  const opacity = 0.15 + 0.85 * ((importance - 1) / 9) ** 1.4;
  return `rgba(30,30,30,${opacity.toFixed(2)})`;
}

export default function App() {
  const {
    positions, pan, scale, isPanning,
    handleWheel, startNodeDrag, startPanDrag,
    handleMouseMove, handleMouseUp,
    resetPositions, fitToScreen,
  } = useCanvasInteraction();

  const [selectedId,  setSelectedId]  = useState<string | null>(null);
  const [phaseFilter, setPhaseFilter] = useState<Phase | null>(null);
  const [showLabels,  setShowLabels]  = useState(true);
  const [edgeFilter,  setEdgeFilter]  = useState<'all' | 'input'>('input');
  const [copied,      setCopied]      = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const [nodeHeights, setNodeHeights] = useState<Record<string, number>>({});
  const handleHeightChange = useCallback((id: string, h: number) => {
    setNodeHeights(prev => prev[id] === h ? prev : { ...prev, [id]: h });
  }, []);

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
  const handleCanvasDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-node]')) return;
    setSelectedId(null);
    startPanDrag(e);
  }, [startPanDrag]);

  const handleNodeDown = useCallback((e: React.MouseEvent, id: string) => {
    setSelectedId(id);
    startNodeDrag(e, id);
  }, [startNodeDrag]);

  // ── copy positions ───────────────────────────────────────────────────────────
  const handleCopyPositions = useCallback(() => {
    const entries = Object.entries(positions)
      .map(([id, pos]) => `  ${id}: { x:${pos.x}, y:${pos.y} },`)
      .join('\n');
    const src = `export const NODE_POSITIONS: Record<string, { x: number; y: number }> = {\n${entries}\n};\n`;
    navigator.clipboard.writeText(src).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [positions]);

  // ── derived ──────────────────────────────────────────────────────────────────
  const canvasW = Math.max(...Object.values(positions).map(p => p.x)) + NODE_W + 80;
  const canvasH = Math.max(...Object.values(positions).map(p => p.y)) + 200 + 80;

  const gridStep20  = 20 * scale;
  const gridStep100 = 100 * scale;
  const gridOffX20  = ((pan.x % gridStep20)  + gridStep20)  % gridStep20;
  const gridOffY20  = ((pan.y % gridStep20)  + gridStep20)  % gridStep20;
  const gridOffX100 = ((pan.x % gridStep100) + gridStep100) % gridStep100;
  const gridOffY100 = ((pan.y % gridStep100) + gridStep100) % gridStep100;

  const infiniteGridStyle = {
    backgroundImage: [
      'linear-gradient(rgba(203,213,225,0.35) 0.35px, transparent 0.35px)',
      'linear-gradient(90deg, rgba(203,213,225,0.35) 0.35px, transparent 0.35px)',
      'linear-gradient(rgba(148,163,184,0.12) 0.6px, transparent 0.6px)',
      'linear-gradient(90deg, rgba(148,163,184,0.1) 0.6px, transparent 0.6px)',
    ].join(','),
    backgroundSize: [
      `${gridStep20}px ${gridStep20}px`, `${gridStep20}px ${gridStep20}px`,
      `${gridStep100}px ${gridStep100}px`, `${gridStep100}px ${gridStep100}px`,
    ].join(','),
    backgroundPosition: [
      `${gridOffX20}px ${gridOffY20}px`, `${gridOffX20}px ${gridOffY20}px`,
      `${gridOffX100}px ${gridOffY100}px`, `${gridOffX100}px ${gridOffY100}px`,
    ].join(','),
  };

  const visibleEdges = edgeFilter === 'input' ? EDGES.filter(e => e.tag === 'input') : EDGES;

  const connectedEdgeIds = selectedId
    ? new Set(visibleEdges.filter(e => e.from === selectedId || e.to === selectedId).map(e => e.id))
    : null;
  const connectedNodeIds = selectedId
    ? new Set([selectedId, ...visibleEdges
        .filter(e => e.from === selectedId || e.to === selectedId)
        .flatMap(e => [e.from, e.to])])
    : null;

  const phaseBands = PHASES.map(ph => {
    const ns = NODES.filter(n => n.phase === ph);
    if (!ns.length) return null;
    const xs   = ns.map(n => positions[n.id].x);
    const minX = Math.min(...xs) - 20;
    const maxX = Math.max(...xs) + NODE_W + 20;
    return { ph, minX, maxX, style: PHASE_STYLES[ph] };
  }).filter(Boolean) as { ph: Phase; minX: number; maxX: number; style: { bg:string; band:string; text:string } }[];

  const edgePaths = computeEdgePaths(visibleEdges, positions, nodeHeights);

  const selectedNode = selectedId ? NODES.find(n => n.id === selectedId) ?? null : null;
  const outgoing = selectedId
    ? visibleEdges.filter(e => e.from === selectedId).map(e => ({ e, n: NODES.find(n => n.id === e.to)! }))
    : [];
  const incoming = selectedId
    ? visibleEdges.filter(e => e.to === selectedId).map(e => ({ e, n: NODES.find(n => n.id === e.from)! }))
    : [];

  // ── render ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh',
      fontFamily: 'system-ui,-apple-system,sans-serif', background: '#FFFFFF' }}>

      <TopBar
        phaseFilter={phaseFilter}
        edgeFilter={edgeFilter}
        showLabels={showLabels}
        copied={copied}
        nodeCount={NODES.length}
        edgeCount={visibleEdges.length}
        onReset={resetPositions}
        onFit={() => containerRef.current && fitToScreen(containerRef.current)}
        onCopyPositions={handleCopyPositions}
        onPhaseFilter={ph => setPhaseFilter(f => f === ph ? null : ph)}
        onEdgeFilterChange={setEdgeFilter}
        onShowLabelsChange={setShowLabels}
      />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* canvas */}
        <div
          ref={containerRef}
          style={{ flex: 1, overflow: 'hidden', position: 'relative',
            cursor: isPanning ? 'grabbing' : 'grab', background: '#FFFFFF',
            ...infiniteGridStyle }}
          onMouseDown={handleCanvasDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div style={{
            position: 'absolute', transformOrigin: '0 0',
            transform: `translate(${pan.x}px,${pan.y}px) scale(${scale})`,
          }}>
            <svg width={canvasW} height={canvasH} overflow="visible"
              style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
              <defs>
                <marker id="mLo" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                  <polygon points="0 0,7 3.5,0 7" fill="#64748B"/>
                </marker>
                <marker id="mHi" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                  <polygon points="0 0,7 3.5,0 7" fill="#7F77DD"/>
                </marker>
              </defs>

              {phaseBands.map(({ ph, minX, maxX, style }) => (
                <g key={ph}>
                  <rect x={minX} y={0} width={maxX - minX} height={canvasH}
                    fill={style.bg} stroke={style.band} strokeWidth="1" opacity="0.72"/>
                  <rect x={minX} y={0} width={maxX - minX} height={5} fill={style.band}/>
                  <text x={minX + (maxX - minX) / 2} y={22} textAnchor="middle" fill={style.text}
                    fontSize={13} fontWeight={700} fontFamily="system-ui" opacity={0.85}>
                    {PHASE_LABEL[ph].toUpperCase()}
                  </text>
                </g>
              ))}

              {edgePaths.map(edge => {
                const hi   = connectedEdgeIds ? connectedEdgeIds.has(edge.id) : false;
                const dimS = connectedEdgeIds ? !hi : false;
                const dimP = phaseFilter
                  ? !(NODES.find(n => n.id === edge.from)?.phase === phaseFilter ||
                      NODES.find(n => n.id === edge.to)?.phase === phaseFilter)
                  : false;
                const opacity = dimS || dimP ? 0.18 : hi ? 1 : 0.52;
                return (
                  <g key={edge.id} opacity={opacity}>
                    <path d={edge.path} fill="none"
                      stroke={hi ? '#7F77DD' : edgeGreyColor(edge.importance)}
                      strokeWidth={hi ? 2.2 : 1.4}
                      markerEnd={`url(#${hi ? 'mHi' : 'mLo'})`}/>
                    {showLabels && (
                      <text x={edge.mx} y={edge.my - 5}
                        textAnchor="middle" fontSize={12} fontFamily="system-ui"
                        fill={hi ? '#7F77DD' : '#1D4ED8'}
                        stroke="white" strokeWidth="2.8" paintOrder="stroke">
                        {edge.label}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {NODES.map(node => {
              const dimSel   = connectedNodeIds && !connectedNodeIds.has(node.id);
              const dimPhase = phaseFilter && node.phase !== phaseFilter;
              return (
                <NodeCard key={node.id} node={node} pos={positions[node.id]}
                  selected={node.id === selectedId}
                  dimmed={!!(dimSel || dimPhase)}
                  onMouseDown={e => handleNodeDown(e, node.id)}
                  onHeightChange={handleHeightChange}/>
              );
            })}
          </div>
        </div>

        {/* sidebar */}
        <div style={{
          width: 270, background: '#FFFFFF',
          borderLeft: '1px solid #E2E8F0',
          overflowY: 'auto', flexShrink: 0, fontSize: 14, color: '#334155',
        }}>
          {selectedNode
            ? <SelectedPanel node={selectedNode} outgoing={outgoing} incoming={incoming}/>
            : <LegendPanel/>}
        </div>
      </div>
    </div>
  );
}
