import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import DishEntry from './DishEntry';
import { GameProvider } from '../context/GameContext';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('DishEntry', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderDishEntry = () => {
    return render(
      <BrowserRouter>
        <GameProvider>
          <DishEntry />
        </GameProvider>
      </BrowserRouter>
    );
  };

  test('renders without throwing', () => {
    expect(() => renderDishEntry()).not.toThrow();
  });

  test('displays main heading', () => {
    renderDishEntry();
    const heading = screen.getByText(/what did you order\?/i);
    expect(heading).toBeInTheDocument();
  });

  test('displays input field and add button', () => {
    renderDishEntry();
    const input = screen.getByPlaceholderText(/add a dish/i);
    const addButton = screen.getByRole('button', { name: /\+ add/i });
    
    expect(input).toBeInTheDocument();
    expect(addButton).toBeInTheDocument();
    expect(addButton).toBeDisabled(); // Should be disabled when input is empty
  });

  test('shows initial progress message', () => {
    renderDishEntry();
    const progressMessage = screen.getByText(/minimum 4 dishes/i);
    expect(progressMessage).toBeInTheDocument();
  });

  test('enables add button when input has text', async () => {
    renderDishEntry();
    
    const input = screen.getByPlaceholderText(/add a dish/i);
    const addButton = screen.getByRole('button', { name: /\+ add/i });
    
    expect(addButton).toBeDisabled();
    
    await userEvent.type(input, 'Pizza');
    expect(addButton).toBeEnabled();
  });

  test('adds dish when clicking add button', async () => {
    renderDishEntry();
    
    const input = screen.getByPlaceholderText(/add a dish/i);
    const addButton = screen.getByRole('button', { name: /\+ add/i });
    
    await userEvent.type(input, 'Pizza');
    await userEvent.click(addButton);
    
    // Dish should appear as a pill
    expect(screen.getByText('Pizza')).toBeInTheDocument();
    // Input should be cleared
    expect(input).toHaveValue('');
    // Progress message should update
    expect(screen.getByText(/1 added - 3 more to go!/i)).toBeInTheDocument();
  });

  test('adds dish when pressing Enter', async () => {
    renderDishEntry();
    
    const input = screen.getByPlaceholderText(/add a dish/i);
    
    await userEvent.type(input, 'Burger{Enter}');
    
    // Dish should appear
    expect(screen.getByText('Burger')).toBeInTheDocument();
    // Input should be cleared
    expect(input).toHaveValue('');
  });

  test('prevents adding duplicate dishes (case-insensitive)', async () => {
    renderDishEntry();
    
    const input = screen.getByPlaceholderText(/add a dish/i);
    const addButton = screen.getByRole('button', { name: /\+ add/i });
    
    // Add first dish
    await userEvent.type(input, 'Pizza');
    await userEvent.click(addButton);
    
    // Try to add duplicate (different case)
    await userEvent.type(input, 'pizza');
    await userEvent.click(addButton);
    
    // Should show duplicate message
    await waitFor(() => {
      expect(screen.getByText(/item already added/i)).toBeInTheDocument();
    });
    
    // Should still only have one Pizza dish
    const pizzaDishes = screen.getAllByText('Pizza');
    expect(pizzaDishes).toHaveLength(1);
  });

  test('removes dish when clicking remove button', async () => {
    renderDishEntry();
    
    const input = screen.getByPlaceholderText(/add a dish/i);
    const addButton = screen.getByRole('button', { name: /\+ add/i });
    
    // Add a dish
    await userEvent.type(input, 'Pizza');
    await userEvent.click(addButton);
    
    expect(screen.getByText('Pizza')).toBeInTheDocument();
    
    // Remove the dish
    const removeButton = screen.getByRole('button', { name: /×/i });
    await userEvent.click(removeButton);
    
    // Dish should be removed
    expect(screen.queryByText('Pizza')).not.toBeInTheDocument();
    // Progress message should reset
    expect(screen.getByText(/minimum 4 dishes/i)).toBeInTheDocument();
  });

  test('next button is disabled until 4 dishes are added', async () => {
    renderDishEntry();
    
    const input = screen.getByPlaceholderText(/add a dish/i);
    const addButton = screen.getByRole('button', { name: /\+ add/i });
    const nextButton = screen.getByRole('button', { name: /next/i });
    
    // Initially disabled
    expect(nextButton).toBeDisabled();
    
    // Add 3 dishes
    for (const dish of ['Pizza', 'Burger', 'Salad']) {
      await userEvent.type(input, dish);
      await userEvent.click(addButton);
    }
    
    // Still disabled with 3 dishes
    expect(nextButton).toBeDisabled();
    expect(screen.getByText(/3 added - 1 more to go!/i)).toBeInTheDocument();
    
    // Add 4th dish
    await userEvent.type(input, 'Pasta');
    await userEvent.click(addButton);
    
    // Now enabled
    expect(nextButton).toBeEnabled();
    expect(screen.getByText(/4 added - you can keep adding or continue/i)).toBeInTheDocument();
  });

  test('navigates to gatherAround when submitting with 4+ dishes', async () => {
    renderDishEntry();
    
    const input = screen.getByPlaceholderText(/add a dish/i);
    const addButton = screen.getByRole('button', { name: /\+ add/i });
    const nextButton = screen.getByRole('button', { name: /next/i });
    
    // Add 4 dishes
    for (const dish of ['Pizza', 'Burger', 'Salad', 'Pasta']) {
      await userEvent.type(input, dish);
      await userEvent.click(addButton);
    }
    
    // Submit form
    await userEvent.click(nextButton);
    
    // Should navigate to gatherAround
    expect(mockNavigate).toHaveBeenCalledWith('/gatherAround');
  });

  test('displays all added dishes as pills', async () => {
    renderDishEntry();
    
    const input = screen.getByPlaceholderText(/add a dish/i);
    const addButton = screen.getByRole('button', { name: /\+ add/i });
    
    const dishesToAdd = ['Pizza', 'Burger', 'Salad', 'Pasta', 'Soup'];
    
    for (const dish of dishesToAdd) {
      await userEvent.type(input, dish);
      await userEvent.click(addButton);
    }
    
    // All dishes should be visible as pills
    dishesToAdd.forEach(dish => {
      expect(screen.getByText(dish)).toBeInTheDocument();
    });
    
    // Each dish should have a remove button
    const removeButtons = screen.getAllByRole('button', { name: /×/i });
    expect(removeButtons).toHaveLength(dishesToAdd.length);
  });

  test('updates progress message as dishes are added', async () => {
    renderDishEntry();
    
    const input = screen.getByPlaceholderText(/add a dish/i);
    const addButton = screen.getByRole('button', { name: /\+ add/i });
    
    // Initially shows "minimum 4 dishes"
    expect(screen.getByText(/minimum 4 dishes/i)).toBeInTheDocument();
    
    // Add 1 dish
    await userEvent.type(input, 'Pizza');
    await userEvent.click(addButton);
    expect(screen.getByText(/1 added - 3 more to go!/i)).toBeInTheDocument();
    
    // Add 2nd dish
    await userEvent.type(input, 'Burger');
    await userEvent.click(addButton);
    expect(screen.getByText(/2 added - 2 more to go!/i)).toBeInTheDocument();
    
    // Add 3rd dish
    await userEvent.type(input, 'Salad');
    await userEvent.click(addButton);
    expect(screen.getByText(/3 added - 1 more to go!/i)).toBeInTheDocument();
    
    // Add 4th dish
    await userEvent.type(input, 'Pasta');
    await userEvent.click(addButton);
    expect(screen.getByText(/4 added - you can keep adding or continue/i)).toBeInTheDocument();
  });
});

