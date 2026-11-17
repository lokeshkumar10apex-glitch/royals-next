import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://royalcaterers.in"),
  title: {
    default: "Royal Caterers — Premium Pure Veg Catering in Jaipur",
    template: "%s | Royal Caterers Jaipur",
  },
  description:
    "Royal Caterers — 30+ years of pure veg catering excellence in Jaipur. We specialise in weddings, birthday parties, corporate events, and pooja ceremonies. Book your event today.",
  keywords: [
    "catering in Jaipur",
    "pure veg caterer Jaipur",
    "wedding catering Jaipur",
    "birthday party catering Jaipur",
    "corporate catering Jaipur",
    "event catering Malviya Nagar",
    "Royal Caterers",
    "best caterer Jaipur Rajasthan",
  ],
  authors: [{ name: "Royal Caterers" }],
  creator: "Royal Caterers",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://royalcaterers.in",
    siteName: "Royal Caterers",
    title: "Royal Caterers — Premium Pure Veg Catering in Jaipur",
    description:
      "30+ years of pure veg catering excellence. Weddings, birthday parties, corporate events in Jaipur, Rajasthan.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1555244162-803834f70033?w=1200",
        width: 1200,
        height: 630,
        alt: "Royal Caterers — Premium Pure Veg Catering in Jaipur",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Royal Caterers — Premium Pure Veg Catering in Jaipur",
    description:
      "30+ years of pure veg catering excellence. Weddings, birthday parties, corporate events in Jaipur.",
    images: ["https://images.unsplash.com/photo-1555244162-803834f70033?w=1200"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "https://royalcaterers.in",
  },
};

// JSON-LD structured data — Local Business schema
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FoodEstablishment",
  name: "Royal Caterers",
  description:
    "Premium pure veg catering service in Jaipur with 30+ years of experience in weddings, corporate events, and ceremonies.",
  url: "https://royalcaterers.in",
  telephone: "+919876543210",
  email: "lokeshkumar10.apex@gmail.com",
  servesCuisine: "Pure Vegetarian",
  priceRange: "₹₹",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Malviya Nagar",
    addressLocality: "Jaipur",
    addressRegion: "Rajasthan",
    postalCode: "302017",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 26.8467,
    longitude: 75.7956,
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "235",
    bestRating: "5",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday",
    ],
    opens: "09:00",
    closes: "21:00",
  },
  sameAs: [
    "https://www.instagram.com",
    "https://www.facebook.com",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
