import { supabase } from '@/lib/supabaseClient';

export const fetchCandidates = async () => {
  const { data, error } = await supabase.from('candidates').select('*');
  if (error) throw new Error(error.message);
  return data;
};

export const submitVote = async (candidateId: string) => {
  // Panggil API untuk mendapatkan NIM dari cookie
  const response = await fetch('/api/get-nim');
  const { nim } = await response.json();

  if (!nim) {
    throw new Error('User tidak terautentikasi. Silakan login kembali.');
  }

  // Get user ID from the database using NIM
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('nim', nim)
    // .eq('is_verified', true)
    .single();

  if (userError || !userData) {
    throw new Error('User tidak ditemukan atau belum terverifikasi.');
  }

  const userId = userData.id;

  // Check if user has already voted
  const { data: existingVotes, error: checkError } = await supabase
    .from('votes')
    .select('id')
    .eq('user_id', userId);

  if (checkError) throw new Error(checkError.message);
  if (existingVotes && existingVotes.length > 0) throw new Error('Anda sudah melakukan voting.');

  // Submit vote
  const { error: voteError } = await supabase.from('votes').insert({
    user_id: userId,
    candidate_id: candidateId,
  });

  if (voteError) throw new Error(voteError.message);

  // Update user's has_voted status
  const { error: updateError } = await supabase
    .from('users')
    .update({ has_voted: true })
    .eq('id', userId);

  if (updateError) throw new Error(updateError.message);
};