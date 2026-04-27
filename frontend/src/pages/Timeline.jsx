// src/pages/Timeline.jsx
// Vertical travel timeline sorted by visit date

import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { MapPin } from "lucide-react";
import api from "../api/axios";
import { PageLoader, SectionHeader, EmptyState } from "../components/ui";

export default function Timeline() {
  const { data: countries, isLoading } = useQuery("countries-timeline", () =>
    api.get("/countries").then((r) => r.data.data),
  );

  // Group countries by year
  const byYear = (countries || [])
    .filter((c) => c.visitedAt)
    .sort((a, b) => new Date(b.visitedAt) - new Date(a.visitedAt))
    .reduce((acc, c) => {
      const yr = new Date(c.visitedAt).getFullYear();
      if (!acc[yr]) acc[yr] = [];
      acc[yr].push(c);
      return acc;
    }, {});

  return (
    <div className="min-h-screen bg-void-900 pt-24 pb-section">
      <div className="max-w-4xl mx-auto px-6">
        <div className="py-12 border-b border-white/10 mb-16">
          <SectionHeader
            label="The Journey"
            title="Travel Timeline"
            subtitle="Every destination, in chronological order."
          />
        </div>

        {isLoading ? (
          <PageLoader />
        ) : Object.keys(byYear).length === 0 ? (
          <EmptyState title="No travels recorded yet" />
        ) : (
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[22px] top-0 bottom-0 w-px bg-gradient-to-b from-amber/60 via-amber/20 to-transparent" />

            {Object.entries(byYear).map(([year, items], yi) => (
              <div key={year} className="mb-14">
                {/* Year marker */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center gap-4 mb-8"
                >
                  <div className="w-11 h-11 rounded-full bg-amber flex items-center justify-center flex-shrink-0 z-10">
                    <span className="font-mono text-xs font-bold text-void-900">
                      {year}
                    </span>
                  </div>
                  <span className="font-display text-2xl font-semibold text-ivory/80">
                    {year}
                  </span>
                </motion.div>

                {/* Countries in that year */}
                <div className="ml-14 flex flex-col gap-5">
                  {items.map((country, ci) => (
                    <motion.div
                      key={country._id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: ci * 0.07, duration: 0.5 }}
                    >
                      {/* Connector dot */}
                      <div className="relative">
                        <div className="absolute -left-[42px] top-5 w-2.5 h-2.5 rounded-full bg-void-700 border-2 border-amber/60" />

                        <Link to={`/countries/${country.slug}`}>
                          <div className="flex gap-4 glass-card p-4 hover:ring-1 hover:ring-amber/30 transition-all duration-300 group">
                            {country.coverImage && (
                              <div className="w-20 h-16 rounded overflow-hidden flex-shrink-0">
                                <img
                                  src={country.coverImage}
                                  alt={country.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">
                                  {country.flag || "🌍"}
                                </span>
                                <h3 className="font-display text-lg font-semibold text-ivory group-hover:text-amber-light transition-colors">
                                  {country.name}
                                </h3>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-ivory/40 font-mono">
                                <span>
                                  {format(
                                    new Date(country.visitedAt),
                                    "MMMM yyyy",
                                  )}
                                </span>
                                <span>·</span>
                                <span>{country.continent}</span>
                                {country.places?.length > 0 && (
                                  <>
                                    <span>·</span>
                                    <span className="flex items-center gap-1">
                                      <MapPin size={10} />
                                      {country.places.length} places
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
