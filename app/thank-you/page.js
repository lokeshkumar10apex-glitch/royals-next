import Link from "next/link";
import { FaCheckCircle, FaHome } from "react-icons/fa";

export const metadata = {
  title: "Thank You — Message Received",
  description: "Thank you for contacting Royal Caterers. We have received your enquiry and will get back to you shortly.",
  robots: { index: false }, // no need to index this confirmation page
};

export default function ThankYouPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden"
      style={{ background: "#1A0A0A" }}
    >
      <div className="absolute top-20 left-20 w-72 h-72 blur-3xl rounded-full opacity-15" style={{ background: "#800020" }} />
      <div className="absolute bottom-20 right-20 w-72 h-72 blur-3xl rounded-full opacity-15" style={{ background: "#C9A227" }} />

      <div className="relative z-10 max-w-lg mx-auto">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8"
          style={{ background: "linear-gradient(135deg,#800020,#C9A227)" }}
        >
          <FaCheckCircle size={44} style={{ color: "#FFFFF0" }} />
        </div>

        <h1 className="text-5xl font-black mb-4" style={{ color: "#FFFFF0", fontFamily: "Georgia, serif" }}>
          Thank You!
        </h1>
        <p className="text-lg leading-relaxed mb-3" style={{ color: "#F5E6D3", opacity: 0.85 }}>
          Your message has been received. We appreciate you reaching out to Royal Caterers.
        </p>
        <p className="text-sm leading-relaxed mb-10" style={{ color: "#F5E6D3", opacity: 0.6 }}>
          We have sent a confirmation to your email. Our team will get back to you within a few hours.
          For urgent bookings, feel free to WhatsApp us directly.
        </p>

        <div className="w-16 h-px mx-auto mb-10" style={{ background: "linear-gradient(135deg,#800020,#C9A227)" }} />

        <Link
          href="/"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold transition hover:opacity-90"
          style={{ background: "linear-gradient(135deg,#800020,#C9A227)", color: "#FFFFF0" }}
        >
          <FaHome size={18} />
          Return to Homepage
        </Link>
      </div>
    </main>
  );
}
