import React from 'react';
import {
  badgeColor, BADGE_COLORS, BADGE_TYPES,
  PHASE_STYLES, PHASES, PHASE_LABEL,
  PHASE_DESCRIPTION, PHASE_GOAL, PHASE_KEY_QUESTIONS,
  NODES, IMPORTANCE_STYLES,
} from '../btabok-adlc-model';

const IMPORTANCE_KEY: Record<1 | 2 | 3, 'high' | 'extra' | 'ultra'> = { 1: 'high', 2: 'extra', 3: 'ultra' };
import type { NodeData, EdgeData, Phase } from '../btabok-adlc-model';

// ─── SelectedPanel ────────────────────────────────────────────────────────────

interface SelectedPanelProps {
  node: NodeData;
  outgoing: { e: EdgeData; n: NodeData }[];
  incoming: { e: EdgeData; n: NodeData }[];
  onPhaseClick: (ph: Phase) => void;
}

export const SelectedPanel = React.memo(function SelectedPanel({ node, outgoing, incoming, onPhaseClick }: SelectedPanelProps) {
  const bc = badgeColor(node.badge);
  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
        <span style={{ background: '#F1F5F9', color: '#475569', borderRadius: 4,
          padding: '2px 8px', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
          {node.num}
        </span>
        <span style={{ fontWeight: 700, fontSize: 16, color: '#1E293B', lineHeight: 1.35 }}>
          {node.title}
        </span>
      </div>
      <div style={{ color: '#64748B', lineHeight: 1.5, marginBottom: 8 }}>{node.subtitle}</div>
      {node.note && (
        <div style={{ fontStyle: 'italic', color: '#94A3B8', fontSize: 13,
          padding: '8px 10px', background: '#F8FAFC', borderRadius: 6,
          borderLeft: `3px solid ${bc}`, marginBottom: 10, lineHeight: 1.45 }}>
          {node.note}
        </div>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: node.importance ? 6 : 8 }}>
        <Tag label={PHASE_LABEL[node.phase] + ' Phase'} dot={PHASE_STYLES[node.phase].band} onClick={() => onPhaseClick(node.phase)} />
        {node.external  && <Tag label="External" dot={BADGE_COLORS.amber} />}
        {node.importance && <ImportanceTag importance={IMPORTANCE_KEY[node.importance]} />}
        <span style={{ background: `${bc}18`, color: bc, borderRadius: 4,
          padding: '1px 6px', fontSize: 10, fontWeight: 600, lineHeight: 1.4, alignSelf: 'center' }}>
          {node.badge}
        </span>
      </div>
      {node.importance && (
        <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.5, marginBottom: 10,
          padding: '6px 10px', background: `${IMPORTANCE_STYLES[IMPORTANCE_KEY[node.importance]].bg}99`,
          borderRadius: 6, borderLeft: `3px solid ${IMPORTANCE_STYLES[IMPORTANCE_KEY[node.importance]].color}` }}>
          {IMPORTANCE_STYLES[IMPORTANCE_KEY[node.importance]].rationale}
        </div>
      )}
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
});

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
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <span style={{ fontWeight: 600, color: '#1E293B', fontSize: 14, flex: 1 }}>{n.num}. {n.title}</span>
            {(() => { const s = IMPORTANCE_STYLES[IMPORTANCE_KEY[e.importance]]; return (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3,
                background: s.bg, borderRadius: 20, padding: '1px 7px',
                fontSize: 10, color: s.color, fontWeight: 600, flexShrink: 0 }}>
                ★ {s.label}
              </span>
            ); })()}
          </div>
          <div style={{ color: '#94A3B8', fontSize: 12, fontStyle: 'italic' }}>{e.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── PhasePanel ───────────────────────────────────────────────────────────────

interface PhasePanelProps {
  phase: Phase;
  onClose: () => void;
}

export const PhasePanel = React.memo(function PhasePanel({ phase, onClose }: PhasePanelProps) {
  const style  = PHASE_STYLES[phase];
  const nodes  = NODES.filter(n => n.phase === phase);

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{ width: 12, height: 12, borderRadius: 3, background: style.band, flexShrink: 0 }}/>
        <div style={{ fontWeight: 700, fontSize: 17, color: '#1E293B', flex: 1 }}>
          {PHASE_LABEL[phase]}
        </div>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer',
            color: '#94A3B8', fontSize: 18, lineHeight: 1, padding: '0 2px' }}>
          ×
        </button>
      </div>

      <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.6,
        padding: '10px 12px', background: '#F8FAFC', borderRadius: 8,
        borderLeft: `3px solid ${style.band}`, marginBottom: 14 }}>
        {PHASE_DESCRIPTION[phase]}
      </div>

      <div style={{ marginBottom: 14 }}>
        <SectionLabel>Goal</SectionLabel>
        <div style={{ fontSize: 13, color: '#1E293B', fontWeight: 500, lineHeight: 1.5 }}>
          {PHASE_GOAL[phase]}
        </div>
      </div>

      <Hr/>

      <SectionLabel>Key questions</SectionLabel>
      <div style={{ marginBottom: 14 }}>
        {PHASE_KEY_QUESTIONS[phase].map((q, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 7, alignItems: 'flex-start' }}>
            <span style={{ color: style.band, fontWeight: 700, fontSize: 14, lineHeight: 1.4, flexShrink: 0 }}>?</span>
            <span style={{ fontSize: 13, color: '#334155', lineHeight: 1.5 }}>{q}</span>
          </div>
        ))}
      </div>

      <Hr/>

      <SectionLabel>Artifacts ({nodes.length})</SectionLabel>
      <div style={{ marginBottom: 6 }}>
        {nodes.map(n => {
          const bc = badgeColor(n.badge);
          return (
            <div key={n.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 8,
              marginBottom: 6, padding: '7px 10px', background: '#F8FAFC', borderRadius: 6,
              borderLeft: `3px solid ${bc}` }}>
              <span style={{ color: '#94A3B8', fontWeight: 700, fontSize: 12, flexShrink: 0, paddingTop: 1 }}>
                {n.num}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1E293B', lineHeight: 1.35 }}>{n.title}</div>
                <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 1 }}>{n.subtitle}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

// ─── LegendPanel ──────────────────────────────────────────────────────────────

export const LegendPanel = React.memo(function LegendPanel() {
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

          <SectionLabel>Importance levels</SectionLabel>
          {(Object.entries(IMPORTANCE_STYLES) as [string, { label: string; color: string; bg: string; rationale: string }][]).map(([key, s]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 3,
                background: s.bg, borderRadius: 20, flexShrink: 0,
                padding: '2px 8px', fontSize: 11, color: s.color, fontWeight: 600,
              }}>★ {s.label}</span>
              <span style={{ color: '#475569', fontSize: 12, lineHeight: 1.5 }}>{s.rationale}</span>
            </div>
          ))}

          <Hr/>

          <div style={{ marginTop: 12, background: '#F8FAFC', borderRadius: 8, padding: '10px 12px',
            fontSize: 12, color: '#94A3B8', lineHeight: 1.7 }}>
            <strong style={{ color: '#475569', display: 'block', marginBottom: 4 }}>Interactions</strong>
            Click a node to explore connections<br/>
            Drag nodes to rearrange<br/>
            Scroll or drag canvas to pan<br/>
            Phase chips filter the view
          </div>
    </div>
  );
});

function ImportanceTag({ importance }: { importance: 'high' | 'extra' | 'ultra' }) {
  const s = IMPORTANCE_STYLES[importance];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: s.bg, borderRadius: 20,
      padding: '2px 9px', fontSize: 11, color: s.color, fontWeight: 600,
    }}>
      ★ {s.label}
    </span>
  );
}

function Tag({ label, dot, onClick }: { label: string; dot?: string; onClick?: () => void }) {
  return (
    <span onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: '#F1F5F9', borderRadius: 20,
      padding: '2px 9px', fontSize: 11, color: '#334155', fontWeight: 500,
      ...(onClick && { cursor: 'pointer' }),
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot, flexShrink: 0 }}/>}
      {label}
    </span>
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
