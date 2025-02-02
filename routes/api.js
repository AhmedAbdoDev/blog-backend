const express = require("express");
const router = express.Router();
const User = require("../Database/models/user");
const { validatePost, validateComment } = require("../functions");
const authMiddleware = require("../middlewares/authMiddleware");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/users", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser)
      return res.status(400).json({
        message: "Username or email already exists. Please choose another.",
        success: false,
      });
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({
      message: "User created successfully",
      user: { id: user._id, username: user.username },
      success: true,
    });
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user?.password))
      return res
        .status(400)
        .json({ message: "Invalid email or password", success: false });
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.json({ message: "Login successful", token, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post(
  "/users/:userId/posts",
  [authMiddleware, validatePost],
  async (req, res) => {
    try {
      const { userId } = req.params;
      if (req.user.id !== userId)
        return res
          .status(403)
          .json({ message: "Unauthorized", success: false });
      const { title, content } = req.body;
      let user = await User.findOne({ _id: userId, "posts.title": title });
      if (user)
        return res.status(400).json({
          error: "A post with the same title already exists.",
          success: false,
        });
      user = await User.findByIdAndUpdate(
        userId,
        { $push: { posts: { title, content } } },
        { new: true }
      ).select("username posts");
      if (!user)
        return res
          .status(404)
          .json({ message: "User not found", success: false });
      res
        .status(201)
        .json({ message: "Post added successfully", user, success: true });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  }
);
router.post(
  "/users/:userId/posts/:postId/comments",
  [authMiddleware, validateComment],
  async (req, res) => {
    try {
      const { userId, postId } = req.params;
      const { content } = req.body;
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId, "posts._id": postId },
        { $push: { "posts.$.comments": { user: req.user.username, content } } },
        { new: true }
      ).select("username posts");
      if (!updatedUser)
        return res
          .status(404)
          .json({ message: "User or Post not found", success: false });
      res.status(201).json({
        message: "Comment added successfully",
        updatedUser,
        success: true,
      });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  }
);
router.get("/users/:userId/posts", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("posts");
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    res.status(200).json({ posts: user.posts, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});
module.exports = router;
