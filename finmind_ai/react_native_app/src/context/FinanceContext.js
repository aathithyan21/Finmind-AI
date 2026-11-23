import React, { createContext, useContext, useState } from 'react';
import { mockTransactions, mockGoals, mockCashFlow, mockCategoryBreakdown } from '../data/mockData';

const FinanceContext = createContext(null);

export function FinanceProvider({ children }) {
  const [transactions] = useState(mockTransactions);
  const [goals] = useState(mockGoals);
  const cashFlow = mockCashFlow;
  const categoryBreakdown = mockCategoryBreakdown;

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100) : 0;
  const anomalies = transactions.filter(t => t.isAnomalous);

  return (
    <FinanceContext.Provider value={{
      transactions,
      goals,
      cashFlow,
      categoryBreakdown,
      totalBalance,
      totalIncome,
      totalExpense,
      savingsRate,
      anomalies,
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export const useFinance = () => useContext(FinanceContext);
