const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const userRouter = require("./routes/user");
const postRouter = require("./routes/posts");
const commentRouter = require("./routes/comments");
const { socketIo } = require("./utils/socket");
const { AppSync } = require("aws-sdk");

const baseRouter = express.Router();

const server = socketIo(app);

app.use(bodyParser.json());
app.use(cors());

baseRouter.use("/users", userRouter);
baseRouter.use("/posts", postRouter);
baseRouter.use("/comments", commentRouter);
app.use("/v1", baseRouter);

// created for health check for the server
app.use("/health", (req, res) => {
  res.status(200).json({ message: "Server is working 💪🏻" });
});

module.exports = server;
