const express = require("express");
const router = express.Router();
const Post = require("../models/posts");
const User = require("../models/user");
const Comment = require("../models/comment");

router.get("/", async (req, res) => {
  const comments = await Comment.findAll();
  res.status(200).json(comments);
});

router.post("/comments", async (req, res) => {
  const { text, userId, postId } = req.body;

  try {
    const comment = await Comment.create({ text, userId, postId });
    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
