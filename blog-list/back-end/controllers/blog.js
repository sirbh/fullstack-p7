const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { userExtractor } = require("../utils/middleware");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user");
  response.json(blogs);
});

blogRouter.post("/", userExtractor, async (request, response) => {
  const user = request.user;
  if (!request.body.likes) {
    request.body["likes"] = 0;
  }
  // const user = await User.findOne({username:"sirbh"})
  const newblog = new Blog({
    ...request["body"],
    user: user.id,
  });

  const blog = await newblog.save();
  user.blogs = user.blogs.concat(blog.id);
  await user.save();
  response.status(201).json(blog);
});

blogRouter.delete("/:id", userExtractor, async (request, response) => {
  const user = request.user;

  const id = request.params.id;
  // await Blog.findByIdAndDelete(id);
  const blog = await Blog.findById(id);
  if (blog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndDelete(request.params.id);
    return response.status(204).end();
  }

  return response.status(401).json({ error: "invalid user" });
});

blogRouter.put("/:id", userExtractor, async (request, response) => {
  const id = request.params.id;
  const blog = request.body;

  const updatedblog = await Blog.findByIdAndUpdate(id, blog, {
    new: true,
    runValidators: true,
  });
  if (updatedblog) {
    return response.json(updatedblog);
  } else {
    return response.status(400).json({ error: "blog does not exist" });
  }
});

module.exports = blogRouter;
