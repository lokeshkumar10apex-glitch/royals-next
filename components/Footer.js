"use client";

import Link from "next/link";
import { FaInstagram, FaFacebookF, FaYoutube, FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const quickLinks = [
  { label: "Home",     href: "/" },
  { label: "About Us", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Gallery",  href: "/#gallery" },
  { label: "Blog",     href: "/blog" },
  { label: "Contact",  href: "/contact" },
];

const serviceList = ["Wedding Catering", "Birthday Parties", "Corporate Events", "Pooja & Ceremonies", "Live Counters"];

const socials = [
  { icon: <FaInstagram />, href: "https://instagram.com",        label: "Instagram" },
  { icon: <FaFacebookF />, href: "https://facebook.com",         label: "Facebook" },
  { icon: <FaYoutube />,   href: "https://youtube.com",          label: "YouTube" },
  { icon: <FaWhatsapp />,  href: "https://wa.me/919876543210",   label: "WhatsApp" },
];

export default function Footer() {
  return (
    <footer className="pt-16 pb-8 px-6" style={{ background: "#120606", borderTop: "1px solid rgba(201,162,39,0.25)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold tracking-wide mb-4" style={{ color: "#C9A227", fontFamily: "Georgia, serif" }}>
              Royal Caterers
            </h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#F5E6D3", opacity: 0.7 }}>
              Pure veg cuisine of the highest quality. 30+ years of making every event truly memorable.
            </p>
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  style={{ background: "rgba(201,162,39,0.1)", border: "1px solid rgba(201,162,39,0.25)", color: "#C9A227" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "linear-gradient(135deg,#800020,#C9A227)"; e.currentTarget.style.color = "#FFFFF0"; e.currentTarget.style.borderColor = "transparent"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(201,162,39,0.1)"; e.currentTarget.style.color = "#C9A227"; e.currentTarget.style.borderColor = "rgba(201,162,39,0.25)"; }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-5 text-sm tracking-widest uppercase" style={{ color: "#C9A227" }}>Quick Links</h3>
            <ul className="space-y-3 text-sm">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition-colors hover:text-[#C9A227]" style={{ color: "#F5E6D3", opacity: 0.7 }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-5 text-sm tracking-widest uppercase" style={{ color: "#C9A227" }}>Our Services</h3>
            <ul className="space-y-3 text-sm">
              {serviceList.map((s) => (
                <li key={s} style={{ color: "#F5E6D3", opacity: 0.7 }}>{s}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-5 text-sm tracking-widest uppercase" style={{ color: "#C9A227" }}>Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <FaPhone className="mt-1 flex-shrink-0" style={{ color: "#C9A227" }} />
                <a href="tel:+919876543210" className="hover:text-[#C9A227] transition-colors" style={{ color: "#F5E6D3", opacity: 0.8 }}>
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FaEnvelope className="mt-1 flex-shrink-0" style={{ color: "#C9A227" }} />
                <a href="mailto:lokeshkumar10.apex@gmail.com" className="hover:text-[#C9A227] transition-colors" style={{ color: "#F5E6D3", opacity: 0.8 }}>
                  lokeshkumar10.apex@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 flex-shrink-0" style={{ color: "#C9A227" }} />
                <span style={{ color: "#F5E6D3", opacity: 0.8 }}>Malviya Nagar, Jaipur, Rajasthan</span>
              </li>
            </ul>
          </div>

        </div>

        <div
          className="pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-sm"
          style={{ borderTop: "1px solid rgba(201,162,39,0.2)", color: "#F5E6D3", opacity: 0.5 }}
        >
          <span>© 2026 Royal Caterers. All Rights Reserved.</span>
          <span>Pure Veg · Trusted Since 1995</span>
        </div>
      </div>
    </footer>
  );
}
