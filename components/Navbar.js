"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const navLinks = [
  { label: "Home",     hash: "#home" },
  { label: "About",    hash: "#about" },
  { label: "Services", hash: "#services" },
  { label: "Gallery",  hash: "#gallery" },
];

export default function Navbar() {
  const router   = useRouter();
  const pathname = usePathname();

  const handleSectionClick = (e, hash) => {
    e.preventDefault();
    if (pathname === "/") {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/");
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 120);
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg border-b"
      style={{ background: "rgba(26,10,10,0.85)", borderColor: "rgba(201,162,39,0.25)" }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
        <Link
          href="/"
          className="text-lg md:text-2xl font-bold tracking-wide shrink-0"
          style={{ color: "#C9A227", fontFamily: "Georgia, serif" }}
        >
          Royal Caterers
        </Link>

        <div className="hidden md:flex gap-8 text-sm font-medium tracking-wide">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.hash}
              onClick={(e) => handleSectionClick(e, item.hash)}
              className="transition-colors hover:text-[#C9A227] cursor-pointer"
              style={{ color: "#F5E6D3" }}
            >
              {item.label}
            </a>
          ))}
          <Link
            href="/blog"
            className="transition-colors hover:text-[#C9A227]"
            style={{ color: "#F5E6D3" }}
          >
            Blog
          </Link>
          <Link
            href="/contact"
            className="transition-colors hover:text-[#C9A227]"
            style={{ color: "#F5E6D3" }}
          >
            Contact
          </Link>
        </div>

        <Link
          href="/contact"
          className="px-3 py-2 md:px-5 md:py-2 rounded-full text-xs md:text-sm font-semibold tracking-wide transition hover:opacity-90 shrink-0"
          style={{ background: "linear-gradient(135deg,#800020,#C9A227)", color: "#FFFFF0" }}
        >
          Book Now
        </Link>
      </div>
    </nav>
  );
}
