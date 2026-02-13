import React, { useState, useMemo } from 'react';
import { useTenant } from '../contexts/TenantContext';
import { MOCK_CALL_LOGS } from '../constants';
import { CallLog } from '../types';
import { 
  Search, 
  Filter, 
  Download, 
  PlayCircle, 
  MoreHorizontal, 
  Calendar,
  PhoneIncoming,
  PhoneMissed,
  PhoneOff,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Minus,
  X,
  Clock
} from 'lucide-react';

const CallHistory: React.FC = () => {
  const { currentTenant } = useTenant();
  
  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Selected Call for Dialog
  const [selectedCall, setSelectedCall] = useState<CallLog | null>(null);

  // Derived Data
  const filteredLogs = useMemo(() => {
    return MOCK_CALL_LOGS.filter(log => {
      // 1. Tenant Filter (Global)
      if (log.tenantId !== currentTenant.id) return false;

      // 2. Search Filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        log.callerNumber.includes(searchLower) || 
        log.agentName.toLowerCase().includes(searchLower) ||
        log.id.toLowerCase().includes(searchLower) ||
        log.outcome.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;

      // 3. Status Filter
      if (statusFilter !== 'all' && log.status.toLowerCase() !== statusFilter) return false;

      // 4. Brand Filter
      if (brandFilter !== 'all' && log.brand !== brandFilter) return false;

      // 5. Date Range Filter
      if (dateRange.start) {
        const logDate = new Date(log.startTime).setHours(0,0,0,0);
        const startDate = new Date(dateRange.start).setHours(0,0,0,0);
        if (logDate < startDate) return false;
      }
      if (dateRange.end) {
        const logDate = new Date(log.startTime).setHours(0,0,0,0);
        const endDate = new Date(dateRange.end).setHours(0,0,0,0);
        if (logDate > endDate) return false;
      }

      return true;
    });
  }, [currentTenant.id, searchTerm, statusFilter, brandFilter, dateRange]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Missed': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Failed': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch(sentiment) {
      case 'Positive': return <ThumbsUp size={14} className="text-emerald-500" />;
      case 'Negative': return <ThumbsDown size={14} className="text-red-500" />;
      default: return <Minus size={14} className="text-slate-400" />;
    }
  };

  // Unique brands for filter
  const uniqueBrands = Array.from(new Set(MOCK_CALL_LOGS.filter(l => l.tenantId === currentTenant.id).map(l => l.brand)));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Call History</h1>
        <p className="text-slate-500 mt-2 text-base">
          View and manage call logs for <span className="font-semibold text-brand-600">{currentTenant.name}</span>
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-72">
           <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
           <input 
             type="text" 
             placeholder="Search number, agent, ID..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
           />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
           {/* Date Range - Simplified */}
           <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
             <Calendar size={16} className="text-slate-500" />
             <input 
                type="date" 
                className="bg-transparent text-sm text-slate-700 outline-none w-28 md:w-auto"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
             />
             <span className="text-slate-400">-</span>
             <input 
                type="date" 
                className="bg-transparent text-sm text-slate-700 outline-none w-28 md:w-auto"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
             />
           </div>

           {/* Brand Filter */}
           <select 
             value={brandFilter}
             onChange={(e) => setBrandFilter(e.target.value)}
             className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer"
           >
             <option value="all">All Brands</option>
             {uniqueBrands.map(b => (
               <option key={b} value={b}>{b}</option>
             ))}
           </select>

           {/* Status Filter */}
           <select 
             value={statusFilter}
             onChange={(e) => setStatusFilter(e.target.value)}
             className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer capitalize"
           >
             <option value="all">All Status</option>
             <option value="completed">Completed</option>
             <option value="missed">Missed</option>
             <option value="failed">Failed</option>
           </select>

           <button className="p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors border border-transparent hover:border-brand-100">
             <Download size={20} />
           </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Call ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tenant / Brand</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Caller Number</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Agent Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Sentiment</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Outcome</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedLogs.length > 0 ? (
                paginatedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono text-slate-500">{log.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-900">
                          {new Date(log.startTime).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(log.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-100">
                          {log.brand}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <PhoneIncoming size={14} className="text-slate-400" />
                        <span className="text-sm font-medium text-slate-700">{log.callerNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-600">
                            {log.agentName.charAt(0)}
                        </div>
                        <span className="text-sm text-slate-600">{log.agentName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-slate-600">{log.duration}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                          {getSentimentIcon(log.sentiment)}
                          <span className="text-sm text-slate-600">{log.sentiment}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-700">{log.outcome}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {log.recordingUrl && (
                          <button className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors" title="Play Recording">
                            <PlayCircle size={18} />
                          </button>
                        )}
                        <button 
                          onClick={() => setSelectedCall(log)}
                          className="px-3 py-1.5 bg-white border border-slate-200 hover:border-brand-300 hover:text-brand-600 text-slate-600 text-xs font-bold rounded-lg transition-all shadow-sm flex items-center gap-2"
                        >
                          <FileText size={14} /> Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="p-3 bg-slate-50 rounded-full">
                        <Search size={24} className="opacity-20" />
                      </div>
                      <p>No call logs found matching your criteria.</p>
                      <button 
                        onClick={() => {setSearchTerm(''); setStatusFilter('all'); setBrandFilter('all'); setDateRange({start:'', end:''});}}
                        className="text-brand-600 hover:underline text-sm font-medium"
                      >
                        Clear all filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {paginatedLogs.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
            <p className="text-xs text-slate-500">
              Showing <span className="font-semibold text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold text-slate-900">{Math.min(currentPage * itemsPerPage, filteredLogs.length)}</span> of <span className="font-semibold text-slate-900">{filteredLogs.length}</span> results
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex items-center gap-1">
                 {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                   // Simple pagination logic for demo
                   const pageNum = i + 1;
                   return (
                     <button
                       key={pageNum}
                       onClick={() => setCurrentPage(pageNum)}
                       className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                         currentPage === pageNum 
                           ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20' 
                           : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                       }`}
                     >
                       {pageNum}
                     </button>
                   );
                 })}
              </div>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Call Details Dialog */}
      {selectedCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedCall(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Dialog Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                 <div className={`p-2 rounded-lg ${getStatusColor(selectedCall.status)}`}>
                   {selectedCall.status === 'Missed' ? <PhoneMissed size={20} /> : <PhoneIncoming size={20} />}
                 </div>
                 <div>
                   <h3 className="text-lg font-bold text-slate-900">Call Details</h3>
                   <p className="text-xs text-slate-500 font-mono">{selectedCall.id}</p>
                 </div>
              </div>
              <button 
                onClick={() => setSelectedCall(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Dialog Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                   <p className="text-xs text-slate-500 mb-1">Duration</p>
                   <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                     <Clock size={14} className="text-brand-500" />
                     {selectedCall.duration}
                   </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                   <p className="text-xs text-slate-500 mb-1">Sentiment</p>
                   <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                     {getSentimentIcon(selectedCall.sentiment)}
                     {selectedCall.sentiment}
                   </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                   <p className="text-xs text-slate-500 mb-1">Outcome</p>
                   <p className="text-sm font-bold text-slate-900 truncate" title={selectedCall.outcome}>
                     {selectedCall.outcome}
                   </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                   <p className="text-xs text-slate-500 mb-1">Agent</p>
                   <p className="text-sm font-bold text-slate-900 truncate" title={selectedCall.agentName}>
                     {selectedCall.agentName}
                   </p>
                </div>
              </div>

              {/* Summary Section */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <FileText size={16} className="text-brand-500" />
                  AI Summary
                </h4>
                <div className="bg-brand-50/50 p-4 rounded-xl border border-brand-100 text-sm text-slate-700 leading-relaxed">
                  {selectedCall.summary || "No summary available for this call."}
                </div>
              </div>

              {/* Transcript Section */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <MoreHorizontal size={16} className="text-slate-400" />
                  Transcript Snippet
                </h4>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs font-mono text-slate-600 whitespace-pre-line max-h-40 overflow-y-auto custom-scrollbar">
                  {selectedCall.transcript || "Transcript processing..."}
                </div>
              </div>

            </div>

            {/* Dialog Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedCall(null)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20">
                View Full Analysis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallHistory;