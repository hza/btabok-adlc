import React from 'react';
import { badgeColor } from '../btabok-adlc-model';
import type { NodeData } from '../btabok-adlc-model';
import { NODE_W } from '../constants';
import {
  CONTENT_X, HEADER_H, LINE_TITLE, LINE_SUB, LINE_NOTE,
  nodeLines, computeNodeSvgHeight,
} from '../utils/nodeLayout';

interface CardProps {
  node: NodeData;
  pos: { x: number; y: number };
  selected: boolean;
  dimmed: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  dragging?: boolean;
}

const NodeCardSvg = React.memo(function NodeCardSvg({
  node, pos, selected, dimmed, onMouseDown, dragging,
}: CardProps) {
  const bc = badgeColor(node.badge);
  const h  = computeNodeSvgHeight(node);
  const { titleLines, subtitleLines, noteLines } = nodeLines(node);

  // Badge pill sizing
  const isGroup    = node.group === node.id;
  const badgeLabel = isGroup ? 'Group' : node.badge;
  const badgePillW = Math.min(72, badgeLabel.length * 7.5 + 10);
  const badgePillX = NODE_W - 8 - badgePillW;

  // Accumulated y for text baselines
  const TITLE_FONT  = 16;
  const titleBaseY  = HEADER_H + 6 + TITLE_FONT - 2; // ≈ 48
  let   y           = titleBaseY + (titleLines.length - 1) * LINE_TITLE;
  y += 4; // gap before subtitle
  const subBaseY    = y + LINE_SUB;
  y = subBaseY + (subtitleLines.length - 1) * LINE_SUB;
  const noteDividerY = y + 8;
  const noteBaseY    = noteDividerY + 5 + LINE_NOTE - 2;

  return (
    <g
      transform={`translate(${pos.x},${pos.y})`}
      data-node={node.id}
      onMouseDown={onMouseDown}
      style={{ cursor: dragging ? 'grabbing' : 'grab', userSelect: 'none' }}
      opacity={dimmed ? 0.85 : 1}
    >
      {/* card background */}
      <rect x={0} y={0} width={NODE_W} height={h} rx={8}
        fill="#FFFFFF"
        stroke={selected ? bc : '#E2E8F0'}
        strokeWidth={2}
        filter={selected ? 'url(#nodeShadowSelected)' : 'url(#nodeShadow)'}/>

      {/* selected glow ring */}
      {selected && (
        <rect x={-2} y={-2} width={NODE_W + 4} height={h + 4} rx={10}
          fill="none" stroke={bc} strokeWidth="2" opacity="0.35"/>
      )}

      {/* header background — two rects to square off bottom corners */}
      <rect x={2} y={2} width={NODE_W - 4} height={HEADER_H - 2} rx={6} fill="#FFFFFF"/>
      <rect x={2} y={HEADER_H / 2} width={NODE_W - 4} height={HEADER_H / 2} fill="#FFFFFF"/>

      {/* num badge */}
      <rect x={8} y={5} width={28} height={18} rx={4} fill="#F1F5F9"/>
      <text x={22} y={18} textAnchor="middle"
        fontSize={13} fontWeight={700} fill="#475569"
        fontFamily="system-ui,-apple-system,sans-serif">
        {node.num}
      </text>

      {/* badge pill */}
      <rect x={badgePillX} y={5} width={badgePillW} height={18} rx={4} fill={isGroup ? '#EDE9FE' : `${bc}18`}/>
      <text x={badgePillX + badgePillW / 2} y={18} textAnchor="middle"
        fontSize={12} fontWeight={600} fill={isGroup ? '#6D28D9' : bc}
        fontFamily="system-ui,-apple-system,sans-serif">
        {badgeLabel}
      </text>

      {/* title */}
      <text fontSize={16} fontWeight={600} fill="#1E293B"
        fontFamily="system-ui,-apple-system,sans-serif">
        {titleLines.map((line, i) => (
          <tspan key={i} x={CONTENT_X} y={titleBaseY + i * LINE_TITLE}>{line}</tspan>
        ))}
      </text>

      {/* subtitle */}
      <text fontSize={13} fill="#64748B"
        fontFamily="system-ui,-apple-system,sans-serif">
        {subtitleLines.map((line, i) => (
          <tspan key={i} x={CONTENT_X} y={subBaseY + i * LINE_SUB}>{line}</tspan>
        ))}
      </text>

      {/* note */}
      {noteLines.length > 0 && (
        <>
          <line x1={CONTENT_X} y1={noteDividerY} x2={NODE_W - CONTENT_X} y2={noteDividerY}
            stroke="#F1F5F9" strokeWidth="1"/>
          <text fontSize={12} fill="#94A3B8" fontStyle="italic"
            fontFamily="system-ui,-apple-system,sans-serif">
            {noteLines.map((line, i) => (
              <tspan key={i} x={CONTENT_X} y={noteBaseY + i * LINE_NOTE}>{line}</tspan>
            ))}
          </text>
        </>
      )}
    </g>
  );
});

export default NodeCardSvg;

export function NodeStackLayer({ node, pos }: { node: NodeData; pos: { x: number; y: number } }) {
  if (!node.multiple) return null;
  const h = computeNodeSvgHeight(node);
  return (
    <g transform={`translate(${pos.x},${pos.y})`} pointerEvents="none">
      <rect x={8} y={8} width={NODE_W} height={h} rx={8}
        fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5"/>
      <rect x={4} y={4} width={NODE_W} height={h} rx={8}
        fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5"/>
    </g>
  );
}
