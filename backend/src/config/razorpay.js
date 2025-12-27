import Razorpay from 'razorpay';
import { env } from './env.js';

let razorpayInstance = null;

if (!env.razorpay.keyId || !env.razorpay.keySecret) {
  console.warn('⚠️ Razorpay credentials are not configured. Payment endpoints will be disabled.');
} else {
  razorpayInstance = new Razorpay({
    key_id: env.razorpay.keyId,
    key_secret: env.razorpay.keySecret,
  });
}

export const razorpay = razorpayInstance;
export const isRazorpayEnabled = Boolean(razorpayInstance);
