const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../db/dbConfig");

async function getAllQuestion(req, res) {
  try {
    const query = `
      SELECT q.questionid, q.title, q.description, q.tag, u.username, q.created_at
      FROM questions q
      JOIN users u ON q.userid = u.userid;
    `;

    const [results] = await dbConnection.query(query);

    if (results.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        message: "No questions found.",
      });
    }

    const questions = results.map((row) => ({
      questionid: row.questionid,
      title: row.title,
      description: row.description,
      username: row.username,
      tag: row.tag,
      created_at: row.created_at,
    }));

    res.status(StatusCodes.OK).json({ questions });
  } catch (err) {
    console.error("Error fetching questions:", err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

async function getQuestion(req, res) {
  try {
    const { questionid } = req.params;

    if (!questionid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Bad Request",
        message: "Question ID is required.",
      });
    }

    const query = `
      SELECT q.questionid, q.title, q.description, q.tag, u.username, q.created_at
      FROM questions q
      JOIN users u ON q.userid = u.userid
      WHERE q.questionid = ?
    `;

    const [results] = await dbConnection.query(query, [questionid]);

    if (results.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        message: `No question found with ID: ${questionid}`,
      });
    }

    const question = results[0];
    res.status(StatusCodes.OK).json({ question });
  } catch (err) {
    console.error("Error fetching question:", err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred while fetching the question.",
    });
  }
}

async function createQuestion(req, res) {
  try {
    const { title, description, tag } = req.body;

    const { userid, username } = req.user;

    if (!title || !description) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Bad Request",
        message: "Title and description are required.",
      });
    }

    const insertQuery = `
      INSERT INTO questions (title, description, tag, created_at, userid)
      VALUES (?, ?, ?, NOW(), ?)
    `;

    const [insertResult] = await dbConnection.query(insertQuery, [
      title,
      description,
      tag || null,
      userid,
    ]);

    const questionId = insertResult.insertId;

    const fetchQuery = `
      SELECT q.questionid, q.title, q.description, q.tag, q.created_at, u.username
      FROM questions q
      JOIN users u ON q.userid = u.userid
      WHERE q.questionid = ?
    `;

    const [fetchedResults] = await dbConnection.query(fetchQuery, [questionId]);

    if (fetchedResults.length === 0) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: "Internal Server Error",
        message: "Failed to retrieve the newly created question.",
      });
    }

    const createdQuestion = fetchedResults[0];

    res.status(StatusCodes.CREATED).json({
      message: "Question created successfully.",
      question: createdQuestion,
    });
  } catch (err) {
    console.error("Error creating question:", err.message);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred while creating the question.",
    });
  }
}

module.exports = { getAllQuestion, getQuestion, createQuestion };
