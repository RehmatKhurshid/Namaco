// src/pages/home.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogCard from "../components/blog/BlogCard";
import API from "../services/api";
import type { Blog } from "../types/blog";

const Home = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState("");

  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      setError("");
      try {
        const res = await API.get<{ blogs: Blog[] }>("/blog");
        setBlogs(res.data.blogs || []);
      } catch {
        setError("Failed to load blogs. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    void fetchBlogs();
  }, []);

  // Show toast for 2 seconds then hide
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const handleLike = (blogId: string) => {
    // Ready for when backend like API is built
    console.log("Like blog:", blogId);
    showToast("❤️ Like feature coming soon!");
  };

  const filteredBlogs = blogs.filter((blog) => {
    const q = searchQuery.toLowerCase();
    return (
      //sign in page
      // and blog.title.toLowerCase().includes(q) ||
      blog.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-white">

      {/* ── Toast notification ── */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-rose-100 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-lg transition-all duration-300">
          {toast}
        </div>
      )}

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-slate-950 px-4 py-20 sm:py-28">
        <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-violet-700/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-indigo-700/20 blur-3xl" />

        <div className="relative mx-auto max-w-3xl text-center">
          <span className="mb-4 inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-violet-400">
            Community Blog
          </span>

          <h1 className="mt-2 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Ideas Worth{" "}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Reading
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
            Explore stories, ideas, and insights from writers all around the
            world. Find something that sparks your curiosity.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {/* ✅ Fixed: goes to /dashboard if logged in, /signup if not */}
            <button
              onClick={() => navigate(isLoggedIn ? "/dashboard" : "/signup")}
              className="rounded-lg bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/40 transition-all duration-200 hover:bg-violet-500 active:scale-95"
            >
              {isLoggedIn ? "Go to Dashboard ✍️" : "Start Writing"}
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("blog-feed")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="rounded-lg border border-white/20 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur transition-all duration-200 hover:bg-white/10 active:scale-95"
            >
              Browse Blogs ↓
            </button>
          </div>
        </div>
      </section>

      {/* ── BLOG FEED ── */}
      <section
        id="blog-feed"
        className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8"
      >
        {/* Header + Search */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Latest Posts
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {isLoading
                ? "Loading..."
                : `${filteredBlogs.length} ${filteredBlogs.length === 1 ? "post" : "posts"} found`}
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm text-slate-800 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-52 animate-pulse rounded-xl border border-slate-100 bg-slate-100" />
            ))}
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center">
            <p className="text-sm font-medium text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-500"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && filteredBlogs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 text-5xl">📭</div>
            <h3 className="text-lg font-semibold text-slate-800">
              {searchQuery ? "No results found" : "No blogs yet"}
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              {searchQuery ? "Try a different search term." : "Be the first to share your story!"}
            </p>
            {/* {!searchQuery && (
              <button
                onClick={() => navigate(isLoggedIn ? "/dashboard" : "/signup")}
                className="mt-5 rounded-lg bg-violet-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-violet-500"
              >
                Write a Blog
              </button>
            )} */}
          </div>
        )}

        {/* Blog Grid */}
        {!isLoading && !error && filteredBlogs.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs.map((blog) =>
            (
              <BlogCard
                key={blog._id}
                blog={blog}
                isLoggedIn={isLoggedIn}
                onLike={handleLike}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;