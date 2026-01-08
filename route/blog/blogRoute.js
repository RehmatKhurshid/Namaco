import express from 'express';
import { createBlog, deleteBlog, getallBlog, updateBlog } from '../../controller/blog/blogController.js';

const blogRouter = express.Router();

blogRouter.get('/', getallBlog)
blogRouter.post('/', createBlog);
blogRouter.put('/:id', updateBlog);
blogRouter.delete('/:id', deleteBlog);

export default blogRouter