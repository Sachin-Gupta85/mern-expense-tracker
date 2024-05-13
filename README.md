# 💸 mern-expense-tracker — expenses & budgets (MERN + Python)

> Log expenses, filter by month/category, see category summaries. **React** + **Express** + **MongoDB**, with a **Python** budget tool and a cross-stack test harness.

![React](https://img.shields.io/badge/React-18-61dafb)
![Express](https://img.shields.io/badge/Express-4-000000)
![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248)
![Tests](https://img.shields.io/badge/tests-jest%20%2B%20pytest%20%2B%20vitest-brightgreen)

## ✨ Features
- CRUD expenses with validation (amount ≥ 0, category, `YYYY-MM-DD` date).
- Month (`?month=YYYY-MM`) and category filters; `/summary` totals by category.
- **Python companion** (`pytools/budget.py`): category breakdown + per-category
  budget checks (overspend flags), unit-tested with pytest.
- Express API tested with Jest + mongodb-memory-server.

## 🚀 Run
```bash
docker compose up --build
cd client && npm install && npm run dev
```

## ✅ Test
```bash
./run_harness.sh      # jest (4) + pytest (3) + vitest (1)
```

## 🔌 API
`GET /api/expenses?month=&category=` · `GET /api/expenses/summary?month=` ·
`POST /api/expenses` · `DELETE /api/expenses/{id}`

## 📝 License
MIT — see [LICENSE](LICENSE).
