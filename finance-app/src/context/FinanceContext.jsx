import React, { createContext, useState, useEffect, useContext } from 'react';

const FinanceContext = createContext();

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    const savedData = localStorage.getItem('finance_data');
    return savedData ? JSON.parse(savedData) : [];
  });

  useEffect(() => {
    localStorage.setItem('finance_data', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (newTransaction) => {
    setTransactions(prev => [
      { id: Date.now(), ...newTransaction },
      ...prev
    ]);
  };

  const getBalance = () => {
    return transactions.reduce((acc, curr) => {
      return curr.type === 'income' ? acc + curr.amount : acc - curr.amount;
    }, 0);
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  return (
    <FinanceContext.Provider value={{
      transactions,
      addTransaction,
      balance: getBalance(),
      formatRupiah
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export const useFinance = () => useContext(FinanceContext);