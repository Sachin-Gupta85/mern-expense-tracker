const request = require("supertest");
const app = require("../src/app");

const mk = (o = {}) => ({ amount: 10, category: "food", date: "2026-01-05", ...o });

describe("expenses API", () => {
  test("create validates amount, category, date", async () => {
    expect((await request(app).post("/api/expenses").send(mk({ amount: -1 }))).status).toBe(400);
    expect((await request(app).post("/api/expenses").send(mk({ category: "" }))).status).toBe(400);
    expect((await request(app).post("/api/expenses").send(mk({ date: "2026/01/05" }))).status).toBe(400);
    expect((await request(app).post("/api/expenses").send(mk())).status).toBe(201);
  });

  test("month and category filters", async () => {
    await request(app).post("/api/expenses").send(mk({ amount: 5, category: "food", date: "2026-01-10" }));
    await request(app).post("/api/expenses").send(mk({ amount: 9, category: "gas", date: "2026-02-01" }));
    expect((await request(app).get("/api/expenses?month=2026-01")).body.length).toBe(1);
    expect((await request(app).get("/api/expenses?category=gas")).body.length).toBe(1);
  });

  test("summary totals by category", async () => {
    await request(app).post("/api/expenses").send(mk({ amount: 10, category: "food", date: "2026-03-01" }));
    await request(app).post("/api/expenses").send(mk({ amount: 15, category: "food", date: "2026-03-02" }));
    await request(app).post("/api/expenses").send(mk({ amount: 20, category: "rent", date: "2026-03-03" }));
    const res = await request(app).get("/api/expenses/summary?month=2026-03");
    expect(res.body.total).toBe(45);
    expect(res.body.byCategory).toEqual({ food: 25, rent: 20 });
    expect(res.body.count).toBe(3);
  });

  test("delete and 404", async () => {
    const { body } = await request(app).post("/api/expenses").send(mk());
    expect((await request(app).delete(`/api/expenses/${body.id}`)).status).toBe(204);
    expect((await request(app).delete(`/api/expenses/${body.id}`)).status).toBe(404);
  });
});
