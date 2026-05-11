import React, { memo } from 'react';
import { PHASE_LABEL, IMP_COLOR } from '../btabok-adlc-model';
import type { Phase, NodeData } from '../btabok-adlc-model';
import NodeCardSvg from './NodeCardSvg';

interface EdgePath {
  id: string;
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
  transformDivRef: React.RefObject<HTMLDivElement | null>;
  svgRef: React.RefObject<SVGSVGElement | null>;
  canvasW: number;
  canvasH: number;
  pan: { x: number; y: number };
  scale: number;
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
  canvasW: number;
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
  svgRef, canvasW, canvasH,
  isDraggingNode, showSwimlanes, phaseBands, selectedPhase,
  edgePaths, connectedEdgeIds, connectedNodeIds,
  visibleNodes, selectedId, positions, onNodeDown,
}: SvgContentProps) {
  return (
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
          const hi      = connectedEdgeIds ? connectedEdgeIds.has(edge.id) : false;
          const dimS    = connectedEdgeIds ? !hi : false;
          const impColor = IMP_COLOR[edge.importance];
          const opacity = dimS ? 0.35 : hi ? 1 : 0.55;
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
            onMouseDown={(e: React.MouseEvent) => onNodeDown(e, node.id)}/>
        );
      })}
    </svg>
  );
});

export default function Canvas({
  containerRef, containerDivRef, transformDivRef,
  svgRef, canvasW, canvasH,
  pan, scale, isDraggingNode,
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
        ...(showGrid ? infiniteGridStyle : {}),
      }}
      onMouseDown={onCanvasDown}
      onMouseMove={onMouseMove}
      onMouseUp={onCanvasUp}
      onMouseLeave={onCanvasUp}
    >
      <div
        ref={transformDivRef}
        style={{
          position: 'absolute', transformOrigin: '0 0',
          transform: `translate(${pan.x}px,${pan.y}px) scale(${scale})`,
        }}
      >
        <SvgContent
          svgRef={svgRef} canvasW={canvasW} canvasH={canvasH}
          isDraggingNode={isDraggingNode}
          showSwimlanes={showSwimlanes} phaseBands={phaseBands} selectedPhase={selectedPhase}
          edgePaths={edgePaths} connectedEdgeIds={connectedEdgeIds} connectedNodeIds={connectedNodeIds}
          visibleNodes={visibleNodes} selectedId={selectedId} positions={positions}
          onNodeDown={onNodeDown}
        />
      </div>
    </div>
  );
}
