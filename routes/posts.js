const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Post = require("../models/posts");
const User = require("../models/user");

router.get("/", async (req, res) => {
  const user = await Post.findAll({
    include: {
      model: User,
      attributes: ["name", "email", "username", "profile_picture"],
    },
  });
  res.status(200).json(user);
});

router.post("/", async (req, res) => {
  const { title, description, link, userId } = req.body;
  try {
    const user = await Post.create({
      title,
      description,
      link,
      userId,
    });
    res.status(201).json({ "post_created:": user });
  } catch (e) {
    res.status(500).json({ server_error: e });
  }
});

module.exports = router;
