import { Resource } from '../models/Resource.model.js';
import { User } from '../models/User.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

export const getAdminStats = asyncHandler(async (req, res) => {
  const [resourceCount, totalDownloads, branches, recentResources, userCount] = await Promise.all([
    Resource.countDocuments(),
    Resource.aggregate([{ $group: { _id: null, total: { $sum: '$downloadCount' } } }]),
    Resource.distinct('branch'),
    Resource.find({}).sort({ createdAt: -1 }).limit(5).select('title course branch downloadCount type'),
    User.countDocuments(),
  ]);

  const totalDownloadsValue = totalDownloads?.[0]?.total || 0;

  res.json(
    new ApiResponse(200, {
      totalResources: resourceCount,
      totalDownloads: totalDownloadsValue,
      activeBranches: branches.filter(Boolean).length,
      totalUsers: userCount,
      recentResources,
    }),
  );
});

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).sort({ createdAt: -1 }).select('fullName email course branch role isVerified createdAt');
  res.json(new ApiResponse(200, { users }));
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const allowed = ['fullName', 'course', 'branch', 'role', 'isVerified'];
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) {
      user[key] = req.body[key];
    }
  });

  if (req.body.email && req.body.email !== user.email) {
    const existing = await User.findOne({ email: req.body.email });
    if (existing && existing._id.toString() !== user._id.toString()) {
      throw new ApiError(409, 'Email is already in use');
    }
    user.email = req.body.email;
  }

  if (req.body.password) {
    if (req.body.password.length < 8) {
      throw new ApiError(400, 'Password must be at least 8 characters');
    }
    user.password = req.body.password; // pre-save hook will hash
  }

  await user.save();
  res.json(new ApiResponse(200, { user: user.stripSensitive() }));
});