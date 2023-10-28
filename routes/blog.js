const express = require("express");

const BlogModel = require("../model/blogModel");

const authMiddleware = require("../middleware/auth");

const {
  paginate,
  buildSort,
  parseTags,
  estimateReadingTime,
} = require("../utils/blogUtil");

const router = express.Router();

/**
 * Private APIs Start
 */

// List of my posts
router.get("/mine", authMiddleware, async (req, res) => {
  let { limit, page, state, orderBy, tag, title } = req.query;

  const searchOr = [];
  if (tag) searchOr.push({ tags: tag });
  if (title) searchOr.push({ title: { $regex: title, $options: "i" } });

  const filter = { author: req.user._id };
  if (state) filter.state = state;
  if (searchOr.length > 0) filter.$or = searchOr;

  const pagination = paginate(page, limit);

  const blogs = await BlogModel.find(filter)
    .populate("author", "firstName lastName")
    .sort(buildSort(orderBy))
    .limit(pagination.limit)
    .skip(pagination.skip);

  res.render("blogs/all", {
    blogs: blogs,
    user: req.user,
    search: {
      tag: tag,
      title: title,
      state: state,
      orderBy: orderBy,
      prevPage: pagination.page - 1 || 1,
      nextPage: pagination.page + 1,
    },
  });
});

router.get("/create", authMiddleware, (req, res) => {
  res.render("blogs/new");
});

router.post("/create", authMiddleware, async (req, res) => {
  const blog = new BlogModel({
    state: "draft",
    body: req.body.body,
    title: req.body.title,
    tags: parseTags(req.body.tags),
    author: req.user._id,
    description: req.body.description,
    readingTime: estimateReadingTime(req.body.body),
  });

  await blog.save();
  res.redirect("/blogs");
});

// Edit Blog
router.get("/:id/edit", authMiddleware, async (req, res) => {
  const { id } = req.params;

  const blog = await BlogModel.findOne({ _id: id, author: req.user._id });
  if (!blog) return res.redirect("/blogs");

  res.render("blogs/edit", { blog: blog });
});

// Update
router.post("/:id/edit", authMiddleware, async (req, res) => {
  const { id } = req.params;

  const filter = {
    _id: id,
    author: req.user._id,
  };

  const update = {
    state: req.body.state,
    body: req.body.body,
    tags: parseTags(req.body.tags),
    title: req.body.title,
    description: req.body.description,
    readingTime: estimateReadingTime(req.body.body),
  };

  const blog = await BlogModel.findOneAndUpdate(filter, { $set: update });
  if (!blog) return res.redirect("/blogs");

  res.redirect(`/blogs/${id}/view`);
});

// Delete
router.post("/:id/delete", authMiddleware, async (req, res) => {
  const { id } = req.params;

  await BlogModel.findByIdAndDelete({ _id: id, author: req.user._id });

  res.redirect("/blogs/mine");
});

/**
 * Private APIs End
 *
 * -----
 *
 * Public APIs Start
 */

// List all Published blogs
router.get("/", async (req, res) => {
  let { limit, page, title, author, tag, orderBy } = req.query;

  const searchOr = [];
  if (tag) searchOr.push({ tags: tag });
  if (title) searchOr.push({ title: { $regex: title, $options: "i" } });
  if (author) searchOr.push({ author: author });

  const filter = { state: "published" };
  if (searchOr.length > 0) filter.$or = searchOr;

  const pagination = paginate(page, limit);

  const blogs = await BlogModel.find(filter)
    .populate("author", "firstName lastName")
    .sort(buildSort(orderBy))
    .limit(pagination.limit)
    .skip(pagination.skip);

  res.render("blogs/all", {
    blogs: blogs,
    search: {
      tag: tag,
      title: title,
      author: author,
      orderBy: orderBy,

      prevPage: pagination.page - 1 || 1,
      nextPage: pagination.page + 1,
    },
  });
});

// Get
router.get("/:id/view", async (req, res) => {
  const { id } = req.params;

  const filter = { _id: id, state: "published" };
  const update = { $inc: { readCount: 1 } };

  const blog = await BlogModel.findOneAndUpdate(filter, update, {
    new: true,
  }).populate("author", "firstName lastName");

  if (!blog) return res.redirect("/blogs");

  res.render("blogs/oneBlog", { blog: blog });
});

/**
 * Public APIs End
 */

module.exports = router;
