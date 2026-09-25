import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const { fetchMock } = vi.hoisted(() => ({ fetchMock: vi.fn() }));
vi.stubGlobal('fetch', fetchMock);

import { proxy } from '@/proxy';

describe('proxy permission gate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.stubGlobal('fetch', fetchMock);
  });

  it('continues when the authorization endpoint allows the request', async () => {
    fetchMock.mockResolvedValueOnce(new Response('{}', { status: 200 }));
    const request = new NextRequest('http://localhost/assign-order', {
      headers: { cookie: 'session=valid-session' },
    });

    const response = await proxy(request);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [authorizationUrl, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(new URL(authorizationUrl).searchParams.get('path')).toBe('/assign-order');
    expect(options.headers).toEqual({ cookie: 'session=valid-session' });
    expect(response?.headers.get('x-middleware-next')).toBe('1');
  });

  it('redirects to the home page when authorization is denied', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ error: 'You are unauthorized to assign an order' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    const request = new NextRequest('http://localhost/assign-order');

    const response = await proxy(request);

    expect(response?.status).toBe(307);
    const location = new URL(response!.headers.get('location')!);
    expect(location.pathname).toBe('/');
    expect(decodeURIComponent(location.searchParams.get('msg')!)).toBe(
      'You are unauthorized to assign an order',
    );
  });

  it('does not recursively authorize the authorization endpoint', async () => {
    const request = new NextRequest('http://localhost/api/authorize-permission');

    const response = await proxy(request);

    expect(response?.headers.get('x-middleware-next')).toBe('1');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('skips authorization for the load-jobs endpoint', async () => {
    const request = new NextRequest('http://localhost/api/load-jobs-to-chart');

    const response = await proxy(request);

    expect(response).toBeUndefined();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
