import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isVerified = request.cookies.get('is_verified')?.value;

  if (!isVerified && request.nextUrl.pathname.startsWith('/vote')) {
    return NextResponse.redirect(new URL('/verify', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/vote'],
};
