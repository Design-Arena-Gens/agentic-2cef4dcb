'use client'

import { useState, useEffect } from 'react'
import { Transaction, Category, SavingsGoal, Budget } from './types'
import { storage } from './utils/storage'
import {
  PlusCircle, TrendingUp, TrendingDown, Wallet, Target,
  Calendar, DollarSign, PieChart, BarChart3, Settings,
  Edit2, Trash2, Check, X
} from 'lucide-react'
import { format, startOfMonth, endOfMonth, isWithinInterval, startOfWeek, endOfWeek, startOfYear, endOfYear } from 'date-fns'
import { LineChart, Line, PieChart as RechartsPie, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'budgets' | 'goals' | 'categories'>('dashboard')
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month')

  useEffect(() => {
    setTransactions(storage.getTransactions())
    setCategories(storage.getCategories())
    setSavingsGoals(storage.getSavingsGoals())
    setBudgets(storage.getBudgets())
  }, [])

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: Date.now().toString() }
    const updated = [...transactions, newTransaction]
    setTransactions(updated)
    storage.saveTransactions(updated)
  }

  const deleteTransaction = (id: string) => {
    const updated = transactions.filter(t => t.id !== id)
    setTransactions(updated)
    storage.saveTransactions(updated)
  }

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = { ...category, id: Date.now().toString() }
    const updated = [...categories, newCategory]
    setCategories(updated)
    storage.saveCategories(updated)
  }

  const deleteCategory = (id: string) => {
    const updated = categories.filter(c => c.id !== id)
    setCategories(updated)
    storage.saveCategories(updated)
  }

  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id' | 'currentAmount'>) => {
    const newGoal = { ...goal, id: Date.now().toString(), currentAmount: 0 }
    const updated = [...savingsGoals, newGoal]
    setSavingsGoals(updated)
    storage.saveSavingsGoals(updated)
  }

  const updateGoalProgress = (id: string, amount: number) => {
    const updated = savingsGoals.map(g =>
      g.id === id ? { ...g, currentAmount: g.currentAmount + amount } : g
    )
    setSavingsGoals(updated)
    storage.saveSavingsGoals(updated)
  }

  const deleteGoal = (id: string) => {
    const updated = savingsGoals.filter(g => g.id !== id)
    setSavingsGoals(updated)
    storage.saveSavingsGoals(updated)
  }

  const getPeriodRange = () => {
    const now = new Date()
    switch (selectedPeriod) {
      case 'week':
        return { start: startOfWeek(now), end: endOfWeek(now) }
      case 'month':
        return { start: startOfMonth(now), end: endOfMonth(now) }
      case 'year':
        return { start: startOfYear(now), end: endOfYear(now) }
    }
  }

  const filteredTransactions = transactions.filter(t => {
    const range = getPeriodRange()
    return isWithinInterval(t.date, { start: range.start, end: range.end })
  })

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpenses

  const expensesByCategory = categories
    .filter(c => c.type === 'expense')
    .map(cat => ({
      name: cat.name,
      value: filteredTransactions
        .filter(t => t.type === 'expense' && t.category === cat.id)
        .reduce((sum, t) => sum + t.amount, 0),
      color: cat.color,
      budgetLimit: cat.budgetLimit || 0
    }))
    .filter(c => c.value > 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="bg-white shadow-md border-b-2 border-indigo-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Wallet className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Budget Master</span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'transactions' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Transactions
              </button>
              <button
                onClick={() => setActiveTab('budgets')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'budgets' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Budgets
              </button>
              <button
                onClick={() => setActiveTab('goals')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'goals' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Goals
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'categories' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Categories
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div className="flex space-x-2">
            {(['week', 'month', 'year'] as const).map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-md text-sm font-medium capitalize ${
                  selectedPeriod === period ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowAddTransaction(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Add Transaction
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <Dashboard
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            balance={balance}
            expensesByCategory={expensesByCategory}
            transactions={filteredTransactions}
            categories={categories}
            savingsGoals={savingsGoals}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionsList
            transactions={transactions}
            categories={categories}
            onDelete={deleteTransaction}
          />
        )}

        {activeTab === 'budgets' && (
          <BudgetView
            categories={categories}
            transactions={filteredTransactions}
            period={selectedPeriod}
          />
        )}

        {activeTab === 'goals' && (
          <GoalsView
            goals={savingsGoals}
            onAddGoal={() => setShowAddGoal(true)}
            onUpdateProgress={updateGoalProgress}
            onDelete={deleteGoal}
          />
        )}

        {activeTab === 'categories' && (
          <CategoriesView
            categories={categories}
            onAddCategory={() => setShowAddCategory(true)}
            onDelete={deleteCategory}
          />
        )}

        {showAddTransaction && (
          <AddTransactionModal
            categories={categories}
            onAdd={addTransaction}
            onClose={() => setShowAddTransaction(false)}
          />
        )}

        {showAddGoal && (
          <AddGoalModal
            onAdd={addSavingsGoal}
            onClose={() => setShowAddGoal(false)}
          />
        )}

        {showAddCategory && (
          <AddCategoryModal
            onAdd={addCategory}
            onClose={() => setShowAddCategory(false)}
          />
        )}
      </main>
    </div>
  )
}

function Dashboard({
  totalIncome,
  totalExpenses,
  balance,
  expensesByCategory,
  transactions,
  categories,
  savingsGoals
}: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-3xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
            </div>
            <TrendingUp className="h-12 w-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-3xl font-bold text-red-600">${totalExpenses.toFixed(2)}</p>
            </div>
            <TrendingDown className="h-12 w-12 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Balance</p>
              <p className={`text-3xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                ${balance.toFixed(2)}
              </p>
            </div>
            <DollarSign className="h-12 w-12 text-blue-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <PieChart className="h-5 w-5 mr-2" />
            Expenses by Category
          </h3>
          {expensesByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPie>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: $${entry.value.toFixed(0)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expensesByCategory.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPie>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-12">No expenses to display</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Category Budget Status
          </h3>
          <div className="space-y-4">
            {expensesByCategory.slice(0, 5).map((cat: any) => {
              const percentage = cat.budgetLimit > 0 ? (cat.value / cat.budgetLimit) * 100 : 0
              return (
                <div key={cat.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{cat.name}</span>
                    <span className="text-gray-600">
                      ${cat.value.toFixed(0)} / ${cat.budgetLimit.toFixed(0)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        percentage > 100 ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2" />
          Savings Goals
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {savingsGoals.map((goal: SavingsGoal) => {
            const percentage = (goal.currentAmount / goal.targetAmount) * 100
            return (
              <div key={goal.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{goal.name}</h4>
                  <span className="text-xs text-gray-500">
                    {format(goal.deadline, 'MMM dd, yyyy')}
                  </span>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>${goal.currentAmount.toFixed(0)}</span>
                    <span>${goal.targetAmount.toFixed(0)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{ width: `${Math.min(percentage, 100)}%`, backgroundColor: goal.color }}
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600">{percentage.toFixed(0)}% complete</p>
              </div>
            )
          })}
          {savingsGoals.length === 0 && (
            <p className="text-gray-500 col-span-3 text-center py-4">No savings goals yet</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <div className="space-y-2">
          {transactions.slice(0, 10).map((t: Transaction) => {
            const category = categories.find((c: Category) => c.id === t.category)
            return (
              <div key={t.id} className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{category?.icon}</span>
                  <div>
                    <p className="font-medium">{t.description}</p>
                    <p className="text-sm text-gray-500">{category?.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">{format(t.date, 'MMM dd, yyyy')}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function TransactionsList({ transactions, categories, onDelete }: any) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">All Transactions</h2>
        <div className="space-y-2">
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No transactions yet</p>
          ) : (
            transactions.map((t: Transaction) => {
              const category = categories.find((c: Category) => c.id === t.category)
              return (
                <div key={t.id} className="flex items-center justify-between py-3 border-b hover:bg-gray-50">
                  <div className="flex items-center flex-1">
                    <span className="text-2xl mr-3">{category?.icon}</span>
                    <div>
                      <p className="font-medium">{t.description}</p>
                      <p className="text-sm text-gray-500">{category?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className={`font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">{format(t.date, 'MMM dd, yyyy')}</p>
                    </div>
                    <button
                      onClick={() => onDelete(t.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

function BudgetView({ categories, transactions, period }: any) {
  const expenseCategories = categories.filter((c: Category) => c.type === 'expense')

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Budget Overview</h2>
      <div className="space-y-6">
        {expenseCategories.map((cat: Category) => {
          const spent = transactions
            .filter((t: Transaction) => t.type === 'expense' && t.category === cat.id)
            .reduce((sum: number, t: Transaction) => sum + t.amount, 0)

          const budgetLimit = cat.budgetLimit || 0
          const percentage = budgetLimit > 0 ? (spent / budgetLimit) * 100 : 0

          return (
            <div key={cat.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <span className="text-3xl mr-3">{cat.icon}</span>
                  <div>
                    <h3 className="font-semibold text-lg">{cat.name}</h3>
                    <p className="text-sm text-gray-500">
                      ${spent.toFixed(2)} of ${budgetLimit.toFixed(2)} spent
                    </p>
                  </div>
                </div>
                <span className={`text-2xl font-bold ${
                  percentage > 100 ? 'text-red-500' : percentage > 80 ? 'text-yellow-500' : 'text-green-500'
                }`}>
                  {percentage.toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    percentage > 100 ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
              {percentage > 100 && (
                <p className="text-sm text-red-500 mt-2">⚠️ Over budget by ${(spent - budgetLimit).toFixed(2)}</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function GoalsView({ goals, onAddGoal, onUpdateProgress, onDelete }: any) {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null)
  const [amount, setAmount] = useState('')

  const handleAddProgress = () => {
    if (selectedGoal && amount) {
      onUpdateProgress(selectedGoal, parseFloat(amount))
      setSelectedGoal(null)
      setAmount('')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Savings Goals</h2>
        <button
          onClick={onAddGoal}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Goal
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal: SavingsGoal) => {
          const percentage = (goal.currentAmount / goal.targetAmount) * 100
          const remaining = goal.targetAmount - goal.currentAmount

          return (
            <div key={goal.id} className="border rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-xl">{goal.name}</h3>
                  <p className="text-sm text-gray-500">
                    Target: ${goal.targetAmount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400">
                    Due: {format(goal.deadline, 'MMMM dd, yyyy')}
                  </p>
                </div>
                <button
                  onClick={() => onDelete(goal.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold">${goal.currentAmount.toFixed(2)}</span>
                  <span className="text-gray-600">${remaining.toFixed(2)} remaining</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="h-4 rounded-full transition-all"
                    style={{
                      width: `${Math.min(percentage, 100)}%`,
                      backgroundColor: goal.color
                    }}
                  />
                </div>
                <p className="text-center text-sm font-semibold mt-2">
                  {percentage.toFixed(1)}% Complete
                </p>
              </div>

              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Add amount"
                  value={selectedGoal === goal.id ? amount : ''}
                  onChange={(e) => {
                    setSelectedGoal(goal.id)
                    setAmount(e.target.value)
                  }}
                  className="flex-1 px-3 py-2 border rounded-md"
                />
                <button
                  onClick={handleAddProgress}
                  disabled={selectedGoal !== goal.id || !amount}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300"
                >
                  Add
                </button>
              </div>
            </div>
          )
        })}
      </div>
      {goals.length === 0 && (
        <p className="text-gray-500 text-center py-12">No savings goals yet. Create one to start tracking!</p>
      )}
    </div>
  )
}

function CategoriesView({ categories, onAddCategory, onDelete }: any) {
  const incomeCategories = categories.filter((c: Category) => c.type === 'income')
  const expenseCategories = categories.filter((c: Category) => c.type === 'expense')

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Categories</h2>
        <button
          onClick={onAddCategory}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Category
        </button>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-green-600">Income Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {incomeCategories.map((cat: Category) => (
              <div key={cat.id} className="border rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-3xl mr-3">{cat.icon}</span>
                  <span className="font-medium">{cat.name}</span>
                </div>
                <button
                  onClick={() => onDelete(cat.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-red-600">Expense Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {expenseCategories.map((cat: Category) => (
              <div key={cat.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">{cat.icon}</span>
                    <span className="font-medium">{cat.name}</span>
                  </div>
                  <button
                    onClick={() => onDelete(cat.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {cat.budgetLimit && (
                  <p className="text-sm text-gray-500 ml-12">
                    Budget: ${cat.budgetLimit.toFixed(2)}/month
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function AddTransactionModal({ categories, onAdd, onClose }: any) {
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurringFrequency, setRecurringFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly')

  const filteredCategories = categories.filter((c: Category) => c.type === type)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !category || !description) return

    onAdd({
      type,
      amount: parseFloat(amount),
      category,
      description,
      date: new Date(date),
      isRecurring,
      recurringFrequency: isRecurring ? recurringFrequency : undefined
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Transaction</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setType('income')}
                className={`flex-1 py-2 rounded-md ${
                  type === 'income' ? 'bg-green-600 text-white' : 'bg-gray-200'
                }`}
              >
                Income
              </button>
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`flex-1 py-2 rounded-md ${
                  type === 'expense' ? 'bg-red-600 text-white' : 'bg-gray-200'
                }`}
              >
                Expense
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Amount</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">Select category</option>
              {filteredCategories.map((cat: Category) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="e.g., Grocery shopping"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium">Recurring transaction</span>
            </label>
          </div>

          {isRecurring && (
            <div>
              <label className="block text-sm font-medium mb-2">Frequency</label>
              <select
                value={recurringFrequency}
                onChange={(e) => setRecurringFrequency(e.target.value as any)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          )}

          <div className="flex space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function AddGoalModal({ onAdd, onClose }: any) {
  const [name, setName] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [deadline, setDeadline] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [color, setColor] = useState('#3b82f6')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !targetAmount) return

    onAdd({
      name,
      targetAmount: parseFloat(targetAmount),
      deadline: new Date(deadline),
      color
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Savings Goal</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Goal Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="e.g., Vacation Fund"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Target Amount</label>
            <input
              type="number"
              step="0.01"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Color</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-10 border rounded-md"
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Add Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function AddCategoryModal({ onAdd, onClose }: any) {
  const [name, setName] = useState('')
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [budgetLimit, setBudgetLimit] = useState('')
  const [color, setColor] = useState('#3b82f6')
  const [icon, setIcon] = useState('📦')

  const commonIcons = ['💰', '💼', '📈', '🍔', '🚗', '🛍️', '🎬', '📄', '🏥', '📚', '🏠', '✈️', '💊', '🎮', '⚡']

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return

    onAdd({
      name,
      type,
      budgetLimit: budgetLimit ? parseFloat(budgetLimit) : undefined,
      color,
      icon
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Category</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setType('income')}
                className={`flex-1 py-2 rounded-md ${
                  type === 'income' ? 'bg-green-600 text-white' : 'bg-gray-200'
                }`}
              >
                Income
              </button>
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`flex-1 py-2 rounded-md ${
                  type === 'expense' ? 'bg-red-600 text-white' : 'bg-gray-200'
                }`}
              >
                Expense
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="e.g., Groceries"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Icon</label>
            <div className="grid grid-cols-5 gap-2 mb-2">
              {commonIcons.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIcon(i)}
                  className={`text-2xl p-2 rounded border ${
                    icon === i ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Or enter custom emoji"
            />
          </div>

          {type === 'expense' && (
            <div>
              <label className="block text-sm font-medium mb-2">Monthly Budget Limit (Optional)</label>
              <input
                type="number"
                step="0.01"
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="0.00"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Color</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-10 border rounded-md"
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Add Category
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
