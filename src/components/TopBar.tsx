import React from 'react';

interface TopBarProps {
  edgeFilter: 'all' | 'input';
  minImportance: number;
  showLabels: boolean;
  copied: boolean;
  nodeCount: number;
  edgeCount: number;
  onReset: () => void;
  onFit: () => void;
  onCopyPositions: () => void;
  onEdgeFilterChange: (v: 'all' | 'input') => void;
  onMinImportanceChange: (v: number) => void;
  onShowLabelsChange: (v: boolean) => void;
}

export default function TopBar({
  edgeFilter, minImportance, showLabels, copied,
  nodeCount, edgeCount,
  onReset, onFit, onCopyPositions,
  onEdgeFilterChange, onMinImportanceChange, onShowLabelsChange,
}: TopBarProps) {
  return (
    <div style={{
      background: '#1E293B', color: '#F1F5F9',
      padding: '7px 14px', display: 'flex', alignItems: 'center',
      gap: 10, flexShrink: 0, boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
      flexWrap: 'wrap',
    }}>
      <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: '0.03em', marginRight: 4 }}>
        BTABoK ADLC
      </span>
      <Divider/>
      <TopBtn onClick={onReset}>Reset layout</TopBtn>
      <TopBtn onClick={onFit}>Fit to screen</TopBtn>
      <TopBtn onClick={onCopyPositions}>{copied ? '✓ Copied!' : 'Copy positions'}</TopBtn>
      <Divider/>
      <select
        value={edgeFilter}
        onChange={e => onEdgeFilterChange(e.target.value as 'all' | 'input')}
        style={{
          background: '#334155', color: '#CBD5E1', border: '1px solid #475569',
          borderRadius: 5, padding: '3px 8px', fontSize: 13,
          cursor: 'pointer', fontFamily: 'inherit',
        }}
      >
        <option value="all">All edges</option>
        <option value="input">Input flows</option>
      </select>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#94A3B8' }}>
        Min importance:
        <input
          type="range" min={1} max={6} value={7 - minImportance}
          onChange={e => onMinImportanceChange(7 - Number(e.target.value))}
          style={{ accentColor: '#7F77DD', width: 80, cursor: 'pointer' }}
        />
        <span style={{ minWidth: 14, color: '#CBD5E1' }}>{minImportance}</span>
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, cursor: 'pointer', color: '#94A3B8' }}>
        <input type="checkbox" checked={showLabels} onChange={e => onShowLabelsChange(e.target.checked)}
          style={{ accentColor: '#7F77DD', cursor: 'pointer' }}/>
        Edge labels
      </label>
      <span style={{ marginLeft: 'auto', fontSize: 12, color: '#475569' }}>
        {nodeCount} nodes · {edgeCount} edges · scroll = zoom · drag canvas = pan
      </span>
    </div>
  );
}

function Divider() {
  return <div style={{ width: 1, height: 20, background: '#334155', flexShrink: 0 }}/>;
}

function TopBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{
      background: '#334155', color: '#CBD5E1', border: 'none',
      borderRadius: 5, padding: '4px 10px', fontSize: 13,
      cursor: 'pointer', fontFamily: 'inherit',
    }}>{children}</button>
  );
}
