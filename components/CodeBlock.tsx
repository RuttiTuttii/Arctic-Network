import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  // Simple syntax highlighting for common languages
  const getHighlightedCode = (code: string, language?: string) => {
    if (!language) return code;

    // Basic syntax highlighting for Python
    if (language.toLowerCase() === 'python') {
      return code
        .replace(/(def|class|if|elif|else|for|while|try|except|import|from|return|print)\b/g, '<span class="text-blue-400">$1</span>')
        .replace(/(["'`])(.*?)\1/g, '<span class="text-green-400">$1$2$1</span>')
        .replace(/(\d+)/g, '<span class="text-orange-400">$1</span>')
        .replace(/(#.*$)/gm, '<span class="text-neutral-500">$1</span>');
    }

    // Basic syntax highlighting for JavaScript/TypeScript
    if (['javascript', 'js', 'typescript', 'ts'].includes(language.toLowerCase())) {
      return code
        .replace(/(const|let|var|function|class|if|else|for|while|try|catch|import|export|return|console)\b/g, '<span class="text-blue-400">$1</span>')
        .replace(/(["'`])(.*?)\1/g, '<span class="text-green-400">$1$2$1</span>')
        .replace(/(\d+)/g, '<span class="text-orange-400">$1</span>')
        .replace(/(\/\/.*$)/gm, '<span class="text-neutral-500">$1</span>');
    }

    return code;
  };

  return (
    <div className="relative group my-4">
      <div className="flex items-center justify-between bg-neutral-800 px-4 py-2 rounded-t-lg border-b border-neutral-700">
        <span className="text-sm text-neutral-400 font-mono">
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-sm">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span className="text-sm">Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="bg-neutral-900 p-4 rounded-b-lg overflow-x-auto text-sm font-mono leading-relaxed">
        <code
          dangerouslySetInnerHTML={{
            __html: getHighlightedCode(code, language)
          }}
        />
      </pre>
    </div>
  );
}