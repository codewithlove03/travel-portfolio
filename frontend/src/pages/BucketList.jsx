// src/pages/BucketList.jsx
// Public page — shows places the owner dreams of visiting

import { useState } from 'react'
import { useQuery } from 'react-query'
import { motion } from 'framer-motion'
import { Bookmark, MapPin, Star, Calendar, CheckCircle } from 'lucide-react'
import api from '../api/axios'
import { PageLoader, EmptyState, SectionHeader } from '../components/ui'

const PRIORITY_STYLES = {
  high:   { label: 'Must Go',  bg: 'bg-red-500/20',    text: 'text-red-400',    dot: 'bg-red-400'    },
  medium: { label: 'Want to Go', bg: 'bg-amber/20',  text: 'text-amber',    dot: 'bg-amber'    },
  low:    { label: 'Someday',   bg: 'bg-blue-500/20',  text: 'text-blue-400',   dot: 'bg-blue-400'   },
}

function BucketCard({ item, index }) {
  const p = PRIORITY_STYLES[item.priority] || PRIORITY_STYLES.medium

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.07, duration: 0.5 }}
      className="glass-card overflow-hidden group hover:ring-1 hover:ring-amber/30 transition-all duration-300"
    >
      {/* Cover image */}
      <div className="relative aspect-video overflow-hidden">
        {item.coverImage ? (
          <img src={item.coverImage} alt={item.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full dark:bg-void-600 bg-stone flex items-center justify-center text-5xl">
            {item.flag || '🗺️'}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Priority badge */}
        <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-sm ${p.bg}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />
          <span className={`font-mono text-xs uppercase tracking-wider ${p.text}`}>{p.label}</span>
        </div>

        {/* Bookmark icon */}
        <Bookmark className="absolute top-3 right-3 text-ivory/60" size={18} />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display text-xl font-semibold dark:text-ivory text-void-600 mb-1">{item.name}</h3>
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={12} className="text-amber flex-shrink-0" />
          <span className="text-sm dark:text-ivory/50 text-void-600/50 font-sans">{item.country}</span>
          {item.continent && (
            <span className="text-xs dark:text-ivory/30 text-void-600/30 font-mono">· {item.continent}</span>
          )}
        </div>

        {item.description && (
          <p className="text-sm dark:text-ivory/50 text-void-600/50 leading-relaxed mb-3 line-clamp-2">{item.description}</p>
        )}

        {item.reason && (
          <blockquote className="border-l-2 border-amber/50 pl-3 italic text-sm dark:text-ivory/40 text-void-600/40 mb-3">
            "{item.reason}"
          </blockquote>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t dark:border-white/10 border-black/10">
          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {item.tags?.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs font-mono text-amber/60 bg-amber/10 px-2 py-0.5 rounded-sm">#{tag}</span>
            ))}
          </div>
          {/* Target year */}
          {item.targetYear && (
            <span className="flex items-center gap-1 text-xs dark:text-ivory/30 text-void-600/30 font-mono">
              <Calendar size={11} />
              Goal: {item.targetYear}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function BucketList() {
  const [filter, setFilter] = useState('all')

  const { data, isLoading } = useQuery(['bucket', filter], () =>
    api.get(`/bucket?${filter !== 'all' ? `priority=${filter}` : ''}`).then((r) => r.data.data)
  )

  const { data: stats } = useQuery('bucket-stats', () =>
    api.get('/bucket/stats').then((r) => r.data.data)
  )

  const filters = [
    { key: 'all',    label: 'All Destinations' },
    { key: 'high',   label: '🔥 Must Go' },
    { key: 'medium', label: '⭐ Want to Go' },
    { key: 'low',    label: '🌙 Someday' },
  ]

  return (
    <div className="min-h-screen dark:bg-void-900 bg-cream pt-24 pb-section">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="py-12 border-b dark:border-white/10 border-black/10 mb-12">
          <SectionHeader
            label="The Dream List"
            title="Bucket List"
            subtitle="Places I haven't been yet — but absolutely need to."
          />

          {/* Stats */}
          {stats && (
            <div className="flex flex-wrap gap-8 mt-8">
              {[
                { value: stats.remaining, label: 'To explore',   color: 'text-amber' },
                { value: stats.high,      label: 'Must visit',   color: 'text-red-400' },
                { value: stats.completed, label: 'Completed ✓', color: 'text-green-400' },
              ].map(({ value, label, color }) => (
                <div key={label}>
                  <span className={`font-display text-4xl font-semibold ${color}`}>{value}</span>
                  <span className="font-mono text-xs uppercase tracking-widest dark:text-ivory/40 text-void-600/40 block mt-0.5">{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {filters.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-1.5 text-xs font-mono uppercase tracking-wider rounded-sm border transition-all duration-200 ${
                filter === key
                  ? 'border-amber bg-amber/10 text-amber'
                  : 'dark:border-white/10 border-black/10 dark:text-ivory/50 text-void-600/50 dark:hover:border-white/30 hover:border-black/30'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <PageLoader />
        ) : data?.length === 0 ? (
          <EmptyState title="Bucket list is empty" description="Dream destinations will appear here." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.map((item, i) => <BucketCard key={item._id} item={item} index={i} />)}
          </div>
        )}
      </div>
    </div>
  )
}
