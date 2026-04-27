// src/components/BlogCard.jsx
// Editorial-style blog post card

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, MapPin, Heart } from "lucide-react";
import { format } from "date-fns";

export default function BlogCard({ post, index = 0, featured = false }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className={featured ? "col-span-full" : ""}
    >
      <Link to={`/journal/${post.slug}`} className="block group">
        <div
          className={`flex ${featured ? "flex-col md:flex-row" : "flex-col"} gap-0 overflow-hidden rounded-lg bg-void-700 hover:ring-1 hover:ring-amber/30 transition-all duration-300`}
        >
          {/* Cover image */}
          <div
            className={`relative overflow-hidden ${featured ? "md:w-1/2 aspect-video md:aspect-auto" : "aspect-video"}`}
          >
            {post.coverImage ? (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-void-600 to-void-800 flex items-center justify-center min-h-[200px]">
                <span className="text-5xl opacity-30">✍️</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>

          {/* Content */}
          <div
            className={`p-5 flex flex-col justify-between ${featured ? "md:flex-1" : "flex-1"}`}
          >
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {post.country && (
                <span className="stamp-label">
                  {post.country.flag || ""} {post.country.name}
                </span>
              )}
              {post.tags?.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-xs text-ivory/40 uppercase tracking-wider"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h3
              className={`font-display font-semibold text-ivory leading-tight mb-2 group-hover:text-amber-light transition-colors ${featured ? "text-2xl md:text-3xl" : "text-xl"}`}
            >
              {post.title}
            </h3>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-ivory/50 text-sm leading-relaxed line-clamp-2 mb-4">
                {post.excerpt}
              </p>
            )}

            {/* Meta */}
            <div className="flex items-center gap-4 text-xs text-ivory/40 font-mono mt-auto">
              {post.publishedAt && (
                <span>{format(new Date(post.publishedAt), "MMM d, yyyy")}</span>
              )}
              {post.readingTime && (
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {post.readingTime} min
                </span>
              )}
              {post.likesCount > 0 && (
                <span className="flex items-center gap-1 ml-auto text-amber/60">
                  <Heart size={11} />
                  {post.likesCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
