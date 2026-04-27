// src/pages/Countries.jsx
// Grid of all countries with continent filter

import { useState } from "react";
import { useQuery } from "react-query";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import api from "../api/axios";
import CountryCard from "../components/CountryCard";
import { PageLoader, SectionHeader, EmptyState } from "../components/ui";

const CONTINENTS = [
  "All",
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "South America",
  "Oceania",
  "Antarctica",
];

export default function Countries() {
  const [activeContinent, setActiveContinent] = useState("All");

  const { data, isLoading } = useQuery("countries", () =>
    api.get("/countries").then((r) => r.data.data),
  );

  const filtered =
    activeContinent === "All"
      ? data
      : data?.filter((c) => c.continent === activeContinent);

  return (
    <div className="min-h-screen bg-void-900 pt-24 pb-section">
      {/* Page header */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="py-12 border-b border-white/10 mb-10">
          <SectionHeader
            label="The Atlas"
            title="Countries Visited"
            subtitle={`${data?.length || 0} countries across ${new Set(data?.map((c) => c.continent)).size || 0} continents`}
          />

          {/* Continent filter pills */}
          <div className="flex flex-wrap gap-2 mt-6">
            {CONTINENTS.map((continent) => {
              const count =
                continent === "All"
                  ? data?.length
                  : data?.filter((c) => c.continent === continent).length;
              if (count === 0 && continent !== "All") return null;
              return (
                <motion.button
                  key={continent}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveContinent(continent)}
                  className={`px-4 py-1.5 text-xs font-mono uppercase tracking-widest rounded-sm transition-all duration-200 border ${
                    activeContinent === continent
                      ? "border-amber bg-amber/20 text-amber"
                      : "border-white/10 text-ivory/50 hover:border-white/30 hover:text-ivory/80"
                  }`}
                >
                  {continent}
                  {count !== undefined && (
                    <span className="ml-1.5 opacity-60">({count})</span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Countries grid */}
        {isLoading ? (
          <PageLoader />
        ) : filtered?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((country, i) => (
              <CountryCard key={country._id} country={country} index={i} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No countries yet"
            description="Check back soon for travel adventures."
          />
        )}
      </div>
    </div>
  );
}
