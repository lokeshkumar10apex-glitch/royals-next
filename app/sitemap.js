import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  let blogEntries = [];
  try {
    await connectDB();
    const now = new Date();
    const posts = await Post.find({
      published: true,
      $or: [{ publishedAt: { $lte: now } }, { publishedAt: null }],
    }).select("slug updatedAt publishedAt").lean();
    blogEntries = posts.map((p) => ({
      url: `https://royalcaterers.in/blog/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: "monthly",
      priority: 0.7,
    }));
  } catch (_) {}

  return [
    { url: "https://royalcaterers.in",         lastModified: new Date(), changeFrequency: "monthly", priority: 1   },
    { url: "https://royalcaterers.in/contact",  lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://royalcaterers.in/blog",     lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    ...blogEntries,
  ];
}
