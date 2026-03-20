import React, { useState, useRef, useEffect } from 'react';
import { Wallet, Plus, ArrowDownLeft, ArrowUpRight, PieChart, CreditCard, ShieldCheck, Cpu, Trash2 } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, Tooltip, ResponsiveContainer, CartesianGrid, YAxis } from 'recharts';
import Sidebar from '../layout/Sidebar';
import DesktopHeader from '../layout/DesktopHeader';
import TransactionModal from '../TransactionModal';
import AddCardModal from '../AddCardModal';
import { useFinance } from '../../context/FinanceContext';
import { motion, AnimatePresence } from 'framer-motion';

const chartData = [ { name: 'Jan', income: 4000, expense: 2400 }, { name: 'Feb', income: 3000, expense: 1398 }, { name: 'Mar', income: 2000, expense: 9800 } ];

const getCardStyle = (type) => {
  switch(type) {
    case 'gopay': return 'from-cyan-400 via-cyan-500 to-cyan-600 shadow-cyan-200';
    case 'dana': return 'from-blue-600 via-blue-700 to-blue-800 shadow-blue-300';
    case 'bank': return 'from-yellow-400 via-yellow-500 to-yellow-600 shadow-yellow-200';
    default: return 'from-slate-800 to-slate-900 shadow-slate-200';
  }
};
const getCardName = (type) => {
  switch(type) {
    case 'gopay': return 'GoPay'; case 'dana': return 'DANA'; case 'bank': return 'Bank Card'; default: return 'Debit Card';
  }
};

export default function DesktopDashboard() {
  const { balance, formatRupiah, transactions, cards, removeCard } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); 
  
  // State dan Ref untuk logika Drag Carousel
  const [dragConstraint, setDragConstraint] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    if (carouselRef.current) {
      // Menghitung seberapa jauh user bisa menggeser (lebar total isi - lebar container)
      setDragConstraint(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
    }
  }, [cards]);

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden select-none font-quicksand">
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
      
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} openCardModal={() => setIsCardModalOpen(true)} />
      
      <div className="flex-1 p-10 overflow-y-auto hide-scrollbar">
        <DesktopHeader />
        
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="mb-10 flex justify-between items-end">
                <div><p className="text-xs text-gray-400 font-bold tracking-[0.3em] uppercase mb-1">Analisis Keuangan</p><h1 className="text-4xl font-bold text-slate-800 tracking-tight">Halo, Alip</h1></div>
                <button onClick={() => setIsModalOpen(true)} className="bg-slate-900 text-white px-8 py-3.5 rounded-full flex items-center gap-3 font-bold shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all hover:scale-105 active:scale-95">Add Record <Plus size={20} /></button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-10">
                {/* --- Kontainer Saldo & Kartu Drag Carousel --- */}
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 flex flex-col justify-between overflow-hidden h-[340px]">
                  <div className="flex items-center justify-between mb-4 px-2">
                    <span className="flex items-center gap-2 text-slate-400 font-bold text-xs tracking-[0.2em] uppercase"><Wallet size={16} /> My Balance</span>
                    <button onClick={() => setIsCardModalOpen(true)} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full transition-all hover:bg-emerald-100">+ Tambah</button>
                  </div>
                  
                  {cards.length === 0 ? (
                    <div className="flex-1 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center text-slate-400"><p className="font-bold text-sm tracking-wide">Belum ada kartu terdaftar</p></div>
                  ) : (
                    <div ref={carouselRef} className="overflow-hidden h-full flex items-center">
                        <motion.div 
                          drag="x" 
                          dragConstraints={{ right: 0, left: -dragConstraint }}
                          className="flex gap-6 cursor-grab active:cursor-grabbing px-2"
                        >
                            {cards.map(card => (
                              <div key={card.id} className="w-[380px] shrink-0 relative group">
                                {/* Tombol Discard */}
                                <button 
                                    onClick={(e) => { e.stopPropagation(); removeCard(card.id); }} 
                                    className="absolute top-5 right-5 p-2.5 bg-rose-500 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-all z-20 shadow-xl hover:scale-110 active:scale-90"
                                >
                                    <Trash2 size={18} />
                                </button>

                                <div className={`w-full bg-gradient-to-br ${getCardStyle(card.type)} p-8 rounded-[32px] text-white shadow-2xl relative overflow-hidden`}>
                                  <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mr-15 -mt-15"></div>
                                  
                                  {/* Header Kartu */}
                                  <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div>
                                        <p className="text-white font-bold text-[10px] tracking-[0.3em] uppercase mb-2">{getCardName(card.type)}</p>
                                        <Cpu size={32} className="text-white/60" />
                                    </div>
                                    <ShieldCheck size={32} className="text-white/80" />
                                  </div>

                                  {/* Nominal - Dinaikkan dan diperbesar sedikit */}
                                  <h2 className="text-[2.75rem] font-bold mb-10 tracking-tight drop-shadow-md leading-none">{formatRupiah(balance)}</h2>
                                  
                                  {/* Informasi Kaki Kartu */}
                                  <div className="flex justify-between items-end relative z-10">
                                    <div>
                                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/50 mb-1">Card Holder</p>
                                      <p className="text-sm font-bold tracking-widest uppercase text-white">ALIP</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/50 mb-1">CVV</p>
                                      <p className="text-sm font-bold text-white tracking-widest">***</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </motion.div>
                    </div>
                  )}
                  {cards.length > 1 && <p className="text-[10px] text-center text-slate-300 font-bold tracking-[0.3em] mt-2 uppercase">← Drag kartu ke kiri/kanan →</p>}
                </div>

                {/* Bagian Statistik Overview tetap sama... */}
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 lg:col-span-2">
                  <div className="mb-10"><p className="text-[10px] text-gray-400 font-bold tracking-[0.2em] uppercase">Expense Analysis</p></div>
                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#cbd5e1', fontWeight: 'bold'}} />
                        <Tooltip cursor={{fill: '#f8fafc'}} />
                        <Bar dataKey="income" fill="#10b981" radius={[6, 6, 6, 6]} barSize={8} />
                        <Bar dataKey="expense" fill="#3b82f6" radius={[6, 6, 6, 6]} barSize={8} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Tabel Transaksi Terakhir Desktop tetap sama... */}
              <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-8 tracking-tight uppercase">Aktivitas Terakhir</h3>
                <div className="flex flex-col gap-5">
                  {transactions.map(tx => (
                    <div key={tx.id} className="bg-slate-50 p-6 rounded-[28px] flex items-center justify-between hover:bg-white hover:border-slate-200 hover:shadow-xl transition-all duration-300 group border border-transparent">
                      <div className="flex items-center gap-6">
                        <div className={`w-16 h-16 rounded-[22px] flex items-center justify-center transition-transform group-hover:rotate-12 ${tx.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>{tx.type === 'income' ? <ArrowDownLeft size={28} /> : <ArrowUpRight size={28} />}</div>
                        <div><p className="font-bold text-slate-800 text-xl tracking-tight">{tx.name}</p><p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{tx.date} • {tx.time}</p></div>
                      </div>
                      <span className={`font-bold text-2xl tracking-tighter ${tx.type === 'income' ? 'text-emerald-500' : 'text-slate-800'}`}>{tx.type === 'income' ? '+' : '-'}{formatRupiah(tx.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <AddCardModal isOpen={isCardModalOpen} onClose={() => setIsCardModalOpen(false)} />
    </div>
  );
}