import React from 'react';
import { LayoutDashboard, Wallet, PieChart, CreditCard, Settings, ShieldCheck } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <div className="w-20 bg-white border-r border-gray-100 flex flex-col items-center py-8 gap-8 hidden md:flex z-20 relative">
      <div className="bg-slate-900 text-white p-2 rounded-xl">
        <ShieldCheck size={28} />
      </div>
      <nav className="flex flex-col gap-6 mt-4 text-gray-400">
        
        {/* Tombol Overview */}
        <button 
          onClick={() => setActiveTab('overview')}
          className={`p-3 rounded-xl transition-all ${
            activeTab === 'overview' ? 'bg-emerald-50 text-emerald-600' : 'hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <LayoutDashboard size={24} />
        </button>

        <button className="p-3 hover:text-slate-800 hover:bg-slate-50 transition-all rounded-xl">
          <Wallet size={24} />
        </button>
        
        {/* Tombol Statistics */}
        <button 
          onClick={() => setActiveTab('statistics')}
          className={`p-3 rounded-xl transition-all ${
            activeTab === 'statistics' ? 'bg-emerald-50 text-emerald-600' : 'hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <PieChart size={24} />
        </button>

        <button className="p-3 hover:text-slate-800 hover:bg-slate-50 transition-all rounded-xl">
          <CreditCard size={24} />
        </button>
      </nav>
      
      <div className="mt-auto">
        <button className="p-3 text-gray-400 hover:text-slate-800 hover:bg-slate-50 transition-all rounded-xl">
          <Settings size={24} />
        </button>
      </div>
    </div>
  );
}