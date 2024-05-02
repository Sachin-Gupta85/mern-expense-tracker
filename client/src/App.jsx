import React, { useEffect, useState } from "react";
import { listExpenses, getSummary, createExpense, deleteExpense } from "./api.js";

const thisMonth = () => new Date().toISOString().slice(0, 7);

export default function App() {
  const [month, setMonth] = useState(thisMonth());
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({ total: 0, byCategory: {} });
  const [form, setForm] = useState({ amount: "", category: "", date: "" });

  async function refresh(m = month) {
    setItems(await listExpenses(m));
    setSummary(await getSummary(m));
  }
  useEffect(() => { refresh(); }, []);

  async function onAdd(e) {
    e.preventDefault();
    if (!form.amount || !form.category || !form.date) return;
    await createExpense({ amount: Number(form.amount), category: form.category, date: form.date });
    setForm({ amount: "", category: "", date: "" });
    refresh();
  }

  return (
    <main style={{ maxWidth: 640, margin: "2rem auto", fontFamily: "system-ui" }}>
      <h1>💸 Expense Tracker</h1>
      <label>Month <input type="month" value={month} onChange={(e) => { setMonth(e.target.value); refresh(e.target.value); }} /></label>
      <p><strong>Total: {summary.total}</strong> — {Object.entries(summary.byCategory).map(([c, v]) => `${c}: ${v}`).join(", ")}</p>
      <form onSubmit={onAdd} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input aria-label="amount" type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
        <input aria-label="category" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input aria-label="date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        <button type="submit">Add</button>
      </form>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((e) => (
          <li key={e.id} style={{ borderBottom: "1px solid #eee", padding: 8 }}>
            {e.date} · {e.category} · <strong>{e.amount}</strong>
            <button onClick={async () => { await deleteExpense(e.id); refresh(); }} style={{ float: "right" }}>✕</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
