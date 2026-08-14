import { useEffect, useState } from 'react'
const API = 'http://localhost:4000'

function App() { 
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    category: 'Food',
    description: '',
    date: new Date().toISOString().slice(0, 10),
  })
const [editingId, setEditingId] = useState(null)
const [editForm, setEditForm] = useState({
  type: 'expense',
  amount: '',
  category: '',
  description: '',
  date: ''
})

  const loadTransactions = async () => {
    try {
      const res = await fetch(`${API}/api/transactions`)
      const data = await res.json()
      setTransactions(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const balance = income - expenses

  const addTransaction = async (e) => {
    e.preventDefault()

    if (!form.amount || Number(form.amount) <= 0) return

    try {
      const res = await fetch(`${API}/api/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount),
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to add transaction')
      }

      setForm({
        type: 'expense',
        amount: '',
        category: 'Food',
        description: '',
        date: new Date().toISOString().slice(0, 10),
      })

      await loadTransactions()
    } catch (error) {
      console.error(error)
      alert('Could not add transaction')
    }
  }

  const deleteTransaction = async (id) => {
  if (!confirm('Delete this transaction?')) return

  try {
    const res = await fetch(`${API}/api/transactions/${id}`, {
      method: 'DELETE',
    })

    if (!res.ok) {
      throw new Error('Failed to delete transaction')
    }

    await loadTransactions()
  } catch (error) {
    console.error(error)
    alert('Could not delete transaction')
  }
}

const startEdit = (transaction) => {
  setEditingId(transaction.id)
  setEditForm({
    type: transaction.type,
    amount: transaction.amount,
    category: transaction.category,
    description: transaction.description || '',
    date: transaction.date,
})
}
const saveEdit = async (e) => {
  e.preventDefault()

  try {
    const res = await fetch(`${API}/api/transactions/${editingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...editForm,
        amount: Number(editForm.amount),
      }),
    })

    if (!res.ok) {
      throw new Error('Failed to update transaction')
    }

    setEditingId(null)
    await loadTransactions()
  } catch (error) {
    console.error(error)
    alert('Could not update transaction')
  }
}
return (
    
    <div className="min-h-screen">
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            ExpenseTracker
          </h1>
          <p className="text-slate-500">
            Personal finance dashboard
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-8">

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Balance</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-800">
              ₹{balance.toFixed(2)}
            </h2>
          </div>

          <div className="rounded-2xl bg-green-50 p-6 shadow-sm">
            <p className="text-sm text-green-700">Income</p>
            <h2 className="mt-2 text-3xl font-bold text-green-600">
              ₹{income.toFixed(2)}
            </h2>
          </div>

          <div className="rounded-2xl bg-red-50 p-6 shadow-sm">
            <p className="text-sm text-red-700">Expenses</p>
            <h2 className="mt-2 text-3xl font-bold text-red-600">
              ₹{expenses.toFixed(2)}
            </h2>
          </div>

        </div>

        <div className="grid gap-6 lg:grid-cols-3">

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold text-slate-800">
              Add Transaction
            </h2>

            <form onSubmit={addTransaction} className="space-y-4">

              <select
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 p-3"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>

              <input
                type="number"
                placeholder="Amount"
                value={form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 p-3"
              />

              <input
                type="text"
                placeholder="Category"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 p-3"
              />

              <input
                type="text"
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 p-3"
              />

              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm({ ...form, date: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 p-3"
              />

              <button
                type="submit"
                className="w-full rounded-lg bg-slate-900 p-3 font-semibold text-white hover:bg-slate-700"
              >
                Add Transaction
              </button>

            </form>
          </div>

          <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-800">
                Transactions
              </h2>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                {transactions.length} total
              </span>
            </div>

            {loading ? (
              <p className="text-slate-500">Loading...</p>
            ) : transactions.length === 0 ? (
              <p className="text-slate-500">
                No transactions yet.
              </p>
            ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="rounded-xl border border-slate-100 p-4"
            >
              {editingId === transaction.id ? (
                <form onSubmit={saveEdit} className="space-y-3">
                  <select
                    value={editForm.type}
                    onChange={(e) =>
                      setEditForm({ ...editForm, type: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 p-3"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>

                  <input
                    type="number"
                    placeholder="Amount"
                    value={editForm.amount}
                    onChange={(e) =>
                      setEditForm({ ...editForm, amount: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 p-3"
                  />

                  <input
                    type="text"
                    placeholder="Category"
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm({ ...editForm, category: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 p-3"
                  />

                  <input
                    type="text"
                    placeholder="Description"
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        description: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 p-3"
                  />

                  <input
                    type="date"
                    value={editForm.date}
                    onChange={(e) =>
                      setEditForm({ ...editForm, date: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 p-3"
                  />

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Save
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">
                      {transaction.description || transaction.category}
                    </p>

                    <p className="text-sm text-slate-500">
                      {transaction.category} · {transaction.date}
                    </p>
                  </div>

                  <p
                    className={`font-bold ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}₹
                    {Number(transaction.amount).toFixed(2)}
                  </p>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(transaction)}
                      className="text-blue-600 text-sm"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteTransaction(transaction.id)}
                      className="text-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default App
