import React from 'react';

interface TopBarProps {
  cardImportanceLevel: 'high' | 'extra' | 'ultra';
  showSwimlanes: boolean;
  showGrid: boolean;
  showSidebar: boolean;
  saved: boolean;
  onReset: () => void;
  onFit: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onSave: () => void;
  onCardImportanceLevelChange: (v: 'high' | 'extra' | 'ultra') => void;
  onShowSwimlanesChange: (v: boolean) => void;
  onShowGridChange: (v: boolean) => void;
  onToggleSidebar: () => void;
}

const TopBar = React.memo(function TopBar({
  cardImportanceLevel, showSwimlanes, showGrid, showSidebar, saved,
  onReset, onFit, onSave, onZoomIn, onZoomOut,
  onCardImportanceLevelChange, onShowSwimlanesChange, onShowGridChange, onToggleSidebar,
}: TopBarProps) {
  return (
    <div style={{
      background: '#1E293B', color: '#F1F5F9',
      padding: '7px 14px', display: 'flex', alignItems: 'center',
      gap: 10, flexShrink: 0, boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
      flexWrap: 'wrap',
    }}>
      <span style={{ fontWeight: 800, fontSize: 16, fontFamily: 'sans-serif', letterSpacing: '-0.5px', marginRight: 4 }}>
        BTABoK Architecture Development Life Cycle
      </span>
      <span style={{ marginLeft: 'auto' }}/>
      <Divider/>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#94A3B8' }}>
        LOD:
        <input
          type="range" min={1} max={3}
          value={cardImportanceLevel === 'ultra' ? 1 : cardImportanceLevel === 'extra' ? 2 : 3}
          onChange={e => {
            const v = Number(e.target.value);
            onCardImportanceLevelChange(v === 1 ? 'ultra' : v === 2 ? 'extra' : 'high');
          }}
          style={{ accentColor: '#7F77DD', width: 80, cursor: 'pointer' }}
        />
        {/* <span style={{ fontSize: 12, color: '#CBD5E1', minWidth: 90 }}>
          {cardImportanceLevel === 'ultra' ? 'ultra' : cardImportanceLevel === 'extra' ? 'ultra & extra' : 'all cards'}
        </span> */}
      </label>
<IconBtn onClick={() => onShowSwimlanesChange(!showSwimlanes)} title={showSwimlanes ? 'Hide swimlanes' : 'Show swimlanes'}
        style={{ color: showSwimlanes ? '#7F77DD' : '#94A3B8' }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="1.5" y="1.5" width="15" height="15" rx="2" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="6.5" y1="1.5" x2="6.5" y2="16.5" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="11.5" y1="1.5" x2="11.5" y2="16.5" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      </IconBtn>
      <IconBtn onClick={() => onShowGridChange(!showGrid)} title={showGrid ? 'Hide grid' : 'Show grid'}
        style={{ color: showGrid ? '#7F77DD' : '#94A3B8' }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <line x1="6" y1="1.5" x2="6" y2="16.5" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="12" y1="1.5" x2="12" y2="16.5" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="1.5" y1="6" x2="16.5" y2="6" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="1.5" y1="12" x2="16.5" y2="12" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      </IconBtn>
      <IconBtn onClick={onSave} title={saved ? 'Copied!' : 'Copy positions to clipboard'} style={{ color: saved ? '#4ADE80' : '#94A3B8' }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <line x1="2" y1="16" x2="2" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="2" y1="16" x2="15" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <text x="4" y="13" fontSize="7" fontWeight="bold" fill="currentColor" fontFamily="sans-serif">XY</text>
        </svg>
      </IconBtn>
      <Divider/>
      <IconBtn onClick={onZoomOut} title="Zoom out">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="5.5" y1="8" x2="10.5" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="12.5" y1="12.5" x2="16" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </IconBtn>
      <IconBtn onClick={onReset} title="Reset zoom to 100%">
        <span style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', letterSpacing: '-0.5px' }}>100%</span>
      </IconBtn>
      <IconBtn onClick={onZoomIn} title="Zoom in">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="8" y1="5.5" x2="8" y2="10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="5.5" y1="8" x2="10.5" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="12.5" y1="12.5" x2="16" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
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
      <a href="https://github.com/hza/btabook-adlc/" target="_blank" rel="noopener noreferrer" title="View on GitHub"
        style={{ color: '#94A3B8', display: 'flex', alignItems: 'center', padding: '2px 4px' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
        </svg>
      </a>
      <Divider/>
      <IconBtn onClick={onToggleSidebar} title={showSidebar ? 'Hide sidebar' : 'Show sidebar'}>
        {showSidebar ? (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="1.5" y="1.5" width="15" height="15" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="12" y="1.5" width="4.5" height="15" rx="2" fill="currentColor"/>
            <line x1="12" y1="1.5" x2="12" y2="16.5" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="1.5" y="1.5" width="15" height="15" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            <line x1="12" y1="1.5" x2="12" y2="16.5" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        )}
      </IconBtn>
    </div>
  );
});

export default TopBar;

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
