import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Bot,
  Plus,
  ArrowRight,
  HardDrive,
  CheckCircle2,
  Cpu,
  Clock,
  Sparkles,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { documentAPI } from '../services/api';
import { formatBytes, formatDate } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await documentAPI.getDocuments();
      if (res.data?.success) {
        setDocuments(res.data.documents || []);
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err.userMessage || 'Failed to retrieve dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalDocs = documents.length;
  const completedDocs = documents.filter((d) => d.status === 'COMPLETED').length;
  const totalBytes = documents.reduce((acc, curr) => acc + (curr.fileSize || 0), 0);
  const recentDocs = documents.slice(0, 5);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Impressive SaaS Hero Banner */}
      <div className="hero-card">
        <div className="hero-glow" />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '680px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.2rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--primary-subtle)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              color: '#60a5fa',
              fontSize: '0.785rem',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            <Sparkles size={13} />
            <span>AI Knowledge Workspace</span>
          </div>

          <h2
            style={{
              fontSize: '2.15rem',
              marginBottom: '0.5rem',
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
            }}
          >
            {getGreeting()}, <span style={{ color: 'var(--primary)' }}>{user?.name || 'there'}</span>.
          </h2>

          <p
            style={{
              fontSize: '1.1rem',
              color: 'var(--text-primary)',
              fontWeight: 500,
              marginBottom: '0.35rem',
            }}
          >
            Your documents, understood by AI.
          </p>

          <p
            style={{
              fontSize: '0.925rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: '1.75rem',
            }}
          >
            Upload your documents and ask questions using AI-powered semantic search and local retrieval-augmented generation.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <Link to="/documents" className="btn btn-primary" id="dashboard-upload-btn">
              <Plus size={16} />
              <span>Upload Document</span>
            </Link>

            <Link to="/search" className="btn btn-secondary" id="dashboard-ask-ai-btn">
              <Bot size={16} />
              <span>Ask AI</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        {/* Metric 1 */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.775rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              Total Documents
            </span>
            <FileText size={18} style={{ color: 'var(--primary)' }} />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {loading ? '—' : totalDocs}
          </div>
          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Stored in MongoDB Atlas
          </div>
        </div>

        {/* Metric 2 */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.775rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              Ready for Search
            </span>
            <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {loading ? '—' : completedDocs}
          </div>
          <div style={{ fontSize: '0.775rem', color: 'var(--success)', marginTop: '0.25rem' }}>
            ● Vector indexed & searchable
          </div>
        </div>

        {/* Metric 3 */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.775rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              Storage Indexed
            </span>
            <HardDrive size={18} style={{ color: 'var(--accent-cyan)' }} />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {loading ? '—' : formatBytes(totalBytes)}
          </div>
          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Total processed size
          </div>
        </div>

        {/* Metric 4 */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.775rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              System Status
            </span>
            <Cpu size={18} style={{ color: 'var(--accent-violet)' }} />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Online
          </div>
          <div style={{ fontSize: '0.775rem', color: 'var(--accent-cyan)', marginTop: '0.25rem' }}>
            Local Phi-3 + Atlas Vector
          </div>
        </div>
      </div>

      {/* Recent Documents Section */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            borderBottom: '1px solid var(--border)',
            paddingBottom: '1rem',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.2rem' }}>Recent Documents</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Recently uploaded files ready for query answering.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="btn btn-ghost"
              style={{ padding: '6px' }}
              title="Refresh"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
            {documents.length > 0 && (
              <Link
                to="/documents"
                className="btn btn-secondary"
                style={{ fontSize: '0.825rem', padding: '0.45rem 0.85rem', gap: '0.35rem' }}
              >
                <span>View All</span>
                <ChevronRight size={14} />
              </Link>
            )}
          </div>
        </div>

        {loading && <LoadingSpinner text="Retrieving recent documents..." />}
        {error && <ErrorMessage message={error} onRetry={fetchDashboardData} />}

        {!loading && !error && documents.length === 0 && (
          <EmptyState
            title="No documents uploaded yet"
            description="Upload your first PDF or text document to start asking questions with AI."
            action={
              <Link to="/documents" className="btn btn-primary">
                <Plus size={15} /> Upload First Document
              </Link>
            }
          />
        )}

        {!loading && !error && recentDocs.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {recentDocs.map((doc) => (
              <div
                key={doc._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  gap: '1rem',
                  transition: 'border-color var(--trans-fast)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 0 }}>
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
                        fontSize: '0.9rem',
                        color: 'var(--text-primary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {doc.originalName}
                    </div>
                    <div
                      style={{
                        fontSize: '0.775rem',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        gap: '0.45rem',
                        alignItems: 'center',
                      }}
                    >
                      <span>{formatBytes(doc.fileSize)}</span>
                      <span>•</span>
                      <span>{formatDate(doc.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                  <span
                    className={`badge badge-${
                      doc.status === 'COMPLETED'
                        ? 'success'
                        : doc.status === 'PROCESSING'
                        ? 'warning'
                        : doc.status === 'FAILED'
                        ? 'danger'
                        : 'info'
                    }`}
                  >
                    <span className="badge-dot" />
                    <span>{doc.status === 'COMPLETED' ? 'Processed' : doc.status}</span>
                  </span>

                  <button
                    onClick={() => navigate('/search')}
                    className="btn btn-secondary"
                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', gap: '0.4rem' }}
                    title="Query this document in AI Assistant"
                  >
                    <Bot size={13} />
                    <span>Ask AI</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
