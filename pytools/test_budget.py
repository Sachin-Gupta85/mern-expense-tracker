from budget import breakdown, check_budgets


EXP = [
    {"amount": 10, "category": "food", "date": "2026-01-01"},
    {"amount": 15, "category": "food", "date": "2026-01-02"},
    {"amount": 20, "category": "rent", "date": "2026-01-03"},
]


def test_breakdown():
    out = breakdown(EXP)
    assert out["total"] == 45
    assert out["by_category"] == {"food": 25, "rent": 20}


def test_check_budgets_flags_overspend():
    rows = check_budgets(EXP, {"food": 20, "rent": 30})
    by = {r["category"]: r for r in rows}
    assert by["food"]["over"] is True and by["food"]["remaining"] == -5
    assert by["rent"]["over"] is False and by["rent"]["remaining"] == 10
    # sorted by remaining ascending -> most overspent first
    assert rows[0]["category"] == "food"


def test_missing_category_treated_as_zero_spend():
    rows = check_budgets([], {"food": 50})
    assert rows[0] == {"category": "food", "spent": 0, "limit": 50, "remaining": 50, "over": False}
