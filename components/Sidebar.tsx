
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BookText, LayoutDashboard, LogOut, Sun, Moon, BrainCircuit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isDarkMode, toggleTheme }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-primary text-primary-foreground'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
    }`;

  return (
    <aside className="w-64 flex-shrink-0 border-r border-border bg-card p-4 flex flex-col">
      <div className="flex items-center gap-3 mb-8 px-2">
        <BrainCircuit className="h-8 w-8 text-primary" />
        <h1 className="text-xl font-bold text-foreground">AI Journal</h1>
      </div>
      <nav className="flex-1 space-y-2">
        <NavLink to="/journal" className={navLinkClasses}>
          <BookText className="mr-3 h-5 w-5" />
          Journal
        </NavLink>
        <NavLink to="/dashboard" className={navLinkClasses}>
          <LayoutDashboard className="mr-3 h-5 w-5" />
          Dashboard
        </NavLink>
      </nav>
      <div className="mt-auto">
        <div className="p-2 mb-2">
          <p className="text-sm font-medium text-foreground">Welcome, {user?.username || 'User'}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>
        <button
          onClick={toggleTheme}
          className="w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground mb-2"
        >
          {isDarkMode ? <Sun className="mr-3 h-5 w-5" /> : <Moon className="mr-3 h-5 w-5" />}
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg text-muted-foreground hover:bg-destructive hover:text-destructive-foreground"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
