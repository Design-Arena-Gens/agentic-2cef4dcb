export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  category: string
  description: string
  date: Date
  isRecurring?: boolean
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly'
}

export interface Category {
  id: string
  name: string
  type: TransactionType
  budgetLimit?: number
  color: string
  icon: string
}

export interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: Date
  color: string
}

export interface Budget {
  id: string
  categoryId: string
  limit: number
  period: 'weekly' | 'monthly' | 'yearly'
  spent: number
}
