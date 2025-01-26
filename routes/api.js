const express = require("express");
const router = express.Router();
const User = require("../Database/models/user");
const { validatePost } = require("../functions");

router.post("/users", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res.status(400).json({
        message: "Username or email already exists. Please choose another.",
      });
    }
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({
      message: "User created successfully",
      user: { id: user._id, username: user.username },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/users/:userId/posts", validatePost, async (req, res) => {
  try {
    const { userId } = req.params;
    const { title, content } = req.body;
    let user = await User.findOne({ _id: userId, "posts.title": title });
    if (user) {
      return res
        .status(400)
        .json({ error: "A post with the same title already exists." });
    }
    user = await User.findByIdAndUpdate(
      userId,
      { $push: { posts: { title, content } } },
      { new: true }
    ).select("username posts");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(201).json({ message: "Post added successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/users/:userId/posts/:postId/comments", async (req, res) => {
  try {
    const { userId, postId } = req.params;
    const { user, content } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, "posts._id": postId },
      { $push: { "posts.$.comments": { user, content } } },
      { new: true }
    ).select("username posts");
    if (!updatedUser)
      return res.status(404).json({ message: "User or Post not found" });
    res
      .status(201)
      .json({ message: "Comment added successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/users/:userId/posts", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("username posts");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ posts: user.posts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
