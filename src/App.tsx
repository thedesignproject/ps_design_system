
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StagewiseToolbar } from "@stagewise/toolbar-react";
import { ReactPlugin } from "@stagewise-plugins/react";
import { Layout } from "@/components/layout/Layout";
import Index from "./pages/Index";
import Usage from "./pages/Usage";
import ComponentDetail from "./pages/ComponentDetail";
import Installation from "./pages/Installation";
import DesignTokenDetail from "./pages/DesignTokenDetail";
import Playground from "./pages/Playground";
import ThemeBuilder from "./pages/ThemeBuilder";
import NotFound from "./pages/NotFound";

// Add this at the top of the file for TypeScript
declare global {
  interface Window {
    __STAGEWISE_TOOLBAR__?: boolean;
  }
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {import.meta.env.DEV && typeof window !== 'undefined' && !window.__STAGEWISE_TOOLBAR__ && (
        (() => { window.__STAGEWISE_TOOLBAR__ = true; return (
          <StagewiseToolbar 
            config={{
              plugins: [ReactPlugin],
            }}
          />
        )})()
      )}
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/installation" element={<Installation />} />
            <Route path="/components" element={<Usage />} />
            <Route path="/components/:componentName" element={<ComponentDetail />} />
            <Route path="/design-tokens/:tokenName" element={<DesignTokenDetail />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="/theme-builder" element={<ThemeBuilder />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
