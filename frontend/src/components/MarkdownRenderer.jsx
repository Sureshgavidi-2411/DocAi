import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const CodeBlock = ({ code, language = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: 'relative',
        margin: '0.85rem 0',
        borderRadius: 'var(--radius-sm)',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.4rem 0.85rem',
          background: 'rgba(0, 0, 0, 0.25)',
          borderBottom: '1px solid var(--border)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
        }}
      >
        <span>{language || 'Code'}</span>
        <button
          onClick={handleCopy}
          className="btn btn-ghost"
          style={{ padding: '2px 6px', fontSize: '0.75rem', gap: '4px' }}
        >
          {copied ? <Check size={12} style={{ color: 'var(--success)' }} /> : <Copy size={12} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre style={{ margin: 0, padding: '0.85rem', overflowX: 'auto', fontSize: '0.85rem' }}>
        <code>{code}</code>
      </pre>
    </div>
  );
};

const renderInlineMarkdown = (text) => {
  if (!text) return null;

  // Split by bold (**text**) and code (`text`)
  const parts = [];
  let remaining = text;
  let key = 0;

  const regex = /(\*\*.*?\*\*|`.*?`)/g;
  let match;
  let lastIndex = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const matchedStr = match[0];
    if (matchedStr.startsWith('**') && matchedStr.endsWith('**')) {
      parts.push(
        <strong key={key++} style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
          {matchedStr.slice(2, -2)}
        </strong>
      );
    } else if (matchedStr.startsWith('`') && matchedStr.endsWith('`')) {
      parts.push(
        <code key={key++}>
          {matchedStr.slice(1, -1)}
        </code>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
};

const MarkdownRenderer = ({ content }) => {
  if (!content) return null;

  // Split lines to detect code blocks, lists, and paragraphs
  const lines = content.split('\n');
  const elements = [];
  let inCodeBlock = false;
  let codeBuffer = [];
  let codeLanguage = '';
  let listBuffer = [];
  let isNumberedList = false;

  const flushList = () => {
    if (listBuffer.length > 0) {
      if (isNumberedList) {
        elements.push(
          <ol key={`ol-${elements.length}`} style={{ paddingLeft: '1.25rem', marginBottom: '0.75rem' }}>
            {listBuffer.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '0.3rem' }}>{renderInlineMarkdown(item)}</li>
            ))}
          </ol>
        );
      } else {
        elements.push(
          <ul key={`ul-${elements.length}`} style={{ paddingLeft: '1.25rem', marginBottom: '0.75rem' }}>
            {listBuffer.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '0.3rem' }}>{renderInlineMarkdown(item)}</li>
            ))}
          </ul>
        );
      }
      listBuffer = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block toggle
    if (line.trim().startsWith('```')) {
      flushList();
      if (inCodeBlock) {
        elements.push(
          <CodeBlock
            key={`code-${elements.length}`}
            code={codeBuffer.join('\n')}
            language={codeLanguage}
          />
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeLanguage = line.trim().slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Bullet list (- or *)
    const bulletMatch = line.match(/^(\s*)[-*]\s+(.+)/);
    if (bulletMatch) {
      if (isNumberedList) flushList();
      isNumberedList = false;
      listBuffer.push(bulletMatch[2]);
      continue;
    }

    // Numbered list (1. 2.)
    const numberMatch = line.match(/^(\s*)\d+\.\s+(.+)/);
    if (numberMatch) {
      if (!isNumberedList) flushList();
      isNumberedList = true;
      listBuffer.push(numberMatch[2]);
      continue;
    }

    // Normal line: flush any pending lists
    flushList();

    if (line.trim() === '') {
      continue;
    }

    // Headings
    if (line.startsWith('### ')) {
      elements.push(
        <h4 key={`h4-${elements.length}`} style={{ fontSize: '1rem', margin: '0.85rem 0 0.35rem', color: 'var(--text-primary)' }}>
          {renderInlineMarkdown(line.slice(4))}
        </h4>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h3 key={`h3-${elements.length}`} style={{ fontSize: '1.15rem', margin: '1rem 0 0.45rem', color: 'var(--text-primary)' }}>
          {renderInlineMarkdown(line.slice(3))}
        </h3>
      );
    } else {
      elements.push(
        <p key={`p-${elements.length}`} style={{ marginBottom: '0.65rem' }}>
          {renderInlineMarkdown(line)}
        </p>
      );
    }
  }

  flushList();
  if (inCodeBlock && codeBuffer.length > 0) {
    elements.push(
      <CodeBlock key={`code-${elements.length}`} code={codeBuffer.join('\n')} />
    );
  }

  return <div className="markdown-body">{elements}</div>;
};

export default MarkdownRenderer;
