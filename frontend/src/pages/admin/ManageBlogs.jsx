// src/pages/admin/ManageBlogs.jsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Plus, Pencil, Trash2, CheckCircle, Clock } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import {
  Button,
  Badge,
  PageLoader,
  ConfirmDialog,
  EmptyState,
} from "../../components/ui";

export default function ManageBlogs() {
  const qc = useQueryClient();
  const [deleteId, setDeleteId] = useState(null);
  const [filter, setFilter] = useState("all");

  const { data, isLoading } = useQuery(["admin-blogs", filter], () => {
    const status = filter === "all" ? "" : `&status=${filter}`;
    return api.get(`/blogs?limit=50${status}`).then((r) => r.data.data);
  });

  // Also fetch drafts (default GET only returns published)
  const { data: drafts } = useQuery("admin-drafts", () =>
    api.get("/blogs?limit=50&status=draft").then((r) => r.data.data),
  );

  const allPosts =
    filter === "all" ? [...(data || []), ...(drafts || [])] : data || [];

  const deleteMutation = useMutation((id) => api.delete(`/blogs/${id}`), {
    onSuccess: () => {
      toast.success("Post deleted");
      qc.invalidateQueries("admin-blogs");
      qc.invalidateQueries("admin-drafts");
    },
  });

  return (
    <div className="p-8 max-w-10xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-amber mb-1">
            Manage
          </p>
          <h1 className="font-display text-3xl font-semibold text-ivory">
            Blog Posts
          </h1>
        </div>
        <Link to="/admin/blogs/new">
          <Button>
            <Plus size={16} /> New Post
          </Button>
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {["all", "published", "draft"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 text-xs font-mono uppercase tracking-wider rounded-sm border transition-all ${
              filter === f
                ? "border-amber bg-amber/10 text-amber"
                : "border-white/10 text-ivory/50 hover:border-white/30"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <PageLoader />
      ) : allPosts.length === 0 ? (
        <EmptyState
          title="No blog posts yet"
          action={
            <Link to="/admin/blogs/new">
              <Button>Write First Post</Button>
            </Link>
          }
        />
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-ivory/40 font-mono text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3">Title</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">
                  Country
                </th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">
                  Status
                </th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">
                  Date
                </th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allPosts.map((post) => (
                <tr
                  key={post._id}
                  className="border-b border-white/5 hover:bg-white/3 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {post.coverImage && (
                        <img
                          src={post.coverImage}
                          className="w-8 h-8 rounded object-cover"
                          alt=""
                        />
                      )}
                      <span className="font-sans text-ivory/90 line-clamp-1">
                        {post.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-ivory/50 font-mono text-xs">
                    {post.country?.flag} {post.country?.name || "—"}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {post.status === "published" ? (
                      <Badge variant="green">Published</Badge>
                    ) : (
                      <Badge variant="default">Draft</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-ivory/40 font-mono text-xs">
                    {post.publishedAt
                      ? format(new Date(post.publishedAt), "MMM d, yyyy")
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/blogs/${post._id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Pencil size={14} />
                        </Button>
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setDeleteId(post._id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Post"
        message="This will permanently delete this blog post."
        onConfirm={() => {
          deleteMutation.mutate(deleteId);
          setDeleteId(null);
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
