const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const userRouter = require("./routes/user");
const postRouter = require("./routes/posts");
const commentRouter = require("./routes/comments");

const baseRouter = express.Router();

app.use(bodyParser.json());

const corsOptions = {
  origin: process.env.CORS_URL,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

// app.use(cors());

app.use(cors(corsOptions));

baseRouter.use("/users", userRouter);
baseRouter.use("/posts", postRouter);
baseRouter.use("/comments", commentRouter);
app.use("/v1", baseRouter);

module.exports = app;
