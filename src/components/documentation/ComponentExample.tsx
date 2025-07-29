
import React, { useState } from 'react';
import { Eye, Code, Copy, Check } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeBlock } from './CodeBlock';

interface ComponentExampleProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  code: string;
}

export const ComponentExample: React.FC<ComponentExampleProps> = ({
  title,
  description,
  children,
  code
}) => {
  const [activeTab, setActiveTab] = useState('preview');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      
      <Tabs defaultValue="preview" className="w-full" onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
          <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye size={16} />
            Preview
          </TabsTrigger>
          <TabsTrigger value="code" className="flex items-center gap-2">
              <Code size={16} />
            Code
          </TabsTrigger>
        </TabsList>
          
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="flex items-center gap-2 h-9"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
        
        <TabsContent value="preview" className="mt-4">
          <div className="rounded-lg border bg-background p-8">
            <div className="flex items-center justify-center min-h-[200px]">
              {children}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="code" className="mt-4">
          <CodeBlock code={code} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
