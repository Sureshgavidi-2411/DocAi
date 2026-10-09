import React from 'react';
import DocumentCard from './DocumentCard';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';
import ErrorMessage from './ErrorMessage';
import { FileUp, FileSearch } from 'lucide-react';

const DocumentList = ({
  documents = [],
  loading = false,
  error = null,
  onRetry = null,
  onDeleteClick,
  onUploadPrompt = null,
}) => {
  if (loading) {
    return (
      <div style={{ padding: '3rem 0' }}>
        <LoadingSpinner text="Loading documents from server..." />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  if (!documents || documents.length === 0) {
    return (
      <EmptyState
        icon={FileSearch}
        title="No documents uploaded yet"
        description="Upload your PDF, DOCX, or TXT documents to start chatting and extracting insights with AI."
        action={
          onUploadPrompt && (
            <button onClick={onUploadPrompt} className="btn btn-primary">
              <FileUp size={16} /> Upload First Document
            </button>
          )
        }
      />
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
        gap: '1.25rem',
      }}
    >
      {documents.map((doc) => (
        <DocumentCard
          key={doc._id}
          document={doc}
          onDeleteClick={onDeleteClick}
        />
      ))}
    </div>
  );
};

export default DocumentList;
