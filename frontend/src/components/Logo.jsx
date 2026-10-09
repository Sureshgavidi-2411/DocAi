import React from 'react';

const Logo = ({ collapsed = false, size = 'default' }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', userSelect: 'none' }}>
      {/* Custom Geometric Document + AI Sparkle Badge */}
      <div
        style={{
          width: size === 'large' ? '40px' : '32px',
          height: size === 'large' ? '40px' : '32px',
          borderRadius: '9px',
          background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          position: 'relative',
          boxShadow: '0 2px 10px rgba(37, 99, 235, 0.35)',
          flexShrink: 0,
        }}
      >
        <svg
          width={size === 'large' ? '22' : '18'}
          height={size === 'large' ? '22' : '18'}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Document outline */}
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          {/* AI Sparkle in center */}
          <path
            d="M12 18v-4m-2 2h4"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {!collapsed && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span
            style={{
              fontSize: size === 'large' ? '1.35rem' : '1.05rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
            }}
          >
            DocIntel
          </span>
          <span
            style={{
              fontSize: '0.685rem',
              fontWeight: 700,
              padding: '0.15rem 0.4rem',
              borderRadius: '4px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))',
              color: '#60a5fa',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              letterSpacing: '0.05em',
            }}
          >
            AI
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
