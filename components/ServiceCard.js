"use client";

export default function ServiceCard({ service }) {
  const { title, desc, Icon } = service;
  return (
    <div
      className="p-8 rounded-3xl text-left transition-all duration-300 hover:-translate-y-1"
      style={{ background: "rgba(245,230,211,0.04)", border: "1px solid rgba(201,162,39,0.18)" }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(201,162,39,0.5)"; e.currentTarget.style.background = "rgba(245,230,211,0.07)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(201,162,39,0.18)"; e.currentTarget.style.background = "rgba(245,230,211,0.04)"; }}
    >
      <div
        className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center"
        style={{ background: "linear-gradient(135deg,#800020,#C9A227)", color: "#FFFFF0" }}
      >
        <Icon size={26} />
      </div>
      <h3 className="text-xl font-bold mb-3" style={{ color: "#FFFFF0", fontFamily: "Georgia, serif" }}>
        {title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: "#F5E6D3", opacity: 0.75 }}>
        {desc}
      </p>
    </div>
  );
}
