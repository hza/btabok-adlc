import React from 'react';

interface TopBarProps {
  minImportance: number;
  showLabels: boolean;
  showSwimlanes: boolean;
  showSidebar: boolean;
  saved: boolean;
  onReset: () => void;
  onFit: () => void;
  onSave: () => void;
  onMinImportanceChange: (v: number) => void;
  onShowLabelsChange: (v: boolean) => void;
  onShowSwimlanesChange: (v: boolean) => void;
  onToggleSidebar: () => void;
}

export default function TopBar({
  minImportance, showLabels, showSwimlanes, showSidebar, saved,
  onReset, onFit, onSave,
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
      <span style={{ marginLeft: 'auto' }}/>
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
      <IconBtn onClick={onSave} title={saved ? 'Saved!' : 'Save positions'} style={{ color: saved ? '#4ADE80' : '#94A3B8' }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M3 2h9.5L15 4.5V15a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
          <rect x="6" y="2" width="5" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.4"/>
          <rect x="5" y="9" width="8" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.4"/>
        </svg>
      </IconBtn>
      <Divider/>
      <IconBtn onClick={onReset} title="Reset zoom to 100%">
        <span style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', letterSpacing: '-0.5px' }}>100%</span>
      </IconBtn>
      <IconBtn onClick={onFit} title="Fit to screen">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.4"/>
          {/* NW */}
          <line x1="7.5" y1="7.5" x2="2.5" y2="2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          <polyline points="2.5,5.5 2.5,2.5 5.5,2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          {/* NE */}
          <line x1="10.5" y1="7.5" x2="15.5" y2="2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          <polyline points="12.5,2.5 15.5,2.5 15.5,5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          {/* SW */}
          <line x1="7.5" y1="10.5" x2="2.5" y2="15.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          <polyline points="5.5,15.5 2.5,15.5 2.5,12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          {/* SE */}
          <line x1="10.5" y1="10.5" x2="15.5" y2="15.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          <polyline points="15.5,12.5 15.5,15.5 12.5,15.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </IconBtn>
      <Divider/>
      <IconBtn onClick={onToggleSidebar} title={showSidebar ? 'Hide sidebar' : 'Show sidebar'}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="1.5" y="1.5" width="15" height="15" rx="2" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="12" y1="1.5" x2="12" y2="16.5" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      </IconBtn>
    </div>
  );
}

function Divider() {
  return <div style={{ width: 1, height: 20, background: '#334155', flexShrink: 0 }}/>;
}

function IconBtn({ onClick, title, children, style }: { onClick: () => void; title: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <button onClick={onClick} title={title} style={{
      background: 'none', border: 'none', cursor: 'pointer',
      color: '#94A3B8', lineHeight: 1, padding: '2px 4px', display: 'flex', alignItems: 'center',
      ...style,
    }}>{children}</button>
  );
}
