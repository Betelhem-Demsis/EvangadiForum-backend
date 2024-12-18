const dbConnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");

async function getAnswers(req, res) {
  try {
    const { question_id } = req.params;

    if (!question_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Bad Request",
        message: "Question ID is required.",
      });
    }

    const query = `
      SELECT a.answerid AS answer_id, a.answer AS content, u.username AS user_name, a.created_at
      FROM answers a
      JOIN users u ON a.userid = u.userid
      WHERE a.questionid = ?
    `;

    const [results] = await dbConnection.query(query, [question_id]);

    if (results.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        message: "The requested question could not be found.",
      });
    }

    const answers = results.map((row) => ({
      answer_id: row.answer_id,
      content: row.content,
      user_name: row.user_name,
      created_at: row.created_at,
    }));

    res.status(StatusCodes.OK).json({ answers });
  } catch (err) {
    console.error("Error fetching answers:", err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

async function createAnswers(req, res) {
  try {
    const { answer, questionid } = req.body;

    const { userid, username } = req.user;

    if (!answer || !questionid || !userid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Bad Request",
        message: "Please provide answer, question ID, and user ID.",
      });
    }

    const query = `
      INSERT INTO answers (answer, questionid, userid)
      VALUES (?, ?, ?)
    `;

    const [result] = await dbConnection.query(query, [
      answer,
      questionid,
      userid,
    ]);

    res.status(StatusCodes.CREATED).json({
      message: "Answer posted successfully",
    });
  } catch (err) {
    console.error("Error creating answer:", err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred while creating the answer.",
    });
  }
}

module.exports = { getAnswers, createAnswers };
