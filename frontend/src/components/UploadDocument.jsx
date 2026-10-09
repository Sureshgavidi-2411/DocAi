import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, X, FileText, ArrowUp } from 'lucide-react';
import { documentAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { formatBytes } from '../utils/formatters';

const UploadDocument = ({ onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const inputRef = useRef(null);
  const toast = useToast();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    if (!file) return false;
    const allowedExtensions = ['.pdf', '.docx', '.doc', '.txt'];
    const ext = '.' + file.name.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      const msg = 'Unsupported file format. Please upload PDF, DOCX, or TXT documents.';
      setError(msg);
      toast.error(msg);
      return false;
    }

    if (file.size > 10 * 1024 * 1024) {
      const msg = 'File exceeds maximum upload size of 10MB.';
      setError(msg);
      toast.error(msg);
      return false;
    }

    setError('');
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        setSuccessMsg('');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        setSuccessMsg('');
      }
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setProgress(0);
    setError('');
    setSuccessMsg('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || uploading) return;

    setUploading(true);
    setProgress(15);
    setError('');
    setSuccessMsg('');

    const formData = new FormData();
    formData.append('document', selectedFile);

    try {
      const response = await documentAPI.uploadDocument(formData, (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(Math.min(percent, 85));
        }
      });

      setProgress(100);
      const data = response.data;
      const chunks = data.chunkCount || 0;
      const successText = `"${selectedFile.name}" processed into ${chunks} chunks and indexed!`;
      setSuccessMsg(successText);
      toast.success(successText);

      handleClear();
      if (onUploadSuccess) {
        onUploadSuccess(data.document);
      }
    } catch (err) {
      console.error('Upload error:', err);
      const errMsg = err.userMessage || err.response?.data?.message || 'Failed to upload document.';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="card"
      style={{
        padding: '1.75rem',
        background: 'var(--surface-card)',
        borderRadius: 'var(--radius-md)',
      }}
    >
      {/* Large Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        style={{
          border: `1.5px dashed ${dragActive ? 'var(--primary)' : 'var(--border-strong)'}`,
          borderRadius: 'var(--radius-sm)',
          padding: '2.75rem 1.5rem',
          textAlign: 'center',
          backgroundColor: dragActive ? 'var(--primary-subtle)' : 'var(--surface)',
          cursor: uploading ? 'not-allowed' : 'pointer',
          transition: 'all var(--trans-fast)',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          id="document-file-input"
          accept=".pdf,.docx,.doc,.txt"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          disabled={uploading}
        />

        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'var(--primary-subtle)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)',
            marginBottom: '0.85rem',
            border: '1px solid rgba(59, 130, 246, 0.25)',
          }}
        >
          <ArrowUp size={22} />
        </div>

        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
          {dragActive ? 'Drop your document here' : 'Drop your document here'}
        </h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
          or <span style={{ color: 'var(--primary)', fontWeight: 500 }}>click to browse</span>
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.775rem' }}>
          PDF, DOCX, and text documents supported (up to 10MB)
        </p>
      </div>

      {/* Selected File Details */}
      {selectedFile && (
        <div
          style={{
            marginTop: '1.25rem',
            padding: '0.85rem 1rem',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'var(--primary-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                flexShrink: 0,
              }}
            >
              <FileText size={18} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: '0.885rem',
                  color: 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {selectedFile.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {formatBytes(selectedFile.size)}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {!uploading && (
              <button
                onClick={handleClear}
                className="btn btn-ghost"
                style={{ padding: '6px' }}
                title="Remove selection"
              >
                <X size={16} />
              </button>
            )}
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="btn btn-primary"
              style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
            >
              {uploading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <UploadCloud size={15} />
                  <span>Upload Document</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Progress Bar during upload */}
      {uploading && (
        <div style={{ marginTop: '1rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.775rem',
              color: 'var(--text-secondary)',
              marginBottom: '0.35rem',
            }}
          >
            <span>
              {progress < 85
                ? 'Uploading file to server...'
                : 'Extracting text, chunking & creating vector embeddings...'}
            </span>
            <span>{progress}%</span>
          </div>
          <div
            style={{
              width: '100%',
              height: '5px',
              background: 'var(--surface)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--primary), var(--accent-violet))',
                transition: 'width 0.25s ease',
              }}
            />
          </div>
        </div>
      )}

      {/* Success Notification Alert */}
      {successMsg && (
        <div
          style={{
            marginTop: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--success-bg)',
            border: '1px solid var(--success-border)',
            color: 'var(--success)',
            fontSize: '0.85rem',
          }}
        >
          <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
          <span>✓ {successMsg}</span>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div
          style={{
            marginTop: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--danger-bg)',
            border: '1px solid var(--danger-border)',
            color: 'var(--danger)',
            fontSize: '0.85rem',
          }}
        >
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>✕ {error}</span>
        </div>
      )}
    </div>
  );
};

export default UploadDocument;
