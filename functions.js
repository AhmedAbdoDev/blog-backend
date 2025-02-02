module.exports = {
  validatePost: async (req, res, next) => {
    const { title, content } = req.body;
    if (!title || !content)
      return res
        .status(400)
        .json({ error: "Title and content are required.", success: false });
    if (content.length < 20)
      return res.status(400).json({
        error: "Content must be at least 20 characters long.",
        success: false,
      });
    next();
  },
  validateComment: async (req, res, next) => {
    const { content } = req.body;
    if (!content?.length)
      return res
        .status(400)
        .json({ error: "Content is required.", success: false });
    if (content.length < 2)
      return res.status(400).json({
        error: "Content must be at least 2 characters long.",
        success: false,
      });
    next();
  },
};
