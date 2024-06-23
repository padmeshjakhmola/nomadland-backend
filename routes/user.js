const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const { sequelize } = require("../db");

router.get("/", async (req, res) => {
  const user = await User.findAll();
  res.status(200).json(user);
});

router.get("/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json("user_not_found");
    }

    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({ internal_server_error: e });
  }
});

router.post("/register", async (req, res) => {
  const { name, email, profile_picture, clerk_userId, username } = req.body;

  try {
    const existingEmail = await User.findOne({
      where: {
        email,
      },
    });
    if (existingEmail) {
      User.update(
        {
          lastLogin: new Date(),
        },
        {
          where: { email },
        }
      );
      // res.status(409).json({ error: "already_exist" });
      return res.status(201).json({
        already_exist: true,
        id: existingEmail.id,
      });
    } else {
      const user = await User.create({
        name,
        email,
        profile_picture,
        clerk_userId,
        username,
      });
      res.status(201).json({ "User created successfully:": user });
    }
  } catch (e) {
    res.status(500).json({ internal_server_error: e });
  }
});

module.exports = router;
