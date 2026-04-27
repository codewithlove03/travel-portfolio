// src/pages/admin/ManagePlaces.jsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Plus, Pencil, Trash2, X, Save, Upload } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import {
  Button,
  Input,
  Select,
  Textarea,
  PageLoader,
  ConfirmDialog,
  EmptyState,
} from "../../components/ui";

function PlaceForm({ countries, onSave, onCancel, initial = {} }) {
  const [form, setForm] = useState({
    name: initial.name || "",
    country: initial.country?._id || initial.country || "",
    description: initial.description || "",
    tags: initial.tags?.join(", ") || "",
    visitedAt: initial.visitedAt ? initial.visitedAt.split("T")[0] : "",
    rating: initial.rating || "",
    "coordinates.lat": initial.coordinates?.lat || "",
    "coordinates.lng": initial.coordinates?.lng || "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(initial.coverImage || "");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const submit = () => {
    if (!form.name || !form.country) {
      toast.error("Name and country required");
      return;
    }
    const fd = new FormData();
    // Convert tags string to array for backend
    const submitData = { ...form, tags: form.tags };
    Object.entries(submitData).forEach(([k, v]) => fd.append(k, v));
    if (imageFile) fd.append("coverImage", imageFile);
    onSave(fd);
  };

  return (
    <div className="glass-card p-5 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Input
          label="Place Name *"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="e.g. Tokyo"
        />
        <Select
          label="Country *"
          value={form.country}
          onChange={(e) => set("country", e.target.value)}
        >
          <option value="">Select country</option>
          {countries?.map((c) => (
            <option key={c._id} value={c._id}>
              {c.flag} {c.name}
            </option>
          ))}
        </Select>
        <Input
          label="Date Visited"
          type="date"
          value={form.visitedAt}
          onChange={(e) => set("visitedAt", e.target.value)}
        />
        <Input
          label="Rating (1-5)"
          type="number"
          min="1"
          max="5"
          value={form.rating}
          onChange={(e) => set("rating", e.target.value)}
        />
        <Input
          label="Tags (comma-separated)"
          value={form.tags}
          onChange={(e) => set("tags", e.target.value)}
          placeholder="beach, food, culture"
          className="md:col-span-2"
        />
      </div>
      <Textarea
        label="Description"
        value={form.description}
        onChange={(e) => set("description", e.target.value)}
        rows={3}
        className="mb-4"
      />

      {/* Image upload */}
      <div className="mb-4">
        <label className="text-sm font-medium text-ivory/70 block mb-2">
          Cover Image
        </label>
        <div className="flex items-center gap-3">
          {preview && (
            <img
              src={preview}
              className="w-16 h-16 rounded object-cover"
              alt=""
            />
          )}
          <label className="cursor-pointer flex items-center gap-2 text-sm text-ivory/60 hover:text-ivory border border-white/10 px-3 py-2 rounded-sm transition-colors">
            <Upload size={14} /> Choose image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImage}
            />
          </label>
        </div>
      </div>

      <div className="flex gap-3">
        <Button size="sm" onClick={submit}>
          <Save size={14} /> Save
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel}>
          <X size={14} /> Cancel
        </Button>
      </div>
    </div>
  );
}

export default function ManagePlaces() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { data: places, isLoading } = useQuery("admin-places", () =>
    api.get("/places").then((r) => r.data.data),
  );
  const { data: countries } = useQuery("countries-for-places", () =>
    api.get("/countries").then((r) => r.data.data),
  );

  const createMutation = useMutation(
    (fd) =>
      api.post("/places", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    {
      onSuccess: () => {
        toast.success("Place added!");
        qc.invalidateQueries("admin-places");
        setShowForm(false);
      },
      onError: (e) => toast.error(e.response?.data?.message || "Failed"),
    },
  );
  const updateMutation = useMutation(
    ({ id, fd }) =>
      api.put(`/places/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    {
      onSuccess: () => {
        toast.success("Updated!");
        qc.invalidateQueries("admin-places");
        setEditItem(null);
      },
      onError: (e) => toast.error(e.response?.data?.message || "Failed"),
    },
  );
  const deleteMutation = useMutation((id) => api.delete(`/places/${id}`), {
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries("admin-places");
    },
  });

  return (
    <div className="p-8 max-w-10xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-amber mb-1">
            Manage
          </p>
          <h1 className="font-display text-3xl font-semibold text-ivory">
            Places
          </h1>
        </div>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setEditItem(null);
          }}
        >
          <Plus size={16} /> Add Place
        </Button>
      </div>

      {showForm && !editItem && (
        <PlaceForm
          countries={countries}
          onSave={(fd) => createMutation.mutate(fd)}
          onCancel={() => setShowForm(false)}
        />
      )}

      {isLoading ? (
        <PageLoader />
      ) : places?.length === 0 ? (
        <EmptyState
          title="No places yet"
          description="Add cities and destinations within your countries."
        />
      ) : (
        <div className="glass-card overflow-hidden mt-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-ivory/40 font-mono text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3">Place</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">
                  Country
                </th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">
                  Tags
                </th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {places.map((place) => (
                <>
                  <tr
                    key={place._id}
                    className="border-b border-white/5 hover:bg-white/3 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {place.coverImage ? (
                          <img
                            src={place.coverImage}
                            className="w-8 h-8 rounded object-cover"
                            alt=""
                          />
                        ) : (
                          <div className="w-8 h-8 rounded bg-void-600" />
                        )}
                        <span className="font-sans text-ivory/90">
                          {place.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-ivory/50 font-mono text-xs">
                      {place.country?.flag} {place.country?.name}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {place.tags?.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="text-xs bg-void-600 text-ivory/50 px-1.5 py-0.5 rounded-sm font-mono"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditItem(place);
                            setShowForm(false);
                          }}
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setDeleteId(place._id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                  {editItem?._id === place._id && (
                    <tr key={`edit-${place._id}`}>
                      <td colSpan={4} className="px-4 pb-4">
                        <PlaceForm
                          countries={countries}
                          initial={editItem}
                          onSave={(fd) =>
                            updateMutation.mutate({ id: editItem._id, fd })
                          }
                          onCancel={() => setEditItem(null)}
                        />
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Place"
        message="This will permanently delete this place."
        onConfirm={() => {
          deleteMutation.mutate(deleteId);
          setDeleteId(null);
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
