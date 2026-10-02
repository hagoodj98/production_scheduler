/** @vitest-environment jsdom */

import { render, screen } from '@testing-library/react';
import { SWRConfig } from 'swr';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import OrderLogTable from '@/app/components/OrderLogTable';
import { withAppProviders } from './testUtils';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

// Each test gets its own SWR cache so a prior test's fetch result can't leak in
const renderTable = () =>
  render(
    withAppProviders(
      <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
        <OrderLogTable />
      </SWRConfig>,
    ),
  );

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

const mockPayload = {
  message: 'Order log loaded successfully',
  logs: [
    {
      id: 1,
      orderId: 101,
      creationDate: '2026-03-08 at 09:00AM',
      employeeId: 'admin-1',
      employee: { employeeId: 'admin-1', name: 'Alex Admin', role: 'Admin' },
      description: 'Created order',
      orderId_text: undefined,
      order: {
        employee: { name: 'Jordan Worker', role: 'Operator' },
        resourceStatus: 'Completed',
        resource: { resource_name: 'CNC Machine 1' },
      },
    },
    {
      id: 2,
      orderId: 102,
      creationDate: '2026-03-08 at 10:00AM',
      employeeId: 'admin-1',
      employee: { employeeId: 'admin-1', name: 'Alex Admin', role: 'Admin' },
      description: 'Deleted order',
      order: {
        employee: { name: 'Sam Worker', role: 'Operator' },
        resourceStatus: 'Deleted',
        resource: { resource_name: 'Mixer A' },
      },
    },
  ],
};

describe('OrderLogTable', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          ({
            ok: true,
            json: async () => mockPayload,
          }) as Response,
      ),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders column headers and fetched row data', async () => {
    renderTable();

    expect(screen.getByText('Log#')).toBeInTheDocument();
    expect(screen.getByText('Order ID')).toBeInTheDocument();
    expect(screen.getByText('Assigned Employee')).toBeInTheDocument();

    expect(await screen.findByText('101')).toBeInTheDocument();
    expect(screen.getByText('Jordan Worker')).toBeInTheDocument();
    expect(screen.getByText('CNC Machine 1')).toBeInTheDocument();
    expect(screen.getByText('Created order')).toBeInTheDocument();
  });

  it('color-codes a row as completed when its status is Completed', async () => {
    renderTable();

    const cell = await screen.findByText('CNC Machine 1');
    const row = cell.closest('tr');

    expect(row).toHaveClass('bg-(--status-completed)');
  });

  it('color-codes a row as deleted when its status is Deleted', async () => {
    renderTable();

    const cell = await screen.findByText('Mixer A');
    const row = cell.closest('tr');

    expect(row).toHaveClass('bg-(--status-deleted)');
  });
});
