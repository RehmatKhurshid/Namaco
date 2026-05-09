import { useState, type FormEvent } from "react";
import API from "../../services/api";
import type { CreateBlogData } from "../../types/blog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

type CreatePostProps = {
  onCreated: () => Promise<void> | void;
};

const CreatePost = ({ onCreated }: CreatePostProps) => {
  const [formData, setFormData] = useState<CreateBlogData>({
    title: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!formData.title.trim() || !formData.description.trim()) {
      setMessage("Title and description are required.");
      return;
    }

    if (!token) {
      setMessage("Please sign in again to create a post.");
      return;
    }

    setIsSubmitting(true);
    try {
      await API.post("/blog", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFormData({ title: "", description: "" });
      setMessage("Post created successfully.");
      await onCreated();
    } catch {
      setMessage("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-2xl border border-white/20 bg-white/95 p-6 shadow-xl sm:p-8">
      <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">Create a New Blog</h2>
      <p className="mt-1 text-sm text-slate-600">Write something valuable for your readers.</p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <Input
          placeholder="Blog title"
          value={formData.title}
          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          className="h-11"
        />
        <Textarea
          placeholder="Write your blog description..."
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          className="min-h-[140px] resize-none"
        />
        {message && (
          <p
            className={`rounded-md p-2 text-sm ${
              message.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </p>
        )}
        <Button type="submit" disabled={isSubmitting} className="h-11 w-full sm:w-auto">
          {isSubmitting ? "Publishing..." : "Publish Post"}
        </Button>
      </form>
    </section>
  );
};

export default CreatePost;
