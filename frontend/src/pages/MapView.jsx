// src/pages/MapView.jsx
// Interactive world map showing visited countries and bucket list destinations

import { useEffect, useRef } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { MapPin, Bookmark } from 'lucide-react'
import api from '../api/axios'
import { PageLoader } from '../components/ui'

// We load Leaflet dynamically to avoid SSR issues
let L = null

export default function MapView() {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)

  const { data: countries, isLoading: loadingCountries } = useQuery('countries-map', () =>
    api.get('/countries').then((r) => r.data.data)
  )
  const { data: bucket, isLoading: loadingBucket } = useQuery('bucket-map', () =>
    api.get('/bucket').then((r) => r.data.data)
  )

  useEffect(() => {
    // Dynamically import Leaflet (avoids window undefined errors)
    import('leaflet').then((leaflet) => {
      L = leaflet.default

      // Fix default marker icons (known Leaflet + Vite issue)
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      if (mapInstanceRef.current) return // Already initialized

      const map = L.map(mapRef.current, {
        center: [20, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 10,
        zoomControl: true,
      })

      // Dark tile layer from CartoDB
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        {
          attribution: '© OpenStreetMap © CartoDB',
          subdomains: 'abcd',
          maxZoom: 19,
        }
      ).addTo(map)

      mapInstanceRef.current = map
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Add visited country markers
  useEffect(() => {
    if (!mapInstanceRef.current || !L || !countries) return

    countries.forEach((country) => {
      if (!country.coordinates?.lat || !country.coordinates?.lng) return

      // Custom amber pin for visited countries
      const visitedIcon = L.divIcon({
        html: `<div style="
          width: 28px; height: 28px; background: #d4a853;
          border-radius: 50% 50% 50% 0; transform: rotate(-45deg);
          border: 3px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        "></div>`,
        className: '',
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -30],
      })

      const popup = `
        <div style="min-width:160px; padding: 4px;">
          ${country.coverImage ? `<img src="${country.coverImage}" style="width:100%;height:80px;object-fit:cover;border-radius:4px;margin-bottom:8px;" />` : ''}
          <div style="font-size:11px;color:#d4a853;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:2px;">${country.continent}</div>
          <div style="font-size:16px;font-weight:600;margin-bottom:4px;">${country.flag || ''} ${country.name}</div>
          <a href="/countries/${country.slug}" style="font-size:12px;color:#d4a853;text-decoration:underline;">View country →</a>
        </div>
      `

      L.marker([country.coordinates.lat, country.coordinates.lng], { icon: visitedIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup(popup)
    })
  }, [countries])

  // Add bucket list markers
  useEffect(() => {
    if (!mapInstanceRef.current || !L || !bucket) return

    bucket.forEach((item) => {
      if (!item.coordinates?.lat || !item.coordinates?.lng) return

      // Blue dashed pin for bucket list
      const bucketIcon = L.divIcon({
        html: `<div style="
          width: 22px; height: 22px; background: transparent;
          border-radius: 50%; border: 3px dashed #6b9bd2;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        "></div>`,
        className: '',
        iconSize: [22, 22],
        iconAnchor: [11, 11],
        popupAnchor: [0, -14],
      })

      const priorityColor = item.priority === 'high' ? '#e05a5a' : item.priority === 'medium' ? '#d4a853' : '#888'

      const popup = `
        <div style="min-width:160px;padding:4px;">
          <div style="font-size:11px;color:#6b9bd2;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:2px;">📌 Bucket List</div>
          <div style="font-size:16px;font-weight:600;margin-bottom:4px;">${item.name}</div>
          <div style="font-size:12px;opacity:0.6;margin-bottom:4px;">${item.country}</div>
          <span style="font-size:11px;background:${priorityColor}22;color:${priorityColor};padding:2px 6px;border-radius:3px;">${item.priority} priority</span>
        </div>
      `

      L.marker([item.coordinates.lat, item.coordinates.lng], { icon: bucketIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup(popup)
    })
  }, [bucket])

  const visitedWithCoords = countries?.filter((c) => c.coordinates?.lat) || []
  const bucketWithCoords = bucket?.filter((b) => b.coordinates?.lat) || []

  return (
    <div className="min-h-screen dark:bg-void-900 bg-cream pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-amber">Interactive Map</span>
          <h1 className="font-display text-display font-semibold dark:text-ivory text-void-600 mt-2">
            My World Map
          </h1>
          <p className="dark:text-ivory/50 text-void-600/60 font-sans mt-2">
            {visitedWithCoords.length} countries visited · {bucketWithCoords.length} on bucket list
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm dark:text-ivory/60 text-void-600/60 font-sans">
            <div className="w-4 h-4 rounded-full bg-amber" />
            Visited countries
          </div>
          <div className="flex items-center gap-2 text-sm dark:text-ivory/60 text-void-600/60 font-sans">
            <div className="w-4 h-4 rounded-full border-2 border-dashed border-blue-400" />
            Bucket list
          </div>
        </div>

        {/* Map */}
        <div className="relative rounded-xl overflow-hidden border dark:border-white/10 border-black/10" style={{ height: '600px' }}>
          {(loadingCountries || loadingBucket) && (
            <div className="absolute inset-0 z-10 flex items-center justify-center dark:bg-void-900/80 bg-cream/80">
              <PageLoader />
            </div>
          )}
          <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        </div>

        {/* Note about coordinates */}
        {visitedWithCoords.length === 0 && !loadingCountries && (
          <p className="text-center dark:text-ivory/40 text-void-600/40 text-sm font-sans mt-6">
            Add latitude/longitude coordinates to your countries and bucket list items to see them on the map.
            You can set coordinates when adding or editing a country in the admin panel.
          </p>
        )}

        {/* Countries list below map */}
        {visitedWithCoords.length > 0 && (
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {countries?.filter((c) => c.coordinates?.lat).map((c) => (
              <Link key={c._id} to={`/countries/${c.slug}`}
                className="flex items-center gap-2 glass-card px-3 py-2 hover:border-amber/30 transition-all text-sm dark:text-ivory/70 text-void-600/70 hover:text-amber"
              >
                <span>{c.flag || '🌍'}</span>
                <span className="font-sans truncate">{c.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
