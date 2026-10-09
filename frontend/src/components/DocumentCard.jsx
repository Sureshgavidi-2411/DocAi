import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Bot, Trash2, Calendar, HardDrive } from 'lucide-react';
import { formatBytes, formatDate, getFileExtension } from '../utils/formatters';

const DocumentCard = ({ document, onDeleteClick }) => {
  const { _id, originalName, fileSize, status, createdAt } = document;
  const navigate = useNavigate();

  const extension = getFileExtension(originalName);

  const renderStatus = () => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="badge badge-success">
            <span className="badge-dot" />
            <span>Processed</span>
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="badge badge-warning">
            <span className="badge-dot animate-spin" />
            <span>Processing</span>
          </span>
        );
      case 'FAILED':
        return (
          <span className="badge badge-danger">
            <span className="badge-dot" />
            <span>Failed</span>
          </span>
        );
      default:
        return (
          <span className="badge badge-info">
            <span className="badge-dot" />
            <span>{status || 'Uploaded'}</span>
          </span>
        );
    }
  };

  const getFileIconColor = () => {
    switch (extension) {
      case 'PDF':
        return '#ef4444';
      case 'TXT':
        return '#06b6d4';
      case 'DOCX':
      case 'DOC':
        return '#3b82f6';
      default:
        return 'var(--primary)';
    }
  };

  return (
    <div
      className="card card-interactive animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.25rem',
        height: '100%',
        background: 'var(--surface-card)',
        position: 'relative',
      }}
    >
      <div>
        {/* Top Header: File Icon + Status Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: getFileIconColor(),
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <FileText size={22} />
          </div>

          {renderStatus()}
        </div>

        {/* Title */}
        <h4
          style={{
            fontSize: '0.975rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '0.5rem',
            wordBreak: 'break-word',
            lineHeight: 1.4,
          }}
          title={originalName}
        >
          {originalName}
        </h4>

        {/* Meta info */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{extension}</span>
            <span>·</span>
            <span>{formatBytes(fileSize)}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-muted)' }}>
            <Calendar size={13} />
            <span>Uploaded {formatDate(createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div
        style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
        }}
      >
        <button
          onClick={() => navigate('/search')}
          className="btn btn-secondary"
          style={{
            flex: 1,
            padding: '0.4rem 0.75rem',
            fontSize: '0.8rem',
            gap: '0.35rem',
          }}
          title="Ask AI questions about this file"
        >
          <Bot size={14} style={{ color: 'var(--primary)' }} />
          <span>Ask AI</span>
        </button>

        <button
          onClick={() => onDeleteClick(document)}
          className="btn btn-ghost"
          style={{
            padding: '0.4rem 0.65rem',
            color: 'var(--danger)',
          }}
          title="Delete document"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
};

export default DocumentCard;
