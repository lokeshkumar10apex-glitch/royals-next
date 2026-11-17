"use client";

import { FaRing, FaBirthdayCake, FaBriefcase, FaUtensils, FaUsers, FaStar } from "react-icons/fa";

const services = [
  { title: "Wedding Catering",      desc: "Grand wedding feasts with elaborate menus, live counters, and impeccable presentation for your special day.",  icon: <FaRing size={26} /> },
  { title: "Birthday Parties",      desc: "Delightful spreads for birthday celebrations of all sizes — from intimate gatherings to large parties.",        icon: <FaBirthdayCake size={26} /> },
  { title: "Corporate Events",      desc: "Professional catering for conferences, seminars, and corporate dinners with punctual, clean service.",          icon: <FaBriefcase size={26} /> },
  { title: "Pooja & Ceremonies",    desc: "Traditional pure veg thalis and prasad arrangements for religious functions and auspicious occasions.",         icon: <FaUtensils size={26} /> },
  { title: "Social Gatherings",     desc: "Customised menus for kitty parties, anniversaries, and family get-togethers with warm hospitality.",           icon: <FaUsers size={26} /> },
  { title: "Premium Live Counters", desc: "Live chaat, tawa, and dessert counters that add an interactive and memorable touch to any event.",             icon: <FaStar size={26} /> },
];

export default function Services() {
  return (
    <section id="services" className="py-16 md:py-24 px-6" style={{ background: "#200C0C" }}>
      <div className="max-w-7xl mx-auto text-center">
        <span className="font-semibold tracking-widest uppercase text-sm" style={{ color: "#C9A227" }}>
          What We Offer
        </span>
        <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4" style={{ color: "#FFFFF0", fontFamily: "Georgia, serif" }}>
          Our Services
        </h2>
        <p className="max-w-xl mx-auto mb-16 text-sm leading-relaxed" style={{ color: "#F5E6D3", opacity: 0.75 }}>
          From intimate family functions to grand weddings, we bring the same passion and quality to every event we cater.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              className="p-8 rounded-3xl text-left transition-all duration-300 hover:-translate-y-1"
              style={{ background: "rgba(245,230,211,0.04)", border: "1px solid rgba(201,162,39,0.18)" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(201,162,39,0.5)"; e.currentTarget.style.background = "rgba(245,230,211,0.07)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(201,162,39,0.18)"; e.currentTarget.style.background = "rgba(245,230,211,0.04)"; }}
            >
              <div
                className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#800020,#C9A227)", color: "#FFFFF0" }}
              >
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: "#FFFFF0", fontFamily: "Georgia, serif" }}>
                {service.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#F5E6D3", opacity: 0.75 }}>
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
