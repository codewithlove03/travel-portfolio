// src/pages/admin/ManageCountries.jsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Plus, Pencil, Trash2, Globe } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import {
  Button,
  PageLoader,
  ConfirmDialog,
  EmptyState,
} from "../../components/ui";

export default function ManageCountries() {
  const qc = useQueryClient();
  const [deleteId, setDeleteId] = useState(null);

  const { data, isLoading } = useQuery("admin-countries-list", () =>
    api.get("/countries").then((r) => r.data.data),
  );

  const deleteMutation = useMutation((id) => api.delete(`/countries/${id}`), {
    onSuccess: () => {
      toast.success("Country deleted");
      qc.invalidateQueries("admin-countries-list");
    },
    onError: () => toast.error("Delete failed"),
  });

  return (
    <div className="p-8 max-w-10xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-amber mb-1">
            Manage
          </p>
          <h1 className="font-display text-3xl font-semibold text-ivory">
            Countries
          </h1>
        </div>
        <Link to="/admin/countries/new">
          <Button>
            <Plus size={16} /> Add Country
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <PageLoader />
      ) : data?.length === 0 ? (
        <EmptyState
          title="No countries yet"
          description="Add your first country to get started."
          action={
            <Link to="/admin/countries/new">
              <Button>Add Country</Button>
            </Link>
          }
        />
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-ivory/40 font-mono text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3">Country</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">
                  Continent
                </th>
                <th className="text-left px-4 py-3 hidden md:table-cell">
                  Visited
                </th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">
                  Places
                </th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((country) => (
                <tr
                  key={country._id}
                  className="border-b border-white/5 hover:bg-white/3 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {country.coverImage ? (
                        <img
                          src={country.coverImage}
                          className="w-8 h-8 rounded object-cover"
                          alt=""
                        />
                      ) : (
                        <div className="w-8 h-8 rounded bg-void-600 flex items-center justify-center text-sm">
                          {country.flag || "🌍"}
                        </div>
                      )}
                      <span className="font-sans font-medium text-ivory/90">
                        {country.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-ivory/50 font-mono text-xs">
                    {country.continent}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-ivory/50 font-mono text-xs">
                    {country.visitedAt
                      ? format(new Date(country.visitedAt), "MMM yyyy")
                      : "—"}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-ivory/50 font-mono text-xs">
                    {country.places?.length || 0}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/countries/${country._id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Pencil size={14} />
                        </Button>
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setDeleteId(country._id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Country"
        message="This will permanently delete the country and all its places and blog posts."
        onConfirm={() => {
          deleteMutation.mutate(deleteId);
          setDeleteId(null);
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
