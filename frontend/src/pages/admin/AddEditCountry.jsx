// src/pages/admin/AddEditCountry.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import { ArrowLeft, Upload } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { Button, Input, Select, Textarea } from "../../components/ui";

const CONTINENTS = [
  "Africa",
  "Antarctica",
  "Asia",
  "Europe",
  "North America",
  "Oceania",
  "South America",
];

export default function AddEditCountry() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    name: "",
    continent: "",
    description: "",
    flag: "",
    countryCode: "",
    visitedAt: "",
    isFeatured: false,
    "coordinates.lat": "",
    "coordinates.lng": "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Load existing data when editing
  const { data: existing } = useQuery(
    ["country-edit", id],
    () => api.get(`/countries/${id}`).then((r) => r.data.data),
    { enabled: isEdit },
  );

  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.name || "",
        continent: existing.continent || "",
        description: existing.description || "",
        flag: existing.flag || "",
        countryCode: existing.countryCode || "",
        visitedAt: existing.visitedAt ? existing.visitedAt.split("T")[0] : "",
        isFeatured: existing.isFeatured || false,
        "coordinates.lat": existing.coordinates?.lat || "",
        "coordinates.lng": existing.coordinates?.lng || "",
      });
      setImagePreview(existing.coverImage || "");
    }
  }, [existing]);

  const mutation = useMutation(
    async () => {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append("coverImage", imageFile);

      if (isEdit) {
        return api.put(`/countries/${id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      return api.post("/countries", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    {
      onSuccess: () => {
        toast.success(isEdit ? "Country updated!" : "Country added!");
        navigate("/admin/countries");
      },
      onError: (err) =>
        toast.error(err.response?.data?.message || "Save failed"),
    },
  );

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <div className="p-8 max-w-3xl">
      <button
        onClick={() => navigate("/admin/countries")}
        className="flex items-center gap-2 text-sm text-ivory/50 hover:text-ivory mb-6 transition-colors"
      >
        <ArrowLeft size={15} /> Back to Countries
      </button>

      <h1 className="font-display text-3xl font-semibold text-ivory mb-8">
        {isEdit ? "Edit Country" : "Add New Country"}
      </h1>

      <div className="glass-card p-6 flex flex-col gap-5">
        {/* Cover image upload */}
        <div>
          <label className="text-sm font-medium text-ivory/70 font-sans block mb-2">
            Cover Image
          </label>
          <div
            className="border-2 border-dashed border-white/10 rounded-lg overflow-hidden cursor-pointer hover:border-amber/40 transition-colors"
            onClick={() => document.getElementById("img-upload").click()}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="preview"
                className="w-full h-40 object-cover"
              />
            ) : (
              <div className="h-40 flex flex-col items-center justify-center gap-2 text-ivory/30">
                <Upload size={24} />
                <span className="text-sm font-sans">Click to upload image</span>
              </div>
            )}
          </div>
          <input
            id="img-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImage}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Country Name *"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Japan"
            required
          />
          <Select
            label="Continent *"
            value={form.continent}
            onChange={(e) => set("continent", e.target.value)}
            required
          >
            <option value="">Select continent</option>
            {CONTINENTS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
          <Input
            label="Flag Emoji"
            value={form.flag}
            onChange={(e) => set("flag", e.target.value)}
            placeholder="🇯🇵"
          />
          <Input
            label="Country Code"
            value={form.countryCode}
            onChange={(e) => set("countryCode", e.target.value.toUpperCase())}
            placeholder="JP"
            maxLength={3}
          />
          <Input
            label="Date Visited *"
            type="date"
            value={form.visitedAt}
            onChange={(e) => set("visitedAt", e.target.value)}
          />
          <div className="flex items-center gap-3 mt-2">
            <input
              type="checkbox"
              id="featured"
              checked={form.isFeatured}
              onChange={(e) => set("isFeatured", e.target.checked)}
              className="accent-amber w-4 h-4"
            />
            <label
              htmlFor="featured"
              className="text-sm text-ivory/70 font-sans"
            >
              Feature on homepage
            </label>
          </div>
        </div>

        <Textarea
          label="Description *"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Describe your experience in this country..."
          rows={4}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Latitude (optional)"
            type="number"
            value={form["coordinates.lat"]}
            onChange={(e) => set("coordinates.lat", e.target.value)}
            placeholder="35.6762"
          />
          <Input
            label="Longitude (optional)"
            type="number"
            value={form["coordinates.lng"]}
            onChange={(e) => set("coordinates.lng", e.target.value)}
            placeholder="139.6503"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            onClick={() => mutation.mutate()}
            disabled={
              mutation.isLoading ||
              !form.name ||
              !form.continent ||
              !form.description
            }
          >
            {mutation.isLoading
              ? "Saving..."
              : isEdit
                ? "Update Country"
                : "Add Country"}
          </Button>
          <Button variant="ghost" onClick={() => navigate("/admin/countries")}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
