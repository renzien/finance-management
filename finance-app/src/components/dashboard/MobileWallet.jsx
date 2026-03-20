import React, { useState } from 'react';
import { Bell, ArrowUpRight, ArrowDownLeft, Wallet, PieChart, MoreHorizontal, Home, Search, CreditCard, User, ArrowRightLeft, ShieldCheck } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import TransactionModal from '../TransactionModal';
import { motion } from 'framer-motion';

// Konfigurasi animasi berurutan
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 } // Jarak waktu muncul antar elemen
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function MobileWallet() {
  const { balance, formatRupiah, transactions } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('expense');

  const openModal = (type) => { setModalType(type); setIsModalOpen(true); };

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] overflow-y-auto pb-24 relative">
      
      {/* Header tidak perlu animasi berlebihan, langsung muncul */}
      <div className="flex justify-between items-center p-6 bg-white rounded-b-3xl shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-xl">A</div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Selamat datang kembali,</p>
            <h2 className="text-lg font-bold text-slate-800">Alip</h2>
          </div>
        </div>
        <button className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-600 relative">
          <Bell size={20} /><span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>

      {/* Kontainer Animasi Utama */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        
        {/* Kartu Saldo */}
        <motion.div variants={itemVariants} className="px-6 mt-6">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-3xl text-white shadow-xl shadow-slate-200">
            <div className="flex justify-between items-center mb-4">
              <p className="text-slate-300 font-medium text-sm">Total Saldo</p>
              <ShieldCheck size={20} className="text-emerald-400" />
            </div>
            <h1 className="text-4xl font-bold tracking-wide mb-6">{formatRupiah(balance)}</h1>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => openModal('income')} className="bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm transition-colors">
                <ArrowDownLeft size={18} /> Pemasukan
              </button>
              <button onClick={() => openModal('expense')} className="bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm transition-colors">
                <ArrowUpRight size={18} /> Pengeluaran
              </button>
            </div>
          </div>
        </motion.div>

        {/* Menu Navigasi */}
        <motion.div variants={itemVariants} className="px-6 mt-8 grid grid-cols-4 gap-4">
          {[
            { icon: <ArrowRightLeft size={24}/>, label: 'Transfer' },
            { icon: <Wallet size={24}/>, label: 'Top Up' },
            { icon: <PieChart size={24}/>, label: 'Statistik' },
            { icon: <MoreHorizontal size={24}/>, label: 'Lainnya' },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 cursor-pointer">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-700 shadow-sm border border-gray-100">{item.icon}</div>
              <span className="text-xs font-semibold text-slate-600">{item.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Riwayat Transaksi */}
        <motion.div variants={itemVariants} className="px-6 mt-8 mb-4">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Transaksi Terakhir</h3>
          <div className="flex flex-col gap-3">
            {transactions.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-4">Belum ada transaksi dicatat.</p>
            ) : (
              transactions.map((tx) => (
                <div key={tx.id} className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-gray-50">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tx.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                      {tx.type === 'income' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{tx.name}</p>
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

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-100 px-6 py-4 flex justify-between items-center pb-safe z-10">
        <button className="flex flex-col items-center text-emerald-600"><Home size={24} /><span className="text-[10px] font-bold mt-1">Beranda</span></button>
        <button className="flex flex-col items-center text-gray-400 hover:text-slate-800"><Search size={24} /><span className="text-[10px] font-medium mt-1">Cari</span></button>
        <button className="flex flex-col items-center text-gray-400 hover:text-slate-800"><CreditCard size={24} /><span className="text-[10px] font-medium mt-1">Kartu</span></button>
        <button className="flex flex-col items-center text-gray-400 hover:text-slate-800"><User size={24} /><span className="text-[10px] font-medium mt-1">Profil</span></button>
      </div>

      <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} defaultType={modalType} />
    </div>
  );
}
