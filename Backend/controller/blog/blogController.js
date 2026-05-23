import Blog from "../../models/blog/blogs.js";
import { errorHandler } from "../../middleware/errorMiddleware.js";
export const createBlog = async (req, res, next) => {
  try {
    // console.log('req.file', req.file);
    // console.log('req.body', req.body);

    const { title, description, imageUrl, comment, likeCount } = req.body;

    const blog = new Blog({
      title,
      description,
      // imageUrl: (req.file && req.file.path) ? req.file.path : undefined,
      comment,
      likeCount,
      user: req.user._id,
    });
    console.log(req.user._id);

    await blog.save();
    res.status(201).json({ message: "blog created succesfully" });
  } catch (error) {
    console.log(error);
    //console.log('inside blog controller')
    res.status(500).json({ message: "something went wrong" });
  }
};

export const getallBlog = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const search = req.query.search || "";

    const skip = (page - 1) * limit;

    const searchQuery = search
      ? {$text:{$search:search}}
      : {};

    const blogs = await Blog.find(searchQuery)
      .populate("user", "firstName lastName")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();
      
    const totalBlogs = await Blog.countDocuments(searchQuery);

    res.status(200).json({
      page,
      limit,
      totalPages: Math.ceil(totalBlogs / limit),
      totalBlogs,
      blogs,
    });
    console.log(blogs);
  } catch (error) {
    next(error);
  }
};
export const getBlogbyId = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid blog ID",
      });
    }

    const blog = await Blog.findById(req.params.id)
      .populate("user", "firstName lastName");

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    res.status(200).json(blog);

  } catch (error) {
    next(error);
  }
};

export const updateBlog = async (req, res, next) => {
  try {
    const blog = req.blog;
    const { title, description, comment, likeCount } = req.body;

    blog.title = title ?? blog.title;
    blog.description = description ?? blog.description;
    // blog.imageUrl = imageUrl;
    blog.comment = comment ?? blog.comment;
    blog.likeCount = likeCount ?? blog.likeCount;

    await blog.save();

    res.status(200).json({ message: "Blog updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteBlog = async (req, res, next) => {
  try {
    const blogId = req.params.id;
    const userId = req.user._id;

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    if (blog.user.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this blog",
      });
    }

    await blog.deleteOne();

    res.status(200).json({
      message: "Blog deleted successfully",
    });

  } catch (error) {
    next(error);
  }
};
