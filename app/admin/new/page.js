import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import PostEditor from "@/components/admin/PostEditor";

export const metadata = { title: "New Post", robots: { index: false } };

export default async function NewPostPage() {
  const session = await auth();
  if (session?.user?.role !== "admin") redirect("/login");

  await connectDB();
  const categoryDocs = await Category.find({}).sort({ name: 1 }).lean();
  const categories   = categoryDocs.map((c) => c.name);

  return <PostEditor mode="new" initialCategories={categories} />;
}
