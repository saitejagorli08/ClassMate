import { useState } from 'react';
import { Menu, Bell, Sun, Moon, Search, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const Navbar = ({ onMenuClick, title }) => {
  const { user } = useAuth();
  const { isDark, toggle } = useTheme();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800">
      <div className="flex items-center gap-3 px-4 sm:px-6 h-16">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="btn-ghost p-2 lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {title || 'Dashboard'}
          </h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Dark mode toggle */}
          <button
            onClick={toggle}
            className="btn-ghost p-2 rounded-xl"
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Notifications */}
          <button className="btn-ghost p-2 rounded-xl relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile((p) => !p)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200 max-w-24 truncate">
                {user?.name?.split(' ')[0]}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {showProfile && (
              <div className="absolute right-0 top-full mt-1 w-52 card shadow-lg py-1 z-50 animate-fade-in">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                  <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                  <span className="badge badge-primary mt-1 capitalize">{user?.role}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
