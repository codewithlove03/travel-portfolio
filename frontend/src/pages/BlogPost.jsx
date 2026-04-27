// src/pages/BlogPost.jsx
// Full blog post view — rich content, likes, comments

import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Clock, Calendar, MapPin, Send } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { PageLoader, Button, EmptyState } from "../components/ui";

export default function BlogPost() {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const [guestName, setGuestName] = useState("");

  const { data: post, isLoading } = useQuery(["blog", slug], () =>
    api.get(`/blogs/${slug}`).then((r) => r.data.data),
  );

  // Like mutation
  const likeMutation = useMutation(() => api.post(`/blogs/${post._id}/like`), {
    onSuccess: () => queryClient.invalidateQueries(["blog", slug]),
    onError: () => toast.error("Sign in to like posts"),
  });

  // Comment mutation
  const commentMutation = useMutation(
    () =>
      api.post(`/blogs/${post._id}/comment`, { content: comment, guestName }),
    {
      onSuccess: () => {
        toast.success("Comment submitted for review!");
        setComment("");
        setGuestName("");
      },
      onError: (err) =>
        toast.error(err.response?.data?.message || "Failed to post comment"),
    },
  );

  if (isLoading) return <PageLoader />;
  if (!post)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EmptyState title="Post not found" />
      </div>
    );

  const approvedComments = post.comments?.filter((c) => c.isApproved) || [];

  return (
    <div className="min-h-screen bg-void-900 pt-20">
      {/* ── Hero Image ────────────────────────────────────────────────────────── */}
      {post.coverImage && (
        <div className="relative h-[55vh] overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-void-900 via-void-900/20 to-transparent" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Back link */}
        <Link
          to="/journal"
          className="flex items-center gap-2 text-sm text-ivory/50 hover:text-ivory transition-colors mb-8 font-sans"
        >
          <ArrowLeft size={15} />
          Back to Journal
        </Link>

        {/* ── Post header ───────────────────────────────────────────────────── */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.country && (
              <span className="stamp-label">
                {post.country.flag || ""} {post.country.name}
              </span>
            )}
            {post.tags?.map((tag) => (
              <span
                key={tag}
                className="font-mono text-xs text-ivory/40 uppercase tracking-wider"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="font-display text-display font-semibold text-ivory leading-tight mb-4">
            {post.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-5 text-sm text-ivory/40 font-mono pb-6 border-b border-white/10">
            {post.publishedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                {format(new Date(post.publishedAt), "MMMM d, yyyy")}
              </span>
            )}
            {post.readingTime && (
              <span className="flex items-center gap-1.5">
                <Clock size={13} />
                {post.readingTime} min read
              </span>
            )}
            {post.place && (
              <span className="flex items-center gap-1.5">
                <MapPin size={13} />
                {post.place.name}
              </span>
            )}
          </div>
        </motion.header>

        {/* ── Blog content ──────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="prose-travel mb-16"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* ── Like button ───────────────────────────────────────────────────── */}
        <div className="flex items-center gap-4 py-8 border-y border-white/10 mb-12">
          <button
            onClick={() =>
              isAuthenticated
                ? likeMutation.mutate()
                : toast.error("Sign in to like this post")
            }
            className="flex items-center gap-2 px-5 py-2.5 border border-white/10 rounded-sm hover:border-amber/50 hover:text-amber transition-all duration-200 text-ivory/60 font-sans text-sm"
          >
            <Heart
              size={16}
              className={post.likesCount > 0 ? "text-red-400" : ""}
            />
            {post.likesCount || 0} Likes
          </button>
          <p className="text-ivory/30 text-sm font-sans">
            {isAuthenticated
              ? "Did this story resonate with you?"
              : "Sign in to like this post."}
          </p>
        </div>

        {/* ── Comments section ──────────────────────────────────────────────── */}
        <section>
          <h3 className="font-display text-xl font-semibold text-ivory mb-8">
            {approvedComments.length > 0
              ? `${approvedComments.length} Comments`
              : "Leave a Comment"}
          </h3>

          {/* Approved comments */}
          {approvedComments.map((c) => (
            <div key={c._id} className="glass-card p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-sans text-sm font-medium text-ivory/80">
                  {c.user?.name || c.guestName || "Anonymous"}
                </span>
                <span className="font-mono text-xs text-ivory/30">
                  {format(new Date(c.createdAt), "MMM d, yyyy")}
                </span>
              </div>
              <p className="text-ivory/60 text-sm leading-relaxed">
                {c.content}
              </p>
            </div>
          ))}

          {/* Comment form */}
          <div className="glass-card p-6 mt-8">
            <h4 className="font-sans text-sm font-medium text-ivory/70 mb-4">
              Add your thoughts
            </h4>
            {!isAuthenticated && (
              <input
                type="text"
                placeholder="Your name (optional)"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full bg-void-700 border border-white/10 rounded-sm px-4 py-2.5 text-sm text-ivory placeholder-ivory/30 focus:outline-none focus:border-amber/50 mb-3"
              />
            )}
            <textarea
              placeholder="Share your thoughts..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full bg-void-700 border border-white/10 rounded-sm px-4 py-2.5 text-sm text-ivory placeholder-ivory/30 focus:outline-none focus:border-amber/50 resize-none mb-3"
            />
            <Button
              onClick={() => comment.trim() && commentMutation.mutate()}
              disabled={!comment.trim() || commentMutation.isLoading}
            >
              <Send size={15} />
              {commentMutation.isLoading ? "Submitting..." : "Submit Comment"}
            </Button>
            <p className="text-ivory/30 text-xs font-sans mt-2">
              Comments are reviewed before appearing publicly.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
