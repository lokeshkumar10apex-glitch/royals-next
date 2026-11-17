"use client";

import { useState, useMemo } from "react";
import { signOut } from "next-auth/react";
import {
  FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash,
  FaSignOutAlt, FaSearch, FaTimes, FaFilter,
} from "react-icons/fa";

const cardStyle = {
  background: "rgba(245,230,211,0.04)",
  border: "1px solid rgba(201,162,39,0.18)",
};

const inputStyle = {
  background: "rgba(245,230,211,0.06)",
  border: "1px solid rgba(201,162,39,0.2)",
  color: "#F5E6D3",
  outline: "none",
  borderRadius: "10px",
  padding: "8px 12px",
  fontSize: "13px",
  width: "100%",
};

const EMPTY_FILTERS = {
  search:    "",   // title or slug search
  status:    "all", // all | published | draft
  dateMode:  "none", // none | specific | range
  dateExact: "",
  dateFrom:  "",
  dateTo:    "",
};

export default function AdminDashboard({ initialPosts = [], hideHeader = false }) {
  const [posts, setPosts]       = useState(initialPosts);
  const [loading, setLoading]   = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [filters, setFilters]   = useState(EMPTY_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [perPage, setPerPage]   = useState(10);
  const [page, setPage]         = useState(1);

  // Pending date state — only applied when "Apply Filter" is clicked
  const [pendingDate, setPendingDate] = useState({
    dateMode:  "none",
    dateExact: "",
    dateFrom:  "",
    dateTo:    "",
  });

  const fetchPosts = async () => {
    setLoading(true);
    const res  = await fetch("/api/posts?all=1");
    const data = await res.json();
    if (data.success) setPosts(data.posts);
    setLoading(false);
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    await fetchPosts();
    setDeleting(null);
  };

  const handleTogglePublish = async (post) => {
    await fetch(`/api/posts/${post._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !post.published }),
    });
    await fetchPosts();
  };

  const setFilter = (key, val) => { setFilters((f) => ({ ...f, [key]: val })); setPage(1); }

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setPendingDate({ dateMode: "none", dateExact: "", dateFrom: "", dateTo: "" });
    setPage(1);
  }

  // Apply pending date filter
  const applyDateFilter = () => {
    setFilters((f) => ({
      ...f,
      dateMode:  pendingDate.dateMode,
      dateExact: pendingDate.dateExact,
      dateFrom:  pendingDate.dateFrom,
      dateTo:    pendingDate.dateTo,
    }));
    setPage(1);
  };

  // Reset only date filter
  const resetDateFilter = () => {
    setPendingDate({ dateMode: "none", dateExact: "", dateFrom: "", dateTo: "" });
    setFilters((f) => ({ ...f, dateMode: "none", dateExact: "", dateFrom: "", dateTo: "" }));
    setPage(1);
  };

  const setPending = (key, val) => setPendingDate((p) => ({ ...p, [key]: val }));

  const isFilterActive = useMemo(() =>
    filters.search || filters.status !== "all" || filters.dateMode !== "none",
    [filters]
  );

  // ── Client-side filtering ──────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return posts.filter((post) => {
      // Search — title or slug
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        if (!post.title?.toLowerCase().includes(q) && !post.slug?.toLowerCase().includes(q)) return false;
      }

      // Status
      const isScheduled = post.published && post.publishedAt && new Date(post.publishedAt) > new Date();
      const isPublished = post.published && !isScheduled;

      if (filters.status === "published" && !isPublished)  return false;
      if (filters.status === "scheduled" && !isScheduled)  return false;
      if (filters.status === "draft"     &&  post.published) return false;

      // Use publishedAt if available, else createdAt
      const dateField = post.publishedAt || post.createdAt;
      const postDate  = new Date(dateField);

      // Local date string — avoids UTC timezone shift
      const localDateStr = [
        postDate.getFullYear(),
        String(postDate.getMonth() + 1).padStart(2, "0"),
        String(postDate.getDate()).padStart(2, "0"),
      ].join("-");

      if (filters.dateMode === "specific" && filters.dateExact) {
        if (localDateStr !== filters.dateExact) return false;
      }

      if (filters.dateMode === "range") {
        if (filters.dateFrom) {
          const from = new Date(filters.dateFrom);
          from.setHours(0, 0, 0, 0);
          if (postDate < from) return false;
        }
        if (filters.dateTo) {
          const to = new Date(filters.dateTo);
          to.setHours(23, 59, 59, 999);
          if (postDate > to) return false;
        }
      }

      return true;
    });
  }, [posts, filters]);

  // ── Pagination ─────────────────────────────────────────────────────────────
  const totalPages  = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage    = Math.min(page, totalPages);
  const paginated   = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const pageWindow  = () => {
    const delta = 2;
    const range = [];
    for (let i = Math.max(1, safePage - delta); i <= Math.min(totalPages, safePage + delta); i++) range.push(i);
    return range;
  };

  return (
    <div className="min-h-screen px-4 py-10" style={{ background: "#1A0A0A" }}>
      <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
        {!hideHeader && (
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: "#FFFFF0", fontFamily: "Georgia, serif" }}>
                Blog Dashboard
              </h1>
              <p className="text-sm mt-1" style={{ color: "#F5E6D3", opacity: 0.5 }}>
                Royal Caterers Admin
              </p>
            </div>
            <div className="flex gap-3">
              <a href="/admin/new"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#800020,#C9A227)", color: "#FFFFF0" }}>
                <FaPlus size={13} /> New Post
              </a>
              <button onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition hover:opacity-80"
                style={{ background: "rgba(245,230,211,0.06)", border: "1px solid rgba(201,162,39,0.2)", color: "#F5E6D3" }}>
                <FaSignOutAlt size={13} /> Logout
              </button>
            </div>
          </div>
        )}

        {/* Dashboard title when sidebar is showing */}
        {hideHeader && (
          <div className="mb-8">
            <h1 className="text-2xl font-bold" style={{ color: "#FFFFF0", fontFamily: "Georgia, serif" }}>
              Posts
            </h1>
            <p className="text-sm mt-1" style={{ color: "#F5E6D3", opacity: 0.45 }}>
              Sare blog posts manage karo
            </p>
          </div>
        )}

        {/* ── Stats ── */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Posts", value: posts.length },
            { label: "Published",   value: posts.filter((p) => p.published && !(p.publishedAt && new Date(p.publishedAt) > new Date())).length },
            { label: "Scheduled",   value: posts.filter((p) => p.published && p.publishedAt && new Date(p.publishedAt) > new Date()).length, color: "#93c5fd" },
            { label: "Drafts",      value: posts.filter((p) => !p.published).length },
          ].map((stat) => (
            <div key={stat.label} className="p-5 rounded-2xl text-center" style={cardStyle}>
              <div className="text-3xl font-black mb-1" style={{ color: stat.color || "#C9A227" }}>{stat.value}</div>
              <div className="text-xs" style={{ color: "#F5E6D3", opacity: 0.6 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── Search + Filter Bar ── */}
        <div className="mb-4 space-y-3">

          {/* Row 1: Search + Filter toggle */}
          <div className="flex gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <FaSearch size={12} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#C9A227", opacity: 0.6 }} />
              <input
                type="text"
                placeholder="Search by title or slug…"
                value={filters.search}
                onChange={(e) => setFilter("search", e.target.value)}
                style={{ ...inputStyle, paddingLeft: "32px" }}
              />
              {filters.search && (
                <button onClick={() => setFilter("search", "")}
                  style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#F5E6D3", opacity: 0.4, background: "none", border: "none", cursor: "pointer" }}>
                  <FaTimes size={11} />
                </button>
              )}
            </div>

            {/* Status filter */}
            <select
              value={filters.status}
              onChange={(e) => setFilter("status", e.target.value)}
              style={{ ...inputStyle, width: "150px", cursor: "pointer" }}
            >
              <option value="all"       style={{ background: "#1A0A0A" }}>All Status</option>
              <option value="published" style={{ background: "#1A0A0A" }}>Published</option>
              <option value="scheduled" style={{ background: "#1A0A0A" }}>Scheduled</option>
              <option value="draft"     style={{ background: "#1A0A0A" }}>Drafts</option>
            </select>

            {/* Filter toggle button */}
            <button
              onClick={() => setShowFilters((s) => !s)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition hover:opacity-80"
              style={{
                background: showFilters ? "rgba(201,162,39,0.15)" : "rgba(245,230,211,0.06)",
                border: `1px solid ${showFilters ? "rgba(201,162,39,0.4)" : "rgba(201,162,39,0.2)"}`,
                color: showFilters ? "#C9A227" : "#F5E6D3",
              }}
            >
              <FaFilter size={12} /> Date Filter
            </button>

            {/* Clear all */}
            {isFilterActive && (
              <button onClick={clearFilters}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs transition hover:opacity-80"
                style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171" }}>
                <FaTimes size={10} /> Clear
              </button>
            )}
          </div>

          {/* Row 2: Date filter panel */}
          {showFilters && (
            <div className="p-4 rounded-xl space-y-3" style={{ background: "rgba(201,162,39,0.05)", border: "1px solid rgba(201,162,39,0.15)" }}>
              <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#C9A227" }}>
                Date Filter
              </p>

              {/* Mode selector */}
              <div className="flex gap-2">
                {[
                  { val: "none",     label: "No Date Filter" },
                  { val: "specific", label: "Specific Date" },
                  { val: "range",    label: "Date Range" },
                ].map((m) => (
                  <button key={m.val}
                    onClick={() => setPending("dateMode", m.val)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition hover:opacity-80"
                    style={{
                      background: pendingDate.dateMode === m.val ? "rgba(201,162,39,0.2)" : "rgba(245,230,211,0.05)",
                      border: `1px solid ${pendingDate.dateMode === m.val ? "rgba(201,162,39,0.5)" : "rgba(201,162,39,0.15)"}`,
                      color: pendingDate.dateMode === m.val ? "#C9A227" : "#F5E6D3",
                    }}>
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Specific date */}
              {pendingDate.dateMode === "specific" && (
                <div className="flex items-center gap-3">
                  <label className="text-xs" style={{ color: "#F5E6D3", opacity: 0.6, flexShrink: 0 }}>Date:</label>
                  <input type="date" value={pendingDate.dateExact}
                    onChange={(e) => setPending("dateExact", e.target.value)}
                    style={{ ...inputStyle, width: "180px", colorScheme: "dark" }} />
                </div>
              )}

              {/* Date range */}
              {pendingDate.dateMode === "range" && (
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <label className="text-xs" style={{ color: "#F5E6D3", opacity: 0.6, flexShrink: 0 }}>From:</label>
                    <input type="date" value={pendingDate.dateFrom}
                      onChange={(e) => setPending("dateFrom", e.target.value)}
                      style={{ ...inputStyle, width: "170px", colorScheme: "dark" }} />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs" style={{ color: "#F5E6D3", opacity: 0.6, flexShrink: 0 }}>To:</label>
                    <input type="date" value={pendingDate.dateTo}
                      onChange={(e) => setPending("dateTo", e.target.value)}
                      style={{ ...inputStyle, width: "170px", colorScheme: "dark" }} />
                  </div>
                </div>
              )}

              {/* Apply / Reset buttons */}
              <div className="flex items-center gap-3 pt-1">
                <button onClick={applyDateFilter}
                  className="px-5 py-2 rounded-lg text-xs font-semibold transition hover:opacity-80"
                  style={{ background: "linear-gradient(135deg,#800020,#C9A227)", color: "#FFFFF0" }}>
                  ✓ Apply Filter
                </button>
                {filters.dateMode !== "none" && (
                  <button onClick={resetDateFilter}
                    className="px-4 py-2 rounded-lg text-xs font-semibold transition hover:opacity-80"
                    style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171" }}>
                    Reset Date
                  </button>
                )}
                {/* Active filter indicator */}
                {filters.dateMode !== "none" && (
                  <span className="text-xs" style={{ color: "#C9A227", opacity: 0.8 }}>
                    ● Date filter active
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Results count + Per page selector */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs" style={{ color: "#F5E6D3", opacity: 0.45 }}>
            {isFilterActive
              ? <><span style={{ color: "#C9A227" }}>{filtered.length}</span> of {posts.length} posts</>
              : <><span style={{ color: "#C9A227" }}>{posts.length}</span> total posts</>
            }
            {filtered.length > 0 && (
              <span style={{ opacity: 0.6 }}>
                {" "}· Showing {(safePage - 1) * perPage + 1}–{Math.min(safePage * perPage, filtered.length)}
              </span>
            )}
          </p>

          {/* Per page selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: "#F5E6D3", opacity: 0.45 }}>Per page:</span>
            {[10, 20, 50].map((n) => (
              <button key={n} onClick={() => { setPerPage(n); setPage(1); }}
                className="px-3 py-1 rounded-lg text-xs font-semibold transition hover:opacity-80"
                style={{
                  background: perPage === n ? "rgba(201,162,39,0.2)" : "rgba(245,230,211,0.05)",
                  border: `1px solid ${perPage === n ? "rgba(201,162,39,0.5)" : "rgba(201,162,39,0.15)"}`,
                  color: perPage === n ? "#C9A227" : "#F5E6D3",
                }}>
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* ── Posts List ── */}
        {loading ? (
          <p className="text-center py-10" style={{ color: "#F5E6D3", opacity: 0.4 }}>Loading…</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16" style={{ color: "#F5E6D3", opacity: 0.4 }}>
            {isFilterActive ? (
              <>
                <p className="mb-3">No posts match your filters.</p>
                <button onClick={clearFilters} className="text-sm px-4 py-2 rounded-xl"
                  style={{ background: "rgba(201,162,39,0.1)", color: "#C9A227", border: "1px solid rgba(201,162,39,0.2)" }}>
                  Clear filters
                </button>
              </>
            ) : (
              <>
                <p className="mb-4">No posts yet.</p>
                <a href="/admin/new" className="px-6 py-3 rounded-xl text-sm font-semibold"
                  style={{ background: "linear-gradient(135deg,#800020,#C9A227)", color: "#FFFFF0" }}>
                  Write your first post
                </a>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {paginated.map((post) => (
              <div key={post._id} className="flex items-center gap-4 p-4 rounded-2xl" style={cardStyle}>

                {/* Status dot */}
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{
                    background: !post.published
                      ? "#f59e0b"
                      : post.publishedAt && new Date(post.publishedAt) > new Date()
                        ? "#3b82f6"   // blue = scheduled
                        : "#22c55e"   // green = live
                  }}
                  title={
                    !post.published
                      ? "Draft"
                      : post.publishedAt && new Date(post.publishedAt) > new Date()
                        ? "Scheduled"
                        : "Published"
                  }
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: "#FFFFF0" }}>
                    {post.title}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#F5E6D3", opacity: 0.45 }}>
                    <span style={{ color: "#C9A227", opacity: 0.7 }}>#{post.postId}</span>
                    {" · "}{post.slug} · {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-IN")} ·{" "}
                    <span style={{
                      color: !post.published
                        ? "#fcd34d"
                        : post.publishedAt && new Date(post.publishedAt) > new Date()
                          ? "#93c5fd"   // blue = scheduled
                          : "#86efac"   // green = live
                    }}>
                      {!post.published
                        ? "Draft"
                        : post.publishedAt && new Date(post.publishedAt) > new Date()
                          ? `Scheduled · ${new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`
                          : "Published"
                      }
                    </span>
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {post.published && (
                    <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer"
                      className="p-2 rounded-lg transition hover:opacity-80"
                      style={{ color: "#C9A227" }} title="View post">
                      <FaEye size={14} />
                    </a>
                  )}
                  <button onClick={() => handleTogglePublish(post)}
                    className="p-2 rounded-lg transition hover:opacity-80"
                    style={{ color: post.published ? "#fcd34d" : "#86efac" }}
                    title={post.published ? "Unpublish" : "Publish"}>
                    {post.published ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </button>
                  <a href={`/admin/edit/${post._id}`}
                    className="p-2 rounded-lg transition hover:opacity-80"
                    style={{ color: "#C9A227" }} title="Edit">
                    <FaEdit size={14} />
                  </a>
                  <button onClick={() => handleDelete(post._id, post.title)}
                    disabled={deleting === post._id}
                    className="p-2 rounded-lg transition hover:opacity-80 disabled:opacity-40"
                    style={{ color: "#f87171" }} title="Delete">
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {/* Prev */}
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition hover:opacity-80 disabled:opacity-25"
              style={{ background: "rgba(245,230,211,0.06)", border: "1px solid rgba(201,162,39,0.2)", color: "#F5E6D3" }}>
              ← Prev
            </button>

            {/* First */}
            {pageWindow()[0] > 1 && (
              <>
                <button onClick={() => setPage(1)}
                  className="w-8 h-8 rounded-lg text-xs font-semibold transition hover:opacity-80"
                  style={{ background: "rgba(245,230,211,0.06)", border: "1px solid rgba(201,162,39,0.2)", color: "#F5E6D3" }}>
                  1
                </button>
                {pageWindow()[0] > 2 && <span style={{ color: "#F5E6D3", opacity: 0.4 }}>…</span>}
              </>
            )}

            {/* Window */}
            {pageWindow().map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className="w-8 h-8 rounded-lg text-xs font-semibold transition hover:opacity-80"
                style={{
                  background: p === safePage ? "#C9A227" : "rgba(245,230,211,0.06)",
                  border: `1px solid ${p === safePage ? "#C9A227" : "rgba(201,162,39,0.2)"}`,
                  color: p === safePage ? "#1A0A0A" : "#F5E6D3",
                }}>
                {p}
              </button>
            ))}

            {/* Last */}
            {pageWindow()[pageWindow().length - 1] < totalPages && (
              <>
                {pageWindow()[pageWindow().length - 1] < totalPages - 1 && <span style={{ color: "#F5E6D3", opacity: 0.4 }}>…</span>}
                <button onClick={() => setPage(totalPages)}
                  className="w-8 h-8 rounded-lg text-xs font-semibold transition hover:opacity-80"
                  style={{ background: "rgba(245,230,211,0.06)", border: "1px solid rgba(201,162,39,0.2)", color: "#F5E6D3" }}>
                  {totalPages}
                </button>
              </>
            )}

            {/* Next */}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition hover:opacity-80 disabled:opacity-25"
              style={{ background: "rgba(245,230,211,0.06)", border: "1px solid rgba(201,162,39,0.2)", color: "#F5E6D3" }}>
              Next →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
