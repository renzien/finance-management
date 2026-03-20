import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function TransactionModal({ isOpen, onClose, defaultType = 'expense' }) {
  const { addTransaction } = useFinance();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState(defaultType);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => { setType(defaultType); }, [defaultType]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !amount) return;
    addTransaction({ name, amount: Number(amount), type, date });
    setName(''); setAmount('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-slate-800">Catat Transaksi</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-rose-500 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-2 block">Tipe Transaksi</label>
                
                {/* --- Animasi Tombol Geser --- */}
                <div className="flex relative bg-slate-100 p-1 rounded-xl z-0">
                  {['income', 'expense'].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setType(tab)}
                      className={`relative flex-1 py-2.5 text-sm font-bold rounded-lg transition-colors outline-none ${
                        type === tab
                          ? (tab === 'income' ? 'text-emerald-700' : 'text-rose-700')
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {type === tab && (
                        <motion.div
                          layoutId="activeTab"
                          className={`absolute inset-0 rounded-lg -z-10 shadow-sm ${
                            tab === 'income' ? 'bg-white border border-emerald-200' : 'bg-white border border-rose-200'
                          }`}
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                        />
                      )}
                      <span className="relative z-10">{tab === 'income' ? 'Pemasukan' : 'Pengeluaran'}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">Nama Keterangan</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Gaji, Makan Siang" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">Nominal (Rp)</label>
                <input type="number" required value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Contoh: 50000" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">Tanggal</label>
                <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-700" />
              </div>

              <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl mt-4 transition-colors">
                Simpan Transaksi
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}