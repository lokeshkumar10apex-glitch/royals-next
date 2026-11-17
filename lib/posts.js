import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content/blogs");

// Get all posts sorted by date (newest first)
export function getAllPosts() {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((filename) => {
    const slug = filename.replace(".mdx", "");
    const raw  = fs.readFileSync(path.join(POSTS_DIR, filename), "utf-8");
    const { data } = matter(raw);
    return { slug, ...data };
  });

  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Get a single post by slug
export function getPostBySlug(slug) {
  const filepath = path.join(POSTS_DIR, `${slug}.mdx`);
  const raw      = fs.readFileSync(filepath, "utf-8");
  const { data, content } = matter(raw);
  return { slug, frontmatter: data, content };
}

// Get slugs for generateStaticParams
export function getAllSlugs() {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));
  return files.map((f) => ({ slug: f.replace(".mdx", "") }));
}
