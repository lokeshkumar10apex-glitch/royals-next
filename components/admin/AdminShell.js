"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { FaNewspaper, FaTags, FaPlus, FaSignOutAlt } from "react-icons/fa";
import AdminDashboard from "./AdminDashboard";
import CategoryManager from "./CategoryManager";

const NAV = [
  { key: "posts",      label: "Posts",      icon: FaNewspaper },
  { key: "categories", label: "Categories", icon: FaTags      },
];

export default function AdminShell({ initialPosts = [] }) {
  const [active, setActive] = useState("posts");

  return (
    <div className="min-h-screen flex" style={{ background: "#1A0A0A" }}>

      {/* ── Sidebar ── */}
      <aside
        className="hidden md:flex flex-col flex-shrink-0"
        style={{
          width: "210px",
          background: "rgba(245,230,211,0.03)",
          borderRight: "1px solid rgba(201,162,39,0.15)",
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        {/* Brand */}
        <div className="px-5 py-6" style={{ borderBottom: "1px solid rgba(201,162,39,0.12)" }}>
          <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#C9A227" }}>Royal Caterers</p>
          <p className="text-xs mt-0.5" style={{ color: "#F5E6D3", opacity: 0.4 }}>Admin Panel</p>
        </div>

        {/* Nav tabs */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: active === key
                  ? "linear-gradient(135deg, rgba(128,0,32,0.5), rgba(201,162,39,0.25))"
                  : "transparent",
                border: active === key
                  ? "1px solid rgba(201,162,39,0.3)"
                  : "1px solid transparent",
                color: active === key ? "#FFFFF0" : "#F5E6D3",
                opacity: active === key ? 1 : 0.55,
              }}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-4 space-y-2" style={{ borderTop: "1px solid rgba(201,162,39,0.12)" }}>
          <a
            href="/admin/new"
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#800020,#C9A227)", color: "#FFFFF0" }}
          >
            <FaPlus size={12} /> New Post
          </a>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition hover:opacity-80"
            style={{
              background: "rgba(245,230,211,0.04)",
              border: "1px solid rgba(201,162,39,0.15)",
              color: "#F5E6D3",
              opacity: 0.7,
            }}
          >
            <FaSignOutAlt size={12} /> Logout
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar ── */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3"
        style={{
          background: "rgba(26,10,10,0.95)",
          borderBottom: "1px solid rgba(201,162,39,0.15)",
          backdropFilter: "blur(12px)",
        }}
      >
        <span className="text-sm font-bold" style={{ color: "#C9A227" }}>RC Admin</span>
        <div className="flex gap-2">
          {NAV.map(({ key, label }) => (
            <button key={key} onClick={() => setActive(key)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{
                background: active === key ? "rgba(201,162,39,0.2)" : "rgba(245,230,211,0.06)",
                border: `1px solid ${active === key ? "rgba(201,162,39,0.4)" : "rgba(201,162,39,0.15)"}`,
                color: active === key ? "#C9A227" : "#F5E6D3",
              }}>
              {label}
            </button>
          ))}
        </div>
        <a href="/admin/new"
          className="text-xs px-3 py-1.5 rounded-lg font-semibold"
          style={{ background: "linear-gradient(135deg,#800020,#C9A227)", color: "#FFFFF0" }}>
          + New
        </a>
      </div>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-auto">
        {/* Posts section */}
        <div style={{ display: active === "posts" ? "block" : "none" }}>
          <AdminDashboard initialPosts={initialPosts} hideHeader />
        </div>

        {/* Categories section */}
        {active === "categories" && (
          <div className="px-6 py-10 max-w-2xl">
            <div className="mb-6">
              <h1 className="text-2xl font-bold" style={{ color: "#FFFFF0", fontFamily: "Georgia, serif" }}>
                Categories
              </h1>
              <p className="text-sm mt-1" style={{ color: "#F5E6D3", opacity: 0.45 }}>
                Blog post categories manage karo
              </p>
            </div>
            <CategoryManager />
          </div>
        )}
      </main>

    </div>
  );
}
