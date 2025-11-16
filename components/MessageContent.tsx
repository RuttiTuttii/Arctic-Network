import { CodeBlock } from './CodeBlock';

interface MessageContentProps {
  content: string;
}

export function MessageContent({ content }: MessageContentProps) {
  // Parse content for code blocks
  const parseContent = (text: string) => {
    const parts = [];
    const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        const textPart = text.slice(lastIndex, match.index);
        if (textPart.trim()) {
          parts.push({
            type: 'text',
            content: textPart
          });
        }
      }

      // Add code block
      const language = match[1];
      const code = match[2].trim();
      parts.push({
        type: 'code',
        language,
        content: code
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      if (remainingText.trim()) {
        parts.push({
          type: 'text',
          content: remainingText
        });
      }
    }

    return parts;
  };

  const parts = parseContent(content);

  return (
    <div className="space-y-2">
      {parts.map((part, index) => {
        if (part.type === 'code') {
          return (
            <CodeBlock
              key={index}
              code={part.content}
              language={part.language}
            />
          );
        } else {
          return (
            <div
              key={index}
              className="whitespace-pre-wrap break-words leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: part.content.replace(/\n/g, '<br>')
              }}
            />
          );
        }
      })}
    </div>
  );
}