const express = require("express");

const {
  createDebt,
  getDebts,
  updateDebt,
  deleteDebt,
} = require("../controllers/debtController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getDebts);

router.post("/", authMiddleware, createDebt);

router.patch("/:id", authMiddleware, updateDebt);

router.delete("/:id", authMiddleware, deleteDebt);

module.exports = router;