
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active section from current path
  const getActiveSection = () => {
    const path = location.pathname;
    if (path === '/components') return 'Components';
    if (path.startsWith('/components/')) {
      // Extract component name from URL and convert to display name
      const componentName = path.split('/')[2];
      return componentName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    if (path === '/installation') return 'Installation';
    if (path === '/playground') return 'Component Playground';
    if (path === '/theme-builder') return 'Theme Builder';
    if (path.startsWith('/design-tokens/')) {
      // Extract design token name from URL and convert to display name
      const tokenName = path.split('/')[2];
      return tokenName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    if (path === '/') return 'Introduction';
    return 'Introduction';
  };

  const activeSection = getActiveSection();

  const handleItemSelect = (section: string, item?: string) => {
    if (section === 'Components' && item) {
      if (item === 'Usage' || item === 'All Components') {
        navigate('/components');
      } else {
        const urlName = item.toLowerCase().replace(/\s+/g, '-');
        navigate(`/components/${urlName}`);
      }
    } else if (section === 'Design Tokens' && item) {
      const urlName = item.toLowerCase().replace(/\s+/g, '-');
      navigate(`/design-tokens/${urlName}`);
    } else if (section === 'Playground' && item) {
      if (item === 'Component Playground') {
        navigate('/playground');
      } else if (item === 'Theme Builder') {
        navigate('/theme-builder');
      }
    } else if (item) {
      // Handle specific navigation for Getting Started items
      if (item === 'Installation') {
        navigate('/installation');
      } else if (item === 'Introduction') {
        navigate('/');
      } else if (item === 'Usage') {
        navigate('/components');
      } else {
        // For other sections like Design Tokens, etc.
        navigate('/'); // For now, navigate to home
      }
    } else {
      navigate('/');
    }
    setIsSidebarOpen(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background w-full">
        <Header 
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          isMenuOpen={isSidebarOpen}
        />
        
        <div className="flex">
          <Sidebar 
            isOpen={isSidebarOpen}
            onItemSelect={handleItemSelect}
            activeSection={activeSection}
            onSearch={handleSearch}
          />
          
          <main className="flex-1 md:ml-64">
            <div className="container max-w-6xl mx-auto px-4 py-8">
              {children}
            </div>
          </main>
        </div>

        {isSidebarOpen && (
          <div 
            className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </ThemeProvider>
  );
}; 
