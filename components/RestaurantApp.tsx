
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, Utensils, ClipboardList, Settings, MoreHorizontal, Check, RefreshCcw } from 'lucide-react';
import { INITIAL_ORDERS } from '../constants';
import { Order } from '../types';

const RestaurantApp: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [activeTab, setActiveTab] = useState('orders');

  const data = [
    { name: 'Mon', revenue: 400 },
    { name: 'Tue', revenue: 700 },
    { name: 'Wed', revenue: 1200 },
    { name: 'Thu', revenue: 900 },
    { name: 'Fri', revenue: 1500 },
    { name: 'Sat', revenue: 2000 },
    { name: 'Sun', revenue: 1800 },
  ];

  const updateStatus = (id: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  return (
    <div className="flex h-full min-h-[600px] bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xl">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-100 p-6 flex flex-col">
        <div className="flex items-center space-x-2 mb-10 px-2">
          <div className="bg-orange-500 p-2 rounded-lg text-white">
            <Utensils size={20} />
          </div>
          <span className="font-bold text-lg tracking-tight">FASTgo Biz</span>
        </div>

        <nav className="flex-1 space-y-1">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-orange-500 text-white font-bold' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-orange-500 text-white font-bold' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <ClipboardList size={20} />
            <span>Orders</span>
          </button>
          <button 
            onClick={() => setActiveTab('menu')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'menu' ? 'bg-orange-500 text-white font-bold' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <Utensils size={20} />
            <span>Menu Manager</span>
          </button>
        </nav>

        <div className="mt-auto p-4 bg-orange-50 rounded-2xl border border-orange-100">
          <p className="text-[10px] text-orange-600 font-bold uppercase mb-1">Store Status</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-900">Open for Orders</span>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-10">
        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in slide-in-from-bottom duration-500">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900">Store Dashboard</h2>
                <p className="text-gray-500">Overview of your business performance</p>
              </div>
              <div className="bg-white border rounded-xl px-4 py-2 text-sm font-medium shadow-sm">Last 7 Days</div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-10">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-sm mb-1">Total Revenue</p>
                <h3 className="text-2xl font-bold text-gray-900">$8,432.50</h3>
                <span className="text-xs text-green-600 font-bold">+12% from last week</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-sm mb-1">Total Orders</p>
                <h3 className="text-2xl font-bold text-gray-900">412</h3>
                <span className="text-xs text-green-600 font-bold">+5% from last week</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-sm mb-1">Average Rating</p>
                <h3 className="text-2xl font-bold text-gray-900">4.8</h3>
                <span className="text-xs text-gray-400">98 reviews</span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-80">
              <h4 className="font-bold mb-6">Revenue Trend</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#fef3c7'}} />
                  <Bar dataKey="revenue" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="animate-in fade-in duration-300">
             <div className="flex justify-between items-center mb-8">
               <h2 className="text-3xl font-extrabold">Active Orders</h2>
               <div className="flex space-x-2">
                 <button className="p-2 border rounded-lg hover:bg-gray-50"><RefreshCcw size={18} /></button>
                 <button className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold text-sm">Download Report</button>
               </div>
             </div>

             <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
               <table className="w-full text-left">
                 <thead className="bg-gray-50 border-b border-gray-100">
                   <tr>
                     <th className="px-6 py-4 font-bold text-sm text-gray-500">Order ID</th>
                     <th className="px-6 py-4 font-bold text-sm text-gray-500">Customer</th>
                     <th className="px-6 py-4 font-bold text-sm text-gray-500">Items</th>
                     <th className="px-6 py-4 font-bold text-sm text-gray-500">Status</th>
                     <th className="px-6 py-4 font-bold text-sm text-gray-500">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                   {orders.map(order => (
                     <tr key={order.id}>
                       <td className="px-6 py-4 font-bold text-sm">{order.id}</td>
                       <td className="px-6 py-4 text-sm font-medium">{order.customerName}</td>
                       <td className="px-6 py-4 text-sm text-gray-500">{order.items.length} items • ${order.total}</td>
                       <td className="px-6 py-4">
                         <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                           order.status === 'completed' ? 'bg-green-100 text-green-700' :
                           order.status === 'preparing' ? 'bg-blue-100 text-blue-700' :
                           'bg-orange-100 text-orange-700'
                         }`}>
                           {order.status}
                         </span>
                       </td>
                       <td className="px-6 py-4">
                         {order.status === 'pending' && (
                           <button 
                             onClick={() => updateStatus(order.id, 'preparing')}
                             className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
                           >
                             Start Cooking
                           </button>
                         )}
                         {order.status === 'preparing' && (
                           <button 
                             onClick={() => updateStatus(order.id, 'ready')}
                             className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
                           >
                             Ready to Pick Up
                           </button>
                         )}
                         {order.status === 'ready' && (
                           <span className="text-gray-400 text-xs font-medium italic">Waiting for rider...</span>
                         )}
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}

        {activeTab === 'menu' && (
           <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Utensils size={64} className="mb-4 opacity-20" />
              <p className="font-bold text-xl">Menu Management module coming soon.</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantApp;
