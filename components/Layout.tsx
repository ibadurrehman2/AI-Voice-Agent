import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import TenantSwitcher from './TenantSwitcher';
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  Mic, 
  LogOut, 
  Menu,
  X,
  Bell,
  Search,
  HelpCircle,
  PanelLeftClose,
  PanelLeft,
  History
} from 'lucide-react';
import { UserRole } from '../types';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile state
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop state
  const location = useLocation();
  const navigate = useNavigate();

  // Persist collapsed state preference
  useEffect(() => {
    const savedState = localStorage.getItem('nexus_sidebar_collapsed');
    if (savedState) setIsCollapsed(savedState === 'true');
  }, []);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('nexus_sidebar_collapsed', String(newState));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavItem = ({ to, icon: Icon, label, restrictedTo }: { to: string; icon: any; label: string; restrictedTo?: UserRole }) => {
    if (restrictedTo && user?.role !== restrictedTo) return null;

    const isActive = location.pathname === to;
    
    return (
      <NavLink
        to={to}
        onClick={() => setIsSidebarOpen(false)}
        className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group mx-3 mb-1 ${
          isActive 
            ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/20' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
        } ${isCollapsed ? 'justify-center px-2' : ''}`}
        title={isCollapsed ? label : ''}
      >
        <Icon size={20} className={`shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
        
        {!isCollapsed && (
          <span className="text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300">
            {label}
          </span>
        )}
        
        {/* Tooltip for collapsed state */}
        {isCollapsed && (
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl border border-slate-700">
            {label}
          </div>
        )}
      </NavLink>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/80 z-30 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-40 bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 ease-in-out shadow-2xl
          ${isSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}
        `}
      >
        {/* Logo Area */}
        <div className={`h-16 flex items-center border-b border-slate-800/50 bg-slate-950/30 transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'px-6'}`}>
           <div className="flex items-center gap-3 overflow-hidden">
             <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white shadow-glow shrink-0">
               <Mic size={20} />
             </div>
             <div className={`flex flex-col transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
                <span className="font-bold text-lg tracking-tight text-white whitespace-nowrap">
                  Nexus AI
                </span>
             </div>
           </div>
           
           {/* Mobile Close Button */}
           <button 
             className="ml-auto lg:hidden text-slate-400 hover:text-white"
             onClick={() => setIsSidebarOpen(false)}
           >
             <X size={20} />
           </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-6 space-y-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <div className={`px-6 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider transition-opacity duration-200 ${isCollapsed ? 'opacity-0 h-0 overflow-hidden mb-0' : 'opacity-100'}`}>
              Platform
          </div>
          
          <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/history" icon={History} label="Call History" />
          <NavItem to="/agents" icon={Users} label="Voice Agents" />
          
          <div className="my-4 border-t border-slate-800 mx-4 opacity-50"></div>

          <div className={`px-6 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider transition-opacity duration-200 ${isCollapsed ? 'opacity-0 h-0 overflow-hidden mb-0' : 'opacity-100'}`}>
               Management
          </div>
          <NavItem to="/settings" icon={Settings} label="Settings" restrictedTo={UserRole.ADMIN} />
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/30 space-y-2">
            
            {/* Collapse Toggle (Desktop) */}
            <button 
                onClick={toggleCollapse}
                className={`hidden lg:flex items-center justify-center w-full p-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors ${isCollapsed ? '' : 'mb-2'}`}
                title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
                {isCollapsed ? <PanelLeft size={18} /> : (
                    <div className="flex items-center gap-2 w-full px-2">
                        <PanelLeftClose size={18} />
                        <span className="text-xs font-medium">Collapse Sidebar</span>
                    </div>
                )}
            </button>

            {/* User Profile */}
            <div className={`flex items-center gap-3 rounded-xl p-2 transition-all duration-200 ${isCollapsed ? 'justify-center bg-transparent' : 'bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800/50'}`}>
                <div className="relative shrink-0">
                <img 
                    src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.name}&background=0ea5e9&color=fff`} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full border border-slate-600"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
                </div>
                
                {!isCollapsed && (
                <div className="flex-1 min-w-0 overflow-hidden">
                    <p className="text-xs font-semibold text-slate-200 truncate">{user?.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
                </div>
                )}
                
                {!isCollapsed && (
                <button 
                    onClick={handleLogout} 
                    className="text-slate-500 hover:text-red-400 p-1.5 rounded-md hover:bg-slate-700/50 transition-colors"
                    title="Logout"
                >
                    <LogOut size={16} />
                </button>
                )}
            </div>

            {/* Collapsed Logout */}
            {isCollapsed && (
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Sign Out"
                >
                    <LogOut size={18} />
                </button>
            )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-slate-50/50 transition-all duration-300">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shadow-sm z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-md transition-colors"
            >
              <Menu size={20} />
            </button>
            
            {/* Search Bar */}
            <div className="hidden lg:flex items-center relative">
               <Search size={16} className="absolute left-3 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Search agents, logs..." 
                 className="pl-9 pr-4 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 w-64 transition-all"
               />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
             <TenantSwitcher />
             <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
             <button className="p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-colors relative">
               <Bell size={20} />
               <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
             </button>
             <button className="p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-colors hidden md:block">
               <HelpCircle size={20} />
             </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
           <div className="max-w-7xl mx-auto">
             <Outlet />
           </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
