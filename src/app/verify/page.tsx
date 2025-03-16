'use client';

import { useState } from 'react';
import { verifyToken } from '@/utils/auth';
import { useRouter } from 'next/navigation';

export default function VerifyPage() {
  const [nim, setNim] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyToken(nim, token);
      document.cookie = 'is_verified=true; path=/';
      router.push('/vote');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Verify Token</h1>
      <form onSubmit={handleVerify} className="space-y-4">
        <input
          type="text"
          placeholder="NIM"
          value={nim}
          onChange={(e) => setNim(e.target.value)}
          className="p-2 border rounded w-full"
          required
        />
        <input
          type="text"
          placeholder="Verification Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="p-2 border rounded w-full"
          required
        />
        <button type="submit" disabled={loading} className="p-2 bg-green-500 text-white rounded w-full">
          {loading ? 'Verifying...' : 'Verify Token'}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}
