import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  User,
  Mail,
  Shield,
  Calendar,
  LogOut,
  RefreshCw,
  KeyRound,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { formatDate } from '../utils/formatters';

const Profile = () => {
  const { user: cachedUser, logout } = useAuth();
  const [profileData, setProfileData] = useState(cachedUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toast = useToast();
  const navigate = useNavigate();

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.getMe();
      if (response.data?.success && response.data.user) {
        setProfileData(response.data.user);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
      setError(err.userMessage || 'Failed to fetch user profile information.');
      toast.error('Unable to fetch profile details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully.');
    navigate('/login');
  };

  const currentUser = profileData || cachedUser;

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
            Profile & Settings
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Account details, security credentials, and active session status.
          </p>
        </div>

        <button
          onClick={fetchProfile}
          disabled={loading}
          className="btn btn-secondary"
          title="Refresh Profile"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {loading && <LoadingSpinner text="Retrieving profile details..." />}
      {error && <ErrorMessage message={error} onRetry={fetchProfile} />}

      {!loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* User Hero Card with Large Avatar */}
          <div
            className="card"
            style={{
              padding: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.75rem',
              flexWrap: 'wrap',
              background: 'var(--surface-card)',
            }}
          >
            {/* Large Avatar */}
            <div
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                boxShadow: '0 4px 16px rgba(37, 99, 235, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '1.85rem',
                fontWeight: 700,
                flexShrink: 0,
                border: '2px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>

            <div style={{ flex: 1, minWidth: '220px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                <h3 style={{ fontSize: '1.35rem', color: 'var(--text-primary)' }}>
                  {currentUser?.name || 'Authorized User'}
                </h3>
                <span className="badge badge-info">
                  <span className="badge-dot" />
                  <span>{currentUser?.role || 'USER'}</span>
                </span>
              </div>

              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {currentUser?.email || 'user@example.com'}
              </div>
            </div>
          </div>

          {/* Account Information Card */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
              Account Information
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '0.85rem',
                  borderBottom: '1px solid var(--border)',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-secondary)', fontSize: '0.885rem' }}>
                  <User size={16} style={{ color: 'var(--primary)' }} />
                  <span>Full Name</span>
                </div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.925rem' }}>
                  {currentUser?.name || '—'}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '0.85rem',
                  borderBottom: '1px solid var(--border)',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-secondary)', fontSize: '0.885rem' }}>
                  <Mail size={16} style={{ color: 'var(--primary)' }} />
                  <span>Email Address</span>
                </div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.925rem' }}>
                  {currentUser?.email || '—'}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '0.85rem',
                  borderBottom: '1px solid var(--border)',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-secondary)', fontSize: '0.885rem' }}>
                  <Shield size={16} style={{ color: 'var(--primary)' }} />
                  <span>Role & Access</span>
                </div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.925rem' }}>
                  {currentUser?.role || 'USER'}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-secondary)', fontSize: '0.885rem' }}>
                  <Calendar size={16} style={{ color: 'var(--primary)' }} />
                  <span>Member Since</span>
                </div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.925rem' }}>
                  {currentUser?.createdAt ? formatDate(currentUser.createdAt) : 'Active User'}
                </div>
              </div>
            </div>
          </div>

          {/* Security & Session Card */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
              Security & Session
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '0.85rem',
                  borderBottom: '1px solid var(--border)',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-secondary)', fontSize: '0.885rem' }}>
                  <KeyRound size={16} style={{ color: 'var(--success)' }} />
                  <span>JWT Token Status</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600 }}>
                  <CheckCircle2 size={15} />
                  <span>Active & Verified</span>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-secondary)', fontSize: '0.885rem' }}>
                  <Lock size={16} style={{ color: 'var(--accent-cyan)' }} />
                  <span>Document Isolation</span>
                </div>
                <div style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 500 }}>
                  Private per-user vector index
                </div>
              </div>
            </div>

            {/* Logout Action */}
            <div
              style={{
                marginTop: '2rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={handleLogout}
                className="btn btn-danger"
                id="profile-logout-btn"
                style={{ padding: '0.55rem 1.25rem' }}
              >
                <LogOut size={15} />
                <span>Sign Out of DocIntel AI</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
