// src/components/layout/Navbar.jsx
// Cinematic navbar — transparent over hero, dark on scroll, mobile hamburger

import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Compass, LogIn, LayoutDashboard } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/countries", label: "Countries" },
  { to: "/journal", label: "Journal" },
  { to: "/timeline", label: "Timeline" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { pathname } = useLocation();

  // Detect scroll to change navbar style
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-void-800/90 backdrop-blur-md border-b border-white/10 py-3"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <Compass
            className="text-amber group-hover:rotate-45 transition-transform duration-500"
            size={22}
          />
          <span className="font-display text-xl font-semibold text-ivory tracking-wide">
            {import.meta.env.VITE_OWNER_NAME || "My Travels"}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `font-sans text-sm font-medium tracking-wide transition-colors duration-200 relative group ${
                  isActive ? "text-amber" : "text-ivory/70 hover:text-ivory"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {label}
                  <span
                    className={`absolute -bottom-1 left-0 h-px bg-amber transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 text-sm text-ivory/70 hover:text-amber transition-colors"
                >
                  <LayoutDashboard size={16} />
                  Admin
                </Link>
              )}
              <button
                onClick={logout}
                className="text-sm text-ivory/50 hover:text-ivory/90 transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 text-sm font-medium px-4 py-2 border border-amber/50 text-amber hover:bg-amber hover:text-void-900 transition-all duration-300 rounded-sm"
            >
              <LogIn size={15} />
              Sign in
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-ivory/80 hover:text-ivory p-1"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-void-800/95 backdrop-blur-lg border-t border-white/10 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) =>
                    `font-sans text-base font-medium transition-colors ${
                      isActive ? "text-amber" : "text-ivory/70"
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
              <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                {isAuthenticated ? (
                  <>
                    {isAdmin && (
                      <Link to="/admin" className="text-amber text-sm">
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="text-ivory/50 text-sm text-left"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <Link to="/login" className="text-amber text-sm">
                    Sign in
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
