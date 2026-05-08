import React from 'react';

interface TopBarProps {
  minImportance: number;
  showLabels: boolean;
  showSwimlanes: boolean;
  showSidebar: boolean;
  copied: boolean;
  nodeCount: number;
  edgeCount: number;
  onReset: () => void;
  onFit: () => void;
  onCopyPositions: () => void;
  onMinImportanceChange: (v: number) => void;
  onShowLabelsChange: (v: boolean) => void;
  onShowSwimlanesChange: (v: boolean) => void;
  onToggleSidebar: () => void;
}

export default function TopBar({
  minImportance, showLabels, showSwimlanes, showSidebar, copied,
  nodeCount, edgeCount,
  onReset, onFit, onCopyPositions,
  onMinImportanceChange, onShowLabelsChange, onShowSwimlanesChange, onToggleSidebar,
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
      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#94A3B8' }}>
        Edge details:
        <input
          type="range" min={1} max={6} value={7 - minImportance}
          onChange={e => onMinImportanceChange(7 - Number(e.target.value))}
          style={{ accentColor: '#7F77DD', width: 80, cursor: 'pointer' }}
        />
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, cursor: 'pointer', color: '#94A3B8' }}>
        <input type="checkbox" checked={showLabels} onChange={e => onShowLabelsChange(e.target.checked)}
          style={{ accentColor: '#7F77DD', cursor: 'pointer' }}/>
        Edge labels
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, cursor: 'pointer', color: '#94A3B8' }}>
        <input type="checkbox" checked={showSwimlanes} onChange={e => onShowSwimlanesChange(e.target.checked)}
          style={{ accentColor: '#7F77DD', cursor: 'pointer' }}/>
        Swimlanes
      </label>
      <span style={{ marginLeft: 'auto', fontSize: 12, color: '#475569' }}>
        {nodeCount} nodes · {edgeCount} edges · scroll = zoom · drag canvas = pan
      </span>
      <Divider/>
      <button
        onClick={onToggleSidebar}
        title={showSidebar ? 'Hide sidebar' : 'Show sidebar'}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#94A3B8', fontSize: 18, lineHeight: 1, padding: '2px 4px',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1.5" y="1.5" width="15" height="15" rx="2" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="12" y1="1.5" x2="12" y2="16.5" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      </button>
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
