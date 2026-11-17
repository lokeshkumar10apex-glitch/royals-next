import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import GallerySlider from "@/components/GallerySlider";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata = {
  title: "Royal Caterers — Premium Pure Veg Catering in Jaipur",
  description:
    "Royal Caterers offers premium pure veg catering in Jaipur for weddings, birthday parties, corporate events, and pooja ceremonies. 30+ years of excellence. Book today.",
  alternates: { canonical: "https://royalcaterers.in" },
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <GallerySlider />
        <Testimonials />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
