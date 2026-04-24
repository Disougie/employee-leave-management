import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  LogOut, 
  Moon, 
  Sun, 
  Home, 
  Calendar, 
  FileText, 
  PieChart,
  User,
  UserPlus
} from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = user?.role === 'Manager' ? [
    { name: 'Dashboard', path: '/manager', icon: Home },
    { name: 'Add Employee', path: '/manager/add-employee', icon: UserPlus },
    { name: 'Analytics', path: '/analytics', icon: PieChart },
  ] : [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Apply Leave', path: '/apply', icon: FileText },
    { name: 'My Leaves', path: '/history', icon: Calendar },
  ];

  return (
    <div className="flex h-screen bg-[var(--bg-color)] text-[var(--text-color)] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-[var(--border-color)] bg-[var(--surface-color)] flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
            L
          </div>
          <span className="font-bold text-xl tracking-tight">LeaveSync</span>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400 font-medium shadow-sm' 
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-color)] hover:text-[var(--text-color)]'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-blue-600 dark:text-blue-400' : ''} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-[var(--border-color)]">
          <div className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--text-muted)]">
             <User size={20} />
             <div className="overflow-hidden">
               <p className="truncate font-medium text-[var(--text-color)]">{user?.name}</p>
               <p className="truncate text-xs">{user?.role}</p>
             </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors mt-2 font-medium"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 flex items-center justify-between px-8 border-b border-[var(--border-color)] bg-[var(--surface-color)]/80 backdrop-blur-sm z-10">
          <h1 className="font-semibold text-lg text-[var(--text-color)] capitalize">
            {location.pathname.replace('/', '') || 'Dashboard'}
          </h1>
          
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-[var(--bg-color)] transition-colors text-[var(--text-muted)] hover:text-[var(--text-color)]"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>
        
        <main className="flex-1 overflow-y-auto p-8 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
