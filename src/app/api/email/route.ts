import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email, token } = await request.json();

    // Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: Boolean(process.env.EMAIL_SECURE),
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
        debug: true, // Aktifkan debugging
        logger: true, // Log aktivitas
      });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Voting System" <noreply@example.com>',
      to: email,
      subject: 'Verification Token',
      html: `
        <h1>Your Verification Token</h1>
        <p>Use the following token to verify your identity: <strong>${token}</strong></p>
        <p>This token will expire in 15 minutes.</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send verification email' },
      { status: 500 }
    );
  }
}