const express = require("express");
const Expense = require("../models/Expense");

const router = express.Router();

router.get("/", async (req, res) => {
  const { category, month } = req.query;
  const q = {};
  if (category) q.category = category;
  if (month) q.date = { $regex: `^${month}` }; // month = YYYY-MM
  const items = await Expense.find(q).sort({ date: -1 });
  res.json(items);
});

router.get("/summary", async (req, res) => {
  const { month } = req.query;
  const q = month ? { date: { $regex: `^${month}` } } : {};
  const items = await Expense.find(q);
  const byCategory = {};
  let total = 0;
  for (const e of items) {
    total += e.amount;
    byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
  }
  res.json({ total, byCategory, count: items.length });
});

router.post("/", async (req, res) => {
  const { amount, category, date, note } = req.body;
  if (amount == null || amount < 0) return res.status(400).json({ error: "amount >= 0 required" });
  if (!category || !category.trim()) return res.status(400).json({ error: "category required" });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || "")) return res.status(400).json({ error: "date YYYY-MM-DD required" });
  const e = await Expense.create({ amount, category: category.trim(), date, note: note || "" });
  res.status(201).json(e);
});

router.delete("/:id", async (req, res) => {
  const e = await Expense.findByIdAndDelete(req.params.id);
  if (!e) return res.status(404).json({ error: "not found" });
  res.status(204).end();
});

module.exports = router;
