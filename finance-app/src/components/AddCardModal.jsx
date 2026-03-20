import React from 'react';
import { X, Wallet, CreditCard } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function AddCardModal({ isOpen, onClose }) {
  const { addCard, cards } = useFinance();

  // Fungsi untuk mengecek apakah kartu sudah ada
  const hasCard = (type) => cards.some(c => c.type === type);

  const handleAdd = (type) => {
    if (!hasCard(type)) {
      addCard(type);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6 relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">Tambah Kartu</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-rose-500 transition-colors"><X size={24} /></button>
            </div>
            
            <div className="flex flex-col gap-3">
              
              {/* Tombol GoPay */}
              <button disabled={hasCard('gopay')} onClick={() => handleAdd('gopay')} className={`flex items-center justify-between p-4 rounded-2xl transition-all border text-left ${hasCard('gopay') ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed' : 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100 border-cyan-200 group'}`}>
                <div className="flex items-center gap-4">
                  <div className={`p-2 bg-white rounded-xl shadow-sm ${!hasCard('gopay') && 'group-hover:scale-110 transition-transform'}`}><Wallet size={24} className={hasCard('gopay') ? 'text-slate-400' : 'text-cyan-500'}/></div>
                  <div><p className={`font-bold text-lg leading-none ${hasCard('gopay') ? 'text-slate-500' : ''}`}>GoPay</p><p className={`text-xs mt-1 ${hasCard('gopay') ? 'text-slate-400' : 'text-cyan-600/70'}`}>E-Wallet Card</p></div>
                </div>
                {hasCard('gopay') && <span className="text-xs font-bold text-slate-500 bg-slate-200 px-3 py-1 rounded-full">Terdaftar</span>}
              </button>
              
              {/* Tombol DANA */}
              <button disabled={hasCard('dana')} onClick={() => handleAdd('dana')} className={`flex items-center justify-between p-4 rounded-2xl transition-all border text-left ${hasCard('dana') ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed' : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200 group'}`}>
                <div className="flex items-center gap-4">
                  <div className={`p-2 bg-white rounded-xl shadow-sm ${!hasCard('dana') && 'group-hover:scale-110 transition-transform'}`}><Wallet size={24} className={hasCard('dana') ? 'text-slate-400' : 'text-blue-600'}/></div>
                  <div><p className={`font-bold text-lg leading-none ${hasCard('dana') ? 'text-slate-500' : ''}`}>DANA</p><p className={`text-xs mt-1 ${hasCard('dana') ? 'text-slate-400' : 'text-blue-600/70'}`}>E-Wallet Card</p></div>
                </div>
                {hasCard('dana') && <span className="text-xs font-bold text-slate-500 bg-slate-200 px-3 py-1 rounded-full">Terdaftar</span>}
              </button>
              
              {/* Tombol Bank */}
              <button disabled={hasCard('bank')} onClick={() => handleAdd('bank')} className={`flex items-center justify-between p-4 rounded-2xl transition-all border text-left ${hasCard('bank') ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed' : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200 group'}`}>
                <div className="flex items-center gap-4">
                  <div className={`p-2 bg-white rounded-xl shadow-sm ${!hasCard('bank') && 'group-hover:scale-110 transition-transform'}`}><CreditCard size={24} className={hasCard('bank') ? 'text-slate-400' : 'text-yellow-500'}/></div>
                  <div><p className={`font-bold text-lg leading-none ${hasCard('bank') ? 'text-slate-500' : ''}`}>Bank Transfer</p><p className={`text-xs mt-1 ${hasCard('bank') ? 'text-slate-400' : 'text-yellow-700/70'}`}>Debit/Credit Card</p></div>
                </div>
                {hasCard('bank') && <span className="text-xs font-bold text-slate-500 bg-slate-200 px-3 py-1 rounded-full">Terdaftar</span>}
              </button>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}