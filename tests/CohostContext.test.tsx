import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CohostProvider, useCohost } from '../src';

const TestComponent = () => {
  const client = useCohost();
  return <div>{client ? 'Connected' : 'Missing'}</div>;
};

describe('CohostProvider', () => {
  it('provides the client context', () => {
    render(
      <CohostProvider token="test-key">
        <TestComponent />
      </CohostProvider>
    );

    expect(screen.getByText('Connected')).toBeInTheDocument();
  });
});
