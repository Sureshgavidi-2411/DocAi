import React from 'react';
import { Menu, Sun, Moon, Bell, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ onMenuClick, title = 'Dashboard' }) => {
  const { user } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <header
      style={{
        height: 'var(--header-height)',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 800,
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Left Title / Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <button
          onClick={onMenuClick}
          className="menu-toggle-btn btn btn-ghost"
          style={{
            padding: '6px',
            display: 'none',
          }}
          aria-label="Toggle Navigation"
        >
          <Menu size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>DocIntel</span>
          <span style={{ color: 'var(--text-subtle)', fontSize: '0.825rem' }}>/</span>
          <h1
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}
          >
            {title}
          </h1>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* System Online Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.25rem 0.65rem',
            background: 'var(--success-bg)',
            border: '1px solid var(--success-border)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            color: 'var(--success)',
            fontWeight: 500,
          }}
          className="desktop-status"
        >
          <span className="badge-dot" style={{ background: 'var(--success)', boxShadow: '0 0 6px var(--success)' }} />
          <span>RAG Online</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="btn btn-ghost"
          style={{
            padding: '6px',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-secondary)',
          }}
          title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle Theme"
        >
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Notification Icon */}
        <button
          className="btn btn-ghost"
          style={{
            padding: '6px',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-secondary)',
            position: 'relative',
          }}
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell size={17} />
          <span
            style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--primary)',
            }}
          />
        </button>

        {/* Divider */}
        <div style={{ width: '1px', height: '20px', background: 'var(--border)' }} />

        {/* User Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '0.8rem',
              fontWeight: 600,
            }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span
            style={{
              fontSize: '0.85rem',
              fontWeight: 500,
              color: 'var(--text-primary)',
            }}
            className="desktop-username"
          >
            {user?.name || 'User'}
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .menu-toggle-btn {
            display: flex !important;
          }
          header {
            padding: 0 1.25rem !important;
          }
        }
        @media (max-width: 640px) {
          .desktop-status, .desktop-username {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
