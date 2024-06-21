const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Post = require("../models/posts");

router.get("/", async (req, res) => {
  const user = await Post.findAll();
  res.status(200).json(user);
});

router.post("/", async (req, res) => {
  const { title, description, link } = req.body;
  try {
    const user = await Post.create({
      title,
      description,
      link,
    });
    res.status(201).json({ "post_created:": user });
  } catch (e) {
    res.status(500).json({ server_error: e });
  }
});

module.exports = router;
