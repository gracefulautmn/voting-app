'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/utils/auth';

export default function LoginPage() {
  const [nim, setNim] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const handleLogin = async () => {
    setError('');
    setMessage('');
    try {
      const result = await loginUser(nim, email);
      if (result.success) {
        setMessage('Token verifikasi telah dikirim ke email.');
        // Redirect ke halaman verifikasi jika perlu
        router.push('/verify');
      }
    } catch (error) {
      setError('Login gagal. Pastikan NIM dan email sesuai.');
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
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="border p-2 w-full rounded"
      />
      <button
        onClick={handleLogin}
        className="p-2 bg-blue-500 text-white rounded w-full"
      >
        Login
      </button>
      {message && <p className="text-green-500">{message}</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
