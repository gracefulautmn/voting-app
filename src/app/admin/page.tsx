'use client';

import { useEffect, useState } from 'react';
import { fetchCandidates, addCandidate, deleteCandidate, updateCandidate, fetchSettings, updateSettings } from '@/utils/admin';

// Define proper types
interface Candidate {
  id: string;
  name: string;
  position: string;
}

interface Settings {
  id: string;
  allowed_nim_prefix: string;
}

export default function AdminPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [newCandidate, setNewCandidate] = useState({ name: '', position: 'ketua' });
  const [nimPrefix, setNimPrefix] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const candidateData = await fetchCandidates();
        setCandidates(candidateData);
        
        const settings = await fetchSettings();
        setNimPrefix(settings?.allowed_nim_prefix || '');
      } catch (error: any) {
        setMessage(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [message]);

  const handleAddCandidate = async () => {
    try {
      if (!newCandidate.name) {
        setMessage('Nama kandidat tidak boleh kosong');
        return;
      }
      
      await addCandidate(newCandidate);
      setNewCandidate({ name: '', position: 'ketua' });
      
      // Refresh the candidate list
      const candidateData = await fetchCandidates();
      setCandidates(candidateData);
      
      setMessage('Kandidat berhasil ditambahkan.');
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleDeleteCandidate = async (id: string) => {
    try {
      await deleteCandidate(id);
      
      // Refresh the candidate list
      const candidateData = await fetchCandidates();
      setCandidates(candidateData);
      
      setMessage('Kandidat berhasil dihapus.');
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleUpdateSettings = async () => {
    try {
      await updateSettings(nimPrefix);
      setMessage('Prefix NIM berhasil diperbarui.');
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Manajemen Kandidat</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Nama Kandidat"
          value={newCandidate.name}
          onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
          className="border p-2 mr-2"
        />
        <select
          value={newCandidate.position}
          onChange={(e) => setNewCandidate({ ...newCandidate, position: e.target.value })}
          className="border p-2 mr-2"
        >
          <option value="ketua">Ketua</option>
          <option value="wakil">Wakil</option>
        </select>
        <button 
          onClick={handleAddCandidate} 
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Tambah Kandidat
        </button>
      </div>

      <h2 className="text-xl mb-2">Daftar Kandidat</h2>
      {candidates.length === 0 ? (
        <p className="text-gray-500">Belum ada kandidat</p>
      ) : (
        <ul className="space-y-2">
          {candidates.map((candidate: Candidate) => (
            <li key={candidate.id} className="border p-2 mb-2 flex justify-between items-center">
              <span>{candidate.name} - {candidate.position}</span>
              <button 
                onClick={() => handleDeleteCandidate(candidate.id)} 
                className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Hapus
              </button>
            </li>
          ))}
        </ul>
      )}

      <h2 className="text-xl mt-6 mb-2">Pengaturan Prefix NIM</h2>
      <div className="flex items-center">
        <input
          type="text"
          value={nimPrefix}
          onChange={(e) => setNimPrefix(e.target.value)}
          className="border p-2 mr-2"
          placeholder="Contoh: 2022"
        />
        <button 
          onClick={handleUpdateSettings} 
          className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Perbarui Prefix
        </button>
      </div>

      {message && (
        <div className={`mt-4 p-2 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}
    </div>
  );
}