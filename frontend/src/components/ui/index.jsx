// src/components/ui/index.jsx
// Shared UI primitives — Button, Badge, Spinner, EmptyState, etc.

import { motion } from "framer-motion";
import { Loader2, Frown } from "lucide-react";

// ─── Button ───────────────────────────────────────────────────────────────────
export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-sans font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-amber text-void-900 hover:bg-amber-light active:scale-95",
    outline:
      "border border-amber/50 text-amber hover:bg-amber hover:text-void-900",
    ghost: "text-ivory/70 hover:text-ivory hover:bg-white/5",
    danger:
      "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-sm",
    md: "px-5 py-2.5 text-sm rounded-sm",
    lg: "px-8 py-3.5 text-base rounded-sm",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// ─── Badge / Tag ──────────────────────────────────────────────────────────────
export function Badge({ children, variant = "default" }) {
  const variants = {
    default: "bg-white/10 text-ivory/70",
    amber: "bg-amber/20 text-amber",
    green: "bg-green-500/20 text-green-400",
    red: "bg-red-500/20 text-red-400",
  };

  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-sm text-xs font-mono uppercase tracking-widest ${variants[variant]}`}
    >
      {children}
    </span>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner({ size = 20, className = "" }) {
  return (
    <Loader2 size={size} className={`animate-spin text-amber ${className}`} />
  );
}

// ─── Full-page Loader ─────────────────────────────────────────────────────────
export function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Spinner size={32} />
      <p className="text-ivory/40 font-mono text-sm">Loading...</p>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({
  title = "Nothing here yet",
  description,
  action,
}) {
  return (
    <div className="py-20 flex flex-col items-center justify-center text-center gap-4">
      <Frown className="text-ivory/20" size={40} />
      <div>
        <h3 className="font-display text-xl text-ivory/60">{title}</h3>
        {description && (
          <p className="text-ivory/40 text-sm mt-1">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
export function SectionHeader({ label, title, subtitle, center = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`mb-12 ${center ? "text-center" : ""}`}
    >
      {label && (
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-amber">
          {label}
        </span>
      )}
      <h2 className="font-display text-display font-semibold text-ivory mt-2 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-ivory/50 font-sans mt-3 max-w-xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
export function Input({ label, error, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-ivory/70 font-sans">
          {label}
        </label>
      )}
      <input
        className={`bg-void-700 border ${error ? "border-red-500/50" : "border-white/10"} rounded-sm px-4 py-2.5 text-sm text-ivory placeholder-ivory/30 focus:outline-none focus:border-amber/50 transition-colors ${className}`}
        {...props}
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────
export function Select({ label, error, children, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-ivory/70 font-sans">
          {label}
        </label>
      )}
      <select
        className={`bg-void-700 border ${error ? "border-red-500/50" : "border-white/10"} rounded-sm px-4 py-2.5 text-sm text-ivory focus:outline-none focus:border-amber/50 transition-colors ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}

// ─── Textarea ─────────────────────────────────────────────────────────────────
export function Textarea({ label, error, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-ivory/70 font-sans">
          {label}
        </label>
      )}
      <textarea
        className={`bg-void-700 border ${error ? "border-red-500/50" : "border-white/10"} rounded-sm px-4 py-2.5 text-sm text-ivory placeholder-ivory/30 focus:outline-none focus:border-amber/50 transition-colors resize-vertical ${className}`}
        {...props}
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
export function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative glass-card p-6 max-w-sm w-full"
      >
        <h3 className="font-display text-xl text-ivory mb-2">{title}</h3>
        <p className="text-ivory/60 text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
