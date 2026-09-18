import { NextRequest, NextResponse } from 'next/server';

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
        const redirectUrl = new URL('/', req.url);
        return NextResponse.redirect(redirectUrl);
      }
      return NextResponse.next();
    } catch (error) {
      console.error('Proxy error:', error);
      return NextResponse.json(
        { error: 'There was an internal error. Try again later' },
        { status: 500 },
      );
    }
  }
}
