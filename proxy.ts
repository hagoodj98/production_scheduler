import { NextRequest, NextResponse } from 'next/server';
import { handleError } from '@/utils/ErrorHandlingHelper';
export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (pathname === '/api/authorize-permission' || pathname === '/') {
    return NextResponse.next();
  }

  const session = req.cookies.get('session')?.value;

  const url = new URL(req.url);

  // Skip authorization for load-jobs endpoint
  if (url.pathname.includes('/load-jobs')) {
    return;
  }
  if (url.pathname.includes('/assign-order') || url.pathname.includes('/add-resource')) {
    try {
      const response = await fetch(
        `${req.nextUrl.origin}/api/auth/permission-check?path=${url.pathname}`,
        {
          method: 'GET',
          headers: {
            cookie: `session=${session}`,
          },
        },
      );
      if (!response.ok) {
        const data = await response.json();
        const message = data.error;
        const redirectUrl = new URL('/', req.url);
        redirectUrl.searchParams.append('msg', encodeURIComponent(message));
        return NextResponse.redirect(redirectUrl);
      }
      return NextResponse.next();
    } catch (error) {
      return handleError(error);
    }
  }
  return NextResponse.next();
}
