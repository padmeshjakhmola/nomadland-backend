const express = require("express");
const router = express.Router();
const Post = require("../models/posts");
const User = require("../models/user");
const multer = require("multer");
const { redisClient, pubClient } = require("../utils/redis");
const { s3 } = require("../utils/aws");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  const cacheValue = await redisClient.get("all_posts");

  if (cacheValue) return res.json(JSON.parse(cacheValue));

  const user = await Post.findAll({
    include: {
      model: User,
      attributes: ["name", "email", "username", "profile_picture"],
    },
  });

  await redisClient.set("all_posts", JSON.stringify(user));
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

        const posts = await Post.findAll({
          include: {
            model: User,
            attributes: ["name", "email", "username", "profile_picture"],
          },
        });

        await redisClient.set("all_posts", JSON.stringify(posts));
        await pubClient.publish("posts_update", JSON.stringify(posts));

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

router.delete("/:id", async (req, res) => {
  const postId = req.params.id;
  const userId = req.headers.authorization.split(" ")[1];
  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ error: "post_not_found" });
    }

    if (post.userId != userId) {
      return res.status(403).json({ error: "not_authorized" });
    }

    try {
      await Post.destroy({
        where: {
          id: postId,
        },
      });

      const posts = await Post.findAll({
        include: {
          model: User,
          attributes: ["name", "email", "username", "profile_picture"],
        },
      });

      //update cache
      await redisClient.set("all_posts", JSON.stringify(posts));

      res.status(200).json({ message: "post_deleted_successfully" });
    } catch (dbError) {
      console.error("Database error:", dbError);
      res.status(500).json({ server_error_rec: dbError.message });
    }
  } catch (error) {
    res.status(500).json({
      error_deleting_post: e.message,
    });
  }
});

module.exports = router;
