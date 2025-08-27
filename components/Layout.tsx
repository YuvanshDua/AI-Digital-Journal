
import React from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, isDarkMode, toggleTheme }) => {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
