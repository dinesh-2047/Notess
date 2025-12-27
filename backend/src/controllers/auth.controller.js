import crypto from 'crypto';

import { User } from '../models/User.model.js';
import { PendingUser } from '../models/PendingUser.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  generateOtp,
  getOtpExpiry,
  hashOtp,
  sendOtpEmail,
  verifyOtp,
} from '../services/otp.service.js';
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from '../utils/token.js';
import { env } from '../config/env.js';

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const cookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: env.nodeEnv === 'production' ? 'none' : 'lax',
  path: '/',
};

const attachAuthCookies = (res, { refreshToken }) => {
  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const clearAuthCookies = (res) => {
  res.clearCookie('refreshToken', cookieOptions);
};

const issueTokens = async (user) => {
  const payload = { sub: user._id.toString(), role: user.role };
  const accessToken = createAccessToken(payload);
  const refreshToken = createRefreshToken(payload);
  user.refreshToken = hashToken(refreshToken);
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

export const register = asyncHandler(async (req, res) => {
  const { fullName, email, password, course, branch, phone } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'Email is already registered');
  }

  const pendingUser = await PendingUser.findOne({ email });
  const otp = generateOtp();

  if (pendingUser) {
    pendingUser.fullName = fullName;
    pendingUser.password = password;
    pendingUser.course = course;
    pendingUser.branch = branch;
    pendingUser.phone = phone;
    pendingUser.otpHash = hashOtp(otp);
    pendingUser.otpExpiresAt = getOtpExpiry();
    await pendingUser.save();
    await sendOtpEmail({ email: pendingUser.email, otp, reason: 'account verification' });
    return res.status(200).json(
      new ApiResponse(200, { email: pendingUser.email }, 'Existing registration found. OTP resent for verification.'),
    );
  }

  const user = new PendingUser({
    fullName,
    email,
    password,
    course,
    branch,
    phone,
    otpHash: hashOtp(otp),
    otpExpiresAt: getOtpExpiry(),
  });

  await user.save();
  await sendOtpEmail({ email: user.email, otp, reason: 'account verification' });

  res.status(201).json(
    new ApiResponse(201, { email: user.email, userId: user._id }, 'Account created. Please verify the OTP sent to your email.'),
  );
});

export const verifyAccount = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const verifiedUser = await User.findOne({ email });

  if (verifiedUser) {
    throw new ApiError(400, 'Account already verified');
  }

  const pendingUser = await PendingUser.findOne({ email });

  if (!pendingUser) {
    throw new ApiError(404, 'No pending registration found');
  }

  const isValid = verifyOtp(pendingUser.otpHash, otp, pendingUser.otpExpiresAt);

  if (!isValid) {
    throw new ApiError(400, 'Invalid or expired OTP');
  }

  const user = await User.create({
    fullName: pendingUser.fullName,
    email: pendingUser.email,
    password: pendingUser.password,
    course: pendingUser.course,
    branch: pendingUser.branch,
    phone: pendingUser.phone,
    isVerified: true,
  });

  await PendingUser.deleteOne({ _id: pendingUser._id });

  const tokens = await issueTokens(user);
  attachAuthCookies(res, { refreshToken: tokens.refreshToken });

  res.json(new ApiResponse(200, { accessToken: tokens.accessToken, user: user.stripSensitive() }, 'Account verified'));
});

export const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const pendingUser = await PendingUser.findOne({ email });

  if (!pendingUser) {
    const user = await User.findOne({ email });
    if (user) {
      throw new ApiError(400, 'Account is already verified. Please login.');
    }
    throw new ApiError(404, 'No pending registration found for this email');
  }

  const otp = generateOtp();
  pendingUser.otpHash = hashOtp(otp);
  pendingUser.otpExpiresAt = getOtpExpiry();
  await pendingUser.save();
  await sendOtpEmail({ email: pendingUser.email, otp, reason: 'account verification' });

  res.json(new ApiResponse(200, { email: pendingUser.email }, 'OTP resent successfully'));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    const pendingUser = await PendingUser.findOne({ email });
    if (pendingUser) {
      throw new ApiError(403, 'Please verify your account before logging in');
    }
    throw new ApiError(401, 'Invalid credentials');
  }

  if (!user.isVerified) {
    throw new ApiError(403, 'Please verify your account before logging in');
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const tokens = await issueTokens(user);
  attachAuthCookies(res, { refreshToken: tokens.refreshToken });

  res.json(new ApiResponse(200, { accessToken: tokens.accessToken, user: user.stripSensitive() }, 'Login successful'));
});

export const logout = asyncHandler(async (req, res) => {
  if (req.user) {
    req.user.refreshToken = undefined;
    await req.user.save({ validateBeforeSave: false });
  }
  clearAuthCookies(res);
  res.json(new ApiResponse(200, {}, 'Logged out successfully'));
});

export const refreshSession = asyncHandler(async (req, res) => {
  const incomingToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingToken) {
    throw new ApiError(401, 'Refresh token missing');
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(incomingToken);
  } catch (error) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const user = await User.findById(decoded.sub);
  if (!user || !user.refreshToken) {
    throw new ApiError(401, 'Session expired');
  }

  const hashedIncoming = hashToken(incomingToken);
  if (hashedIncoming !== user.refreshToken) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const tokens = await issueTokens(user);
  attachAuthCookies(res, { refreshToken: tokens.refreshToken });

  res.json(new ApiResponse(200, { accessToken: tokens.accessToken, user: user.stripSensitive() }, 'Session refreshed'));
});

export const me = asyncHandler(async (req, res) => {
  res.json(new ApiResponse(200, { user: req.user.stripSensitive() }, 'Profile fetched'));
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const otp = generateOtp();
  user.resetTokenHash = hashOtp(otp);
  user.resetTokenExpiresAt = getOtpExpiry();
  await user.save({ validateBeforeSave: false });

  await sendOtpEmail({ email: user.email, otp, reason: 'password reset' });
  res.json(new ApiResponse(200, {}, 'OTP sent to email for password reset'));
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isValid = verifyOtp(user.resetTokenHash, otp, user.resetTokenExpiresAt);
  if (!isValid) {
    throw new ApiError(400, 'Invalid or expired OTP');
  }

  user.password = newPassword;
  user.resetTokenHash = undefined;
  user.resetTokenExpiresAt = undefined;
  await user.save();

  res.json(new ApiResponse(200, {}, 'Password updated successfully'));
});
