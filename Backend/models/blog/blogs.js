import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    likeCount: {
      type: Number,
      default: 0,
    },

    comments: [
      {
        text: {
          type: String,
          trim: true,
        },

        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

blogSchema.index({
  title: "text",
  description: "text",
});

blogSchema.index({ createdAt: -1 });

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;