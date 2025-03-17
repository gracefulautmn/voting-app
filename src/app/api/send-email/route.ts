import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { email, token } = await req.json();

    if (!email || !token) {
      return NextResponse.json({ message: 'Email dan token wajib diisi' }, { status: 400 });
    }

    // Cek apakah email valid (opsional, sesuai kebutuhan Anda)
    const emailRegex = /^[\w-\.]+@student\.universitaspertamina\.ac\.id$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: 'Email tidak valid' }, { status: 400 });
    }

    // Konfigurasi Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Kirim email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Token Verifikasi Voting',
      text: `Token verifikasi Anda adalah: ${token}`,
    });

    return NextResponse.json({ message: 'Email berhasil dikirim' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ message: 'Gagal mengirim email' }, { status: 500 });
  }
}
