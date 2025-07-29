import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Check, FileText, Code2, Download, ExternalLink } from 'lucide-react';
import { CodeBlock } from './CodeBlock';
import { hasComponentSource, getComponentFilePath } from '@/lib/component-source';
import { getInlineComponentSource, hasInlineComponentSource } from '@/lib/component-sources';

interface ComponentSourceViewerProps {
  componentName: string;
}

export const ComponentSourceViewer: React.FC<ComponentSourceViewerProps> = ({ componentName }) => {
  const [sourceCode, setSourceCode] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadSourceCode = async () => {
      setLoading(true);
      setError(null);

      const filePath = getComponentFilePath(componentName);
      if (!filePath) {
        setError(`No source file mapping found for ${componentName}`);
        setLoading(false);
        return;
      }

      try {
        // Try to fetch from file system first
        const response = await fetch(filePath);
        
        if (!response.ok) {
          throw new Error(`Failed to load source: ${response.status}`);
        }
        
        const source = await response.text();
        setSourceCode(source);
      } catch (err) {
        console.error('Error loading component source from file, trying inline source:', err);
        
        // Fallback to inline source
        const inlineSource = getInlineComponentSource(componentName);
        if (inlineSource) {
          setSourceCode(inlineSource);
        } else {
          setError(`Could not load source code for ${componentName}`);
        }
      } finally {
        setLoading(false);
      }
    };

    if (hasComponentSource(componentName) || hasInlineComponentSource(componentName)) {
      loadSourceCode();
    } else {
      setError(`Source code not available for ${componentName}`);
      setLoading(false);
    }
  }, [componentName]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sourceCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const downloadFile = () => {
    const blob = new Blob([sourceCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${componentName.toLowerCase().replace(/\s+/g, '-')}.tsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const openInNewTab = () => {
    const filePath = getComponentFilePath(componentName);
    if (filePath) {
      window.open(filePath, '_blank');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 size={20} />
            Source Code
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 size={20} />
            Source Code
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Source Not Available</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Extract key parts of the source code
  const extractImports = (source: string) => {
    const importLines = source.split('\n').filter(line => 
      line.trim().startsWith('import') && !line.includes('//') 
    );
    return importLines.join('\n');
  };

  const extractMainComponent = (source: string) => {
    // Try to find the main component export
    const lines = source.split('\n');
    const exportLineIndex = lines.findIndex(line => 
      line.includes('export') && 
      (line.includes('const') || line.includes('function')) &&
      line.includes(componentName)
    );
    
    if (exportLineIndex === -1) return source;
    
    // Find the closing brace for this component
    let braceCount = 0;
    let inComponent = false;
    const componentLines = [];
    
    for (let i = exportLineIndex; i < lines.length; i++) {
      const line = lines[i];
      componentLines.push(line);
      
      for (const char of line) {
        if (char === '{') {
          braceCount++;
          inComponent = true;
        } else if (char === '}') {
          braceCount--;
          if (inComponent && braceCount === 0) {
            return componentLines.join('\n');
          }
        }
      }
    }
    
    return componentLines.join('\n');
  };

  const extractInterfaces = (source: string) => {
    const interfaceRegex = /(?:interface|type)\s+\w*(?:Props|Config|Options)?\s*=?\s*{[^}]*}/g;
    const interfaces = source.match(interfaceRegex) || [];
    return interfaces.join('\n\n');
  };

  const imports = extractImports(sourceCode);
  const mainComponent = extractMainComponent(sourceCode);
  const interfaces = extractInterfaces(sourceCode);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Code2 size={20} />
            Source Code
            <Badge variant="secondary" className="ml-2">
              {componentName}
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="flex items-center gap-2"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied' : 'Copy All'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadFile}
              className="flex items-center gap-2"
            >
              <Download size={16} />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={openInNewTab}
              className="flex items-center gap-2"
            >
              <ExternalLink size={16} />
              View File
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="full" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="full">Full Source</TabsTrigger>
            <TabsTrigger value="component">Component</TabsTrigger>
            <TabsTrigger value="imports">Imports</TabsTrigger>
            <TabsTrigger value="types">Types</TabsTrigger>
          </TabsList>
          
          <TabsContent value="full" className="mt-4">
            <CodeBlock 
              code={sourceCode} 
              language="tsx" 
              title={`${componentName}.tsx`}
            />
          </TabsContent>
          
          <TabsContent value="component" className="mt-4">
            <CodeBlock 
              code={mainComponent || 'Component definition not found'} 
              language="tsx" 
              title="Main Component"
            />
          </TabsContent>
          
          <TabsContent value="imports" className="mt-4">
            <CodeBlock 
              code={imports || 'No imports found'} 
              language="tsx" 
              title="Imports"
            />
          </TabsContent>
          
          <TabsContent value="types" className="mt-4">
            <CodeBlock 
              code={interfaces || 'No type definitions found'} 
              language="tsx" 
              title="Type Definitions"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}; 