import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getAccessToken } from './actions/auth/auth-action'
 
export async function middleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;

  if (pathName === '/') {
    return NextResponse.rewrite(new URL('/en', request.url))
  }
  
  if (pathName.includes('panel') || pathName.includes('dashboard') || pathName.includes('settings')) {
    const accessToken = await getAccessToken();
    if(!accessToken){
      return NextResponse.rewrite(new URL('/en/auth/login', request.url))
    }
  }
}
