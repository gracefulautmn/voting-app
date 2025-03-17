'use client';
import { useEffect, useState } from 'react';
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

export default function VotingPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{type: 'success' | 'error' | 'info' | null, text: string}>({
    type: null,
    text: ''
  });
  const [hasVoted, setHasVoted] = useState<boolean>(false);

  useEffect(() => {
    fetchCandidates();
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    // Get current user session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      const currentUserId = session.user.id;
      setUserId(currentUserId);
      
      // Check if user has already voted
      const { data: votes } = await supabase
        .from('votes')
        .select('*')
        .eq('user_id', currentUserId);
      
      if (votes && votes.length > 0) {
        setHasVoted(true);
        setMessage({
          type: 'info',
          text: 'Anda sudah memberikan suara sebelumnya.'
        });
      }
    } else {
      setMessage({
        type: 'error',
        text: 'Anda harus login terlebih dahulu untuk memberikan suara.'
      });
    }
  };

  const fetchCandidates = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('candidates').select('*');
    
    if (error) {
      setMessage({
        type: 'error',
        text: 'Gagal memuat data kandidat: ' + error.message
      });
    } else {
      setCandidates(data || []);
    }
    setLoading(false);
  };

  const handleVote = async () => {
    // Validate selection
    if (!selectedCandidate) {
      setMessage({
        type: 'error',
        text: 'Silahkan pilih kandidat terlebih dahulu.'
      });
      return;
    }

    // Validate user logged in
    if (!userId) {
      setMessage({
        type: 'error',
        text: 'Anda harus login terlebih dahulu untuk memberikan suara.'
      });
      return;
    }

    // Check if already voted
    if (hasVoted) {
      setMessage({
        type: 'error',
        text: 'Anda sudah memberikan suara sebelumnya.'
      });
      return;
    }

    setLoading(true);
    setMessage({type: null, text: ''});

    // Submit vote
    const { error } = await supabase.from('votes').insert({
      user_id: userId,
      candidate_id: selectedCandidate,
    });

    if (error) {
      setMessage({
        type: 'error',
        text: 'Gagal melakukan voting: ' + error.message
      });
    } else {
      setMessage({
        type: 'success',
        text: 'Terima kasih! Suara Anda telah berhasil direkam.'
      });
      setHasVoted(true);
    }
    
    setLoading(false);
  };

  // Function to get selected candidate name
  const getSelectedCandidateName = () => {
    const candidate = candidates.find(c => c.id === selectedCandidate);
    return candidate ? `${candidate.nama_partai} (${candidate.ketua} & ${candidate.wakil})` : '';
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Pemilihan Kandidat</h1>
      
      {/* Message display */}
      {message.type && (
        <div className={`p-4 mb-4 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-800' :
          message.type === 'error' ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">Memuat...</div>
      ) : (
        <>
          {!hasVoted ? (
            <>
              <div className="mb-4">
                <p className="font-semibold mb-2">Silahkan pilih kandidat:</p>
              </div>
              
              <div className="grid gap-4 mb-6">
                {candidates.map((candidate) => (
                  <div 
                    key={candidate.id} 
                    className={`border p-4 rounded cursor-pointer ${selectedCandidate === candidate.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}
                    onClick={() => setSelectedCandidate(candidate.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div>
                        <input 
                          type="radio" 
                          name="vote" 
                          id={`candidate-${candidate.id}`}
                          checked={selectedCandidate === candidate.id}
                          onChange={() => setSelectedCandidate(candidate.id)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label htmlFor={`candidate-${candidate.id}`} className="font-bold block text-lg">
                          {candidate.nama_partai}
                        </label>
                        <p className="mb-2"><span className="font-semibold">Ketua:</span> {candidate.ketua}</p>
                        <p className="mb-2"><span className="font-semibold">Wakil:</span> {candidate.wakil}</p>
                        
                        <div className="mt-3 text-sm">
                          <details>
                            <summary className="font-semibold cursor-pointer">Lihat Visi & Misi</summary>
                            <div className="mt-2 pl-3 border-l-2 border-gray-300">
                              <p className="font-semibold">Visi:</p>
                              <p className="mb-2">{candidate.visi}</p>
                              <p className="font-semibold">Misi:</p>
                              <p>{candidate.misi}</p>
                            </div>
                          </details>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {candidates.length === 0 && (
                <div className="text-center py-6 bg-gray-100 rounded">
                  Belum ada kandidat tersedia.
                </div>
              )}

              {selectedCandidate && (
                <div className="mb-4 p-3 bg-blue-50 rounded">
                  <p>Anda memilih: <strong>{getSelectedCandidateName()}</strong></p>
                </div>
              )}

              <button 
                onClick={handleVote} 
                disabled={!selectedCandidate || loading || !userId || hasVoted}
                className="mt-4 bg-blue-500 text-white px-6 py-3 rounded font-medium w-full
                          disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? 'Memproses...' : 'Kirim Suara'}
              </button>
            </>
          ) : (
            <div className="bg-green-50 p-6 rounded-lg text-center">
              <h3 className="text-xl font-bold text-green-700 mb-2">Terima Kasih!</h3>
              <p>Suara Anda telah berhasil direkam.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}