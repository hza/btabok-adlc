import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react';

import {
  BADGE_COLORS, BADGE_LABELS,
  PHASE_STYLES, PHASES, PHASE_LABEL,
  NODES, EDGES,
} from './model';
import type { Phase, NodeData, EdgeData } from './model';
import { NODE_POSITIONS } from './data';

// ─── constants ────────────────────────────────────────────────────────────────
const NODE_W   = 162;
const SNAP     = 20;

function snapV(v: number) { return Math.round(v / SNAP) * SNAP; }
function nodeH(n: NodeData) { return n.note ? 136 : 104; }

const INIT_POS = () =>
  Object.fromEntries(NODES.map(n => [n.id, { ...NODE_POSITIONS[n.id] }]));

// ─── NodeCard ─────────────────────────────────────────────────────────────────
interface CardProps {
  node: NodeData;
  pos: { x: number; y: number };
  selected: boolean;
  dimmed: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
}

const NodeCard = React.memo(function NodeCard({ node, pos, selected, dimmed, onMouseDown }: CardProps) {
  const bc = BADGE_COLORS[node.badgeColor] ?? '#888';

  let border: string;
  if (selected)         border = `2px solid ${bc}`;
  else if (node.external) border = `2px dashed ${BADGE_COLORS.amber}`;
  else if (node.recurring) border = '2px dashed #888780';
  else                  border = '1.5px solid #E2E8F0';

  return (
    <div
      data-node={node.id}
      onMouseDown={onMouseDown}
      style={{
        position: 'absolute',
        left: pos.x,
        top:  pos.y,
        width: NODE_W,
        background: '#FFFFFF',
        borderRadius: 8,
        border,
        boxShadow: selected
          ? `0 0 0 3px ${bc}33, 0 6px 20px rgba(0,0,0,0.16)`
          : '0 2px 8px rgba(0,0,0,0.08)',
        opacity: dimmed ? 0.85 : 1,
        cursor: 'grab',
        userSelect: 'none',
        transition: 'opacity 0.18s, box-shadow 0.15s',
        fontFamily: 'system-ui,-apple-system,sans-serif',
        zIndex: selected ? 10 : 1,
      }}
    >
      {/* badge row */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        padding: '6px 8px 4px', borderBottom: '1px solid #F1F5F9',
      }}>
        <span style={{
          background: '#F1F5F9', color: '#475569',
          borderRadius: 4, padding: '1px 6px',
          fontSize: 10, fontWeight: 700, flexShrink: 0,
        }}>{node.num}</span>
        <span style={{
          background: `${bc}18`, color: bc,
          borderRadius: 4, padding: '1px 5px',
          fontSize: 9, fontWeight: 600, lineHeight: 1.35,
          textAlign: 'right', maxWidth: 92,
        }}>{node.badge}</span>
      </div>

      {/* body */}
      <div style={{ padding: '6px 9px 8px' }}>
        <div style={{ fontWeight: 600, fontSize: 12, color: '#1E293B', lineHeight: 1.35, marginBottom: 3 }}>
          {node.title}
        </div>
        <div style={{ fontSize: 10, color: '#64748B', lineHeight: 1.45 }}>
          {node.subtitle}
        </div>
        {node.note && (
          <div style={{
            fontSize: 9, color: '#94A3B8', fontStyle: 'italic',
            lineHeight: 1.35, marginTop: 5,
            borderTop: '1px solid #F1F5F9', paddingTop: 4,
          }}>{node.note}</div>
        )}
      </div>
    </div>
  );
});

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>(INIT_POS);
  const [selectedId,  setSelectedId]  = useState<string | null>(null);
  const [phaseFilter, setPhaseFilter] = useState<Phase | null>(null);
  const [showLabels,  setShowLabels]  = useState(true);
  const [edgeFilter,  setEdgeFilter]  = useState<'all' | 'input'>('input');
  const [pan,   setPan]   = useState({ x: 24, y: 24 });
  const [scale, setScale] = useState(0.72);
  const [isPanning, setIsPanning] = useState(false);

  const containerRef  = useRef<HTMLDivElement>(null);
  const posRef        = useRef(positions);
  const panRef        = useRef(pan);
  const scaleRef      = useRef(scale);
  const dragNode      = useRef<{ id: string; sx: number; sy: number; ox: number; oy: number } | null>(null);
  const dragPan       = useRef<{ sx: number; sy: number; opx: number; opy: number } | null>(null);

  useEffect(() => { posRef.current   = positions; }, [positions]);
  useEffect(() => { panRef.current   = pan;        }, [pan]);
  useEffect(() => { scaleRef.current = scale;      }, [scale]);

  // ── wheel zoom ──────────────────────────────────────────────────────────────
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const rect = containerRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const factor = e.deltaY > 0 ? 0.9 : 1.11;
    const ns = Math.max(0.18, Math.min(3, scaleRef.current * factor));
    const ratio = ns / scaleRef.current;
    setPan(p => ({ x: mx - (mx - p.x) * ratio, y: my - (my - p.y) * ratio }));
    setScale(ns);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // ── pointer handlers ────────────────────────────────────────────────────────
  const handleCanvasDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest('[data-node]')) return;
    setSelectedId(null);
    dragPan.current = { sx: e.clientX, sy: e.clientY, opx: panRef.current.x, opy: panRef.current.y };
    setIsPanning(true);
  }, []);

  const handleNodeDown = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (e.button !== 0) return;
    setSelectedId(id);
    const pos = posRef.current[id];
    dragNode.current = { id, sx: e.clientX, sy: e.clientY, ox: pos.x, oy: pos.y };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragNode.current) {
      const { id, sx, sy, ox, oy } = dragNode.current;
      const dx = (e.clientX - sx) / scaleRef.current;
      const dy = (e.clientY - sy) / scaleRef.current;
      setPositions(cur => {
        const next = { ...cur, [id]: { x: snapV(ox + dx), y: snapV(oy + dy) } };

        // compute each phase's right edge then cascade-shift later phases to prevent overlap
        const bands = PHASES.map(ph => {
          const xs = NODES.filter(n => n.phase === ph).map(n => next[n.id].x);
          return { ph, maxX: Math.max(...xs) + NODE_W + 20 };
        });
        const gap = 3 * SNAP;
        for (let i = 1; i < bands.length; i++) {
          const phaseNodes = NODES.filter(n => n.phase === bands[i].ph);
          const minX = Math.min(...phaseNodes.map(n => next[n.id].x));
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
    dragNode.current = null;
    dragPan.current  = null;
    setIsPanning(false);
  }, []);

  // ── Copy positions ───────────────────────────────────────────────────────────
  const [copied, setCopied] = useState(false);

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

  // ── fit / reset ─────────────────────────────────────────────────────────────
  const handleReset = useCallback(() => setPositions(INIT_POS()), []);

  const handleFit = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    const ps = posRef.current;
    const xs = Object.values(ps).map(p => p.x);
    const ys = Object.values(ps).map(p => p.y);
    const minX = Math.min(...xs), minY = Math.min(...ys);
    const maxX = Math.max(...xs) + NODE_W;
    const maxY = Math.max(...ys) + 140;
    const ns = Math.min(0.98, (width - 48) / (maxX - minX), (height - 48) / (maxY - minY));
    setScale(ns);
    setPan({
      x: (width  - (maxX - minX) * ns) / 2 - minX * ns,
      y: (height - (maxY - minY) * ns) / 2 - minY * ns,
    });
  }, []);

  // ── derived state ────────────────────────────────────────────────────────────
  const canvasW = Math.max(...Object.values(positions).map(p => p.x)) + NODE_W + 80;
  const canvasH = Math.max(...Object.values(positions).map(p => p.y)) + 200 + 80;

  const gridStep20 = SNAP * scale;
  const gridStep100 = 100 * scale;
  const gridOffX20 = ((pan.x % gridStep20) + gridStep20) % gridStep20;
  const gridOffY20 = ((pan.y % gridStep20) + gridStep20) % gridStep20;
  const gridOffX100 = ((pan.x % gridStep100) + gridStep100) % gridStep100;
  const gridOffY100 = ((pan.y % gridStep100) + gridStep100) % gridStep100;
  const infiniteGridStyle = {
    backgroundImage: [
      'linear-gradient(#CBD5E1 0.35px, transparent 0.35px)',
      'linear-gradient(90deg, #CBD5E1 0.35px, transparent 0.35px)',
      'linear-gradient(#94A3B8 0.6px, transparent 0.6px)',
      'linear-gradient(90deg, #94A3B8 0.6px, transparent 0.6px)',
    ].join(','),
    backgroundSize: [
      `${gridStep20}px ${gridStep20}px`,
      `${gridStep20}px ${gridStep20}px`,
      `${gridStep100}px ${gridStep100}px`,
      `${gridStep100}px ${gridStep100}px`,
    ].join(','),
    backgroundPosition: [
      `${gridOffX20}px ${gridOffY20}px`,
      `${gridOffX20}px ${gridOffY20}px`,
      `${gridOffX100}px ${gridOffY100}px`,
      `${gridOffX100}px ${gridOffY100}px`,
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
    const xs = ns.map(n => positions[n.id].x);
    const minX = Math.min(...xs) - 20;
    const maxX = Math.max(...xs) + NODE_W + 20;
    return { ph, minX, maxX, style: PHASE_STYLES[ph] };
  }).filter(Boolean) as { ph: Phase; minX: number; maxX: number; style: { bg:string; band:string; text:string } }[];

  const edgePaths = visibleEdges.map(edge => {
    const fn = NODES.find(n => n.id === edge.from)!;
    const tn = NODES.find(n => n.id === edge.to)!;
    const fp = positions[edge.from];
    const tp = positions[edge.to];
    const x1 = fp.x + NODE_W, y1 = fp.y + nodeH(fn) / 2;
    const x2 = tp.x,          y2 = tp.y + nodeH(tn) / 2;
    const cp = Math.max(40, Math.abs(x2 - x1) * 0.42);
    return {
      ...edge,
      path: `M${x1},${y1} C${x1+cp},${y1} ${x2-cp},${y2} ${x2},${y2}`,
      mx: (x1 + x2) / 2,
      my: (y1 + y2) / 2,
    };
  });

  const selectedNode = selectedId ? NODES.find(n => n.id === selectedId) ?? null : null;
  const outgoing = selectedId
    ? visibleEdges.filter(e => e.from === selectedId).map(e => ({ e, n: NODES.find(n => n.id === e.to)! }))
    : [];
  const incoming = selectedId
    ? visibleEdges.filter(e => e.to === selectedId).map(e => ({ e, n: NODES.find(n => n.id === e.from)! }))
    : [];

  // ── render ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh',
      fontFamily:'system-ui,-apple-system,sans-serif', background:'#FFFFFF' }}>

      {/* ── top bar ── */}
      <div style={{
        background:'#1E293B', color:'#F1F5F9',
        padding:'7px 14px', display:'flex', alignItems:'center',
        gap:10, flexShrink:0, boxShadow:'0 2px 10px rgba(0,0,0,0.3)',
        flexWrap:'wrap',
      }}>
        <span style={{ fontWeight:800, fontSize:13, letterSpacing:'0.03em', marginRight:4 }}>
          BTABoK ADLC
        </span>
        <Divider/>
        <TopBtn onClick={handleReset}>Reset layout</TopBtn>
        <TopBtn onClick={handleFit}>Fit to screen</TopBtn>
        <TopBtn onClick={handleCopyPositions}>
          {copied ? '✓ Copied!' : 'Copy positions'}
        </TopBtn>
        <Divider/>
        {PHASES.map(ph => {
          const active = phaseFilter === ph;
          const s = PHASE_STYLES[ph];
          return (
            <button key={ph}
              onClick={() => setPhaseFilter(f => f === ph ? null : ph)}
              style={{
                background: active ? s.band : 'transparent',
                color: active ? s.text : s.band,
                border: `1px solid ${s.band}`,
                borderRadius: 20, padding: '3px 11px',
                fontSize: 11, cursor: 'pointer',
                fontFamily: 'inherit', fontWeight: active ? 700 : 400,
                transition: 'all 0.15s',
              }}
            >{PHASE_LABEL[ph]}</button>
          );
        })}
        <Divider/>
        <select
          value={edgeFilter}
          onChange={e => setEdgeFilter(e.target.value as 'all' | 'input')}
          style={{
            background:'#334155', color:'#CBD5E1', border:'1px solid #475569',
            borderRadius:5, padding:'3px 8px', fontSize:11,
            cursor:'pointer', fontFamily:'inherit',
          }}
        >
          <option value="all">All edges</option>
          <option value="input">Input flows</option>
        </select>
        <label style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, cursor:'pointer', color:'#94A3B8' }}>
          <input type="checkbox" checked={showLabels} onChange={e => setShowLabels(e.target.checked)}
            style={{ accentColor:'#7F77DD', cursor:'pointer' }}/>
          Edge labels
        </label>
        <span style={{ marginLeft:'auto', fontSize:10, color:'#475569' }}>
          {NODES.length} nodes · {visibleEdges.length} edges · scroll = zoom · drag canvas = pan
        </span>
      </div>

      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>

        {/* ── canvas ── */}
        <div
          ref={containerRef}
          style={{ flex:1, overflow:'hidden', position:'relative',
            cursor: isPanning ? 'grabbing' : 'grab', background:'#F8FAFC',
            ...infiniteGridStyle }}
          onMouseDown={handleCanvasDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div style={{
            position:'absolute', transformOrigin:'0 0',
            transform:`translate(${pan.x}px,${pan.y}px) scale(${scale})`,
          }}>
            {/* SVG layer: grid, bands, edges */}
            <svg width={canvasW} height={canvasH}
              style={{ position:'absolute', top:0, left:0, pointerEvents:'none' }}>
              <defs>
                <marker id="mLo" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                  <polygon points="0 0,7 3.5,0 7" fill="#64748B"/>
                </marker>
                <marker id="mHi" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                  <polygon points="0 0,7 3.5,0 7" fill="#7F77DD"/>
                </marker>
              </defs>

              {/* phase swim-lanes */}
              {phaseBands.map(({ ph, minX, maxX, style }) => (
                <g key={ph}>
                  <rect x={minX} y={0} width={maxX - minX} height={canvasH}
                    fill={style.bg} stroke={style.band} strokeWidth="1" opacity="0.72"/>
                  <rect x={minX} y={0} width={maxX - minX} height={5} fill={style.band}/>
                  <text x={minX + (maxX - minX) / 2} y={22} textAnchor="middle" fill={style.text}
                    fontSize={11} fontWeight={700} fontFamily="system-ui" opacity={0.85}>
                    {PHASE_LABEL[ph].toUpperCase()}
                  </text>
                </g>
              ))}

              {/* edges */}
              {edgePaths.map(edge => {
                const hi   = connectedEdgeIds ? connectedEdgeIds.has(edge.id) : false;
                const dimS = connectedEdgeIds ? !hi : false;
                const dimP = phaseFilter
                  ? !(NODES.find(n=>n.id===edge.from)?.phase===phaseFilter ||
                      NODES.find(n=>n.id===edge.to)?.phase===phaseFilter)
                  : false;
                const opacity = dimS || dimP ? 0.18 : hi ? 1 : 0.52;
                return (
                  <g key={edge.id} opacity={opacity}>
                    <path d={edge.path} fill="none"
                      stroke={hi ? '#7F77DD' : '#64748B'}
                      strokeWidth={hi ? 2.2 : 1.4}
                      markerEnd={`url(#${hi ? 'mHi' : 'mLo'})`}/>
                    {showLabels && (
                      <text x={edge.mx} y={edge.my - 5}
                        textAnchor="middle" fontSize={8}
                        fontFamily="system-ui"
                        fill={hi ? '#7F77DD' : '#475569'}
                        stroke="white" strokeWidth="2.8"
                        paintOrder="stroke">
                        {edge.label}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* node cards */}
            {NODES.map(node => {
              const dimSel   = connectedNodeIds && !connectedNodeIds.has(node.id);
              const dimPhase = phaseFilter && node.phase !== phaseFilter;
              return (
                <NodeCard key={node.id} node={node} pos={positions[node.id]}
                  selected={node.id === selectedId}
                  dimmed={!!(dimSel || dimPhase)}
                  onMouseDown={e => handleNodeDown(e, node.id)}/>
              );
            })}
          </div>
        </div>

        {/* ── sidebar ── */}
        <div style={{
          width:270, background:'#FFFFFF',
          borderLeft:'1px solid #E2E8F0',
          overflowY:'auto', flexShrink:0, fontSize:12, color:'#334155',
        }}>
          {selectedNode
            ? <SelectedPanel node={selectedNode} outgoing={outgoing} incoming={incoming}/>
            : <LegendPanel/>}
        </div>
      </div>
    </div>
  );
}

// ─── small UI atoms ───────────────────────────────────────────────────────────
function Divider() {
  return <div style={{ width:1, height:20, background:'#334155', flexShrink:0 }}/>;
}

function TopBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{
      background:'#334155', color:'#CBD5E1', border:'none',
      borderRadius:5, padding:'4px 10px', fontSize:11,
      cursor:'pointer', fontFamily:'inherit',
    }}>{children}</button>
  );
}

// ─── SelectedPanel ────────────────────────────────────────────────────────────
function SelectedPanel({
  node, outgoing, incoming,
}: {
  node: NodeData;
  outgoing: { e: EdgeData; n: NodeData }[];
  incoming: { e: EdgeData; n: NodeData }[];
}) {
  const bc = BADGE_COLORS[node.badgeColor] ?? '#888';
  return (
    <div style={{ padding:16 }}>
      <div style={{ display:'flex', alignItems:'flex-start', gap:8, marginBottom:10 }}>
        <span style={{ background:'#F1F5F9', color:'#475569', borderRadius:4,
          padding:'2px 8px', fontWeight:700, fontSize:14, flexShrink:0 }}>
          {node.num}
        </span>
        <span style={{ background:`${bc}18`, color:bc, borderRadius:4,
          padding:'2px 8px', fontSize:10, fontWeight:600, lineHeight:1.4 }}>
          {node.badge}
        </span>
      </div>
      <div style={{ fontWeight:700, fontSize:14, color:'#1E293B', lineHeight:1.35, marginBottom:5 }}>
        {node.title}
      </div>
      <div style={{ color:'#64748B', lineHeight:1.5, marginBottom:8 }}>{node.subtitle}</div>
      {node.note && (
        <div style={{ fontStyle:'italic', color:'#94A3B8', fontSize:11,
          padding:'8px 10px', background:'#F8FAFC', borderRadius:6,
          borderLeft:`3px solid ${bc}`, marginBottom:10, lineHeight:1.45 }}>
          {node.note}
        </div>
      )}
      <div style={{ fontSize:11, color:'#64748B', marginBottom:14 }}>
        Phase:&nbsp;<strong style={{ color:'#1E293B' }}>{PHASE_LABEL[node.phase]}</strong>
        {node.recurring && <span style={{ marginLeft:8, color:BADGE_COLORS.gray }}>● Recurring</span>}
        {node.external  && <span style={{ marginLeft:8, color:BADGE_COLORS.amber }}>● External</span>}
      </div>
      {node.link && (
        <a href={node.link} target="_blank" rel="noreferrer" style={{
          display:'block', marginBottom:14,
          padding:'7px 10px', borderRadius:6,
          background:'#F8FAFC', border:'1px solid #E2E8F0',
          fontSize:11, color:'#7F77DD', textDecoration:'none',
          wordBreak:'break-all', lineHeight:1.4,
        }}>
          ↗ {node.link.replace(/^https?:\/\//, '')}
        </a>
      )}
      {outgoing.length > 0 && <ConnList title={`→ Outgoing (${outgoing.length})`} items={outgoing} accent="#7F77DD"/>}
      {incoming.length > 0 && <ConnList title={`← Incoming (${incoming.length})`} items={incoming} accent="#1D9E75"/>}
    </div>
  );
}

function ConnList({ title, items, accent }: {
  title: string;
  items: { e: EdgeData; n: NodeData }[];
  accent: string;
}) {
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ fontWeight:600, fontSize:11, color:'#94A3B8', marginBottom:6,
        textTransform:'uppercase', letterSpacing:'0.05em' }}>{title}</div>
      {items.map(({ e, n }) => (
        <div key={e.id} style={{ marginBottom:5, padding:'7px 10px',
          background:'#F8FAFC', borderRadius:6, borderLeft:`3px solid ${accent}` }}>
          <div style={{ fontWeight:600, color:'#1E293B', fontSize:12 }}>{n.num}. {n.title}</div>
          <div style={{ color:'#94A3B8', fontSize:10, marginTop:2, fontStyle:'italic' }}>{e.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── LegendPanel ──────────────────────────────────────────────────────────────
function LegendPanel() {
  return (
    <div style={{ padding:16 }}>
      <div style={{ fontWeight:700, fontSize:14, color:'#1E293B', marginBottom:12 }}>Legend</div>

      <SectionLabel>Badge types</SectionLabel>
      {Object.entries(BADGE_COLORS).map(([key, color]) => (
        <div key={key} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:7 }}>
          <div style={{ width:11, height:11, borderRadius:3, background:color, flexShrink:0 }}/>
          <span style={{ color:'#334155', fontSize:11 }}>{BADGE_LABELS[key]}</span>
        </div>
      ))}

      <Hr/>

      <SectionLabel>Border styles</SectionLabel>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:7 }}>
        <div style={{ width:28, height:14, border:'2px dashed #888780', borderRadius:3, flexShrink:0 }}/>
        <span style={{ color:'#334155', fontSize:11 }}>Recurring artifact</span>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
        <div style={{ width:28, height:14, border:`2px dashed ${BADGE_COLORS.amber}`, borderRadius:3, flexShrink:0 }}/>
        <span style={{ color:'#334155', fontSize:11 }}>External standard (gap)</span>
      </div>

      <Hr/>

      <SectionLabel>Phases</SectionLabel>
      {PHASES.map(ph => {
        const s = PHASE_STYLES[ph];
        const count = NODES.filter(n => n.phase === ph).length;
        return (
          <div key={ph} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:7 }}>
            <div style={{ width:11, height:11, borderRadius:3, background:s.band, flexShrink:0 }}/>
            <span style={{ color:'#334155', fontSize:11 }}>{PHASE_LABEL[ph]}</span>
            <span style={{ color:'#94A3B8', fontSize:10, marginLeft:'auto' }}>{count}</span>
          </div>
        );
      })}

      <Hr/>

      <div style={{ background:'#F8FAFC', borderRadius:8, padding:'10px 12px',
        fontSize:11, color:'#64748B', lineHeight:1.7 }}>
        <strong style={{ color:'#1E293B', display:'block', marginBottom:4 }}>Statistics</strong>
        Nodes: <strong>{NODES.length}</strong><br/>
        Edges: <strong>{EDGES.length}</strong><br/>
        Phases: <strong>{PHASES.length}</strong>
      </div>

      <div style={{ marginTop:12, background:'#F8FAFC', borderRadius:8, padding:'10px 12px',
        fontSize:10, color:'#94A3B8', lineHeight:1.7 }}>
        <strong style={{ color:'#475569', display:'block', marginBottom:4 }}>Interactions</strong>
        Click a node to explore connections<br/>
        Drag nodes to rearrange<br/>
        Scroll to zoom · Drag canvas to pan<br/>
        Phase chips filter the view
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize:11, fontWeight:600, color:'#94A3B8', marginBottom:8,
      textTransform:'uppercase', letterSpacing:'0.05em' }}>{children}</div>
  );
}

function Hr() {
  return <div style={{ height:1, background:'#E2E8F0', margin:'12px 0' }}/>;
}
