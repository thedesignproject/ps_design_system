import React from 'react';
import { List, X } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMenuOpen }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between w-full px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={onMenuToggle}
          >
            {isMenuOpen ? <X size={20} /> : <List size={20} />}
          </Button>
          <div className="flex items-center gap-2">
            <img 
              src="/logo.svg" 
              alt="TDP Logo" 
              className="h-8 w-auto"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
