const express = require("express");
const router = express.Router();
const Post = require("../models/posts");
const User = require("../models/user");
const Comment = require("../models/comment");

router.get("/", async (req, res) => {
  const comments = await Comment.findAll();
  res.status(200).json(comments);
});

module.exports = router;

