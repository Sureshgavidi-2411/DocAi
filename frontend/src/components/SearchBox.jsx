import React, { useRef, useEffect } from 'react';
import { ArrowUp, Loader2, Paperclip, Sparkles } from 'lucide-react';

const SearchBox = ({
  query,
  setQuery,
  onSearch,
  loading,
  placeholder = 'Ask anything about your documents...',
}) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSearch();
    }
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    // Auto-grow height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
      {/* Input Container */}
      <div
        className="card"
        style={{
          padding: '0.65rem 0.85rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--surface-card)',
          border: '1px solid var(--border-strong)',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
          <div style={{ paddingTop: '5px', color: 'var(--text-muted)' }}>
            <Sparkles size={17} style={{ color: 'var(--primary)' }} />
          </div>

          <textarea
            ref={textareaRef}
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={loading}
            rows={1}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.925rem',
              resize: 'none',
              outline: 'none',
              lineHeight: 1.5,
              padding: '2px 0',
              maxHeight: '140px',
              minHeight: '26px',
            }}
          />

          <button
            type="button"
            onClick={onSearch}
            disabled={loading || !query.trim()}
            className="btn btn-primary"
            style={{
              width: '32px',
              height: '32px',
              padding: 0,
              borderRadius: '8px',
              flexShrink: 0,
              marginTop: '1px',
            }}
            title="Send question (Enter)"
            id="ask-ai-submit-btn"
          >
            {loading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <ArrowUp size={16} strokeWidth={2.5} />
            )}
          </button>
        </div>

        {/* Bottom Helper Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.725rem',
            color: 'var(--text-subtle)',
            paddingTop: '0.2rem',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Paperclip size={12} />
            <span>Answers synthesized from uploaded document chunks</span>
          </div>

          <span className="desktop-shortcut">
            <kbd style={{ padding: '0.1rem 0.35rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '3px' }}>Enter</kbd> to send · <kbd style={{ padding: '0.1rem 0.35rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '3px' }}>Shift + Enter</kbd> for new line
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .desktop-shortcut {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SearchBox;
