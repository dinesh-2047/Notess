import express from 'express';

import {
  initiateOrder,
  listPurchases,
  razorpayWebhook,
  verifyPayment,
} from '../controllers/payment.controller.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { orderSchema, verifyPaymentSchema } from '../validators/payment.schema.js';

const router = express.Router();

router.post('/order', authenticate, validateRequest(orderSchema), initiateOrder);
router.post('/verify', authenticate, validateRequest(verifyPaymentSchema), verifyPayment);
router.get('/', authenticate, listPurchases);
router.post('/webhook', razorpayWebhook);

export default router;
