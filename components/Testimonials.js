"use client";

import { FaStar, FaGoogle } from "react-icons/fa";

const reviews = [
  { name: "Rahul Sharma",  time: "1 year ago",   rating: 5, text: "Exceptional flavors and friendly service! Royal Caterers made our celebration a memorable experience for all. Every dish was crafted to perfection." },
  { name: "Priya Verma",   time: "8 months ago", rating: 5, text: "An unforgettable experience! Their world-class service and luxurious cuisine created a culinary masterpiece for our wedding. Truly impressive." },
  { name: "Aditi Joshi",   time: "7 months ago", rating: 5, text: "From the moment I engaged with Royal Caterers, I knew we were in excellent hands. Fresh, perfectly seasoned, and prepared with obvious care." },
  { name: "Deepak Kumar",  time: "1 year ago",   rating: 5, text: "Top-notch catering, great taste, and flawless presentation every time. The staff was professional and coordination was seamless throughout." },
  { name: "Sunita Meena",  time: "6 months ago", rating: 5, text: "We couldn't be happier with Royal Caterers! Exceptional flavors and friendly staff left our guests thoroughly impressed. Booking again soon." },
  { name: "Vikram Singh",  time: "1 year ago",   rating: 5, text: "Royal Caterers provided an exceptional dining experience! The food was delicious and their service made our corporate event truly unforgettable." },
];

function StarRating({ count }) {
  return (
    <div className="flex gap-1" style={{ color: "#C9A227" }}>
      {Array.from({ length: count }).map((_, i) => <FaStar key={i} size={14} />)}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-16 md:py-24 px-6" style={{ background: "#200C0C" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-semibold tracking-widest uppercase text-sm" style={{ color: "#C9A227" }}>
            Customer Reviews
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4" style={{ color: "#FFFFF0", fontFamily: "Georgia, serif" }}>
            What Our Customers Say
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4" style={{ color: "#F5E6D3", opacity: 0.8 }}>
            <FaGoogle />
            <span className="text-sm font-medium">All reviews are original from Google</span>
          </div>
          <div
            className="inline-flex items-center gap-3 mt-5 px-6 py-3 rounded-full"
            style={{ background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.3)" }}
          >
            <span className="text-3xl font-black" style={{ color: "#FFFFF0" }}>4.8</span>
            <div className="text-left">
              <StarRating count={5} />
              <span className="text-xs mt-1 block" style={{ color: "#F5E6D3", opacity: 0.7 }}>235+ Reviews</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="p-7 rounded-3xl flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1"
              style={{ background: "rgba(245,230,211,0.04)", border: "1px solid rgba(201,162,39,0.18)" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(201,162,39,0.45)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(201,162,39,0.18)"; }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0"
                  style={{ background: "linear-gradient(135deg,#800020,#C9A227)", color: "#FFFFF0" }}
                >
                  {r.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: "#FFFFF0" }}>{r.name}</div>
                  <div className="text-xs" style={{ color: "#F5E6D3", opacity: 0.5 }}>{r.time}</div>
                </div>
                <FaGoogle className="ml-auto" style={{ color: "#F5E6D3", opacity: 0.4 }} />
              </div>
              <StarRating count={r.rating} />
              <p className="text-sm leading-relaxed" style={{ color: "#F5E6D3", opacity: 0.78 }}>
                &ldquo;{r.text}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
