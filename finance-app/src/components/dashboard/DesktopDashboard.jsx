import React, { useState } from 'react';
import { Wallet, Plus, ArrowDownLeft, ArrowUpRight, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, CartesianGrid, YAxis } from 'recharts';
import Sidebar from '../layout/Sidebar';
import DesktopHeader from '../layout/DesktopHeader';
import TransactionModal from '../TransactionModal';
import { useFinance } from '../../context/FinanceContext';
import { motion, AnimatePresence } from 'framer-motion';

const chartData = [ { name: 'Jan', income: 4000, expense: 2400 }, { name: 'Feb', income: 3000, expense: 1398 }, { name: 'Mar', income: 2000, expense: 9800 } ];

export default function DesktopDashboard() {
  const { balance, formatRupiah, transactions } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // State navigasi: 'overview' atau 'statistics'

  // Varian Animasi Slide Up untuk transisi halaman
  const pageVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.4, type: "spring", bounce: 0.2, staggerChildren: 0.1 } 
    },
    exit: { opacity: 0, y: -40, transition: { duration: 0.3 } }
  };

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden">
      {/* Mengirim props activeTab ke Sidebar agar Sidebar bisa mengubah halaman */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 p-8 overflow-y-auto">
        <DesktopHeader />
        
        {/* AnimatePresence mengizinkan animasi keluar (exit) sebelum animasi masuk */}
        <AnimatePresence mode="wait">
          
          {/* HALAMAN 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              variants={pageVariants}
              initial="hidden" 
              animate="visible" 
              exit="exit"
            >
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="mb-8 flex justify-between items-end">
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">👋 Welcome In, Alip</p>
                  <h1 className="text-3xl font-bold text-slate-800">Financial Overview</h1>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-slate-900 text-white px-6 py-2.5 rounded-full flex items-center gap-2 font-medium hover:bg-slate-800 transition-colors">
                  Add Record <Plus size={18} />
                </button>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-gray-500 font-medium mb-6"><Wallet size={20} /> My Balance</div>
                  <div className="bg-gradient-to-br from-emerald-400 to-teal-600 p-6 rounded-2xl text-white shadow-lg shadow-emerald-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
                    <p className="text-emerald-50 text-sm font-medium mb-1">Total Balance</p>
                    <h2 className="text-3xl font-bold mb-8 tracking-wide">{formatRupiah(balance)}</h2>
                    <div><p className="text-xs text-emerald-100 mb-1">Card Holder Name</p><p className="text-sm font-semibold tracking-wider">ALIP</p></div>
                  </div>
                </motion.div>

                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 lg:col-span-2">
                  <div className="flex justify-between items-center mb-6"><p className="text-sm font-bold text-slate-800">Grafik Sementara (Dummy)</p></div>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                        <Tooltip cursor={{fill: 'transparent'}} />
                        <Bar dataKey="income" fill="#34d399" radius={[4, 4, 4, 4]} barSize={8} />
                        <Bar dataKey="expense" fill="#60a5fa" radius={[4, 4, 4, 4]} barSize={8} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </div>

              {/* Bagian Transaksi Terakhir */}
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-800">Transaksi Terakhir</h3>
                  <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">Lihat Semua</button>
                </div>
                
                <div className="flex flex-col gap-3">
                  {transactions.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm py-6">Belum ada transaksi dicatat.</p>
                  ) : (
                    transactions.map((tx) => (
                      <div key={tx.id} className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between border border-gray-100 transition-all hover:bg-white hover:shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tx.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                            {tx.type === 'income' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{tx.name}</p>
                            <p className="text-xs text-gray-400 font-medium mt-0.5">{tx.date}</p>
                          </div>
                        </div>
                        <span className={`font-bold ${tx.type === 'income' ? 'text-emerald-500' : 'text-slate-800'}`}>
                          {tx.type === 'income' ? '+' : '-'}{formatRupiah(tx.amount)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* HALAMAN 2: STATISTICS */}
          {activeTab === 'statistics' && (
            <motion.div 
              key="statistics"
              variants={pageVariants}
              initial="hidden" 
              animate="visible" 
              exit="exit"
              className="flex flex-col h-full"
            >
               <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="mb-8 flex justify-between items-end">
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">📊 Analisis Data</p>
                  <h1 className="text-3xl font-bold text-slate-800">Statistik Keuangan</h1>
                </div>
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex-1 min-h-[500px]">
                  <h3 className="text-lg font-bold text-slate-800 mb-8 flex items-center gap-2">
                    <PieChart className="text-emerald-500" /> Grafik Arus Kas Lengkap (Dummy)
                  </h3>
                  <div className="h-full w-full pb-10">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                        <Tooltip cursor={{fill: '#f8fafc'}} />
                        <Bar dataKey="income" fill="#34d399" radius={[6, 6, 0, 0]} barSize={32} />
                        <Bar dataKey="expense" fill="#60a5fa" radius={[6, 6, 0, 0]} barSize={32} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
      <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}