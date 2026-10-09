import React, { useState } from 'react';
import { Copy, Check, User } from 'lucide-react';
import SourceCitation from './SourceCitation';
import MarkdownRenderer from './MarkdownRenderer';
import Logo from './Logo';

const ChatMessage = ({ message }) => {
  const { role, content, sources, timestamp } = message;
  const isUser = role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isUser) {
    return (
      <div
        className="animate-fade-in"
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          margin: '0.75rem 0',
        }}
      >
        <div
          style={{
            maxWidth: '75%',
            background: 'var(--surface-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1.15rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div
            style={{
              fontSize: '0.925rem',
              color: 'var(--text-primary)',
              lineHeight: 1.5,
              wordBreak: 'break-word',
            }}
          >
            {content}
          </div>
          {timestamp && (
            <div
              style={{
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                marginTop: '0.35rem',
                textAlign: 'right',
              }}
            >
              {timestamp}
            </div>
          )}
        </div>
      </div>
    );
  }

  // AI Assistant Message (Document workspace style)
  return (
    <div
      className="animate-fade-in"
      style={{
        display: 'flex',
        gap: '1rem',
        padding: '1.25rem 0',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      {/* AI Logo Icon */}
      <div style={{ flexShrink: 0, marginTop: '2px' }}>
        <Logo collapsed={true} size="default" />
      </div>

      {/* AI Content Area */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Header with Role and Copy Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              DocIntel Assistant
            </span>
            {timestamp && (
              <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                {timestamp}
              </span>
            )}
          </div>

          <button
            onClick={handleCopy}
            className="btn btn-ghost"
            style={{
              padding: '3px 8px',
              fontSize: '0.75rem',
              gap: '4px',
              color: 'var(--text-muted)',
            }}
            title="Copy answer"
          >
            {copied ? <Check size={12} style={{ color: 'var(--success)' }} /> : <Copy size={12} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Formatted Content */}
        <MarkdownRenderer content={content} />

        {/* Source Citations */}
        {sources && sources.length > 0 && <SourceCitation sources={sources} />}
      </div>
    </div>
  );
};

export default ChatMessage;
