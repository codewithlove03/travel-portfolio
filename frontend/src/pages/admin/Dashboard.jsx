// src/pages/admin/Dashboard.jsx
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe, MapPin, BookOpen, MessageSquare, Plus } from "lucide-react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { PageLoader } from "../../components/ui";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading } = useQuery("admin-stats", () =>
    api.get("/countries/stats").then((r) => r.data.data),
  );
  const { data: recentBlogs } = useQuery("admin-recent-blogs", () =>
    api.get("/blogs?limit=5&status=published").then((r) => r.data.data),
  );
  const { data: countries } = useQuery("admin-countries", () =>
    api.get("/countries").then((r) => r.data.data),
  );

  const statCards = [
    {
      label: "Countries",
      value: stats?.countryCount || 0,
      icon: Globe,
      to: "/admin/countries",
      color: "text-blue-400",
    },
    {
      label: "Places",
      value: stats?.placeCount || 0,
      icon: MapPin,
      to: "/admin/places",
      color: "text-green-400",
    },
    {
      label: "Blog Posts",
      value: stats?.blogCount || 0,
      icon: BookOpen,
      to: "/admin/blogs",
      color: "text-amber",
    },
  ];

  const quickActions = [
    { label: "Add Country", to: "/admin/countries/new", icon: Globe },
    { label: "New Blog Post", to: "/admin/blogs/new", icon: BookOpen },
    { label: "Add Place", to: "/admin/places", icon: MapPin },
  ];

  return (
    <div className="p-8 max-w-10xl">
      {/* Header */}
      <div className="mb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-amber mb-1">
          Admin Panel
        </p>
        <h1 className="font-display text-3xl font-semibold text-ivory">
          Welcome back, {user?.name?.split(" ")[0]}
        </h1>
        <p className="text-ivory/40 text-sm font-sans mt-1">
          Manage your travel stories and destinations.
        </p>
      </div>

      {isLoading ? (
        <PageLoader />
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {statCards.map(({ label, value, icon: Icon, to, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={to}
                  className="block glass-card p-5 hover:ring-1 hover:ring-amber/30 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <Icon className={`${color} opacity-80`} size={22} />
                    <span className="font-mono text-xs text-ivory/30 group-hover:text-amber/60 transition-colors">
                      View →
                    </span>
                  </div>
                  <p className="font-display text-4xl font-semibold text-ivory">
                    {value}
                  </p>
                  <p className="font-mono text-xs uppercase tracking-widest text-ivory/40 mt-1">
                    {label}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <div className="glass-card p-5">
              <h2 className="font-display text-lg font-semibold text-ivory mb-4">
                Quick Actions
              </h2>
              <div className="flex flex-col gap-2">
                {quickActions.map(({ label, to, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex items-center gap-3 px-4 py-3 rounded-sm bg-void-700 hover:bg-amber/10 hover:text-amber text-ivory/70 transition-all duration-200 text-sm font-sans"
                  >
                    <Plus size={15} />
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Blog Posts */}
            <div className="glass-card p-5">
              <h2 className="font-display text-lg font-semibold text-ivory mb-4">
                Recent Posts
              </h2>
              {recentBlogs?.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {recentBlogs.map((post) => (
                    <div
                      key={post._id}
                      className="flex items-center gap-3 py-2 border-b border-white/5"
                    >
                      <BookOpen
                        size={14}
                        className="text-ivory/30 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm text-ivory/80 truncate font-sans">
                          {post.title}
                        </p>
                        <p className="text-xs text-ivory/30 font-mono">
                          {post.country?.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-ivory/30 text-sm font-sans">No posts yet.</p>
              )}
            </div>
          </div>

          {/* Countries overview */}
          {countries?.length > 0 && (
            <div className="glass-card p-5 mt-6">
              <h2 className="font-display text-lg font-semibold text-ivory mb-4">
                Countries Overview
              </h2>
              <div className="flex flex-wrap gap-2">
                {countries.map((c) => (
                  <span
                    key={c._id}
                    className="flex items-center gap-1.5 px-3 py-1 bg-void-700 rounded-sm text-xs font-mono text-ivory/60"
                  >
                    {c.flag || "🌍"} {c.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
