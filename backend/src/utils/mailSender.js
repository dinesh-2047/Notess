import fetch from 'node-fetch';
import { env } from '../config/env.js';

/**
 * Send an email via Brevo API.
 */
export const sendMail = async ({ to, subject, text = '', html = '' }) => {
  if (!env.brevo.apiKey || !env.brevo.senderEmail) {
    throw new Error('Brevo credentials are not configured.');
  }

  const recipients = Array.isArray(to) ? to : [to];

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': env.brevo.apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: env.brevo.senderName, email: env.brevo.senderEmail },
        to: recipients.map((email) => ({ email })),
        subject,
        textContent: text,
        htmlContent: html,
      }),
    });

    if (!response.ok) {
      const errorPayload = await response.text();
      throw new Error(`Brevo error: ${errorPayload}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Unable to send email');
  }
};
