import { z } from 'zod';

export const orderSchema = z.object({
  resourceId: z.string().length(24, 'Invalid resource id'),
});

export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});
