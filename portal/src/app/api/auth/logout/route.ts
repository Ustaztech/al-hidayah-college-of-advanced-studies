import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/portal/login', request.url), 303);
  response.cookies.delete('ahcas_portal_session');
  return response;
}

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/portal/login', request.url), 303);
  response.cookies.delete('ahcas_portal_session');
  return response;
}
