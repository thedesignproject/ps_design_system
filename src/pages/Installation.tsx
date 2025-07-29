import { useState } from 'react';
import { Copy, Check, Terminal, Package, Gear, Download } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeBlock } from '@/components/documentation/CodeBlock';

const Installation = () => {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const copyToClipboard = async (text: string, commandId: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedCommand(commandId);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  const CommandCard = ({ 
    title, 
    description, 
    command, 
    commandId, 
    icon: Icon 
  }: {
    title: string;
    description: string;
    command: string;
    commandId: string;
    icon: any;
  }) => (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Icon size={20} className="text-primary" />
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <p className="text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <pre className="bg-muted/50 rounded-lg p-4 text-sm font-mono overflow-x-auto">
            <code>{command}</code>
          </pre>
          <Button
            size="sm"
            variant="ghost"
            className="absolute right-2 top-2 h-8 w-8 p-0"
            onClick={() => copyToClipboard(command, commandId)}
          >
            {copiedCommand === commandId ? <Check size={16} /> : <Copy size={16} />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-12 pl-0">
        <h1 className="text-4xl font-bold mb-4">Installation</h1>
        <p className="text-muted-foreground">
          Get started with TDP Design System using our CLI tool. <br></br> Set up beautiful, accessible components in minutes.
        </p>
      </div>

      {/* Quick Start */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Download size={24} />
          Quick Start
        </h2>
        
        <Tabs defaultValue="npx" className="w-full space-y-4">
          <TabsList>
            <TabsTrigger value="npx">Using npx (Recommended)</TabsTrigger>
            <TabsTrigger value="global">Global Install</TabsTrigger>
          </TabsList>
          
          <TabsContent value="npx" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">
                  Use npx to run the CLI without installing it globally:
                </p>
                <CodeBlock 
                  code="npx @tdp/cli init" 
                  title="Initialize TDP Design System"
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="global" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">
                  Install the CLI globally for repeated use:
                </p>
                <CodeBlock 
                  code={`npm install -g @tdp/cli\n\n# Then use anywhere\ntdp init`}
                  title="Global Installation"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Step by Step Guide */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Step-by-Step Guide</h2>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <CardTitle className="text-lg">Navigate to your project</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                Make sure you're in your React project directory:
              </p>
              <CodeBlock code="cd your-project-name" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <CardTitle className="text-lg">Initialize TDP</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                Run the initialization command. This will set up Tailwind CSS, install dependencies, and configure your project:
              </p>
              <CodeBlock code="npx @tdp/cli init" />
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  💡 <strong>Tip:</strong> The CLI will detect your framework and configure everything automatically. 
                  It will also provide font installation instructions at the end.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <CardTitle className="text-lg">Add components</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                Start adding components to your project:
              </p>
              <CodeBlock code={`# Add individual components\ntdp add button\ntdp add card\n\n# Or add multiple at once\ntdp add button card input`} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                  4
                </div>
                <CardTitle className="text-lg">Start using components</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                Import and use components in your React files:
              </p>
              <CodeBlock 
                code={`import { Button } from "@/components/ui/button"\n\nexport function App() {\n  return <Button>Hello TDP!</Button>\n}`}
                language="tsx"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Commands */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Terminal size={24} />
          Available Commands
        </h2>
        
        <div className="grid gap-6">
          <CommandCard
            title="tdp init"
            description="Initialize TDP Design System in your project with interactive setup"
            command={`tdp init                    # Interactive setup\ntdp init --yes             # Skip prompts, use defaults`}
            commandId="init"
            icon={Gear}
          />
          
          <CommandCard
            title="tdp add <component>"
            description="Add specific components to your project"
            command={`tdp add button             # Add button component\ntdp add card               # Add card component\ntdp add input              # Add input component\ntdp add badge              # Add badge component`}
            commandId="add"
            icon={Package}
          />
          
          <CommandCard
            title="tdp setup"
            description="Run additional configuration and setup tasks"
            command={`tdp setup                  # Additional setup tasks\ntdp setup --force         # Force overwrite existing config`}
            commandId="setup"
            icon={Gear}
          />
        </div>
      </div>

      {/* What You Get */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">What You Get</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Design Tokens</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Colors</Badge>
                <span className="text-sm text-muted-foreground">Semantic color system with light/dark mode</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Typography</Badge>
                <span className="text-sm text-muted-foreground">Geist font family with Halyard Display for headings</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Spacing</Badge>
                <span className="text-sm text-muted-foreground">Consistent spacing scale</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Border Radius</Badge>
                <span className="text-sm text-muted-foreground">Unified border radius system</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Developer Experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline">TypeScript</Badge>
                <span className="text-sm text-muted-foreground">Full TypeScript support</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Accessibility</Badge>
                <span className="text-sm text-muted-foreground">WCAG compliant components</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Dark Mode</Badge>
                <span className="text-sm text-muted-foreground">Built-in dark mode support</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Responsive</Badge>
                <span className="text-sm text-muted-foreground">Mobile-first responsive design</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Framework Support */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Framework Support</h2>
        
        <Card>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium">React + Vite</span>
                <Badge variant="default">Supported</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium">Next.js</span>
                <Badge variant="default">Supported</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium">React + Webpack</span>
                <Badge variant="default">Supported</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium">Vue</span>
                <Badge variant="secondary">Coming Soon</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Example Usage */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Example Usage</h2>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">After Installation</CardTitle>
            <p className="text-muted-foreground">
              Once you've run <code className="font-mono text-sm bg-muted px-1 py-0.5 rounded">tdp init</code>, you can immediately start using components:
            </p>
          </CardHeader>
          <CardContent>
            <CodeBlock
              code={`import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to TDP</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Get Started</Button>
      </CardContent>
    </Card>
  )
}`}
              language="tsx"
              title="MyComponent.tsx"
            />
          </CardContent>
        </Card>
      </div>

      {/* Requirements */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Requirements</h2>
        
        <Card>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium">System Requirements</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Node.js 16 or higher</li>
                  <li>• npm, yarn, or pnpm</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Project Requirements</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• React 18 or higher</li>
                  <li>• Tailwind CSS</li>
                  <li>• TypeScript (recommended)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next Steps */}
      <div className="text-center">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4">Ready to get started?</h3>
            <p className="text-muted-foreground mb-6">
              Initialize TDP Design System in your project and start building beautiful UIs.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => copyToClipboard('npx @tdp/cli init', 'final-init')}
                className="gap-2"
              >
                {copiedCommand === 'final-init' ? <Check size={16} /> : <Copy size={16} />}
                {copiedCommand === 'final-init' ? 'Copied!' : 'Copy Install Command'}
              </Button>
              <Button variant="outline" asChild>
                <a href="/components">Browse Components</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Installation; 