// src/components/blog/BlogCard.tsx

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import type { Blog } from "../../types/blog";

interface BlogCardProps {
  blog: Blog;
  isLoggedIn?: boolean;
  onLike?: (blogId: string) => void;
}

const BlogCard = ({ blog, isLoggedIn = false, onLike }: BlogCardProps) => {
  const authorName =
    blog.user?.firstName && blog.user?.lastName
      ? `${blog.user.firstName} ${blog.user.lastName}`
      : blog.user?.email ?? "Anonymous";

  const formattedDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  const preview =
    blog.description.length > 120
      ? blog.description.slice(0, 120).trimEnd() + "..."
      : blog.description;

  return (
    <Card className="group flex h-full flex-col overflow-hidden border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 transition-all duration-300 group-hover:from-indigo-500 group-hover:to-violet-500" />

      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-2 text-base font-bold leading-snug text-slate-900 transition-colors duration-200 group-hover:text-violet-700 sm:text-lg">
          {blog.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        <p className="text-sm leading-relaxed text-slate-600">{preview}</p>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-slate-100 px-6 pb-4 pt-3">
        {/* Author */}
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700">
            {authorName.charAt(0).toUpperCase()}
          </div>
          <span className="max-w-[100px] truncate text-xs font-medium text-slate-700">
            {authorName}
          </span>
        </div>

        {/* Right side: Like + Date */}
        <div className="flex items-center gap-3">

          {/* Like button — only for logged in users */}
          {isLoggedIn ? (
            <button
              type="button"
              onClick={() => onLike?.(blog._id)}
              className="group/like flex items-center gap-1 rounded-full px-2 py-1 text-xs transition-colors hover:bg-rose-50"
              title="Like this post"
            >
              {(blog.likeCount ?? 0) > 0 ? (
                <svg className="h-3.5 w-3.5 text-rose-400 transition-transform group-hover/like:scale-125" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              ) : (
                <svg className="h-3.5 w-3.5 text-slate-300 transition-transform group-hover/like:scale-125 group-hover/like:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              )}
              <span className={`${(blog.likeCount ?? 0) > 0 ? "text-rose-500" : "text-slate-400"}`}>
                {blog.likeCount ?? 0}
              </span>
            </button>
          ) : (
            // Not logged in — show static like count only
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <svg className="h-3.5 w-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span>{blog.likeCount ?? 0}</span>
            </div>
          )}

          {/* Date */}
          {formattedDate && (
            <span className="text-xs text-slate-400">{formattedDate}</span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;