import nodemailer from 'nodemailer';

export interface UserRecord {
  id: string;
  email: string;
  fullName: string;
  passwordHash: string;
  verified: boolean;
  createdAt: string;
}

export interface OtpRecord {
  otp: string;
  expiresAt: number;
  fullName?: string;
  password?: string;
  purpose: 'register' | 'login';
}

// In-memory user database
const users = new Map<string, UserRecord>([
  [
    'vaidya.acharya@ipsakti.ai',
    {
      id: 'usr-demo-1',
      email: 'vaidya.acharya@ipsakti.ai',
      fullName: 'Acharya Dhanvantari',
      passwordHash: 'Ayurveda@2026',
      verified: true,
      createdAt: new Date('2026-01-01').toISOString()
    }
  ]
]);

// In-memory OTP storage
const otpStore = new Map<string, OtpRecord>();

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim().toLowerCase();
  // Standard RFC 5322 regex validation requiring domain & TLD
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(trimmed);
}

export function generateOtp(): string {
  // Generate a cryptographically distinct 6-digit code
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getUserByEmail(email: string): UserRecord | undefined {
  return users.get(email.trim().toLowerCase());
}

export function saveUser(user: UserRecord): void {
  users.set(user.email.trim().toLowerCase(), user);
}

export function setOtp(email: string, record: OtpRecord): void {
  otpStore.set(email.trim().toLowerCase(), record);
}

export function getOtp(email: string): OtpRecord | undefined {
  return otpStore.get(email.trim().toLowerCase());
}

export function removeOtp(email: string): void {
  otpStore.delete(email.trim().toLowerCase());
}

export async function sendOtpEmail(
  email: string,
  otp: string,
  fullName?: string,
  purpose: 'register' | 'login' = 'register'
): Promise<{ success: boolean; realEmailSent: boolean; devOtp?: string; message: string }> {
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || `IP-SAKTI Sahayak <${smtpUser || 'noreply@ipsakti.ai'}>`;

  const actionText = purpose === 'register' ? 'verifying your email to register' : 'logging into your account';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5fbf6; margin: 0; padding: 24px; color: #171d1a; }
          .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #c1c8c2; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
          .header { background: #042e1e; padding: 28px 24px; text-align: center; }
          .title { color: #ffffff; font-size: 22px; font-weight: 600; margin: 0; font-family: serif; }
          .subtitle { color: #ffb958; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 6px; }
          .content { padding: 32px 28px; text-align: center; }
          .badge { display: inline-block; padding: 4px 12px; background: #eff5f0; color: #845400; border: 1px solid #c1c8c2; font-size: 11px; font-weight: 700; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px; }
          .greeting { font-size: 18px; color: #042e1e; font-weight: 600; margin-bottom: 10px; font-family: serif; }
          .text { font-size: 14px; color: #414844; line-height: 1.6; margin-bottom: 24px; }
          .otp-box { background: #eff5f0; border: 2px dashed #845400; border-radius: 12px; padding: 18px 28px; display: inline-block; margin-bottom: 24px; }
          .otp-code { font-size: 38px; font-weight: 800; letter-spacing: 8px; color: #845400; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
          .expiry { font-size: 12px; color: #717973; line-height: 1.5; }
          .footer { background: #eff5f0; padding: 18px 24px; text-align: center; font-size: 11px; color: #717973; border-top: 1px solid #c1c8c2; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="title">IP-SAKTI Sahayak</h1>
            <div class="subtitle">Vedic Wisdom Powered by RAG AI</div>
          </div>
          <div class="content">
            <span class="badge">Canonical Email Verification</span>
            <div class="greeting">Namaste ${fullName ? fullName : 'Seeker'},</div>
            <p class="text">
              Use the following One-Time Password (OTP) for ${actionText} on the IP-SAKTI Ayurvedic Intelligence platform:
            </p>
            <div class="otp-box">
              <div class="otp-code">${otp}</div>
            </div>
            <div class="expiry">
              This code expires in <strong>10 minutes</strong>. For security, please do not share this code with anyone.
            </div>
          </div>
          <div class="footer">
            Brihat Trayi Codified Intelligence • Charaka Saṁhitā | Suśruta Saṁhitā | Aṣṭāṅga Hṛdayam
          </div>
        </div>
      </body>
    </html>
  `;

  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: smtpFrom,
        to: email,
        subject: `${otp} is your IP-SAKTI verification code`,
        text: `Namaste, your IP-SAKTI verification code is: ${otp}. It will expire in 10 minutes.`,
        html: htmlContent,
      });

      console.log(`[AUTH] Real email successfully sent to ${email} with OTP ${otp}`);
      return {
        success: true,
        realEmailSent: true,
        message: `A 6-digit verification code was sent to ${email}. Please check your inbox and spam folder.`
      };
    } catch (err: any) {
      console.error('[AUTH] SMTP dispatch error:', err?.message || err);
      return {
        success: true,
        realEmailSent: false,
        devOtp: otp,
        message: `SMTP error (${err.message}). Your verification code is: ${otp}`
      };
    }
  } else {
    console.log(`[AUTH-LOCAL] Generated OTP for ${email}: ${otp}`);
    return {
      success: true,
      realEmailSent: false,
      devOtp: otp,
      message: `Verification code generated for ${email}. (Dev preview: Your code is ${otp})`
    };
  }
}
