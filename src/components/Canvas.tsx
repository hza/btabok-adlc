import React, { memo } from 'react';
import { PHASE_LABEL, IMP_COLOR } from '../btabok-adlc-model';
import type { Phase, NodeData } from '../btabok-adlc-model';
import NodeCardSvg, { NodeStackLayer } from './NodeCardSvg';
import { SCROLL_SURFACE } from '../constants';

interface EdgePath {
  id: string;
  from: string;
  to: string;
  path: string;
  mx: number;
  my: number;
  label: string;
  importance: 1 | 2 | 3;
}

interface PhaseBand {
  ph: Phase;
  minX: number;
  maxX: number;
  style: { bg: string; band: string; text: string };
}

interface CanvasProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  containerDivRef: React.RefObject<HTMLDivElement | null>;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  transformGRef: React.RefObject<SVGGElement | null>;
  svgRef: React.RefObject<SVGSVGElement | null>;
  canvasH: number;
  isDraggingNode: boolean;
  showGrid: boolean;
  showGridRef: React.RefObject<boolean>;
  infiniteGridStyle: React.CSSProperties;
  showSwimlanes: boolean;
  phaseBands: PhaseBand[];
  selectedPhase: Phase | null;
  edgePaths: EdgePath[];
  connectedEdgeIds: Set<string> | null;
  connectedNodeIds: Set<string> | null;
  visibleNodes: NodeData[];
  selectedId: string | null;
  positions: Record<string, { x: number; y: number }>;
  onCanvasDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onCanvasUp: (e: React.MouseEvent) => void;
  onNodeDown: (e: React.MouseEvent, id: string) => void;
}

interface SvgContentProps {
  svgRef: React.RefObject<SVGSVGElement | null>;
  transformGRef: React.RefObject<SVGGElement | null>;
  canvasH: number;
  isDraggingNode: boolean;
  showSwimlanes: boolean;
  phaseBands: PhaseBand[];
  selectedPhase: Phase | null;
  edgePaths: EdgePath[];
  connectedEdgeIds: Set<string> | null;
  connectedNodeIds: Set<string> | null;
  visibleNodes: NodeData[];
  selectedId: string | null;
  positions: Record<string, { x: number; y: number }>;
  onNodeDown: (e: React.MouseEvent, id: string) => void;
}

const SvgContent = memo(function SvgContent({
  svgRef, transformGRef, canvasH,
  isDraggingNode, showSwimlanes, phaseBands, selectedPhase,
  edgePaths, connectedEdgeIds, connectedNodeIds,
  visibleNodes, selectedId, positions, onNodeDown,
}: SvgContentProps) {
  return (
    <svg ref={svgRef}
      style={{ position: 'absolute', top: 0, left: 0, width: SCROLL_SURFACE, height: SCROLL_SURFACE, overflow: 'visible' }}>
      <defs>
        {/* Arrowhead markers for highlighted edges — outgoing (blue), incoming (green), default (purple) */}
        <marker id="mHi-out" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <polygon points="0 0,7 3.5,0 7" fill="#2563EB"/>
        </marker>
        <marker id="mHi-in" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <polygon points="0 0,7 3.5,0 7" fill="#16A34A"/>
        </marker>
        <marker id="mHi-def" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <polygon points="0 0,7 3.5,0 7" fill="#7F77DD"/>
        </marker>

        {/* Arrowhead markers for edges of different importance levels */}
        {([1, 2, 3] as const).map(imp => (
          <marker key={imp} id={`mImp${imp}`} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <polygon points="0 0,7 3.5,0 7" fill={IMP_COLOR[imp]}/>
          </marker>
        ))}
        
        {/* Drop shadow filters for nodes — stronger shadow for selected node */}
        <filter id="nodeShadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(0,0,0,0.08)"/>
        </filter>
        
        {/* Stronger shadow for selected node to make it pop more */}
        <filter id="nodeShadowSelected" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="rgba(0,0,0,0.16)"/>
        </filter>
      </defs>

      {/* All canvas content lives in this <g> — the hook sets its transform attribute directly */}
      <g ref={transformGRef}>

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
        </g>

        {/* 1: recurring stack layers */}
        {visibleNodes.map(node => (
          <NodeStackLayer key={node.id} node={node} pos={positions[node.id]}/>
        ))}

        {/* 2: edges */}
        <g pointerEvents="none">
          {edgePaths.map(edge => {
            const hi       = connectedEdgeIds ? connectedEdgeIds.has(edge.id) : false;
            const dimS     = connectedEdgeIds ? !hi : false;
            const impColor = IMP_COLOR[edge.importance];
            const opacity  = dimS ? 0.35 : hi ? 1 : 0.55;
            const isOutgoing = hi && selectedId === edge.from;
            const isIncoming = hi && selectedId === edge.to;
            const hiColor  = isOutgoing ? '#586fa1' : isIncoming ? '#528866' : '#7F77DD';
            const stroke   = hi ? hiColor : impColor;
            const sw       = hi ? 2.2 : edge.importance === 3 ? 2 : edge.importance === 2 ? 1.7 : 1.3;
            const markerId = hi ? `mHi-${isOutgoing ? 'out' : isIncoming ? 'in' : 'def'}` : `mImp${edge.importance}`;
            return (
              <g key={edge.id} opacity={opacity}>
                <path d={edge.path} fill="none"
                  stroke={stroke}
                  strokeWidth={sw}
                  markerEnd={`url(#${markerId})`}/>
                {edge.label && (() => {
                  const words = edge.label.split(' ');
                  const mid = Math.ceil(words.length / 2);
                  const line1 = words.slice(0, mid).join(' ');
                  const line2 = words.slice(mid).join(' ');
                  return (
                    <text x={edge.mx} y={edge.my - 10}
                      textAnchor="middle" fontSize={12} fontFamily="system-ui"
                      fill={hi ? stroke : '#000000'}
                      stroke="white" strokeWidth="2.8" paintOrder="stroke"
                      style={{ userSelect: 'none' }}>
                      <tspan x={edge.mx} dy="0">{line1}</tspan>
                      {line2 && <tspan x={edge.mx} dy="15">{line2}</tspan>}
                    </text>
                  );
                })()}
              </g>
            );
          })}
        </g>

        {/* 3: cards */}
        {visibleNodes.map(node => {
          const dimmed = !!(connectedNodeIds && !connectedNodeIds.has(node.id));
          return (
            <NodeCardSvg key={node.id} node={node} pos={positions[node.id]}
              selected={node.id === selectedId}
              dimmed={dimmed}
              dragging={isDraggingNode && node.id === selectedId}
              onMouseDown={(e: React.MouseEvent) => onNodeDown(e, node.id)}/>
          );
        })}

      </g>
    </svg>
  );
});

export default function Canvas({
  containerRef, containerDivRef, scrollContainerRef, transformGRef,
  svgRef, canvasH,
  isDraggingNode,
  showGrid, showGridRef, infiniteGridStyle,
  showSwimlanes, phaseBands, selectedPhase,
  edgePaths, connectedEdgeIds, connectedNodeIds,
  visibleNodes, selectedId, positions,
  onCanvasDown, onMouseMove, onCanvasUp, onNodeDown,
}: CanvasProps) {
  // Keep showGridRef in sync so the hook's direct DOM writes apply the grid correctly
  showGridRef.current = showGrid;

  return (
    <div
      ref={(el) => {
        (containerRef as { current: HTMLDivElement | null }).current = el;
        (containerDivRef as { current: HTMLDivElement | null }).current = el;
      }}
      style={{
        flex: 1, overflow: 'hidden', position: 'relative',
        cursor: isDraggingNode ? 'grabbing' : 'grab',
        background: '#FFFFFF',
        userSelect: 'none',
        ...(showGrid ? infiniteGridStyle : {}),
      }}
      onMouseDown={onCanvasDown}
      onMouseMove={onMouseMove}
      onMouseUp={onCanvasUp}
      onMouseLeave={onCanvasUp}
    >
      {/* Native scroll surface — browser handles momentum panning */}
      <div
        ref={(el) => { (scrollContainerRef as { current: HTMLDivElement | null }).current = el; }}
        className="btabook-scroll-surface"
        style={{
          position: 'absolute', inset: 0,
          overflow: 'scroll',
          scrollbarWidth: 'none',
          overscrollBehavior: 'none',
        }}
      >
        <div style={{ width: SCROLL_SURFACE, height: SCROLL_SURFACE, position: 'relative' }}>
          <SvgContent
            svgRef={svgRef} transformGRef={transformGRef} canvasH={canvasH}
            isDraggingNode={isDraggingNode}
            showSwimlanes={showSwimlanes} phaseBands={phaseBands} selectedPhase={selectedPhase}
            edgePaths={edgePaths} connectedEdgeIds={connectedEdgeIds} connectedNodeIds={connectedNodeIds}
            visibleNodes={visibleNodes} selectedId={selectedId} positions={positions}
            onNodeDown={onNodeDown}
          />
        </div>
      </div>
    </div>
  );
}
