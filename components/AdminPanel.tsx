
import React, { useEffect, useState } from 'react';
import { ShieldCheck, Users, Bike, Store, TrendingUp, AlertCircle, Sparkles, Activity, Clock } from 'lucide-react';
import { getAdminInsights } from '../services/gemini';

const AdminPanel: React.FC = () => {
  const [aiInsight, setAiInsight] = useState<string>("");
  const [liveEvents, setLiveEvents] = useState([
    { id: 1, type: 'order', msg: 'New order placed at Burger Palace', time: 'Just now' },
    { id: 2, type: 'rider', msg: 'Rider Marco reached pickup point', time: '2m ago' },
    { id: 3, type: 'user', msg: 'New customer registered from Dhaka', time: '5m ago' }
  ]);

  useEffect(() => {
    const fetchInsight = async () => {
      const res = await getAdminInsights({ dailyOrders: 1204, activeRiders: 45, revenue: 24500 });
      setAiInsight(res);
    };
    fetchInsight();

    // Simulation: Add a random live event every 15 seconds
    const interval = setInterval(() => {
      const events = [
        'New order placed at Sushi Zen',
        'Rider assigned to order #FAST-9902',
        'Payment successful for $42.50',
        'Restaurant Pasta Fresca is now online'
      ];
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      setLiveEvents(prev => [{ id: Date.now(), type: 'system', msg: randomEvent, time: 'Just now' }, ...prev.slice(0, 4)]);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 bg-gray-50 h-full overflow-y-auto pb-20">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">FASTgo Control Center</h1>
          <p className="text-gray-500 font-medium">Monitoring global delivery operations in real-time</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-3">
             <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                <ShieldCheck size={20} />
             </div>
             <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Super Admin</p>
                <p className="font-bold text-sm">System Manager</p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
           <Users className="text-blue-500 mb-4" size={24} />
           <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Customers</p>
           <h2 className="text-3xl font-black text-slate-900">24,592</h2>
           <span className="text-xs text-green-500 font-bold bg-green-50 px-2 py-0.5 rounded-full">+240 today</span>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
           <Bike className="text-purple-500 mb-4" size={24} />
           <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Active Riders</p>
           <h2 className="text-3xl font-black text-slate-900">842</h2>
           <span className="text-xs text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-full">-12 from peak</span>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
           <Store className="text-orange-500 mb-4" size={24} />
           <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Partners</p>
           <h2 className="text-3xl font-black text-slate-900">1,204</h2>
           <span className="text-xs text-green-500 font-bold bg-green-50 px-2 py-0.5 rounded-full">14 new</span>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
           <TrendingUp className="text-emerald-500 mb-4" size={24} />
           <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Net Revenue</p>
           <h2 className="text-3xl font-black text-slate-900">$1.2M</h2>
           <span className="text-xs text-green-500 font-bold bg-green-50 px-2 py-0.5 rounded-full">+18% MoM</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
               <div className="flex items-center space-x-2">
                 <Activity className="text-orange-500" size={20} />
                 <h3 className="text-xl font-black">Live Activity Feed</h3>
               </div>
               <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Real-time Stream</span>
               </div>
            </div>
            <div className="space-y-4">
              {liveEvents.map(event => (
                <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all">
                   <div className="flex items-center space-x-4">
                      <div className="bg-white p-2.5 rounded-xl shadow-sm text-slate-400">
                         <Clock size={16} />
                      </div>
                      <div>
                         <p className="font-bold text-sm text-slate-800">{event.msg}</p>
                         <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">{event.time}</p>
                      </div>
                   </div>
                   <div className="w-2 h-2 rounded-full bg-indigo-200"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-black">Critical Alerts</h3>
               <button className="text-xs text-indigo-600 font-bold hover:underline">Mark all resolved</button>
            </div>
            <div className="flex items-center p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 space-x-4">
               <AlertCircle size={24} />
               <div className="flex-1">
                 <p className="font-bold text-sm uppercase tracking-tighter">System Warning</p>
                 <p className="text-xs opacity-80">Unusual login attempts detected from IP 192.168.1.1</p>
               </div>
               <button className="bg-white text-red-600 px-4 py-1.5 rounded-xl text-xs font-bold shadow-sm">Audit</button>
            </div>
          </div>
        </div>

        <div className="bg-indigo-950 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col min-h-[500px] shadow-2xl shadow-indigo-200">
          <div className="absolute top-[-20px] right-[-20px] w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <Sparkles className="absolute top-8 right-8 text-indigo-400 opacity-50 animate-pulse" size={32} />
          
          <div className="relative z-10 flex-1">
            <div className="flex items-center space-x-2 mb-8 bg-white/10 w-fit px-4 py-2 rounded-2xl backdrop-blur-md">
              <Sparkles size={16} className="text-indigo-300" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-100">AI Ops Manager</span>
            </div>
            
            <h3 className="text-2xl font-black mb-6 leading-tight">Strategic Insights from Gemini</h3>
            
            <div className="space-y-6">
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
                <p className="text-sm leading-relaxed text-indigo-100 italic font-medium">
                  "{aiInsight || 'Aggregating cross-platform performance data for operational optimization...'}"
                </p>
              </div>

              <div className="p-6 bg-gradient-to-br from-indigo-500/20 to-transparent rounded-3xl border border-indigo-500/20">
                <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-3">Confidence & Impact</p>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-bold text-indigo-200">Forecast Accuracy</span>
                  <span className="text-lg font-black text-white">94%</span>
                </div>
                <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-400 h-full w-[94%] shadow-[0_0_10px_rgba(129,140,248,0.5)]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 relative z-10 text-center">
             <button className="text-xs font-bold text-indigo-300 hover:text-white transition-colors">Generate Weekly Report &rarr;</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
