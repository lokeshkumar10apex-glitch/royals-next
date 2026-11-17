"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaEye } from "react-icons/fa";
import dynamic from "next/dynamic";

// Load editor only on client (TipTap requires browser)
const RichEditor = dynamic(() => import("./RichEditor"), { ssr: false, loading: () => (
  <div style={{ minHeight: 420, display: "flex", alignItems: "center", justifyContent: "center", color: "#F5E6D3", opacity: 0.4, border: "1px solid rgba(201,162,39,0.2)", borderRadius: 16 }}>
    Loading editor…
  </div>
)});

const TAGS = ["Wedding", "Birthday", "Corporate", "Pooja", "General", "Tips", "Jaipur"]; // fallback

const inputCls = "w-full px-4 py-3 rounded-xl outline-none text-sm";
const inputStyle = {
  background: "rgba(245,230,211,0.06)",
  border: "1px solid rgba(201,162,39,0.2)",
  color: "#F5E6D3",
};

const EMPTY = {
  title: "", slug: "", excerpt: "", content: "",
  coverImage: "", tag: "General", keywords: "", published: false,
  metaTitle: "", metaDescription: "",
  publishedAt: new Date().toISOString().slice(0, 16), // datetime-local format
};

export default function PostEditor({ mode, postId, initialPost = null, initialCategories = TAGS }) {
  const router = useRouter();
  const [form, setForm]       = useState(() => {
    // Edit mode — populate from server-fetched post
    if (mode === "edit" && initialPost) {
      const p = initialPost;
      return {
        title:           p.title || "",
        slug:            p.slug  || "",
        excerpt:         p.excerpt || "",
        content:         p.content || "",
        coverImage:      p.coverImage || "",
        tag:             p.tag || "General",
        keywords:        (p.keywords || []).join(", "),
        published:       p.published || false,
        metaTitle:       p.metaTitle || "",
        metaDescription: p.metaDescription || "",
        publishedAt:     p.publishedAt
          ? new Date(p.publishedAt).toISOString().slice(0, 16)
          : (p.createdAt ? new Date(p.createdAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)),
      };
    }
    return EMPTY;
  });
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [tags, setTags]       = useState(initialCategories.length > 0 ? initialCategories : TAGS);

  // Auto-generate slug from title
  const handleTitleChange = (e) => {
    const title = e.target.value;
    const slug  = title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
    setForm((p) => ({ ...p, title, slug }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSave = async (publishOverride) => {
    setError(""); setSuccess("");
    if (!form.title.trim())   return setError("Title zaroori hai.");
    if (!form.content || form.content === "<p></p>") return setError("Content zaroori hai.");

    setSaving(true);

    const payload = {
      ...form,
      keywords: form.keywords.split(",").map((k) => k.trim()).filter(Boolean),
      published: publishOverride !== undefined ? publishOverride : form.published,
    };

    const url    = mode === "edit" ? `/api/posts/${postId}` : "/api/posts";
    const method = mode === "edit" ? "PATCH" : "POST";

    const res  = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (data.success) {
      setSuccess(mode === "edit" ? "Post update ho gaya! ✓" : "Post create ho gaya! ✓");
      // No redirect — stay on the same page
    } else {
      setError(data.error || "Kuch galat ho gaya.");
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen px-4 py-10" style={{ background: "#1A0A0A" }}>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push("/admin")}
            className="flex items-center gap-2 text-sm transition hover:opacity-80"
            style={{ color: "#F5E6D3", opacity: 0.6 }}
          >
            <FaArrowLeft size={12} /> Dashboard
          </button>
          <h1 className="text-2xl font-bold" style={{ color: "#FFFFF0", fontFamily: "Georgia, serif" }}>
            {mode === "edit" ? "Edit Post" : "New Post"}
          </h1>
          <button
            onClick={() => {
              if (form.slug) {
                window.open(`/blog/${form.slug}`, "_blank", "noopener,noreferrer");
              }
            }}
            disabled={!form.slug}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl transition hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: "rgba(245,230,211,0.06)", border: "1px solid rgba(201,162,39,0.2)", color: "#C9A227" }}
            title={form.slug ? `Open /blog/${form.slug}` : "Pehle title daalo"}
          >
            <FaEye size={13} /> Preview
          </button>
        </div>

        {/* ── Editor Form ── */}
        <div className="space-y-6">

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#C9A227" }}>
                Title *
              </label>
              <input
                name="title" value={form.title} onChange={handleTitleChange}
                placeholder="Blog post ka title…"
                className={inputCls} style={{ ...inputStyle, fontSize: "16px", fontWeight: 600 }}
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#C9A227" }}>
                URL Slug <span style={{ color: "#F5E6D3", opacity: 0.35, fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>auto-generated</span>
              </label>
              <input name="slug" value={form.slug} onChange={handleChange} className={inputCls} style={inputStyle} />
              <p className="text-xs mt-1" style={{ color: "#F5E6D3", opacity: 0.35 }}>
                royalcaterers.in/blog/<strong style={{ color: "#C9A227", opacity: 0.7 }}>{form.slug || "aapka-slug"}</strong>
              </p>
            </div>

            {/* Rich Text Editor */}
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#C9A227" }}>
                Content *
              </label>
              <RichEditor
                value={form.content}
                onChange={(html) => setForm((p) => ({ ...p, content: html }))}
              />
            </div>

            {/* Row: Tag */}
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#C9A227" }}>Category</label>
              <select name="tag" value={form.tag} onChange={handleChange} className={inputCls} style={inputStyle}>
                {tags.map((t) => <option key={t} value={t} style={{ background: "#1A0A0A" }}>{t}</option>)}
              </select>
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#C9A227" }}>Cover Image URL</label>
              <input
                name="coverImage" value={form.coverImage} onChange={handleChange}
                placeholder="https://images.unsplash.com/photo-xxx?w=1200"
                className={inputCls} style={inputStyle}
              />
              {form.coverImage && (
                <img src={form.coverImage} alt="cover preview" className="mt-2 h-32 w-full object-cover rounded-xl" style={{ border: "1px solid rgba(201,162,39,0.2)" }} />
              )}
            </div>

            {/* Publish Date */}
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#C9A227" }}>
                Publish Date & Time
              </label>
              <input
                type="datetime-local"
                name="publishedAt"
                value={form.publishedAt}
                onChange={handleChange}
                className={inputCls}
                style={{ ...inputStyle, colorScheme: "dark" }}
              />
              <p className="text-xs mt-1" style={{ color: "#F5E6D3", opacity: 0.3 }}>
                Blog post pe yahi date dikhegi — future date set karne pe post baad mein publish hogi
              </p>
            </div>

            {/* SEO Keywords */}
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#C9A227" }}>
                SEO Keywords <span style={{ color: "#F5E6D3", opacity: 0.35, fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>comma separated</span>
              </label>
              <input
                name="keywords" value={form.keywords} onChange={handleChange}
                placeholder="wedding catering Jaipur, pure veg caterer, event food Rajasthan"
                className={inputCls} style={inputStyle}
              />
            </div>

            {/* SEO — Meta Title & Meta Description */}
            <div className="rounded-2xl p-5 space-y-4" style={{ background: "rgba(201,162,39,0.04)", border: "1px solid rgba(201,162,39,0.15)" }}>
              <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#C9A227" }}>
                🔍 SEO Settings
              </p>

              {/* Meta Title */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#F5E6D3", opacity: 0.7 }}>
                    Meta Title
                  </label>
                  <span className="text-xs" style={{ color: form.metaTitle.length > 60 ? "#f87171" : "#F5E6D3", opacity: 0.5 }}>
                    {form.metaTitle.length}/70
                  </span>
                </div>
                <input
                  name="metaTitle" value={form.metaTitle} onChange={handleChange}
                  placeholder={form.title || "Post title (default agar khali chodo)"}
                  className={inputCls} style={inputStyle}
                  maxLength={70}
                />
                <p className="text-xs mt-1" style={{ color: "#F5E6D3", opacity: 0.3 }}>
                  Khali chodne pe post ka Title use hoga — Google mein tab title dikhta hai
                </p>
              </div>

              {/* Meta Description */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#F5E6D3", opacity: 0.7 }}>
                    Meta Description
                  </label>
                  <span className="text-xs" style={{ color: form.metaDescription.length > 155 ? "#f87171" : "#F5E6D3", opacity: 0.5 }}>
                    {form.metaDescription.length}/160
                  </span>
                </div>
                <textarea
                  name="metaDescription" value={form.metaDescription} onChange={handleChange}
                  rows={3}
                  placeholder={form.excerpt || "Short description (default agar khali chodo)"}
                  className={inputCls + " resize-none"} style={inputStyle}
                  maxLength={160}
                />
                <p className="text-xs mt-1" style={{ color: "#F5E6D3", opacity: 0.3 }}>
                  Khali chodne pe meta description set nahi hoga — Google search snippet mein dikhta hai
                </p>
              </div>

              {/* Google Preview */}
              <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,162,39,0.1)" }}>
                <p className="text-xs mb-2" style={{ color: "#F5E6D3", opacity: 0.4 }}>Google Preview</p>
                <p className="text-sm font-medium mb-0.5" style={{ color: "#8ab4f8" }}>
                  {form.metaTitle || form.title || "Post Title"}
                </p>
                <p className="text-xs" style={{ color: "#34a853" }}>
                  royalcaterers.in/blog/{form.slug || "post-slug"}
                </p>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: "#bdc1c6", opacity: 0.9 }}>
                  {(form.metaDescription || "").slice(0, 160)}
                </p>
              </div>
            </div>

            {/* Error / Success */}
            {error   && <p className="text-sm px-4 py-3 rounded-xl" style={{ background: "rgba(128,0,32,0.2)", color: "#F5A0A0", border: "1px solid rgba(128,0,32,0.4)" }}>{error}</p>}
            {success && <p className="text-sm px-4 py-3 rounded-xl" style={{ background: "rgba(34,197,94,0.1)", color: "#86efac", border: "1px solid rgba(34,197,94,0.3)" }}>{success}</p>}

            {/* Buttons */}
            <div className="flex gap-3 pb-6">
              <button
                onClick={() => handleSave(false)}
                disabled={saving}
                className="flex-1 py-3.5 rounded-xl font-semibold text-sm transition hover:opacity-80 disabled:opacity-50"
                style={{ background: "rgba(245,230,211,0.07)", border: "1px solid rgba(201,162,39,0.3)", color: "#F5E6D3" }}
              >
                {saving ? "Saving…" : "💾 Save as Draft"}
              </button>
              <button
                onClick={() => handleSave(true)}
                disabled={saving}
                className="flex-1 py-3.5 rounded-xl font-semibold text-sm transition hover:opacity-90 disabled:opacity-50"
                style={{ background: "linear-gradient(135deg,#800020,#C9A227)", color: "#FFFFF0" }}
              >
                {saving ? "Publishing…" : form.published ? "🔄 Update Post" : "🚀 Publish Post"}
              </button>
            </div>

          </div>

      </div>
    </div>
  );
}
