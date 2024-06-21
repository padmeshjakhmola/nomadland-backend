const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const userRouter = require("./routes/user");
const postRouter = require("./routes/posts");

const baseRouter = express.Router();

app.use(bodyParser.json());
app.use(cors());

baseRouter.use("/users", userRouter);
baseRouter.use("/posts", postRouter);
app.use("/v1", baseRouter);

module.exports = app;
