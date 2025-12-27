import crypto from 'crypto';

import { razorpay, isRazorpayEnabled } from '../config/razorpay.js';
import { Purchase } from '../models/Purchase.model.js';
import { Resource } from '../models/Resource.model.js';
import { User } from '../models/User.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { env } from '../config/env.js';

const grantAccessToResource = async ({ userId, resourceId, purchaseId }) => {
  const [user, resource] = await Promise.all([
    User.findById(userId),
    Resource.findById(resourceId),
  ]);

  if (!user || !resource) return;

  if (!user.purchases.some((id) => id.equals(purchaseId))) {
    user.purchases.push(purchaseId);
  }
  const alreadyOwned = user.ownedResources.some((id) => id.equals(resourceId));
  if (!alreadyOwned) {
    user.ownedResources.push(resourceId);
    resource.purchaseCount += 1;
  }

  await Promise.all([user.save({ validateBeforeSave: false }), resource.save({ validateBeforeSave: false })]);
};

export const initiateOrder = asyncHandler(async (req, res) => {
  if (!isRazorpayEnabled) {
    throw new ApiError(500, 'Payment gateway is not configured');
  }
  const { resourceId } = req.body;
  const resource = await Resource.findById(resourceId);

  if (!resource) {
    throw new ApiError(404, 'Resource not found');
  }

  if (!resource.isPaid) {
    throw new ApiError(400, 'This resource is free. Download directly.');
  }

  const alreadyOwned = req.user.ownedResources.some((id) => id.equals(resource._id));
  if (alreadyOwned) {
    throw new ApiError(400, 'You already own this resource');
  }

  const amountInPaise = Math.round(resource.price * 100);
  const receipt = `notess_${resource._id}_${Date.now()}`;

  const order = await razorpay.orders.create({
    amount: amountInPaise,
    currency: 'INR',
    receipt,
    notes: {
      resourceId: resource._id.toString(),
      userId: req.user._id.toString(),
      type: resource.type,
    },
  });

  await Purchase.create({
    user: req.user._id,
    resource: resource._id,
    amount: resource.price,
    currency: 'INR',
    razorpayOrderId: order.id,
    receipt,
    meta: { course: resource.course, branch: resource.branch },
  });

  res.json(
    new ApiResponse(200, {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: env.razorpay.keyId,
      resource: {
        id: resource._id,
        title: resource.title,
        price: resource.price,
        type: resource.type,
      },
    }, 'Order created'),
  );
});

export const verifyPayment = asyncHandler(async (req, res) => {
  if (!isRazorpayEnabled) {
    throw new ApiError(500, 'Payment gateway is not configured');
  }
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new ApiError(400, 'Missing payment details');
  }

  const purchase = await Purchase.findOne({ razorpayOrderId: razorpay_order_id, user: req.user._id });
  if (!purchase) {
    throw new ApiError(404, 'Purchase not found');
  }

  const hmac = crypto.createHmac('sha256', env.razorpay.keySecret);
  hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = hmac.digest('hex');

  if (digest !== razorpay_signature) {
    purchase.status = 'failed';
    await purchase.save({ validateBeforeSave: false });
    throw new ApiError(400, 'Payment signature mismatch');
  }

  purchase.status = 'paid';
  purchase.razorpayPaymentId = razorpay_payment_id;
  purchase.razorpaySignature = razorpay_signature;
  await purchase.save({ validateBeforeSave: false });

  await grantAccessToResource({ userId: req.user._id, resourceId: purchase.resource, purchaseId: purchase._id });

  res.json(new ApiResponse(200, { resourceId: purchase.resource }, 'Payment verified'));
});

export const razorpayWebhook = asyncHandler(async (req, res) => {
  if (!env.razorpay.webhookSecret || !isRazorpayEnabled) {
    throw new ApiError(500, 'Webhook secret not configured');
  }
  const signature = req.headers['x-razorpay-signature'];
  if (!signature) {
    throw new ApiError(400, 'Missing webhook signature');
  }

  const body = req.body; // Buffer because of express.raw
  const generatedSignature = crypto.createHmac('sha256', env.razorpay.webhookSecret).update(body).digest('hex');

  if (generatedSignature !== signature) {
    throw new ApiError(400, 'Invalid webhook signature');
  }

  const payload = JSON.parse(body.toString());
  const paymentEntity = payload.payload?.payment?.entity;
  const orderId = paymentEntity?.order_id;

  if (!orderId) {
    return res.json({ received: true });
  }

  const purchase = await Purchase.findOne({ razorpayOrderId: orderId });
  if (!purchase) {
    return res.json({ received: true });
  }

  if (payload.event === 'payment.captured') {
    purchase.meta = payload;
    if (purchase.status !== 'paid') {
      purchase.status = 'paid';
      purchase.razorpayPaymentId = paymentEntity.id;
      purchase.razorpaySignature = signature;
      await purchase.save({ validateBeforeSave: false });
      await grantAccessToResource({ userId: purchase.user, resourceId: purchase.resource, purchaseId: purchase._id });
    } else {
      await purchase.save({ validateBeforeSave: false });
    }
  } else if (payload.event === 'payment.failed') {
    purchase.status = 'failed';
    purchase.meta = payload;
    await purchase.save({ validateBeforeSave: false });
  }

  res.json({ received: true });
});

export const listPurchases = asyncHandler(async (req, res) => {
  const purchases = await Purchase.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate('resource', 'title price type');
  res.json(new ApiResponse(200, { purchases }));
});
