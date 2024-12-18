const express = require("express");
const {
  getAllQuestion,
  getQuestion,
  createQuestion,
} = require("../Controllers/questionController");
const router = express.Router();

router.get("/", getAllQuestion);
router.get("/:questionid", getQuestion);
router.post("/", createQuestion);

module.exports = router;
