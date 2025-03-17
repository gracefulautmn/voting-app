'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Candidate {
  id: string;
  nama_partai: string;
  ketua: string;
  wakil: string;
  visi: string;
  misi: string;
  created_at: string;
}

export default function AdminPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [nimPrefix, setNimPrefix] = useState('');
  const [newCandidate, setNewCandidate] = useState<Partial<Candidate>>({
    nama_partai: '',
    ketua: '',
    wakil: '',
    visi: '',
    misi: ''
  });

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    const { data } = await supabase.from('candidates').select('*');
    setCandidates(data || []);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCandidate({
      ...newCandidate,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addCandidate(newCandidate);
    // Reset form after submission
    setNewCandidate({
      nama_partai: '',
      ketua: '',
      wakil: '',
      visi: '',
      misi: ''
    });
  };

  const addCandidate = async (candidate: Partial<Candidate>) => {
    await supabase.from('candidates').insert([candidate]);
    fetchCandidates();
  };

  const deleteCandidate = async (id: string) => {
    await supabase.from('candidates').delete().eq('id', id);
    fetchCandidates();
  };

  const updateNimPrefix = async () => {
    await supabase.from('settings').update({ allowed_nim_prefix: nimPrefix }).eq('id', 'settings-id');
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Manajemen Kandidat</h2>
      
      {/* Candidate list */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Daftar Kandidat</h3>
        {candidates.length === 0 ? (
          <p>Belum ada kandidat</p>
        ) : (
          candidates.map((candidate) => (
            <div key={candidate.id} className="border p-3 mb-2 rounded">
              <p className="font-semibold">{candidate.nama_partai}</p>
              <p>Ketua: {candidate.ketua} | Wakil: {candidate.wakil}</p>
              <button 
                onClick={() => deleteCandidate(candidate.id)} 
                className="bg-red-500 text-white px-3 py-1 rounded mt-2"
              >
                Hapus
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add candidate form */}
      <div className="mb-8 p-4 border rounded">
        <h3 className="text-lg font-semibold mb-2">Tambah Kandidat Baru</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block mb-1">Nama Partai</label>
            <input
              type="text"
              name="nama_partai"
              value={newCandidate.nama_partai}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="block mb-1">Nama Ketua</label>
            <input
              type="text"
              name="ketua"
              value={newCandidate.ketua}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="block mb-1">Nama Wakil</label>
            <input
              type="text"
              name="wakil"
              value={newCandidate.wakil}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="block mb-1">Visi</label>
            <textarea
              name="visi"
              value={newCandidate.visi}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              rows={3}
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="block mb-1">Misi</label>
            <textarea
              name="misi"
              value={newCandidate.misi}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              rows={3}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Tambah Kandidat
          </button>
        </form>
      </div>

      {/* NIM Prefix settings */}
      <div className="p-4 border rounded">
        <h2 className="text-lg font-semibold mb-2">Pengaturan Prefix NIM</h2>
        <div className="flex items-center">
          <input 
            value={nimPrefix} 
            onChange={(e) => setNimPrefix(e.target.value)} 
            placeholder="Prefix NIM" 
            className="p-2 border rounded mr-2"
          />
          <button 
            onClick={updateNimPrefix}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Update Prefix
          </button>
        </div>
      </div>
    </div>
  );
}