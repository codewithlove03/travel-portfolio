// src/components/ImageGallery.jsx
// Photo gallery with lightbox — click to expand, keyboard navigation

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

export default function ImageGallery({ images = [], className = '' }) {
  const [lightboxIndex, setLightboxIndex] = useState(null)

  // Keyboard navigation in lightbox
  useEffect(() => {
    if (lightboxIndex === null) return
    const handler = (e) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'Escape') setLightboxIndex(null)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxIndex])

  const next = () => setLightboxIndex((i) => (i + 1) % images.length)
  const prev = () => setLightboxIndex((i) => (i - 1 + images.length) % images.length)

  if (!images.length) return null

  return (
    <>
      {/* Grid layout */}
      <div className={`grid gap-2 ${
        images.length === 1 ? 'grid-cols-1' :
        images.length === 2 ? 'grid-cols-2' :
        images.length === 3 ? 'grid-cols-3' :
        'grid-cols-2 md:grid-cols-3'
      } ${className}`}>
        {images.map((img, idx) => (
          <motion.div
            key={img.url || idx}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className={`relative group overflow-hidden rounded-lg bg-void-700 cursor-pointer ${
              idx === 0 && images.length >= 4 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'
            }`}
            onClick={() => setLightboxIndex(idx)}
          >
            <img
              src={img.url}
              alt={img.caption || `Photo ${idx + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
              <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={24} />
            </div>
            {/* Caption */}
            {img.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-xs text-ivory/80 font-sans truncate">{img.caption}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10"
              onClick={() => setLightboxIndex(null)}
            >
              <X size={28} />
            </button>

            {/* Navigation */}
            {images.length > 1 && (
              <>
                <button
                  className="absolute left-4 text-white/70 hover:text-white transition-colors z-10 p-2"
                  onClick={(e) => { e.stopPropagation(); prev() }}
                >
                  <ChevronLeft size={36} />
                </button>
                <button
                  className="absolute right-4 text-white/70 hover:text-white transition-colors z-10 p-2"
                  onClick={(e) => { e.stopPropagation(); next() }}
                >
                  <ChevronRight size={36} />
                </button>
              </>
            )}

            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="max-w-5xl max-h-[85vh] flex flex-col items-center gap-3"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={images[lightboxIndex].url}
                  alt={images[lightboxIndex].caption || ''}
                  className="max-h-[78vh] max-w-full object-contain rounded-lg"
                />
                {images[lightboxIndex].caption && (
                  <p className="text-ivory/60 text-sm font-sans text-center">
                    {images[lightboxIndex].caption}
                  </p>
                )}
                {/* Counter */}
                <span className="text-ivory/30 text-xs font-mono">
                  {lightboxIndex + 1} / {images.length}
                </span>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
