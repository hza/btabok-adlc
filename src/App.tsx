import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  PHASE_STYLES, PHASES, PHASE_LABEL,
  NODES, EDGES,
} from './btabok-adlc-model';
import type { Phase } from './btabok-adlc-model';
import { NODE_W, BAND_PADDING } from './constants';
import { computeEdgePaths } from './utils/edgeUtils';
import { useCanvasInteraction } from './hooks/useCanvasInteraction';
import NodeCard from './components/NodeCard';
import TopBar from './components/TopBar';
import { SelectedPanel, LegendPanel, PhasePanel } from './components/Sidebar';

const EDGE_GREY_COLORS: Record<number, string> = {
  1: 'rgba(30,30,30,0.30)',
  2: 'rgba(30,30,30,0.36)',
  3: 'rgba(30,30,30,0.40)',
  4: 'rgba(30,30,30,0.52)',
  5: 'rgba(30,30,30,0.68)',
  6: 'rgba(30,30,30,0.95)',
};

function edgeGreyColor(importance: number): string {
  return EDGE_GREY_COLORS[importance] ?? EDGE_GREY_COLORS[6];
}

const NODE_MAP = new Map(NODES.map(n => [n.id, n]));

export default function App() {
  const {
    positions, pan, scale, isPanning,
    handleWheel, startNodeDrag, startPanDrag,
    handleMouseMove, handleMouseUp,
    resetPositions, fitToScreen,
  } = useCanvasInteraction();

  const [selectedId,    setSelectedId]    = useState<string | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);
  const [showLabels,  setShowLabels]  = useState(true);
  const [showSwimlanes, setShowSwimlanes] = useState(true);
  const [showGrid,      setShowGrid]      = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [minImportance, setMinImportance] = useState(1);
  const [saved,       setSaved]       = useState(false);

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
  const panStartPos = useRef<{ x: number; y: number } | null>(null);

  const handleCanvasDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
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

  const infiniteGridStyle = useMemo(() => {
    const minor = 25 * scale;
    const major = 100 * scale;
    const offXMinor = ((pan.x % minor) + minor) % minor;
    const offYMinor = ((pan.y % minor) + minor) % minor;
    const offXMajor = ((pan.x % major) + major) % major;
    const offYMajor = ((pan.y % major) + major) % major;
    return {
      backgroundImage: [
        'linear-gradient(rgba(140,150,170,0.55) 1px, transparent 1px)',
        'linear-gradient(90deg, rgba(140,150,170,0.55) 1px, transparent 1px)',
        'linear-gradient(rgba(200,210,225,0.4) 1px, transparent 1px)',
        'linear-gradient(90deg, rgba(200,210,225,0.4) 1px, transparent 1px)',
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

  const visibleEdges = useMemo(
    () => EDGES.filter(e => e.importance >= minImportance),
    [minImportance],
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
          ✓ Copied to clipboard
        </div>
      )}
      <TopBar
        showLabels={showLabels}
        showSwimlanes={showSwimlanes}
        showGrid={showGrid}
        showSidebar={showLegend}
        saved={saved}
        onReset={resetPositions}
        onFit={() => containerRef.current && fitToScreen(containerRef.current)}
        onSave={handleSave}
        minImportance={minImportance}
        onMinImportanceChange={setMinImportance}
        onShowLabelsChange={setShowLabels}
        onShowSwimlanesChange={setShowSwimlanes}
        onShowGridChange={setShowGrid}
        onToggleSidebar={() => setShowLegend(v => !v)}
      />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* canvas */}
        <div
          ref={containerRef}
          style={{ flex: 1, overflow: 'hidden', position: 'relative',
            cursor: isPanning ? 'grabbing' : 'grab', background: '#FFFFFF',
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
            <svg width={canvasW} height={canvasH} overflow="visible"
              style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
              <defs>
                <marker id="mLo" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                  <polygon points="0 0,7 3.5,0 7" fill="#64748B"/>
                </marker>
                <marker id="mHi" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                  <polygon points="0 0,7 3.5,0 7" fill="#7F77DD"/>
                </marker>
                <marker id="mBtabok" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                  <polygon points="0 0,7 3.5,0 7" fill="#F5A44A"/>
                </marker>
              </defs>

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
                const opacity = dimS ? 0.18 : hi ? 1 : edge.btabok ? 0.72 : 0.52;
                const stroke  = hi ? '#7F77DD' : edge.btabok ? '#F5A44A' : edgeGreyColor(edge.importance);
                const sw      = hi ? 2.2 : edge.btabok ? 1.8 : 1.4;
                return (
                  <g key={edge.id} opacity={opacity}>
                    <path d={edge.path} fill="none"
                      stroke={stroke}
                      strokeWidth={sw}
                      markerEnd={`url(#${hi ? 'mHi' : edge.btabok ? 'mBtabok' : 'mLo'})`}/>
                    {showLabels && (
                      <text x={edge.mx} y={edge.my - 5}
                        textAnchor="middle" fontSize={12} fontFamily="system-ui"
                        fill={hi ? '#7F77DD' : edge.btabok ? '#111827' : '#1D4ED8'}
                        stroke="white" strokeWidth="2.8" paintOrder="stroke">
                        {edge.label}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {NODES.map(node => {
              const dimmed = !!(connectedNodeIds && !connectedNodeIds.has(node.id));
              return (
                <NodeCard key={node.id} node={node} pos={positions[node.id]}
                  selected={node.id === selectedId}
                  dimmed={dimmed}
                  onMouseDown={e => handleNodeDown(e, node.id)}
                  onHeightChange={handleHeightChange}/>
              );
            })}
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
