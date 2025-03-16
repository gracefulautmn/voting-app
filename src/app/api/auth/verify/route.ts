import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const { nim, token } = await request.json();
    
    // Get the user with matching NIM and token
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('nim', nim)
      .eq('verification_token', token)
      .single();

      console.log('Update response:', user, error);
    // Check if user exists
    if (error || !user) {
      return NextResponse.json(
        { error: 'Invalid NIM or verification token' },
        { status: 400 }
      );
    }
    console.log('User to update:', user);
    // Clear the token after successful verification
    await supabase
      .from('users')
      .update({
        verification_token: null,
        token_expires_at: null,
        is_verified: true,
        verified_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'An error occurred during verification' },
      { status: 500 }
    );
  }
}