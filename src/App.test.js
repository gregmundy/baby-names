import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  test('Renders App component without errors', () => {
    render(<App />);
    expect(screen.queryByText(/Baby Names!/)).toBeInTheDocument();
  });
});

