import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const pendingUserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    course: { type: String, required: true, trim: true },
    branch: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    otpHash: String,
    otpExpiresAt: Date,
  },
  { timestamps: true },
);

pendingUserSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) return;
  if (this.password?.startsWith('$2')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export const PendingUser = mongoose.model('PendingUser', pendingUserSchema);
