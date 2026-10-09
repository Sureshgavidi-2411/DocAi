import React, { useState, useEffect, useCallback, useMemo } from 'react';
import UploadDocument from '../components/UploadDocument';
import DocumentList from '../components/DocumentList';
import ConfirmModal from '../components/ConfirmModal';
import { documentAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Search, RefreshCw, Files, ArrowUpDown, Filter, X } from 'lucide-react';
import { getFileExtension } from '../utils/formatters';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search, filter, and sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL'); // 'ALL' | 'PDF' | 'TXT' | 'DOCX'
  const [sortBy, setSortBy] = useState('NEWEST'); // 'NEWEST' | 'OLDEST' | 'NAME'

  // Delete modal state
  const [docToDelete, setDocToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const toast = useToast();

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await documentAPI.getDocuments();
      if (response.data?.success) {
        setDocuments(response.data.documents || []);
      }
    } catch (err) {
      console.error('Failed to load documents:', err);
      const msg = err.userMessage || 'Failed to fetch documents from server.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleUploadSuccess = (newDoc) => {
    setDocuments((prev) => [newDoc, ...prev]);
    fetchDocuments();
  };

  const handleDeletePrompt = (doc) => {
    setDocToDelete(doc);
  };

  const handleConfirmDelete = async () => {
    if (!docToDelete) return;

    setIsDeleting(true);
    try {
      await documentAPI.deleteDocument(docToDelete._id);
      setDocuments((prev) => prev.filter((d) => d._id !== docToDelete._id));
      toast.success(`"${docToDelete.originalName}" was permanently deleted.`);
      setDocToDelete(null);
    } catch (err) {
      console.error('Delete error:', err);
      const msg = err.userMessage || 'Unable to delete document.';
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter and sort documents
  const processedDocuments = useMemo(() => {
    let result = [...documents];

    // Filter by type
    if (typeFilter !== 'ALL') {
      result = result.filter((doc) => {
        const ext = getFileExtension(doc.originalName);
        if (typeFilter === 'PDF') return ext === 'PDF';
        if (typeFilter === 'TXT') return ext === 'TXT';
        if (typeFilter === 'DOCX') return ext === 'DOCX' || ext === 'DOC';
        return true;
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((doc) =>
        doc.originalName?.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'NEWEST') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'OLDEST') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sortBy === 'NAME') {
        return (a.originalName || '').localeCompare(b.originalName || '');
      }
      return 0;
    });

    return result;
  }, [documents, searchQuery, typeFilter, sortBy]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>
            Documents
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Manage and index your PDF, Word, and text documents for semantic AI search.
          </p>
        </div>

        <button
          onClick={fetchDocuments}
          disabled={loading}
          className="btn btn-secondary"
          title="Refresh documents"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Upload Zone */}
      <UploadDocument onUploadSuccess={handleUploadSuccess} />

      {/* Search, Filter Tabs, and Sorting Bar */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          paddingBottom: '0.25rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          {/* Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            {['ALL', 'PDF', 'TXT', 'DOCX'].map((filter) => (
              <button
                key={filter}
                onClick={() => setTypeFilter(filter)}
                className="btn"
                style={{
                  padding: '0.35rem 0.85rem',
                  fontSize: '0.8rem',
                  borderRadius: 'var(--radius-full)',
                  background: typeFilter === filter ? 'var(--primary)' : 'var(--surface)',
                  color: typeFilter === filter ? '#ffffff' : 'var(--text-secondary)',
                  border: `1px solid ${typeFilter === filter ? 'transparent' : 'var(--border)'}`,
                  fontWeight: typeFilter === filter ? 600 : 500,
                }}
              >
                {filter === 'ALL' ? 'All Files' : filter}
              </button>
            ))}
          </div>

          {/* Search Input & Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Search Box */}
            <div style={{ position: 'relative', width: '240px' }}>
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-control"
                style={{
                  paddingLeft: '2.2rem',
                  paddingRight: searchQuery ? '2rem' : '0.8rem',
                  height: '36px',
                  fontSize: '0.85rem',
                }}
              />
              <Search
                size={14}
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '0.65rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '2px',
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sort Select */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-control"
                style={{
                  height: '36px',
                  fontSize: '0.825rem',
                  padding: '0 0.75rem',
                  cursor: 'pointer',
                  width: 'auto',
                }}
              >
                <option value="NEWEST">Newest First</option>
                <option value="OLDEST">Oldest First</option>
                <option value="NAME">Name (A–Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
          <span>Showing {processedDocuments.length} of {documents.length} documents</span>
          {typeFilter !== 'ALL' && <span>(Filtered by {typeFilter})</span>}
        </div>
      </div>

      {/* Document List */}
      <DocumentList
        documents={processedDocuments}
        loading={loading}
        error={error}
        onRetry={fetchDocuments}
        onDeleteClick={handleDeletePrompt}
        onUploadPrompt={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!docToDelete}
        title="Delete Document"
        message={`Are you sure you want to permanently delete "${docToDelete?.originalName}"? This will delete all indexed vector embeddings and chunks.`}
        confirmText="Delete Document"
        isDanger={true}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDocToDelete(null)}
      />
    </div>
  );
};

export default Documents;
