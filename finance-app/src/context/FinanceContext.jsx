import React, { createContext, useState, useEffect, useContext } from 'react';

const FinanceContext = createContext();

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    const savedData = localStorage.getItem('finance_data');
    return savedData ? JSON.parse(savedData) : [];
  });

  const [cards, setCards] = useState(() => {
    const savedCards = localStorage.getItem('finance_cards');
    return savedCards ? JSON.parse(savedCards) : [];
  });

  useEffect(() => {
    localStorage.setItem('finance_data', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finance_cards', JSON.stringify(cards));
  }, [cards]);

  const addTransaction = (newTransaction) => {
    setTransactions(prev => [{ id: Date.now(), ...newTransaction }, ...prev]);
  };

  const addCard = (type) => {
    setCards(prev => {
      if (prev.some(card => card.type === type)) return prev;
      return [...prev, { id: Date.now(), type }];
    });
  };

  const removeCard = (id) => {
    setCards(prev => prev.filter(card => card.id !== id));
  };

  const getBalance = () => {
    return transactions.reduce((acc, curr) => {
      return curr.type === 'income' ? acc + curr.amount : acc - curr.amount;
    }, 0);
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    }).format(angka);
  };

  return (
    <FinanceContext.Provider value={{
      transactions, cards, addTransaction, addCard, removeCard, balance: getBalance(), formatRupiah
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export const useFinance = () => useContext(FinanceContext);