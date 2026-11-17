import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true, maxlength: 50 },
    slug: { type: String, required: true, trim: true, unique: true, lowercase: true },
  },
  { timestamps: true }
);

CategorySchema.pre("validate", async function () {
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
  }
});

if (mongoose.models.Category) delete mongoose.models.Category;
export default mongoose.model("Category", CategorySchema);
