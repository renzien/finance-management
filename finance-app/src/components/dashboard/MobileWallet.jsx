import React, { useState } from 'react';
import { Bell, ArrowUpRight, ArrowDownLeft, Wallet, PieChart, MoreHorizontal, Home, Search, CreditCard, User, ArrowRightLeft, ShieldCheck, Plus, Trash2, X } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import TransactionModal from '../TransactionModal';
import AddCardModal from '../AddCardModal';
import { motion, AnimatePresence } from 'framer-motion';

const getCardStyle = (type) => {
  switch(type) {
    case 'gopay': return 'from-cyan-400 to-cyan-600 shadow-cyan-200';
    case 'dana': return 'from-blue-600 to-blue-800 shadow-blue-200';
    case 'bank': return 'from-yellow-400 to-yellow-600 shadow-yellow-200';
    default: return 'from-slate-800 to-slate-900 shadow-slate-200';
  }
};
const getCardName = (type) => {
  switch(type) {
    case 'gopay': return 'GoPay'; case 'dana': return 'DANA'; case 'bank': return 'Bank Card'; default: return 'My Card';
  }
};

export default function MobileWallet() {
  const { balance, formatRupiah, transactions, cards, removeCard } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [cardToManage, setCardToManage] = useState(null);
  const [modalType, setModalType] = useState('expense');
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] overflow-hidden relative font-quicksand">
      {/* CSS untuk menyembunyikan scrollbar */}
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
      
      <div className="flex justify-between items-center p-6 bg-white rounded-b-3xl shadow-sm z-20 relative">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-xl uppercase">A</div>
          <div><p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Halo,</p><h2 className="text-lg font-bold text-slate-800">Alip</h2></div>
        </div>
        <button className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-600 relative"><Bell size={20} /><span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span></button>
      </div>

      <div className="flex-1 overflow-y-auto relative z-10 hide-scrollbar pb-24">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="mt-6">
                {/* --- Carousel Mobile dengan Snapping --- */}
                <div className="flex overflow-x-auto gap-4 px-6 pb-6 snap-x snap-mandatory hide-scrollbar">
                  {cards.length === 0 ? (
                    <div className="w-full snap-center bg-white p-10 rounded-[32px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                      <CreditCard size={40} className="mb-4 opacity-40" />
                      <p className="font-bold text-sm">Dompet Kosong</p>
                      <button onClick={() => setIsCardModalOpen(true)} className="mt-4 bg-slate-900 text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 tracking-wide">+ Tambah Kartu</button>
                    </div>
                  ) : (
                    cards.map(card => (
                      <div 
                        key={card.id} 
                        onClick={() => setCardToManage(card)} 
                        className={`w-full flex-shrink-0 snap-center bg-gradient-to-br ${getCardStyle(card.type)} p-7 rounded-[32px] text-white shadow-xl relative overflow-hidden active:scale-[0.98] transition-all duration-300`}
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
                        <div className="flex justify-between items-center mb-6"><p className="font-bold text-xs tracking-[0.2em] uppercase opacity-90">{getCardName(card.type)}</p><ShieldCheck size={20} /></div>
                        <h1 className="text-4xl font-bold mb-8 tracking-tighter">{formatRupiah(balance)}</h1>
                        <div className="grid grid-cols-2 gap-4">
                          <button onClick={(e) => { e.stopPropagation(); setModalType('income'); setIsModalOpen(true); }} className="bg-white/20 hover:bg-white/30 backdrop-blur-sm py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2"><ArrowDownLeft size={16}/> Pemasukan</button>
                          <button onClick={(e) => { e.stopPropagation(); setModalType('expense'); setIsModalOpen(true); }} className="bg-black/20 hover:bg-black/30 backdrop-blur-sm py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2"><ArrowUpRight size={16}/> Pengeluaran</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Grid Menu Navigasi */}
              <div className="px-6 grid grid-cols-4 gap-4 mt-2">
                {[{ icon: <ArrowRightLeft />, label: 'Transfer' }, { icon: <Wallet />, label: 'Top Up' }, { icon: <PieChart />, label: 'Statistik', action: () => setActiveTab('statistics') }, { icon: <MoreHorizontal />, label: 'Lainnya' }].map((item, idx) => (
                  <div key={idx} onClick={item.action} className="flex flex-col items-center gap-2 active:scale-90 transition-transform cursor-pointer">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-700 shadow-sm border border-gray-100">{item.icon}</div>
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Transaksi Terakhir */}
              <div className="px-6 mt-8">
                <h3 className="text-sm font-bold text-slate-400 mb-5 tracking-[0.2em] uppercase">Transaksi Terakhir</h3>
                <div className="flex flex-col gap-3">
                  {transactions.map(tx => (
                    <div key={tx.id} className="bg-white p-4 rounded-[24px] flex items-center justify-between shadow-sm border border-slate-50 transition-all active:bg-slate-50">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>{tx.type === 'income' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}</div>
                        <div><p className="font-bold text-slate-800 text-sm">{tx.name}</p><p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{tx.date} • {tx.time}</p></div>
                      </div>
                      <span className={`font-bold ${tx.type === 'income' ? 'text-emerald-500' : 'text-slate-800'}`}>{tx.type === 'income' ? '+' : '-'}{formatRupiah(tx.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigasi Bawah */}
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-100 px-6 py-4 flex justify-between items-center z-20 shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.05)]">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center transition-all ${activeTab === 'home' ? 'text-emerald-600 scale-110' : 'text-gray-400'}`}><Home size={22} /><span className="text-[9px] font-bold mt-1 uppercase tracking-tighter">Beranda</span></button>
        <button onClick={() => setActiveTab('statistics')} className={`flex flex-col items-center transition-all ${activeTab === 'statistics' ? 'text-emerald-600 scale-110' : 'text-gray-400'}`}><PieChart size={22} /><span className="text-[9px] font-bold mt-1 uppercase tracking-tighter">Statistik</span></button>
        <button onClick={() => setIsCardModalOpen(true)} className="flex flex-col items-center text-gray-400 active:scale-90"><CreditCard size={22} /><span className="text-[9px] font-bold mt-1 uppercase tracking-tighter">Kartu</span></button>
        <button className="flex flex-col items-center text-gray-400 active:scale-90"><User size={22} /><span className="text-[9px] font-bold mt-1 uppercase tracking-tighter">Profil</span></button>
      </div>

      <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} defaultType={modalType} />
      <AddCardModal isOpen={isCardModalOpen} onClose={() => setIsCardModalOpen(false)} />

      {/* Modal Discard Mobile */}
      <AnimatePresence>
        {cardToManage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/70 z-[60] flex items-end justify-center p-4">
             <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="bg-white w-full max-w-md rounded-[40px] p-8 pb-10 shadow-2xl">
                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8" />
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">{getCardName(cardToManage.type)}</h3>
                    <p className="text-slate-400 font-medium mt-1">Konfirmasi hapus metode pembayaran?</p>
                  </div>
                  <button onClick={() => setCardToManage(null)} className="p-2 bg-slate-100 rounded-full text-slate-400"><X size={20}/></button>
                </div>
                <div className="flex flex-col gap-4">
                  <button onClick={() => { removeCard(cardToManage.id); setCardToManage(null); }} className="w-full flex items-center justify-center gap-3 p-5 rounded-3xl bg-rose-50 text-rose-600 font-bold border border-rose-100 active:scale-95 transition-all">
                    <Trash2 size={20}/> Hapus Kartu (Discard)
                  </button>
                  <button onClick={() => setCardToManage(null)} className="w-full p-5 rounded-3xl bg-slate-100 text-slate-600 font-bold border border-slate-200 active:scale-95 transition-all uppercase text-xs tracking-widest">Batal</button>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}