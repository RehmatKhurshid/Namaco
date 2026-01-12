import Blog from "../models/blog/blogs.js";

const blogOwner = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized" });
    }

    req.blog = blog;
    next();
  } catch (error) {
    next(error);
  }
};

export default blogOwner;
