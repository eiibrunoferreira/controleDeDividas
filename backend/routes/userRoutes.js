const express = require("express");

const {
  registerUser,
  loginUser,
  getMe,
  updateMe,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/me", authMiddleware, getMe);

router.patch("/me", authMiddleware, updateMe);

module.exports = router;