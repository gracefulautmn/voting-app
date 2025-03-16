import { supabase } from '@/lib/supabaseClient';

export const fetchCandidates = async () => {
  const { data, error } = await supabase.from('candidates').select('*');
  if (error) throw new Error(error.message);
  return data;
};

export const addCandidate = async (candidate: { name: string; position: string }) => {
  const { error } = await supabase.from('candidates').insert(candidate);
  if (error) throw new Error(error.message);
};

export const updateCandidate = async (id: string, candidate: { name: string; position: string }) => {
  const { error } = await supabase.from('candidates').update(candidate).eq('id', id);
  if (error) throw new Error(error.message);
};

export const deleteCandidate = async (id: string) => {
  const { error } = await supabase.from('candidates').delete().eq('id', id);
  if (error) throw new Error(error.message);
};

export const fetchSettings = async () => {
  const { data, error } = await supabase.from('settings').select('*').single();
  if (error) throw new Error(error.message);
  return data;
};

export const updateSettings = async (prefix: string) => {
  const { error } = await supabase.from('settings').update({ allowed_nim_prefix: prefix }).eq('id', 'settings-id');
  if (error) throw new Error(error.message);
};