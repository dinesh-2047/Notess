import crypto from 'crypto';
import dayjs from 'dayjs';
import { env } from '../config/env.js';
import { sendMail } from '../utils/mailSender.js';

const OTP_DIGITS = 6;

export const generateOtp = () => crypto.randomInt(10 ** (OTP_DIGITS - 1), 10 ** OTP_DIGITS).toString();

export const hashOtp = (otp) => crypto.createHash('sha256').update(otp).digest('hex');

export const getOtpExpiry = () => dayjs().add(env.otp.expiryMinutes, 'minute').toDate();

export const sendOtpEmail = async ({ email, otp, reason = 'account verification' }) => {
  const subject = `Your Notess OTP (${reason})`;
  const text = `Use the OTP ${otp} to complete ${reason}. It expires in ${env.otp.expiryMinutes} minutes.`;
  const html = `<p>Use the OTP <strong>${otp}</strong> to complete ${reason}.<br/>This code expires in ${env.otp.expiryMinutes} minutes.</p>`;

  await sendMail({ to: email, subject, text, html });
};

export const verifyOtp = (storedHash, otp, expiry) => {
  if (!storedHash || !otp || !expiry) return false;
  if (dayjs(expiry).isBefore(dayjs())) return false;
  const incomingHash = hashOtp(otp);
  const storedBuffer = Buffer.from(storedHash, 'hex');
  const incomingBuffer = Buffer.from(incomingHash, 'hex');
  return crypto.timingSafeEqual(storedBuffer, incomingBuffer);
};
