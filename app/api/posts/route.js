import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";

// GET /api/posts — fetch all posts (public, only published)
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all"); // admin uses ?all=1

    const session = await auth();
    const filter =
      all === "1" && session?.user?.role === "admin"
        ? {} // admin sees all
        : { published: true }; // public sees only published

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .select("-content") // don't send full content in listing
      .lean();

    return NextResponse.json({ success: true, posts });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST /api/posts — create new post (admin only)
export async function POST(req) {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    const sanitised = {
      ...body,
      title:       body.title?.trim().slice(0, 200),
      excerpt:     body.excerpt?.trim().slice(0, 500),
      content:     body.content?.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, ""),
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
      slug:        body.slug
        ? body.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-")
        : undefined,
    };

    const post = await Post.create(sanitised);
    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (err) {
    const isDBError = err.code === "ECONNREFUSED" || err.message?.includes("querySrv") || err.message?.includes("ECONNREFUSED");
    if (isDBError) {
      return NextResponse.json({
        success: false,
        error: "Database connection failed. Please deploy to Vercel to use the blog — local MongoDB connections are blocked by your network.",
      }, { status: 503 });
    }
    const msg = err.code === 11000 ? "Slug already exists — use a different one." : err.message;
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
