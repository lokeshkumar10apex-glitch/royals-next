"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm]       = useState({ username: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      username: form.username,
      password: form.password,
      redirect: false,
    });

    if (res?.ok) {
      router.push("/admin");
    } else {
      setError("Invalid username or password.");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#1A0A0A" }}
    >
      <div
        className="w-full max-w-sm p-8 rounded-3xl"
        style={{
          background: "rgba(245,230,211,0.05)",
          border: "1px solid rgba(201,162,39,0.2)",
          backdropFilter: "blur(12px)",
        }}
      >
        <h1
          className="text-3xl font-bold text-center mb-2"
          style={{ color: "#FFFFF0", fontFamily: "Georgia, serif" }}
        >
          Admin Login
        </h1>
        <p className="text-center text-sm mb-8" style={{ color: "#F5E6D3", opacity: 0.5 }}>
          Royal Caterers Dashboard
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#C9A227" }}>
              Username
            </label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
              required
              autoComplete="username"
              className="w-full px-4 py-3 rounded-xl outline-none text-sm"
              style={{ background: "rgba(245,230,211,0.06)", border: "1px solid rgba(201,162,39,0.2)", color: "#F5E6D3" }}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#C9A227" }}>
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 rounded-xl outline-none text-sm"
              style={{ background: "rgba(245,230,211,0.06)", border: "1px solid rgba(201,162,39,0.2)", color: "#F5E6D3" }}
            />
          </div>

          {error && (
            <p className="text-xs px-3 py-2 rounded-lg" style={{ background: "rgba(128,0,32,0.2)", color: "#F5A0A0", border: "1px solid rgba(128,0,32,0.4)" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-sm transition hover:opacity-90 disabled:opacity-60 mt-2"
            style={{ background: "linear-gradient(135deg,#800020,#C9A227)", color: "#FFFFF0" }}
          >
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
