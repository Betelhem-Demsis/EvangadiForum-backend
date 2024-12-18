const express = require("express");
const router = express.Router();
const {
  register,
  login,
  checkUser,
} = require("./../Controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// register
router.post("/register", register);

// login
router.post("/login", login);

// check user
router.get("/check", authMiddleware, checkUser);

module.exports = router;
