import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import AdminShell from "@/components/admin/AdminShell";

export const metadata = { title: "Admin Dashboard", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();
  if (session?.user?.role !== "admin") redirect("/login");

  await connectDB();
  const posts = await Post.find({})
    .sort({ createdAt: -1 })
    .select("-content")
    .lean();

  return <AdminShell initialPosts={JSON.parse(JSON.stringify(posts))} />;
}
