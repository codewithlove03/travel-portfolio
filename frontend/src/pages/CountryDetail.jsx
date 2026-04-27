// src/pages/CountryDetail.jsx
// Single country page — hero, description, places grid, blog posts

import { useParams, Link } from "react-router-dom";
import { useQuery } from "react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, BookOpen } from "lucide-react";
import { format } from "date-fns";
import api from "../api/axios";
import BlogCard from "../components/BlogCard";
import ImageGallery from "../components/ImageGallery";
import { PageLoader, EmptyState } from "../components/ui";

export default function CountryDetail() {
  const { slug } = useParams();

  const { data: country, isLoading } = useQuery(["country", slug], () =>
    api.get(`/countries/${slug}`).then((r) => r.data.data),
  );

  if (isLoading) return <PageLoader />;

  if (!country)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EmptyState
          title="Country not found"
          description="This page doesn't exist."
        />
      </div>
    );

  return (
    <div className="min-h-screen bg-void-900">
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {country.coverImage ? (
          <img
            src={country.coverImage}
            alt={country.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-void-700 to-void-900 flex items-center justify-center">
            <span className="text-9xl">{country.flag || "🌍"}</span>
          </div>
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-void-900 via-void-900/30 to-void-900/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-void-900/70 to-transparent" />

        {/* Back button */}
        <div className="absolute top-24 left-6">
          <Link
            to="/countries"
            className="flex items-center gap-2 text-sm text-ivory/70 hover:text-ivory transition-colors font-sans"
          >
            <ArrowLeft size={16} />
            All Countries
          </Link>
        </div>

        {/* Country info overlaid on hero */}
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Continent stamp */}
            <span className="stamp-label">{country.continent}</span>

            {/* Country name */}
            <h1 className="font-display text-display font-semibold text-ivory mt-3 leading-tight">
              {country.flag && <span className="mr-3">{country.flag}</span>}
              {country.name}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap gap-5 mt-4 text-sm text-ivory/50 font-mono">
              {country.visitedAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} />
                  Visited {format(new Date(country.visitedAt), "MMMM yyyy")}
                </span>
              )}
              {country.places?.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} />
                  {country.places.length} places explored
                </span>
              )}
              {country.blogs?.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <BookOpen size={13} />
                  {country.blogs.length} stories written
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-3xl mb-16"
        >
          <p className="font-sans text-ivory/70 text-lg leading-relaxed">
            {country.description}
          </p>
        </motion.div>

        {/* ── Places ───────────────────────────────────────────────────────── */}
        {country.places?.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <MapPin className="text-amber" size={20} />
              <h2 className="font-display text-title font-semibold text-ivory">
                Places I Visited
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {country.places.map((place, i) => (
                <motion.div
                  key={place._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.5 }}
                  className="glass-card overflow-hidden group hover:ring-1 hover:ring-amber/30 transition-all duration-300"
                >
                  {place.coverImage && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={place.coverImage}
                        alt={place.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-display text-xl font-semibold text-ivory">
                      {place.name}
                    </h3>
                    {place.description && (
                      <p className="text-ivory/50 text-sm mt-1 leading-relaxed line-clamp-2">
                        {place.description}
                      </p>
                    )}
                    {/* Tags */}
                    {place.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {place.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs font-mono text-amber/60 bg-amber/10 px-2 py-0.5 rounded-sm"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {/* Rating */}
                    {place.rating && (
                      <div className="flex gap-0.5 mt-3">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <span
                            key={idx}
                            className={`text-sm ${idx < place.rating ? "text-amber" : "text-ivory/20"}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── Blog Posts ────────────────────────────────────────────────────── */}
        {country.blogs?.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <BookOpen className="text-amber" size={20} />
              <h2 className="font-display text-title font-semibold text-ivory">
                Stories from {country.name}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {country.blogs.map((post, i) => (
                <BlogCard key={post._id} post={post} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {!country.places?.length && !country.blogs?.length && (
          <EmptyState
            title="More content coming soon"
            description="Stories and places for this country will appear here."
          />
        )}
      </div>
    </div>
  );
}
