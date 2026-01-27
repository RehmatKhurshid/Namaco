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
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const skip = (page - 1) * limit;

    const searchQuery = search
      ? {$text:{$search:search}}
      : {};

    const blogs = await Blog.find(searchQuery)
      .populate("user", "firstName email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalBlogs = await Blog.countDocuments(searchQuery);

    res.status(200).json({
      page,
      limit,
      totalPages: Math.ceil(totalBlogs / limit),
      totalBlogs,
      blogs,
    });
  } catch (error) {
    next(error);
  }
};
export const getBlogbyId = async (req, res) => {
  try {
    const getId = await Blog.findById(req.params.id).populate('user', 'firstName email') // ONLY required field;
    console.log(getId);
    if (!getId) {
      const error = new Error("user not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(getId);
  } catch (error) {
    console.log(error);
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
    console.log("blogId", blogId);
    const userId = req.user._id;
    // console.log('userid', userId);

    const blog = await Blog.findById(blogId);

    console.log("blog", blog);

    if (!blog) {
      const error = new Error("Blog not found");
      error.statusCode = 404;
      throw error;
    }
    // Check if the user making the request is the owner of the blog
    /** if (blog.user._id.toString() !== userId.toString()) {
            return res.status(403).json({ "message": "You are not authorized to delete this blog" });
        }*/

    await Blog.findByIdAndDelete(blogId);

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
