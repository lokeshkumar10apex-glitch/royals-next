"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SUSPICIOUS = /<script|javascript:|http:\/\/|https:\/\/|iframe|onerror|onload/i;
const INITIAL    = { name: "", email: "", phone: "", message: "" };

const inputStyle = {
  background: "rgba(245,230,211,0.06)",
  border: "1px solid rgba(201,162,39,0.2)",
  color: "#F5E6D3",
};

export default function ContactForm() {
  const router                = useRouter();
  const [form, setForm]       = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!/^[6-9][0-9]{9}$/.test(form.phone)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return false;
    }
    if (form.message.trim().length < 10) {
      setError("Message must be at least 10 characters.");
      return false;
    }
    if (SUSPICIOUS.test(form.message) || SUSPICIOUS.test(form.name)) {
      setError("Invalid content detected in your message.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method:  "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key:   process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
          subject:      `New Enquiry from ${form.name} — Royal Caterers`,
          from_name:    form.name,
          email:        form.email,
          phone:        form.phone,
          message:      form.message,
          autoresponse: "Thank you for contacting Royal Caterers. We received your enquiry and will contact you shortly.",
          replyto:      form.email,
          botcheck:     "",
        }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/thank-you");
      } else {
        setError(data.message || "Something went wrong. Please try again.");
        setLoading(false);
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="p-5 md:p-8 rounded-3xl min-w-0"
      style={{
        background: "rgba(245,230,211,0.05)",
        border: "1px solid rgba(201,162,39,0.2)",
        backdropFilter: "blur(12px)",
      }}
    >
      <h2 className="text-3xl font-bold mb-8" style={{ color: "#FFFFF0", fontFamily: "Georgia, serif" }}>
        Send Message
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Honeypot */}
        <input type="checkbox" name="botcheck" tabIndex="-1" aria-hidden="true" style={{ display: "none" }} />

        {/* Name */}
        <div className="space-y-1">
          <label htmlFor="name" className="block text-xs font-semibold tracking-widest uppercase" style={{ color: "#C9A227" }}>
            Your Name
          </label>
          <input
            id="name" type="text" name="name" placeholder="e.g. Rahul Sharma"
            value={form.name} onChange={handleChange} required minLength={2} autoComplete="name"
            className="w-full px-5 py-4 rounded-xl outline-none text-sm"
            style={inputStyle}
          />
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label htmlFor="email" className="block text-xs font-semibold tracking-widest uppercase" style={{ color: "#C9A227" }}>
            Your Email
          </label>
          <input
            id="email" type="email" name="email" placeholder="e.g. rahul@gmail.com"
            value={form.email} onChange={handleChange} required autoComplete="email"
            className="w-full px-5 py-4 rounded-xl outline-none text-sm"
            style={inputStyle}
          />
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <label htmlFor="phone" className="block text-xs font-semibold tracking-widest uppercase" style={{ color: "#C9A227" }}>
            Your Phone
          </label>
          <input
            id="phone" type="tel" name="phone" placeholder="10-digit mobile number"
            value={form.phone} onChange={handleChange} required autoComplete="tel"
            className="w-full px-5 py-4 rounded-xl outline-none text-sm"
            style={inputStyle}
          />
        </div>

        {/* Message */}
        <div className="space-y-1">
          <label htmlFor="message" className="block text-xs font-semibold tracking-widest uppercase" style={{ color: "#C9A227" }}>
            Your Message
          </label>
          <textarea
            id="message" name="message" rows={5} placeholder="Tell us about your event..."
            value={form.message} onChange={handleChange} required
            className="w-full px-5 py-4 rounded-xl outline-none text-sm resize-none"
            style={inputStyle}
          />
        </div>

        {/* Error */}
        {error && (
          <p
            className="text-sm px-4 py-3 rounded-xl"
            style={{ background: "rgba(128,0,32,0.2)", border: "1px solid rgba(128,0,32,0.5)", color: "#F5A0A0" }}
          >
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl font-semibold text-sm transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: "linear-gradient(135deg,#800020,#C9A227)", color: "#FFFFF0" }}
        >
          {loading ? "Sending…" : "Send Message"}
        </button>
      </form>
    </div>
  );
}
