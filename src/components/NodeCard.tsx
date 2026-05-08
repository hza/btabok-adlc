import React, { useRef, useEffect } from 'react';
import { BADGE_COLORS } from '../model';
import type { NodeData } from '../model';
import { NODE_W } from '../constants';

interface CardProps {
  node: NodeData;
  pos: { x: number; y: number };
  selected: boolean;
  dimmed: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onHeightChange?: (id: string, height: number) => void;
}

const NodeCard = React.memo(function NodeCard({ node, pos, selected, dimmed, onMouseDown, onHeightChange }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!cardRef.current || !onHeightChange) return;
    const h = cardRef.current.offsetHeight;
    if (h > 0) onHeightChange(node.id, h);
  });

  const bc = BADGE_COLORS[node.badgeColor] ?? '#888';

  let border: string;
  if (selected)          border = `2px solid ${bc}`;
  else if (node.external)  border = `2px dashed ${BADGE_COLORS.amber}`;
  else if (node.recurring) border = '2px dashed #888780';
  else                   border = '1.5px solid #E2E8F0';

  return (
    <div
      ref={cardRef}
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
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        padding: '6px 8px 4px', borderBottom: '1px solid #F1F5F9',
      }}>
        <span style={{
          background: '#F1F5F9', color: '#475569',
          borderRadius: 4, padding: '1px 6px',
          fontSize: 13, fontWeight: 700, flexShrink: 0,
        }}>{node.num}</span>
        <span style={{
          background: `${bc}18`, color: bc,
          borderRadius: 4, padding: '1px 5px',
          fontSize: 12, fontWeight: 600, lineHeight: 1.35,
          textAlign: 'right', maxWidth: 92,
        }}>{node.badge}</span>
      </div>

      <div style={{ padding: '6px 9px 8px' }}>
        <div style={{ fontWeight: 600, fontSize: 16, color: '#1E293B', lineHeight: 1.35, marginBottom: 3 }}>
          {node.title}
        </div>
        <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.45 }}>
          {node.subtitle}
        </div>
        {node.note && (
          <div style={{
            fontSize: 12, color: '#94A3B8', fontStyle: 'italic',
            lineHeight: 1.35, marginTop: 5,
            borderTop: '1px solid #F1F5F9', paddingTop: 4,
          }}>{node.note}</div>
        )}
      </div>
    </div>
  );
});

export default NodeCard;
