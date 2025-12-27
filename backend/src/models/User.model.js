import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    course: {
      type: String,
      trim: true,
    },
    branch: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otpHash: String,
    otpExpiresAt: Date,
    refreshToken: String,
    resetTokenHash: String,
    resetTokenExpiresAt: Date,
    purchases: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Purchase',
        },
      ],
      default: [],
    },
    ownedResources: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Resource',
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function encryptPassword() {
  if (!this.isModified('password')) return;
  if (this.password?.startsWith('$2')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.stripSensitive = function stripSensitive() {
  const obj = this.toObject({ versionKey: false });
  delete obj.password;
  delete obj.refreshToken;
  delete obj.otpHash;
  delete obj.resetTokenHash;
  return obj;
};

export const User = mongoose.model('User', userSchema);
