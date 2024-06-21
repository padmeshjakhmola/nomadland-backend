const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const { sequelize } = require("../db");

router.get("/", async (req, res) => {
  const user = await User.findAll();
  res.status(200).json(user);
});

module.exports = router;
