import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { FaCalendarAlt, FaTag, FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";

export const metadata = {
  title: "Blog — Catering Tips, Event Ideas & More",
  description:
    "Read the Royal Caterers blog for wedding catering tips, event planning ideas, pure veg recipes, and Jaipur event guides. Updated regularly.",
  alternates: { canonical: "https://royalcaterers.in/blog" },
};

// Search + pagination needs fresh data on every request
export const dynamic = "force-dynamic";

const POSTS_PER_PAGE = 9; // 3-column grid like reference image

function getPreview(post, maxLen = 110) {
  // Use excerpt if available, else strip HTML from content
  const text = post.excerpt || "";
  if (!text) return "";
  return text.length > maxLen ? text.slice(0, maxLen).trimEnd() + "…" : text;
}

async function getPosts({ search = "", page = 1 }) {
  try {
    await connectDB();
    const now = new Date();

    // Base filter — published + not future scheduled
    const filter = {
      published: true,
      $or: [
        { publishedAt: { $lte: now } },
        { publishedAt: null },
      ],
    };

    if (search.trim()) {
      filter.$and = [{
        $or: [
          { title:   { $regex: search, $options: "i" } },
          { tag:     { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
        ],
      }];
      delete filter.$or; // replace with $and containing both conditions
      filter.$and = [
        { $or: [{ publishedAt: { $lte: now } }, { publishedAt: null }] },
        { $or: [
          { title:   { $regex: search, $options: "i" } },
          { tag:     { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
        ]},
      ];
      delete filter.$or;
    }

    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * POSTS_PER_PAGE)
      .limit(POSTS_PER_PAGE)
      .select("title slug excerpt coverImage tag publishedAt createdAt")
      .lean();

    return {
      posts: JSON.parse(JSON.stringify(posts)),
      total,
      totalPages: Math.ceil(total / POSTS_PER_PAGE),
    };
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    return { posts: [], total: 0, totalPages: 0 };
  }
}

export default async function BlogPage({ searchParams }) {
  const params  = await searchParams;
  const search  = params?.q || "";
  const page    = Math.max(1, parseInt(params?.page) || 1);

  const { posts, total, totalPages } = await getPosts({ search, page });

  // Build URL helper
  const buildUrl = (p, q = search) => {
    const sp = new URLSearchParams();
    if (q)   sp.set("q", q);
    if (p > 1) sp.set("page", p);
    return `/blog${sp.toString() ? "?" + sp.toString() : ""}`;
  };

  // Pagination window — show max 5 page numbers
  const pageWindow = () => {
    const delta = 2;
    const range = [];
    for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
      range.push(i);
    }
    return range;
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-20 px-4 md:px-8" style={{ background: "#1A0A0A" }}>
        <div className="max-w-6xl mx-auto">

          {/* ── Header + Search ── */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#C9A227" }}>
                Our Blog
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mt-2 leading-tight" style={{ color: "#FFFFF0", fontFamily: "Georgia, serif" }}>
                Catering Insights &amp; Tips
              </h1>
              <div className="mt-2 w-16 h-0.5" style={{ background: "#C9A227" }} />
            </div>

            {/* Search bar */}
            <form method="GET" action="/blog" className="flex items-center gap-0 flex-shrink-0">
              <input
                type="text"
                name="q"
                defaultValue={search}
                placeholder="Search posts…"
                className="outline-none text-sm px-4 py-2.5 rounded-l-xl"
                style={{
                  background: "rgba(245,230,211,0.07)",
                  border: "1px solid rgba(201,162,39,0.25)",
                  borderRight: "none",
                  color: "#F5E6D3",
                  width: "220px",
                }}
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-r-xl transition hover:opacity-80"
                style={{ background: "#C9A227", border: "1px solid #C9A227", color: "#1A0A0A" }}
              >
                <FaSearch size={14} />
              </button>
              {/* Hidden page reset on new search */}
              <input type="hidden" name="page" value="1" />
            </form>
          </div>

          {/* Search result info */}
          {search && (
            <div className="flex items-center gap-3 mb-8">
              <p className="text-sm" style={{ color: "#F5E6D3", opacity: 0.6 }}>
                <span style={{ color: "#C9A227" }}>{total}</span> result{total !== 1 ? "s" : ""} for &ldquo;<strong style={{ color: "#FFFFF0" }}>{search}</strong>&rdquo;
              </p>
              <Link href="/blog" className="text-xs px-3 py-1 rounded-full transition hover:opacity-80"
                style={{ background: "rgba(201,162,39,0.12)", color: "#C9A227", border: "1px solid rgba(201,162,39,0.25)" }}>
                Clear ✕
              </Link>
            </div>
          )}

          {/* ── Posts Grid ── */}
          {posts.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-sm" style={{ color: "#F5E6D3", opacity: 0.5 }}>
                {search ? `No posts found for "${search}"` : "No posts yet. Check back soon!"}
              </p>
              {search && (
                <Link href="/blog" className="inline-block mt-4 text-sm" style={{ color: "#C9A227" }}>
                  ← View all posts
                </Link>
              )}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link key={post._id} href={`/blog/${post.slug}`} className="group block">
                  <article
                    className="rounded-2xl overflow-hidden h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col"
                    style={{ background: "rgba(245,230,211,0.04)", border: "1px solid rgba(201,162,39,0.15)" }}
                  >
                    {/* Cover Image — fixed height, object-cover for uniform cards */}
                    <div className="w-full overflow-hidden rounded-t-2xl"
                      style={{ height: "200px", background: "rgba(201,162,39,0.06)" }}>
                      {post.coverImage ? (
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          width={800}
                          height={450}
                          loading="lazy"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          🍽️
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      {/* Tag */}
                      {post.tag && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full mb-3 self-start"
                          style={{ background: "rgba(201,162,39,0.12)", color: "#C9A227", border: "1px solid rgba(201,162,39,0.25)" }}>
                          <FaTag size={9} /> {post.tag}
                        </span>
                      )}

                      {/* Title */}
                      <h2 className="font-bold mb-2 leading-snug group-hover:text-[#C9A227] transition-colors line-clamp-2"
                        style={{ color: "#FFFFF0", fontFamily: "Georgia, serif", fontSize: "15px" }}>
                        {post.title}
                      </h2>

                      {/* Date */}
                      <div className="flex items-center gap-3 text-xs mb-3" style={{ color: "#F5E6D3", opacity: 0.45 }}>
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt size={10} />
                          {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>

                      {/* Preview */}
                      <p className="text-xs leading-relaxed mb-4 flex-1 line-clamp-3"
                        style={{ color: "#F5E6D3", opacity: 0.6 }}>
                        {getPreview(post)}
                      </p>

                      {/* Read More */}
                      <span className="inline-block text-xs font-semibold px-4 py-2 rounded-lg self-start transition hover:opacity-80"
                        style={{ background: "rgba(201,162,39,0.1)", color: "#C9A227", border: "1px solid rgba(201,162,39,0.2)" }}>
                        Read More →
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-14">

              {/* Prev */}
              {page > 1 ? (
                <Link href={buildUrl(page - 1)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition hover:opacity-80"
                  style={{ background: "rgba(245,230,211,0.06)", border: "1px solid rgba(201,162,39,0.2)", color: "#F5E6D3" }}>
                  <FaArrowLeft size={10} /> Prev
                </Link>
              ) : (
                <span className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold opacity-25"
                  style={{ background: "rgba(245,230,211,0.06)", border: "1px solid rgba(201,162,39,0.1)", color: "#F5E6D3" }}>
                  <FaArrowLeft size={10} /> Prev
                </span>
              )}

              {/* First page if not in window */}
              {pageWindow()[0] > 1 && (
                <>
                  <Link href={buildUrl(1)} className="w-9 h-9 flex items-center justify-center rounded-lg text-xs font-semibold transition hover:opacity-80"
                    style={{ background: "rgba(245,230,211,0.06)", border: "1px solid rgba(201,162,39,0.2)", color: "#F5E6D3" }}>
                    1
                  </Link>
                  {pageWindow()[0] > 2 && <span style={{ color: "#F5E6D3", opacity: 0.4 }}>…</span>}
                </>
              )}

              {/* Page numbers */}
              {pageWindow().map((p) => (
                <Link key={p} href={buildUrl(p)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-xs font-semibold transition hover:opacity-80"
                  style={{
                    background: p === page ? "#C9A227" : "rgba(245,230,211,0.06)",
                    border: `1px solid ${p === page ? "#C9A227" : "rgba(201,162,39,0.2)"}`,
                    color: p === page ? "#1A0A0A" : "#F5E6D3",
                  }}>
                  {p}
                </Link>
              ))}

              {/* Last page if not in window */}
              {pageWindow()[pageWindow().length - 1] < totalPages && (
                <>
                  {pageWindow()[pageWindow().length - 1] < totalPages - 1 && (
                    <span style={{ color: "#F5E6D3", opacity: 0.4 }}>…</span>
                  )}
                  <Link href={buildUrl(totalPages)} className="w-9 h-9 flex items-center justify-center rounded-lg text-xs font-semibold transition hover:opacity-80"
                    style={{ background: "rgba(245,230,211,0.06)", border: "1px solid rgba(201,162,39,0.2)", color: "#F5E6D3" }}>
                    {totalPages}
                  </Link>
                </>
              )}

              {/* Next */}
              {page < totalPages ? (
                <Link href={buildUrl(page + 1)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition hover:opacity-80"
                  style={{ background: "rgba(245,230,211,0.06)", border: "1px solid rgba(201,162,39,0.2)", color: "#F5E6D3" }}>
                  Next <FaArrowRight size={10} />
                </Link>
              ) : (
                <span className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold opacity-25"
                  style={{ background: "rgba(245,230,211,0.06)", border: "1px solid rgba(201,162,39,0.1)", color: "#F5E6D3" }}>
                  Next <FaArrowRight size={10} />
                </span>
              )}

            </div>
          )}

          {/* Posts count */}
          {posts.length > 0 && totalPages > 1 && (
            <p className="text-center mt-4 text-xs" style={{ color: "#F5E6D3", opacity: 0.35 }}>
              Showing {(page - 1) * POSTS_PER_PAGE + 1}–{Math.min(page * POSTS_PER_PAGE, total)} of {total} posts
            </p>
          )}

        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
