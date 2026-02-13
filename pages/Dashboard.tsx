import React, { useState, useMemo } from 'react';
import { useTenant } from '../contexts/TenantContext';
import { TENANT_DATA } from '../constants';
import { 
  Phone, 
  PhoneIncoming, 
  PhoneMissed, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  Filter, 
  Download,
  Calendar,
  Building,
  MoreHorizontal,
  Users,
  X
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell,
  Legend 
} from 'recharts';

type TimeRange = 'today' | 'weekly' | 'monthly' | 'yearly' | 'custom';

const Dashboard: React.FC = () => {
  const { currentTenant } = useTenant();
  const [timeRange, setTimeRange] = useState<TimeRange>('weekly');
  const [selectedBrand, setSelectedBrand] = useState('all');
  
  // Custom Date Range State
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  // Mock brands for the dropdown filter
  const brands = [
    { id: 'all', name: 'All Brands' },
    { id: 'b1', name: 'Sales Team A' },
    { id: 'b2', name: 'Support Center' },
    { id: 'b3', name: 'Marketing Campaign' },
  ];

  // Generate dynamic data based on tenant and time range
  const dashboardData = useMemo(() => {
    const baseMultiplier = currentTenant.plan === 'Enterprise' ? 10 : currentTenant.plan === 'Pro' ? 5 : 1;
    
    let timeMultiplier = 1;
    let diffDays = 7;

    if (timeRange === 'today') {
      timeMultiplier = 1;
      diffDays = 1;
    } else if (timeRange === 'weekly') {
      timeMultiplier = 7;
      diffDays = 7;
    } else if (timeRange === 'monthly') {
      timeMultiplier = 30;
      diffDays = 30;
    } else if (timeRange === 'yearly') {
      timeMultiplier = 365;
      diffDays = 365;
    } else if (timeRange === 'custom') {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include start date
      timeMultiplier = diffDays > 0 ? diffDays : 1;
    }

    const totalCalls = Math.floor(150 * baseMultiplier * timeMultiplier * (Math.random() * 0.5 + 0.8));
    const missedCalls = Math.floor(totalCalls * 0.15); // 15% missed rate approx
    const connectedCalls = totalCalls - missedCalls;
    
    // Avg duration varies slightly
    const avgDurationMin = 2 + Math.random() * 3; 
    const avgDurationSec = Math.floor((avgDurationMin % 1) * 60);
    const avgDurationStr = `${Math.floor(avgDurationMin)}m ${avgDurationSec.toString().padStart(2, '0')}s`;

    // Chart Data Generation
    let chartData = [];
    let labels: string[] = [];

    switch (timeRange) {
      case 'today':
        labels = ['8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm'];
        break;
      case 'weekly':
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        break;
      case 'monthly':
        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        break;
      case 'yearly':
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        break;
      case 'custom':
        // Generate labels based on range (max 7-10 points to avoid crowding)
        labels = [];
        if (diffDays <= 7) {
             // Show every day
             for (let i = 0; i < diffDays; i++) {
                const d = new Date(startDate);
                d.setDate(d.getDate() + i);
                labels.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
             }
        } else {
            // Show ~7 points distributed
            const step = Math.ceil(diffDays / 7);
            for (let i = 0; i < diffDays; i += step) {
                const d = new Date(startDate);
                d.setDate(d.getDate() + i);
                labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            }
        }
        break;
      default:
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    }

    chartData = labels.map(label => ({
      name: label,
      calls: Math.floor((totalCalls / labels.length) * (Math.random() * 0.6 + 0.7)),
      success: Math.floor((connectedCalls / labels.length) * (Math.random() * 0.6 + 0.7)),
      failed: Math.floor((missedCalls / labels.length) * (Math.random() * 0.6 + 0.7)),
    }));

    return {
      totalCalls,
      connectedCalls,
      missedCalls,
      avgDuration: avgDurationStr,
      chartData,
      pieData: [
        { name: 'Connected', value: connectedCalls },
        { name: 'Missed/Failed', value: missedCalls },
      ]
    };
  }, [currentTenant.id, timeRange, startDate, endDate]);

  const COLORS = ['#0ea5e9', '#ef4444']; // Brand Blue, Red for failed

  const StatCard = ({ title, value, icon: Icon, trend, trendUp, colorClass, bgClass }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-soft hover:shadow-md transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <span className="text-slate-500 text-sm font-semibold">{title}</span>
        <div className={`p-2.5 rounded-xl ${bgClass} ${colorClass} group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
        <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
          {trendUp ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
          <span>{trend}</span>
        </div>
      </div>
    </div>
  );

  const activeAgents = (TENANT_DATA[currentTenant.id] || []).filter(a => a.status === 'active').length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-2 text-base flex items-center gap-2">
            Overview for <span className="font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-100">{currentTenant.name}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
           {/* Brand Filter */}
           <div className="relative group">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <Building size={16} className="text-slate-400" />
             </div>
             <select 
               value={selectedBrand}
               onChange={(e) => setSelectedBrand(e.target.value)}
               className="pl-10 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-sm appearance-none cursor-pointer hover:bg-slate-50 transition-colors w-40"
             >
               {brands.map(b => (
                 <option key={b.id} value={b.id}>{b.name}</option>
               ))}
             </select>
           </div>

           {/* Time Range Filter */}
           <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <Calendar size={16} className="text-slate-400" />
             </div>
             <select 
               value={timeRange}
               onChange={(e) => setTimeRange(e.target.value as TimeRange)}
               className="pl-10 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-sm appearance-none cursor-pointer hover:bg-slate-50 transition-colors capitalize w-40"
             >
               <option value="today">Today</option>
               <option value="weekly">Weekly</option>
               <option value="monthly">Monthly</option>
               <option value="yearly">Yearly</option>
               <option value="custom">Custom Date</option>
             </select>
           </div>
           
           {/* Custom Date Inputs */}
           {timeRange === 'custom' && (
             <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="relative">
                  <input 
                    type="date" 
                    value={startDate}
                    max={endDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-sm w-36"
                  />
               </div>
               <span className="text-slate-400 font-medium">-</span>
               <div className="relative">
                  <input 
                    type="date" 
                    value={endDate}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-sm w-36"
                  />
               </div>
             </div>
           )}

           <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-brand-600 hover:bg-brand-50 hover:border-brand-200 transition-all shadow-sm">
             <Download size={20} />
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Calls" 
          value={dashboardData.totalCalls.toLocaleString()} 
          icon={Phone} 
          trend="12.5%" 
          trendUp={true} 
          colorClass="text-blue-600"
          bgClass="bg-blue-50"
        />
        <StatCard 
          title="Connected Calls" 
          value={dashboardData.connectedCalls.toLocaleString()} 
          icon={PhoneIncoming} 
          trend="8.2%" 
          trendUp={true} 
          colorClass="text-emerald-600"
          bgClass="bg-emerald-50"
        />
        <StatCard 
          title="Missed Calls" 
          value={dashboardData.missedCalls.toLocaleString()} 
          icon={PhoneMissed} 
          trend="2.4%" 
          trendUp={false} 
          colorClass="text-red-600"
          bgClass="bg-red-50"
        />
        <StatCard 
          title="Avg. Duration" 
          value={dashboardData.avgDuration} 
          icon={Clock} 
          trend="1.8%" 
          trendUp={true} 
          colorClass="text-amber-600"
          bgClass="bg-amber-50"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Main Volume Chart */}
        <div className="xl:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-soft">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Call Volume Trends</h2>
              <p className="text-xs text-slate-500">Inbound vs Outbound activity over time</p>
            </div>
            <div className="flex items-center gap-2">
               <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                 <span className="w-2.5 h-2.5 rounded-full bg-brand-500"></span> Calls
               </span>
            </div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardData.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#0f172a', fontWeight: 600, fontSize: '13px' }}
                  cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="calls" 
                  stroke="#0ea5e9" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorCalls)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Success vs Failed Pie Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-soft flex flex-col">
          <div className="mb-4">
             <h2 className="text-lg font-bold text-slate-900">Call Outcome</h2>
             <p className="text-xs text-slate-500">Success vs Failed/Missed breakdown</p>
          </div>
          
          <div className="flex-1 min-h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardData.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {dashboardData.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                   itemStyle={{ color: '#0f172a', fontWeight: 600, fontSize: '12px' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
               <div className="text-center">
                 <p className="text-2xl font-bold text-slate-800">
                   {Math.round((dashboardData.connectedCalls / dashboardData.totalCalls) * 100)}%
                 </p>
                 <p className="text-[10px] text-slate-400 font-bold uppercase">Success</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agents Row */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-soft">
          <div className="flex items-center justify-between mb-6">
             <div>
               <h2 className="text-lg font-bold text-slate-900">Active Agents</h2>
               <p className="text-xs text-slate-500">Real-time agent status monitoring</p>
             </div>
             <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
               <MoreHorizontal size={20} />
             </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(TENANT_DATA[currentTenant.id] || []).length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <div className="p-3 bg-white rounded-full mb-3 shadow-sm">
                    <Users size={24} className="opacity-50" />
                  </div>
                  <p className="text-sm font-medium">No agents deployed in this workspace</p>
                  <button className="mt-4 px-4 py-2 text-xs font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors">
                    Deploy your first agent
                  </button>
                </div>
              ) : (
                (TENANT_DATA[currentTenant.id] || []).map((agent) => (
                  <div key={agent.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md hover:border-brand-200 transition-all duration-300 group">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-slate-700 shadow-sm ${
                           agent.status === 'active' ? 'bg-gradient-to-br from-emerald-100 to-emerald-200' : 
                           agent.status === 'idle' ? 'bg-gradient-to-br from-amber-100 to-amber-200' : 
                           'bg-gradient-to-br from-slate-100 to-slate-200'
                        }`}>
                          {agent.name.substring(0,2).toUpperCase()}
                        </div>
                        <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                          agent.status === 'active' ? 'bg-emerald-500' : 
                          agent.status === 'idle' ? 'bg-amber-400' : 'bg-slate-400'
                        }`}></span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-brand-700 transition-colors">{agent.name}</p>
                        <p className="text-xs text-slate-500 font-medium capitalize flex items-center gap-1">
                          {agent.status}
                          {agent.status === 'active' && <span className="animate-pulse w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-bold text-slate-700">{agent.callsHandled}</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Calls</p>
                    </div>
                  </div>
                ))
              )}
          </div>
      </div>
    </div>
  );
};

export default Dashboard;