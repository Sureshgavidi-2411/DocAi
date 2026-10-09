import React, { useState, useRef, useEffect } from 'react';
import { searchAPI } from '../services/api';
import ChatMessage from '../components/ChatMessage';
import SearchBox from '../components/SearchBox';
import { Trash2, Sparkles, MessageSquare } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import Logo from '../components/Logo';

const AISearch = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem('docintel_chat_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const toast = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    sessionStorage.setItem('docintel_chat_history', JSON.stringify(messages));
  }, [messages, loading]);

  const handleSearch = async (textOverride = null) => {
    const targetQuery = (textOverride || query).trim();
    if (!targetQuery || loading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: targetQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuery('');
    setLoading(true);

    try {
      const response = await searchAPI.search(targetQuery);
      const data = response.data;

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.answer || 'No answer generated.',
        sources: data.sources || [],
        count: data.count || 0,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Search error:', err);
      const msg = err.userMessage || 'Failed to complete AI vector search. Please try again.';
      toast.error(msg);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: `⚠️ ${msg}`,
          sources: [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    sessionStorage.removeItem('docintel_chat_history');
    toast.info('Conversation cleared');
  };

  const suggestions = [
    'What skills are mentioned?',
    'What internship experience is listed?',
    'What education details are provided?',
    'Summarize the key qualifications.',
  ];

  const handleSuggestionClick = (sug) => {
    setQuery(sug);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - var(--header-height) - 4rem)',
        maxHeight: '1050px',
        gap: '1rem',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.65rem', letterSpacing: '-0.02em', marginBottom: '0.2rem' }}>
            AI Assistant
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Ask questions about your uploaded documents with source citations.
          </p>
        </div>

        {messages.length > 0 && (
          <button
            onClick={handleClearChat}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem', gap: '0.35rem' }}
            title="Clear chat history"
          >
            <Trash2 size={14} />
            <span>Clear Chat</span>
          </button>
        )}
      </div>

      {/* Main Conversation Container */}
      <div
        className="card"
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.5rem',
          background: 'var(--surface-card)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        {/* Empty State */}
        {messages.length === 0 && (
          <div
            style={{
              margin: 'auto',
              maxWidth: '540px',
              textAlign: 'center',
              padding: '2rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'var(--primary-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                marginBottom: '1rem',
                border: '1px solid rgba(59, 130, 246, 0.25)',
              }}
            >
              <Sparkles size={22} />
            </div>

            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
              Ask your documents
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.5, marginBottom: '2rem' }}>
              Your documents contain the answers. Start a conversation with them using semantic vector retrieval and local reasoning.
            </p>

            {/* Suggested Prompt Chips */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                Suggested Prompts
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                {suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSuggestionClick(sug)}
                    className="btn btn-secondary"
                    style={{
                      fontSize: '0.825rem',
                      padding: '0.45rem 0.85rem',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--surface)',
                    }}
                  >
                    <span>"{sug}"</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Message Thread */}
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {/* Thinking State */}
        {loading && (
          <div
            className="animate-fade-in"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              padding: '1.25rem 0',
            }}
          >
            <div style={{ flexShrink: 0, marginTop: '2px' }}>
              <Logo collapsed={true} size="default" />
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  fontWeight: 500,
                  marginBottom: '0.25rem',
                }}
              >
                <span>AI is thinking</span>
                <span style={{ display: 'inline-flex', gap: '3px', alignItems: 'center' }}>
                  <span className="ai-dot" />
                  <span className="ai-dot" />
                  <span className="ai-dot" />
                </span>
              </div>
              <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                Comparing cosine similarity across indexed chunks...
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box fixed at bottom */}
      <SearchBox
        query={query}
        setQuery={setQuery}
        onSearch={() => handleSearch()}
        loading={loading}
      />
    </div>
  );
};

export default AISearch;
