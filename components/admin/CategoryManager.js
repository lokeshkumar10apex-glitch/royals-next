"use client";

import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaCheck, FaTimes } from "react-icons/fa";

const inputStyle = {
  background: "rgba(245,230,211,0.06)",
  border: "1px solid rgba(201,162,39,0.2)",
  color: "#F5E6D3",
  outline: "none",
  borderRadius: "10px",
  padding: "8px 12px",
  fontSize: "13px",
};

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [newName, setNewName]       = useState("");
  const [adding, setAdding]         = useState(false);
  const [editingId, setEditingId]   = useState(null);
  const [editName, setEditName]     = useState("");
  const [error, setError]           = useState("");
  const [success, setSuccess]       = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    const res  = await fetch("/api/categories");
    const data = await res.json();
    if (data.success) setCategories(data.categories);
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const showMsg = (type, msg) => {
    if (type === "error") { setError(msg); setSuccess(""); }
    else { setSuccess(msg); setError(""); }
    setTimeout(() => { setError(""); setSuccess(""); }, 3000);
  };

  // ── Add ──────────────────────────────────────────────────────────────────
  const handleAdd = async () => {
    if (!newName.trim()) return;
    setAdding(true);
    const res  = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    });
    const data = await res.json();
    if (data.success) {
      setNewName("");
      showMsg("success", `"${data.category.name}" add ho gayi ✓`);
      await fetchCategories();
    } else {
      showMsg("error", data.error);
    }
    setAdding(false);
  };

  // ── Rename ───────────────────────────────────────────────────────────────
  const startEdit = (cat) => { setEditingId(cat._id); setEditName(cat.name); setError(""); };
  const cancelEdit = () => { setEditingId(null); setEditName(""); };

  const handleRename = async (id) => {
    if (!editName.trim()) return;
    const res  = await fetch(`/api/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName.trim() }),
    });
    const data = await res.json();
    if (data.success) {
      showMsg("success", `Rename ho gayi ✓`);
      setEditingId(null);
      await fetchCategories();
    } else {
      showMsg("error", data.error);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async (cat) => {
    if (!confirm(`"${cat.name}" delete karna chahte ho?`)) return;
    const res  = await fetch(`/api/categories/${cat._id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      showMsg("success", `"${cat.name}" delete ho gayi ✓`);
      await fetchCategories();
    } else {
      showMsg("error", data.error);
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(245,230,211,0.04)", border: "1px solid rgba(201,162,39,0.18)" }}>

      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(201,162,39,0.15)" }}>
        <div>
          <h2 className="text-lg font-bold" style={{ color: "#FFFFF0", fontFamily: "Georgia, serif" }}>
            Categories
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "#F5E6D3", opacity: 0.45 }}>
            {categories.length} categories
          </p>
        </div>
      </div>

      <div className="p-6 space-y-4">

        {/* Add new */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Nayi category ka naam…"
            style={{ ...inputStyle, flex: 1 }}
          />
          <button
            onClick={handleAdd}
            disabled={adding || !newName.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition hover:opacity-80 disabled:opacity-40"
            style={{ background: "linear-gradient(135deg,#800020,#C9A227)", color: "#FFFFF0", whiteSpace: "nowrap" }}
          >
            <FaPlus size={12} /> {adding ? "Adding…" : "Add"}
          </button>
        </div>

        {/* Messages */}
        {error   && <p className="text-xs px-3 py-2 rounded-lg" style={{ background: "rgba(128,0,32,0.2)", color: "#fca5a5", border: "1px solid rgba(128,0,32,0.3)" }}>{error}</p>}
        {success && <p className="text-xs px-3 py-2 rounded-lg" style={{ background: "rgba(34,197,94,0.1)", color: "#86efac", border: "1px solid rgba(34,197,94,0.2)" }}>{success}</p>}

        {/* List */}
        {loading ? (
          <p className="text-xs text-center py-4" style={{ color: "#F5E6D3", opacity: 0.4 }}>Loading…</p>
        ) : categories.length === 0 ? (
          <p className="text-xs text-center py-4" style={{ color: "#F5E6D3", opacity: 0.4 }}>Koi category nahi hai</p>
        ) : (
          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat._id} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: "rgba(245,230,211,0.03)", border: "1px solid rgba(201,162,39,0.12)" }}>

                {editingId === cat._id ? (
                  /* Edit mode */
                  <>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleRename(cat._id); if (e.key === "Escape") cancelEdit(); }}
                      autoFocus
                      style={{ ...inputStyle, flex: 1, padding: "5px 10px", fontSize: "13px" }}
                    />
                    <button onClick={() => handleRename(cat._id)} title="Save"
                      className="p-1.5 rounded-lg transition hover:opacity-80"
                      style={{ color: "#86efac" }}>
                      <FaCheck size={12} />
                    </button>
                    <button onClick={cancelEdit} title="Cancel"
                      className="p-1.5 rounded-lg transition hover:opacity-80"
                      style={{ color: "#f87171" }}>
                      <FaTimes size={12} />
                    </button>
                  </>
                ) : (
                  /* View mode */
                  <>
                    <div className="flex-1">
                      <span className="text-sm font-semibold" style={{ color: "#FFFFF0" }}>{cat.name}</span>
                      <span className="text-xs ml-2" style={{ color: "#F5E6D3", opacity: 0.35 }}>/{cat.slug}</span>
                    </div>
                    <button onClick={() => startEdit(cat)} title="Rename"
                      className="p-1.5 rounded-lg transition hover:opacity-80"
                      style={{ color: "#C9A227" }}>
                      <FaEdit size={13} />
                    </button>
                    <button onClick={() => handleDelete(cat)} title="Delete"
                      className="p-1.5 rounded-lg transition hover:opacity-80"
                      style={{ color: "#f87171" }}>
                      <FaTrash size={13} />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
