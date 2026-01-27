import express from 'express';
import { createBlog,getallBlog,getBlogbyId,updateBlog,deleteBlog } from '../../controller/blog/blogController.js';
import blogOwner from '../../middleware/blog.middleware.js';
import { isAuthenticated } from '../../middleware/userMiddleware.js';
import { blogValidator } from '../../validators/blog.validator.js';
import validate from '../../middleware/validate.middleware.js'

const blogRouter = express.Router();

blogRouter.get('/', getallBlog);
blogRouter.get('/:id',getBlogbyId);
blogRouter.post('/',isAuthenticated,blogValidator,validate, createBlog);
blogRouter.put('/:id',isAuthenticated,blogOwner,blogValidator,validate, updateBlog);
blogRouter.delete('/:id', isAuthenticated,blogOwner,deleteBlog);

export default blogRouter