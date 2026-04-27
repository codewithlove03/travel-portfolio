// src/components/CountryCard.jsx
// Cinematic card for country grid — hover reveals details

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function CountryCard({ country, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link to={`/countries/${country.slug}`} className="block group">
        <div className="relative overflow-hidden rounded-lg bg-void-700 aspect-[4/3] shadow-card">
          {/* Country Image */}
          {country.coverImage ? (
            <img
              src={country.coverImage}
              alt={country.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-void-600 to-void-800 flex items-center justify-center">
              <span className="text-6xl">{country.flag || "🌍"}</span>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          {/* Continent stamp */}
          <div className="absolute top-3 left-3">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-amber bg-void-900/80 backdrop-blur-sm px-2 py-1 rounded-sm border border-amber/30">
              {country.continent}
            </span>
          </div>

          {/* Featured badge */}
          {country.isFeatured && (
            <div className="absolute top-3 right-3">
              <span className="text-xs font-mono text-void-900 bg-amber px-2 py-0.5 rounded-sm">
                ★ Featured
              </span>
            </div>
          )}

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
            {/* Country name */}
            <h3 className="font-display text-2xl font-semibold text-ivory leading-tight mb-1">
              {country.flag && <span className="mr-2">{country.flag}</span>}
              {country.name}
            </h3>

            {/* Meta info */}
            <div className="flex items-center gap-4 text-xs text-ivory/60 font-mono overflow-hidden max-h-0 group-hover:max-h-10 transition-all duration-300">
              {country.visitedAt && (
                <span className="flex items-center gap-1">
                  <Calendar size={11} />
                  {format(new Date(country.visitedAt), "MMM yyyy")}
                </span>
              )}
              {country.places?.length > 0 && (
                <span className="flex items-center gap-1">
                  <MapPin size={11} />
                  {country.places.length}{" "}
                  {country.places.length === 1 ? "place" : "places"}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
