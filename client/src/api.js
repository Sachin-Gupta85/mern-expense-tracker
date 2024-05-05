const BASE = import.meta.env?.VITE_API_URL || "";
async function req(path, opts) {
  const res = await fetch(`${BASE}/api${path}`, {
    headers: { "Content-Type": "application/json" }, ...opts });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.status === 204 ? null : res.json();
}
export const listExpenses = (month = "") => req(`/expenses${month ? `?month=${month}` : ""}`);
export const getSummary = (month = "") => req(`/expenses/summary${month ? `?month=${month}` : ""}`);
export const createExpense = (e) => req("/expenses", { method: "POST", body: JSON.stringify(e) });
export const deleteExpense = (id) => req(`/expenses/${id}`, { method: "DELETE" });
