import { supabase } from '@/lib/supabaseClient';
// import { sendVerificationEmail } from '@/lib/nodemailer';

export const loginUser = async (nim: string, email: string) => {
    try {
      // Generate token (misalnya 6 digit angka)
      const token = Math.floor(100000 + Math.random() * 900000).toString();
  
      // Simpan token ke database atau sesi (opsional, tergantung logika backend Anda)
  
      // Panggil API untuk mengirim email
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, token }),
      });
  
      if (!response.ok) {
        throw new Error('Gagal mengirim email');
      }
  
      return { success: true, token };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  export const verifyUser = async (nim: string, token: string) => {
    // Cek token verifikasi di database (misalnya di tabel 'users')
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('nim', nim)
      .eq('token', token)
      .single();
  
    if (error || !data) {
      return { success: false };
    }
  
    // Update status verifikasi pengguna
    const { error: updateError } = await supabase
      .from('users')
      .update({ is_verified: true })
      .eq('nim', nim);
  
    if (updateError) {
      return { success: false };
    }
  
    return { success: true };
  };
  