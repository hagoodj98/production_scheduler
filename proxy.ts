import { NextRequest, NextResponse } from 'next/server';
import { handleError } from '@/utils/ErrorHandlingHelper';
export async function proxy(req: NextRequest) {
  if (req.nextUrl.pathname === '/api/authorize-permission') {
    return NextResponse.next();
  }

  const session = req.cookies.get('session')?.value;
  /*
  if (!session) {
    const redirectUrl = new URL('/', req.url);
    return NextResponse.redirect(redirectUrl);
  }
    */
  const url = new URL(req.url);

  // Skip authorization for load-jobs endpoint
  if (url.pathname.includes('/load-jobs')) {
    return;
  }
  if (url.pathname.includes('/assign-order')) {
    try {
      const response = await fetch(
        `${req.nextUrl.origin}/api/authorize-permission?path=${url.pathname}`,
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
}
