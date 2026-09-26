import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, ClipboardList,
  BarChart3, Bell, Settings, LogOut, ChevronRight, Building2,
  Calendar, CreditCard, Megaphone, Bot, FileText, X, Menu,
  Award, Clock, UserCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

const navGroups = {
  admin: [
    { group: 'Overview', items: [
      { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
      { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    ]},
    { group: 'Management', items: [
      { to: '/admin/students', label: 'Students', icon: GraduationCap },
      { to: '/admin/faculty', label: 'Faculty', icon: Users },
      { to: '/admin/users', label: 'User Accounts', icon: UserCheck },
    ]},
    { group: 'Academics', items: [
      { to: '/admin/departments', label: 'Departments', icon: Building2 },
      { to: '/admin/courses', label: 'Courses & Subjects', icon: BookOpen },
      { to: '/admin/classes', label: 'Classes', icon: Calendar },
      { to: '/admin/examinations', label: 'Examinations', icon: FileText },
      { to: '/admin/attendance', label: 'Attendance', icon: ClipboardList },
    ]},
    { group: 'Finance & Comms', items: [
      { to: '/admin/fees', label: 'Fees & Payments', icon: CreditCard },
      { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
    ]},
  ],
  faculty: [
    { group: 'Overview', items: [
      { to: '/faculty', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    ]},
    { group: 'Teaching', items: [
      { to: '/faculty/attendance', label: 'Mark Attendance', icon: ClipboardList },
      { to: '/faculty/examinations', label: 'Examinations', icon: FileText },
      { to: '/faculty/assignments', label: 'Assignments', icon: BookOpen },
    ]},
    { group: 'AI Tools', items: [
      { to: '/faculty/ai-tools', label: 'AI Faculty Tools', icon: Bot },
    ]},
    { group: 'Communication', items: [
      { to: '/faculty/announcements', label: 'Announcements', icon: Megaphone },
    ]},
  ],
  student: [
    { group: 'Overview', items: [
      { to: '/student', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    ]},
    { group: 'Academics', items: [
      { to: '/student/attendance', label: 'My Attendance', icon: ClipboardList },
      { to: '/student/results', label: 'Results & Grades', icon: Award },
      { to: '/student/assignments', label: 'Assignments', icon: BookOpen },
      { to: '/student/timetable', label: 'Timetable', icon: Clock },
    ]},
    { group: 'Finance', items: [
      { to: '/student/fees', label: 'Fee Status', icon: CreditCard },
    ]},
    { group: 'AI Assistant', items: [
      { to: '/student/ai-assistant', label: 'AI Assistant', icon: Bot },
    ]},
  ],
};

export const Sidebar = ({ mobileOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const groups = navGroups[user?.role] || [];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch {
      toast.error('Logout failed');
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#061e17] dark:bg-[#03130e] text-white border-r border-emerald-900/30">
      {/* Logo */}
      <div className="flex items-center gap-3 p-5 border-b border-emerald-900/30">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-400 via-teal-500 to-emerald-600 flex items-center justify-center shadow-glow flex-shrink-0">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-white truncate text-sm">ClassMate</p>
          <p className="text-xs text-emerald-400/70 truncate capitalize">{user?.role} Portal</p>
        </div>
        {mobileOpen !== undefined && (
          <button onClick={onClose} className="ml-auto p-1 hover:bg-emerald-800/40 rounded-lg lg:hidden text-emerald-300">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-4 overflow-y-auto scrollbar-hide">
        {groups.map((group) => (
          <div key={group.group}>
            <p className="px-3 mb-1.5 text-[10px] font-bold text-emerald-400/60 uppercase tracking-widest">
              {group.group}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                >
                  <item.icon className="w-4 h-4 sidebar-icon flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-3 border-t border-emerald-900/30">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl mb-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-emerald-300/60 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="sidebar-link w-full mt-0.5 text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 z-50">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
