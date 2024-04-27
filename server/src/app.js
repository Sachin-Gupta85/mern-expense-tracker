const express = require("express");
const cors = require("cors");
const expenses = require("./routes/expenses");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/expenses", expenses);

module.exports = app;
