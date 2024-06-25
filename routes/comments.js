const express = require("express");
const router = express.Router();
const Post = require("../models/posts");
const User = require("../models/user");
const Comment = require("../models/comment");

router.get("/", async (req, res) => {
  const comments = await Comment.findAll();
  res.status(200).json(comments);
});

router.get("/comments/:postId", async (req, res) => {
  const { postId } = req.params;
  try {
    const comments = await Comment.findAll({
      where: { postId },
      include: [
        {
          model: User,
          attributes: ["name", "email", "username", "profile_picture"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
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
