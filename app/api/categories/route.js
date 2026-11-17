import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";

// GET /api/categories — public, returns all categories
export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({}).sort({ name: 1 }).lean();
    return NextResponse.json({ success: true, categories });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST /api/categories — add new category (admin only)
export async function POST(req) {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin")
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { name } = await req.json();
    if (!name?.trim())
      return NextResponse.json({ success: false, error: "Name zaroori hai" }, { status: 400 });

    const category = await Category.create({ name: name.trim() });
    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (err) {
    const msg = err.code === 11000 ? "Yeh category already exist karti hai" : err.message;
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
