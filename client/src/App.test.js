import { render, screen } from '@testing-library/react';
import App from './App';

test('renders GameAsset Marketplace application header or branding', () => {
  render(<App />);
  const brandElements = screen.getAllByText(/GameAsset|Khám phá|MARKETPLACE/i);
  expect(brandElements.length).toBeGreaterThan(0);
});
