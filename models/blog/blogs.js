import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    likeCount: {
        type: Number,
    },
    // imageUrl: {
    //     type: String
    // },
    comment: {
        type: String,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

}, { timestamps: true });

// Text search index
blogSchema.index({
  title: 'text',
  description: 'text'
});

// Pagination / sorting
blogSchema.index({ createdAt: -1 });

const Blog = mongoose.model('Blog', blogSchema);

export default Blog