import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import Results from './Results';
import { GameProvider } from '../context/GameContext';

// Mock Supabase - create a mock function that we can control
const mockRpc = jest.fn(() => Promise.resolve({ data: [], error: null }));

jest.mock('../lib/supabase', () => ({
  supabase: {
    rpc: (...args) => mockRpc(...args),
  },
}));

// Mock confetti
jest.mock('canvas-confetti', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe('Results', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    mockRpc.mockResolvedValue({ data: [], error: null });
    mockRpc.mockClear();
  });

  const renderResults = () => {
    return render(
      <BrowserRouter>
        <GameProvider>
          <Results />
        </GameProvider>
      </BrowserRouter>
    );
  };

  test('renders without throwing', () => {
    expect(() => renderResults()).not.toThrow();
  });

  test('displays main heading/title content', () => {
    renderResults();
    // The component displays the playte logo and restaurant name as the main heading/title
    // Check for the logo (visual heading) and restaurant name text
    const logo = screen.getByAltText('playte');
    expect(logo).toBeInTheDocument();
    
    // Restaurant name or default text serves as the subtitle/heading
    const restaurantText = screen.getByText(/your restaurant/i);
    expect(restaurantText).toBeInTheDocument();
  });

  test('renders dishes in order and highlights the winner', async () => {
    // Arrange: Mock data with 3 dishes where one is clearly the winner (rank 1)
    const mockDishes = [
      {
        dish_id: 'dish-1',
        dish_name: 'Pizza',
        rank_order: 1,
        total_points: 25,
        ballot_count: 5,
      },
      {
        dish_id: 'dish-2',
        dish_name: 'Burger',
        rank_order: 2,
        total_points: 20,
        ballot_count: 5,
      },
      {
        dish_id: 'dish-3',
        dish_name: 'Salad',
        rank_order: 3,
        total_points: 15,
        ballot_count: 5,
      },
    ];

    // Mock Supabase to return the test data
    mockRpc.mockResolvedValueOnce({
      data: mockDishes,
      error: null,
    });

    // Act: Render the Results component with search params to provide room ID
    render(
      <MemoryRouter initialEntries={['/results?game=test-room-id']}>
        <GameProvider>
          <Results />
        </GameProvider>
      </MemoryRouter>
    );

    // Wait for loading to complete first (using real timers for async operations)
    await waitFor(
      () => {
        expect(screen.queryByText(/loading results/i)).not.toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // Wait for dishes to appear and animations to complete
    // Each dish animates in with a 600ms delay, so wait for all to be visible
    // The last dish (rank 3) will appear after 2 * 600ms = 1200ms
    await waitFor(
      () => {
        expect(screen.getByText(/Pizza/i)).toBeInTheDocument();
        expect(screen.getByText(/Burger/i)).toBeInTheDocument();
        expect(screen.getByText(/Salad/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Wait for winner styling to appear (winner becomes visible after its animation)
    // Winner (rank 1) appears last in the animation (index === results.length - 1)
    // So it appears after 2 * 600ms = 1200ms
    await waitFor(
      () => {
        const winnerDishName = screen.getByText('Pizza');
        const winnerContainer = winnerDishName.closest('div[class*="rounded-2xl"]');
        expect(winnerContainer).toHaveClass('from-yellow-200');
      },
      { timeout: 2000 }
    );

    // Assert: All dish names appear on screen
    expect(screen.getByText('Pizza')).toBeInTheDocument();
    expect(screen.getByText('Burger')).toBeInTheDocument();
    expect(screen.getByText('Salad')).toBeInTheDocument();

    // Assert: The winner dish (rank 1) is visually distinguished
    // Find the winner by looking for the dish name and checking its parent container
    const winnerDishName = screen.getByText('Pizza');
    const winnerContainer = winnerDishName.closest('div[class*="rounded-2xl"]');
    expect(winnerContainer).toBeInTheDocument();
    
    // Check for winner styling classes
    expect(winnerContainer).toHaveClass('from-yellow-200');
    expect(winnerContainer).toHaveClass('border-yellow-300');
    expect(winnerContainer).toHaveClass('shadow-lg');

    // Non-winners should have the regular background
    const secondPlaceName = screen.getByText('Burger');
    const secondPlaceContainer = secondPlaceName.closest('div[class*="rounded-2xl"]');
    const thirdPlaceName = screen.getByText('Salad');
    const thirdPlaceContainer = thirdPlaceName.closest('div[class*="rounded-2xl"]');
    
    expect(secondPlaceContainer).toBeInTheDocument();
    expect(thirdPlaceContainer).toBeInTheDocument();
    
    // Non-winners should NOT have winner classes
    expect(secondPlaceContainer).not.toHaveClass('from-yellow-200');
    expect(thirdPlaceContainer).not.toHaveClass('from-yellow-200');

    // Assert: The list is in the correct order (winner first, then second, etc.)
    // Get all list items and check their order
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);

    // Check that rank numbers appear in order
    const rankNumbers = listItems.map((item) => {
      const rankText = item.textContent.match(/#\s*(\d+)/);
      return rankText ? parseInt(rankText[1], 10) : null;
    });

    expect(rankNumbers).toEqual([1, 2, 3]);

    // Verify the dish names appear in the correct order
    const dishNames = listItems.map((item) => item.textContent);
    expect(dishNames[0]).toContain('Pizza'); // Winner first
    expect(dishNames[1]).toContain('Burger'); // Second place
    expect(dishNames[2]).toContain('Salad'); // Third place
  });
});

