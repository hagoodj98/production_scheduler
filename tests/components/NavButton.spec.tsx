/** @vitest-environment jsdom */
// Note: This test file was previously for NavButton and has been updated for ActionButton.

// Updated test file for ActionButton component

import { render, screen } from '@testing-library/react';
import ActionButton from '@/app/components/ActionButton';
import { withAppProviders } from './testUtils';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    // Render a plain anchor in tests.
    <a href={href}>{children}</a>
  ),
}));

vi.mock('@/app/components/AdminAccessForm', () => ({
  default: () => null,
}));

describe('ActionButton', () => {
  it('renders the admin access button when the user is unauthenticated', () => {
    render(
      withAppProviders(<ActionButton resourceLabel="Create Order" pageNav="/assign-resource" />),
    );

    expect(screen.getByRole('button', { name: /create order/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /create order/i })).not.toBeInTheDocument();
  });
});
