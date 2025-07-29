import React, { useState } from 'react';
import { Copy, Check } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  minHeight?: string;
  height?: string;
}

interface Token {
  type: string;
  value: string;
}

const tokenize = (code: string): Token[] => {
  const tokens: Token[] = [];
  let i = 0;

  while (i < code.length) {
    // Skip whitespace but preserve it
    if (/\s/.test(code[i])) {
      let whitespace = '';
      while (i < code.length && /\s/.test(code[i])) {
        whitespace += code[i];
        i++;
      }
      tokens.push({ type: 'whitespace', value: whitespace });
      continue;
    }

    // Comments
    if (code.slice(i, i + 2) === '//') {
      let comment = '';
      while (i < code.length && code[i] !== '\n') {
        comment += code[i];
        i++;
      }
      tokens.push({ type: 'comment', value: comment });
      continue;
    }

    if (code.slice(i, i + 2) === '/*') {
      let comment = '';
      while (i < code.length - 1 && code.slice(i, i + 2) !== '*/') {
        comment += code[i];
        i++;
      }
      if (i < code.length - 1) {
        comment += '*/';
        i += 2;
      }
      tokens.push({ type: 'comment', value: comment });
      continue;
    }

    // String literals
    if (code[i] === '"' || code[i] === "'" || code[i] === '`') {
      const quote = code[i];
      let string = quote;
      i++;
      while (i < code.length && code[i] !== quote) {
        if (code[i] === '\\') {
          string += code[i];
          i++;
          if (i < code.length) {
            string += code[i];
            i++;
          }
        } else {
          string += code[i];
          i++;
        }
      }
      if (i < code.length) {
        string += code[i];
        i++;
      }
      tokens.push({ type: 'string', value: string });
      continue;
    }

    // Numbers
    if (/\d/.test(code[i])) {
      let number = '';
      while (i < code.length && /[\d.]/.test(code[i])) {
        number += code[i];
        i++;
      }
      tokens.push({ type: 'number', value: number });
      continue;
    }

    // JSX/HTML tags
    if (code[i] === '<') {
      let tag = '<';
      i++;
      let isClosing = false;
      
      if (i < code.length && code[i] === '/') {
        tag += '/';
        i++;
        isClosing = true;
      }
      
      let tagName = '';
      while (i < code.length && /[a-zA-Z0-9]/.test(code[i])) {
        tagName += code[i];
        i++;
      }
      
      if (tagName) {
        tokens.push({ type: 'tag-bracket', value: isClosing ? '</' : '<' });
        const isComponent = /^[A-Z]/.test(tagName);
        tokens.push({ 
          type: isComponent ? 'component' : 'html-tag', 
          value: tagName 
        });
        
        // Handle attributes
        while (i < code.length && code[i] !== '>') {
          if (/\s/.test(code[i])) {
            let whitespace = '';
            while (i < code.length && /\s/.test(code[i])) {
              whitespace += code[i];
              i++;
            }
            tokens.push({ type: 'whitespace', value: whitespace });
          } else if (/[a-zA-Z]/.test(code[i])) {
            let attr = '';
            while (i < code.length && /[a-zA-Z0-9-]/.test(code[i])) {
              attr += code[i];
              i++;
            }
            tokens.push({ type: 'attribute', value: attr });
          } else {
            tokens.push({ type: 'operator', value: code[i] });
            i++;
          }
        }
        
        if (i < code.length && code[i] === '>') {
          tokens.push({ type: 'tag-bracket', value: '>' });
          i++;
        }
        continue;
      } else {
        // Not a tag, treat as operator
        i -= isClosing ? 2 : 1;
        tokens.push({ type: 'operator', value: code[i] });
        i++;
        continue;
      }
    }

    // Identifiers and keywords
    if (/[a-zA-Z_$]/.test(code[i])) {
      let identifier = '';
      while (i < code.length && /[a-zA-Z0-9_$]/.test(code[i])) {
        identifier += code[i];
        i++;
      }
      
      const keywords = [
        'import', 'from', 'export', 'default', 'as',
        'function', 'const', 'let', 'var', 'return',
        'if', 'else', 'for', 'while', 'class',
        'interface', 'type', 'extends', 'implements',
        'public', 'private', 'protected'
      ];
      
      const importKeywords = ['import', 'from', 'export', 'default', 'as'];
      
      if (importKeywords.includes(identifier)) {
        tokens.push({ type: 'import-keyword', value: identifier });
      } else if (keywords.includes(identifier)) {
        tokens.push({ type: 'keyword', value: identifier });
      } else {
        tokens.push({ type: 'identifier', value: identifier });
      }
      continue;
    }

    // Operators and punctuation
    tokens.push({ type: 'operator', value: code[i] });
    i++;
  }

  return tokens;
};

const renderTokens = (tokens: Token[]): string => {
  return tokens.map(token => {
    switch (token.type) {
      case 'comment':
        return `<span class="text-green-600 italic">${token.value}</span>`;
      case 'string':
        return `<span class="text-orange-800">${token.value}</span>`;
      case 'import-keyword':
        return `<span class="text-purple-600">${token.value}</span>`;
      case 'keyword':
        return `<span class="text-blue-600">${token.value}</span>`;
      case 'component':
        return `<span class="text-blue-600">${token.value}</span>`;
      case 'html-tag':
        return `<span class="text-teal-600">${token.value}</span>`;
      case 'attribute':
        return `<span class="text-red-600">${token.value}</span>`;
      case 'number':
        return `<span class="text-green-800">${token.value}</span>`;
      case 'tag-bracket':
        return `<span class="text-gray-600">${token.value}</span>`;
      case 'operator':
        if (['(', ')', '[', ']', '{', '}'].includes(token.value)) {
          return `<span class="text-gray-600">${token.value}</span>`;
        }
        return token.value;
      case 'whitespace':
      case 'identifier':
      default:
        return token.value;
    }
  }).join('');
};

const highlightSyntax = (code: string, language: string = 'tsx') => {
  if (language === 'tsx' || language === 'jsx') {
    const tokens = tokenize(code);
    return renderTokens(tokens);
  }
  
  // Fallback for other languages - simple regex (but safe)
  return code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'tsx', title, minHeight, height }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-lg border bg-muted/50">
      {title && (
        <div className="border-b px-4 py-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
        </div>
      )}
      <div className={`relative ${height ? `h-${height}` : minHeight ? `min-h-[${minHeight}]` : ''}`}>
        <Button
          size="sm"
          variant="ghost"
          className="absolute right-2 top-2 h-8 w-8 p-0 z-10"
          onClick={copyToClipboard}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </Button>
        <pre className="overflow-x-auto p-4 text-sm font-mono h-full flex items-center">
          <code
            className={`language-${language} font-mono whitespace-pre-wrap break-words`}
            dangerouslySetInnerHTML={{ __html: highlightSyntax(code, language) }}
          />
        </pre>
      </div>
    </div>
  );
};
