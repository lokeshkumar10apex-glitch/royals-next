import Link from "next/link";
import Image from "next/image";

const stats = [
  { value: "30+",   label: "Years Experience" },
  { value: "5000+", label: "Events Catered" },
  { value: "4.8★",  label: "Google Rating" },
];

export default function Hero() {
  return (
    <section
      id="home"
      className="min-h-screen flex flex-col justify-center items-center text-center px-6 relative overflow-hidden"
    >
      {/* Background image via next/image for optimisation */}
      <Image
        src="https://images.unsplash.com/photo-1555244162-803834f70033?w=1600"
        alt="Royal Caterers — luxury pure veg catering spread"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 z-10" style={{ background: "rgba(26,10,10,0.82)" }} />

      {/* Glow blobs */}
      <div className="absolute top-10 left-10 w-80 h-80 blur-3xl rounded-full opacity-20 z-10" style={{ background: "#800020" }} />
      <div className="absolute bottom-10 right-10 w-80 h-80 blur-3xl rounded-full opacity-20 z-10" style={{ background: "#C9A227" }} />

      <div className="relative z-20 max-w-4xl mx-auto">
        <span
          className="inline-block text-xs font-semibold px-5 py-2 rounded-full mb-6 tracking-widest uppercase border"
          style={{ color: "#C9A227", borderColor: "rgba(201,162,39,0.4)", background: "rgba(201,162,39,0.08)" }}
        >
          Pure Veg · 30+ Years of Excellence
        </span>

        <h1
          className="text-5xl md:text-7xl font-black leading-tight"
          style={{ color: "#FFFFF0", fontFamily: "Georgia, serif" }}
        >
          Luxury Catering
          <br />
          <span style={{ background: "linear-gradient(135deg,#800020,#C9A227)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            For Grand Events
          </span>
        </h1>

        <p className="mt-6 max-w-2xl mx-auto text-lg leading-relaxed" style={{ color: "#F5E6D3", opacity: 0.85 }}>
          Premium pure veg food experiences for weddings, birthday parties and corporate events.
          We commit to serve you the finest cuisine and make your function truly memorable.
        </p>

        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Link
            href="/contact"
            className="px-8 py-4 rounded-full font-semibold transition hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#800020,#C9A227)", color: "#FFFFF0" }}
          >
            Book Now
          </Link>
          <a
            href="#services"
            className="px-8 py-4 rounded-full font-semibold transition hover:opacity-80 border"
            style={{ color: "#F5E6D3", borderColor: "rgba(245,230,211,0.35)", background: "rgba(245,230,211,0.06)" }}
          >
            Our Services
          </a>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-6 max-w-xl mx-auto">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="text-3xl font-black"
                style={{ background: "linear-gradient(135deg,#800020,#C9A227)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
              >
                {stat.value}
              </div>
              <div className="text-sm mt-1" style={{ color: "#F5E6D3", opacity: 0.7 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
