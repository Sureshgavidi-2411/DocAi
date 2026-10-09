import React from 'react';
import { FileText, Bookmark, Hash } from 'lucide-react';

const SourceCitation = ({ sources = [] }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div
      style={{
        marginTop: '1.25rem',
        paddingTop: '1rem',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: '0.75rem',
        }}
      >
        <Bookmark size={13} style={{ color: 'var(--primary)' }} />
        <span>Referenced Sources ({sources.length})</span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '0.75rem',
        }}
      >
        {sources.map((src, index) => (
          <div
            key={index}
            className="card"
            style={{
              padding: '0.75rem 0.95rem',
              background: 'var(--surface)',
              borderColor: 'var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.45rem',
              transition: 'border-color var(--trans-fast)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  background: 'var(--primary-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                  flexShrink: 0,
                }}
              >
                <FileText size={14} />
              </div>
              <span
                style={{
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={src.documentName}
              >
                {src.documentName || 'Document'}
              </span>
            </div>

            {src.chunks && src.chunks.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.15rem' }}>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                  Relevant chunks:
                </span>
                {src.chunks.map((chk, cIdx) => (
                  <span
                    key={cIdx}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '2px',
                      padding: '0.1rem 0.4rem',
                      background: 'var(--primary-subtle)',
                      borderRadius: '4px',
                      color: '#93c5fd',
                      fontSize: '0.725rem',
                      fontWeight: 500,
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                    }}
                  >
                    <Hash size={10} />
                    {chk}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SourceCitation;
