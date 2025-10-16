import { Transaction, Category, SavingsGoal, Budget } from '../types'

const STORAGE_KEYS = {
  TRANSACTIONS: 'budgetapp_transactions',
  CATEGORIES: 'budgetapp_categories',
  SAVINGS_GOALS: 'budgetapp_savings_goals',
  BUDGETS: 'budgetapp_budgets',
}

export const storage = {
  getTransactions: (): Transaction[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)
    if (!data) return []
    return JSON.parse(data).map((t: any) => ({
      ...t,
      date: new Date(t.date)
    }))
  },

  saveTransactions: (transactions: Transaction[]) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions))
  },

  getCategories: (): Category[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES)
    return data ? JSON.parse(data) : getDefaultCategories()
  },

  saveCategories: (categories: Category[]) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories))
  },

  getSavingsGoals: (): SavingsGoal[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEYS.SAVINGS_GOALS)
    if (!data) return []
    return JSON.parse(data).map((g: any) => ({
      ...g,
      deadline: new Date(g.deadline)
    }))
  },

  saveSavingsGoals: (goals: SavingsGoal[]) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.SAVINGS_GOALS, JSON.stringify(goals))
  },

  getBudgets: (): Budget[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEYS.BUDGETS)
    return data ? JSON.parse(data) : []
  },

  saveBudgets: (budgets: Budget[]) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets))
  },
}

function getDefaultCategories(): Category[] {
  return [
    { id: '1', name: 'Salary', type: 'income', color: '#10b981', icon: '💰' },
    { id: '2', name: 'Freelance', type: 'income', color: '#3b82f6', icon: '💼' },
    { id: '3', name: 'Investments', type: 'income', color: '#8b5cf6', icon: '📈' },
    { id: '4', name: 'Food & Dining', type: 'expense', budgetLimit: 500, color: '#ef4444', icon: '🍔' },
    { id: '5', name: 'Transportation', type: 'expense', budgetLimit: 200, color: '#f59e0b', icon: '🚗' },
    { id: '6', name: 'Shopping', type: 'expense', budgetLimit: 300, color: '#ec4899', icon: '🛍️' },
    { id: '7', name: 'Entertainment', type: 'expense', budgetLimit: 150, color: '#6366f1', icon: '🎬' },
    { id: '8', name: 'Bills & Utilities', type: 'expense', budgetLimit: 400, color: '#14b8a6', icon: '📄' },
    { id: '9', name: 'Healthcare', type: 'expense', budgetLimit: 200, color: '#f43f5e', icon: '🏥' },
    { id: '10', name: 'Education', type: 'expense', budgetLimit: 250, color: '#0ea5e9', icon: '📚' },
  ]
}
