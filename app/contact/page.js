import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact Us — Book Your Event",
  description:
    "Contact Royal Caterers to book your catering in Jaipur. We cater weddings, birthday parties, corporate events, and pooja ceremonies across Jaipur, Rajasthan. Call or WhatsApp us today.",
  alternates: { canonical: "https://royalcaterers.in/contact" },
};

// Map config
const OWNER_LAT      = 26.8467;
const OWNER_LNG      = 75.7956;
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${OWNER_LAT},${OWNER_LNG}&travelmode=driving`;
const MAP_EMBED_URL  =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3560.5!2d75.7934!3d26.8467!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4884b8b1a7b1%3A0x9deea023e74188ab!2sMalviya%20Nagar%2C%20Jaipur%2C%20Rajasthan!5e1!3m2!1sen!2sin!4v1";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main
        className="min-h-screen py-32 px-4 md:px-6 overflow-x-hidden"
        style={{ background: "#1A0A0A", color: "#F5E6D3" }}
      >
        <div className="max-w-7xl mx-auto">

          {/* Heading */}
          <div className="text-center mb-20">
            <span className="font-semibold tracking-widest uppercase text-sm" style={{ color: "#C9A227" }}>
              Get In Touch
            </span>
            <h1
              className="text-4xl md:text-6xl font-bold mt-3"
              style={{ color: "#FFFFF0", fontFamily: "Georgia, serif" }}
            >
              Contact Us
            </h1>
          </div>

          <div className="grid md:grid-cols-2 gap-10 w-full">

            {/* LEFT — Form (client component) */}
            <ContactForm />

            {/* RIGHT — Info + Map */}
            <div className="space-y-6 min-w-0">

              {/* Owner info card */}
              <div
                className="p-6 md:p-8 rounded-3xl"
                style={{
                  background: "rgba(245,230,211,0.05)",
                  border: "1px solid rgba(201,162,39,0.2)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <h2 className="text-2xl font-bold mb-6" style={{ color: "#FFFFF0", fontFamily: "Georgia, serif" }}>
                  Owner Information
                </h2>
                <div className="space-y-5">
                  {[
                    { icon: "📞", label: "Phone Number",   value: "+91 987 654 3210", href: "tel:+919876543210" },
                    { icon: "✉️", label: "Email Address",  value: "lokeshkumar10.apex@gmail.com", href: "mailto:lokeshkumar10.apex@gmail.com" },
                    { icon: "📍", label: "Address",        value: "Malviya Nagar, Jaipur, Rajasthan", href: null },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                        style={{ background: "linear-gradient(135deg,#800020,#C9A227)" }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <div className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#C9A227" }}>
                          {item.label}
                        </div>
                        {item.href ? (
                          <a href={item.href} className="text-sm hover:text-[#C9A227] transition-colors" style={{ color: "#F5E6D3" }}>
                            {item.value}
                          </a>
                        ) : (
                          <span className="text-sm" style={{ color: "#F5E6D3" }}>{item.value}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-xs leading-relaxed" style={{ color: "#F5E6D3", opacity: 0.6 }}>
                  We typically respond within a few hours. For urgent bookings, please call or WhatsApp us directly.
                </p>
              </div>

              {/* Map */}
              <div
                className="rounded-3xl overflow-hidden"
                style={{ border: "1px solid rgba(201,162,39,0.2)" }}
              >
                <iframe
                  src={MAP_EMBED_URL}
                  width="100%"
                  height="280"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Royal Caterers location — Malviya Nagar, Jaipur"
                />
              </div>

              {/* Directions button */}
              <a
                href={DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-semibold text-sm transition hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#800020,#C9A227)", color: "#FFFFF0" }}
              >
                🗺️ Get Directions
              </a>

            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
