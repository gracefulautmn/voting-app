export async function loginUser(nim: string, email: string) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nim, email }),
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
  
    return await response.json();
  }
  
  export async function verifyToken(nim: string, token: string) {
    const response = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nim, token }),
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Verification failed');
    }
  
    return await response.json();
  }