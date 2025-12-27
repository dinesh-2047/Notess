import 'dotenv/config';

const normalizeString = (value, fallback = '') => {
  if (value === undefined || value === null) return fallback;
  return typeof value === 'string' ? value.trim() : String(value).trim();
};

const boolean = (value, fallback = false) => {
  if (value === undefined) return fallback;
  return ['true', '1', 'yes', 'on'].includes(String(value).toLowerCase());
};

export const env = {
  nodeEnv: normalizeString(process.env.NODE_ENV, 'development'),
  port: Number(process.env.PORT) || 5001,
  baseUrl: normalizeString(process.env.BASE_URL, 'http://localhost:5001'),
  clientUrl: normalizeString(process.env.CLIENT_URL, 'http://localhost:5173'),
  mongoUri: normalizeString(process.env.MONGODB_URI),
  jwt: {
    accessSecret: normalizeString(process.env.JWT_ACCESS_SECRET),
    refreshSecret: normalizeString(process.env.JWT_REFRESH_SECRET),
    accessExpiresIn: normalizeString(process.env.JWT_ACCESS_EXPIRES_IN, '15m'),
    refreshExpiresIn: normalizeString(process.env.JWT_REFRESH_EXPIRES_IN, '7d'),
  },
  brevo: {
    apiKey: normalizeString(process.env.BREVO_API_KEY),
    senderEmail: normalizeString(process.env.BREVO_SENDER),
    senderName: normalizeString(process.env.BREVO_SENDER_NAME, 'Notess'),
  },
  razorpay: {
    keyId: normalizeString(process.env.RAZORPAY_KEY_ID),
    keySecret: normalizeString(process.env.RAZORPAY_KEY_SECRET),
    webhookSecret: normalizeString(process.env.RAZORPAY_WEBHOOK_SECRET),
  },
  cloudinary: {
    cloudName: normalizeString(process.env.CLOUDINARY_CLOUD_NAME),
    apiKey: normalizeString(process.env.CLOUDINARY_API_KEY),
    apiSecret: normalizeString(process.env.CLOUDINARY_API_SECRET),
  },
  security: {
    corsOrigins: normalizeString(process.env.CORS_ORIGINS)
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
    enableRateLimit: boolean(process.env.ENABLE_RATE_LIMIT, true),
  },
  otp: {
    expiryMinutes: Number(process.env.OTP_EXPIRY_MINUTES) || 10,
  },
};
