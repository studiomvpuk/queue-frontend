'use client';

import React, { useState } from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export default function CodeBlock({ code, language = 'typescript', title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-qe-surface-2 rounded-qe-md overflow-hidden border border-qe-line">
      {title && (
        <div className="px-qe-4 py-qe-3 bg-qe-surface border-b border-qe-line flex justify-between items-center">
          <span className="text-qe-small font-600 text-qe-ink-2">{title}</span>
          <span className="text-qe-micro text-qe-ink-3">{language}</span>
        </div>
      )}
      <div className="relative">
        <pre className="p-qe-4 overflow-x-auto">
          <code className="text-qe-small font-mono text-qe-ink">{code}</code>
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-qe-4 right-qe-4 p-qe-2 bg-qe-surface rounded-qe-md hover:bg-qe-line transition text-qe-ink"
          title="Copy code"
        >
          {copied ? (
            <CheckCircle2 className="w-4 h-4 text-qe-signal-live" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}
