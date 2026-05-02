import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  test('renders the editorial heading and the default shortlist names', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { level: 1, name: /baby\s+names/i })
    ).toBeInTheDocument();

    for (const name of ['Gregory', 'Meghann', 'Anna', 'Cora']) {
      expect(screen.getAllByText(name).length).toBeGreaterThan(0);
    }
  });

  test('renders the curated tabs and filter controls', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /vintage revival/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^boys$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^girls$/i })).toBeInTheDocument();
  });
});
