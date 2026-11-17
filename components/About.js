import Image from "next/image";

const points = ["Pure Veg Cuisine", "Professional Staff", "Hygienic Preparation", "Timely Service"];

export default function About() {
  return (
    <section id="about" className="pt-24 pb-16 md:py-24 px-6" style={{ background: "#1A0A0A" }}>
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">

        <div className="relative">
          <Image
            src="https://images.unsplash.com/photo-1555244162-803834f70033?w=800"
            alt="Royal Caterers — pure veg catering food spread in Jaipur"
            width={800}
            height={500}
            loading="lazy"
            className="rounded-3xl w-full h-[500px] object-cover"
            style={{ border: "1px solid rgba(201,162,39,0.2)" }}
          />
          <div
            className="absolute -bottom-6 -right-6 px-6 py-4 rounded-2xl shadow-2xl text-center"
            style={{ background: "linear-gradient(135deg,#800020,#C9A227)", color: "#FFFFF0" }}
          >
            <div className="text-3xl font-black">30+</div>
            <div className="text-sm font-medium">Years of Excellence</div>
          </div>
        </div>

        <div>
          <span className="font-semibold tracking-widest uppercase text-sm block text-center md:text-left" style={{ color: "#C9A227" }}>
            Who We Are
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-6 text-center md:text-left" style={{ color: "#FFFFF0", fontFamily: "Georgia, serif" }}>
            About Us
          </h2>
          <p className="leading-relaxed mb-4 text-sm" style={{ color: "#F5E6D3", opacity: 0.8 }}>
            Royal Caterers is associated with pure veg cuisine of the highest quality. With more than{" "}
            <strong style={{ color: "#FFFFF0" }}>30 years of experience</strong> in this field, we always
            commit to serve you better and delicious food and make your function truly memorable.
          </p>
          <p className="leading-relaxed mb-4 text-sm" style={{ color: "#F5E6D3", opacity: 0.8 }}>
            Our purpose has always been to provide the finest in veg cuisine, focusing on the best quality
            customer service. We provide you with endless varieties of delicacies — our vast experience
            gives us a cutting edge in handling parties of all sizes.
          </p>
          <p className="leading-relaxed mb-8 text-sm" style={{ color: "#F5E6D3", opacity: 0.8 }}>
            We engage highly qualified professionals for cooking and utility services. Our service stewards
            are well-behaved, properly uniformed, and committed to serving food neat and clean.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {points.map((point) => (
              <div key={point} className="flex items-center gap-3 text-sm" style={{ color: "#F5E6D3" }}>
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#C9A227" }} />
                {point}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
