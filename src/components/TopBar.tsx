import React from 'react';

interface TopBarProps {
  cardImportanceLevel: 1 | 2 | 3;
  showSwimlanes: boolean;
  showGrid: boolean;
  showSidebar: boolean;
  saved: boolean;
  editMode: boolean;
  onReset: () => void;
  onFit: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onSave: () => void;
  onCardImportanceLevelChange: (v: 1 | 2 | 3) => void;
  onShowSwimlanesChange: (v: boolean) => void;
  onShowGridChange: (v: boolean) => void;
  onToggleSidebar: () => void;
  onToggleEditMode: () => void;
  onDownload: () => void;
}

const TopBar = React.memo(function TopBar({
  cardImportanceLevel, showSwimlanes, showGrid, showSidebar, saved, editMode,
  onReset, onFit, onSave, onZoomIn, onZoomOut, onDownload,
  onCardImportanceLevelChange, onShowSwimlanesChange, onShowGridChange, onToggleSidebar, onToggleEditMode,
}: TopBarProps) {
  return (
    <div style={{
      background: '#1E293B', color: '#F1F5F9',
      padding: '7px 14px', display: 'flex', alignItems: 'center',
      gap: 10, flexShrink: 0, boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
      flexWrap: 'wrap',
    }}>
      <span style={{ fontWeight: 800, fontSize: 16, fontFamily: 'sans-serif', letterSpacing: '-0.5px', marginRight: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width="22" height="22" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* 5-phase BTABoK ADLC cycle — nodes at 72° intervals, clockwise from top */}
          {/* Connecting arcs between nodes */}
          <path d="M22 5 A17 17 0 0 1 38.17 18.23" stroke="#94A3B8" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
          <path d="M38.17 18.23 A17 17 0 0 1 31.37 38.14" stroke="#94A3B8" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
          <path d="M31.37 38.14 A17 17 0 0 1 12.63 38.14" stroke="#94A3B8" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
          <path d="M12.63 38.14 A17 17 0 0 1 5.83 18.23" stroke="#94A3B8" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
          <path d="M5.83 18.23 A17 17 0 0 1 22 5" stroke="#94A3B8" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
          {/* Arrowheads — small triangles along each arc */}
          <polygon points="38.17,18.23 35.5,15.2 39.6,14.8" fill="#94A3B8"/>
          <polygon points="31.37,38.14 28.0,37.5 30.5,40.8" fill="#94A3B8"/>
          <polygon points="12.63,38.14 13.5,40.9 10.1,37.6" fill="#94A3B8"/>
          <polygon points="5.83,18.23 4.3,21.5 3.0,17.4"   fill="#94A3B8"/>
          <polygon points="22,5 19.0,7.2 24.8,7.4"          fill="#94A3B8"/>
          {/* Phase nodes — colored dots */}
          <circle cx="22"    cy="5"     r="3.5" fill="#7F77DD"/>  {/* Innovation */}
          <circle cx="38.17" cy="18.23" r="3.5" fill="#60A5FA"/>  {/* Strategy */}
          <circle cx="31.37" cy="38.14" r="3.5" fill="#34D399"/>  {/* Planning */}
          <circle cx="12.63" cy="38.14" r="3.5" fill="#FBBF24"/>  {/* Transformation */}
          <circle cx="5.83"  cy="18.23" r="3.5" fill="#F87171"/>  {/* Utilize & Measure */}
        </svg>
        BTABoK Architecture Development Life Cycle
      </span>
      <span style={{ marginLeft: 'auto' }}/>
      <Divider/>
      {editMode && <IconBtn onClick={onSave} title={saved ? 'Copied!' : 'Copy positions to clipboard'} style={{ color: saved ? '#4ADE80' : '#94A3B8' }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="4" y="4" width="10" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="6.5" y="2.5" width="5" height="3" rx="1" stroke="currentColor" strokeWidth="1.3" fill="none"/>
          <text x="5.5" y="13.5" fontSize="5.5" fontWeight="bold" fill="currentColor" fontFamily="sans-serif">XY</text>
        </svg>
      </IconBtn>}
      <IconBtn onClick={onToggleEditMode} title={editMode ? 'Exit edit mode' : 'Enter edit mode (drag nodes)'}
        style={{ color: editMode ? '#7F77DD' : '#94A3B8' }}>
        {editMode ? (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.5 6.25c0-.69-.56-1.25-1.25-1.25-.18 0-.35.04-.5.1V4.25a1.25 1.25 0 0 0-2.45-.34A1.25 1.25 0 0 0 7 5.25v.1A1.25 1.25 0 0 0 5 6.5v3.75l-.66-.83a1.25 1.25 0 0 0-1.93 1.58l2.1 2.63A4.25 4.25 0 0 0 7.83 15h1.92A3.75 3.75 0 0 0 13.5 11.25V6.25zm-1.25.25a.25.25 0 0 1 .25.25v4.5a2.75 2.75 0 0 1-2.75 2.75H7.83a3.25 3.25 0 0 1-2.55-1.22L3.18 10.2a.25.25 0 0 1 .39-.32L5 11.5V6.5a.25.25 0 0 1 .5 0v3h1V5.25a.25.25 0 0 1 .5 0V9.5h1V4.25a.25.25 0 0 1 .5 0V9.5h1V6.25a.25.25 0 0 1 .25-.25z"/>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3 15 L4.5 10.5 L12 3 L15 6 L7.5 13.5 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" fill="none"/>
            <line x1="10.5" y1="4.5" x2="13.5" y2="7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        )}
      </IconBtn>
      <Divider/>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#94A3B8' }}>
        LOD:
        <input
          type="range" min={1} max={3}
          value={4 - cardImportanceLevel}
          onChange={e => onCardImportanceLevelChange((4 - Number(e.target.value)) as 1 | 2 | 3)}
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
      <IconBtn onClick={onDownload} title="Download as SVG">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <line x1="9" y1="2" x2="9" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <polyline points="5.5,8.5 9,12.5 12.5,8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="2.5" y1="15.5" x2="15.5" y2="15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
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
      <a href="https://github.com/hza/btabok-adlc/" target="_blank" rel="noopener noreferrer" title="View on GitHub"
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
