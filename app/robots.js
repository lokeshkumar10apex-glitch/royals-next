export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/thank-you",
    },
    sitemap: "https://royalcaterers.in/sitemap.xml",
  };
}
