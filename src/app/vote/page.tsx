'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchCandidates, submitVote } from '@/utils/vote';
import { supabase } from '@/lib/supabaseClient';

interface Candidate {
  id: string;
  name: string;
  position: string;
}

export default function VotePage() {
  const router = useRouter();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        const data = await fetchCandidates();
        setCandidates(data);
      } catch (error: any) {
        setMessage(`Gagal memuat kandidat: ${error.message}`);
      }
    };
    loadCandidates();
  }, []);

  const handleVote = async () => {
    if (!selectedCandidateId) {
      setMessage('Pilih kandidat terlebih dahulu.');
      return;
    }
  
    try {
      // Check if user is authenticated
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      console.log('Session Data:', sessionData); // Log session data
      console.log('Session Error:', sessionError); // Log session error
  
      if (sessionError || !sessionData.session) {
        router.push('/login');
        return;
      }
  
      await submitVote(selectedCandidateId);
      setMessage('Voting berhasil. Terima kasih!');
    } catch (error: any) {
      setMessage(`Gagal melakukan voting: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Pilih Ketua dan Wakil Ketua</h1>
      <div className="space-y-4 w-full max-w-md">
        {candidates.map((candidate: Candidate) => (
          <div key={candidate.id} className="border p-4 rounded">
            <label className="flex items-center">
              <input
                type="radio"
                name="candidate"
                value={candidate.id}
                onChange={() => setSelectedCandidateId(candidate.id)}
                className="mr-2"
              />
              {candidate.name} - {candidate.position}
            </label>
          </div>
        ))}
        <button
          onClick={handleVote}
          className="p-2 bg-blue-500 text-white rounded w-full"
        >
          Submit Vote
        </button>
        {message && (
          <p className={`text-center mt-4 ${message.includes('berhasil') ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}