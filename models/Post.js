import mongoose from "mongoose";

// ── Counter collection — WordPress-style auto-increment ID ──────────────────
// Stores the last used postId so each new post gets postId: 1, 2, 3, 4...
const CounterSchema = new mongoose.Schema({
  _id:  { type: String },   // counter name, e.g. "postId"
  seq:  { type: Number, default: 0 },
});
const Counter = mongoose.models.Counter || mongoose.model("Counter", CounterSchema);

// ── Post Schema ──────────────────────────────────────────────────────────────
const PostSchema = new mongoose.Schema(
  {
    postId:     { type: Number, unique: true },   // ← WordPress-style 1, 2, 3...
    title:      { type: String, required: true, trim: true, maxlength: 200 },
    slug:       { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt:    { type: String, default: "", maxlength: 500 },
    content:    { type: String, required: true },
    coverImage: { type: String, default: "" },
    tag:        { type: String, default: "General", trim: true },
    keywords:   { type: [String], default: [] },
    readTime:   { type: Number, default: 3 },
    published:  { type: Boolean, default: false },
    publishedAt: { type: Date, default: null },
    metaTitle:       { type: String, default: "", trim: true, maxlength: 70 },
    metaDescription: { type: String, default: "", trim: true, maxlength: 160 },
  },
  { timestamps: true }
);

// Auto-generate slug from title if not provided
PostSchema.pre("validate", async function () {
  // Slug auto-generate
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }

  // Auto-increment postId (only on new documents)
  if (this.isNew && !this.postId) {
    const counter = await Counter.findByIdAndUpdate(
      "postId",                    // counter name
      { $inc: { seq: 1 } },        // increment by 1
      { new: true, upsert: true }  // create if doesn't exist
    );
    this.postId = counter.seq;
  }
});

// Delete cached model on hot reload (Next.js dev server issue)
if (mongoose.models.Post) delete mongoose.models.Post;
if (mongoose.models.Counter) delete mongoose.models.Counter;

export default mongoose.model("Post", PostSchema);
