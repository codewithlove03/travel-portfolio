// src/components/layout/AdminLayout.jsx
// Admin dashboard layout with collapsible sidebar

import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Globe,
  MapPin,
  BookOpen,
  LogOut,
  Compass,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/countries", label: "Countries", icon: Globe },
  { to: "/admin/places", label: "Places", icon: MapPin },
  { to: "/admin/blogs", label: "Blog Posts", icon: BookOpen },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-void-900">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative bg-void-800 border-r border-white/10 flex flex-col flex-shrink-0 overflow-hidden"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <Compass className="text-amber flex-shrink-0" size={22} />
          {!collapsed && (
            <span className="font-display text-lg font-semibold text-ivory whitespace-nowrap overflow-hidden">
              Admin
            </span>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-amber/20 text-amber"
                    : "text-ivory/60 hover:bg-white/5 hover:text-ivory"
                }`
              }
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium whitespace-nowrap overflow-hidden">
                  {label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="px-3 py-4 border-t border-white/10">
          {!collapsed && (
            <div className="px-3 py-2 mb-2">
              <p className="text-xs text-ivory/30 font-mono">Signed in as</p>
              <p className="text-sm text-ivory/70 truncate">{user?.name}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-ivory/40 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
          >
            <LogOut size={18} className="flex-shrink-0" />
            {!collapsed && <span className="text-sm">Sign out</span>}
          </button>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-5 right-3  bg-void-700 border border-white/10 rounded-full p-1 text-ivory/50 hover:text-ivory transition-colors"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </motion.aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
