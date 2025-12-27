import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, trim: true },
    description: { type: String, trim: true },
    course: { type: String, required: true, trim: true },
    branch: { type: String, required: true, trim: true },
    semester: { type: String, trim: true },
    type: { type: String, enum: ['note', 'pyq', 'Notes', 'PYQ'], required: true },
    isPaid: { type: Boolean, default: false },
    price: { type: Number, default: 0, min: 0 },
    tags: [{ type: String, trim: true }],
    fileUrl: { type: String, required: true },
    filePublicId: { type: String, required: true },
    fileResourceType: { type: String, default: 'raw' },
    previewUrl: { type: String },
    previewPublicId: { type: String },
    previewResourceType: { type: String, default: 'image' },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
    },
    downloadCount: { type: Number, default: 0 },
    purchaseCount: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    metadata: {
      pages: Number,
      format: String,
      sizeInKb: Number,
    },
  },
  { timestamps: true },
);

resourceSchema.pre('save', function createSlug() {
  if (!this.isModified('title') && this.slug) return;
  const baseSlug = this.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60);
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  this.slug = `${baseSlug}-${randomSuffix}`;
});

export const Resource = mongoose.model('Resource', resourceSchema);
