const express = require("express");
const router = express.Router();
const Post = require("../models/posts");
const User = require("../models/user");
const AWS = require("aws-sdk");
const multer = require("multer");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  const user = await Post.findAll({
    include: {
      model: User,
      attributes: ["name", "email", "username", "profile_picture"],
    },
  });
  res.status(200).json(user);
});

router.post("/", upload.single("image"), async (req, res) => {
  const { title, description, userId } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "file_missing" });
  }

  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${Date.now()}_/${userId}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: "public-read",
    };

    s3.upload(params, async (err, data) => {
      if (err) {
        console.error("S3 upload error:", err);
        return res.status(500).json({ error: "error_uploading_file" });
      }

      try {
        const post = await Post.create({
          title,
          description,
          link: data.Location,
          userId,
        });
        res.status(201).json({ post_created: post });
      } catch (dbError) {
        console.error("Database error:", dbError);
        res.status(500).json({ server_error_rec: dbError.message });
      }
    });
  } catch (e) {
    console.error("Server error:", e);
    res.status(500).json({ server_error_send: e.message });
  }
});
module.exports = router;
