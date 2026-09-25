const express = require("express");
const cors = require("cors");
require("dotenv").config();

const prisma = require("./lib/prisma");
const userRoutes = require("./routes/userRoutes");
const debtRoutes = require("./routes/debtRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/users", userRoutes);
app.use("/debts", debtRoutes);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    message: "Backend funcionando!",
  });
});

app.get("/teste-db", async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    res.json(users);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erro ao acessar o banco de dados",
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});