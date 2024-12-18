const express = require("express");
const {
  getAnswers,
  createAnswers,
} = require("../Controllers/answerController");
const router = express.Router();

router.get("/:question_id", getAnswers);
router.post("/", createAnswers);

module.exports = router;
