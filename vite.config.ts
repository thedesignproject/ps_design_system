import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from "fs";

// Custom plugin to serve component source files
const componentSourcePlugin = () => {
  return {
    name: 'component-source',
    configureServer(server: any) {
      server.middlewares.use('/src/components/ui/', (req: any, res: any, next: any) => {
        // Only serve .tsx files for source viewing
        if (req.url.endsWith('.tsx')) {
          const filePath = path.join(__dirname, req.url);
          try {
            if (fs.existsSync(filePath)) {
              const content = fs.readFileSync(filePath, 'utf-8');
              res.setHeader('Content-Type', 'text/plain');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(content);
              return;
            }
          } catch (error) {
            console.error('Error serving component source:', error);
          }
        }
        next();
      });
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false
    },
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    mode === 'development' && componentSourcePlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
