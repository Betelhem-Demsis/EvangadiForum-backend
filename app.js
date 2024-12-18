require("dotenv").config();
const express = require("express");
const dbConnection = require("./db/dbConfig");
const userRoutes = require("./Routes/userRoute");
const questionRoutes = require("./Routes/questionRoute");
const authMiddleware = require("./middleware/authMiddleware");
const answerRoutes = require("./Routes/answerRoute");

const app = express();
port = 5000;
app.use(express.json());

// user routes
app.use("/api/users", userRoutes);

// question routes
app.use("/api/questions", authMiddleware, questionRoutes);

// answer routes
app.use("/api/answers", authMiddleware, answerRoutes);

async function start() {
  try {
    const result = await dbConnection.execute("select 'test' ");
    app.listen(port);
    console.log("db connection successful");
    console.log(`listening on ${port}`);
  } catch (error) {
    console.log(error.message);
  }
}
start();
