// src/App.jsx
// Root component — sets up all routes, auth provider, and layout

import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Public pages
import Home from "./pages/Home";
import Countries from "./pages/Countries";
import CountryDetail from "./pages/CountryDetail";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";
import Login from "./pages/Login";
import Timeline from "./pages/Timeline";
import MapView    from './pages/MapView'
import BucketList from './pages/BucketList'

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminCountries from "./pages/admin/ManageCountries";
import AdminPlaces from "./pages/admin/ManagePlaces";
import AdminBlogs from "./pages/admin/ManageBlogs";
import AdminAddEditCountry from "./pages/admin/AddEditCountry";
import AdminAddEditBlog from "./pages/admin/AddEditBlog";
import AdminBucket    from './pages/admin/ManageBucket'
import AdminAnalytics from './pages/admin/Analytics'

// Layout
import Layout from "./components/layout/Layout";
import AdminLayout from "./components/layout/AdminLayout";

// ─── Protected Route: Requires Auth + Admin Role ──────────────────────────────
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading)
    return (
      <div className="min-h-screen bg-void-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!isAuthenticated || !isAdmin) return <Navigate to="/login" replace />;
  return children;
};

// ─── App Routes ───────────────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <Routes>
      {/* ── Public Routes ─────────────────────────────────────────────────── */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/countries" element={<Countries />} />
        <Route path="/countries/:slug" element={<CountryDetail />} />
        <Route path="/journal" element={<BlogList />} />
        <Route path="/journal/:slug" element={<BlogPost />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/login" element={<Login />} />
        <Route path="/map"         element={<MapView />} />
        <Route path="/bucket-list" element={<BucketList />} />
      </Route>

      {/* ── Admin Routes ──────────────────────────────────────────────────── */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="countries" element={<AdminCountries />} />
        <Route path="countries/new" element={<AdminAddEditCountry />} />
        <Route path="countries/:id/edit" element={<AdminAddEditCountry />} />
        <Route path="places" element={<AdminPlaces />} />
        <Route path="blogs" element={<AdminBlogs />} />
        <Route path="blogs/new" element={<AdminAddEditBlog />} />
        <Route path="blogs/:id/edit" element={<AdminAddEditBlog />} />
        <Route path="bucket"    element={<AdminBucket />} />
        <Route path="analytics" element={<AdminAnalytics />} />
      </Route>

      {/* ── 404 ───────────────────────────────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
