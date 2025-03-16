// app/api/get-nim/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();
  const nim = cookieStore.get('verified_nim')?.value || null;
  console.log('NIM from cookie:', nim); // Log nilai NIM
  return NextResponse.json({ nim });
}