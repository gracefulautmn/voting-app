'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { verifyUser } from '@/utils/auth';

export default function VerifyPage() {
  const [nim, setNim] = useState('');
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter(); // Inisialisasi router

  const handleVerify = async () => {
    setError('');
    setMessage('');
    try {
      const result = await verifyUser(nim, token);
      if (result.success) {
        setMessage('Verifikasi berhasil. Anda dapat melanjutkan ke voting.');
        router.push('/vote');
      } else {
        setError('Verifikasi gagal. Token tidak valid.');
      }
    } catch {
      setError('Verifikasi gagal. Periksa NIM dan token Anda.');
    }
  };

  return (
    <div className="p-6 space-y-4">
      <input
        value={nim}
        onChange={(e) => setNim(e.target.value)}
        placeholder="NIM"
        className="border p-2 w-full rounded"
      />
      <input
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Token"
        className="border p-2 w-full rounded"
      />
      <button
        onClick={handleVerify}
        className="p-2 bg-green-500 text-white rounded w-full"
      >
        Verifikasi
      </button>
      {message && <p className="text-green-500">{message}</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
