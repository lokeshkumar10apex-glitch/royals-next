import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import Category from "@/models/Category";
import PostEditor from "@/components/admin/PostEditor";

export const metadata = { title: "Edit Post", robots: { index: false } };

export default async function EditPostPage({ params }) {
  const session = await auth();
  if (session?.user?.role !== "admin") redirect("/login");

  const { id } = await params;

  await connectDB();

  // Fetch post + categories in parallel — no client-side API calls needed
  const [postDoc, categoryDocs] = await Promise.all([
    Post.findById(id).lean(),
    Category.find({}).sort({ name: 1 }).lean(),
  ]);

  if (!postDoc) redirect("/admin");

  const post = JSON.parse(JSON.stringify(postDoc));
  const categories = categoryDocs.map((c) => c.name);

  return <PostEditor mode="edit" postId={id} initialPost={post} initialCategories={categories} />;
}
