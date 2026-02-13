import React, { useState, useRef, useEffect } from 'react';
import { useTenant } from '../contexts/TenantContext';
import { ChevronDown, Check, Building2, PlusCircle } from 'lucide-react';

const TenantSwitcher: React.FC = () => {
  const { currentTenant, availableTenants, switchTenant } = useTenant();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors duration-200 group"
      >
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
           <Building2 size={18} />
        </div>
        <div className="text-left hidden md:block">
          <p className="text-sm font-bold text-slate-800 leading-tight">
            {currentTenant.name}
          </p>
          <p className="text-xs text-slate-500 font-medium">
            {currentTenant.plan} Plan
          </p>
        </div>
        <ChevronDown size={14} className={`text-slate-400 ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 md:left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 ring-1 ring-slate-900/5">
          <div className="px-4 py-2 border-b border-slate-50 mb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Organization</span>
          </div>
          <div className="max-h-64 overflow-y-auto custom-scrollbar">
            {availableTenants.map((tenant) => (
              <button
                key={tenant.id}
                onClick={() => {
                  switchTenant(tenant.id);
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-3">
                   <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm ${tenant.id === currentTenant.id ? 'bg-brand-600' : 'bg-slate-200 text-slate-500'}`}>
                     {tenant.name.substring(0, 1).toUpperCase()}
                   </div>
                   <div>
                      <p className={`text-sm font-semibold ${tenant.id === currentTenant.id ? 'text-slate-900' : 'text-slate-600'}`}>
                        {tenant.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {tenant.plan}
                      </p>
                   </div>
                </div>
                {tenant.id === currentTenant.id && (
                  <Check size={16} className="text-brand-600" />
                )}
              </button>
            ))}
          </div>
          <div className="mt-1 pt-2 border-t border-slate-50 px-3 pb-1">
            <button className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
              <PlusCircle size={14} />
              Create Organization
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantSwitcher;