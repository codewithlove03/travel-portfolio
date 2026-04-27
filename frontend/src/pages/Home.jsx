// src/pages/Home.jsx
// The main character's homepage — cinematic hero, stats, featured countries, recent posts

import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Globe, MapPin, BookOpen, Compass } from "lucide-react";
import api from "../api/axios";
import CountryCard from "../components/CountryCard";
import BlogCard from "../components/BlogCard";
import { PageLoader, SectionHeader } from "../components/ui";

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection({ stats }) {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden grain-overlay"
    >
      {/* Parallax background */}
      <motion.div className="absolute inset-0" style={{ y }}>
        <div
          className="absolute inset-0 bg-cover bg-center scale-110"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-void-900/60 via-void-900/40 to-void-900" />
        <div className="absolute inset-0 bg-gradient-to-r from-void-900/70 to-transparent" />
      </motion.div>

      {/* Floating compass decoration */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/3 right-16 opacity-5 hidden lg:block"
      >
        <Compass size={300} className="text-amber" />
      </motion.div>

      {/* Hero content */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 pt-24"
        style={{ opacity }}
      >
        {/* Pre-title stamp */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <span className="stamp-label">The World According to Me</span>
        </motion.div>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-hero font-semibold text-ivory mt-4 max-w-3xl leading-[0.95]"
        >
          Every journey
          <br />
          <span className="italic text-amber-light">tells a story.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="font-sans text-ivory/60 mt-6 text-lg max-w-lg leading-relaxed"
        >
          {import.meta.env.VITE_TAGLINE ||
            "A personal collection of the world's most unforgettable places, people, and moments."}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex flex-wrap gap-4 mt-10"
        >
          <Link
            to="/countries"
            className="flex items-center gap-2 px-8 py-3.5 bg-amber text-void-900 font-sans font-semibold text-sm hover:bg-amber-light transition-all duration-300 rounded-sm group"
          >
            Explore Countries
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
          <Link
            to="/journal"
            className="flex items-center gap-2 px-8 py-3.5 border border-ivory/30 text-ivory font-sans font-medium text-sm hover:border-ivory hover:bg-white/5 transition-all duration-300 rounded-sm"
          >
            Read the Journal
          </Link>
        </motion.div>

        {/* Stats row */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="flex flex-wrap gap-8 mt-16 pt-8 border-t border-white/10"
          >
            {[
              { value: stats.countryCount, label: "Countries", icon: Globe },
              { value: stats.placeCount, label: "Places", icon: MapPin },
              { value: stats.blogCount, label: "Stories", icon: BookOpen },
            ].map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3">
                <Icon className="text-amber/60" size={20} />
                <div>
                  <span className="font-display text-3xl font-semibold text-ivory">
                    {value}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-widest text-ivory/40 block">
                    {label}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-xs text-ivory/30 uppercase tracking-widest">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-8 bg-gradient-to-b from-ivory/30 to-transparent"
        />
      </motion.div>
    </section>
  );
}

// ─── Stats Banner ─────────────────────────────────────────────────────────────
function ContinentStats({ data = [] }) {
  return (
    <section className="py-8 border-y border-white/10 bg-void-800/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap gap-6 justify-center md:justify-between items-center">
          {data.map(({ _id, count }) => (
            <div key={_id} className="flex items-center gap-2">
              <span className="font-display text-xl font-semibold text-amber">
                {count}
              </span>
              <span className="text-sm text-ivory/50 font-sans">{_id}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Main Home Component ──────────────────────────────────────────────────────
export default function Home() {
  const { data: statsData } = useQuery("stats", () =>
    api.get("/countries/stats").then((r) => r.data.data),
  );
  const { data: featured, isLoading: loadingFeatured } = useQuery(
    "featured-countries",
    () => api.get("/countries/featured").then((r) => r.data.data),
  );
  const { data: blogs, isLoading: loadingBlogs } = useQuery(
    "recent-blogs",
    () => api.get("/blogs?limit=3").then((r) => r.data.data),
  );

  return (
    <div className="bg-void-900">
      {/* Hero */}
      <HeroSection stats={statsData} />

      {/* Continent stats ticker */}
      {statsData?.continentStats?.length > 0 && (
        <ContinentStats data={statsData.continentStats} />
      )}

      {/* Featured Countries */}
      <section className="py-section max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <SectionHeader
            label="Where I've Been"
            title="Featured Countries"
            subtitle="A curated selection of the places that left the deepest marks."
          />
          <Link
            to="/countries"
            className="hidden md:flex items-center gap-2 text-sm text-amber hover:text-amber-light transition-colors font-sans mb-4"
          >
            View all <ArrowRight size={15} />
          </Link>
        </div>
        {loadingFeatured ? (
          <PageLoader />
        ) : featured?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((c, i) => (
              <CountryCard key={c._id} country={c} index={i} />
            ))}
          </div>
        ) : (
          <p className="text-ivory/40 text-center py-12 font-sans">
            No featured countries yet.
          </p>
        )}
      </section>

      {/* Quote section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber/5 to-transparent" />
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <motion.blockquote
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-display text-display italic text-ivory/70 leading-tight"
          >
            "The world is a book and those who do not travel read only one
            page."
          </motion.blockquote>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="font-mono text-sm text-amber/60 mt-6 tracking-widest uppercase"
          >
            — Saint Augustine
          </motion.p>
        </div>
      </section>

      {/* Recent Blog Posts */}
      <section className="py-section max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <SectionHeader
            label="From the Journal"
            title="Recent Stories"
            subtitle="Raw thoughts from the road."
          />
          <Link
            to="/journal"
            className="hidden md:flex items-center gap-2 text-sm text-amber hover:text-amber-light transition-colors font-sans mb-4"
          >
            All posts <ArrowRight size={15} />
          </Link>
        </div>
        {loadingBlogs ? (
          <PageLoader />
        ) : blogs?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {blogs.map((post, i) => (
              <BlogCard key={post._id} post={post} index={i} />
            ))}
          </div>
        ) : (
          <p className="text-ivory/40 text-center py-12 font-sans">
            No posts published yet.
          </p>
        )}
      </section>
    </div>
  );
}
