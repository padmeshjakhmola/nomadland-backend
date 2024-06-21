const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const userRouter = require("./routes/user");

const baseRouter = express.Router();

app.use(bodyParser.json());
app.use(cors());

baseRouter.use("/users", userRouter);
app.use("/v1", baseRouter);

module.exports = app;
