// src/pages/admin/AddEditBlog.jsx
// Rich blog editor using Tiptap

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import {
  ArrowLeft,
  Upload,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading2,
  Link as LinkIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { Button, Input, Select, Textarea } from "../../components/ui";

// Tiptap toolbar button
function ToolbarBtn({ onClick, active, children, title }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`p-2 rounded transition-colors text-sm ${
        active
          ? "bg-amber/20 text-amber"
          : "text-ivory/50 hover:text-ivory hover:bg-white/5"
      }`}
    >
      {children}
    </button>
  );
}

export default function AddEditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    country: "",
    place: "",
    tags: "",
    status: "draft",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Begin your story here..." }),
      Link.configure({ openOnClick: false }),
    ],
    editorProps: { attributes: { class: "prose-travel focus:outline-none" } },
  });

  // Load countries and places
  const { data: countries } = useQuery("countries-for-blog", () =>
    api.get("/countries").then((r) => r.data.data),
  );
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const { data: places } = useQuery(
    ["places-for-blog", selectedCountryId],
    () =>
      selectedCountryId
        ? api
            .get(`/places?country=${selectedCountryId}`)
            .then((r) => r.data.data)
        : Promise.resolve([]),
    { enabled: !!selectedCountryId },
  );

  // Load existing post if editing
  const { data: existing } = useQuery(
    ["blog-edit", id],
    () => api.get(`/blogs/${id}`).then((r) => r.data.data),
    { enabled: isEdit },
  );

  useEffect(() => {
    if (existing && editor) {
      setForm({
        title: existing.title || "",
        excerpt: existing.excerpt || "",
        country: existing.country?._id || "",
        place: existing.place?._id || "",
        tags: existing.tags?.join(", ") || "",
        status: existing.status || "draft",
      });
      setSelectedCountryId(existing.country?._id || "");
      setImagePreview(existing.coverImage || "");
      editor.commands.setContent(existing.content || "");
    }
  }, [existing, editor]);

  const mutation = useMutation(
    async () => {
      const content = editor?.getHTML() || "";
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("excerpt", form.excerpt);
      fd.append("country", form.country);
      fd.append("place", form.place);
      fd.append("tags", form.tags);
      fd.append("status", form.status);
      fd.append("content", content);
      if (imageFile) fd.append("coverImage", imageFile);

      if (isEdit)
        return api.put(`/blogs/${id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      return api.post("/blogs", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    {
      onSuccess: () => {
        toast.success(isEdit ? "Post updated!" : "Post created!");
        navigate("/admin/blogs");
      },
      onError: (e) => toast.error(e.response?.data?.message || "Save failed"),
    },
  );

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const addLink = () => {
    const url = window.prompt("URL:");
    if (url) editor?.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="p-8 max-w-4xl">
      <button
        onClick={() => navigate("/admin/blogs")}
        className="flex items-center gap-2 text-sm text-ivory/50 hover:text-ivory mb-6 transition-colors"
      >
        <ArrowLeft size={15} /> Back to Blog Posts
      </button>

      <h1 className="font-display text-3xl font-semibold text-ivory mb-8">
        {isEdit ? "Edit Post" : "New Blog Post"}
      </h1>

      <div className="flex flex-col gap-5">
        {/* Title */}
        <Input
          label="Post Title *"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="An Unforgettable Night in Kyoto..."
          className="text-lg"
        />

        {/* Cover image */}
        <div>
          <label className="text-sm font-medium text-ivory/70 font-sans block mb-2">
            Cover Image
          </label>
          <div
            className="border-2 border-dashed border-white/10 rounded-lg overflow-hidden cursor-pointer hover:border-amber/40 transition-colors"
            onClick={() => document.getElementById("blog-img").click()}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                className="w-full h-48 object-cover"
                alt="cover"
              />
            ) : (
              <div className="h-48 flex flex-col items-center justify-center gap-2 text-ivory/30">
                <Upload size={24} />
                <span className="text-sm">Click to upload cover image</span>
              </div>
            )}
          </div>
          <input
            id="blog-img"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files[0];
              if (f) {
                setImageFile(f);
                setImagePreview(URL.createObjectURL(f));
              }
            }}
          />
        </div>

        {/* Meta row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Country"
            value={form.country}
            onChange={(e) => {
              set("country", e.target.value);
              setSelectedCountryId(e.target.value);
            }}
          >
            <option value="">Select country</option>
            {countries?.map((c) => (
              <option key={c._id} value={c._id}>
                {c.flag} {c.name}
              </option>
            ))}
          </Select>
          <Select
            label="Place (optional)"
            value={form.place}
            onChange={(e) => set("place", e.target.value)}
          >
            <option value="">Select place</option>
            {places?.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </Select>
          <Select
            label="Status"
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </Select>
        </div>

        <Input
          label="Tags (comma-separated)"
          value={form.tags}
          onChange={(e) => set("tags", e.target.value)}
          placeholder="japan, food, culture"
        />

        <Textarea
          label="Excerpt (shown in post cards)"
          value={form.excerpt}
          onChange={(e) => set("excerpt", e.target.value)}
          rows={2}
          placeholder="A brief teaser for this post..."
        />

        {/* Rich text editor */}
        <div>
          <label className="text-sm font-medium text-ivory/70 font-sans block mb-2">
            Content *
          </label>
          <div className="border border-white/10 rounded-lg overflow-hidden bg-void-700 focus-within:border-amber/50 transition-colors">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 px-2 py-2 border-b border-white/10 bg-void-800">
              <ToolbarBtn
                onClick={() => editor?.chain().focus().toggleBold().run()}
                active={editor?.isActive("bold")}
                title="Bold"
              >
                <Bold size={16} />
              </ToolbarBtn>
              <ToolbarBtn
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                active={editor?.isActive("italic")}
                title="Italic"
              >
                <Italic size={16} />
              </ToolbarBtn>
              <ToolbarBtn
                onClick={() =>
                  editor?.chain().focus().toggleHeading({ level: 2 }).run()
                }
                active={editor?.isActive("heading")}
                title="Heading"
              >
                <Heading2 size={16} />
              </ToolbarBtn>
              <ToolbarBtn
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                active={editor?.isActive("bulletList")}
                title="Bullet list"
              >
                <List size={16} />
              </ToolbarBtn>
              <ToolbarBtn
                onClick={() =>
                  editor?.chain().focus().toggleOrderedList().run()
                }
                active={editor?.isActive("orderedList")}
                title="Numbered list"
              >
                <ListOrdered size={16} />
              </ToolbarBtn>
              <ToolbarBtn
                onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                active={editor?.isActive("blockquote")}
                title="Quote"
              >
                <Quote size={16} />
              </ToolbarBtn>
              <ToolbarBtn
                onClick={addLink}
                active={editor?.isActive("link")}
                title="Add link"
              >
                <LinkIcon size={16} />
              </ToolbarBtn>
            </div>

            {/* Editor */}
            <div className="px-4 py-4 min-h-[350px]">
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isLoading || !form.title}
          >
            {mutation.isLoading
              ? "Saving..."
              : isEdit
                ? "Update Post"
                : form.status === "published"
                  ? "Publish Post"
                  : "Save Draft"}
          </Button>
          <Button variant="ghost" onClick={() => navigate("/admin/blogs")}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
