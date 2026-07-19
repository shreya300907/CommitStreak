import { NextResponse } from 'next/server';

export function middleware(request){
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === '/register&login' || pathname === '/';
  const isProtectedPage = pathname.startsWith('/dashboard');

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!token && isProtectedPage) {
    return NextResponse.redirect(new URL('/register&login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/register&login', '/dashboard/:path*'],
};