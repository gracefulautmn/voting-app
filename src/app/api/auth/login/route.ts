import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { nim, email } = await request.json();

    // Validate NIM format (must be exactly 9 digits)
    if (!/^\d{9}$/.test(nim)) {
      return NextResponse.json(
        { error: 'NIM harus terdiri dari 9 digit angka.' },
        { status: 400 }
      );
    }

    // Get allowed NIM prefix from settings
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('allowed_nim_prefix')
      .single();

    if (settingsError) {
      console.error('Error fetching settings:', settingsError);
      return NextResponse.json(
        { error: 'Terjadi kesalahan sistem.' },
        { status: 500 }
      );
    }

    // Check if NIM has the correct program prefix
    const allowedPrefixes = settings?.allowed_nim_prefix?.split(',') || [];
    if (allowedPrefixes.length > 0) {
      const hasValidPrefix = allowedPrefixes.some((prefix: string) =>
        nim.startsWith(prefix.trim())
      );

      if (!hasValidPrefix) {
        return NextResponse.json(
          { error: 'NIM tidak valid untuk program studi yang diizinkan.' },
          { status: 400 }
        );
      }
    }

    // Validate email format (must be nim@student.universitaspertamina.ac.id)
    const expectedEmail = `${nim}@student.universitaspertamina.ac.id`;
    if (email !== expectedEmail) {
      return NextResponse.json(
        { error: 'Email harus dalam format NIM@student.universitaspertamina.ac.id' },
        { status: 400 }
      );
    }

    // Check if user exists
    let { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('nim', nim)
      .eq('email', email)
      .maybeSingle()

    if (userError) {
      console.error('Error checking user:', userError);
      return NextResponse.json(
        { error: 'Terjadi kesalahan sistem.' },
        { status: 500 }
      );
    }

    if (!user) {
      // Create user if not found
      const { data: newUser, error: newUserError } = await supabase
        .from('users')
        .insert([{ nim, email, role: 'user' }])
        .select()
        .single();

      if (newUserError) {
        console.error('Error creating user:', newUserError);
        return NextResponse.json(
          { error: 'Gagal membuat pengguna baru.' },
          { status: 500 }
        );
      }

      user = newUser; // Set user to the newly created user
    } else {
      // Check if user has already voted
      if (user.has_voted) {
        return NextResponse.json(
          { error: 'Pengguna sudah memberikan suara.' },
          { status: 400 }
        );
      }
    }

    // Generate verification token
    const token = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // Token valid for 15 minutes

    await supabase
      .from('users')
      .update({
        verification_token: token,
        token_expires_at: expiresAt.toISOString(),
      })
      .eq('id', user.id);

    // Call the email API route directly
    const emailResult = await fetch(new URL('/api/email', request.url), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, token }),
    });

    if (!emailResult.ok) {
      return NextResponse.json(
        { error: 'Gagal mengirim email verifikasi.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat proses login.' },
      { status: 500 }
    );
  }
}