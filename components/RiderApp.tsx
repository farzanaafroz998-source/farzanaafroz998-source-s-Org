
import React, { useState } from 'react';
import { Power, MapPin, Navigation, DollarSign, Package, CheckCircle, Bell, ArrowRight, User } from 'lucide-react';

const RiderApp: React.FC = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [activeOrder, setActiveOrder] = useState<any>(null);

  const earnings = 145.50;
  const completedToday = 8;

  const mockOrders = [
    { id: 'ORD-1', restaurant: 'Burger Palace', distance: '1.2 km', reward: '$5.50', items: 2 },
    { id: 'ORD-2', restaurant: 'Sushi Zen', distance: '2.4 km', reward: '$8.20', items: 1 }
  ];

  return (
    <div className="max-w-md mx-auto h-[800px] bg-slate-900 shadow-2xl rounded-[3rem] border-[8px] border-slate-800 overflow-hidden relative flex flex-col text-white">
      {/* Header */}
      <div className="p-8 pb-4 pt-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Hello, Alex!</h1>
            <p className="text-slate-400 text-sm">Delivery Partner</p>
          </div>
          <button 
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full font-bold transition-all ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}
          >
            <Power size={18} />
            <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-800 p-4 rounded-3xl">
            <div className="bg-emerald-500/10 text-emerald-500 w-10 h-10 rounded-full flex items-center justify-center mb-2">
              <DollarSign size={20} />
            </div>
            <p className="text-slate-400 text-xs uppercase tracking-wider font-bold">Earnings</p>
            <h2 className="text-xl font-bold">${earnings}</h2>
          </div>
          <div className="bg-slate-800 p-4 rounded-3xl">
            <div className="bg-blue-500/10 text-blue-500 w-10 h-10 rounded-full flex items-center justify-center mb-2">
              <Package size={20} />
            </div>
            <p className="text-slate-400 text-xs uppercase tracking-wider font-bold">Orders</p>
            <h2 className="text-xl font-bold">{completedToday}</h2>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-t-[3rem] p-8 text-slate-900 overflow-y-auto pb-24">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold">New Requests</h3>
          <Bell size={20} className="text-slate-400" />
        </div>

        {!isOnline ? (
          <div className="flex flex-col items-center justify-center h-48 text-center text-slate-400">
            <Power size={48} className="mb-4 opacity-20" />
            <p className="font-medium">Go online to start receiving <br/> delivery requests.</p>
          </div>
        ) : activeOrder ? (
          <div className="bg-slate-100 p-6 rounded-3xl mb-4 border-2 border-orange-500 animate-pulse-slow">
            <div className="flex justify-between mb-4">
               <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-bold">ACTIVE ORDER</span>
               <span className="text-sm font-bold">#ORD-5421</span>
            </div>
            <h4 className="font-bold text-xl mb-1">{activeOrder.restaurant}</h4>
            <div className="flex items-center text-sm text-slate-500 mb-6">
              <MapPin size={14} className="mr-1" />
              <span>Picking up from Main St.</span>
            </div>
            <button className="w-full bg-orange-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center space-x-2">
              <Navigation size={18} />
              <span>Navigate to Store</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {mockOrders.map(order => (
              <div key={order.id} className="bg-slate-50 p-5 rounded-3xl border border-slate-100 hover:border-orange-500 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-base">{order.restaurant}</h4>
                    <p className="text-slate-500 text-xs flex items-center mt-1">
                      <MapPin size={12} className="mr-1" /> {order.distance}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="block font-bold text-lg text-emerald-600">{order.reward}</span>
                    <span className="text-[10px] text-slate-400">{order.items} items</span>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveOrder(order)}
                  className="w-full bg-slate-900 text-white font-bold py-3 rounded-2xl group-hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Accept Request</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Nav */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around items-center py-5 px-4 rounded-b-[2.5rem]">
        <CheckCircle size={22} className="text-orange-500" />
        <Navigation size={22} className="text-slate-400" />
        <DollarSign size={22} className="text-slate-400" />
        {/* Fix: Added missing User import from lucide-react */}
        <User size={22} className="text-slate-400" />
      </div>
    </div>
  );
};

export default RiderApp;
