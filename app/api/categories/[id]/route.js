import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import Post from "@/models/Post";

// PATCH /api/categories/[id] — rename (admin only)
export async function PATCH(req, { params }) {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin")
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { id } = await params;
    const { name } = await req.json();
    if (!name?.trim())
      return NextResponse.json({ success: false, error: "Name zaroori hai" }, { status: 400 });

    const oldCategory = await Category.findById(id).lean();
    if (!oldCategory)
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    const newSlug = name.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

    // Update category name
    const category = await Category.findByIdAndUpdate(
      id,
      { name: name.trim(), slug: newSlug },
      { new: true, runValidators: true }
    );

    // Also update all posts that had old category name
    await Post.updateMany({ tag: oldCategory.name }, { $set: { tag: name.trim() } });

    return NextResponse.json({ success: true, category });
  } catch (err) {
    const msg = err.code === 11000 ? "Yeh category already exist karti hai" : err.message;
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}

// DELETE /api/categories/[id] — delete (admin only)
export async function DELETE(req, { params }) {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin")
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { id } = await params;
    const category = await Category.findById(id).lean();
    if (!category)
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    // Check if any posts use this category
    const postCount = await Post.countDocuments({ tag: category.name });
    if (postCount > 0)
      return NextResponse.json({
        success: false,
        error: `${postCount} post(s) is category mein hain. Pehle unhe change karo.`,
      }, { status: 400 });

    await Category.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
