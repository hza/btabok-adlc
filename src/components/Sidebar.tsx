import React from 'react';
import {
  badgeColor, BADGE_COLORS, BADGE_TYPES,
  PHASE_STYLES, PHASES, PHASE_LABEL,
  NODES,
} from '../model';
import type { NodeData, EdgeData } from '../model';

// ─── SelectedPanel ────────────────────────────────────────────────────────────

const IMPORTANCY_LABEL: Record<NodeData['importancy'], string> = {
  1: 'High',
  2: 'Medium',
};

interface SelectedPanelProps {
  node: NodeData;
  outgoing: { e: EdgeData; n: NodeData }[];
  incoming: { e: EdgeData; n: NodeData }[];
}

export function SelectedPanel({ node, outgoing, incoming }: SelectedPanelProps) {
  const bc = badgeColor(node.badge);
  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
        <span style={{ background: '#F1F5F9', color: '#475569', borderRadius: 4,
          padding: '2px 8px', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
          {node.num}
        </span>
        <span style={{ background: `${bc}18`, color: bc, borderRadius: 4,
          padding: '2px 8px', fontSize: 12, fontWeight: 600, lineHeight: 1.4 }}>
          {node.badge}
        </span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 16, color: '#1E293B', lineHeight: 1.35, marginBottom: 5 }}>
        {node.title}
      </div>
      <div style={{ color: '#64748B', lineHeight: 1.5, marginBottom: 8 }}>{node.subtitle}</div>
      {node.note && (
        <div style={{ fontStyle: 'italic', color: '#94A3B8', fontSize: 13,
          padding: '8px 10px', background: '#F8FAFC', borderRadius: 6,
          borderLeft: `3px solid ${bc}`, marginBottom: 10, lineHeight: 1.45 }}>
          {node.note}
        </div>
      )}
      <div style={{ fontSize: 13, color: '#64748B', marginBottom: 6 }}>
        Phase:&nbsp;<strong style={{ color: '#1E293B' }}>{PHASE_LABEL[node.phase]}</strong>
        <br/>
        Importancy:&nbsp;<strong style={{ color: '#1E293B' }}>{IMPORTANCY_LABEL[node.importancy]}</strong>
        {node.recurring && <span style={{ marginLeft: 8, color: BADGE_COLORS.gray }}>● Multiple</span>}
        {node.external  && <span style={{ marginLeft: 8, color: BADGE_COLORS.amber }}>● External</span>}
      </div>
      <div style={{ fontSize: 12, color: '#64748B', fontStyle: 'italic', lineHeight: 1.5,
        padding: '6px 10px', background: '#F8FAFC', borderRadius: 6,
        borderLeft: '3px solid #CBD5E1', marginBottom: 14 }}>
        {node.importancyReason}
      </div>
      {node.link && (
        <a href={node.link} target="_blank" rel="noreferrer" style={{
          display: 'block', marginBottom: 14,
          padding: '7px 10px', borderRadius: 6,
          background: '#F8FAFC', border: '1px solid #E2E8F0',
          fontSize: 13, color: '#7F77DD', textDecoration: 'none',
          wordBreak: 'break-all', lineHeight: 1.4,
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
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontWeight: 600, fontSize: 13, color: '#94A3B8', marginBottom: 6,
        textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</div>
      {items.map(({ e, n }) => (
        <div key={e.id} style={{ marginBottom: 5, padding: '7px 10px',
          background: '#F8FAFC', borderRadius: 6, borderLeft: `3px solid ${accent}` }}>
          <div style={{ fontWeight: 600, color: '#1E293B', fontSize: 14 }}>{n.num}. {n.title}</div>
          <div style={{ color: '#94A3B8', fontSize: 12, marginTop: 2, fontStyle: 'italic' }}>{e.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── LegendPanel ──────────────────────────────────────────────────────────────

export function LegendPanel() {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontWeight: 700, fontSize: 16, color: '#1E293B', marginBottom: 12 }}>Legend</div>

      <SectionLabel>Badge types</SectionLabel>
          {BADGE_TYPES.map(({ badge, color, description }) => (
            <div key={badge} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
              <span style={{ background: `${color}18`, color, borderRadius: 4,
                padding: '1px 6px', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                {badge}
              </span>
              <span style={{ color: '#334155', fontSize: 13 }}>{description}</span>
            </div>
          ))}

          <Hr/>

          <SectionLabel>Border styles</SectionLabel>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
            <div style={{ width: 28, height: 14, border: '2px dashed #888780', borderRadius: 3, flexShrink: 0 }}/>
            <span style={{ color: '#334155', fontSize: 13 }}>Multiple artifact</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{ width: 28, height: 14, border: `2px dashed ${BADGE_COLORS.amber}`, borderRadius: 3, flexShrink: 0 }}/>
            <span style={{ color: '#334155', fontSize: 13 }}>External (gap)</span>
          </div>

          <Hr/>

          <SectionLabel>Phases</SectionLabel>
          {PHASES.map(ph => {
            const s = PHASE_STYLES[ph];
            const count = NODES.filter(n => n.phase === ph).length;
            return (
              <div key={ph} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                <div style={{ width: 11, height: 11, borderRadius: 3, background: s.band, flexShrink: 0 }}/>
                <span style={{ color: '#334155', fontSize: 13 }}>{PHASE_LABEL[ph]}</span>
                <span style={{ color: '#94A3B8', fontSize: 12, marginLeft: 'auto' }}>{count}</span>
              </div>
            );
          })}

          <Hr/>

          <div style={{ marginTop: 12, background: '#F8FAFC', borderRadius: 8, padding: '10px 12px',
            fontSize: 12, color: '#94A3B8', lineHeight: 1.7 }}>
            <strong style={{ color: '#475569', display: 'block', marginBottom: 4 }}>Interactions</strong>
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
    <div style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8', marginBottom: 8,
      textTransform: 'uppercase', letterSpacing: '0.05em' }}>{children}</div>
  );
}

function Hr() {
  return <div style={{ height: 1, background: '#E2E8F0', margin: '12px 0' }}/>;
}
