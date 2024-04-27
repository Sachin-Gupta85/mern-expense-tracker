#!/usr/bin/env python3
"""Budget analytics for the expense tracker.

Turns an exported list of expenses into a category breakdown and compares it
against per-category budgets. Run as:

    python3 budget.py expenses.json budgets.json

expenses.json is a JSON list of {amount, category, date}; budgets.json is a
JSON object {category: limit}.
"""
from __future__ import annotations

import json
import sys
from collections import defaultdict


def breakdown(expenses: list[dict]) -> dict:
    by_cat: dict[str, float] = defaultdict(float)
    for e in expenses:
        by_cat[e["category"]] += e["amount"]
    total = sum(by_cat.values())
    return {"total": total, "by_category": dict(by_cat)}


def check_budgets(expenses: list[dict], budgets: dict[str, float]) -> list[dict]:
    """Per budgeted category, report spend, limit, remaining and over-budget flag,
    sorted by the largest overspend first."""
    by_cat = breakdown(expenses)["by_category"]
    rows = []
    for cat, limit in budgets.items():
        spent = by_cat.get(cat, 0)
        rows.append({
            "category": cat,
            "spent": spent,
            "limit": limit,
            "remaining": limit - spent,
            "over": spent > limit,
        })
    rows.sort(key=lambda r: r["remaining"])
    return rows


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        sys.stderr.write("usage: budget.py <expenses.json> <budgets.json>\n")
        return 2
    expenses = json.load(open(argv[0], encoding="utf-8"))
    budgets = json.load(open(argv[1], encoding="utf-8"))
    print(json.dumps(check_budgets(expenses, budgets), indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
