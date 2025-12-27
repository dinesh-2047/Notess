import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resource: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: {
      type: String,
      enum: ['created', 'paid', 'failed', 'refunded'],
      default: 'created',
    },
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    receipt: { type: String },
    meta: { type: Object },
  },
  { timestamps: true },
);

purchaseSchema.index({ user: 1, resource: 1, status: 1 });

export const Purchase = mongoose.model('Purchase', purchaseSchema);
