// src/pages/admin/Analytics.jsx
// Analytics dashboard showing top viewed content

import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, TrendingUp, Globe, BookOpen, MapPin, BarChart2 } from 'lucide-react'
import api from '../../api/axios'
import { PageLoader } from '../../components/ui'

// Simple bar chart component (no external library needed)
function Bar({ label, value, max, color = 'bg-amber', icon }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="w-5 flex-shrink-0 text-ivory/40">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm dark:text-ivory/80 text-void-600 font-sans truncate pr-2">{label}</span>
          <span className="font-mono text-xs dark:text-ivory/40 text-void-600/40 flex-shrink-0 flex items-center gap-1">
            <Eye size={11} /> {value.toLocaleString()}
          </span>
        </div>
        <div className="h-1.5 dark:bg-void-600 bg-stone rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full ${color} rounded-full`}
          />
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-3">
        <Icon className={`${color} opacity-80`} size={20} />
        <Eye size={14} className="dark:text-ivory/20 text-void-600/20" />
      </div>
      <p className="font-display text-3xl font-semibold dark:text-ivory text-void-600">{value.toLocaleString()}</p>
      <p className="font-mono text-xs uppercase tracking-widest dark:text-ivory/40 text-void-600/40 mt-1">{label}</p>
    </div>
  )
}

export default function Analytics() {
  const { data, isLoading } = useQuery('analytics', () =>
    api.get('/analytics').then((r) => r.data.data)
  )

  if (isLoading) return <PageLoader />

  const maxCountryViews = Math.max(...(data?.topCountries?.map((c) => c.views) || [1]))
  const maxPlaceViews   = Math.max(...(data?.topPlaces?.map((p) => p.views)   || [1]))
  const maxBlogViews    = Math.max(...(data?.topBlogs?.map((b) => b.views)    || [1]))

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-amber mb-1">Insights</p>
        <h1 className="font-display text-3xl font-semibold dark:text-ivory text-void-600">Analytics</h1>
        <p className="dark:text-ivory/40 text-void-600/40 text-sm font-sans mt-1">
          Total views across all your content.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
        <StatCard label="Country Views" value={data?.totalCountryViews || 0} icon={Globe}   color="text-blue-400" />
        <StatCard label="Blog Views"    value={data?.totalBlogViews    || 0} icon={BookOpen} color="text-amber" />
        <StatCard
          label="Total Views"
          value={(data?.totalCountryViews || 0) + (data?.totalBlogViews || 0)}
          icon={TrendingUp}
          color="text-green-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Countries */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-5">
            <Globe size={16} className="text-blue-400" />
            <h2 className="font-display text-lg font-semibold dark:text-ivory text-void-600">Top Countries</h2>
          </div>
          {data?.topCountries?.length > 0 ? (
            data.topCountries.map((c) => (
              <Bar key={c._id} label={`${c.flag || ''} ${c.name}`} value={c.views} max={maxCountryViews} color="bg-blue-400" icon={<Globe size={14} />} />
            ))
          ) : (
            <p className="text-sm dark:text-ivory/30 text-void-600/30 font-sans">No views yet</p>
          )}
        </div>

        {/* Top Places */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-5">
            <MapPin size={16} className="text-green-400" />
            <h2 className="font-display text-lg font-semibold dark:text-ivory text-void-600">Top Places</h2>
          </div>
          {data?.topPlaces?.length > 0 ? (
            data.topPlaces.map((p) => (
              <Bar key={p._id} label={p.name} value={p.views} max={maxPlaceViews} color="bg-green-400" icon={<MapPin size={14} />} />
            ))
          ) : (
            <p className="text-sm dark:text-ivory/30 text-void-600/30 font-sans">No views yet</p>
          )}
        </div>

        {/* Top Blog Posts */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-5">
            <BookOpen size={16} className="text-amber" />
            <h2 className="font-display text-lg font-semibold dark:text-ivory text-void-600">Top Posts</h2>
          </div>
          {data?.topBlogs?.length > 0 ? (
            data.topBlogs.map((b) => (
              <Bar key={b._id} label={b.title} value={b.views} max={maxBlogViews} color="bg-amber" icon={<BookOpen size={14} />} />
            ))
          ) : (
            <p className="text-sm dark:text-ivory/30 text-void-600/30 font-sans">No views yet</p>
          )}
        </div>
      </div>

      {/* Recently viewed */}
      {data?.recentlyViewed?.length > 0 && (
        <div className="glass-card p-5 mt-6">
          <h2 className="font-display text-lg font-semibold dark:text-ivory text-void-600 mb-4">Recently Viewed Posts</h2>
          <div className="flex flex-col gap-2">
            {data.recentlyViewed.map((post) => (
              <div key={post._id} className="flex items-center justify-between py-2 border-b dark:border-white/5 border-black/5">
                <Link to={`/journal/${post.slug}`} className="text-sm dark:text-ivory/70 text-void-600/70 hover:text-amber transition-colors font-sans truncate pr-4">
                  {post.title}
                </Link>
                <span className="font-mono text-xs dark:text-ivory/30 text-void-600/30 flex items-center gap-1 flex-shrink-0">
                  <Eye size={11} /> {post.views}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs dark:text-ivory/20 text-void-600/20 font-mono mt-8 text-center">
        Views are counted each time a visitor opens a country page or blog post.
      </p>
    </div>
  )
}
