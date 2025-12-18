
import React, { useState } from 'react';
import { AppRole } from './types';
import CustomerApp from './components/CustomerApp';
import RiderApp from './components/RiderApp';
import RestaurantApp from './components/RestaurantApp';
import AdminPanel from './components/AdminPanel';
import { Smartphone, Bike, Store, ShieldCheck, Zap, Globe, Github } from 'lucide-react';

const App: React.FC = () => {
  const [role, setRole] = useState<AppRole>(AppRole.CUSTOMER);

  const renderView = () => {
    switch (role) {
      case AppRole.CUSTOMER: return <CustomerApp />;
      case AppRole.RIDER: return <RiderApp />;
      case AppRole.RESTAURANT: return <RestaurantApp />;
      case AppRole.ADMIN: return <AdminPanel />;
      default: return <CustomerApp />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
      {/* Platform Switcher Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-600 p-2.5 rounded-2xl text-white shadow-lg shadow-orange-200">
              <Zap size={24} className="fill-current" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-slate-900">FASTgo</h1>
              <div className="flex items-center space-x-2">
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Operational</span>
              </div>
            </div>
          </div>

          <nav className="flex bg-slate-100/80 p-1.5 rounded-[2rem] border border-slate-200">
            {[
              { id: AppRole.CUSTOMER, label: 'Customer', icon: Smartphone },
              { id: AppRole.RIDER, label: 'Rider', icon: Bike },
              { id: AppRole.RESTAURANT, label: 'Store', icon: Store },
              { id: AppRole.ADMIN, label: 'Admin', icon: ShieldCheck },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setRole(item.id)}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-full transition-all duration-300 ${
                  role === item.id 
                    ? 'bg-white shadow-sm text-orange-600 font-bold scale-105' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <item.icon size={18} />
                <span className="text-sm font-semibold">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-4">
             <a href="https://github.com" target="_blank" className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
               <Github size={20} />
             </a>
             <button className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg active:scale-95 transition-all">
                Get the App
             </button>
          </div>
        </div>
      </header>

      {/* Viewport Area */}
      <main className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-50 via-white to-slate-50">
        <div className="w-full h-full max-w-6xl animate-in fade-in zoom-in duration-700">
           {renderView()}
        </div>
      </main>

      <footer className="py-8 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-slate-400 text-xs font-medium space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <span>&copy; 2024 FASTgo Ecosystem</span>
            <span className="h-4 w-[1px] bg-slate-200"></span>
            <a href="#" className="hover:text-orange-500">Privacy Policy</a>
            <a href="#" className="hover:text-orange-500">Terms of Service</a>
          </div>
          <div className="flex items-center space-x-2">
            <Globe size={14} />
            <span>Region: Global (Vercel Edge)</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
