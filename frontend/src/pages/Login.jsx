// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === "admin" ? "/admin" : "/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-void-900 flex items-center justify-center px-4">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,168,83,0.05)_0%,transparent_70%)]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="glass-card p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <Compass className="text-amber mb-3" size={32} />
            <h1 className="font-display text-2xl font-semibold text-ivory">
              Welcome Back
            </h1>
            <p className="text-ivory/40 text-sm font-sans mt-1">
              Sign in to manage your travels
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ivory/70 font-sans">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="bg-void-700 border border-white/10 rounded-sm px-4 py-2.5 text-sm text-ivory placeholder-ivory/30 focus:outline-none focus:border-amber/50 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ivory/70 font-sans">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-void-700 border border-white/10 rounded-sm px-4 py-2.5 pr-10 text-sm text-ivory placeholder-ivory/30 focus:outline-none focus:border-amber/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ivory/40 hover:text-ivory/70"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3 bg-amber text-void-900 font-sans font-semibold text-sm rounded-sm hover:bg-amber-light transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-ivory/30 text-xs font-sans mt-6">
            First time?{" "}
            <span className="text-amber/70">
              The first registered account becomes admin.
            </span>
          </p>
        </div>

        <p className="text-center mt-6">
          <Link
            to="/"
            className="text-ivory/30 text-sm hover:text-ivory/60 transition-colors font-sans"
          >
            ← Back to site
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
