import express from 'express';
import { createBlog, deleteBlog, getallBlog, getBlogbyId, updateBlog } from '../../controller/blog/blogController.js';
import blogOwner from '../../middleware/blog.middleware.js';

const blogRouter = express.Router();

blogRouter.get('/', getallBlog);
blogRouter.get('/:id', getBlogbyId);
blogRouter.post('/', createBlog);
blogRouter.put('/:id',blogOwner, updateBlog);
blogRouter.delete('/:id', blogOwner,deleteBlog);

export default blogRouter