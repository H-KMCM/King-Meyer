// Signed, Time-Expiring Token & URL Generator (HMAC-SHA256)
import crypto from 'crypto';

const SECRET_KEY = process.env.JWT_SECRET || 'km-secure-institutional-vault-secret-key-2026';

export interface SignedUrlPayload {
  documentId: string;
  userId: string;
  userEmail: string;
  userIp: string;
  expiresAt: number; // Unix timestamp in seconds
}

export function generateSignedDocumentToken(
  documentId: string,
  userId: string,
  userEmail: string,
  userIp: string,
  validityMinutes = 15
): string {
  const expiresAt = Math.floor(Date.now() / 1000) + Math.min(validityMinutes, 15) * 60;
  const payload: SignedUrlPayload = {
    documentId,
    userId,
    userEmail,
    userIp,
    expiresAt,
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(payloadBase64)
    .digest('base64url');

  return `${payloadBase64}.${signature}`;
}

export function verifySignedDocumentToken(token: string): { valid: boolean; payload?: SignedUrlPayload; error?: string } {
  try {
    const [payloadBase64, signature] = token.split('.');
    if (!payloadBase64 || !signature) {
      return { valid: false, error: 'Malformed token' };
    }

    const expectedSignature = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(payloadBase64)
      .digest('base64url');

    if (signature !== expectedSignature) {
      return { valid: false, error: 'Invalid cryptographic signature' };
    }

    const payload: SignedUrlPayload = JSON.parse(
      Buffer.from(payloadBase64, 'base64url').toString('utf-8')
    );

    const now = Math.floor(Date.now() / 1000);
    if (payload.expiresAt < now) {
      return { valid: false, error: 'Signed document token expired (Max 15-minute validity exceeded)' };
    }

    return { valid: true, payload };
  } catch (err: any) {
    return { valid: false, error: 'Failed to verify token: ' + err.message };
  }
}
