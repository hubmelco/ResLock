import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the app', () => {
  render(<App />);
  // This is just a random text that happens to be in one of the pages as a smoke test. (log in page)
  const linkElement = screen.getByText(/log in/i);
  expect(linkElement).toBeInTheDocument();
});
