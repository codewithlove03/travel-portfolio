// src/pages/BlogList.jsx
// Paginated journal of all published blog posts

import { useState } from 'react'
import { useQuery } from 'react-query'
import { BookOpen } from 'lucide-react'
import api from '../api/axios'
import BlogCard from '../components/BlogCard'
import { PageLoader, EmptyState, SectionHeader, Button } from '../components/ui'

export default function BlogList() {
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery(['blogs', page], () =>
    api.get(`/blogs?page=${page}&limit=9`).then((r) => r.data),
    { keepPreviousData: true }
  )

  const posts = data?.data || []
  const pagination = data?.pagination

  return (
    <div className="min-h-screen bg-void-900 pt-24 pb-section">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="py-12 border-b border-white/10 mb-12">
          <SectionHeader
            label="Travel Journal"
            title="Stories from the Road"
            subtitle="Personal accounts, reflections, and guides from every corner of the world."
          />
        </div>

        {isLoading ? (
          <PageLoader />
        ) : posts.length > 0 ? (
          <>
            {/* First post featured */}
            {page === 1 && posts[0] && (
              <div className="mb-6">
                <BlogCard post={posts[0]} index={0} featured />
              </div>
            )}

            {/* Remaining posts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {(page === 1 ? posts.slice(1) : posts).map((post, i) => (
                <BlogCard key={post._id} post={post} index={i} />
              ))}
            </div>

            {/* Pagination */}
            {pagination?.pages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-16">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <span className="font-mono text-sm text-ivory/40">
                  {page} / {pagination.pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === pagination.pages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            title="No stories yet"
            description="Journal entries will appear here once published."
          />
        )}
      </div>
    </div>
  )
}
