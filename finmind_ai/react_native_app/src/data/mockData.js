export const COLORS = {
  bg: '#080E15',
  card: '#0F1923',
  primary: '#00E5C3',
  secondary: '#6C63FF',
  danger: '#FF6B6B',
  warning: '#FFB347',
  text: '#FFFFFF',
  textMuted: 'rgba(255,255,255,0.4)',
  border: 'rgba(255,255,255,0.06)',
};

export const mockTransactions = [
  {
    id: '1', title: 'Monthly Salary', amount: 8500,
    type: 'income', category: 'salary', icon: '💼',
    date: '2026-05-01', isAnomalous: false,
  },
  {
    id: '2', title: 'Freelance Project', amount: 2200,
    type: 'income', category: 'investment', icon: '📈',
    date: '2026-05-05', isAnomalous: false,
  },
  {
    id: '3', title: 'Restaurant — Nobu', amount: 380,
    type: 'expense', category: 'food', icon: '🍽️',
    date: '2026-05-24', isAnomalous: true,
    note: 'Unusually high for dining',
  },
  {
    id: '4', title: 'Uber Eats', amount: 45,
    type: 'expense', category: 'food', icon: '🍔',
    date: '2026-05-23', isAnomalous: false,
  },
  {
    id: '5', title: 'Netflix + Spotify', amount: 28,
    type: 'expense', category: 'entertainment', icon: '🎬',
    date: '2026-05-10', isAnomalous: false,
  },
  {
    id: '6', title: 'Gym Membership', amount: 85,
    type: 'expense', category: 'health', icon: '💪',
    date: '2026-05-03', isAnomalous: false,
  },
  {
    id: '7', title: 'Electricity Bill', amount: 120,
    type: 'expense', category: 'utilities', icon: '⚡',
    date: '2026-05-08', isAnomalous: false,
  },
  {
    id: '8', title: 'Amazon Shopping', amount: 340,
    type: 'expense', category: 'shopping', icon: '🛍️',
    date: '2026-05-12', isAnomalous: true,
    note: 'Higher than usual shopping spend',
  },
  {
    id: '9', title: 'Metro Card', amount: 65,
    type: 'expense', category: 'transport', icon: '🚇',
    date: '2026-05-02', isAnomalous: false,
  },
  {
    id: '10', title: 'Stock Dividend', amount: 450,
    type: 'income', category: 'investment', icon: '📊',
    date: '2026-05-15', isAnomalous: false,
  },
];

export const mockGoals = [
  {
    id: '1', title: 'Emergency Fund', icon: '🛡️',
    targetAmount: 25000, currentAmount: 18500,
    deadline: '2027-03-01',
  },
  {
    id: '2', title: 'Dream Vacation — Japan', icon: '✈️',
    targetAmount: 8000, currentAmount: 3200,
    deadline: '2026-12-15',
  },
  {
    id: '3', title: 'MacBook Pro', icon: '💻',
    targetAmount: 3500, currentAmount: 2800,
    deadline: '2026-07-01',
  },
];

export const mockCashFlow = [
  { month: 'Jun', income: 10900, expense: 4920 },
  { month: 'Jul', income: 11300, expense: 5160 },
  { month: 'Aug', income: 11100, expense: 5280 },
  { month: 'Sep', income: 11700, expense: 5040 },
  { month: 'Oct', income: 11500, expense: 5520 },
  { month: 'Nov', income: 12100, expense: 5400 },
];

export const mockCategoryBreakdown = [
  { name: 'Food', value: 425, color: '#00E5C3' },
  { name: 'Shopping', value: 340, color: '#6C63FF' },
  { name: 'Utilities', value: 120, color: '#FFB347' },
  { name: 'Health', value: 85, color: '#4FC3F7' },
  { name: 'Transport', value: 65, color: '#AB47BC' },
  { name: 'Entertainment', value: 28, color: '#FF6B6B' },
];
