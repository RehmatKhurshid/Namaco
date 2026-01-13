import express from 'express';
import { createBlog, deleteBlog, getallBlog, getBlogbyId, updateBlog } from '../../controller/blog/blogController.js';
import blogOwner from '../../middleware/blog.middleware.js';
import { isAuthenticated } from '../../middleware/userMiddleware.js';

const blogRouter = express.Router();

blogRouter.get('/', getallBlog);
blogRouter.get('/:id',getBlogbyId);
blogRouter.post('/',isAuthenticated, createBlog);
blogRouter.put('/:id',isAuthenticated,blogOwner, updateBlog);
blogRouter.delete('/:id', isAuthenticated,blogOwner,deleteBlog);

export default blogRouter