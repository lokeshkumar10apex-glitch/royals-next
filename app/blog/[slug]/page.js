import { notFound } from "next/navigation";
import { cache } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { FaCalendarAlt, FaTag, FaArrowLeft } from "react-icons/fa";

// ISR — rebuild at most once per hour
// Revalidate every hour so scheduled posts go live automatically
export const revalidate = 3600;

// Helper — is post live right now?
const isLive = (post) => {
  if (!post.published) return false;
  const publishDate = post.publishedAt || post.createdAt;
  return new Date(publishDate) <= new Date();
};

// React cache() — deduplicates generateMetadata + page component DB calls
const getPost = cache(async (slug) => {
  try {
    await connectDB();
    const post = await Post.findOne({ slug, published: true }).lean();
    if (!post) return null;
    // Block future scheduled posts
    if (!isLive(post)) return null;
    return JSON.parse(JSON.stringify(post));
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    return null;
  }
});

// Fetch latest posts for sidebar (exclude current slug, exclude future)
async function getLatestPosts(excludeSlug) {
  try {
    await connectDB();
    const now = new Date();
    const posts = await Post.find({
      published: true,
      slug: { $ne: excludeSlug },
      $or: [
        { publishedAt: { $lte: now } },
        { publishedAt: null },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title slug excerpt coverImage tag createdAt publishedAt")
      .lean();
    return JSON.parse(JSON.stringify(posts));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: { absolute: post.metaTitle || post.title },
    description: post.metaDescription || null,
    keywords: post.keywords || [],
    alternates: { canonical: `https://royalcaterers.in/blog/${slug}` },
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || null,
      type: "article",
      publishedTime: post.createdAt,
      images: post.coverImage ? [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }] : [],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const [post, latestPosts] = await Promise.all([
    getPost(slug),
    getLatestPosts(slug),
  ]);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    author: { "@type": "Organization", name: "Royal Caterers", url: "https://royalcaterers.in" },
    publisher: { "@type": "Organization", name: "Royal Caterers", url: "https://royalcaterers.in" },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://royalcaterers.in/blog/${slug}` },
    ...(post.coverImage && { image: post.coverImage }),
  };

  return (
    <>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="min-h-screen pt-28 pb-20 px-4 md:px-8" style={{ background: "#1A0A0A" }}>
        <div className="max-w-6xl mx-auto">

          {/* Back link */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm mb-8 hover:text-[#C9A227] transition-colors" style={{ color: "#F5E6D3", opacity: 0.6 }}>
            <FaArrowLeft size={12} /> Back to Blog
          </Link>

          {/* ── 2-column layout: content + sidebar ── */}
          <div className="flex flex-col lg:flex-row gap-10" style={{ alignItems: "stretch" }}>

            {/* ── Main Content ── */}
            <div className="flex-1 min-w-0">

              {post.coverImage && (
                <div className="rounded-3xl overflow-hidden mb-8" style={{ border: "1px solid rgba(201,162,39,0.2)" }}>
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    width={1200}
                    height={630}
                    priority
                    sizes="(max-width: 1024px) 100vw, 70vw"
                    className="w-full h-auto"
                  />
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 mb-4">
                {post.tag && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "rgba(201,162,39,0.12)", color: "#C9A227", border: "1px solid rgba(201,162,39,0.3)" }}>
                    <FaTag size={10} /> {post.tag}
                  </span>
                )}
                <span className="flex items-center gap-1 text-xs" style={{ color: "#F5E6D3", opacity: 0.5 }}>
                  <FaCalendarAlt size={11} />
                  {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight" style={{ color: "#FFFFF0", fontFamily: "Georgia, serif" }}>
                {post.title}
              </h1>

              <article className="blog-post-content">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </article>

              <style>{`
                .blog-post-content h1 { color:#FFFFF0; font-family:Georgia,serif; font-size:2rem; font-weight:800; margin:1.5rem 0 0.75rem; }
                .blog-post-content h2 { color:#FFFFF0; font-family:Georgia,serif; font-size:1.6rem; font-weight:700; margin:1.25rem 0 0.6rem; border-bottom:1px solid rgba(201,162,39,0.2); padding-bottom:6px; }
                .blog-post-content h3 { color:#C9A227; font-family:Georgia,serif; font-size:1.3rem; font-weight:600; margin:1rem 0 0.5rem; }
                .blog-post-content h4 { color:#F5E6D3; font-size:1.1rem; font-weight:600; margin:0.9rem 0 0.45rem; opacity:0.95; }
                .blog-post-content h5 { color:#F5E6D3; font-size:1rem; font-weight:600; margin:0.8rem 0 0.4rem; opacity:0.85; letter-spacing:0.03em; }
                .blog-post-content h6 { color:#F5E6D3; font-size:0.9rem; font-weight:600; margin:0.75rem 0 0.35rem; opacity:0.7; text-transform:uppercase; letter-spacing:0.08em; }
                .blog-post-content p  { color:#F5E6D3; opacity:0.87; margin-bottom:0.85rem; font-size:15px; line-height:1.8; }
                .blog-post-content strong { color:#FFFFF0; }
                .blog-post-content em { font-style:italic; }
                .blog-post-content u  { text-decoration:underline; }
                .blog-post-content ul { list-style:disc; padding-left:1.5rem; margin-bottom:1rem; color:#F5E6D3; opacity:0.87; }
                .blog-post-content ol { list-style:decimal; padding-left:1.5rem; margin-bottom:1rem; color:#F5E6D3; opacity:0.87; }
                .blog-post-content li { margin-bottom:0.35rem; line-height:1.7; }
                .blog-post-content blockquote { border-left:3px solid #C9A227; padding-left:1rem; margin:1.25rem 0; font-style:italic; opacity:0.8; color:#F5E6D3; }
                .blog-post-content hr  { border:none; border-top:1px solid rgba(201,162,39,0.25); margin:1.75rem 0; }
                .blog-post-content a   { color:#C9A227; text-decoration:underline; }
                .blog-post-content img { max-width:100%; border-radius:12px; margin:1.25rem 0; border:1px solid rgba(201,162,39,0.2); }
                .blog-post-content code { background:rgba(201,162,39,0.12); color:#C9A227; border-radius:4px; padding:2px 6px; font-size:0.85em; font-family:monospace; }
                .blog-post-content pre  { background:rgba(245,230,211,0.06); border:1px solid rgba(201,162,39,0.2); border-radius:10px; padding:14px 18px; overflow-x:auto; margin:1rem 0; }
                .blog-post-content pre code { background:none; color:#F5E6D3; padding:0; }
                .blog-post-content mark { background:rgba(201,162,39,0.3); color:#FFFFF0; border-radius:3px; padding:0 3px; }
                .blog-post-content iframe { width:100%; aspect-ratio:16/9; border-radius:12px; margin:1.25rem 0; }
                .blog-post-content table { width:100%; border-collapse:collapse; margin:1.25rem 0; font-size:14px; }
                .blog-post-content th { background:rgba(201,162,39,0.15); color:#FFFFF0; font-weight:700; text-align:left; padding:10px 14px; border:1px solid rgba(201,162,39,0.3); }
                .blog-post-content td { color:#F5E6D3; padding:9px 14px; border:1px solid rgba(201,162,39,0.15); vertical-align:top; line-height:1.6; }
                .blog-post-content tr:nth-child(even) td { background:rgba(245,230,211,0.03); }
                .blog-post-content table { overflow-x:auto; display:block; }
                .blog-post-content sub { font-size:0.75em; vertical-align:sub; }
                .blog-post-content sup { font-size:0.75em; vertical-align:super; }
                .blog-post-content ul[data-type="taskList"] { list-style:none; padding-left:0.5rem; }
                .blog-post-content ul[data-type="taskList"] li { display:flex; align-items:flex-start; gap:8px; margin-bottom:0.4rem; }
                .blog-post-content ul[data-type="taskList"] li > label { margin-top:3px; flex-shrink:0; }
                .blog-post-content ul[data-type="taskList"] li > label input[type="checkbox"] { width:15px; height:15px; accent-color:#C9A227; }
                .blog-post-content ul[data-type="taskList"] li[data-checked="true"] > div { opacity:0.5; text-decoration:line-through; }
              `}</style>

              {/* CTA */}
              <div className="mt-16 p-8 rounded-3xl text-center" style={{ background: "rgba(245,230,211,0.04)", border: "1px solid rgba(201,162,39,0.2)" }}>
                <p className="text-sm mb-2 font-semibold tracking-widest uppercase" style={{ color: "#C9A227" }}>Planning an Event?</p>
                <h3 className="text-2xl font-bold mb-3" style={{ color: "#FFFFF0", fontFamily: "Georgia, serif" }}>
                  Let Royal Caterers Handle the Food
                </h3>
                <p className="text-sm mb-6" style={{ color: "#F5E6D3", opacity: 0.7 }}>
                  30+ years of pure veg catering excellence in Jaipur. Get in touch today.
                </p>
                <Link href="/contact" className="inline-block px-8 py-3 rounded-full font-semibold text-sm transition hover:opacity-90" style={{ background: "linear-gradient(135deg,#800020,#C9A227)", color: "#FFFFF0" }}>
                  Book Your Event →
                </Link>
              </div>

            </div>

            {/* ── Sidebar ── */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              {/* This div stretches full height of aside, sticky child floats within it */}
              <div style={{ height: "100%", position: "relative" }}>
                <div style={{ position: "sticky", top: "88px" }}>

                {/* Latest Posts */}
                <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(245,230,211,0.04)", border: "1px solid rgba(201,162,39,0.18)" }}>

                  {/* Sidebar header */}
                  <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(201,162,39,0.15)" }}>
                    <h2 className="text-sm font-bold tracking-widest uppercase" style={{ color: "#C9A227" }}>
                      Latest Posts
                    </h2>
                  </div>

                  {latestPosts.length === 0 ? (
                    <p className="px-5 py-6 text-xs" style={{ color: "#F5E6D3", opacity: 0.4 }}>No other posts yet.</p>
                  ) : (
                    <div className="divide-y overflow-y-auto" style={{ borderColor: "rgba(201,162,39,0.1)" }}>
                      {latestPosts.map((p) => (
                        <Link key={p._id} href={`/blog/${p.slug}`} className="flex gap-3 px-5 py-4 group hover:bg-white/5 transition-colors">

                          {/* Thumbnail */}
                          {p.coverImage ? (
                            <div className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden">
                              <Image
                                src={p.coverImage}
                                alt={p.title}
                                fill
                                sizes="64px"
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 flex-shrink-0 rounded-xl flex items-center justify-center text-xl"
                              style={{ background: "rgba(201,162,39,0.1)", border: "1px solid rgba(201,162,39,0.2)" }}>
                              📝
                            </div>
                          )}

                          {/* Text */}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold leading-snug mb-1 group-hover:text-[#C9A227] transition-colors line-clamp-2"
                              style={{ color: "#FFFFF0" }}>
                              {p.title}
                            </p>
                            <div className="flex items-center gap-2 text-xs" style={{ color: "#F5E6D3", opacity: 0.45 }}>
                              <span>{new Date(p.publishedAt || p.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                            </div>
                            {p.tag && (
                              <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full"
                                style={{ background: "rgba(201,162,39,0.1)", color: "#C9A227" }}>
                                {p.tag}
                              </span>
                            )}
                          </div>

                        </Link>
                      ))}
                    </div>
                  )}

                  {/* View all link */}
                  <div className="px-5 py-3" style={{ borderTop: "1px solid rgba(201,162,39,0.1)" }}>
                    <Link href="/blog" className="text-xs font-semibold hover:opacity-80 transition-opacity" style={{ color: "#C9A227" }}>
                      View all posts →
                    </Link>
                  </div>

                </div>

              </div>
              </div>
            </aside>

          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
