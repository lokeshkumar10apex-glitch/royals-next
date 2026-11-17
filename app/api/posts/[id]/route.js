import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";

// GET /api/posts/[id]
// - Public: fetch by slug (?admin param absent) — only published posts
// - Admin:  fetch by MongoDB _id (?admin=1)     — draft + published
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get("admin") === "1";

    let post;

    if (isAdmin) {
      // Admin edit — fetch by _id regardless of published status
      const session = await auth();
      if (session?.user?.role !== "admin") {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
      }
      post = await Post.findById(id).lean();
    } else {
      // Public — fetch by slug, only published and not future scheduled
      const now = new Date();
      post = await Post.findOne({
        slug: id,
        published: true,
        $or: [
          { publishedAt: { $lte: now } },
          { publishedAt: null },
        ],
      }).lean();
    }

    if (!post) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, post });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PATCH /api/posts/[id] — update post (admin only)
export async function PATCH(req, { params }) {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const sanitised = {
      ...body,
      title:       body.title?.trim().slice(0, 200),
      excerpt:     body.excerpt?.trim().slice(0, 500),
      content:     body.content?.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, ""),
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : undefined,
    };

    const post = await Post.findByIdAndUpdate(id, sanitised, { new: true, runValidators: true });
    if (!post) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, post });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

// DELETE /api/posts/[id] — delete post (admin only)
export async function DELETE(req, { params }) {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    await Post.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
