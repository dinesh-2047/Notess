import { Router } from 'express';

import {
  forgotPassword,
  login,
  logout,
  me,
  refreshSession,
  register,
  resendOtp,
  resetPassword,
  verifyAccount,
} from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resendOtpSchema,
  resetPasswordSchema,
  otpVerifySchema,
} from '../validators/auth.schema.js';

const router = Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/verify', validateRequest(otpVerifySchema), verifyAccount);
router.post('/resend-otp', validateRequest(resendOtpSchema), resendOtp);
router.post('/login', validateRequest(loginSchema), login);
router.post('/forgot-password', validateRequest(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validateRequest(resetPasswordSchema), resetPassword);
router.post('/refresh', refreshSession);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, me);

export default router;
