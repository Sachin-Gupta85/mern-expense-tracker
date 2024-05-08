import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "./App.jsx";

describe("Expense Tracker App", () => {
  beforeEach(() => vi.restoreAllMocks());
  it("shows the monthly total from the summary", async () => {
    globalThis.fetch = vi.fn((url) =>
      Promise.resolve({
        ok: true, status: 200,
        json: async () =>
          String(url).includes("summary")
            ? { total: 45, byCategory: { food: 25, rent: 20 } }
            : [{ id: "1", amount: 25, category: "food", date: "2026-03-01" }],
      })
    );
    render(<App />);
    await waitFor(() => expect(screen.getByText(/Total: 45/)).toBeInTheDocument());
  });
});
