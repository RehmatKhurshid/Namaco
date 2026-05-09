// src/pages/dashboard.tsx

import { useEffect, useMemo, useState } from "react";
import CreatePost from "../components/blog/CreatePost";
import DeleteBlog from "../components/blog/DeleteBlog";
import UpdateBlog from "../components/blog/UpdateBlog";
import API from "../services/api";
import type { Blog } from "../types/blog";

type LocalUser = {
  firstName?: string;
  lastName?: string;
  email?: string;
};

const Dashboard = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingBlogId, setDeletingBlogId] = useState<string | null>(null);

  const storedUser = localStorage.getItem("user");
  const user: LocalUser | null = storedUser ? JSON.parse(storedUser) : null;
  const token = localStorage.getItem("token");

  const fetchBlogs = async () => {
    setError("");
    setIsLoading(true);
    try {
      const res = await API.get<{ blogs: Blog[] }>("/blog");
      setBlogs(res.data.blogs || []);
    } catch {
      setError("Failed to load blogs.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchBlogs();
  }, []);

  const myBlogs = useMemo(() => {
    if (!user?.email) return [];
    return blogs.filter((blog) => blog.user?.email === user.email);
  }, [blogs, user?.email]);

  const startEdit = (blog: Blog) => {
    setActionMessage("");
    setEditingBlogId(blog._id);
    setEditTitle(blog.title);
    setEditDescription(blog.description);
  };

  const cancelEdit = () => {
    setEditingBlogId(null);
    setEditTitle("");
    setEditDescription("");
  };

  const handleDelete = async (blogId: string) => {
    if (!token) {
      setActionMessage("You are not authenticated. Please sign in again.");
      return;
    }
    setActionMessage("");
    setDeletingBlogId(blogId);
    try {
      await API.delete(`/blog/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActionMessage("Blog deleted successfully.");
      await fetchBlogs();
    } catch {
      setActionMessage("Failed to delete blog.");
    } finally {
      setDeletingBlogId(null);
    }
  };

  const handleUpdate = async (blogId: string) => {
    if (!token) {
      setActionMessage("You are not authenticated. Please sign in again.");
      return;
    }
    if (!editTitle.trim() || !editDescription.trim()) {
      setActionMessage("Title and description are required to update.");
      return;
    }
    setActionMessage("");
    setIsUpdating(true);
    try {
      await API.put(
        `/blog/${blogId}`,
        { title: editTitle, description: editDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActionMessage("Blog updated successfully.");
      cancelEdit();
      await fetchBlogs();
    } catch {
      setActionMessage("Failed to update blog.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-slate-950 px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-5xl space-y-6">

        {/* ── Profile Card ── */}
        <section className="rounded-2xl border border-white/10 bg-white/95 p-6 shadow-xl sm:p-8">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xl font-bold text-white shadow-lg">
              {user?.firstName?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Welcome back,{" "}
                <span className="text-violet-600">
                  {user?.firstName ?? "Writer"}
                </span>{" "}
                👋
              </h1>
              <p className="mt-0.5 text-sm text-slate-500">{user?.email}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-violet-50 p-4 text-center">
              <p className="text-2xl font-bold text-violet-700">
                {myBlogs.length}
              </p>
              <p className="mt-0.5 text-xs font-medium text-violet-500">
                My Posts
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 text-center">
              <p className="text-2xl font-bold text-slate-700">
                {myBlogs.reduce((sum, b) => sum + (b.likeCount ?? 0), 0)}
              </p>
              <p className="mt-0.5 text-xs font-medium text-slate-500">
                Total Likes
              </p>
            </div>
            <div className="col-span-2 rounded-xl bg-slate-50 p-4 text-center sm:col-span-1">
              <p className="text-2xl font-bold text-slate-700">
                {blogs.length}
              </p>
              <p className="mt-0.5 text-xs font-medium text-slate-500">
                Community Posts
              </p>
            </div>
          </div>
        </section>

        {/* ── Create Post ── */}
        <CreatePost onCreated={fetchBlogs} />

        {/* ── My Blogs ── */}
        <section className="rounded-2xl border border-white/10 bg-white/95 p-6 shadow-xl sm:p-8">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                My Blogs
              </h2>
              <p className="mt-0.5 text-sm text-slate-500">
                {myBlogs.length} post{myBlogs.length !== 1 ? "s" : ""} published
              </p>
            </div>
          </div>

          {/* Action message */}
          {actionMessage && (
            <div
              className={`mb-4 rounded-lg p-3 text-sm font-medium ${
                actionMessage.includes("successfully")
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {actionMessage}
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-xl bg-slate-100"
                />
              ))}
            </div>
          )}

          {/* Error */}
          {!isLoading && error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          {/* Empty */}
          {!isLoading && !error && myBlogs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-3 text-4xl">✍️</div>
              <p className="text-sm font-medium text-slate-600">
                No blogs yet.
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Create your first post above!
              </p>
            </div>
          )}

          {/* Blog list */}
          <div className="space-y-4">
            {myBlogs.map((blog) => (
              <article
                key={blog._id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-5 transition-shadow hover:shadow-md"
              >
                {editingBlogId === blog._id ? (
                  <UpdateBlog
                    isEditing
                    title={editTitle}
                    description={editDescription}
                    isUpdating={isUpdating}
                    onStartEdit={() => startEdit(blog)}
                    onCancel={cancelEdit}
                    onSave={() => handleUpdate(blog._id)}
                    onTitleChange={setEditTitle}
                    onDescriptionChange={setEditDescription}
                  />
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                        {blog.title}
                      </h3>

                      {/* Like count badge */}
                      <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-rose-100 bg-rose-50 px-2.5 py-1">
                        {(blog.likeCount ?? 0) > 0 ? (
                          <svg className="h-3.5 w-3.5 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                        ) : (
                          <svg className="h-3.5 w-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                        )}
                        <span className="text-xs font-semibold text-rose-600">
                          {blog.likeCount ?? 0}
                        </span>
                      </div>
                    </div>

                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">
                      {blog.description}
                    </p>

                    {/* Date */}
                    {blog.createdAt && (
                      <p className="mt-2 text-xs text-slate-400">
                        Published{" "}
                        {new Date(blog.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <UpdateBlog
                        isEditing={false}
                        title=""
                        description=""
                        isUpdating={false}
                        onStartEdit={() => startEdit(blog)}
                        onCancel={() => {}}
                        onSave={() => {}}
                        onTitleChange={() => {}}
                        onDescriptionChange={() => {}}
                      />
                      <DeleteBlog
                        isDeleting={deletingBlogId === blog._id}
                        onDelete={() => handleDelete(blog._id)}
                      />
                    </div>
                  </>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;