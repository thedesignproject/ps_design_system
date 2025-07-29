import React, { useState } from 'react';
import { CaretRight, Palette, TextT, Ruler, Cube, Play, MagnifyingGlass, Lightning } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface SidebarProps {
  isOpen: boolean;
  onItemSelect: (section: string, item?: string) => void;
  activeSection: string;
  onSearch: (query: string) => void;
}

const componentCategories = [
  {
    title: 'Actions',
    items: ['Button', 'Button Group', 'Compact Button', 'Fancy Button', 'Link Button', 'Social Button']
  },
  {
    title: 'Form Components',
    items: ['Input', 'Textarea', 'Select', 'Checkbox', 'Radio Group', 'Switch', 'Slider', 'Label', 'Form', 'Search', 'Date Picker']
  },
  {
    title: 'Display Components', 
    items: ['Card', 'Badge', 'Avatar', 'Table', 'Chart', 'Progress', 'Skeleton', 'Separator', 'Breadcrumb', 'Calendar', 'Carousel']
  },
  {
    title: 'Feedback Components',
    items: ['Alert', 'Toast', 'Sonner', 'Tooltip', 'Hover Card', 'Loading']
  },
  {
    title: 'Overlay Components',
    items: ['Modal', 'Dialog', 'Alert Dialog', 'Drawer', 'Sheet', 'Popover']
  },
  {
    title: 'Navigation Components',
    items: ['Tabs', 'Dropdown', 'Menubar', 'Navigation Menu', 'Pagination', 'Command', 'Context Menu']
  },
  {
    title: 'Layout Components',
    items: ['Accordion', 'Collapsible', 'Scroll Area', 'Toggle', 'Toggle Group']
  }
];

const navigationItems = [
  {
    title: 'Getting Started',
    icon: Lightning,
    items: ['Introduction', 'Installation']
  },
  {
    title: 'Design Tokens',
    icon: Palette,
    items: ['Colors', 'Typography', 'Spacing', 'Radius', 'Shadows']
  },
  {
    title: 'Components',
    icon: Cube,
    items: ['All Components']
  },
  {
    title: 'Playground',
    icon: Play,
    items: ['Component Playground', 'Theme Builder']
  }
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onItemSelect, activeSection, onSearch }) => {
  const [openSections, setOpenSections] = React.useState<Set<string>>(new Set(['Components']));
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSection = (section: string) => {
    setOpenSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <aside className={`fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 transform border-r bg-background transition-transform md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-4 border-b">
        <div className="relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search components"
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
      </div>
      <ScrollArea className="h-[calc(100%-5rem)] px-4 py-6">
        <nav className="space-y-2">
          {navigationItems.map((section) => {
            const Icon = section.icon;
            const isOpen = openSections.has(section.title);
            
            // Special handling for Components section
            if (section.title === 'Components') {
              return (
                <Collapsible key={section.title} open={isOpen} onOpenChange={() => toggleSection(section.title)}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-2 font-medium"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {section.title}
                      </div>
                      <CaretRight className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-6 mt-2">
                    <div className="space-y-4">
                      <Button
                        key="All Components"
                        variant="ghost"
                        className={`w-full justify-start p-2 text-sm ${activeSection === 'Usage' ? 'bg-muted' : ''}`}
                        onClick={() => onItemSelect('Components', 'Usage')}
                      >
                        All Components
                      </Button>
                      {componentCategories.map((category) => (
                        <div key={category.title}>
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            {category.title}
                          </h4>
                          <div className="space-y-1">
                            {category.items.map((item) => (
                              <Button
                                key={item}
                                variant="ghost"
                                className={`w-full justify-start p-2 text-sm ${activeSection === item ? 'bg-muted' : ''}`}
                                onClick={() => onItemSelect('Components', item)}
                              >
                                {item}
                              </Button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            }
            
            // Regular collapsible sections for other items
            return (
              <Collapsible key={section.title} open={isOpen} onOpenChange={() => toggleSection(section.title)}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-2 font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {section.title}
                    </div>
                    <CaretRight className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 pl-6">
                  {section.items.map((item) => (
                    <Button
                      key={item}
                      variant="ghost"
                      className={`w-full justify-start p-2 text-sm ${activeSection === item ? 'bg-muted' : ''}`}
                      onClick={() => onItemSelect(section.title, item)}
                    >
                      {item}
                    </Button>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </nav>
      </ScrollArea>
    </aside>
  );
};
