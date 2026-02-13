import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTenant } from '../contexts/TenantContext';
import { UserRole } from '../types';
import { Shield, Key, CreditCard, Save, Lock, Globe } from 'lucide-react';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { currentTenant } = useTenant();

  if (user?.role !== UserRole.ADMIN) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <div className="bg-red-50 p-6 rounded-full mb-6">
          <Shield size={48} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Access Denied</h2>
        <p className="text-slate-500 mt-2 max-w-sm">You do not have the necessary permissions to view the settings for this tenant.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 mt-2 text-base">Manage your tenant configuration and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Settings Nav (Visual Only for now) */}
        <div className="lg:col-span-1 space-y-1">
           <button className="w-full text-left px-4 py-3 rounded-lg bg-brand-50 text-brand-700 font-semibold text-sm border border-brand-100 flex items-center gap-3">
             <Globe size={18} />
             General
           </button>
           <button className="w-full text-left px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium text-sm transition-colors flex items-center gap-3">
             <Key size={18} />
             API Keys
           </button>
           <button className="w-full text-left px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium text-sm transition-colors flex items-center gap-3">
             <CreditCard size={18} />
             Billing
           </button>
           <button className="w-full text-left px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium text-sm transition-colors flex items-center gap-3">
             <Lock size={18} />
             Security
           </button>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
           {/* General Form */}
           <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-8">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                <div className="p-2 bg-brand-100 text-brand-600 rounded-lg">
                  <Globe size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">General Configuration</h3>
                  <p className="text-xs text-slate-500">Basic tenant information</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Tenant Name</label>
                  <input 
                    type="text" 
                    defaultValue={currentTenant.name}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-sm bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Support Email</label>
                  <input 
                    type="email" 
                    defaultValue={`support@${currentTenant.id.replace('_', '')}.com`}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-sm bg-slate-50 focus:bg-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Workspace URL</label>
                   <div className="flex rounded-lg shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-200 bg-slate-50 text-slate-500 text-sm">
                        nexus.ai/
                      </span>
                      <input
                        type="text"
                        defaultValue={currentTenant.id}
                        className="flex-1 min-w-0 block w-full px-4 py-2.5 rounded-none rounded-r-lg border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm"
                      />
                    </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end pt-4 border-t border-slate-50">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition-all shadow-md shadow-brand-500/20 hover:shadow-lg hover:shadow-brand-500/30">
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
           </div>

           {/* API Keys Section */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Key size={20} />
                </div>
                <div>
                   <h3 className="text-lg font-bold text-slate-900">API Credentials</h3>
                   <p className="text-xs text-slate-500">Access tokens for SDK integration</p>
                </div>
              </div>
              
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                 <div className="flex flex-col">
                   <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Secret Key</span>
                   <code className="text-sm font-mono text-slate-800 bg-white px-3 py-1.5 rounded border border-slate-200 shadow-sm">
                     sk_live_51Mz...q2x9
                   </code>
                 </div>
                 <div className="flex gap-3">
                   <button className="text-sm text-slate-600 hover:text-slate-900 font-medium px-3 py-1.5 hover:bg-slate-200 rounded transition-colors">
                     Copy
                   </button>
                   <button className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1.5 hover:bg-red-50 rounded transition-colors border border-transparent hover:border-red-100">
                     Revoke
                   </button>
                 </div>
              </div>
            </div>

            {/* Billing Section */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <CreditCard size={20} />
                </div>
                 <div>
                   <h3 className="text-lg font-bold text-slate-900">Subscription</h3>
                   <p className="text-xs text-slate-500">Manage your plan and billing</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                <div>
                   <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-sm font-bold text-slate-900">Current Plan</h4>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wide">
                      {currentTenant.plan}
                    </span>
                   </div>
                   <p className="text-xs text-slate-500 max-w-xs">
                     {currentTenant.plan === 'Free' 
                       ? 'Upgrade to Pro to unlock unlimited agents and advanced analytics.' 
                       : 'You have access to all premium features.'}
                   </p>
                </div>
                
                <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold uppercase rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                  Manage Billing
                </button>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;