// src/components/layout/Footer.jsx
import { Link } from "react-router-dom";
import { Compass, Globe, BookOpen, Clock } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-void-800/50 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <Compass className="text-amber" size={20} />
              <span className="font-display text-lg font-semibold text-ivory">
                {import.meta.env.VITE_OWNER_NAME || "My Travels"}
              </span>
            </div>
            <p className="text-ivory/40 text-sm leading-relaxed font-sans">
              Documenting journeys, one story at a time. Every place has a story
              — this is mine.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-amber mb-4">
              Explore
            </h4>
            <div className="flex flex-col gap-2.5">
              {[
                { to: "/countries", label: "All Countries", icon: Globe },
                { to: "/journal", label: "Travel Journal", icon: BookOpen },
                { to: "/timeline", label: "Timeline", icon: Clock },
              ].map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-2 text-sm text-ivory/50 hover:text-ivory/90 transition-colors"
                >
                  <Icon size={14} />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Quote */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-amber mb-4">
              Motto
            </h4>
            <blockquote className="font-display text-lg italic text-ivory/60 leading-relaxed">
              "Not all those who wander are lost."
            </blockquote>
            <p className="text-ivory/30 text-xs mt-2 font-mono">
              — J.R.R. Tolkien
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-ivory/30 text-xs font-mono">
            © {year} {import.meta.env.VITE_OWNER_NAME || "Travel Portfolio"}.
            Built with ♥
          </p>
          <div className="flex items-center gap-1 text-ivory/20 text-xs font-mono">
            <span>Powered by</span>
            <span className="text-amber/60">React</span>
            <span>·</span>
            <span className="text-amber/60">MongoDB</span>
            <span>·</span>
            <span className="text-amber/60">Node.js</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
